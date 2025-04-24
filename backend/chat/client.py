from django.db.models import Count
from twilio.base.exceptions import TwilioRestException
from twilio.jwt.access_token import AccessToken
from twilio.jwt.access_token.grants import ChatGrant, VideoGrant
from twilio.rest import Client
from django.conf import settings
from django.db import transaction

from chat.models import TwilioUserToken, Conversation
from notifications.models import Notification
from utils.utils import send_notifications, user_is_inspector


class TwilioClient:

    def __init__(self):
        self.twilio_client = Client(
            settings.TWILIO_API_KEY_SID,
            settings.TWILIO_API_KEY_SECRET,
            account_sid=settings.TWILIO_ACCOUNT_SID
        )


    def create_or_update_user_token(self, user, conversation):
        identity = user.id
        token = AccessToken(
            settings.TWILIO_ACCOUNT_SID,
            settings.TWILIO_API_KEY_SID,
            settings.TWILIO_API_KEY_SECRET,
            identity=identity,
            ttl=86400
        )
        token.add_grant(ChatGrant(service_sid=conversation.chat_service_sid))
        obj, created = TwilioUserToken.objects.get_or_create(user_id=user.id)
        # access_token_str = token.to_jwt().decode()
        access_token_str = token.to_jwt()
        obj.access_token = access_token_str
        obj.save()
        return access_token_str

    def add_twilio_participants(self, participants, *, twilio_conversation=None, conversation_sid=None):
        twilio_conversation = twilio_conversation or self.twilio_client.conversations.v1.conversations.get(conversation_sid)
        # Add participants to the Twilio conversation
        for participant in participants:
            try:
                # It fails when the participant is not included in the conversation
                twilio_conversation.participants(str(participant.id)).fetch()
            except:
                twilio_conversation.participants.create(identity=str(participant.id))
                
    @transaction.atomic
    def get_or_create_conversation(self, user, counterpart):
        """
        Get or create a conversation between two users.

        :param user: The first user.
        :param counterpart: The second user.
        :return: The created or retrieved conversation.
        """
        chat = Conversation.objects.filter(participants=user).filter(participants=counterpart).first()
        if not chat:
            chat = Conversation.objects.create()
            chat.participants.add(user)
            chat.participants.add(counterpart)
            chat.save()
            if user_is_inspector(counterpart):
                if counterpart.inspector and counterpart.inspector.notify_new_message:
                    send_notifications(
                        users=[counterpart],
                        title=f'New Chat Created - {user.get_full_name()}',
                        description=f'New chat from {user.get_full_name()}',
                        extra_data={
                            'chat_id': chat.id,
                        },
                        n_type=Notification.NotificationType.NEW_MESSAGE,
                        channel=Notification.NotificationChannel.EMAIL,
                    )
            else:
                send_notifications(
                    users=[counterpart],
                    title=f'New Chat Created - {user.get_full_name()}',
                    description=f'New chat from {user.get_full_name()}',
                    extra_data={
                        'chat_id': chat.id,
                    },
                    n_type=Notification.NotificationType.NEW_MESSAGE,
                    channel=Notification.NotificationChannel.EMAIL,
                )
        if not chat.conversation_sid:
            friendly_name = f'{user.id}_{counterpart.id}'
            conversation = self.twilio_client.conversations.v1.conversations.create(friendly_name=friendly_name)
            chat.chat_service_sid = conversation.chat_service_sid
            conversation.participants.create(identity=user.id)
            conversation.participants.create(identity=counterpart.id)
            chat.conversation_sid = conversation.sid
            chat.friendly_name = conversation.friendly_name
            chat.save()
        else:
            conversation = self.twilio_client.conversations.v1.conversations.get(chat.conversation_sid)
        chat.conversation = conversation
        token = self.create_or_update_user_token(user, chat)
        self.create_or_update_user_token(counterpart, chat)
        return chat, token


    @transaction.atomic
    def create_group_conversation(self, participants, friendly_name=None, is_a_group=False, description=None, group_photo=None, created_by=None):
        # TODO: Make get_create_conversation better
        chat = None
        if not is_a_group:
            chat = Conversation.objects \
                .filter(participants=participants[0],is_a_group=False) \
                .filter(participants=participants[1]) \
                .first()
        if is_a_group or not chat:
            chat = Conversation.objects.create(
                description=description,
                is_a_group=is_a_group,
                group_photo=group_photo,
                friendly_name=friendly_name,
                created_by=created_by,
            )
            for participant in participants:
                chat.participants.add(participant)

        if not chat.conversation_sid:

            conversation = self.twilio_client.conversations.v1.conversations.create(friendly_name=friendly_name)
            chat.conversation_sid = conversation.sid
            chat.chat_service_sid = conversation.chat_service_sid
            chat.save()

            self.add_twilio_participants(participants, twilio_conversation=conversation)

        else:
            conversation = self.twilio_client.conversations.v1.conversations.get(chat.conversation_sid)
        chat.conversation = conversation
        for participant in participants:
            self.create_or_update_user_token(participant, chat)
        return chat

    def check_user_conversations(self, user):
        # Function to check all the conversations of a user to get the last message and check if has unread messages
        conversations = Conversation.objects.filter(participants=user)
        for conversation in conversations:
            conv = self.twilio_client.conversations.v1.conversations.get(conversation.conversation_sid)
            if len(conv.messages.list()) > 0:
                last_message = conv.messages.list()[-1]
                # TODO: need a better way to check if the message is unread and to get the last message
                if last_message.index != conversation.last_message_index:
                    if last_message.body is not None:
                        conversation.last_message = last_message.body
                    elif last_message.media is not None:
                        conversation.last_message = last_message.media[0].get("content_type").replace("/", ".")
                    
                    conversation.last_message_index = last_message.index
                    conversation.save()

    def unread_messages_count(self, user, conversation):
        try:
            user_conv = self.twilio_client.conversations.v1.users(user.id).user_conversations(
                conversation.conversation_sid).fetch()

            # If unread_messages_count is available, return it
            if user_conv.unread_messages_count is not None and user_conv.unread_messages_count > 0:
                return user_conv.unread_messages_count
            elif user_conv.unread_messages_count is None:
                # If unread_messages_count is None, fetch and count all messages in the conversation
                messages = self.twilio_client.conversations.v1.conversations(conversation.conversation_sid).messages.list()
                if not messages:
                    return 0
                return len(messages)  # Return the total number of messages
        except Exception as e:
            print(f"Error fetching user conversation: {e}")

        # Default to 0 if there's an error or no messages
        return 0