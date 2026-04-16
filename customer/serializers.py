from rest_framework import serializers
from .models import PotentialCustomer


class PotentialCustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = PotentialCustomer
        fields = "__all__"
