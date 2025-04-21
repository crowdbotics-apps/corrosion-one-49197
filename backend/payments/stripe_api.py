import logging

import stripe
from django.conf import settings
from django.contrib.auth import get_user_model
from django.db import transaction
from munch import munchify

from payments.models import StripeCard, Transaction

# from users.models import User

logger = logging.getLogger('django')

User = get_user_model()

LOG_ACTIVE = settings.DEBUG


class PaymentIntentEventTypes:
    """
    Class containing constants for Payment Intent event types.
    """
    TYPE_SUCCEDED = 'payment_intent.succeeded'
    TYPE_CREATED = 'payment_intent.created'


class PaymentMethodEventTypes:
    """
    Class containing constants for Payment Method event types.
    """
    TYPE_ATTACHED = 'payment_method.attached'


class StripeClient:
    """
    Client for interacting with the Stripe API.
    """

    def __init__(self):
        """
        Initialize the Stripe client with the appropriate API key based on the environment.
        """
        if LOG_ACTIVE:
            logger.info('Starting stripe client')
        self.stripe = stripe
        if not settings.STRIPE_LIVE_MODE:
            if LOG_ACTIVE:
                logger.info('STRIPE TEST MODE')
            self.stripe.api_key = settings.STRIPE_TEST_SECRET_KEY
        else:
            if LOG_ACTIVE:
                logger.info('STRIPE LIVE MODE')
            self.stripe.api_key = settings.STRIPE_LIVE_SECRET_KEY

    def create_customer(self, user):
        """
        Create a Stripe customer for the given user.

        Args:
            user (User): The user for whom to create the customer.

        Returns:
            dict: The created Stripe customer.
        """
        customer = self.stripe.Customer.create(
            email=user.email,
            phone=user.phone_number,
            name=user.get_full_name(),
            metadata={'user_id': user.id}
        )
        return customer

    def create_provider_account(self, user):
        """
        Create a Stripe provider account for the given user.

        Args:
            user (User): The user for whom to create the provider account.

        Returns:
            dict: The created Stripe account.
        """
        if LOG_ACTIVE:
            logger.info('create_provider_account')
        account = self.stripe.Account.create(
            type='express',
            country='US',
            email=user.email,
            capabilities={
                'card_payments': {'requested': True},
                'transfers': {'requested': True},
            },
        )
        return account

    def get_provider_account(self, account_id):
        """
        Retrieve a Stripe provider account by its ID.

        Args:
            account_id (str): The ID of the Stripe account.

        Returns:
            dict: The retrieved Stripe account.
        """
        if LOG_ACTIVE:
            logger.info('get_provider_account')
        account = self.stripe.Account.retrieve(
            account_id,
        )
        return account

    def create_account_link(self, account_id):
        """
        Create an account link for Stripe account onboarding.

        Args:
            account_id (str): The ID of the Stripe account.

        Returns:
            dict: The created account link.
        """
        if LOG_ACTIVE:
            logger.info('create_account_link')
        account_link = self.stripe.AccountLink.create(
            account=account_id,
            refresh_url='https://app.corrosionone.com/',
            return_url='https://app.corrosionone.com/#/payment/',
            type='account_onboarding',
        )
        return account_link

    def attach_payment_method(self, user, payment_method_id):
        """
        Attach a payment method to a Stripe customer.

        Args:
            user (User): The user to whom the payment method will be attached.
            payment_method_id (str): The ID of the payment method.

        Returns:
            dict: The attached payment method.
        """
        if LOG_ACTIVE:
            logger.info('attach_payment_method')
        payment_method = self.stripe.PaymentMethod.attach(
            payment_method_id,
            customer=user.stripe_customer_id
        )
        return payment_method

    def get_user_payment_mtehods_cards(self, user):
        """
        Retrieve the payment methods (cards) for a Stripe customer.

        Args:
            user (User): The user whose payment methods will be retrieved.

        Returns:
            dict: The retrieved payment methods.
        """
        if LOG_ACTIVE:
            logger.info('get_user_payment_mtehods_cards')
        cards = self.stripe.Customer.list_payment_methods(
            user.stripe_customer_id,
            type="card",
        )
        return cards

    def create_user_card(self, user, token):
        """
        Create a card for a Stripe customer using a token.

        Args:
            user (User): The user for whom to create the card.
            token (str): The token representing the card.

        Returns:
            dict: The created card or an error.
        """
        if LOG_ACTIVE:
            logger.info('create_user_card')
        try:
            card = self.stripe.PaymentMethod.attach(
                token,
                customer=user.stripe_customer_id
            )
        except Exception as error:
            return error
        return card

    def create_user_card_token(self, user, card):
        """
        Create a card for a Stripe customer using card details.

        Args:
            user (User): The user for whom to create the card.
            card (dict): The card details.

        Returns:
            dict: The created card or an error.
        """
        if LOG_ACTIVE:
            logger.info('create_user_card_token')
        try:
            token = self.stripe.Token.create(
                card=card
            )

            card = self.stripe.Customer.create_source(
                user.stripe_customer_id,
                source=token['card']['id']
            )
        except Exception as error:
            return error
        return card

    def retrieve_user_card(self, user, card_id):
        """
        Retrieve a card for a Stripe customer by its ID.

        Args:
            user (User): The user whose card will be retrieved.
            card_id (str): The ID of the card.

        Returns:
            dict: The retrieved card.
        """
        if LOG_ACTIVE:
            logger.info('retrieve_user_card')
        card = self.stripe.Customer.create_source(
            user.stripe_customer_id,
            card_id
        )
        return card

    def delete_user_card(self, user, card_id):
        """
        Delete a card for a Stripe customer by its ID.

        Args:
            user (User): The user whose card will be deleted.
            card_id (str): The ID of the card.

        Returns:
            None
        """
        if LOG_ACTIVE:
            logger.info('delete_user_card')
        try:
            self.stripe.PaymentMethod.detach(
                card_id,
            )
        except Exception as error:
            logger.info(error)
        stripe_card = StripeCard.objects.filter(card_id=card_id, user=user).first()
        stripe_card.delete()
        return None

    def get_user_cards(self, user):
        """
        Retrieve all cards for a Stripe customer.

        Args:
            user (User): The user whose cards will be retrieved.

        Returns:
            QuerySet: The retrieved cards.
        """
        if LOG_ACTIVE:
            logger.info('get_user_cards')
        if user.stripe_customer_id:
            cards = self.stripe.PaymentMethod.list(
                customer=user.stripe_customer_id,
                type="card",
            )
            self.verify_user_cards(user, cards.get('data'))
        cards = StripeCard.objects.filter(user=user)
        return cards

    def set_default_card(self, user, card_id):
        """
        Set a default card for a Stripe customer.

        Args:
            user (User): The user whose default card will be set.
            card_id (str): The ID of the card to set as default.

        Returns:
            None
        """
        if LOG_ACTIVE:
            logger.info('set_default_card')
        self.stripe.Customer.modify(
            user.stripe_customer_id,
            invoice_settings={
                'default_payment_method': card_id,
            }
        )
        return None

    def verify_user_cards(self, user, cards):
        """
        Verify and create StripeCard instances for the user's cards.

        Args:
            user (User): The user whose cards will be verified.
            cards (list): The list of cards to verify.

        Returns:
            None
        """
        for card_data in cards:
            card = munchify(card_data['card'])
            stripe_card = StripeCard.objects.filter(
                card_id=card_data['id']
            ).first()
            if stripe_card:
                continue
            else:
                StripeCard.objects.create(
                    user=user,
                    card_id=card_data['id'],
                    exp_month=card.exp_month,
                    exp_year=card.exp_year,
                    funding=card.funding,
                    last4=card.last4,
                    country=card.country,
                    brand=card.brand,
                )

    def verify_stripe_account(self, account_id):
        """
        Verify a Stripe account by its ID.

        Args:
            account_id (str): The ID of the Stripe account.

        Returns:
            dict: The verified Stripe account or an error.
        """
        if LOG_ACTIVE:
            logger.info('verify_stripe_account')
        try:
            account = self.stripe.Account.retrieve(account_id)
            return account
        except Exception as error:
            logger.info(error)
            return error

    def create_transfer(self, amount, destination, description):
        """
        Create a transfer to a Stripe account.

        Args:
            amount (int): The amount to transfer.
            destination (str): The destination Stripe account ID.
            description (str): The description of the transfer.

        Returns:
            dict: The created transfer or an error.
        """
        user = User.objects.filter(stripe_account_id=destination).first()
        try:
            with transaction.atomic():
                transfer = self.stripe.Transfer.create(
                    amount=amount,
                    currency="usd",
                    destination=destination,
                    description=description,
                )

                Transaction.objects.create(
                    transaction_id=transfer.id,
                    amount=transfer.amount,
                    currency=transfer.currency,
                    created_by=user,
                    stripe_payment_intent_id=transfer.id,
                    transaction_type=Transaction.DEBIT,
                    description=transfer.description,
                    status=Transaction.COMPLETED,
                    stripe_response=transfer,
                )

            return transfer
        except Exception as error:
            logger.info(error)
            Transaction.objects.create(
                amount=amount,
                currency='USD',
                created_by=user,
                transaction_type=Transaction.DEBIT,
                description=description,
                status=Transaction.PENDING,
                stripe_response=str(error),
            )
            return error

    def create_payout(self, amount, destination):
        """
        Create a payout to a Stripe account.

        Args:
            amount (int): The amount to payout.
            destination (str): The destination Stripe account ID.

        Returns:
            dict: The created payout or an error.
        """
        try:

            payout = self.stripe.Payout.create(
                amount=amount,
                currency="usd",
                method="instant",
                stripe_account=destination,
            )

            return payout
        except Exception as error:
            logger.info(error)
            return error

    def payment_intent_confirm(self, payment_intent_id):
        """
        Confirm a Stripe PaymentIntent.

        Args:
            payment_intent_id (str): The ID of the PaymentIntent to confirm.

        Returns:
            dict: The confirmed PaymentIntent or an error.
        """
        try:
            with transaction.atomic():
                payment_intent_confirm = self.stripe.PaymentIntent.confirm(payment_intent_id)
                if LOG_ACTIVE:
                    logger.info(payment_intent_confirm)
                return payment_intent_confirm
        except Exception as error:
            logger.info(error)
            return error

    def payment_intent_cancel(self, payment_intent_id):
        """
        Cancel a Stripe PaymentIntent.

        Args:
            payment_intent_id (str): The ID of the PaymentIntent to cancel.

        Returns:
            dict: The canceled PaymentIntent or an error.
        """
        try:
            with transaction.atomic():
                payment_intent_cancel = self.stripe.PaymentIntent.cancel(payment_intent_id)
                if LOG_ACTIVE:
                    logger.info(payment_intent_cancel)
                return payment_intent_cancel
        except Exception as error:
            logger.info(error)
            return error

    def refund_payment(self, charge_id):
        """
        Refund a Stripe charge.

        Args:
            charge_id (str): The ID of the charge to refund.

        Returns:
            dict: The created refund or an error.
        """
        try:
            # Create a refund
            refund = self.stripe.Refund.create(
                charge=charge_id,
            )
            return refund
        except Exception as error:
            logger.info(error)
            return error

    def create_payment_intent(
            self,
            amount,
            description,
            currency,
            payment_method_id,
            customer,
            metadata,
            account_id
    ):
        """
        Create a Stripe PaymentIntent.

        Args:
            amount (int): The amount for the PaymentIntent.
            description (str): The description of the PaymentIntent.
            currency (str): The currency for the PaymentIntent.
            payment_method_id (str): The ID of the payment method.
            customer (str): The ID of the Stripe customer.
            metadata (dict): Additional metadata for the PaymentIntent.
            account_id (str): The ID of the Stripe account.

        Returns:
            dict: The created PaymentIntent or an error.
        """
        try:
            payment_intent = self.stripe.PaymentIntent.create(
                amount=amount,
                payment_method=payment_method_id,
                payment_method_types=["card"],
                off_session=True,
                currency=currency,
                customer=customer,
                description=description,
                confirm=True,
                metadata=metadata,
                transfer_data={
                    "destination": account_id,
                },

            )
            return payment_intent
        except Exception as error:
            logger.info(error)
            return error

    def get_stripe_subscriptions(self, customer_id):
        """
        Retrieve all subscriptions for a Stripe customer.

        Args:
            customer_id (str): The ID of the Stripe customer.

        Returns:
            list: The retrieved subscriptions with product names or an error.
        """
        try:
            with transaction.atomic():
                subscriptions = self.stripe.Subscription.list(customer=customer_id)
                subscriptions_with_product_names = []

                for subscription in subscriptions.auto_paging_iter():
                    # Copy the subscription dictionary to modify it
                    subscription_dict = subscription.to_dict()
                    product_names = []

                    for item in subscription['items']['data']:
                        # Fetch the product linked to the price
                        product = self.stripe.Product.retrieve(item['price']['product'])
                        product_names.append(product['name'])

                    # Add the product names to the subscription dictionary
                    subscription_dict['product_names'] = product_names
                    subscriptions_with_product_names.append(subscription_dict)

                return subscriptions_with_product_names
        except Exception as error:
            logger.info(error)
            return error

    def get_stripe_subscription(self, subscription_id):
        """
        Retrieve a Stripe subscription by its ID.

        Args:
            subscription_id (str): The ID of the subscription.

        Returns:
            dict: The retrieved subscription or an error.
        """
        try:
            with transaction.atomic():
                subscription = self.stripe.Subscription.retrieve(subscription_id)
                return subscription
        except Exception as error:
            logger.info(error)
            return error

    def create_stripe_subscription(self, customer, price_id, coupon=None):
        """
        Create a Stripe subscription.

        Args:
            customer (str): The ID of the Stripe customer.
            price_id (str): The ID of the price for the subscription.
            coupon (str, optional): The coupon to apply to the subscription.

        Returns:
            dict: The created subscription or an error.
        """
        try:
            with transaction.atomic():
                subscription = self.stripe.Subscription.create(
                    customer=customer,
                    items=[{"price": price_id}],
                    coupon=coupon,
                    collection_method='charge_automatically',
                )
                return subscription
        except Exception as error:
            logger.info(error)
            return error

    def update_stripe_subscription(self, subscription_id, plan, coupon=None):
        """
        Update a Stripe subscription.

        Args:
            subscription_id (str): The ID of the subscription to update.
            plan (str): The new plan for the subscription.
            coupon (str, optional): The coupon to apply to the subscription.

        Returns:
            dict: The updated subscription or an error.
        """
        try:
            with transaction.atomic():
                subscription = self.stripe.Subscription.modify(
                    subscription_id,
                    items=[{'plan': plan}],
                    coupon=coupon,
                )
                return subscription
        except Exception as error:
            logger.info(error)
            return error

    def cancel_stripe_subscription(self, subscription_id):
        """
        Cancel a Stripe subscription.

        Args:
            subscription_id (str): The ID of the subscription to cancel.

        Returns:
            dict: The canceled subscription or an error.
        """
        try:
            with transaction.atomic():
                subscription = self.stripe.Subscription.delete(
                    subscription_id,
                )
                return subscription
        except Exception as error:
            logger.info(error)
            return error

    def get_stripe_plans(self):
        """
        Retrieve all active Stripe plans.

        Returns:
            list: The retrieved plans or an error.
        """
        try:
            with transaction.atomic():
                plans = self.stripe.Plan.list(active=True)
                return plans
        except Exception as error:
            logger.info(error)
            return error

    def get_stripe_products(self):
        """
        Retrieve all active Stripe products.

        Returns:
            list: The retrieved products or an error.
        """
        try:
            products = self.stripe.Product.list(active=True, limit=100)
            for product in products:
                product.plans = self.stripe.Plan.list(product=product.id, active=True)
            return products
        except Exception as error:
            logger.info(error)
            return []

    def get_stripe_product(self, product_id):
        """
        Retrieve a Stripe product by its ID.

        Args:
            product_id (str): The ID of the product.

        Returns:
            dict: The retrieved product or an error.
        """
        try:
            with transaction.atomic():
                product = self.stripe.Product.retrieve(product_id)
                return product
        except Exception as error:
            logger.info(error)
            return error

    def change_subscription_plan(self, subscription_id, new_price_id, prorate=True):
        """
        Change the plan of an existing subscription.

        Args:
            subscription_id (str): The ID of the subscription to change.
            new_price_id (str): The new price ID to apply to the subscription.
            prorate (bool): Whether to prorate the change.

        Returns:
            dict: The updated subscription object or an error.
        """
        try:
            with transaction.atomic():

                subscription = self.stripe.Subscription.retrieve(subscription_id)

                self.stripe.Subscription.modify(
                    subscription_id,
                    items=[{
                        'id': subscription['items']['data'][0].id,
                        'price': new_price_id,
                    }],
                    proration_behavior='create_prorations' if prorate else 'none'
                )
                return subscription
        except Exception as error:
            logger.info(error)
            return error

    def upgrade_subscription(self, subscription_id, new_price_id):
        """
        Upgrade a subscription to a higher-tier plan.

        Args:
            subscription_id (str): The ID of the subscription to upgrade.
            new_price_id (str): The new price ID for the upgraded plan.

        Returns:
            dict: The updated subscription object or an error.
        """
        return self.change_subscription_plan(subscription_id, new_price_id)

    def downgrade_subscription(self, subscription_id, new_price_id):
        """
        Downgrade a subscription to a lower-tier plan.
        :param subscription_id: The ID of the subscription to downgrade.
        :param new_price_id: The new price ID for the downgraded plan.
        :return: The updated subscription object.
        """
        return self.change_subscription_plan(subscription_id, new_price_id, prorate=False)

    def get_current_subscription_price(self, subscription_id):
        """
        Retrieve the current price ID of a subscription.
        :param subscription_id: The ID of the subscription.
        :return: The current price ID or None if not found.
        """
        try:
            subscription = self.stripe.Subscription.retrieve(subscription_id)
            current_price_id = subscription['items']['data'][0]['price']['id']
            return current_price_id
        except Exception as error:
            logger.info(error)
            return None

    def compare_prices(self, current_price_id, new_price_id):
        """
        Compare two price IDs to determine if it's an upgrade or downgrade.
        :param current_price_id: The current price ID.
        :param new_price_id: The new price ID.
        :return: 'upgrade', 'downgrade', or 'same' based on the comparison.
        """
        # Implement your logic to compare prices
        # This could be based on the amount, or you might need to retrieve price details from Stripe
        # For example:
        current_price = self.stripe.Price.retrieve(current_price_id)
        new_price = self.stripe.Price.retrieve(new_price_id)

        if new_price['unit_amount'] > current_price['unit_amount']:
            return 'upgrade'
        elif new_price['unit_amount'] < current_price['unit_amount']:
            return 'downgrade'
        else:
            return 'same'

    def change_subscription(self, subscription_id, new_price_id):
        """
        Change the subscription plan and determine if it's an upgrade or downgrade.
        :param subscription_id: The ID of the subscription.
        :param new_price_id: The new price ID.
        :return: The updated subscription object.
        """
        current_price_id = self.get_current_subscription_price(subscription_id)
        if current_price_id is None:
            return None  # or handle error

        change_type = self.compare_prices(current_price_id, new_price_id)

        if change_type == 'upgrade':
            return self.upgrade_subscription(subscription_id, new_price_id)
        elif change_type == 'downgrade':
            return self.downgrade_subscription(subscription_id, new_price_id)
        else:
            # Handle the case where the prices are the same
            logger.info("No change in subscription plan.")
            return None

    def check_stripe_balance(self):
        try:

            # Retrieve the balance
            balance = self.stripe.Balance.retrieve()

            # Assuming you want to check the balance in the default currency
            # Stripe balance object contains amounts for different currency and types (available, pending)
            available_balance = balance['available'][0]['amount']

            return available_balance
        except stripe.error.StripeError as e:
            # Handle Stripe API error
            print(f"Stripe API error occurred: {e}")
            return None
        except Exception as e:
            # Handle general Python errors
            print(f"An error occurred: {e}")
            return None

    def refund_customer_and_recover_specialist_funds(self, charge_id, specialist_account_id,
                                                     specialist_transfer_id=None):
        """
        Refund a customer's charge and recover funds from a specialist.

        :param charge_id: The ID of the charge to refund.
        :param specialist_account_id: The Stripe account ID of the specialist.
        :param specialist_transfer_id: The ID of the transfer to the specialist, if already made.
        :return: Refund status message.
        """
        if LOG_ACTIVE:
            logger.info('Processing refund and fund recovery')
        try:
            # Step 1: Refund the customer
            refund = self.stripe.Refund.create(charge=charge_id)
            logger.info("Customer refunded successfully.")

            # Step 2: Recover funds from the specialist, if transfer already made
            if specialist_transfer_id:
                # Reverse the transfer made to the specialist's account
                reversal = self.stripe.Transfer.create_reversal(
                    specialist_transfer_id,
                    destination=specialist_account_id
                )
                logger.info("Funds recovered from specialist successfully.")

            return "Refund and recovery process completed."

        except stripe.error.StripeError as e:
            logger.error(f"Stripe API error occurred: {e}")
            return None
        except Exception as e:
            logger.error(f"An error occurred: {e}")
            return None

    def refund_customer(self, charge_id):
        """
        Refund a customer's charge.

        :param charge_id: The ID of the charge to refund.
        :return: Refund status message.
        """
        if LOG_ACTIVE:
            logger.info('Processing refund')
        try:
            # Step 1: Refund the customer
            self.stripe.Refund.create(charge=charge_id)
            logger.info("Customer refunded successfully.")
            return "Refund process completed."

        except stripe.error.StripeError as e:
            logger.error(f"Stripe API error occurred: {e}")
            return None
        except Exception as e:
            logger.error(f"An error occurred: {e}")
            return None

    def get_charge_id(self, payment_intent_id):
        """
        Retrieve the charge ID for a PaymentIntent.

        :param payment_intent_id: The ID of the PaymentIntent.
        :return: The charge ID or None if not found.
        """
        try:
            payment_intent = self.stripe.PaymentIntent.retrieve(payment_intent_id)
            charge_id = payment_intent['charges']['data'][0]['id']
            return charge_id
        except Exception as error:
            logger.info(error)
            return None

    def create_account_session(self, stripe_account_id):
        """
        Create an account session for the user.

        :param user: The user for whom to create the account session.
        :return: The created account session or an error.
        """
        try:
            if LOG_ACTIVE:
                logger.info('create_account_session')
            account_session = self.stripe.AccountSession.create(
                account=stripe_account_id,
                components={
                    "account_onboarding": {
                        "enabled": True,
                        "features": {"external_account_collection": True},
                    },
                },
            )
            return account_session.client_secret
        except Exception as error:
            logger.info(error)
            return error

    def account_session_action(self, stripe_account_id, components):
        """
        Perform an action on the account session.

        :param stripe_account_id: The ID of the Stripe account.
        :param components: The action to perform.
        :return: The result of the action or an error.
        """
        try:
            if LOG_ACTIVE:
                logger.info('account_session_action')
            account_session = self.stripe.AccountSession.create(
                account=stripe_account_id,
                components=components
            )
            return account_session.client_secret
        except Exception as error:
            logger.info(error)
            return error

    def create_payment_intent_held(
            self,
            amount,
            currency,
            transfer_group,
            description,
            payment_method_id,
            metadata,
            customer
    ):
        try:
            if LOG_ACTIVE:
                logger.info('create_payment_intent_held')
            payment_intent = self.stripe.PaymentIntent.create(
                amount=amount,
                currency=currency,
                transfer_group=transfer_group,
                description=description,
                payment_method=payment_method_id,
                metadata=metadata,
                payment_method_types=["card"],
                confirm=True,
                off_session=True,
                customer=customer
            )
            return payment_intent

        except Exception as error:
            logger.info(error)
            return error

    def transfer_held_amount(self, amount, currency, destination, transfer_group):
        try:
            if LOG_ACTIVE:
                logger.info('transfer_held_amount')
            transfer = self.stripe.Transfer.create(
                amount=amount,
                currency=currency,
                destination=destination,
                transfer_group=transfer_group
            )
            return transfer
        except Exception as error:
            logger.info(error)
            return error