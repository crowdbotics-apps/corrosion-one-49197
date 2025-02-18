from rest_framework.routers import DefaultRouter

from inspector.views import CredentialsViewSet, InspectorViewSet, CountryViewSet, StateViewSet, LanguageViewSet

router = DefaultRouter()

router.register('credential', CredentialsViewSet, basename="credential")
router.register('country', CountryViewSet, basename="country")
router.register('state', StateViewSet, basename="state")
router.register('language', LanguageViewSet, basename="language")

router.register('', InspectorViewSet, basename="")


urlpatterns = router.urls