from rest_framework.routers import DefaultRouter

from inspector.views import CredentialsViewSet

router = DefaultRouter()

router.register('credential', CredentialsViewSet, basename="credential")
# router.register('', OwnerViewSet, basename="")


urlpatterns = router.urls