from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from django.db.models import Q
from rest_framework.decorators import authentication_classes, permission_classes, parser_classes
import json

from utils.utils import send_notifications
from .models import Conversation

User = get_user_model()

@authentication_classes([])
@permission_classes([])
class TwilioWebhookAPIView(APIView):

    def post(self, request):
        try:
            payload = request.data
            if request.headers['X-Twilio-Signature']:
                if payload['EventType']:
                    if payload['EventType'] == 'onMessageAdded':
                        conversation_id = payload['ConversationSid']
                        conversation: 'Conversation' = Conversation.objects.filter(conversation_sid = conversation_id).first()
                        participants = conversation.participants.all()
                        author_message = User.objects.filter(Q(username=payload['Author']) | Q(id=payload['Author'])).first()
                        other_participants = participants.exclude(id=author_message.id)
                        for participant in other_participants:
                            # Increase unread message counter
                            conversation.increase_unread_message_count(participant, 1)
                            
                            # Update conversation last message
                            if "Body" in payload:
                                conversation.last_message = payload['Body']
                            elif "Media" in payload:
                                media_type = json.loads(payload["Media"])[0].get("ContentType").replace("/", ".")
                                conversation.last_message = media_type
                            conversation.save()


                        # Sent message notification to other participants
                        send_notifications(
                            users=list(other_participants),
                            title=author_message.name,
                            description='Sent you a message',
                            extra_data={"message": True, "sender_id": author_message.id, "counterpart_id": participant.id, "chat_id": conversation.id},
                            from_user=author_message
                        )
                return Response({}, status=200)
            else:
                return Response({'error':'No credentials'}, status=403)
        except Exception as e:
            return Response({'error': str(e)}, status=400)