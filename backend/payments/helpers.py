from django.db import transaction
from stripe import PaymentMethod

from payments.models import Transaction
from payments.stripe_api import StripeClient
from utils.utils import user_is_inspector


def create_stripe_customer(user):
    """
    Creates a Stripe customer for the given user if they do not already have a Stripe customer ID.

    Args:
        user (User): The user instance for whom the Stripe customer is to be created.

    Returns:
        None
    """
    stripe_client = StripeClient()
    if not user.stripe_customer_id:
        customer = stripe_client.create_customer(user)
        user.stripe_customer_id = customer.id
        user.save()


def create_stripe_account(user):
    if not user.stripe_account_id:
        stripe_client = StripeClient()
        provider = stripe_client.create_provider_account(user)
        user.stripe_account_id = provider.id
        user.save()

@transaction.atomic
def create_initial_transaction(user_owner, user_inspector, amount, job, currency="usd", description=""):
    """

    """
    payment_method = user_owner.stripe_cards.filter(default=True).first()
    if not payment_method:
        return None, "Please add a card before continue"
    customer = user_owner.stripe_customer_id
    if not customer:
        return None, "Customer id needed"

    tx = Transaction.objects.create(
        amount=amount,
        currency=currency,
        owner=user_owner,
        inspector=user_inspector,
        description=description,
        status=Transaction.PENDING,
        transaction_type=Transaction.DEBIT,
        job=job
    )

    transfer_group = f"group_tx_{tx.id}"

    stripe_client = StripeClient()

    payment_intent = stripe_client.create_payment_intent_held(
        amount=int(tx.amount * 100),  # en centavos
        currency=tx.currency,
        transfer_group=transfer_group,
        description=tx.description or "Inspoection service",
        payment_method_id=payment_method.card_id,
        customer=customer,
        metadata={
            "transaction_id": tx.id,
            "user_owner_id": tx.owner.id,
            "user_inspector_id": tx.inspector.id if tx.inspector else None,
        }
    )


    if hasattr(payment_intent, 'status') and payment_intent.status == "succeeded":
        # Actualiza la transacción
        tx.stripe_payment_intent_id = payment_intent.id
        tx.transfer_group = transfer_group
        tx.status = Transaction.HELD  # Fondos retenidos
        # tx.stripe_response = payment_intent
        tx.save()

    else:
        tx.status = Transaction.FAILED
        # tx.stripe_response = payment_intent
        tx.save()

        message = f"PaymentIntent not succeeded: {payment_intent.status}" if hasattr(payment_intent, 'status') else payment_intent.user_message

        return tx, message

    return tx, None


def release_funds_to_inspector(tx_id, commission_rate=0):
    """

    """
    tx = Transaction.objects.get(id=tx_id)

    if tx.status != Transaction.HELD:
        return None, f"Transaction {tx.id} cannot be released (status={tx.status})."

    inspector = tx.inspector
    if not inspector or not inspector.stripe_account_id:
        return None, "Inspector not set or doesn't have a stripe_account_id."
    if not inspector.stripe_payouts_enabled:
        return None, "Inspector doesn't have a payouts enabled."

    # Comission calculation
    total_cents = int(tx.amount * 100)
    if commission_rate > 0:
        # Example: if commission_rate = 0.10 => 10% comission
        commission_cents = int(total_cents * commission_rate)
        transfer_amount = total_cents - commission_cents
    else:
        transfer_amount = total_cents

    stripe_client = StripeClient()

    balance = stripe_client.check_stripe_balance()
    if balance <= 0:
        return None, "Error processing transaction please contact support "


    transfer = stripe_client.transfer_held_amount(
        amount=transfer_amount,
        currency=tx.currency,
        destination=inspector.stripe_account_id,
        transfer_group=tx.transfer_group,
    )
    # Actualiza la transacción
    if hasattr(transfer, 'created'):
        tx.stripe_transfer_id = transfer.id
        tx.status = Transaction.COMPLETED
        # tx.stripe_response = transfer
        tx.save()
    else:
        return None, transfer.user_message

    return tx, None
