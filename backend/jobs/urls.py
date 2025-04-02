


from django.urls import path, include
from rest_framework.routers import DefaultRouter

from jobs.views import JobViewSet, BidViewSet

app_name = 'jobs'

router = DefaultRouter()
router.register('bids', BidViewSet, basename='bids')
router.register('', JobViewSet, basename='jobs')

urlpatterns = [
    path('', include(router.urls)),
]