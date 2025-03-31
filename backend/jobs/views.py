from django.db.models import ProtectedError, ObjectDoesNotExist
from django.shortcuts import render
from rest_framework.decorators import action
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.mixins import ListModelMixin, CreateModelMixin, RetrieveModelMixin, DestroyModelMixin
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.status import HTTP_400_BAD_REQUEST, HTTP_404_NOT_FOUND
from rest_framework.viewsets import GenericViewSet, ModelViewSet

from jobs.filters import CustomOrderingFilterJobs, CustomOrderingFilterBids
from jobs.models import Job, JobCategory, Bid, JobFavorite
from jobs.serializers import JobListSerializer, JobCategorySerializer, JobManagementSerializer, JobDetailSerializer, \
    BidListSerializer, BidCreateSerializer, BidDetailSerializer
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
    search_fields = ['title', 'description', 'status', 'created_by__user__first_name', 'created_by__user__last_name']
    ordering_fields = ['title', 'created', 'status', 'views', 'bids']
    action_permissions = {
        'retrieve': [IsInspector, IsOwner],
        'list': [IsInspector, IsOwner],
        'create': [IsOwner],
        'partial_update': [IsOwner],
        'cancel': [IsOwner],
        'destroy': [IsOwner],
        'viewed': [IsInspector, IsOwner],
        'mark_as_completed': [IsOwner],
        'mark_as_favorite': [IsInspector],
    }
    action_serializers = {
        'list': JobListSerializer,
        'retrieve': JobDetailSerializer,
        'create': JobManagementSerializer,
        'partial_update': JobManagementSerializer,
    }

    def get_queryset(self):
        user = self.request.user
        jobs = super().get_queryset()
        query_params = self.request.query_params
        if query_params.get('dates', None):
            start_date, end_date = query_params.get('dates').split(',')
            jobs = jobs.filter(created__range=[start_date, end_date])
        if query_params.get('status', None):
            jobs = jobs.filter(status__in=query_params.get('status').split(','))
        if user_is_inspector(user):
            inspector = user.inspector
            credentials = list(inspector.credentials.values_list('id', flat=True))
            active_jobs = jobs.filter(active=True, certifications__in=credentials)
            if query_params.get('favorite', None):
                active_jobs = active_jobs.filter(favorites__inspector=inspector)
                return active_jobs
            if query_params.get('applied', None):
                my_bids_ids = list(inspector.bids.values_list('job_id', flat=True))
                active_jobs = active_jobs.filter(id__in=my_bids_ids)
            else:
                active_jobs = active_jobs.filter(status=Job.JobStatus.PENDING)
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
        user = self.request.user
        if user_is_inspector(user):
            job = Job.objects.get(pk=pk)
            job.views += 1
            job.save()
        return Response()

    @may_fail(Job.DoesNotExist, 'Job not found')
    @action(detail=True, methods=['post'])
    def mark_as_completed(self, request, pk=None):
        user = self.request.user
        if user_is_inspector(user):
            return Response('Invalid action', status=HTTP_400_BAD_REQUEST)
        job = Job.objects.get(pk=pk, created_by=user.owner)
        if job.status == Job.JobStatus.FINISHED:
            return Response('Job already completed', status=HTTP_400_BAD_REQUEST)
        job.status = Job.JobStatus.FINISHED
        job.save()
        return Response()

    @may_fail(Job.DoesNotExist, 'Job not found')
    @action(detail=True, methods=['post'])
    def mark_as_favorite(self, request, pk=None):
        user = self.request.user
        if not user_is_inspector(user):
            return Response('Invalid action', status=HTTP_400_BAD_REQUEST)
        job = Job.objects.get(pk=pk)
        if job.status == Job.JobStatus.CANCELED or job.status == Job.JobStatus.FINISHED:
            return Response('Job not available', status=HTTP_400_BAD_REQUEST)
        job_favorite = JobFavorite.objects.filter(job=job, inspector=user.inspector)
        if job_favorite:
            job_favorite.delete()
            return Response()
        JobFavorite.objects.create(job=job, inspector=user.inspector)
        return Response()


class BidViewSet(
    PermissionClassByActionMixin,
    SerializerClassByActionMixin,
    GenericViewSet,
    ListModelMixin,
    CreateModelMixin,
    DestroyModelMixin,
    RetrieveModelMixin,
):
    queryset = Bid.objects.all()
    pagination_class = CustomPageSizePagination
    filter_backends = [SearchFilter, OrderingFilter, CustomOrderingFilterBids]
    search_fields = ['status', 'job__title', 'inspector__user__first_name', 'inspector__user__last_name']
    ordering_fields = ['status', 'created', 'job', 'inspector', 'created']
    action_permissions = {
        'list': [IsInspector, IsOwner],
        'create': [IsInspector],
        'accept': [IsOwner],
        'reject': [IsOwner],
        'retrieve': [IsInspector, IsOwner],
        'destroy': [IsInspector],
    }
    action_serializers = {
        'list': BidListSerializer,
        'create': BidCreateSerializer,
        'retrieve': BidDetailSerializer,
    }

    def get_queryset(self):
        user = self.request.user
        bids = super().get_queryset()
        query_params = self.request.query_params
        job_id = query_params.get('job_id', None)
        if job_id:
            bids = bids.filter(job_id=job_id)
        if user_is_inspector(user):
            dates = query_params.get('dates', None)
            if dates:
                start_date, end_date = dates.split(',')
                bids = bids.filter(created__range=[start_date, end_date])
            return bids.filter(inspector=user.inspector)
        return bids.filter(job__created_by=user.owner)

    @may_fail(Bid.DoesNotExist, 'Bid not found')
    @action(detail=False, methods=['post'])
    def accept(self, request):
        user = self.request.user
        bid_id = request.data.get('bid_id')
        bid = Bid.objects.get(pk=bid_id)
        if bid.job.created_by != user.owner:
            return Response('Invalid action', status=HTTP_400_BAD_REQUEST)
        job = bid.job
        if job.status != Job.JobStatus.PENDING:
            return Response('This job is not available for bidding', status=HTTP_400_BAD_REQUEST)
        other_bids = Bid.objects.filter(job=job).exclude(id=bid.id)
        for other_bid in other_bids:
            other_bid.status = Bid.StatusChoices.REJECTED
            other_bid.save()
        bid.status = Bid.StatusChoices.ACCEPTED
        bid.save()
        job.status = Job.JobStatus.STARTED
        job.inspector = bid.inspector
        job.save()

        return Response()

    @may_fail(Bid.DoesNotExist, 'Bid not found')
    @action(detail=False, methods=['post'])
    def reject(self, request):
        user = self.request.user
        bid_id = request.data.get('bid_id')
        bid = Bid.objects.get(pk=bid_id)
        if bid.job.created_by != user.owner:
            return Response('Invalid action', status=HTTP_400_BAD_REQUEST)
        bid.status = Bid.StatusChoices.REJECTED
        bid.save()
        return Response()


    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        user = self.request.user
        if instance.status != Bid.StatusChoices.PENDING or instance.inspector != user.inspector:
            return Response('Invalid action', status=HTTP_400_BAD_REQUEST)
        self.perform_destroy(instance)
        return Response()


