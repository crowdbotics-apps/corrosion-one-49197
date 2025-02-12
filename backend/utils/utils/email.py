from random import random

from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.template import loader
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode

from django.conf import settings

def send_email_with_template(subject, email, context, template_to_load):
    """
    Send an email with an HTML template to the specified email address.
    """
    updated_context = {
        **context,
        'project_name': settings.PROJECT_NAME,
        'logo_url': settings.LOGO_URL,
    }
    template = loader.get_template(template_to_load)
    html_content = template.render(updated_context)
    send_mail(
        subject,
        html_content,
        settings.DEFAULT_FROM_EMAIL,
        [email],
        html_message=html_content,
    )

def create_email_verification_link(user):
    """
    Method that returns a verification link
    """
    confirmation_token = default_token_generator.make_token(user)
    custom_for_deep_link = settings.CUSTOM_FOR_DEEP_LINK
    verification_link = f'{custom_for_deep_link}?uidb64={urlsafe_base64_encode(force_bytes(user.pk))}&token={confirmation_token}'
    return verification_link