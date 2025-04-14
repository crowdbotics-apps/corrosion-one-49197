from rest_framework import serializers

from notifications.models import Notification


class NotificationSerializer(serializers.ModelSerializer):
    """
    Serializer for the Notification model.
    """
    from_user = serializers.SerializerMethodField()

    class Meta:
        """
        Meta options for the NotificationSerializer.
        """
        model = Notification
        fields = ['id', 'from_user', 'title', 'description', 'timestamp', 'sent', 'is_read']

    def get_from_user(self, obj):
        """
        Get the full name or username of the user who sent the notification.

        Args:
            obj (Notification): The notification instance.

        Returns:
            str: The full name or username of the user.
        """
        from_user = obj.from_user
        if not from_user:
            return '-'
        return from_user.get_full_name() if (from_user.first_name and from_user.last_name) else from_user.username
