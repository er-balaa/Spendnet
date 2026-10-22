from typing import Optional, Any
from pydantic import BaseModel, Field

class EvidenceExcerpt(BaseModel):
    turn_number: Optional[int] = None
    timecode: Optional[str] = None
    speaker: Optional[str] = None
    quote: str
    relevance: str

class KeyFinding(BaseModel):
    topic: str
    finding: str
    evidence_ref: str
    exact_quote: Optional[str] = None
    screen_rule_impact: Optional[str] = None

class RecommendedAction(BaseModel):
    action: str
    owner: Optional[str] = None  # None if not established in text
    priority: str = "Medium"  # High, Medium, Low
    due_timeline: Optional[str] = None

class ConversationAnalysis(BaseModel):
    summary: str
    key_findings: list[KeyFinding] = []
    evidence_excerpts: list[EvidenceExcerpt] = []
    limitations_and_uncertainties: list[str] = []
    recommended_actions: list[RecommendedAction] = []
    coaching_notes: Optional[str] = None
    generation_method: str = "pregenerated_verified"

class ConversationItem(BaseModel):
    source_type: str
    source_id: str
    record_ref: str
    title: str
    started_at: str
    person_name: Optional[str] = None
    person_role: str
    has_usable_transcript: bool
    duration_seconds: Optional[float] = None
    suggested_routes: list[str] = []
    manual_route_override: Optional[list[str]] = None
    assigned_routes: list[str] = []
    review_status: str
    applied_revision: int
    analysis_freshness: str  # "fresh" | "stale_pending_review" | "not_applicable"
    is_connected: Optional[bool] = None
    is_conversation: Optional[bool] = None

class ConversationDetail(ConversationItem):
    payload: dict
    transcript_payload: Optional[dict] = None
    call_transcript: Optional[str] = None
    route_reasoning: str = ""
    review_notes: Optional[str] = None
    analysis: Optional[ConversationAnalysis] = None
    batch_id: str
    exported_at: Optional[str] = None

class RouteUpdateRequest(BaseModel):
    routes: list[str]
    review_notes: Optional[str] = None

class ReviewStatusUpdateRequest(BaseModel):
    review_status: str
    review_notes: Optional[str] = None

class DashboardMetrics(BaseModel):
    total_unique_records: int
    total_calls: int
    total_meetings: int
    transcript_coverage: dict
    routing_distribution: dict
    review_status_distribution: dict
    missing_or_unusable_text_count: int
    records_requiring_review_count: int
    activity_by_person: list[dict]
    activity_by_hour: list[dict]
    call_connection_metrics: dict
    active_filters: dict

class ImportResult(BaseModel):
    batch_id: str
    revision: int
    total_records_in_batch: int
    inserted_records: int
    updated_records: int
    ignored_records: int
    total_unique_in_db: int
    stale_analyses_flagged: int
    message: str

class ManifestItem(BaseModel):
    source_type: str
    source_id: str
    record_ref: str
    applied_revision: int
    routes: list[str]
    has_manual_override: bool
    review_status: str
    analysis_freshness: str
    output_paths: list[str]
    title: str
    person_name: Optional[str] = None
