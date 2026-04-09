import pathlib
import ezdxf
from ezdxf.units import unit_name
from datetime import datetime
import logging

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    datefmt="%H:%M:%S",
)
logger = logging.getLogger(__name__)


def get_dxf_metadata(doc, msp) -> dict:
    """Extracts raw info. No printing, no saving. Just data."""
    geodata = msp.get_geodata()
    epsg = "N/A"
    if geodata:
        try:
            code, _ = geodata.get_crs()
            epsg = f"EPSG:{code}"
        except:
            epsg = "Unknown CRS"

    layers_by_type = {}
    for e in msp:
        etype = e.dxftype().upper()
        layers_by_type.setdefault(etype, set()).add(e.dxf.layer)

    return {
        "units": unit_name(doc.units),
        "epsg": epsg,
        "layers": layers_by_type,
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
    }


def format_text_report(filename: str, data: dict) -> str:
    """Turns the data dictionary into a pretty string."""
    report = [
        "=" * 50,
        f"INFRALENS (TopMap Solutions) REPORT ",
        "=" * 50,
        f"Generated : {data['timestamp']}",
        f"File Name : {filename}",
        f"File Size : {data.get('file_size_mb', 'N/A')}",
        f"Units     : {data['units']}",
        f"Project   : {data['epsg']}",
        "-" * 50,
    ]

    for etype, layers in sorted(data["layers"].items()):
        report.append(f"\n{etype} ({len(layers)} Layers)")
        report.extend([f"  - {l}" for l in sorted(layers)])

    return "\n".join(report)


def run_inspection(file_path: str, original_name: str = None) -> str:
    """
    Inspect DXF and return report text
    """
    logger.info("Running Inspection of the File, Please Wait")
    path = pathlib.Path(file_path).resolve()

    if not path.exists():
        logger.error(f"File missing: {path}")
        return

    try:
        size_bytes = path.stat().st_size
        size_mb = size_bytes / (1024 * 1024)

        doc = ezdxf.readfile(path)
        raw_data = get_dxf_metadata(doc, doc.modelspace())

        raw_data["file_size_mb"] = f"{size_mb:.2f} MB"

        filename = original_name if original_name else path.name

        report_text = format_text_report(filename, raw_data)
        return report_text

    except Exception as e:
        logger.error(f"Failed to process {path.name}: {e}")
