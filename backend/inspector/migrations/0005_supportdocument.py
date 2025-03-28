# Generated by Django 5.1.6 on 2025-02-18 17:17

import django.db.models.deletion
import django.utils.timezone
import model_utils.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('inspector', '0004_remove_inspector_cities_inspector_regions'),
    ]

    operations = [
        migrations.CreateModel(
            name='SupportDocument',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', model_utils.fields.AutoCreatedField(default=django.utils.timezone.now, editable=False, verbose_name='created')),
                ('modified', model_utils.fields.AutoLastModifiedField(default=django.utils.timezone.now, editable=False, verbose_name='modified')),
                ('document', models.FileField(upload_to='support-documents')),
                ('inspector', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='support_documents', to='inspector.inspector')),
            ],
            options={
                'ordering': ['-id'],
            },
        ),
    ]
