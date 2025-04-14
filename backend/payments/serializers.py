from rest_framework import serializers

from payments.models import StripeCard


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
