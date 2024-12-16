from django.contrib.auth.models import AbstractUser
from django.db import models
from django.urls import reverse
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from timezone_field import TimeZoneField


class User(AbstractUser):
    # WARNING!
    """
    Some officially supported features of Crowdbotics Dashboard depend on the initial
    state of this User model (Such as the creation of superusers using the CLI
    or password reset in the dashboard). Changing, extending, or modifying this model
    may lead to unexpected bugs and or behaviors in the automated flows provided
    by Crowdbotics. Change it at your own risk.


    This model represents the User instance of the system, login system and
    everything that relates with an `User` is represented by this model.
    """

    name = models.CharField(_("Name of User"), blank=True, null=True, max_length=255)
    biometrics_key = models.CharField(_("Biometrics Key"), blank=True, null=True)
    email_verified = models.BooleanField(_("Email Verified"), default=False)
    google_id = models.CharField('ID for Google', max_length=64, blank=True, null=True)
    google_token = models.TextField('Token for Google', blank=True, null=True)
    facebook_id = models.CharField('ID for Facebook', max_length=64, blank=True, null=True)
    facebook_token = models.TextField('Token for Facebook', blank=True, null=True)
    apple_id = models.CharField('ID for Apple', max_length=64, blank=True, null=True)
    apple_token = models.TextField('Token for Apple', blank=True, null=True)
    timezone = TimeZoneField(default='Etc/UTC')
    stripe_account_link = models.URLField(_("Account Link"), blank=True, null=True)

    stripe_customer_id = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        help_text='Stripe Customer (consumer facing) ID',
    )
    stripe_account_id = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        help_text='Stripe Connected Account ID',
    )

    stripe_account_linked = models.BooleanField(default=False)

    last_activity = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-id']
        verbose_name = 'Admin'
        verbose_name_plural = 'Admins'

    def get_absolute_url(self):
        return reverse("users:detail", kwargs={"username": self.username})

    @property
    def is_admin(self):
        return self.is_staff or self.is_superuser


def code_live_time():
    """
    Return the expiration time for the verification code
    """
    return timezone.now() + timezone.timedelta(hours=1)


class UserVerificationCode(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    verification_code = models.CharField(_("Verification code"), max_length=6)
    expires_on = models.DateTimeField(_("Expires On"), default=code_live_time)
    timestamp = models.DateTimeField(_("Timestamp"), auto_now_add=True)
    active = models.BooleanField(default=True)
