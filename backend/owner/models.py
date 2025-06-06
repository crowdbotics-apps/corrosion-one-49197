from django.db import models

from users.models import User
from model_utils.models import TimeStampedModel

from utils.utils import file_size


class Industry(TimeStampedModel):
    name = models.CharField(max_length=255, null=True, blank=True)
    description = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = 'Industries'
        ordering = ['-id']

class Owner(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='owner')
    industry = models.ForeignKey(Industry, on_delete=models.SET_NULL, null=True, blank=True, related_name='owners')
    company_name = models.CharField(max_length=255, null=True, blank=True)
    address = models.TextField(null=True, blank=True)
    logo = models.ImageField(upload_to='owner-logo', null=True, blank=True, validators=[file_size])
    banner = models.ImageField(upload_to='owner-banner', null=True, blank=True, validators=[file_size])


    class Meta:
        ordering = ['-id']

    @property
    def status(self):
        if self.user.phone_verified:
            return 4
        if self.company_name:
            return 4
        return 1

    def __str__(self):
        return f'{self.user.first_name} {self.user.last_name} - {self.company_name}'