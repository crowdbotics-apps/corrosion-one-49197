"""
This module contains the views for handling Stripe-related operations in the payments app.
It includes a viewset for managing Stripe customers, cards, accounts, and payment intents.
"""

from decimal import Decimal

from django.conf import settings
from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from notifications.models import Notification
from payments.models import StripeCard, Transaction
from payments.serializers import StripeCardListSerializer
from payments.stripe_api import StripeClient
from users.serializers import UserDetailSerializer
from utils.utils import send_notifications, user_is_inspector


class StripeViewset(viewsets.GenericViewSet):
    """
    A viewset for handling Stripe-related operations such as creating customers, cards, 
    payment intents, and managing account data.
    """
    permission_classes = [IsAuthenticated]

    def __init__(self, *args, **kwargs):
        """
        Initialize the StripeViewset with a StripeClient instance.
        """
        super().__init__(*args, **kwargs)
        self.api = StripeClient()

    def verify_stripe_customer(self, user):
        """
        Verify if the user has a Stripe customer ID. If not, create a new Stripe customer.

        Args:
            user: The user object.

        Returns:
            The Stripe customer ID.
        """
        stripe_customer_id = user.stripe_customer_id
        if not stripe_customer_id:
            customer = self.api.create_customer(user)
            stripe_customer_id = customer.id
            user.stripe_customer_id = stripe_customer_id
            user.save()
            if not stripe_customer_id:
                return Response('Stripe customer not found', status=status.HTTP_400_BAD_REQUEST)
        return stripe_customer_id

    @action(methods=['post'], detail=False)
    def create_customer(self, request):
        """
        Create a new Stripe customer for the authenticated user.

        Args:
            request: The HTTP request object.

        Returns:
            Response: The created Stripe customer object.
        """
        user = request.user
        customer = self.api.create_customer(user)
        return Response(customer)

    @action(methods=['post'], detail=False, url_path='add-card')
    def create_card(self, request):
        """
        Create a new card for the authenticated user.

        Args:
            request: The HTTP request object containing card data.

        Returns:
            Response: The created card object or an error message.
        """
        data = request.data
        user = request.user
        self.verify_stripe_customer(request.user)
        card = self.api.create_user_card(user, data.get("payment_method"))
        if hasattr(card, 'error') and card.error.message:
            return Response(card.error.message, status=status.HTTP_400_BAD_REQUEST)
        return Response(card)

    @action(methods=['get'], detail=False, url_path='get-cards')
    def get_cards(self, request):
        """
        Retrieve all cards for the authenticated user.

        Args:
            request: The HTTP request object.

        Returns:
            Response: A list of cards.
        """
        user = request.user
        self.verify_stripe_customer(user)
        cards = self.api.get_user_cards(user)
        if not cards.filter(default=True).exists() and cards:
            first_card = cards.first()
            first_card.default = True
            first_card.save()
            self.api.set_default_card(user, first_card.card_id)
        data = StripeCardListSerializer(instance=cards, many=True).data
        return Response(data)

    @action(methods=['post'], detail=False, url_path='set-default-card')
    def set_default_card(self, request):
        """
        Set a card as the default card for the authenticated user.

        Args:
            request: The HTTP request object containing card ID.

        Returns:
            Response: An empty response or an error message.
        """
        data = request.data
        user = request.user
        stripe_card = user.stripe_cards.filter(id=data.get('card_id')).first()
        if not stripe_card:
            return Response('Stripe card not found', status=status.HTTP_400_BAD_REQUEST)

        cards = self.api.get_user_cards(user)
        for card in cards:
            card.default = False
            card.save()
        stripe_card.default = True
        stripe_card.save()
        self.api.set_default_card(user, stripe_card.card_id)
        return Response()

    @action(methods=['post'], detail=False, url_path='delete-card')
    def delete_card(self, request):
        """
        Delete a card for the authenticated user.

        Args:
            request: The HTTP request object containing card ID.

        Returns:
            Response: An empty response or an error message.
        """
        data = request.data
        user = request.user
        stripe_card = user.stripe_cards.filter(id=data.get('card_id')).first()
        if not stripe_card:
            return Response('Stripe card not found', status=status.HTTP_400_BAD_REQUEST)
        self.api.delete_user_card(user, stripe_card.card_id)
        return Response()

    @action(methods=['post'], detail=False, url_path='create-account-link')
    def create_account_link(self, request):
        """
        Create an account link for the authenticated user's Stripe account.

        Args:
            request: The HTTP request object.

        Returns:
            Response: The created account link.
        """
        user = request.user
        if not user_is_inspector(user):
            return Response('Invalid action', status=status.HTTP_400_BAD_REQUEST)
        account_link = self.api.create_account_link(user.stripe_account_id)
        user.stripe_account_link = account_link
        user.save()

        return Response(account_link)


    @action(methods=['get'], detail=False, url_path='get-account-data')
    def get_account_data(self, request):
        """
        Retrieve account data for the authenticated user's Stripe account.

        Args:
            request: The HTTP request object.

        Returns:
            Response: The account data.
        """
        user = request.user
        account = self.api.get_provider_account(user.stripe_account_id)
        if not user.stripe_account_linked and account.get('payouts_enabled', False):
            user.stripe_account_linked = True
            user.save()

        user_data = UserDetailSerializer(instance=user).data
        return Response(user_data)

    @action(methods=['post'], detail=False)
    def create_payment_intent(self, request):
        """
        Create a payment intent for a transaction.

        Args:
            request: The HTTP request object containing transaction data.

        Returns:
            Response: The created payment intent or an error message.
        """
        user = request.user
        data = request.data
        description = data.get('description', 'Transaction')
        specialist_id = data.get('specialist', None)
        service_id = data.get('service_id', None)
        custom_service = data.get('custom_service', False)
        session_data = data.get('session_data', None)

        data ={ }

        # if not specialist_id:
        #     return Response('Specialist not found', status=status.HTTP_400_BAD_REQUEST)
        # if not service_id:
        #     return Response('Service not found', status=status.HTTP_400_BAD_REQUEST)
        # specialist = Specialist.objects.filter(id=specialist_id).first()
        # if not specialist or not specialist.user.stripe_account_id:
        #     return Response('Specialist not found', status=status.HTTP_400_BAD_REQUEST)
        # if custom_service:
        #     service = Service.objects.filter(id=service_id).first()
        #     if not service:
        #         return Response('Service not found', status=status.HTTP_400_BAD_REQUEST)
        #
        #     amount = service.price * 100
        #
        #     if not session_data:
        #         return Response('Session data not found', status=status.HTTP_400_BAD_REQUEST)
        #
        #     if not session_data['type']:
        #         return Response('Session type not found', status=status.HTTP_400_BAD_REQUEST)
        #
        #     seeker = Seeker.objects.get(user_id=user.id)
        #
        #     user_specialist = getattr(user, 'specialist', None)
        #     if user_specialist and user_specialist == service.specialist:
        #         return Response('You can\'t book sessions with yourself', status=status.HTTP_400_BAD_REQUEST)
        #
        #     duration = service.duration
        #     price = service.price
        #     specialist = service.specialist
        #
        #     payment_intent = self.api.create_payment_intent(user, int(amount), description)
        #     if hasattr(payment_intent, 'error') and payment_intent.error.message:
        #         return Response(payment_intent.error.message, status=status.HTTP_400_BAD_REQUEST)
        #
        #     session = Session.objects.create(
        #         specialist=specialist,
        #         seeker=seeker,
        #         type=session_data['type'],
        #         status=Session.SessionStatus.PENDING,
        #         price=price,
        #         service=service,
        #         duration=duration,
        #         date_time=session_data['date_time'],
        #     )
        #
        #     charge_id = payment_intent.latest_charge
        #
        #     Transaction.objects.create(
        #         transaction_id=payment_intent.id,
        #         amount=payment_intent.amount,
        #         currency=payment_intent.currency,
        #         created_by=user,
        #         stripe_payment_intent_id=charge_id,
        #         transaction_type=Transaction.CREDIT,
        #         description=payment_intent.description,
        #         session_id=session
        #     )
        #
        #     data = SessionListSerializer(instance=session).data
        #
        #     send_notifications(
        #         users=[specialist.user],
        #         title='Session Booked!',
        #         description=f'{seeker.user.name} has booked a session with you',
        #         n_type=Notification.NotificationType.SESSION_BOOKED,
        #         from_user=user
        #     )
        #     return Response(data)
        #
        # else:
        #     price_object = Price.objects.filter(specialist=specialist).first()
        #     paid_question_sid = data.get('paid_question_sid', None)
        #     paid_question = PaidQuestion.objects.filter(sid=paid_question_sid).first()
        #     if not price_object:
        #         return Response('Service price not found', status=status.HTTP_400_BAD_REQUEST)
        #     amount = 0
        #     if service_id == 1:
        #         amount = price_object.single_question * 100
        #     elif service_id == 2:
        #         amount = price_object.audio_consultation * 100
        #     elif service_id == 3:
        #         amount = price_object.video_consultation * 100
        #     if not amount:
        #         return Response('Amount not found', status=status.HTTP_400_BAD_REQUEST)
        #
        #     balance = self.api.check_stripe_balance()
        #     payout_ammount = int(amount * Decimal(settings.SPECIALIST_FEE_PERCENTAGE))
        #
        #     if balance < payout_ammount:
        #         subject = "Insufficient balance"
        #         text_content = f"""<h5>Hello admin</h5><br/>
        #         Please use check your stripe balance. The balance is less than the payout amount. <br/>
        #         <b>Balance: </b> {balance} <br/>
        #         <b>Payout amount: </b> {payout_ammount} <br/>"""
        #         send_email(
        #             subject=subject,
        #             text_content=text_content,
        #             user_email=[settings.DEFAULT_FROM_EMAIL]
        #         )
        #
        #         return Response('Error creating a service', status=status.HTTP_400_BAD_REQUEST)
        #     payment_intent = self.api.create_payment_intent(user, int(amount), description)
        #     if hasattr(payment_intent, 'error') and payment_intent.error.message:
        #         return Response(payment_intent.error.message, status=status.HTTP_400_BAD_REQUEST)
        #     transaction = Transaction.objects.create(
        #         transaction_id=payment_intent.id,
        #         amount=payment_intent.amount,
        #         currency=payment_intent.currency,
        #         created_by=user,
        #         stripe_payment_intent_id=payment_intent.id,
        #         transaction_type=Transaction.CREDIT,
        #         description=payment_intent.description,
        #         paid_question=paid_question
        #     )
        #
        #     payout_amount = int(amount * Decimal(settings.SPECIALIST_FEE_PERCENTAGE))
        #
        #     self.api.create_transfer(payout_amount, specialist.user.stripe_account_id,
        #                              f'Payout for {specialist.user.email}')

        # return Response({"transaction_id": transaction.id})
        return Response()

    @action(methods=['get'], detail=False)
    def get_transaction_status(self, request):
        """
        Retrieve the status of a transaction.

        Args:
            request: The HTTP request object containing transaction ID.

        Returns:
            Response: The transaction status or an error message.
        """
        user = request.user
        data = request.query_params
        transaction_id = data.get('transaction_id', None)
        transaction = Transaction.objects.filter(id=transaction_id, created_by=user).first()
        if not transaction:
            return Response('Transaction not found', status=status.HTTP_400_BAD_REQUEST)
        return Response({"status": transaction.status})

    @action(methods=['post'], detail=False, url_path='create-account-session')
    def create_account_session(self, request):
        """
        Create an account session for the authenticated user.

        Args:
            request: The HTTP request object.

        Returns:
            Response: The created account session or an error message.
        """
        user = request.user
        if not user_is_inspector(user):
            return Response('Invalid action', status=status.HTTP_400_BAD_REQUEST)
        action_account = request.data.get('action', None)
        client_secret = self.api.account_session_action(user.stripe_account_id, action_account)
        return Response(client_secret)