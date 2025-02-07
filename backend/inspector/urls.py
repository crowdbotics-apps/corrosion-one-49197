from rest_framework.routers import DefaultRouter

from inspector.views import CredentialsViewSet, InspectorViewSet, CountryViewSet, StateViewSet, CityViewSet

router = DefaultRouter()

router.register('credential', CredentialsViewSet, basename="credential")
router.register('country', CountryViewSet, basename="country")
router.register('state', StateViewSet, basename="state")
router.register('city', CityViewSet, basename="city")

router.register('', InspectorViewSet, basename="")


urlpatterns = router.urls