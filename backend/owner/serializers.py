import os

from owner.models import Industry, Owner

from rest_framework import  serializers

from users.models import User, UserVerificationCode
from phonenumber_field.validators import validate_international_phonenumber

from utils.utils import SmartUpdatableImageField
from utils.utils.send_sms import send_sms
from utils.utils.verification_code import setup_verification_code


class IndustrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Industry
        fields = ['id', 'name']



class OwnerCompleteSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    phone_number = serializers.CharField()

    class Meta:
        model = Owner
        fields = ['industry', 'company_name', 'first_name', 'last_name', 'phone_number']

    def validate(self, attrs):
        user = self.context['request'].user
        if hasattr(user, 'inspector'):
            raise serializers.ValidationError('User is not an owner')
        if user.first_name:
            raise serializers.ValidationError('User already completed profile')
        phone_number = attrs.get('phone_number')
        try:
            validate_international_phonenumber(phone_number)
        except Exception as error:
            raise serializers.ValidationError({'phone_number': error.message})
        if not user.email_verified:
            raise serializers.ValidationError('Please verify your email to continue with the sign up process')
        return attrs

    def save(self, **kwargs):
        data = self.validated_data
        user = self.context['request'].user
        user.first_name = data['first_name']
        user.last_name = data['last_name']
        user.phone_number = data['phone_number']
        user.save()
        self.instance = user.owner
        self.instance.industry = data['industry']
        self.instance.company_name = data['company_name']
        self.instance.save()
        code = setup_verification_code(user, UserVerificationCode.CodeTypes.PHONE_VERIFICATION)
        message = f'Your verification code is {code}'
        send_sms(message, user.phone_number.as_e164)
        return super().save(**kwargs)


class OwnerDetailSerializer(serializers.ModelSerializer):
    industry = IndustrySerializer()
    banner_name = serializers.SerializerMethodField()
    logo_name = serializers.SerializerMethodField()
    banner_size = serializers.SerializerMethodField()
    logo_size = serializers.SerializerMethodField()
    phone_number = serializers.SerializerMethodField()
    email = serializers.CharField(source='user.email')
    linkedin = serializers.CharField(source='user.linkedin')
    website = serializers.CharField(source='user.website')

    class Meta:
        model = Owner
        fields = ['industry', 'company_name', 'address', 'banner', 'logo', 'banner_name', 'logo_name', 'banner_size',
                  'logo_size', 'phone_number', 'email', 'linkedin', 'website']

    def get_banner_name(self, obj):
        if not obj.banner:
            return None
        return os.path.basename(obj.banner.name)

    def get_logo_name(self, obj):
        if not obj.logo:
            return None
        return os.path.basename(obj.logo.name)

    def get_banner_size(self, obj):
        if not obj.banner:
            return None
        return obj.banner.size

    def get_logo_size(self, obj):
        if not obj.logo:
            return None
        return obj.logo.size

    def get_phone_number(self, obj):
        return obj.user.phone_number.as_e164


class OwnerUpdateSerializer(serializers.ModelSerializer):
    industry = serializers.PrimaryKeyRelatedField(queryset=Industry.objects.all())
    banner = SmartUpdatableImageField()
    logo = SmartUpdatableImageField()
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    linkedin = serializers.CharField(allow_blank=True, allow_null=True)
    website = serializers.CharField(allow_blank=True, allow_null=True)
    phone_number = serializers.CharField()

    class Meta:
        model = Owner
        fields = ['id', 'industry', 'company_name', 'address', 'banner', 'logo', 'first_name', 'last_name', 'linkedin',
                    'website', 'phone_number']

    def validate(self, attrs):
        user = self.context['request'].user
        if not hasattr(user, 'owner'):
            raise serializers.ValidationError('User is not an owner')
        banner = attrs.get('banner')
        logo = attrs.get('logo')
        if banner and banner.size > 5 * 1024 * 1024:  # 5MB limit
            raise serializers.ValidationError('Banner size should not exceed 5MB')
        if logo and logo.size > 5 * 1024 * 1024:  # 5MB limit
            raise serializers.ValidationError('Logo size should not exceed 5MB')
        return attrs

    def save(self, **kwargs):
        data = self.validated_data
        user = self.context['request'].user
        user.first_name = data['first_name']
        user.last_name = data['last_name']
        user.phone_number = data['phone_number']
        user.linkedin = data['linkedin']
        user.website = data['website']
        user.save()
        self.instance = user.owner
        self.instance.industry = data['industry']
        self.instance.company_name = data['company_name']
        self.instance.address = data['address']
        if data.get('banner'):
            self.instance.banner = data['banner']
        if data.get('logo'):
            self.instance.logo = data['logo']
        self.instance.save()
        return super().save(**kwargs)