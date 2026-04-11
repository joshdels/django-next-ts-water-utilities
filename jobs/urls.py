from django.urls import path
from .views import inspect_file, convert_to_geopackage, task_status

urlpatterns = [
    path("inspect-file/", inspect_file),
    path("convert-to-geopackage/", convert_to_geopackage),
    path("task-status/<str:task_id>", task_status),
]
