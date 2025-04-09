from django.contrib.auth import get_user_model
from rest_framework import status, viewsets, filters
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from jobs.models import Job
from notifications.models import Notification
from chat.serializers import ConversationListSerializer, ReportMessageSerializer, BlockUserSerializer, \
    UnblockUserSerializer, ChatMediaSerializer
from chat.client import TwilioClient
from chat.models import TwilioUserToken, Conversation, ChatMedia
from owner.models import Owner
from users.serializers import UserDetailSerializer
from utils.utils import CollectedMultipartJsonViewMixin, send_notifications, SerializerClassByActionMixin
from utils.utils.pagination import CustomPageSizePagination


class ConversationsView(
    SerializerClassByActionMixin,
    CollectedMultipartJsonViewMixin,
    viewsets.ModelViewSet
):
    filter_backends = [filters.SearchFilter]
    search_fields = ['participants__email', 'participants__first_name', 'participants__last_name']
    queryset = Conversation.objects.all()
    serializer_class = ConversationListSerializer
    pagination_class = None
    action_serializers = {
        'report': ReportMessageSerializer,
        'block': BlockUserSerializer,
        'unblock': UnblockUserSerializer,
    }

    def get_queryset(self):
        user = self.request.user
        queryset = super().get_queryset().filter(participants=user).order_by('-updated_at')
        return queryset

    def retrieve(self, request, *args, **kwargs):
        user = request.user
        instance: 'Conversation' = self.get_object()
        instance.set_unread_message_count(user, 0)
        serializer = self.get_serializer(instance)
        client = TwilioClient()
        client.create_or_update_user_token(user, instance)
        twillio_user = TwilioUserToken.objects.get(user=user)
        response_data = dict(chat=serializer.data, token=twillio_user.access_token)
        return Response(
            response_data,
            status=status.HTTP_200_OK
        )

    def update(self, request, *args, **kwargs):
        conversation = self.get_object()
        participant_ids = request.data.pop('participants', None)

        if conversation.is_a_group:
            users = User.objects.filter(id__in=participant_ids)
            client = TwilioClient()
            client.add_twilio_participants(users, conversation_sid=conversation.conversation_sid)
            for user in users:
                client.create_or_update_user_token(user, conversation)
            conversation.participants.set(participant_ids)

        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        """
        Only client users can delete groups, everyone can delete a chat p2p.
        """
        conversation: 'Conversation' = self.get_object()
        if conversation.is_a_group and conversation.admin_user.id != request.user.id:
            raise ValidationError('You cannot delete the group')

        return super().destroy(request, *args, **kwargs)

    @action(detail=True, methods=['post'])
    def leave(self, request, pk=None):
        conversation: 'Conversation' = self.get_object()
        participant_id = request.data.get('participant', request.user.id)
        
        if participant_id == request.user.id and request.user == conversation.created_by:
            raise ValidationError({ 'participant': 'The client cannot leave the group' })
        
        if (participant := conversation.participants.get(id=participant_id)) is not None:
            # Remove participant
            conversation.participants.remove(participant)
        else:
            raise ValidationError({ 'participant': 'This field is not valid' })

        return Response()

    @action(detail=False, methods=['post'])
    def report(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = request.user
        conversation = Conversation.objects.get(id=serializer.data['conversation'], participants__user=user)

        conversation.reported_messages.create(
            message=serializer.data['message'],
            reported_by=user,
        )
        return Response()

    @action(detail=False, methods=['post'])
    def block(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = request.user
        blocked_user = User.objects.get(id=serializer.data['blocked_user'])
        user.blocked_users.create(blocked_user=blocked_user)
        return Response()

    @action(detail=False, methods=['post'])
    def unblock(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = request.user
        blocked_user = User.objects.get(id=serializer.data['blocked_user'])
        user.blocked_users.filter(blocked_user=blocked_user).delete()
        return Response()

    @action(detail=True, methods=['get'])
    def no_member_users(self, request, pk=None):
        conversation = self.get_object()
        user = request.user
        all_users = User.objects.filter(
            is_active=True,
            is_staff=False,
            is_superuser=False,
            profile_setup_completed=True,
            # user_type=User.UserType.CONTRACTOR,
        ).exclude(id=user.id)

        participant_ids = conversation.participants.values_list('id', flat=True)
        filtered_users = all_users  # self.filter_queryset(all_users).exclude()
        
        serialized_users = UserDetailSerializer(
            filtered_users,
            many=True,
            context={"request": request}
        ).data
        users_data = [
            { **user, 'is_participant': user.get('id') in participant_ids } 
            for user in serialized_users
        ]

        page = self.paginate_queryset(users_data)
        if page is not None:
            return self.get_paginated_response(page)

        return Response(users_data)

    @action(detail=False, methods=['get'], url_path='unread-total-messages')
    def unread_total_messages(self, request):
        user = request.user
        conversations = Conversation.objects.filter(participants=user).all()
        number_off_messages = 0
        client = TwilioClient()
        for conversation in conversations:
            number_off_messages += client.unread_messages_count(user, conversation)

        return Response({"number_of_messages": number_off_messages})

    @action(detail=False, methods=['post'], url_path='start-chat')
    def get_create_chat(self, request):
        """
        Create a new chat media
        """
        user = request.user
        job_id = request.data.get('job_id', None)
        if not job_id:
            raise ValidationError('job_id is required')
        job = Job.objects.get(id=job_id)
        client = TwilioClient()
        chat, token = client.get_or_create_conversation(user, job.created_by.user)


        data = {
            "id": chat.id,
            "conversation_sid": chat.conversation_sid,
            "token": token,
        }

        return Response(data)


User = get_user_model()


class SaveMediaView(CollectedMultipartJsonViewMixin, viewsets.ModelViewSet):
    """
    ViewSet for managing licenses logged hours
    """
    queryset = ChatMedia.objects.all()
    serializer_class = ChatMediaSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = None

