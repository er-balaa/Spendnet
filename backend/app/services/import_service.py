import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional
from app.database import db, init_db
from app.services.routing_engine import compute_routing_and_analysis, extract_person_and_role
from app.models.schemas import ImportResult
from app.config import settings

def format_title(source_type: str, record_ref: str, payload: dict) -> str:
    if source_type == "meeting":
        return payload.get("title") or f"Meeting {record_ref}"
    else:
        direction = payload.get("direction", "call").capitalize()
        rep = payload.get("rep_name") or payload.get("rep_email") or "Unknown Rep"
        return f"{direction} Call — {rep} ({record_ref})"

def import_batch_from_dict(batch_data: dict, filename: str = "") -> ImportResult:
    """
    Imports a delivery batch following the strict DATA_CONTRACT.md rules.
    - Identity is (source_type, source_id).
    - Stores last applied revision per record.
    - Ignores equal or older revisions.
    - Replaces entire source payload and transcript_payload on update.
    - Preserves candidate analysis, review state, and manual route overrides.
    """
    init_db()
    batch_id = batch_data.get("batch_id", "unknown-batch")
    revision = int(batch_data.get("revision", 1))
    exported_at = batch_data.get("exported_at")
    records = batch_data.get("records", [])

    inserted_count = 0
    updated_count = 0
    ignored_count = 0
    stale_flagged = 0

    for rec in records:
        source_type = rec.get("source_type")
        source_id = rec.get("source_id")
        record_ref = rec.get("record_ref")
        payload = rec.get("payload", {})
        transcript_payload = rec.get("transcript_payload")

        if not source_type or not source_id:
            continue

        existing = db.conversations.find_one({"source_type": source_type, "source_id": source_id})

        if existing:
            existing_rev = existing.get("applied_revision", 0)
            if existing_rev >= revision:
                # Rule: same or older revision is ignored
                ignored_count += 1
                continue

            # Newer revision arriving -> Update existing record
            manual_override = existing.get("manual_route_override")
            review_notes = existing.get("review_notes")
            previous_status = existing.get("review_status")

            derived = compute_routing_and_analysis(
                record_ref=record_ref,
                source_type=source_type,
                payload=payload,
                transcript_payload=transcript_payload,
                revision=revision
            )

            # Preserve manual override if present; otherwise use new suggestion
            assigned_routes = manual_override if manual_override is not None else derived["suggested_routes"]

            # If manual route existed and source text changed, flag freshness
            analysis_freshness = derived["analysis_freshness"]
            if manual_override is not None and derived["has_usable_transcript"] and not existing.get("has_usable_transcript"):
                analysis_freshness = "stale_pending_review"
                stale_flagged += 1

            person_name, person_role = extract_person_and_role(source_type, payload)
            started_at = payload.get("started_at") if source_type == "call" else payload.get("starts_at")

            # Full-record replacement for source payloads
            update_doc = {
                "source_type": source_type,
                "source_id": source_id,
                "record_ref": record_ref,
                "batch_id": batch_id,
                "applied_revision": revision,
                "exported_at": exported_at,
                "payload": payload,
                "transcript_payload": transcript_payload,
                "title": format_title(source_type, record_ref, payload),
                "started_at": started_at,
                "person_name": person_name,
                "person_role": person_role,
                "duration_seconds": payload.get("duration_seconds"),
                "has_usable_transcript": derived["has_usable_transcript"],
                "suggested_routes": derived["suggested_routes"],
                "route_reasoning": derived["route_reasoning"],
                "manual_route_override": manual_override,  # Preserved!
                "assigned_routes": assigned_routes,
                "review_status": derived["review_status"] if previous_status in ["Missing Transcript", "Unusable Text"] else previous_status,
                "review_notes": review_notes,
                "analysis": derived["analysis"],
                "analysis_freshness": analysis_freshness,
                "call_transcript": derived["call_transcript"],
                "is_connected": payload.get("is_connected"),
                "is_conversation": payload.get("is_conversation"),
                "updated_at": datetime.now(timezone.utc).isoformat()
            }

            db.conversations.replace_one(
                {"source_type": source_type, "source_id": source_id},
                update_doc
            )
            updated_count += 1

        else:
            # First time seeing this record -> Insert
            derived = compute_routing_and_analysis(
                record_ref=record_ref,
                source_type=source_type,
                payload=payload,
                transcript_payload=transcript_payload,
                revision=revision
            )

            person_name, person_role = extract_person_and_role(source_type, payload)
            started_at = payload.get("started_at") if source_type == "call" else payload.get("starts_at")

            doc = {
                "source_type": source_type,
                "source_id": source_id,
                "record_ref": record_ref,
                "batch_id": batch_id,
                "applied_revision": revision,
                "exported_at": exported_at,
                "payload": payload,
                "transcript_payload": transcript_payload,
                "title": format_title(source_type, record_ref, payload),
                "started_at": started_at,
                "person_name": person_name,
                "person_role": person_role,
                "duration_seconds": payload.get("duration_seconds"),
                "has_usable_transcript": derived["has_usable_transcript"],
                "suggested_routes": derived["suggested_routes"],
                "route_reasoning": derived["route_reasoning"],
                "manual_route_override": None,
                "assigned_routes": derived["suggested_routes"],
                "review_status": derived["review_status"],
                "review_notes": None,
                "analysis": derived["analysis"],
                "analysis_freshness": derived["analysis_freshness"],
                "call_transcript": derived["call_transcript"],
                "is_connected": payload.get("is_connected"),
                "is_conversation": payload.get("is_conversation"),
                "created_at": datetime.now(timezone.utc).isoformat(),
                "updated_at": datetime.now(timezone.utc).isoformat()
            }

            db.conversations.insert_one(doc)
            inserted_count += 1

    total_unique = db.conversations.count_documents({})

    # Record import batch history
    db.import_batches.insert_one({
        "batch_id": batch_id,
        "revision": revision,
        "filename": filename,
        "imported_at": datetime.now(timezone.utc).isoformat(),
        "total_records_in_batch": len(records),
        "inserted_count": inserted_count,
        "updated_count": updated_count,
        "ignored_count": ignored_count,
        "total_unique_in_db": total_unique
    })

    return ImportResult(
        batch_id=batch_id,
        revision=revision,
        total_records_in_batch=len(records),
        inserted_records=inserted_count,
        updated_records=updated_count,
        ignored_records=ignored_count,
        total_unique_in_db=total_unique,
        stale_analyses_flagged=stale_flagged,
        message=f"Batch '{batch_id}' (Rev {revision}) processed: {inserted_count} inserted, {updated_count} updated, {ignored_count} ignored. DB total unique: {total_unique}."
    )

def import_file(file_path: Path) -> ImportResult:
    with open(file_path, "r", encoding="utf-8") as f:
        data = json.load(f)
    return import_batch_from_dict(data, filename=file_path.name)

def reset_and_seed(mode: str = "initial") -> dict:
    """
    Reset database and seed test data.
    - 'empty': clear all collections
    - 'initial': clear and load 01_initial.json (44 records, 17 usable texts)
    - 'demo' or 'both': clear, load 01_initial.json, then load 02_update.json (44 records, 18 usable texts)
    """
    db.conversations.delete_many({})
    db.import_batches.delete_many({})
    init_db()

    if mode == "empty":
        return {"status": "success", "mode": "empty", "unique_records": 0}

    # Load initial batch
    res1 = import_file(settings.initial_data_path)
    if mode in ["demo", "both"]:
        res2 = import_file(settings.update_data_path)
        return {
            "status": "success",
            "mode": mode,
            "step1_initial": res1.model_dump(),
            "step2_update": res2.model_dump(),
            "final_unique_records": db.conversations.count_documents({})
        }
    
    return {
        "status": "success",
        "mode": "initial",
        "initial_result": res1.model_dump(),
        "final_unique_records": db.conversations.count_documents({})
    }
