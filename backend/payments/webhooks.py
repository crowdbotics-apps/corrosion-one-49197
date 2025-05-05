import logging

import stripe
from django.conf import settings
from django.contrib.auth import get_user_model
from munch import munchify
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from sentry_sdk import capture_message, set_context
from stripe.error import CardError

from payments.models import Transaction
from utils.utils import send_notifications

# from financial import extract_dict_data
# from financial.utils import chargeAmountMP
# from home.helpers import send_notifications
# from users.models import Notification, User

User = get_user_model()

# Set the Stripe API key based on the environment (live or test)
if settings.STRIPE_LIVE_MODE:
    stripe.api_key = settings.STRIPE_LIVE_SECRET_KEY
else:
    stripe.api_key = settings.STRIPE_TEST_SECRET_KEY

logger = logging.getLogger('django')

# List of Stripe event types
'payment_intent.amount_capturable_updated'
'payment_intent.canceled'
'payment_intent.created'
'payment_intent.partially_funded'
'payment_intent.payment_failed'
'payment_intent.processing'
'payment_intent.requires_action'
'payment_intent.succeeded'
'payout.canceled'
'payout.created'
'payout.failed'
'payout.paid'
'payout.reconciliation_completed'
'payout.updated'


class StripeWebhookAPIView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]
    """
    API view to handle Stripe webhooks.
    """

    def __init__(self, *args, **kwargs):
        """
        Initialize the StripeWebhookAPIView with event listeners.
        """
        super(*args, **kwargs)
        self.listeners = {
            # 'payment_intent.amount_capturable_updated': log_stripe_event,
            'payment_intent.canceled': payment_intent_canceled,
            'payment_intent.created': payment_intent_created,
            'payment_intent.processing': payment_intent_processing,
            'payment_intent.partially_funded': payment_intent_failed,
            'payment_intent.payment_failed': payment_intent_failed,
            'payment_intent.requires_action': payment_intent_failed,
            'payment_intent.succeeded': payment_intent_succeeded,


            # 'payout.canceled': payout_canceled,
            # 'payout.created': payout_created,
            # 'payout.failed': payout_failed,
            # 'payout.paid': payout_succeeded,
            # 'payout.reconciliation_completed': log_stripe_event,
            # 'payout.updated': log_stripe_event

            # 'transfer.created': transfer_created,
            # 'transfer.failed': log_stripe_event,
            # 'transfer.paid': log_stripe_event,
        }

    def post(self, request):
        """
        Handle POST requests for Stripe webhooks.

        Args:
            request (Request): The HTTP request object.

        Returns:
            Response: The HTTP response object.
        """
        payload = request.body
        sig_header = request.headers['STRIPE_SIGNATURE']
        endpoint_secret = settings.STRIPE_WEBHOOK_SECRET

        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, endpoint_secret
            )
        except ValueError as e:  # Invalid payload
            return Response(status=400)
        except stripe.error.SignatureVerificationError as e:
            logger.error(e)
            return Response(status=400)

        # logger.error('Unhandled event type {}'.format(event))
        # logger.error('{}'.format("#" * 60))
        logger.info(event['type'])
        if event['type'] in self.listeners:
            listener = self.listeners[event['type']]
            if callable(listener):
                return listener(event)
            else:
                ret = None
                for sublistener in listener:  # list of listeners
                    ret = sublistener(event)
                return ret
        else:
            pass  # TODO add another necessary events

        return Response(status=200)


def log_stripe_event(event):
    """
    Log Stripe event.

    Args:
        event (dict): The Stripe event data.

    Returns:
        Response: The HTTP response object.
    """
    logger.info('sentry logged')
    print('Event', event)
    return Response()


def payment_intent_created(event):
    """
    Handle 'payment_intent.created' event.

    Args:
        event (dict): The Stripe event data.

    Returns:
        Response: The HTTP response object.
    """
    logger.info('payment_intent_created')
    payment_intent = munchify(event['data']['object'])
    user = User.objects.filter(stripe_customer_id=payment_intent.customer).first()
    if not user:
        return Response('User not found', status=status.HTTP_400_BAD_REQUEST)
    return Response()


def payment_intent_processing(event):
    """
    Handle 'payment_intent.processing' event.

    Args:
        event (dict): The Stripe event data.

    Returns:
        Response: The HTTP response object.
    """
    logger.info('payment_intent_processing')
    payment_intent = munchify(event['data']['object'])
    transaction_objects = Transaction.objects.filter(stripe_payment_intent_id=payment_intent.id)
    for transaction_object in transaction_objects:
        transaction_object.status = Transaction.PROCESSING
        transaction_object.stripe_response = event
        transaction_object.save()
    return Response()


def payment_intent_succeeded(event):
    """
    Handle 'payment_intent.succeeded' event.

    Args:
        event (dict): The Stripe event data.

    Returns:
        Response: The HTTP response object.
    """
    logger.info('payment_intent_succeeded')
    payment_intent = munchify(event['data']['object'])
    transaction_objects = Transaction.objects.filter(stripe_payment_intent_id=payment_intent.id)
    for transaction_object in transaction_objects:
        money_held = payment_intent.metadata.get('held', 'False')
        if money_held == 'True':
            transaction_object.status = Transaction.HELD
        else:
            transaction_object.status = Transaction.COMPLETED
        transaction_object.stripe_response = event
        transaction_object.save()
    return Response()


def payment_intent_failed(event):
    """
    Handle 'payment_intent.failed' event.

    Args:
        event (dict): The Stripe event data.

    Returns:
        Response: The HTTP response object.
    """
    logger.info('payment_intent_failed')
    payment_intent = munchify(event['data']['object'])
    transaction_objects = Transaction.objects.filter(stripe_payment_intent_id=payment_intent.id)
    for transaction_object in transaction_objects:
        transaction_object.status = Transaction.FAILED
        transaction_object.stripe_response = event
        transaction_object.save()
    return Response()


def payment_intent_canceled(event):
    """
    Handle 'payment_intent.canceled' event.

    Args:
        event (dict): The Stripe event data.

    Returns:
        Response: The HTTP response object.
    """
    logger.info('payment_intent_canceled')
    payment_intent = munchify(event['data']['object'])
    transaction_objects = Transaction.objects.filter(stripe_payment_intent_id=payment_intent.id)
    for transaction_object in transaction_objects:
        transaction_object.status = Transaction.CANCELLED
        transaction_object.stripe_response = event
        transaction_object.save()
    return Response()
