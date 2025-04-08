import uuid

from django.conf import settings
from django.contrib.auth import get_user_model
from django.db import models

def media_dir(instance, filename):
    return f'backend/media/{filename}'

def coversation_dir(instance, filename):
    return f'backend/media/conversation/{instance.id}/{filename}'


User = get_user_model()

def get_default_user():
    return User.objects.first().id

class ConversationParticipantDetail(models.Model):
    conversation: 'Conversation' = models.ForeignKey(
        'Conversation',
        related_name="participant_details",
        on_delete=models.CASCADE,
    )
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
    )
    unread_messages_count = models.PositiveIntegerField(default=0)


class Conversation(models.Model):
    conversation_sid = models.CharField(max_length=255, unique=True)
    chat_service_sid = models.CharField(max_length=255)
    friendly_name = models.CharField(max_length=200, default="")
    participants = models.ManyToManyField(User, related_name='conversations')
    last_message = models.TextField(blank=True)
    last_message_index = models.IntegerField(default=0)
    is_a_group = models.BooleanField(default=False)
    group_photo = models.ImageField(
        blank=True,
        null=True,
        upload_to=coversation_dir
    )
    description = models.CharField(max_length=512, blank=True, null=True)
    participant_details: 'models.Manager'

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    created_by = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="administrated_conversations",
        null=True,
        blank=True
    )

    @property
    def admin_user(self):
        return self.created_by if self.is_a_group else None #self.participants.filter(user_type=User.UserType.CLIENT).first() if self.is_a_group else None

    def get_unread_message_count(self, user):
        return self.participant_details \
            .filter(user=user) \
            .values_list('unread_messages_count', flat=True) \
            .first() or 0
    
    def set_unread_message_count(self, user, count):
        detail = self.participant_details.filter(user=user)
        if detail.exists():
            # Update detail count
            detail.update(unread_messages_count=count)
        else:
            # Create a new detail
            ConversationParticipantDetail.objects.create(
                conversation=self,
                user=user,
                unread_messages_count=count
            )

    def increase_unread_message_count(self, user, delta):
        next_count = self.get_unread_message_count(user) + delta
        self.set_unread_message_count(user, next_count)

    def __str__(self):
        return self.conversation_sid


class TwilioUserToken(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        models.CASCADE,
        related_name="twilio_chat_twiliousertoken",
        blank=True,
        null=True
    )
    access_token = models.TextField('accessToken')


class ReportedMessage(models.Model):
    sid = models.CharField(null=True, blank=True)
    reported_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reported_messages', null=True, blank=True)
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name='reported_messages')
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.message} - {self.conversation}'

    class Meta:
        ordering = ['-created_at']


class BlockedUser(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='blocked_users')
    blocked_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='blocked_by_users')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.user} - {self.blocked_user}'

    class Meta:
        ordering = ['-created_at']


class ChatMedia(models.Model):
    created_by = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='created_media', blank=True,
                                   null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    media = models.FileField('media', upload_to=media_dir, blank=True, null=True)
