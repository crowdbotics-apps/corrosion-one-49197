from cities_light.models import Region
from django.contrib.postgres.fields import ArrayField
from django.db import models
import uuid
from django.db import models
from django.utils import timezone
from datetime import timedelta
from model_utils.models import TimeStampedModel

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
        PENDING = 'pending', 'Pending'
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
    description = models.TextField()
    industries = models.ManyToManyField(Industry, blank=True)
    created_by = models.ForeignKey(Owner, on_delete=models.CASCADE, related_name='jobs')
    inspector = models.ForeignKey(Inspector, on_delete=models.CASCADE, related_name='jobs', null=True, blank=True)
    certifications = models.ManyToManyField(Credential)
    active = models.BooleanField(default=True)
    start_date = models.DateField()
    end_date = models.DateField()
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