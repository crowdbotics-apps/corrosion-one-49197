import random
from django.utils import timezone
from users.models import UserVerificationCode


def setup_verification_code(user):
    """
    Creates verification code
    """
    code = random.randint(1000, 9999)
    user_code = UserVerificationCode.objects.filter(user=user)
    if user_code.exists():
        user_code.delete()
    UserVerificationCode.objects.create(user=user, verification_code=code)

    return code


def get_verification_code(otp):
    code = UserVerificationCode.objects.filter(
        verification_code=otp,
        active=True,
        expires_on__gte=timezone.now()
    ).first()

    return code