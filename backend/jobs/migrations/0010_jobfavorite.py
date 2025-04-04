# Generated by Django 5.1.6 on 2025-03-31 20:00

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('inspector', '0011_rename_credential_inspector_credentials'),
        ('jobs', '0009_job_address'),
    ]

    operations = [
        migrations.CreateModel(
            name='JobFavorite',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('inspector', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='favorites', to='inspector.inspector')),
                ('job', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='favorites', to='jobs.job')),
            ],
        ),
    ]
