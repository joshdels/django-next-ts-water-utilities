from rest_framework.routers import DefaultRouter
from .views import PotentialCustomerViewSet

router = DefaultRouter()
router.register(r"inquiries", PotentialCustomerViewSet, basename="inquiries")

urlpatterns = router.urls
