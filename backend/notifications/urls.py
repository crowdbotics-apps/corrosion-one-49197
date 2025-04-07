from django.urls import path, include
from rest_framework.routers import DefaultRouter

from notifications.views import NotificationsView

# Create a router and register our viewsets with it.
router = DefaultRouter()

# Register the SetDeviceViewset with the router.
# router.register("set-device", SetDeviceViewset, basename="set-device")

# Register the NotificationsView with the router.
router.register("", NotificationsView, basename="notifications")

# The API URLs are now determined automatically by the router.
urlpatterns = [
    # Include the router URLs in the urlpatterns.
    path("", include(router.urls)),
]