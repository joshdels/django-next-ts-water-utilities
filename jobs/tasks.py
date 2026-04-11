from celery import shared_task
from .services.dxf_inspect import run_inspection
from .services.dxf_extract import extract_to_geopackage
import os
import uuid


MEDIA_DIR = "media/results"


@shared_task
def inspect_file_task(temp_path, original_name):

    task_id = str(uuid.uuid4())

    report_text = run_inspection(temp_path, original_name)

    os.makedirs(MEDIA_DIR, exist_ok=True)

    output_path = f"{MEDIA_DIR}/{task_id}_report.txt"

    with open(output_path, "w") as f:
        f.write(report_text)

    return {"task_id": task_id, "file": output_path}


@shared_task
def convert_to_geopackage_task(temp_dxf_path, base_name):

    task_id = str(uuid.uuid4())

    os.makedirs(MEDIA_DIR, exist_ok=True)

    output_path = f"{MEDIA_DIR}/{task_id}.gpkg"

    result_path = extract_to_geopackage(
        file_path=temp_dxf_path, output_path=output_path
    )

    return {"task_id": task_id, "file": result_path, "name": base_name}
