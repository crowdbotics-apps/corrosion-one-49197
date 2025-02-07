from rest_framework import serializers

from inspector.models import Credential


class CredentialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Credential
        fields = ['id', 'name']