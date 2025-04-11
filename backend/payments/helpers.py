from payments.stripe_api import StripeClient


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
