# Django
from django.db import models
from django.contrib.auth import get_user_model
# Others
import logging
from datetime import datetime

from utils.utils.email import send_email_with_template

# from onesignal_client.client import OneSignalClient

User = get_user_model()
LOGGER = logging.getLogger('django')


class NotificationError(models.Model):
    """
    Model to store notification errors.
    """
    target = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    notification = models.ForeignKey("Notification", on_delete=models.CASCADE, null=True, blank=True,
                                     related_name="send_notification_errors")
    message = models.TextField(null=True)


class Notification(models.Model):
    """
    Model to represent notifications and handle their sending.
    """
    targets = models.ManyToManyField(User, blank=True,
                                     related_name="notifications_to_user")
    from_user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True,
                                  related_name="notifications_from_user")
    title = models.CharField(max_length=255)
    description = models.CharField(max_length=255)
    timestamp = models.DateTimeField(auto_now_add=True)
    sent_timestamp = models.DateTimeField(null=True)
    extra_data = models.TextField(null=True, blank=True)
    sent = models.BooleanField(default=False)
    is_read = models.BooleanField(default=False)

    class NotificationChannel(models.IntegerChoices):
        """
        Enum-like class for notification channels.
        """
        EMAIL = (1, 'EMAIL')
        SMS = (2, 'SMS')
        PUSH = (3, 'PUSH')

    channel = models.IntegerField(
        choices=NotificationChannel.choices,
        default=NotificationChannel.PUSH
    )

    class NotificationType(models.IntegerChoices):
        """
        Enum-like class for notification types.
        """
        DEFAULT = (1, 'DEFAULT')
        JOB_AVAILABLE = (2, 'JOB_AVAILABLE')
        NEW_BID = (3, 'NEW_BID')
        BID_ACCEPTED = (4, 'BID_ACCEPTED')
        BID_REJECTED = (5, 'BID_REJECTED')
        JOB_COMPLETED_BY_INSPECTOR = (6, 'JOB_COMPLETED_BY_INSPECTOR')
        JOB_COMPLETED = (7, 'JOB_COMPLETED')
        JOB_CANCELED = (8, 'JOB_CANCELED')
        NEW_MESSAGE = (9, 'NEW_MESSAGE')

    type = models.IntegerField(
        choices=NotificationType.choices,
        default=NotificationType.DEFAULT
    )

    def register_error(self, message, user):
        """
        Register an error for the notification.

        Args:
            message (str): The error message.
            user (User): The target user associated with the error.
        """
        NotificationError.objects.create(
            target=user,
            notification=self,
            message=message,
        )

    def send(self):
        """
        Send the notification to the specified users.

        Args:
            users (QuerySet or list): Users to whom the notification should be sent.
        """
        users = self.targets.all()
        if not isinstance(users, models.QuerySet) and not isinstance(users, list):
            users = [users]

        for user in users:

            send_email_with_template(
                subject=self.title,
                email=user.email,
                template_to_load='emails/admin_support_reply.html',
                context={
                    "title": self.title,
                    "username": user.first_name,
                    "description": self.description,
                }
            )
    def __str__(self):
        """
        Return a string representation of the notification.

        Returns:
            str: String representation of the notification.
        """
        from_user = self.from_user.name if self.from_user else ''
        return '{} - from {}'.format(self.id, from_user)

    class Meta:
        """
        Meta options for the Notification model.
        """
        verbose_name = 'Notification'
        verbose_name_plural = 'Notifications'
        ordering = ['-id']
