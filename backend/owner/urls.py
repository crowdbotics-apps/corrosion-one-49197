from rest_framework.routers import DefaultRouter

from owner.views import IndustryViewSet, OwnerViewSet

router = DefaultRouter()

router.register('industry', IndustryViewSet, basename="industry")
router.register('', OwnerViewSet, basename="")

urlpatterns = router.urls
