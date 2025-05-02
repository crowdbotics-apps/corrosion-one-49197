from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver

from jobs.helpers import accept_bid
from payments.models import Transaction

@receiver(pre_save, sender=Transaction)
def transaction_status_changed(sender, instance, **kwargs):
    if instance.pk:
        try:
            old_instance = sender.objects.get(pk=instance.pk)
            old_status = old_instance.status
            new_status = instance.status

            if old_status != new_status:
                if new_status == Transaction.COMPLETED:
                    # Action for completed transactions
                    pass
                elif new_status == Transaction.FAILED:
                    # Action for failed transactions
                    pass
                elif new_status == Transaction.HELD:
                    job = instance.job
                    inspector = instance.recipient.inspector
                    bid = job.bids.filter(inspector=inspector).first()
                    accept_bid(bid)

        except sender.DoesNotExist:
            # Object doesn't exist yet
            pass