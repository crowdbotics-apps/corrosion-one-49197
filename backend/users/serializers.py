from django.utils.translation import gettext_lazy as _
from rest_framework.exceptions import ValidationError
from rest_framework.fields import SerializerMethodField
from rest_framework.serializers import IntegerField, ModelSerializer, Serializer, CharField
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.http import HttpRequest
from rest_framework import serializers
from phonenumbers import region_code_for_number

from users.models import User
from utils.utils import create_user_activation_link, send_notifications
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

    def create(self, validated_data):
        """
        Create user and sends verification email
        """
        request = self._get_request()
        email = validated_data['email']
        user = User(email=email, username=email, is_active=True, current_user_type=User.UserType.SEEKER)
        user.set_password(validated_data['password'])
        user.save()

        send_email_with_template(
            subject='iAscend - Verification Link',
            email=user.email,
            template_to_load='emails/activate_user_email.html',
            context={
                "name": user.email,
                "verification_link": create_user_activation_link(user, request),
            }
        )

        send_notifications(
            users=[user],
            title='iAscend - Verification Link',
            description=f'The verification link has been sent to you',
        )

        return user


class UserDetailSerializer(ModelSerializer):
    status = IntegerField(source='seeker.status')
    phone_without_country_code = serializers.CharField(source='seeker.phone_number.national_number', allow_null=True,
                                                       allow_blank=True, read_only=True)
    phone_country_code_name = serializers.SerializerMethodField()
    phone_country_code = serializers.CharField(source='seeker.phone_number.country_code', allow_null=True,
                                               allow_blank=True,
                                               read_only=True)
    phone_number = serializers.CharField(source='seeker.phone_number', allow_null=True, allow_blank=True)

    profile_picture = serializers.SerializerMethodField()
    date_of_birth = serializers.DateField(source='seeker.date_of_birth', allow_null=True)
    gender = serializers.IntegerField(source='seeker.gender.id', allow_null=True)
    zodiac = serializers.IntegerField(source='seeker.zodiac', allow_null=True)
    city = serializers.IntegerField(source='seeker.city.pk', allow_null=True)
    state = IntegerField(read_only=True, source='seeker.city.region.pk', allow_null=True)
    client_link = serializers.CharField(source='seeker.client_link', allow_null=True, allow_blank=True)

    is_recommended = serializers.BooleanField(source='specialist.is_recommended', allow_null=True)
    rating = SerializerMethodField()
    certification = serializers.FileField(source='specialist.certification', allow_null=True)
    experience = serializers.CharField(source='specialist.experience', allow_null=True)
    bio = serializers.CharField(source='specialist.bio', allow_null=True)
    job_title = serializers.CharField(source='specialist.job_title', allow_null=True, allow_blank=True)
    selected_modalities = serializers.SerializerMethodField()
    specialist_status = serializers.SerializerMethodField()
    profile_flag = serializers.SerializerMethodField()
    earned = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'email', 'name', 'is_active', 'phone_number', 'phone_without_country_code',
                  'phone_country_code',
                  'phone_country_code_name', 'current_user_type', 'specialist', 'seeker', 'status', 'specialist_status',
                  'earned', 'sessions',
                  'stripe_account_linked', 'profile_picture', 'date_of_birth', 'gender', 'zodiac', 'city',
                  'client_link',
                  'is_recommended', 'rating', 'certification', 'experience', 'bio', 'job_title',
                  'selected_modalities',
                  'state', 'profile_flag', 'stripe_account_link']

    def get_earned(self, obj):
        specialist = getattr(obj, 'specialist', None)
        if specialist:
            sessions = specialist.sessions_history.filter(status=Session.SessionStatus.CONFIRMED)
            sessions_transactions = []

            for session in sessions:
                # Filter transactions and check if any instance is found before appending
                transaction_instance = session.transactions.filter(status=20, transaction_type=20).first()
                if transaction_instance is not None:
                    sessions_transactions.append(transaction_instance)

            if sessions_transactions:
                return sum([t.amount / 100 for t in sessions_transactions])

        return 0

    def get_profile_flag(self, obj):
        if hasattr(obj, 'seeker'):
            return obj.seeker.profile_flag
        return None

    def get_rating(self, obj):
        if hasattr(obj, 'specialist'):
            if obj.specialist.rating is not None:
                return round(obj.specialist.rating, 1)
            return None
        return None

    def get_phone_country_code_name(self, obj):
        if hasattr(obj, 'seeker') and obj.seeker.phone_number:
            country_code_name = region_code_for_number(obj.seeker.phone_number)
            return country_code_name
        return None

    def get_specialist_status(self, obj):
        if hasattr(obj, 'specialist'):
            return obj.specialist.status
        return None

    def get_profile_picture(self, obj):
        if hasattr(obj, 'seeker'):
            if obj.current_user_type == User.UserType.SEEKER:
                if obj.seeker.profile_picture:
                    return obj.seeker.profile_picture.url
                return None
            elif obj.current_user_type == User.UserType.SPECIALIST:
                if obj.specialist.profile_picture:
                    return obj.specialist.profile_picture.url
                return None
            return None
        return None

    def get_selected_modalities(self, obj):
        if obj.current_user_type == User.UserType.SPECIALIST:
            if obj.specialist.selected_modalities:
                return obj.specialist.selected_modalities
            return None
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


