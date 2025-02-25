from owner.models import Industry, Owner

from rest_framework import  serializers

from users.models import User, UserVerificationCode
from phonenumber_field.validators import validate_international_phonenumber

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