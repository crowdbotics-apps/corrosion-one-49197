# Generated by Django 5.1.8 on 2025-04-10 20:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0019_user_cardholder_user_stripe_account_id_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='cardholder',
        ),
        migrations.AddField(
            model_name='user',
            name='stripe_account_linked',
            field=models.BooleanField(default=False),
        ),
    ]
