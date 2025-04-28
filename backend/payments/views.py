"""
This module contains the views for handling Stripe-related operations in the payments app.
It includes a viewset for managing Stripe customers, cards, accounts, and payment intents.
"""

from decimal import Decimal

from django.conf import settings
from django.db import transaction
from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.status import HTTP_400_BAD_REQUEST

from jobs.models import Job, Bid
from notifications.models import Notification
from payments.models import StripeCard, Transaction
from payments.serializers import StripeCardListSerializer, TransactionListSerializer
from payments.stripe_api import StripeClient
from users.serializers import UserDetailSerializer
from utils.utils import send_notifications, user_is_inspector
from utils.utils.pagination import CustomPageSizePagination


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

    @transaction.atomic
    @action(methods=['post'], detail=False, url_path='create-payment-intent-held')
    def create_payment_intent_held(self, request):
        """
        Create a payment intent for held transactions.

        Args:
            request: The HTTP request object containing transaction data.

        Returns:
            Response: The created payment intent or an error message.
        """
        data = request.data
        user = request.user
        bid_id = request.data.get('bid_id')
        bid = Bid.objects.get(pk=bid_id)
        if bid.job.created_by != user.owner:
            return Response('Invalid action', status=HTTP_400_BAD_REQUEST)
        job = bid.job
        if job.status != Job.JobStatus.PENDING:
            return Response('This job is not available for bidding', status=HTTP_400_BAD_REQUEST)
        currency = data.get('currency', 'usd')
        job = bid.job
        customer = user.stripe_customer_id
        if not customer:
            return None, "Customer id needed"
        tr = Transaction.objects.filter(
            created_by=user,
            job=job,
            status__in=[Transaction.PENDING]
        ).first()

        if tr:
            tr.status = Transaction.CANCELLED
            tr.save()


        tx = Transaction.objects.create(
            amount=job.total_amount,
            currency=currency,
            created_by=user,
            recipient=bid.inspector.user,
            description=f"Job id: {job.id} - {job.title}",
            status=Transaction.PENDING,
            transaction_type=Transaction.DEBIT,
            job=job
        )

        transfer_group = f"group_tx_{tx.id}"

        payment_intent = self.api.create_payment_intent_held(
            amount=int(tx.amount * 100),
            description=tx.description,
            currency=tx.currency,
            customer=user.stripe_customer_id,
            metadata={
                "transaction_id": tx.id,
                "user_owner_id": tx.created_by.id,
                "user_inspector_id": tx.recipient.id if tx.recipient else None,
                "held": True
            },
            transfer_group=transfer_group,
            checkout=True
        )

        if hasattr(payment_intent, 'error') and payment_intent.error.message:
            tx.status = Transaction.FAILED
            tx.save()
            return Response(payment_intent.error.message, status=status.HTTP_400_BAD_REQUEST)
        tx.stripe_payment_intent_id = payment_intent.id
        tx.save()

        return Response(payment_intent.client_secret)


class TransactionListViewset(viewsets.GenericViewSet, viewsets.mixins.ListModelMixin):
    """
    A viewset for handling transaction-related operations.
    """
    queryset = Transaction.objects.all().order_by('-created')
    pagination_class = CustomPageSizePagination
    serializer_class = TransactionListSerializer
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['status', 'description', 'created_by__first_name', 'created_by__last_name', 'created_by__email',
                     'job__title', 'recipient__first_name', 'recipient__last_name', 'recipient__email']
    ordering_fields = ['id', 'created', 'amount', 'status', 'transaction_type', 'description', 'job', 'recipient']

    def get_queryset(self):
        user = self.request.user
        queryset = super().get_queryset()
        query_params = self.request.query_params
        if query_params.get('dates', None):
            start_date, end_date = query_params.get('dates').split(',')
            queryset = queryset.filter(created__range=[start_date, end_date])
        if user_is_inspector(user):
            return queryset.filter(recipient=user).exclude(status__in=[Transaction.PENDING, Transaction.FAILED])
        return queryset.filter(created_by=user)