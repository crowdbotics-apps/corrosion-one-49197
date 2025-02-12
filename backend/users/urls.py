from django.urls import path, include
from django.views.generic import TemplateView
from rest_framework.routers import DefaultRouter

from users.views import UserViewSet

app_name = "users"
router = DefaultRouter()
router.register(r'', UserViewSet, basename="users")

urlpatterns = [
    path("", include(router.urls)),
    path('.well-known/apple-app-site-association', TemplateView.as_view(
        template_name='apple-auth/apple-app-site-association',
        content_type='application/json'
    )),
    path('apple-app-site-association', TemplateView.as_view(
        template_name='apple-auth/apple-app-site-association',
        content_type='application/json'
    )),
    path("", include(router.urls))
]
