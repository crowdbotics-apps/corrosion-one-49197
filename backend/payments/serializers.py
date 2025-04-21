from rest_framework import serializers

from payments.models import StripeCard, Transaction
from utils.utils import user_is_inspector


class StripeCardListSerializer(serializers.ModelSerializer):
    """
    Serializer for listing StripeCard instances.

    Meta:
        model (StripeCard): The model that is being serialized.
        fields (list): The fields to include in the serialized output.
    """

    class Meta:
        model = StripeCard
        fields = ['last4', 'brand', 'id', 'country', 'funding', 'default', 'exp_month', 'exp_year']


class TransactionListSerializer(serializers.ModelSerializer):
    """
    Serializer for listing Transaction instances.

    Meta:
        model (Transaction): The model that is being serialized.
        fields (list): The fields to include in the serialized output.
    """
    status = serializers.CharField(source='get_status_display')
    transaction_type = serializers.SerializerMethodField()
    job = serializers.CharField(source='job.title', allow_null=True)

    class Meta:
        model = Transaction
        fields = ['id', 'amount', 'status', 'description', 'created', 'transaction_type', 'job', 'recipient']


    def get_transaction_type(self, obj):
        request = self.context.get('request')
        if user_is_inspector(request.user):
            return 'Credit'
        else:
            return obj.get_transaction_type_display()