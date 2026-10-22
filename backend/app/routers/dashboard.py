from typing import Optional
from fastapi import APIRouter, Query
from app.database import db
from app.services.analytics_service import get_dashboard_metrics
from app.models.schemas import DashboardMetrics

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/metrics", response_model=DashboardMetrics)
def fetch_dashboard_metrics(
    source_type: Optional[str] = Query(None, description="Filter by source_type (call, meeting, all)"),
    person: Optional[str] = Query(None, description="Filter by person name or email")
):
    return get_dashboard_metrics(source_type_filter=source_type, person_filter=person)

@router.get("/filters")
def get_available_filters():
    """Returns available unique persons and source types for filter controls."""
    persons_cursor = db.conversations.aggregate([
        {"$group": {"_id": {"name": "$person_name", "role": "$person_role"}}},
        {"$sort": {"_id.name": 1}}
    ])
    persons = [
        {"name": doc["_id"]["name"], "role": doc["_id"]["role"]}
        for doc in persons_cursor if doc["_id"]["name"]
    ]

    source_types = db.conversations.distinct("source_type")
    review_statuses = db.conversations.distinct("review_status")

    return {
        "source_types": source_types,
        "persons": persons,
        "review_statuses": review_statuses
    }
