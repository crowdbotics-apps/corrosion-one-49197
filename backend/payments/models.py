import logging

from django.conf import settings
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from model_utils.models import TimeStampedModel

from jobs.models import Job

logger = logging.getLogger('django')

# Create your models here.

class StripeCard(TimeStampedModel):
    """
    Model representing a Stripe card associated with a user.

    Attributes:
        user (ForeignKey): Reference to the user who owns the card.
        card_id (str): Unique identifier for the card.
        exp_month (int): Expiration month of the card.
        exp_year (int): Expiration year of the card.
        funding (str): Funding type of the card (e.g., credit, debit).
        last4 (str): Last four digits of the card number.
        country (str): Country of the card issuer.
        brand (str): Brand of the card (e.g., Visa, MasterCard).
        metadata (str): Additional metadata associated with the card.
        default (bool): Indicates if this card is the default card for the user.
    """

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name='stripe_cards')
    card_id = models.CharField(max_length=255)
    exp_month = models.IntegerField()
    exp_year = models.IntegerField()
    funding = models.CharField(max_length=16)
    last4 = models.CharField(max_length=16)
    country = models.CharField(max_length=16)
    brand = models.CharField(max_length=32)
    metadata = models.TextField()
    default = models.BooleanField(default=False)

    class Meta:
        ordering = ['-id']

    def __str__(self):
        """
        Returns a string representation of the StripeCard instance.

        Returns:
            str: String representation of the StripeCard instance.
        """
        return '{} - {} - {}'.format(self.pk, self.brand, self.user.username)


class Transaction(TimeStampedModel):
    """
    Model representing a financial transaction.

    Attributes:
        transaction_id (str): Unique identifier for the transaction.
        amount (Decimal): Amount of the transaction.
        currency (str): Currency of the transaction.
        created_by (ForeignKey): Reference to the user who created the transaction.
        stripe_payment_intent_id (str): Stripe Payment Intent ID associated with the transaction.
        status (int): Status of the transaction (e.g., pending, completed).
        transaction_type (int): Type of the transaction (e.g., debit, credit).
        description (str): Description of the transaction.
        stripe_response (JSONField): JSON response from Stripe.
    """

    # Define the status choices as class constants
    PENDING = 10
    HELD = 15
    PROCESSING = 17
    COMPLETED = 20
    FAILED = 30
    CANCELLED = 40

    # A list of tuples that defines the choices for the status field
    STATUS_CHOICES = [
        (PENDING, 'Pending'),
        (HELD, 'Held'),
        (PROCESSING, 'Processing'),
        (COMPLETED, 'Completed'),
        (FAILED, 'Failed'),
        (CANCELLED, 'Cancelled'),
    ]

    DEBIT = 10
    CREDIT = 20

    TRANSACTION_TYPE = (
        (DEBIT, 'Debit'),
        (CREDIT, 'Credit'),
    )

    # Basic transaction details
    transaction_id = models.CharField(max_length=100, null=True, blank=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=10)
    # Created by / owner
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name='created_by_transactions', null=True, blank=True)
    # Recipient / inspector
    recipient = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name='recipient_transactions', null=True, blank=True)
    job = models.ForeignKey(Job, on_delete=models.PROTECT, related_name='transactions', null=True, blank=True)

    # Stripe Payment Intent details
    stripe_payment_intent_id = models.CharField(max_length=100, null=True, blank=True)
    stripe_transfer_id = models.CharField(max_length=100, null=True, blank=True)
    status = models.IntegerField(choices=STATUS_CHOICES, default=PENDING)
    transaction_type = models.IntegerField(choices=TRANSACTION_TYPE, default=CREDIT)
    description = models.TextField(blank=True, null=True)
    stripe_response = models.JSONField(blank=True, null=True)
    transfer_group = models.CharField(max_length=100, null=True, blank=True)


    def __str__(self):
        """
        Returns a string representation of the Transaction instance.

        Returns:
            str: String representation of the Transaction instance.
        """
        return self.transaction_id

    class Meta:
        verbose_name = 'Transaction'
        verbose_name_plural = 'Transactions'
        ordering = ['-created']
