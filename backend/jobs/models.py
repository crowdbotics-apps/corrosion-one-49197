from django.db import models
from model_utils.models import TimeStampedModel

from inspector.models import Credential, Inspector
from owner.models import Owner


# Create your models here.

class JobCategory(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()


class Job(TimeStampedModel):
    class JobStatus(models.TextChoices):
        PENDING = 'pending', 'Pending'
        STARTED = 'started', 'Started'
        FINISHED = 'finished', 'Finished'
        CANCELED = 'canceled', 'Canceled'
    title = models.CharField(max_length=255)
    description = models.TextField()
    categories = models.ManyToManyField(JobCategory)
    created_by = models.ForeignKey(Owner, on_delete=models.CASCADE, related_name='jobs')
    certifications = models.ManyToManyField(Credential)
    active = models.BooleanField(default=True)
    start_date = models.DateField()
    end_date = models.DateField()
    status = models.CharField(max_length=10, choices=JobStatus.choices, default=JobStatus.PENDING)




    class Meta:
        ordering = ['-id']

    def __str__(self):
        return self.title


class Bid(TimeStampedModel):
    class StatusChoices(models.TextChoices):
        PENDING = 'pending', 'Pending'
        ACCEPTED = 'accepted', 'Accepted'
        REJECTED = 'rejected', 'Rejected'
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='bids')
    inspector = models.ForeignKey(Inspector, on_delete=models.CASCADE, related_name='bids')
    amount = models.DecimalField(decimal_places=2, max_digits=10)
    status = models.CharField(max_length=10, choices=StatusChoices.choices, default=StatusChoices.PENDING)
    note = models.TextField()