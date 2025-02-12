from django.db import models

from users.models import User
from model_utils.models import TimeStampedModel
from cities_light.models import City, Region

class Credential(TimeStampedModel):
    name = models.CharField(max_length=255, null=True, blank=True)
    description = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.name

# Create your models here.
class Inspector(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='inspector')
    credentials = models.ManyToManyField(Credential, blank=True)
    regions = models.ManyToManyField(Region, blank=True)


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