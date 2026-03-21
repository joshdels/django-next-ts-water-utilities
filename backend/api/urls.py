from django.urls import path, include
from rest_framework.routers import DefaultRouter
from api.views import ProjectViewSet, AssetViewSet, NodeViewSet, PipeViewSet

router = DefaultRouter()
router.register(r"projects", ProjectViewSet)
router.register(r"assets", AssetViewSet)
router.register(r"nodes", NodeViewSet)
router.register(r"pipes", PipeViewSet)

urlpatterns = [
    path("api/", include(router.urls)),
]
