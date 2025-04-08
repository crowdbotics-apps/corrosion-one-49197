from datetime import timedelta, datetime

from django.contrib.auth import get_user_model
from rest_framework import serializers
from django.utils import timezone

from chat.client import TwilioClient
from chat.models import BlockedUser, Conversation, TwilioUserToken, ChatMedia
from corrosion_one_49197.redis_cache import redis_get_last_activity
from users.serializers import UserDetailSerializer
from utils.utils import SmartUpdatableImageField, user_is_inspector

User = get_user_model()


class ConversationSerializer(serializers.ModelSerializer):

    class Meta:
        model = Conversation
        fields = ['id', 'conversation_sid', 'created_at', 'participants', 'created_by']

def get_conunterpart_function(obj, user):
    conversation_participants = obj.participants.exclude(id=user.id).all()
    return list(conversation_participants)

def get_last_activity_function(obj, user):
    counterparts = get_conunterpart_function(obj, user)
    user_id = (counterparts[0] if len(counterparts) > 0 else user).id
    last_activity = redis_get_last_activity(user_id)
    if not last_activity:
        last_activity = counterparts[0].last_activity
    else:
        last_activity = datetime.fromisoformat(last_activity)
    return last_activity


class ConversationListSerializer(serializers.ModelSerializer):
    counterpart_image = serializers.SerializerMethodField()
    counterpart_id = serializers.SerializerMethodField()
    counterpart_name = serializers.SerializerMethodField()
    is_active = serializers.SerializerMethodField()
    last_activity = serializers.SerializerMethodField()
    blocked = serializers.SerializerMethodField()
    unread_messages_count = serializers.SerializerMethodField()
    counterpart_blocked = serializers.SerializerMethodField()
    blocked_by_counterpart = serializers.SerializerMethodField()

    class Meta:
        model = Conversation
        fields = ['id', 'conversation_sid', 'counterpart_id', 'counterpart_image', 'counterpart_name',
                  'last_message', 'is_active', 'last_activity', 'blocked',
                  'description', 'friendly_name', 'unread_messages_count', 'blocked_by_counterpart',
                  'counterpart_blocked']

    def get_counterpart_image(self, obj):
        user = self.context['request'].user
        counterparts = get_conunterpart_function(obj, user)
        counterpart = counterparts[0]
        if user_is_inspector(counterpart):
            profile_picture = counterpart.inspector.profile_picture
        else:
            profile_picture = counterpart.owner.logo
        return profile_picture.url if profile_picture else None
    
    def get_counterpart_blocked(self, obj):
        user = self.context.get('request').user
        counterpart = get_conunterpart_function(obj, user)[0]
        return BlockedUser.objects.filter(
            user=user,
            blocked_user=counterpart
        ).exists()
    
    def get_blocked_by_counterpart(self, obj):
        user = self.context.get('request').user
        counterpart = get_conunterpart_function(obj, user)[0]
        return BlockedUser.objects.filter(
            user=counterpart,
            blocked_user=user
        ).exists()

    def get_counterpart_id(self, obj):
        user = self.context['request'].user
        counterparts = get_conunterpart_function(obj, user)
        return counterparts[0].id

    def get_counterpart_name(self, obj):
        user = self.context['request'].user
        counterparts = get_conunterpart_function(obj, user)
        return counterparts[0].get_full_name()

    def get_is_active(self, obj):
        user = self.context['request'].user
        last_activity = get_last_activity_function(obj, user)
        current_time = timezone.now()
        is_active = (current_time - last_activity) < timedelta(minutes=10)
        return is_active

    def get_last_activity(self, obj):
        user = self.context['request'].user
        last_activity = get_last_activity_function(obj, user)
        return last_activity

    def get_blocked(self, obj):
        user = self.context['request'].user
        counterparts = get_conunterpart_function(obj, user)
        blocked = user.blocked_users.filter(blocked_user=counterparts[0]).exists()
        return blocked

    def get_unread_messages_count(self, instance: 'Conversation'):
        user = self.context['request'].user
        # return instance.get_unread_message_count(user)
        client = TwilioClient()
        return client.unread_messages_count(user, instance)


class ReportMessageSerializer(serializers.Serializer):
    conversation = serializers.CharField()
    message = serializers.CharField(required=False)
    sid = serializers.CharField(required=False)

    def validate(self, attrs):
        conversation = Conversation.objects.filter(id=attrs['conversation']).first()
        if not conversation:
            raise serializers.ValidationError('Conversation not found')
        return attrs


class BlockUserSerializer(serializers.Serializer):
    blocked_user = serializers.CharField()

    def validate(self, attrs):
        blocked_user = User.objects.filter(pk=attrs['blocked_user']).first()
        user = self.context['request'].user
        if not blocked_user:
            raise serializers.ValidationError('User not found')
        blocked_obj = user.blocked_users.filter(blocked_user=blocked_user).first()
        if blocked_obj:
            raise serializers.ValidationError('User already blocked')
        return attrs


class UnblockUserSerializer(serializers.Serializer):
    blocked_user = serializers.CharField()

    def validate(self, attrs):
        blocked_user = User.objects.filter(pk=attrs['blocked_user']).first()
        user = self.context['request'].user
        if not blocked_user:
            raise serializers.ValidationError('User not found')
        blocked_obj = user.blocked_users.filter(blocked_user=blocked_user).first()
        if not blocked_obj:
            raise serializers.ValidationError('User is not blocked')
        return attrs


class ChatMediaSerializer(serializers.ModelSerializer):
    created_by = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = ChatMedia
        fields = ['id', 'created_by', 'media']
