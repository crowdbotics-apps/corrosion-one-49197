from cities_light.contrib.restframework3 import CountryModelViewSet, RegionModelViewSet, \
    CityModelViewSet
from cities_light.models import Country, Region, City
from django.shortcuts import render

# Create your views here.


from rest_framework import viewsets, mixins, status
from rest_framework.decorators import action
from rest_framework.response import Response

from inspector.models import Credential, Language, Inspector, CredentialDcoument
from inspector.serializers import CredentialSerializer, InspectorCompleteSerializer, CountrySerializer, CitySerializer, \
    RegionSerializer, LanguageSerializer, InspectorUpdateSerializer
from users.models import UserVerificationCode
from users.serializers import UserDetailSerializer
from utils.utils import CollectedMultipartJsonViewMixin, GetViewsetMixin
from utils.utils.send_sms import send_sms
from utils.utils.verification_code import setup_verification_code


class CredentialsViewSet(viewsets.GenericViewSet, mixins.ListModelMixin):
    queryset = Credential.objects.all()
    serializer_class = CredentialSerializer
    permission_classes = []


class InspectorViewSet(
    CollectedMultipartJsonViewMixin,
    viewsets.GenericViewSet,
    mixins.UpdateModelMixin,
):

    queryset = Inspector.objects.all()
    serializer_class = InspectorUpdateSerializer

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
        send_verification_code = data.get('send_verification_code', True)
        inspector.regions.set(states_id)
        if send_verification_code:
            code = setup_verification_code(user, UserVerificationCode.CodeTypes.PHONE_VERIFICATION)
            message = f'Your verification code is {code}'
            send_sms(message, user.phone_number.as_e164)
        return Response(UserDetailSerializer(user).data)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        request.data['id'] = request.user.inspector.pk
        instance = request.user.inspector
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(UserDetailSerializer(request.user).data)

    @action(methods=['post'], detail=False)
    def notification_settings(self, request):
        data = request.data
        user = request.user
        notification_setting = data.get('notification_setting', None)
        if not notification_setting:
            return Response('Invalid notification setting', status=status.HTTP_400_BAD_REQUEST)
        inspector = user.inspector
        current_value = getattr(inspector, notification_setting, None)
        if current_value is None:
            return Response(f"Field '{notification_setting}' not found on Inspector.",
                            status=status.HTTP_400_BAD_REQUEST)
        new_value = not current_value
        setattr(inspector, notification_setting, new_value)
        inspector.save()
        return Response(UserDetailSerializer(user).data)

    @action(methods=['post'], detail=False)
    def credentials(self, request):
        data = request.data
        user = request.user
        inspector = user.inspector
        credentials = data.get('credentials', [])
        credential_documents = inspector.credential_documents.all().values_list('id', flat=True)
        credentials_ids = [credential['id'] for credential in credentials]
        for credential_document_id in credential_documents:
            if credential_document_id not in credentials_ids:
                CredentialDcoument.objects.get(id=credential_document_id).delete()

        for credential in credentials:
            credential_id = credential.get('credential_id', None)
            if credential_id:
                credential_document = CredentialDcoument.objects.filter(credential_id=credential_id, inspector=inspector)
                if not credential_document:
                    credential_document = CredentialDcoument.objects.create(credential_id=credential_id, inspector=inspector)
                    document = credential.get('document', None)
                    if document and hasattr(document, 'file'):
                        credential_document.document = document
                        credential_document.save()
            else:
                if credential['document'] and hasattr(credential['document'], 'file'):
                    credential_document = CredentialDcoument.objects.get(id=credential['id'])
                    credential_document.document = credential['document']
                    credential_document.save()

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


class LanguageViewSet(viewsets.GenericViewSet, mixins.ListModelMixin):
    permission_classes = []
    serializer_class = LanguageSerializer
    queryset = Language.objects.all()



