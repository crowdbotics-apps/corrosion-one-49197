import uuid

from django.conf import settings

from inspector.models import Inspector
from jobs.models import MagicLinkToken
from notifications.models import Notification
from utils.utils import send_notifications
from utils.utils.email import send_email_with_template
from utils.utils.send_sms import send_sms


def send_emails_to_inspectors(job):
    certifications = job.certifications.all()
    inspector_ids = []
    for certification in certifications:
        inspector_ids_credential = list(certification.documents.values_list('inspector_id', flat=True))
        inspector_ids.extend(inspector_ids_credential)
    inspector_ids_to_send = list(set(inspector_ids))
    for inspector_id in inspector_ids_to_send:
        user = Inspector.objects.get(id=inspector_id).user

        magic_token = MagicLinkToken.objects.create(
            user=user,
            token=str(uuid.uuid4()) + '-' + str(job.id)
        )
        # url = f"{request.scheme}://{request.get_host()}/#/jtv/{magic_token.token}"
        # TODO: CHECK THIS LATER
        url = f'https://app.corrosionone.com/#/jtv/{magic_token.token}'
        send_email_with_template(
            subject=f'New Job Created - {settings.PROJECT_NAME}',
            email=user.email,
            template_to_load='emails/new_job_email_link.html',
            context={
                "username": user.first_name,
                "link": url,
                "company_name": job.created_by.company_name,
                "job_title": job.title,
                "job_description": job.description,
                "job_start_date": job.start_date,
                "job_end_date": job.end_date,
                "job_address": job.address,
                "user_phone_number": user.phone_number.as_e164 if user.phone_number else None,
            }
        )
        if user.phone_number:
            message = f"Hello {user.first_name},\n\nA new job has been created. Please check your this {url} for more details.\n\nBest regards,\n{settings.PROJECT_NAME}"
            send_sms(message, user.phone_number.as_e164)

        send_notifications(
            users=[user],
            title=f'New Job Available - {job.title}',
            description=f'A new job has been created. Please check your email for more details.',
            extra_data={
                'job_id': job.id,
                'url': url
            },
            n_type=Notification.NotificationType.JOB_AVAILABLE,
            channel=Notification.NotificationChannel.EMAIL,
        )
    return None