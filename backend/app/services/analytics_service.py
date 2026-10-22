from datetime import datetime
import zoneinfo
from typing import Optional
from app.database import db
from app.models.schemas import DashboardMetrics

TZ_KOLKATA = zoneinfo.ZoneInfo("Asia/Kolkata")

def get_dashboard_metrics(
    source_type_filter: Optional[str] = None,
    person_filter: Optional[str] = None
) -> DashboardMetrics:
    """
    Computes dashboard metrics strictly adhering to DATA_DICTIONARY.md definitions.
    - All denominators are clearly stated.
    - Call representatives and meeting organizers are kept strictly separate.
    - Recharts-ready formatted datasets.
    """
    query = {}
    if source_type_filter and source_type_filter != "all":
        query["source_type"] = source_type_filter
    if person_filter and person_filter != "all":
        query["person_name"] = person_filter

    records = list(db.conversations.find(query))
    total_records = len(records)

    calls = [r for r in records if r["source_type"] == "call"]
    meetings = [r for r in records if r["source_type"] == "meeting"]
    total_calls = len(calls)
    total_meetings = len(meetings)

    # Transcript coverage calculation
    usable_total = sum(1 for r in records if r.get("has_usable_transcript"))
    usable_calls = sum(1 for r in calls if r.get("has_usable_transcript"))
    usable_meetings = sum(1 for r in meetings if r.get("has_usable_transcript"))

    transcript_coverage = {
        "numerator": usable_total,
        "denominator": total_records,
        "rate": round((usable_total / total_records * 100), 1) if total_records > 0 else 0.0,
        "calls_covered": usable_calls,
        "calls_total": total_calls,
        "calls_rate": round((usable_calls / total_calls * 100), 1) if total_calls > 0 else 0.0,
        "meetings_covered": usable_meetings,
        "meetings_total": total_meetings,
        "meetings_rate": round((usable_meetings / total_meetings * 100), 1) if total_meetings > 0 else 0.0,
        "definition": "Ratio of records with usable conversational text (non-blank call transcript or >= 1 meeting turn) over total selected records in filter."
    }

    # Routing distribution
    routing_counts = {
        "Sales Coaching": 0,
        "Deal Next Steps": 0,
        "Customer Follow-up": 0,
        "Internal / Vendor Note": 0,
        "Human Review": 0
    }
    total_route_assignments = 0
    for r in records:
        routes = r.get("assigned_routes") or []
        for route in routes:
            if route in routing_counts:
                routing_counts[route] += 1
                total_route_assignments += 1
            else:
                routing_counts[route] = routing_counts.get(route, 0) + 1
                total_route_assignments += 1

    # Review status distribution
    status_counts = {}
    for r in records:
        status = r.get("review_status", "Unspecified")
        status_counts[status] = status_counts.get(status, 0) + 1

    missing_or_unusable_text_count = sum(1 for r in records if not r.get("has_usable_transcript"))
    records_requiring_review_count = sum(
        1 for r in records
        if r.get("review_status") in ["Awaiting Review", "Missing Transcript", "Unusable Text"]
        or r.get("analysis_freshness") == "stale_pending_review"
    )

    # Activity by person (strictly distinguishing call reps from meeting organizers)
    person_map = {}
    for r in records:
        pname = r.get("person_name") or "Unassigned"
        prole = r.get("person_role") or "Unknown"
        key = (pname, prole)
        if key not in person_map:
            person_map[key] = {
                "name": pname,
                "role": prole,
                "total_records": 0,
                "calls": 0,
                "meetings": 0,
                "usable_transcripts": 0,
                "connected_calls": 0
            }
        person_map[key]["total_records"] += 1
        if r["source_type"] == "call":
            person_map[key]["calls"] += 1
            if r.get("is_connected"):
                person_map[key]["connected_calls"] += 1
        else:
            person_map[key]["meetings"] += 1
        
        if r.get("has_usable_transcript"):
            person_map[key]["usable_transcripts"] += 1

    activity_by_person = sorted(person_map.values(), key=lambda x: x["total_records"], reverse=True)

    # Activity by hour in Asia/Kolkata (21 August 2026)
    hourly_buckets = {f"{h:02d}:00": {"hour": f"{h:02d}:00", "calls": 0, "meetings": 0, "total": 0} for h in range(24)}
    for r in records:
        t_str = r.get("started_at")
        if t_str:
            try:
                dt = datetime.fromisoformat(t_str.replace("Z", "+00:00")).astimezone(TZ_KOLKATA)
                hour_key = f"{dt.hour:02d}:00"
                if hour_key in hourly_buckets:
                    if r["source_type"] == "call":
                        hourly_buckets[hour_key]["calls"] += 1
                    else:
                        hourly_buckets[hour_key]["meetings"] += 1
                    hourly_buckets[hour_key]["total"] += 1
            except Exception:
                pass
    
    activity_by_hour = [v for k, v in sorted(hourly_buckets.items())]

    # Call connection metrics (strictly defined)
    calls_with_connected_field = [c for c in calls if c.get("is_connected") is not None]
    connected_calls_count = sum(1 for c in calls if c.get("is_connected") is True)
    unknown_connected_count = len(calls) - len(calls_with_connected_field)

    calls_with_conv_field = [c for c in calls if c.get("is_conversation") is not None]
    conv_calls_count = sum(1 for c in calls if c.get("is_conversation") is True)
    unknown_conv_count = len(calls) - len(calls_with_conv_field)

    first_dial_count = sum(1 for c in calls if c.get("payload", {}).get("first_dial_ever") is True)
    repeat_dial_count = sum(1 for c in calls if (c.get("payload", {}).get("prior_dials_ever") or 0) > 0)

    call_connection_metrics = {
        "stored_connection_rate": {
            "numerator": connected_calls_count,
            "denominator": len(calls_with_connected_field),
            "rate": round((connected_calls_count / len(calls_with_connected_field) * 100), 1) if calls_with_connected_field else 0.0,
            "unknown_count": unknown_connected_count,
            "definition": "Calls where source-reported is_connected == true divided by calls with non-null is_connected."
        },
        "stored_conversation_rate": {
            "numerator": conv_calls_count,
            "denominator": len(calls_with_conv_field),
            "rate": round((conv_calls_count / len(calls_with_conv_field) * 100), 1) if calls_with_conv_field else 0.0,
            "unknown_count": unknown_conv_count,
            "definition": "Calls where source-reported is_conversation == true divided by calls with non-null is_conversation."
        },
        "first_dial_count": first_dial_count,
        "repeat_dial_count": repeat_dial_count
    }

    return DashboardMetrics(
        total_unique_records=total_records,
        total_calls=total_calls,
        total_meetings=total_meetings,
        transcript_coverage=transcript_coverage,
        routing_distribution={
            "counts": routing_counts,
            "total_assignments": total_route_assignments,
            "distinct_records": total_records,
            "multi_route_note": "A single conversation can be assigned to multiple routes; sum of assignments may exceed unique record count."
        },
        review_status_distribution=status_counts,
        missing_or_unusable_text_count=missing_or_unusable_text_count,
        records_requiring_review_count=records_requiring_review_count,
        activity_by_person=activity_by_person,
        activity_by_hour=activity_by_hour,
        call_connection_metrics=call_connection_metrics,
        active_filters={
            "source_type": source_type_filter or "all",
            "person": person_filter or "all"
        }
    )
