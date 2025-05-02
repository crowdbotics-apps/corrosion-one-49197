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
        created_by=user_owner,
        recipient=user_inspector,
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
            "user_owner_id": tx.created_by.id,
            "user_inspector_id": tx.recipient.id if tx.recipient else None,
            "held": True
        }
    )


    if hasattr(payment_intent, 'status'):
        if payment_intent.status == "succeeded":
            tx.stripe_payment_intent_id = payment_intent.id
            tx.transfer_group = transfer_group
            tx.status = Transaction.HELD
            tx.save()
        else:
            tx.status = Transaction.FAILED
            tx.save()

            message = f"PaymentIntent not succeeded: {payment_intent.status}" if hasattr(payment_intent, 'status') else payment_intent.user_message

            return tx, message
    if hasattr(payment_intent, 'user_message'):
        tx.status = Transaction.FAILED
        tx.save()
        return tx, payment_intent.user_message
    return tx, None


def release_funds_to_inspector(tx_id, commission_rate=0):
    """

    """
    tx = Transaction.objects.get(id=tx_id)

    if tx.status != Transaction.HELD:
        return None, f"Transaction {tx.id} cannot be released (status={tx.get_status_display()})."

    inspector = tx.recipient
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
        tx.save()
    else:
        return None, transfer.user_message

    return tx, None


@transaction.atomic
def charge_pending_amount(tx_id):
    """
    Charge the pending amount for a transaction.

    Args:
        tx_id (int): The ID of the transaction to charge.

    Returns:
        tuple: A tuple containing the transaction and an error message (if any).
    """
    tx = Transaction.objects.get(id=tx_id)

    if tx.status != Transaction.PENDING:
        return None, f"Transaction {tx.id} cannot be charged (status={tx.status})."
    payment_method = tx.created_by.stripe_cards.filter(default=True).first()
    if not payment_method:
        return None, "Please add a card before continue"

    stripe_client = StripeClient()
    payment_intent = stripe_client.create_payment_intent(
        amount=int(tx.amount * 100),
        description=tx.description,
        currency=tx.currency,
        payment_method_id=payment_method.card_id,
        customer=tx.created_by.stripe_customer_id,
        metadata={
            "transaction_id": tx.id,
            "user_owner_id": tx.created_by.id,
            "user_inspector_id": tx.recipient.id if tx.recipient else None,
            "held": False
        },
        account_id=tx.recipient.stripe_account_id
    )

    if hasattr(payment_intent, 'status'):
        if payment_intent.status == "succeeded":
            tx.stripe_payment_intent_id = payment_intent.id
            tx.status = Transaction.COMPLETED
            tx.save()
        else:
            tx.status = Transaction.FAILED
            tx.save()

            message = f"PaymentIntent not succeeded: {payment_intent.status}" if hasattr(payment_intent, 'status') else payment_intent.user_message
            return tx, message
    if hasattr(payment_intent, 'user_message'):
        tx.status = Transaction.FAILED
        tx.save()
        return tx, payment_intent.user_message
    return tx, None