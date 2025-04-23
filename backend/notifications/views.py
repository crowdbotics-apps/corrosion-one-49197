from rest_framework import viewsets, mixins
from rest_framework.decorators import action
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from notifications.models import Notification
from notifications.serializers import NotificationSerializer
# from onesignal_client.api.v1.serializers import UserIdPushTokenSerializer
# from onesignal_client.models import UserDevice
from utils.utils import may_fail
from utils.utils.pagination import CustomPageSizePagination


# class SetDeviceViewset(mixins.CreateModelMixin, viewsets.GenericViewSet):
#     """
#     A viewset for handling device registration and activation.
#     """
#     permission_classes = [IsAuthenticated]
#     serializer_class = UserIdPushTokenSerializer
#
#     def create(self, request, *args, **kwargs):
#         """
#         Handles the creation of a new device or updates an existing one.
#
#         Args:
#             request: The HTTP request object.
#             *args: Additional positional arguments.
#             **kwargs: Additional keyword arguments.
#
#         Returns:
#             Response: The HTTP response object.
#         """
#         user = self.request.user
#         serializer = self.get_serializer(data=request.data)
#         serializer.is_valid(raise_exception=True)
#         data = serializer.validated_data
#
#         if data['active']:
#             devices = UserDevice.objects.filter(device_id=data.get('id')).exclude(user=user)
#             if devices:
#                 for device in devices:
#                     device.active = False
#                     device.save()
#             UserDevice.activate_device(user, data.get('id'), data.get('token'))
#         else:
#             UserDevice.deactivate_all_devices(user)
#         return Response()


class NotificationsView(viewsets.ModelViewSet):
    """
    A ViewSet for handling notifications.
    """
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]
    queryset = Notification.objects.all()
    pagination_class = CustomPageSizePagination
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['title', 'description']
    ordering_fields = ['timestamp', 'is_read', 'title', 'description']

    def get_queryset(self):
        """
        Retrieves the queryset of notifications for the authenticated user.

        Returns:
            QuerySet: The filtered queryset of notifications.
        """
        user = self.request.user
        queryset = super().get_queryset().filter(targets__in=[user]).order_by('is_read', '-id')
        query_params = self.request.query_params
        if query_params.get('dates', None):
            start_date, end_date = query_params.get('dates').split(',')
            queryset = queryset.filter(timestamp__range=[start_date, end_date])
        return queryset

    @action(detail=True, methods=["POST"])
    @may_fail(Notification.DoesNotExist, 'Notification not found')
    def mark_as_read(self, request, pk=None):
        """
        Marks a notification as read.

        Args:
            request: The HTTP request object.
            pk: The primary key of the notification to mark as read.

        Returns:
            Response: The HTTP response object.
        """
        notification = self.queryset.get(id=pk)
        notification.is_read = True
        notification.save()
        return Response()