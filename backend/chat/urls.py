from django.urls import path, include
from rest_framework.routers import DefaultRouter
from django.views.decorators.csrf import csrf_exempt

from chat import webhooks
from chat.viewsets import ConversationsView

router = DefaultRouter()

router.register("", ConversationsView, basename="conversation")
urlpatterns = [
    path('webhook/', csrf_exempt(webhooks.TwilioWebhookAPIView.as_view()), name='webhook'),
    path("", include(router.urls)),
]

