import uuid

from django.conf import settings
from django.db.models import Sum

from inspector.models import Inspector
from jobs.models import MagicLinkToken, Bid, Job
from notifications.models import Notification
from payments.models import Transaction
from utils.utils import send_notifications
from utils.utils.email import send_email_with_template
from utils.utils.send_sms import send_sms


def send_emails_to_inspectors(job):
    certifications = job.certifications.all()
    job_regions = job.regions.all()
    inspector_ids = []
    for certification in certifications:
        inspector_ids_credential = list(certification.documents.values_list('inspector_id', flat=True))
        inspector_ids.extend(inspector_ids_credential)
    inspector_ids_to_send = list(set(inspector_ids))
    for inspector_id in inspector_ids_to_send:
        inspector = Inspector.objects.filter(id=inspector_id, regions__in=job_regions).first()
        if not inspector:
            continue
        if not inspector.notify_im_qualified:
            continue
        user = inspector.user
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
                "company_logo": job.created_by.logo.url if job.created_by.logo else settings.LOGO_URL,
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

def accept_bid(bid):
    job = bid.job
    if job.status == Job.JobStatus.STARTED:
        return
    other_bids = Bid.objects.filter(job=job).exclude(id=bid.id)
    for other_bid in other_bids:
        other_bid.status = Bid.StatusChoices.REJECTED
        other_bid.save()
        if other_bid.inspector.notify_job_applied:
            send_notifications(
                users=[other_bid.inspector.user],
                title=f'Bid Rejected - {job.title}',
                description=f'Your bid for the job "{job.title}" has been rejected.',
                extra_data={
                    'job_id': job.id,
                },
                n_type=Notification.NotificationType.BID_REJECTED,
                channel=Notification.NotificationChannel.EMAIL,
            )
    if bid.inspector.notify_job_applied:
        send_notifications(
            users=[bid.inspector.user],
            title=f'Bid Accepted - {job.title}',
            description=f'Your bid for the job "{job.title}" has been accepted.',
            extra_data={
                'job_id': job.id,
            },
            n_type=Notification.NotificationType.BID_ACCEPTED,
            channel=Notification.NotificationChannel.EMAIL,
        )
    bid.status = Bid.StatusChoices.ACCEPTED
    bid.save()
    job.status = Job.JobStatus.STARTED
    job.inspector = bid.inspector
    job.save()

def job_pending_amount(job):
    """
    Calculate the total amount of all pending transactions for a job.

    Args:
        job (Job): The job object for which to calculate the pending amount.

    Returns:
        Decimal: The total amount of all pending transactions for the job.
    """
    if not job:
        return 0
    total_amount_transactions = Transaction.objects.filter(
        job=job,
        status__in=[Transaction.HELD, Transaction.COMPLETED],
    ).aggregate(total=Sum('amount'))['total'] or 0

    pending_amount = job.total_amount - total_amount_transactions
    return pending_amount