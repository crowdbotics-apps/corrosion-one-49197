from cities_light.models import Country, Region, City
from django.templatetags.i18n import language
from rest_framework import serializers

from inspector.models import Credential, Inspector, Language, SupportDocument
from utils.utils import SmartUpdatableImageField


class CredentialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Credential
        fields = ['id', 'name']


class InspectorCompleteSerializer(serializers.ModelSerializer):
    credentials = serializers.PrimaryKeyRelatedField(queryset=Credential.objects.all(), many=True)
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    profile_picture = SmartUpdatableImageField(required=False, allow_null=True)

    class Meta:
        model = Inspector
        fields = ['credentials', 'profile_picture', 'first_name', 'last_name']

    def validate(self, attrs):
        user = self.context['request'].user
        if hasattr(user, 'owner'):
            raise serializers.ValidationError('User is not an inspector')
        if user.first_name:
            raise serializers.ValidationError('User already completed profile')
        if not user.email_verified:
            raise serializers.ValidationError('Please verify your email to continue with the sign up process')
        profile_picture = attrs.get('profile_picture')
        if profile_picture.size > 5 * 1024 * 1024:  # 5MB limit
            raise serializers.ValidationError('Profile picture size should not exceed 5MB')
        return attrs

    def save(self, **kwargs):
        data = self.validated_data
        user = self.context['request'].user
        user.first_name = data['first_name']
        user.last_name = data['last_name']
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

    class Meta:
        model = Inspector
        fields = ['id', 'credentials', 'profile_picture', 'date_of_birth', 'languages']

    def validate(self, attrs):
        user = self.context['request'].user
        if not hasattr(user, 'inspector'):
            raise serializers.ValidationError('User is not an inspector')
        profile_picture = attrs.get('profile_picture')
        if profile_picture and profile_picture.size > 5 * 1024 * 1024:  # 5MB limit
            raise serializers.ValidationError('Profile picture size should not exceed 5MB')
        return attrs

    def save(self, **kwargs):
        data = self.validated_data
        user = self.context['request'].user
        user.save()
        self.instance = user.inspector
        profile_picture = data.get('profile_picture')
        credentials = data.get('credentials', None)
        languages = data.get('languages', None)
        if profile_picture:
            self.instance.profile_picture = profile_picture

        if credentials:
            self.instance.credentials.set(credentials)

        if data.get('date_of_birth'):
            self.instance.date_of_birth = data.get('date_of_birth')

        if languages:
            self.instance.languages.set(languages)


        self.instance.save()


        return super().save(**kwargs)

class CountrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Country
        fields = ['id', 'name']


class RegionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Region
        fields = ['id', 'name', 'country_id']


class CitySerializer(serializers.ModelSerializer):
    class Meta:
        model = City
        fields = ['id', 'name', 'region_id', 'country_id']

class LanguageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Language
        fields = ['id', 'name']

class SupportDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = SupportDocument
        fields = ['id', 'document']


class InspectorDetailSerializer(serializers.ModelSerializer):
    credentials = CredentialSerializer(many=True)
    regions = RegionSerializer(many=True)
    countries = serializers.SerializerMethodField()
    languages = LanguageSerializer(many=True)
    support_documents = SupportDocumentSerializer(many=True)

    class Meta:
        model = Inspector
        fields = ['credentials', 'regions', 'languages', 'date_of_birth', 'support_documents', 'countries', 'profile_picture']


    def get_countries(self, obj):
        return CountrySerializer(Country.objects.filter(region__in=obj.regions.all()).distinct(), many=True).data


