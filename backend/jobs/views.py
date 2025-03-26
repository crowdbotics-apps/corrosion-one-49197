from django.db.models import ProtectedError, ObjectDoesNotExist
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
from jobs.serializers import JobListSerializer, JobCategorySerializer, JobManagementSerializer, JobDetailSerializer
from users.permissions import IsOwner, IsInspector
from utils.utils import PermissionClassByActionMixin, SerializerClassByActionMixin, user_is_inspector, \
    CollectedMultipartJsonViewMixin, may_fail
from utils.utils.pagination import CustomPageSizePagination


# Create your views here.

class JobCategoryListViewSet(GenericViewSet, ListModelMixin):
    queryset = JobCategory.objects.all()
    serializer_class = JobCategorySerializer
    filter_backends = [SearchFilter]
    pagination_class = None
    search_fields = ['name', 'description']


class JobViewSet(
    CollectedMultipartJsonViewMixin,
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
        'retrieve': JobDetailSerializer,
        'create': JobManagementSerializer,
    }

    def get_queryset(self):
        user = self.request.user
        jobs = super().get_queryset()
        query_params = self.request.query_params
        if query_params.get('dates', None):
            start_date, end_date = query_params.get('dates').split(',')
            jobs = jobs.filter(created__range=[start_date, end_date])
        if user_is_inspector(user):
            active_jobs = jobs.filter(active=True)
            return active_jobs

        return jobs.filter(created_by=user.owner)




    @may_fail(Job.DoesNotExist, 'Job not found')
    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        user = self.request.user
        if user_is_inspector(user):
            return Response('Invalid action', status=HTTP_400_BAD_REQUEST)
        job = Job.objects.get(pk=pk, created_by=user.owner)
        if job.status == Job.JobStatus.CANCELED:
            return Response('Job already canceled', status=HTTP_400_BAD_REQUEST)
        job.status = Job.JobStatus.CANCELED
        job.active = False
        job.save()
        return Response()

    @may_fail(Job.DoesNotExist, 'Job not found')
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        user = self.request.user
        if user_is_inspector(user):
            return Response('Invalid action', status=HTTP_400_BAD_REQUEST)
        job = instance
        if instance.bids.count() > 0:
            if job.status == Job.JobStatus.CANCELED:
                return Response('Job already canceled', status=HTTP_400_BAD_REQUEST)
            job.status = Job.JobStatus.CANCELED
            job.active = False
            job.save()
        else:
            self.perform_destroy(instance)
        return Response()


    @may_fail(Job.DoesNotExist, 'Job not found')
    @action(detail=True, methods=['post'])
    def viewed(self, request, pk=None):
        job = Job.objects.get(pk=pk)
        job.views += 1
        job.save()
        return Response()





