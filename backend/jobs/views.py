from django.shortcuts import render
from rest_framework.decorators import action
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.mixins import ListModelMixin
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.status import HTTP_400_BAD_REQUEST, HTTP_404_NOT_FOUND
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
    search_fields = ['title', 'description', 'status']
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

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        user = self.request.user
        if user_is_inspector(user):
            return Response('Invalid action', status=HTTP_400_BAD_REQUEST)
        job = Job.objects.filter(pk=pk, created_by=user.owner).first()
        if not job:
            return Response(status=HTTP_404_NOT_FOUND)
        if job.status == Job.JobStatus.CANCELED:
            return Response('Job already canceled', status=HTTP_400_BAD_REQUEST)
        job.status = Job.JobStatus.CANCELED
        job.active = False
        job.save()
        return Response()





