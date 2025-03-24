from django.shortcuts import render
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.mixins import ListModelMixin
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.viewsets import GenericViewSet, ModelViewSet

from jobs.filters import CustomOrderingFilterJobs
from jobs.models import Job, JobCategory
from jobs.serializers import JobListSerializer, JobCategorySerializer, JobManagementSerializer
from users.permissions import IsOwner, IsInspector
from utils.utils import PermissionClassByActionMixin, SerializerClassByActionMixin, user_is_inspector
from utils.utils.pagination import CustomPageSizePagination


# Create your views here.

class JobCategoryListViewSet(GenericViewSet, ListModelMixin):
    queryset = JobCategory.objects.all()
    serializer_class = JobCategorySerializer
    filter_backends = [SearchFilter]
    pagination_class = None
    search_fields = ['name', 'description']


class JobViewSet(
    PermissionClassByActionMixin,
    SerializerClassByActionMixin,
    ModelViewSet
):
    queryset = Job.objects.all()
    pagination_class = CustomPageSizePagination
    filter_backends = [SearchFilter, OrderingFilter, CustomOrderingFilterJobs]
    search_fields = ['name', 'description']
    ordering_fields = ['title', 'created', 'status', 'views', 'bids']
    action_permissions = {
        'retrieve': [IsInspector, IsOwner],
        'list': [IsInspector, IsOwner],
        'create': [IsOwner],
    }
    action_serializers = {
        'list': JobListSerializer,
        'retrieve': JobListSerializer,
        'create': JobManagementSerializer,
    }

    def get_queryset(self):
        user = self.request.user
        jobs = super().get_queryset()
        if user_is_inspector(user):
            active_jobs = jobs.filter(active=True)
            return active_jobs
        return jobs.filter(created_by=user.owner)





