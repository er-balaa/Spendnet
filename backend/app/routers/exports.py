import json
from pathlib import Path
from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from app.services.export_service import generate_exports
from app.config import settings

router = APIRouter(prefix="/exports", tags=["Exports and Manifest"])

@router.post("/generate")
def create_export_package():
    """Generates real physical exports, manifest files, and ZIP archive."""
    export_root, zip_path, manifest_path = generate_exports()
    with open(manifest_path, "r", encoding="utf-8") as f:
        manifest_data = json.load(f)
    return {
        "status": "success",
        "export_directory": str(export_root),
        "zip_path": str(zip_path),
        "total_records": manifest_data.get("total_records"),
        "message": "Export package generated successfully with manifest.json and manifest.csv."
    }

@router.get("/manifest")
def get_manifest():
    """Returns the current manifest JSON. Generates exports if not yet created."""
    manifest_path = settings.exports_dir / "manifest.json"
    if not manifest_path.exists():
        generate_exports()
    with open(manifest_path, "r", encoding="utf-8") as f:
        return json.load(f)

@router.get("/download")
def download_export_zip():
    """Downloads the generated ZIP archive."""
    zip_path = settings.exports_dir.parent / "spendnest_exports.zip"
    if not zip_path.exists():
        generate_exports()
    if not zip_path.exists():
        raise HTTPException(status_code=500, detail="Failed to locate export ZIP archive.")
    return FileResponse(
        path=str(zip_path),
        filename="spendnest_revenue_intelligence_exports.zip",
        media_type="application/zip"
    )
