# Generated by Django 5.1.6 on 2025-02-19 21:13

import corrosion_one_49197.storage_backends
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0013_alter_user_profile_picture'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='profile_picture',
            field=models.ImageField(blank=True, null=True, storage=corrosion_one_49197.storage_backends.AzureMediaStorage(), upload_to='profile-picture'),
        ),
    ]
