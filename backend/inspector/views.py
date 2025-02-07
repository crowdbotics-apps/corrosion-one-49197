from django.shortcuts import render

# Create your views here.


from rest_framework import viewsets, mixins
from rest_framework.decorators import action
from rest_framework.response import Response

from inspector.models import Credential
from inspector.serializers import CredentialSerializer


class CredentialsViewSet(viewsets.GenericViewSet, mixins.ListModelMixin):
    queryset = Credential.objects.all()
    serializer_class = CredentialSerializer
    permission_classes = []
