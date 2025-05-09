# Generated by Django 5.1.4 on 2024-12-16 16:23

import django.contrib.auth.models
import django.contrib.auth.validators
import django.db.models.deletion
import django.utils.timezone
import timezone_field.fields
import users.models
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('is_superuser', models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('username', models.CharField(error_messages={'unique': 'A user with that username already exists.'}, help_text='Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.', max_length=150, unique=True, validators=[django.contrib.auth.validators.UnicodeUsernameValidator()], verbose_name='username')),
                ('first_name', models.CharField(blank=True, max_length=150, verbose_name='first name')),
                ('last_name', models.CharField(blank=True, max_length=150, verbose_name='last name')),
                ('email', models.EmailField(blank=True, max_length=254, verbose_name='email address')),
                ('is_staff', models.BooleanField(default=False, help_text='Designates whether the user can log into this admin site.', verbose_name='staff status')),
                ('is_active', models.BooleanField(default=True, help_text='Designates whether this user should be treated as active. Unselect this instead of deleting accounts.', verbose_name='active')),
                ('date_joined', models.DateTimeField(default=django.utils.timezone.now, verbose_name='date joined')),
                ('name', models.CharField(blank=True, max_length=255, null=True, verbose_name='Name of User')),
                ('biometrics_key', models.CharField(blank=True, null=True, verbose_name='Biometrics Key')),
                ('email_verified', models.BooleanField(default=False, verbose_name='Email Verified')),
                ('google_id', models.CharField(blank=True, max_length=64, null=True, verbose_name='ID for Google')),
                ('google_token', models.TextField(blank=True, null=True, verbose_name='Token for Google')),
                ('facebook_id', models.CharField(blank=True, max_length=64, null=True, verbose_name='ID for Facebook')),
                ('facebook_token', models.TextField(blank=True, null=True, verbose_name='Token for Facebook')),
                ('apple_id', models.CharField(blank=True, max_length=64, null=True, verbose_name='ID for Apple')),
                ('apple_token', models.TextField(blank=True, null=True, verbose_name='Token for Apple')),
                ('timezone', timezone_field.fields.TimeZoneField(default='Etc/UTC')),
                ('stripe_account_link', models.URLField(blank=True, null=True, verbose_name='Account Link')),
                ('stripe_customer_id', models.CharField(blank=True, help_text='Stripe Customer (consumer facing) ID', max_length=255, null=True)),
                ('stripe_account_id', models.CharField(blank=True, help_text='Stripe Connected Account ID', max_length=255, null=True)),
                ('stripe_account_linked', models.BooleanField(default=False)),
                ('last_activity', models.DateTimeField(auto_now=True)),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.group', verbose_name='groups')),
                ('user_permissions', models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.permission', verbose_name='user permissions')),
            ],
            options={
                'verbose_name': 'Admin',
                'verbose_name_plural': 'Admins',
                'ordering': ['-id'],
            },
            managers=[
                ('objects', django.contrib.auth.models.UserManager()),
            ],
        ),
        migrations.CreateModel(
            name='UserVerificationCode',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('verification_code', models.CharField(max_length=6, verbose_name='Verification code')),
                ('expires_on', models.DateTimeField(default=users.models.code_live_time, verbose_name='Expires On')),
                ('timestamp', models.DateTimeField(auto_now_add=True, verbose_name='Timestamp')),
                ('active', models.BooleanField(default=True)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
