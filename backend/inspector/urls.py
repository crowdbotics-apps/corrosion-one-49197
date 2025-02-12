from rest_framework.routers import DefaultRouter

from inspector.views import CredentialsViewSet, InspectorViewSet, CountryViewSet, StateViewSet

router = DefaultRouter()

router.register('credential', CredentialsViewSet, basename="credential")
router.register('country', CountryViewSet, basename="country")
router.register('state', StateViewSet, basename="state")

router.register('', InspectorViewSet, basename="")


urlpatterns = router.urls