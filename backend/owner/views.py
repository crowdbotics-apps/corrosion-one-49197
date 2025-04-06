from django.shortcuts import render

# Create your views here.


from rest_framework import viewsets, mixins
from rest_framework.decorators import action
from rest_framework.response import Response

from jobs.models import Job, Bid
from owner.models import Owner, Industry

from owner.serializers import IndustrySerializer, OwnerCompleteSerializer, OwnerUpdateSerializer
from users.serializers import UserDetailSerializer
from utils.utils import CollectedMultipartJsonViewMixin


class IndustryViewSet(viewsets.GenericViewSet, mixins.ListModelMixin):
    queryset = Industry.objects.all()
    serializer_class = IndustrySerializer
    permission_classes = []


class OwnerViewSet(
    CollectedMultipartJsonViewMixin,
    viewsets.GenericViewSet,
    mixins.UpdateModelMixin,
):
    queryset = Owner.objects.all()
    serializer_class = OwnerUpdateSerializer
    @action(methods=['post'], detail=False)
    def complete(self, request):
        data = request.data
        serializer = OwnerCompleteSerializer(data=data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(UserDetailSerializer(serializer.instance.user).data)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        request.data['id'] = request.user.owner.pk
        instance = request.user.owner
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(UserDetailSerializer(request.user).data)

    @action(methods=['post'], detail=False)
    def dashboard(self, request):
        user = request.user
        # inspector = user.inspector
        # jobs = Job.objects.filter(active=True)
        # credentials = list(inspector.credentials.values_list('id', flat=True))
        # available = jobs.filter(certifications__in=credentials)
        # favorite = available.filter(favorites__inspector=inspector).distinct().count()
        # my_bids_ids = list(inspector.bids.values_list('job_id', flat=True))
        # applied = jobs.filter(id__in=my_bids_ids).distinct().count()
        # bids = inspector.bids.count()
        # accepted_bids = inspector.bids.filter(status=Bid.StatusChoices.ACCEPTED).count()
        # rejected_bids = inspector.bids.filter(status=Bid.StatusChoices.REJECTED).count()
        # data = {
        #     'available': available.distinct().count(),
        #     'favorite': favorite,
        #     'applied': applied,
        #     'bids': bids,
        #     'accepted_bids': accepted_bids,
        #     'rejected_bids': rejected_bids,
        # }
        data = {
            'jobs': 0
        }
        return Response(data)