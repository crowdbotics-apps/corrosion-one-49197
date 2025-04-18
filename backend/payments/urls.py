from django.urls import path, include
from django.views.decorators.csrf import csrf_exempt
from rest_framework.routers import DefaultRouter

from payments import webhooks
from payments.views import StripeViewset, TransactionListViewset

# Initialize the default router
router = DefaultRouter()

# Register the StripeViewSet with the router
router.register("", StripeViewset, basename="stripe")
router.register("transactions", TransactionListViewset, basename="transactions")

# Define the URL patterns for the payments app
urlpatterns = [
    # Include the router URLs under the 'payments/' path
    path("", include(router.urls)),

    # Define the webhook URL and exempt it from CSRF verification
    path('webhook/', csrf_exempt(webhooks.StripeWebhookAPIView.as_view()), name='api.webhook'),
]
