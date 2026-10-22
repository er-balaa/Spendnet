from datetime import datetime, timezone
from typing import Optional
from fastapi import APIRouter, HTTPException, Query
from app.database import db
from app.models.schemas import ConversationItem, ConversationDetail, RouteUpdateRequest, ReviewStatusUpdateRequest

router = APIRouter(prefix="/conversations", tags=["Conversations"])

@router.get("", response_model=list[ConversationItem])
@router.get("/", response_model=list[ConversationItem])
def list_conversations(
    source_type: Optional[str] = Query(None, description="Filter by source_type: call or meeting"),
    person: Optional[str] = Query(None, description="Filter by rep or organizer name/email"),
    review_status: Optional[str] = Query(None, description="Filter by review_status"),
    has_transcript: Optional[bool] = Query(None, description="Filter by transcript availability"),
    search: Optional[str] = Query(None, description="Search term in title, ref, person, source_id"),
    sort_by: str = Query("record_ref", description="Sort field: record_ref, started_at, duration_seconds"),
    order: str = Query("asc", description="Sort direction: asc or desc")
):
    query = {}
    if source_type and source_type != "all":
        query["source_type"] = source_type
    if person and person != "all":
        query["person_name"] = person
    if review_status and review_status != "all":
        query["review_status"] = review_status
    if has_transcript is not None:
        query["has_usable_transcript"] = has_transcript

    if search:
        search_regex = {"$regex": search, "$options": "i"}
        query["$or"] = [
            {"record_ref": search_regex},
            {"title": search_regex},
            {"person_name": search_regex},
            {"source_id": search_regex}
        ]

    direction = 1 if order == "asc" else -1
    cursor = db.conversations.find(query).sort(sort_by, direction)

    results = []
    for doc in cursor:
        results.append(ConversationItem(
            source_type=doc["source_type"],
            source_id=doc["source_id"],
            record_ref=doc["record_ref"],
            title=doc.get("title", ""),
            started_at=doc.get("started_at", ""),
            person_name=doc.get("person_name"),
            person_role=doc.get("person_role", "Unknown"),
            has_usable_transcript=doc.get("has_usable_transcript", False),
            duration_seconds=doc.get("duration_seconds"),
            suggested_routes=doc.get("suggested_routes", []),
            manual_route_override=doc.get("manual_route_override"),
            assigned_routes=doc.get("assigned_routes", []),
            review_status=doc.get("review_status", "Unspecified"),
            applied_revision=doc.get("applied_revision", 1),
            analysis_freshness=doc.get("analysis_freshness", "not_applicable"),
            is_connected=doc.get("is_connected"),
            is_conversation=doc.get("is_conversation")
        ))
    return results

@router.get("/{source_type}/{source_id}", response_model=ConversationDetail)
def get_conversation_detail(source_type: str, source_id: str):
    doc = db.conversations.find_one({"source_type": source_type, "source_id": source_id})
    if not doc:
        raise HTTPException(status_code=404, detail=f"Conversation ({source_type}, {source_id}) not found.")
    
    return ConversationDetail(
        source_type=doc["source_type"],
        source_id=doc["source_id"],
        record_ref=doc["record_ref"],
        title=doc.get("title", ""),
        started_at=doc.get("started_at", ""),
        person_name=doc.get("person_name"),
        person_role=doc.get("person_role", "Unknown"),
        has_usable_transcript=doc.get("has_usable_transcript", False),
        duration_seconds=doc.get("duration_seconds"),
        suggested_routes=doc.get("suggested_routes", []),
        manual_route_override=doc.get("manual_route_override"),
        assigned_routes=doc.get("assigned_routes", []),
        review_status=doc.get("review_status", "Unspecified"),
        applied_revision=doc.get("applied_revision", 1),
        analysis_freshness=doc.get("analysis_freshness", "not_applicable"),
        is_connected=doc.get("is_connected"),
        is_conversation=doc.get("is_conversation"),
        payload=doc.get("payload", {}),
        transcript_payload=doc.get("transcript_payload"),
        call_transcript=doc.get("call_transcript"),
        route_reasoning=doc.get("route_reasoning", ""),
        review_notes=doc.get("review_notes"),
        analysis=doc.get("analysis"),
        batch_id=doc.get("batch_id", "unknown"),
        exported_at=doc.get("exported_at")
    )

@router.patch("/{source_type}/{source_id}/routes")
def update_conversation_routes(source_type: str, source_id: str, req: RouteUpdateRequest):
    doc = db.conversations.find_one({"source_type": source_type, "source_id": source_id})
    if not doc:
        raise HTTPException(status_code=404, detail="Conversation not found.")

    update_fields = {
        "manual_route_override": req.routes,
        "assigned_routes": req.routes,
        "updated_at": datetime.now(timezone.utc).isoformat()
    }
    if req.review_notes is not None:
        update_fields["review_notes"] = req.review_notes

    db.conversations.update_one(
        {"source_type": source_type, "source_id": source_id},
        {"$set": update_fields}
    )
    return {
        "status": "success",
        "message": f"Routes manually overridden to: {req.routes}",
        "manual_route_override": req.routes
    }

@router.post("/{source_type}/{source_id}/reset-route")
def reset_conversation_route(source_type: str, source_id: str):
    doc = db.conversations.find_one({"source_type": source_type, "source_id": source_id})
    if not doc:
        raise HTTPException(status_code=404, detail="Conversation not found.")

    suggested = doc.get("suggested_routes", [])
    db.conversations.update_one(
        {"source_type": source_type, "source_id": source_id},
        {
            "$set": {
                "manual_route_override": None,
                "assigned_routes": suggested,
                "updated_at": datetime.now(timezone.utc).isoformat()
            }
        }
    )
    return {
        "status": "success",
        "message": "Manual route override removed; reverted to automated suggestion.",
        "assigned_routes": suggested
    }

@router.patch("/{source_type}/{source_id}/review-status")
def update_conversation_review_status(source_type: str, source_id: str, req: ReviewStatusUpdateRequest):
    doc = db.conversations.find_one({"source_type": source_type, "source_id": source_id})
    if not doc:
        raise HTTPException(status_code=404, detail="Conversation not found.")

    update_fields = {
        "review_status": req.review_status,
        "updated_at": datetime.now(timezone.utc).isoformat()
    }
    if req.review_notes is not None:
        update_fields["review_notes"] = req.review_notes

    # If status is updated by manager, mark analysis fresh
    if doc.get("analysis_freshness") == "stale_pending_review":
        update_fields["analysis_freshness"] = "fresh"

    db.conversations.update_one(
        {"source_type": source_type, "source_id": source_id},
        {"$set": update_fields}
    )
    return {
        "status": "success",
        "review_status": req.review_status,
        "review_notes": req.review_notes
    }
