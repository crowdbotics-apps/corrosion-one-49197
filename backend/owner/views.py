from django.shortcuts import render

# Create your views here.


from rest_framework import viewsets, mixins
from rest_framework.decorators import action
from rest_framework.response import Response

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