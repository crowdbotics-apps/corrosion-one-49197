


from django.urls import path, include
from rest_framework.routers import DefaultRouter

from jobs.views import JobViewSet, JobCategoryListViewSet, BidViewSet

app_name = 'jobs'

router = DefaultRouter()

router.register('categories', JobCategoryListViewSet, basename='categories')
router.register('bids', BidViewSet, basename='bids')
router.register('', JobViewSet, basename='jobs')

urlpatterns = [
    path('', include(router.urls)),
]