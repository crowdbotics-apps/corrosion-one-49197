from cities_light.contrib.restframework3 import CountryModelViewSet, RegionModelViewSet, \
    CityModelViewSet
from cities_light.models import Country, Region, City
from django.shortcuts import render

# Create your views here.


from rest_framework import viewsets, mixins
from rest_framework.decorators import action
from rest_framework.response import Response

from inspector.models import Credential
from inspector.serializers import CredentialSerializer, InspectorCompleteSerializer, CountrySerializer, CitySerializer, \
    RegionSerializer
from users.models import UserVerificationCode
from users.serializers import UserDetailSerializer
from utils.utils import CollectedMultipartJsonViewMixin, GetViewsetMixin
from utils.utils.send_sms import send_sms
from utils.utils.verification_code import setup_verification_code


class CredentialsViewSet(viewsets.GenericViewSet, mixins.ListModelMixin):
    queryset = Credential.objects.all()
    serializer_class = CredentialSerializer
    permission_classes = []


class InspectorViewSet(CollectedMultipartJsonViewMixin, viewsets.GenericViewSet):

    @action(methods=['post'], detail=False)
    def complete(self, request):
        data = request.data
        user = request.user
        serializer = InspectorCompleteSerializer(data=data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(UserDetailSerializer(user).data)


    @action(methods=['post'], detail=False)
    def workarea(self, request):
        data = request.data
        user = request.user
        inspector = user.inspector
        states_id = data.get('state', [])
        inspector.regions.set(states_id)
        code = setup_verification_code(user, UserVerificationCode.CodeTypes.PHONE_VERIFICATION)
        message = f'Your verification code is {code}'
        send_sms(message, user.phone_number.as_e164)
        return Response(UserDetailSerializer(user).data)

class CountryViewSet(viewsets.GenericViewSet, GetViewsetMixin):
    permission_classes = []

    def simple_get(self, request, *args, **kwargs):
        countries = Country.objects.all().extra(
            select={'is_us': "CASE WHEN name = 'United States' THEN 0 ELSE 1 END"}).order_by('is_us', 'name')
        return Response(CountrySerializer(countries, many=True, context={'request': request}).data)

class StateViewSet(viewsets.GenericViewSet, GetViewsetMixin):
    permission_classes = []

    def simple_get(self, request, *args, **kwargs):
        countries_ids = request.query_params.get('countries', None)
        if not countries_ids:
            return Response([])
        states = Region.objects.filter(country_id__in=countries_ids.split(',')).order_by('name')
        return Response(RegionSerializer(states, many=True, context={'request': request}).data)