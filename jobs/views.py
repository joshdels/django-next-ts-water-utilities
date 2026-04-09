from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from django.http import HttpResponse
import tempfile

from .services.dxf_inspect import run_inspection
from .services.dxf_extract import extract_to_geopackage


@api_view(["POST"])
@permission_classes([AllowAny])
def inspect_file(request):
    uploaded_file = request.FILES.get("file")

    original_name = uploaded_file.name

    if not uploaded_file:
        return HttpResponse("No file uploaded", status=400)

    with tempfile.NamedTemporaryFile(delete=False, suffix=".dxf") as temp:
        temp.write(uploaded_file.read())
        temp_path = temp.name

    try:
        report_text = run_inspection(temp_path, original_name)

        response = HttpResponse(report_text, content_type="text/plain")
        response["Content-Disposition"] = 'attachment; filename="report.txt"'

        return response

    except Exception as e:
        return HttpResponse(f"Error: {str(e)}", status=500)


@api_view(["POST"])
@permission_classes([AllowAny])
def convert_to_geopackage(request):
    pass
