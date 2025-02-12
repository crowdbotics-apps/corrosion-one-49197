import random
from django.utils import timezone
from users.models import UserVerificationCode


def setup_verification_code(user, code_type):
    """
    Creates verification code
    """
    code = random.randint(100000, 999999)
    user_code = UserVerificationCode.objects.filter(user=user, code_type=code_type)
    if user_code.exists():
        user_code.delete()
    UserVerificationCode.objects.create(user=user, verification_code=code, code_type=code_type)

    return code


def get_verification_code(otp, code_type):
    code = UserVerificationCode.objects.filter(
        verification_code=otp,
        active=True,
        expires_on__gte=timezone.now(),
        code_type=code_type
    ).first()

    return code


def get_current_verification_code(user, code_type):
    code = UserVerificationCode.objects.filter(
        user=user,
        active=True,
        expires_on__gte=timezone.now(),
        code_type=code_type
    ).first()

    return code