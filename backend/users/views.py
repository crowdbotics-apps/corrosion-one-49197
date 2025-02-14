import json
from urllib import request as urequest

import facebook
import jwt
from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.http import HttpResponseRedirect
from django.shortcuts import render
from django.utils import timezone
from django_user_agents.utils import get_user_agent
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.mixins import CreateModelMixin
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST, \
    HTTP_404_NOT_FOUND, HTTP_500_INTERNAL_SERVER_ERROR
from rest_framework.viewsets import GenericViewSet

from users.models import User, UserVerificationCode
from users.serializers import ChangePasswordSerializer, ResetPasswordConfirmSerializer, UserCreateSerializer, \
    UserLoginResponseSerializer, UserDetailSerializer
from utils.utils import get_user_by_uidb64, get_and_validate_serializer
from utils.utils import may_fail, update_with_kwargs, create_user_activation_link
from utils.utils.email import send_email_with_template
from utils.utils.send_sms import send_sms
from utils.utils.verification_code import setup_verification_code, get_verification_code, get_current_verification_code
from utils.utils.verification_link import generate_reset_url

User = get_user_model()


class UserViewSet(GenericViewSet, CreateModelMixin):
    """
    ViewSet for managing User objects.
    """
    permission_classes = [AllowAny]

    def get_serializer_class(self):
        match self.action:
            case 'reset': return ResetPasswordConfirmSerializer
            case 'change': return ChangePasswordSerializer
            case _: return UserCreateSerializer

    def create(self, request, **kwargs):
        """
        Create user and send verification email
        """
        serializer = UserCreateSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.create(serializer.data)

        return Response(UserLoginResponseSerializer(user).data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['post'])
    @get_and_validate_serializer
    def change(self, request, serializer, *args, **kwargs):
        self.request.user.set_password(serializer.data['new_password'])
        self.request.user.save()
        return Response()

    @action(detail=False, methods=['POST'], url_path='reset-password')
    def forgot_password_link(self, request):
        email = self.request.data["email"]
        user = User.objects.filter(email=email).first()
        if user:
            send_email_with_template(
                subject=f'Reset password email {settings.PROJECT_NAME}',
                email=user.email,
                template_to_load='emails/forgot_password_email_link.html',
                context={
                    "username": user.email,
                    "set_password_link": generate_reset_url(user, self.request),
                }
            )
            return Response()
        return Response({'details': 'Email not found'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['POST'], url_path='set-new-password')
    def set_new_password(self, request):
        ResetPasswordConfirmSerializer.request = self.request
        serializer = ResetPasswordConfirmSerializer(data=request.data)

        if serializer.is_valid(raise_exception=True):
            user = get_user_by_uidb64(serializer.data['uidb64'])
            user.set_password(serializer.data['new_password'])
            user.save()
        return Response()



    @action(detail=False, methods=['POST'])
    def forgot_password(self, request):
        """
        Send email to reset users password
        """
        email = request.data["email"]
        user = User.objects.filter(email=email).first()
        if user:
            code = setup_verification_code(user, UserVerificationCode.CodeTypes.PASSWORD_RESET)
            name = user.name
            if name is None or name == '':
                name = user.email
            send_email_with_template(
                subject=f'{settings.PROJECT_NAME} - Reset Password Code',
                email=user.email,
                template_to_load='emails/forgot_password_email.html',
                context={
                    "name": name if name else user.email,
                    "code": code,
                }
            )

            return Response(status=HTTP_200_OK)
        return Response('The email is invalid', status=HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['POST'], url_path='verify')
    def check_verification_code(self, request):
        otp = request.data.get("code")
        try:
            get_token = get_verification_code(otp, UserVerificationCode.CodeTypes.PASSWORD_RESET)
        except Exception as e:
            return Response(e, status=HTTP_500_INTERNAL_SERVER_ERROR)
        if not get_token:
            return Response('The code is invalid', status=HTTP_400_BAD_REQUEST)
        return Response(status=HTTP_200_OK)

    @action(detail=False, methods=['POST'])
    def send_phone_code(self, request):
        """
        Send phone code
        """
        user = self.request.user
        if not user:
            return Response('User not found', status=HTTP_400_BAD_REQUEST)
        if user.phone_verified:
            return Response('Phone already verified', status=HTTP_400_BAD_REQUEST)
        code = get_current_verification_code(user, UserVerificationCode.CodeTypes.PHONE_VERIFICATION)
        if code:
            if code.last_sent and (timezone.now() - code.last_sent).seconds < 30:
                return Response('Please wait for 30 seconds before sending another verification code',
                                status=HTTP_400_BAD_REQUEST)
            else:
                message = f'Your verification code is {code.verification_code}'
                code.last_sent = timezone.now()
                code.save()
                send_sms(message, user.phone_number.as_e164)
                return Response()
        code = setup_verification_code(user, UserVerificationCode.CodeTypes.PHONE_VERIFICATION)
        message = f'Your verification code is {code}'
        send_sms(message, user.phone_number.as_e164)
        return Response()

    @action(detail=False, methods=['POST'])
    def verify_phone_code(self, request):
        """
        Verify phone code
        """
        code = request.data.get("verification_code", None)
        try:
            get_token = get_verification_code(code, UserVerificationCode.CodeTypes.PHONE_VERIFICATION)
        except Exception as e:
            return Response(e, status=HTTP_500_INTERNAL_SERVER_ERROR)
        if not get_token:
            return Response('The code is invalid', status=HTTP_400_BAD_REQUEST)
        user = self.request.user
        if not user:
            return Response('User not found', status=HTTP_400_BAD_REQUEST)
        user.phone_verified = True
        user.save()
        return Response(UserDetailSerializer(user).data)

    @action(detail=False, methods=['POST'])
    def reset_password(self, request):
        try:
            otp = request.data.get("code")
            password = request.data.get("password")
            get_token = get_verification_code(otp, UserVerificationCode.CodeTypes.PASSWORD_RESET)
            if not password:
                return Response('Password cannot be empty', status=HTTP_400_BAD_REQUEST)
            if not get_token:
                return Response('The code is invalid', status=status.HTTP_400_BAD_REQUEST)
            user = get_token.user
            user.set_password(password)
            user.save()
            get_token.delete()
        except Exception as e:
            return Response(e, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response()

    @action(detail=False, methods=['POST'])
    def biometrics_login(self, request):
        try:
            data = request.data
            email = data.get('email', '')
            biometrics_key = data.get('biometrics_key', '')
            user = User.objects.get(email=email, biometrics_key=biometrics_key)
            if user:
                serializer = UserLoginResponseSerializer(user)
                return Response(serializer.data)
            else:
                Response( 'Unable to login with biometrics', status=HTTP_400_BAD_REQUEST)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist, ValidationError):
            return Response( 'Unable to login with biometrics', status=HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['POST'])
    def setup_biometrics(self, request):
        try:
            data = request.data
            biometrics_key = data.get('biometrics_key', '')
            user = self.request.user
            user.biometrics_key = biometrics_key
            user.save()
            return Response(status=HTTP_200_OK)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist, ValidationError):
            return Response('Unable to setup biometrics', status=HTTP_400_BAD_REQUEST)

    @staticmethod
    def create_update_user(crate_data, update_data, user, login_type, profile_picture=None, sign_up=False):
        if user:
            update_with_kwargs(user, update_data)
        else:
            user = User.objects.filter(email=crate_data['email']).first()
            if user:
                if user.email_verified:
                    update_with_kwargs(user, update_data)
                else:
                    raise ValidationError(
                        {'non_field_errors': [
                            f'Email already linked to an account. Please verify the email first before continue with {login_type}.'
                        ]}
                    )
            else:
                if not sign_up:
                    raise ValidationError(
                        {'non_field_errors': [
                            f'Email not found. Please sign up first before continue with {login_type}.'
                        ]}
                    )
                user_data = {**crate_data, **update_data}
                user = User.objects.create(**user_data)
                user.save()
            if profile_picture:
                try:
                    result = urequest.urlretrieve(profile_picture)

                    # user.profile_picture.save(os.path.basename(profile_picture), File(open(result[0], 'rb')))
                except Exception as error:
                    print(f'Error getting profile picture from {login_type}: {str(error)}')
        user.last_login = timezone.now()
        user.save()
        return user

    @may_fail(User.DoesNotExist, 'Invalid user')
    @action(detail=False, methods=['post'])
    def continue_with_google(self, request):
        data = json.loads(request.body.decode('utf-8'))
        user_info = data.get('user')
        sign_up = data.get('signUp', False)
        google_token = data.get('idToken')
        google_id = user_info.get('id')
        password = User.objects.make_random_password()
        email = user_info.get('email', '')
        name = user_info.get('name', '')
        first_name = user_info.get('givenName', '')
        last_name = user_info.get('familyName', '')
        profile_picture = user_info.get('photo')

        user = User.objects.filter(google_id=google_id).first()
        if user:
            if not user.is_active:
                return Response('The account has been removed', status=HTTP_404_NOT_FOUND)

        update_data = dict(
            google_token=google_token,
            google_id=google_id,
            email_verified=True,
        )

        create_data = dict(
            name=name,
            first_name=first_name,
            last_name=last_name,
            email=email,
            username=email,
            password=password,
        )

        user = self.create_update_user(create_data, update_data, user, 'Google', profile_picture, sign_up)
        serializer = UserLoginResponseSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @may_fail(User.DoesNotExist, 'Invalid user')
    @action(detail=False, methods=['post'])
    def continue_with_facebook(self, request):
        data = json.loads(request.body.decode('utf-8'))
        access_token = data.get('accessToken')
        sign_up = data.get('signUp', False)
        try:
            graph = facebook.GraphAPI(access_token=access_token)
            user_info = graph.get_object(
                id='me',
                fields='first_name, last_name, id, email, picture.type(large)'
            )
        except facebook.GraphAPIError:
            return Response('Invalid data', status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.filter(facebook_id=user_info.get('id')).first()
        if user:
            if not user.is_active:
                return Response( 'The account has been removed', status=HTTP_404_NOT_FOUND)

        facebook_id = user_info.get('id')
        facebook_token = access_token
        password = User.objects.make_random_password()
        first_name = user_info.get('first_name', '')
        last_name = user_info.get('last_name', '')
        name = first_name + ' ' + last_name
        email = user_info.get('email') or f'{facebook_id}@crowdbotics.com'

        profile_picture = user_info.get('picture').get('data').get('url')

        update_data = dict(
            facebook_token=facebook_token,
            facebook_id=facebook_id,
            email_verified=True,
        )

        create_data = dict(
            name=name,
            first_name=first_name,
            last_name=last_name,
            email=email,
            username=email,
            password=password,
        )

        user = self.create_update_user(create_data, update_data, user, 'Facebook', profile_picture, sign_up)

        serializer = UserLoginResponseSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @may_fail(User.DoesNotExist, 'Invalid user')
    @action(detail=False, methods=['post'])
    def continue_with_apple(self, request):
        data = request.data
        sign_up = data.get('signUp', False)
        identity_token = data.get('identityToken', None)
        try:
            decoded = jwt.decode(
                jwt=identity_token,
                key='',
                algorithms=['HS256'],
                options={
                    "verify_signature": False,
                    "verify_exp": True
                }
            )
        except:
            return Response('Invalid token', status=status.HTTP_400_BAD_REQUEST)

        email = decoded.get('email', None)

        password = User.objects.make_random_password()
        identity_token = data.get('identityToken', None)
        name = ''
        first_name = ''
        last_name = ''
        full_name = data.get('fullName', None)
        if full_name:
            first_name = full_name.get('givenName', '')
            last_name = full_name.get('familyName', '')
        if first_name and last_name:
            name = first_name + ' ' + last_name

        apple_id = decoded.get('id', None)
        apple_token = identity_token

        user = User.objects.filter(username=email).first()
        if user:
            if not user.is_active:
                return Response( 'The account has been removed', status=HTTP_404_NOT_FOUND)

        update_data = dict(
            apple_id=apple_id,
            apple_token=apple_token,
            email_verified=True,
        )

        create_data = dict(
            name=name,
            first_name=first_name if first_name else '',
            last_name=last_name if last_name else '',
            email=email,
            username=email,
            password=password,
        )

        user = self.create_update_user(create_data, update_data, user, 'Apple', None, sign_up)

        serializer = UserLoginResponseSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @may_fail(User.DoesNotExist, 'Invalid email or password. Please try again')
    @action(detail=False, methods=['post'])
    def login(self, request):
        email = request.data.get('email')
        user = User.objects.get(email=email)
        if user.is_superuser:
            if settings.ALLOW_SUPER_USERS_LOGIN:
                return Response(UserLoginResponseSerializer(user).data)
            else:
                return Response("Unsupported account type", status=status.HTTP_400_BAD_REQUEST)
        if not user.email_verified:
            return Response("Please verify your email address", status=status.HTTP_400_BAD_REQUEST)
        # if not user.phone_verified:
        #     return Response("Please verify your phone number", status=status.HTTP_400_BAD_REQUEST)
        if not user.is_active:
            return Response("The account has been removed", status=status.HTTP_400_BAD_REQUEST)
        if not user.check_password(request.data.get('password')):
            return Response("Invalid email or password. Please try again", status=status.HTTP_400_BAD_REQUEST)
        return Response(UserLoginResponseSerializer(user).data)

    @action(detail=False, methods=['get'], url_path='activate/(?P<slug>[A-Za-z0-9-_.]+)')
    def activate(self, request, slug=None):
        base_url = settings.REDIRECT_DEEP_LINK
        splitted_data = slug.split('-_-')
        if len(splitted_data) != 2:
            return Response( 'Invalid link', status=status.HTTP_400_BAD_REQUEST)

        user_id, token = splitted_data

        # Check if the user is on a mobile device
        user_agent = get_user_agent(request)
        if user_agent.is_mobile or user_agent.is_tablet:
            url = f'{base_url}://activate-user/{user_id}/{token}/'
            HttpResponseRedirect.allowed_schemes.append(base_url)
            return HttpResponseRedirect(url)

        # For non-mobile users, render a template
        try:
            user = get_user_by_uidb64(user_id)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response('User not found', status=status.HTTP_400_BAD_REQUEST)

        if not default_token_generator.check_token(user, token):
            # Resend confirmation email
            send_email_with_template(
                subject=f'{settings.PROJECT_NAME} - Verification Link',
                email=user.email,
                template_to_load='emails/activate_user_email.html',
                context={
                    "name": user.email,
                    "verification_link": create_user_activation_link(user, request),
                }
            )
            user.last_verification_email_sent = timezone.now()
            user.save()
            return Response('Token is invalid or expired. We sent another confirmation email.', status=status.HTTP_400_BAD_REQUEST)

        user.email_verified = True
        user.save()
        context = {
            "project_name": settings.PROJECT_NAME,
        }
        return render(request, 'activate_account.html', context)


    @action(detail=False, methods=['post'])
    def resend_verification_email(self, request):
        email = request.data.get('email')
        user = User.objects.filter(email=email).first()
        if user:
            if user.email_verified:
                return Response('Email already verified', status=HTTP_400_BAD_REQUEST)
            last_verification_email_sent = user.last_verification_email_sent
            if last_verification_email_sent and (timezone.now() - last_verification_email_sent).seconds < 300:
                return Response('Please wait for 5 minutes before sending another verification email',
                                status=HTTP_400_BAD_REQUEST)
            send_email_with_template(
                subject=f'{settings.PROJECT_NAME} - Verification Link',
                email=user.email,
                template_to_load='emails/activate_user_email.html',
                context={
                    "name": user.email,
                    "verification_link": create_user_activation_link(user, request),
                }
            )
            user.last_verification_email_sent = timezone.now()
            user.save()
            return Response('Verification email sent', status=HTTP_200_OK)
        return Response('The email is invalid', status=HTTP_400_BAD_REQUEST)