from cities_light.models import Region
from django.contrib.postgres.fields import ArrayField
from django.db import models
import uuid
from django.db import models
from django.utils import timezone
from datetime import timedelta
from model_utils.models import TimeStampedModel

from configuration import configs
from inspector.models import Credential, Inspector
from owner.models import Owner, Industry
from users.models import User


class JobDocument(TimeStampedModel):
    job = models.ForeignKey('Job', on_delete=models.CASCADE, related_name='documents')
    document = models.FileField(upload_to='job_documents/')

    class Meta:
        ordering = ['-id']

    def __str__(self):
        return f'{self.job.title} - {self.document}'

class Job(TimeStampedModel):
    class JobStatus(models.TextChoices):
        DRAFT = 'draft', 'Draft'
        PENDING = 'pending', 'Pending'
        AWAITING_PAYMENT = 'awaiting_payment', 'Awaiting Payment'
        STARTED = 'started', 'Started'
        FINISHED_BY_INSPECTOR = 'finished_by_inspector', 'Finished by Inspector'
        FINISHED = 'finished', 'Finished'
        CANCELED = 'canceled', 'Canceled'

    class PaymentMode(models.TextChoices):
        DAILY = 'daily', 'Daily'
        PER_DIEM = 'per_diem', 'Per Diem'
        MILEAGE = 'mileage', 'Mileage'
        MISC_OTHER = 'misc_other', 'Misc/Other'

    title = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    industries = models.ManyToManyField(Industry, blank=True)
    created_by = models.ForeignKey(Owner, on_delete=models.CASCADE, related_name='jobs')
    inspector = models.ForeignKey(Inspector, on_delete=models.CASCADE, related_name='jobs', null=True, blank=True)
    certifications = models.ManyToManyField(Credential)
    active = models.BooleanField(default=True)
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=21, choices=JobStatus.choices, default=JobStatus.PENDING)
    daily_rate = models.DecimalField(decimal_places=2, max_digits=10, default=0)
    per_diem_rate = models.DecimalField(decimal_places=2, max_digits=10, default=0)
    mileage_rate = models.DecimalField(decimal_places=2, max_digits=10, default=0)
    misc_other_rate = models.DecimalField(decimal_places=2, max_digits=10, default=0)
    payment_modes = ArrayField(
        base_field=models.CharField(
            max_length=20,
            choices=PaymentMode.choices
        ),
        default=list,
        blank=True,
    )
    views = models.IntegerField(default=0)
    address = models.TextField(null=True, blank=True)
    regions = models.ManyToManyField(Region, blank=True)

    @property
    def days(self):
        if not self.start_date or not self.end_date:
            return 0
        return (self.end_date - self.start_date).days

    @property
    def total_amount(self):
        total = 0
        if 'daily' in self.payment_modes:
            total += self.daily_rate * self.days
        if 'per_diem' in self.payment_modes:
            total += self.per_diem_rate * self.days
        if 'mileage' in self.payment_modes:
            bid = self.bids.filter(status=Bid.StatusChoices.ACCEPTED).first()
            if bid:
                total += bid.mileage * self.mileage_rate
        if 'misc_other' in self.payment_modes:
            total += self.misc_other_rate
        return total

    @property
    def total_amount_is_partial(self):
        partial = False
        if 'mileage' in self.payment_modes:
            bid = self.bids.filter(status=Bid.StatusChoices.ACCEPTED).first()
            if not bid or bid.mileage == 0:
                partial = True
        return partial

    @property
    def total_with_fees(self):
        total = self.total_amount
        platform_fees = total * configs.OWNER_CHARGE_PERCENT / 100
        total_plus_fees = total + platform_fees
        return total_plus_fees

    @property
    def total_to_pay_to_inspector(self):
        total = self.total_amount
        platform_fees = total * configs.INSPECTOR_CHARGE_PERCENT / 100
        total_less_fees = total - platform_fees
        return total_less_fees


    class Meta:
        ordering = ['-id']

    def __str__(self):
        return self.title

class JobFavorite(models.Model):
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='favorites')
    inspector = models.ForeignKey(Inspector, on_delete=models.CASCADE, related_name='favorites')

    def __str__(self):
        return f'{self.inspector.user.username} - {self.job.title}'


class Bid(TimeStampedModel):
    class StatusChoices(models.TextChoices):
        PENDING = 'pending', 'Pending'
        ACCEPTED = 'accepted', 'Accepted'
        REJECTED = 'rejected', 'Rejected'
        CANCELED = 'canceled', 'Canceled'
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='bids')
    inspector = models.ForeignKey(Inspector, on_delete=models.CASCADE, related_name='bids')
    status = models.CharField(max_length=10, choices=StatusChoices.choices, default=StatusChoices.PENDING)
    mileage = models.DecimalField(decimal_places=0, max_digits=10, default=0)
    note = models.TextField(null=True, blank=True)

    class Meta:
        ordering = ['-id']

    def __str__(self):
        return f'{self.job.title} - {self.inspector.user.name}'



class MagicLinkToken(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    token = models.CharField(max_length=255, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_used = models.BooleanField(default=False)
    expires_at = models.DateTimeField()

    def save(self, *args, **kwargs):
        if not self.token:
            self.token = str(uuid.uuid4())
        if not self.expires_at:
            # Token expires in 30 minutes (example)
            self.expires_at = timezone.now() + timedelta(minutes=30)
        super().save(*args, **kwargs)

    def is_valid(self):
        return (not self.is_used) and (timezone.now() < self.expires_at)