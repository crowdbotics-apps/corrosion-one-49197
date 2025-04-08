from django.urls import path, re_path

from chat.consumers import ChatConsumer

websocket_urlpatterns = [
    re_path('chat/(?P<user_id>[0-9]+)/(?P<access_token>.+)/', ChatConsumer.as_asgi()),
]
