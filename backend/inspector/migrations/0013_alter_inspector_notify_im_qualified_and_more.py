# Generated by Django 5.1.8 on 2025-04-23 18:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('inspector', '0012_alter_credential_options_credential_order'),
    ]

    operations = [
        migrations.AlterField(
            model_name='inspector',
            name='notify_im_qualified',
            field=models.BooleanField(default=True),
        ),
        migrations.AlterField(
            model_name='inspector',
            name='notify_job_applied',
            field=models.BooleanField(default=True),
        ),
        migrations.AlterField(
            model_name='inspector',
            name='notify_new_message',
            field=models.BooleanField(default=True),
        ),
    ]
