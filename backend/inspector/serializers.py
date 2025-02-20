from cities_light.models import Country, Region, City
from rest_framework import serializers

from inspector.models import Credential, Inspector, Language
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
        user.profile_picture = data['profile_picture']
        user.save()
        self.instance = user.inspector
        self.instance.credentials.set(data['credentials'])
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