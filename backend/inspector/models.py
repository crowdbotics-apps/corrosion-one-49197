from django.core.exceptions import ValidationError
from django.db import models

from users.models import User
from model_utils.models import TimeStampedModel
from cities_light.models import City, Region

class Credential(TimeStampedModel):
    name = models.CharField(max_length=255, null=True, blank=True)
    description = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.name

class Inspector(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='inspector')
    credentials = models.ManyToManyField(Credential, blank=True)
    regions = models.ManyToManyField(Region, blank=True)
    languages = models.ManyToManyField('Language', blank=True)
    date_of_birth = models.DateField(null=True, blank=True)


    class Meta:
        ordering = ['-id']

    @property
    def status(self):
        if self.user.phone_verified:
            return 4
        if self.regions.exists():
            return 3
        if self.user.first_name:
            return 2
        return 1

def file_size(value): # add this to some file where you can import it from
    limit = 20 * 1024 * 1024
    if value.size > limit:
        raise ValidationError('File too large. Size should not exceed 20 MiB.')

class SupportDocument(TimeStampedModel):
    inspector = models.ForeignKey(Inspector, on_delete=models.CASCADE, related_name='support_documents')
    document = models.FileField(upload_to='support-documents', validators=[file_size])
    class Meta:
        ordering = ['-id']

    def __str__(self):
        return self.document.name


class Language(TimeStampedModel):
    name = models.CharField(max_length=255, null=True, blank=True)

    def __str__(self):
        return self.name

