from django.conf import settings
from django.utils.translation import gettext_lazy as _
from phonenumber_field.validators import validate_international_phonenumber
from rest_framework.exceptions import ValidationError
from rest_framework.fields import SerializerMethodField
from rest_framework.serializers import IntegerField, ModelSerializer, Serializer, CharField
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.http import HttpRequest
from django.utils import timezone

from inspector.models import Inspector
from inspector.serializers import InspectorDetailSerializer
from owner.models import Owner
from owner.serializers import OwnerDetailSerializer
from utils.utils import create_user_activation_link
from utils.utils.email import send_email_with_template



from django.contrib.auth.password_validation import get_default_password_validators
from django.contrib.auth.tokens import default_token_generator
from django.contrib.auth.views import INTERNAL_RESET_SESSION_TOKEN
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework.exceptions import ValidationError
from rest_framework import serializers

from users.models import User
from utils.utils import get_user_by_uidb64


class ResetPasswordConfirmSerializer(serializers.Serializer):
    new_password = serializers.CharField(required=True)
    uidb64 = serializers.CharField(required=True)
    token = serializers.CharField(required=True)
    token_generator = default_token_generator

    def validate_token(self, token):
        INTERNAL_RESET_URL_TOKEN = 'set-password'
        user = get_user_by_uidb64(self.initial_data['uidb64'])
        if user is not None:
            if token == INTERNAL_RESET_URL_TOKEN:
                session_token = self.request.session.get(INTERNAL_RESET_SESSION_TOKEN)
                if self.token_generator.check_token(user, session_token):
                    return
            else:
                if self.token_generator.check_token(user, token):
                    self.request.session[INTERNAL_RESET_SESSION_TOKEN] = token
                    return
        raise serializers.ValidationError("Invalid token")

    def validate_password(self, data):
        password_validators = get_default_password_validators()
        errors = []
        for validator in password_validators:
            try:
                validator.validate(data.get('new_password'), get_user_by_uidb64(self.initial_data['uidb64']))
            except (ValidationError, DjangoValidationError) as error:
                errors.append(" ".join(error.messages))
        if errors:
            raise serializers.ValidationError(detail={'errors': errors})

    def validate(self, data):
        self.validate_password(data)
        return data


class ChangePasswordSerializer(serializers.Serializer):
    current_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)

    def validate_current_password(self, current_password):
        request = self.context.get('request')
        if not request.user.check_password(current_password):
            raise serializers.ValidationError("The current password is not valid.")
        return current_password

    def validate_new_password(self, new_password):
        request = self.context.get('request')
        password_validators = get_default_password_validators()
        errors = []
        for validator in password_validators:
            try:
                validator.validate(new_password, request.user)
            except (ValidationError, DjangoValidationError) as error:
                errors.append(" ".join(error.messages))
        if errors:
            raise serializers.ValidationError(detail={'errors': errors})
        return new_password


class SendResetLinkSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)

    class Meta:
        fields = ['email']

    def validate_email(self, email):
        if not User.objects.filter(email=email).exists():
            raise serializers.ValidationError("A user with this email does not exist.")
        return email


class UserCreateSerializer(Serializer):
    """
    Serializer for creating a new user.
    """
    email = serializers.EmailField()
    password = serializers.CharField()
    user_type = serializers.CharField()
    phone_number = serializers.CharField(required=False, allow_null=True, allow_blank=True)

    def _get_request(self):
        request = self.context.get('request')
        if request and not isinstance(request, HttpRequest) and hasattr(request, '_request'):
            request = request._request
        return request

    @staticmethod
    def validate_email(email):
        """
        Validate if email is already in use or not
        """
        email_already_active = User.objects.filter(email=email, is_active=True)
        if email_already_active:
            raise ValidationError(
                _("A user is already registered with this e-mail address."))
        else:
            users = User.objects.filter(email=email, is_active=False)
            for user in users:
                user.delete()
        return email


    def validate(self, attrs):
        user_type = attrs.get('user_type')
        if user_type not in ['OWNER', 'INSPECTOR']:
            raise ValidationError(
                _("Invalid account type. Account type must be either 'OWNER' or 'INSPECTOR'.")
            )
        if user_type == 'INSPECTOR':
            phone_number = attrs.get('phone_number', None)
            if not phone_number:
                raise ValidationError({'phone_number': 'Phone number is required for inspector account.'})
            try:
                validate_international_phonenumber(phone_number)
            except Exception as error:
                raise serializers.ValidationError({'phone_number': error.message})
            attrs['phone_number'] = phone_number
        return attrs

    def create(self, validated_data):
        """
        Create user and sends verification email
        """
        request = self._get_request()
        email = validated_data['email']
        user = User(email=email, username=email)
        user.set_password(validated_data['password'])
        user.last_verification_email_sent = timezone.now()
        user.save()

        user_type = validated_data['user_type']
        if user_type == 'INSPECTOR':
            inspector = Inspector.objects.create(user=user)
            inspector.save()
            user.phone_number = validated_data['phone_number']
            user.save()
        else:
            owner = Owner.objects.create(user=user)
            owner.save()
        send_email_with_template(
            subject=f'{settings.PROJECT_NAME} - Verification Link',
            email=user.email,
            template_to_load='emails/activate_user_email.html',
            context={
                "name": user.email,
                "verification_link": create_user_activation_link(user, request),
            }
        )


        return user


class UserDetailSerializer(ModelSerializer):
    status = SerializerMethodField()
    user_type = SerializerMethodField()
    phone_number = SerializerMethodField()
    inspector = SerializerMethodField()
    owner = SerializerMethodField()


    class Meta:
        model = User
        fields = ['email', 'name', 'first_name', 'last_name', 'status', 'user_type', 'phone_number', 'linkedin',
                  'website', 'owner', 'inspector']

    def get_status(self, obj):
        if hasattr(obj, 'owner'):
            return obj.owner.status
        elif hasattr(obj, 'inspector'):
            return obj.inspector.status
        return None

    def get_user_type(self, obj):
        if hasattr(obj, 'owner'):
            return 'OWNER'
        elif hasattr(obj, 'inspector'):
            return 'INSPECTOR'
        return None

    def get_phone_number(self, obj):
        if not obj.phone_number:
            return None
        return obj.phone_number.as_international

    def get_inspector(self, obj):
        if hasattr(obj, 'inspector'):
            return InspectorDetailSerializer(obj.inspector).data
        return None

    def get_owner(self, obj):
        if hasattr(obj, 'owner'):
            return OwnerDetailSerializer(obj.owner).data
        return None






class UserLoginResponseSerializer(Serializer):
    class Meta:
        model = User

    def to_representation(self, instance):
        """
        Override the default to_representation method to format the data as needed
        """
        token = TokenObtainPairSerializer.get_token(instance)
        ret = {
            'access': str(token.access_token),
            'refresh': str(token),
            'user': UserDetailSerializer(instance).data,
        }
        return ret


