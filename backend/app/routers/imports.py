import random
from typing import Optional
from fastapi import APIRouter, HTTPException, Query, UploadFile, File
import json
from app.config import settings
from app.services.import_service import import_file, import_batch_from_dict, reset_and_seed
from app.models.schemas import ImportResult
from app.database import db

router = APIRouter(prefix="/imports", tags=["Imports and Replay"])

@router.post("/initial", response_model=ImportResult)
def trigger_initial_import():
    """Import initial batch 01_initial.json (Rev 1, 44 records)."""
    if not settings.initial_data_path.exists():
        raise HTTPException(status_code=404, detail=f"Initial file not found at {settings.initial_data_path}")
    return import_file(settings.initial_data_path)

@router.post("/repeat", response_model=ImportResult)
def trigger_repeat_import(shuffle: bool = Query(True, description="Shuffle record ordering to verify order independence")):
    """
    Import initial batch 01_initial.json again, optionally in randomized order.
    Must not create duplicate records or inflate metrics.
    """
    if not settings.initial_data_path.exists():
        raise HTTPException(status_code=404, detail=f"Initial file not found at {settings.initial_data_path}")
    
    with open(settings.initial_data_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    if shuffle:
        # Create a shuffled copy of records array to verify order independence
        records_copy = list(data.get("records", []))
        random.shuffle(records_copy)
        data["records"] = records_copy

    return import_batch_from_dict(data, filename="01_initial_repeat_reordered.json")

@router.post("/update", response_model=ImportResult)
def trigger_update_import():
    """Import update batch 02_update.json (Rev 2, M07 update with 27 turns)."""
    if not settings.update_data_path.exists():
        raise HTTPException(status_code=404, detail=f"Update file not found at {settings.update_data_path}")
    return import_file(settings.update_data_path)

@router.post("/upload", response_model=ImportResult)
async def upload_batch_file(file: UploadFile = File(...)):
    """Upload custom JSON batch file to import."""
    contents = await file.read()
    try:
        data = json.loads(contents.decode("utf-8"))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid JSON file: {str(e)}")
    return import_batch_from_dict(data, filename=file.filename)

@router.post("/reset")
def trigger_reset(mode: str = Query("demo", description="Reset mode: 'empty', 'initial', 'demo' (both batches)")):
    """Reset database state to empty, initial batch only, or demo (both batches)."""
    return reset_and_seed(mode=mode)

@router.get("/history")
def get_import_history():
    """Retrieve import batch execution log for audit/replay verification."""
    cursor = db.import_batches.find({}, {"_id": 0}).sort("imported_at", -1)
    return list(cursor)
