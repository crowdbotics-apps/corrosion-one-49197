# Generated by Django 5.1.6 on 2025-02-18 17:30

import django.utils.timezone
import model_utils.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('inspector', '0005_supportdocument'),
    ]

    operations = [
        migrations.CreateModel(
            name='Language',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', model_utils.fields.AutoCreatedField(default=django.utils.timezone.now, editable=False, verbose_name='created')),
                ('modified', model_utils.fields.AutoLastModifiedField(default=django.utils.timezone.now, editable=False, verbose_name='modified')),
                ('name', models.CharField(blank=True, max_length=255, null=True)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.AddField(
            model_name='inspector',
            name='date_of_birth',
            field=models.DateField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='inspector',
            name='languages',
            field=models.ManyToManyField(blank=True, to='inspector.language'),
        ),
    ]
