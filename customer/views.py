from rest_framework import mixins, viewsets
from rest_framework.permissions import AllowAny
from .models import PotentialCustomer
from .serializers import PotentialCustomerSerializer


class PotentialCustomerViewSet(mixins.CreateModelMixin, viewsets.GenericViewSet):
    queryset = PotentialCustomer.objects.all()
    serializer_class = PotentialCustomerSerializer
    permission_classes = [AllowAny]
