from django.shortcuts import render

# Create your views here.


from rest_framework import viewsets, mixins
from rest_framework.decorators import action
from rest_framework.response import Response

from owner.models import Owner, Industry

from owner.serializers import IndustrySerializer, OwnerCompleteSerializer
from users.serializers import UserDetailSerializer


class IndustryViewSet(viewsets.GenericViewSet, mixins.ListModelMixin):
    queryset = Industry.objects.all()
    serializer_class = IndustrySerializer
    permission_classes = []


class OwnerViewSet(viewsets.GenericViewSet):
    queryset = Owner.objects.all()

    @action(methods=['post'], detail=False)
    def complete(self, request):
        data = request.data
        serializer = OwnerCompleteSerializer(data=data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(UserDetailSerializer(serializer.instance.user).data)
