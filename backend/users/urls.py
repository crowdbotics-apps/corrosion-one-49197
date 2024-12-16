from django.urls import path, include
from django.views.generic import TemplateView
from rest_framework.routers import DefaultRouter

from users.views import PasswordViewset, UserViewSet, DynamicRedirectView

app_name = "users2"
router = DefaultRouter()
router.register("users", UserViewSet, basename="users")
router.register("password", PasswordViewset, basename="password")

urlpatterns = [
    path("", include(router.urls)),
    path('redirect/<slug:slug>/', DynamicRedirectView.as_view(), name='dynamic_redirect'),
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
