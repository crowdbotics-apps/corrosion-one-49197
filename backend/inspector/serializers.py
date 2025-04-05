from cities_light.models import Country, Region, City
import os

from phonenumber_field.validators import validate_international_phonenumber
from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from rest_framework.fields import SerializerMethodField
from rest_framework.serializers import ModelSerializer

from inspector.models import Credential, Inspector, Language, SupportDocument, CredentialDcoument
from users.models import User
from utils.utils import SmartUpdatableImageField


class CredentialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Credential
        fields = ['id', 'name']


class InspectorCompleteSerializer(serializers.ModelSerializer):
    credentials = serializers.PrimaryKeyRelatedField(queryset=Credential.objects.all(), many=True)
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    profile_picture = SmartUpdatableImageField(required=False, allow_null=True, allow_empty_file=True)
    phone_number = serializers.CharField(required=False, allow_null=True, allow_blank=True)

    class Meta:
        model = Inspector
        fields = ['credentials', 'profile_picture', 'first_name', 'last_name', 'phone_number']

    def validate(self, attrs):
        user = self.context['request'].user
        if hasattr(user, 'owner'):
            raise serializers.ValidationError('User is not an inspector')
        if user.first_name:
            raise serializers.ValidationError('User already completed profile')
        # TODO: Uncomment this when email verification is implemented
        # if not user.email_verified:
        #     raise serializers.ValidationError('Please verify your email to continue with the sign up process')
        profile_picture = attrs.get('profile_picture', None)
        if profile_picture and profile_picture.size > 5 * 1024 * 1024:  # 5MB limit
            raise serializers.ValidationError('Profile picture size should not exceed 5MB')
        phone_number = attrs.get('phone_number', None)
        if not phone_number:
            raise ValidationError({'phone_number': 'Phone number is required for inspector account.'})
        try:
            validate_international_phonenumber(phone_number)
        except Exception as error:
            raise serializers.ValidationError({'phone_number': error.message})
        attrs['phone_number'] = phone_number
        return attrs

    def save(self, **kwargs):
        data = self.validated_data
        user = self.context['request'].user
        user.first_name = data['first_name']
        user.last_name = data['last_name']
        user.phone_number = data['phone_number']
        user.save()
        self.instance = user.inspector
        self.instance.credentials.set(data['credentials'])
        self.instance.profile_picture = data.get('profile_picture')
        self.instance.save()

        return super().save(**kwargs)

class InspectorUpdateSerializer(serializers.ModelSerializer):
    credentials = serializers.PrimaryKeyRelatedField(queryset=Credential.objects.all(), many=True)
    profile_picture = SmartUpdatableImageField()
    languages = serializers.PrimaryKeyRelatedField(queryset=Language.objects.all(), many=True)
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    linkedin = serializers.CharField(allow_blank=True)
    website = serializers.CharField(allow_blank=True)

    class Meta:
        model = Inspector
        fields = ['id', 'credentials', 'profile_picture', 'date_of_birth', 'languages', 'first_name', 'last_name',
                  'website', 'linkedin']

    def validate(self, attrs):
        user = self.context['request'].user
        if not hasattr(user, 'inspector'):
            raise serializers.ValidationError('User is not an inspector')
        profile_picture = attrs.get('profile_picture')
        if profile_picture and profile_picture.size > 5 * 1024 * 1024:
            raise serializers.ValidationError('Profile picture size should not exceed 5MB')
        support_documents = self.initial_data.get('support_documents')
        if support_documents:
            for support_document in support_documents:
                if 'file' in support_document and support_document['file'].size > 20 * 1024 * 1024:
                    raise serializers.ValidationError('Support document size should not exceed 20MB')
            attrs['support_documents'] = support_documents
        return attrs

    def save(self, **kwargs):
        data = self.validated_data
        user = self.context['request'].user
        user.first_name = data.get('first_name', user.first_name)
        user.last_name = data.get('last_name', user.last_name)
        user.website = data.get('website', user.website)
        user.linkedin = data.get('linkedin', user.linkedin)
        user.save()
        self.instance = user.inspector
        profile_picture = data.get('profile_picture')
        credentials = data.get('credentials', None)
        languages = data.get('languages', None)
        support_documents = data.get('support_documents', [])
        if profile_picture:
            self.instance.profile_picture = profile_picture

        if credentials:
            self.instance.credentials.set(credentials)

        if data.get('date_of_birth'):
            self.instance.date_of_birth = data.get('date_of_birth')

        if languages:
            self.instance.languages.set(languages)

        current_documents_ids = self.instance.support_documents.all().values_list('id', flat=True)
        for document in current_documents_ids:
            if document not in [doc['id'] for doc in support_documents]:
                SupportDocument.objects.get(id=document).delete()

        if support_documents:
            for support_document in support_documents:
                if 'file' in support_document:
                    SupportDocument.objects.create(inspector=self.instance, document=support_document['file'])
            data.pop('support_documents')

        self.instance.save()
        return super().save(**kwargs)

class CountrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Country
        fields = ['id', 'name']


class RegionSerializer(serializers.ModelSerializer):
    country_name = serializers.CharField(source='country.name')
    class Meta:
        model = Region
        fields = ['id', 'name', 'country_id', 'country_name']


class CitySerializer(serializers.ModelSerializer):
    class Meta:
        model = City
        fields = ['id', 'name', 'region_id', 'country_id']

class LanguageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Language
        fields = ['id', 'name']

class SupportDocumentSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    size = serializers.SerializerMethodField()

    class Meta:
        model = SupportDocument
        fields = ['id', 'document', 'name', 'size']

    def get_name(self, obj):
        return os.path.basename(obj.document.name)

    def get_size(self, obj):
        return round(obj.document.size / 1024 / 1024, 2)

class CredentialDocumentsSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='credential.name')
    document_name = serializers.SerializerMethodField()
    size = serializers.SerializerMethodField()
    credential_id = serializers.IntegerField(source='credential.id', read_only=True)

    class Meta:
        model = CredentialDcoument
        fields = ['id', 'name', 'document', 'document_name', 'size', 'credential_id']

    def get_document_name(self, obj):
        if not obj.document:
            return None
        return os.path.basename(obj.document.name)

    def get_size(self, obj):
        if not obj.document:
            return None
        return round(obj.document.size / 1024 / 1024, 2)


class UserDetailInspectorSerializer(ModelSerializer):
    phone_number = SerializerMethodField()


    class Meta:
        model = User
        fields = ['email', 'name', 'first_name', 'last_name', 'phone_number', 'linkedin', 'website']

    def get_phone_number(self, obj):
        if not obj.phone_number:
            return None
        return obj.phone_number.as_international


class InspectorDetailSerializer(serializers.ModelSerializer):
    credentials = CredentialDocumentsSerializer(many=True, source='credential_documents')
    regions = RegionSerializer(many=True)
    countries = serializers.SerializerMethodField()
    languages = LanguageSerializer(many=True)
    support_documents = SupportDocumentSerializer(many=True)
    user = UserDetailInspectorSerializer()

    class Meta:
        model = Inspector
        fields = ['credentials', 'regions', 'languages', 'date_of_birth', 'support_documents', 'countries',
                  'profile_picture', 'notify_job_applied', 'notify_im_qualified', 'notify_new_message', 'user']


    def get_countries(self, obj):
        return CountrySerializer(Country.objects.filter(region__in=obj.regions.all()).distinct(), many=True).data


