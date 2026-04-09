from django.urls import path
from .views import inspect_file

urlpatterns = [path("inspect-file/", inspect_file)]
