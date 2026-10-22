export type SourceType = 'call' | 'meeting';

export type RouteCategory = 
  | 'Sales Coaching'
  | 'Deal Next Steps'
  | 'Customer Follow-up'
  | 'Internal / Vendor Note'
  | 'Human Review';

export type ReviewStatus = 
  | 'Reviewed'
  | 'Awaiting Review'
  | 'Under Review'
  | 'Missing Transcript'
  | 'Unusable Text';

export interface EvidenceExcerpt {
  turn_number?: number;
  timecode?: string;
  speaker?: string;
  quote: string;
  relevance: string;
}

export interface KeyFinding {
  topic: string;
  finding: string;
  evidence_ref: string;
  exact_quote?: string;
  screen_rule_impact?: string;
}

export interface RecommendedAction {
  action: string;
  owner?: string;
  priority: 'High' | 'Medium' | 'Low';
  due_timeline?: string;
}

export interface ConversationAnalysis {
  summary: string;
  key_findings: KeyFinding[];
  evidence_excerpts: EvidenceExcerpt[];
  limitations_and_uncertainties: string[];
  recommended_actions: RecommendedAction[];
  coaching_notes?: string;
  generation_method: string;
}

export interface ConversationItem {
  source_type: SourceType;
  source_id: string;
  record_ref: string;
  title: string;
  started_at: string;
  person_name?: string;
  person_role: string;
  has_usable_transcript: boolean;
  duration_seconds?: number;
  suggested_routes: string[];
  manual_route_override?: string[] | null;
  assigned_routes: string[];
  review_status: string;
  applied_revision: number;
  analysis_freshness: string;
  is_connected?: boolean | null;
  is_conversation?: boolean | null;
}

export interface ConversationDetail extends ConversationItem {
  payload: Record<string, any>;
  transcript_payload?: Record<string, any> | null;
  call_transcript?: string | null;
  route_reasoning: string;
  review_notes?: string | null;
  analysis?: ConversationAnalysis | null;
  batch_id: string;
  exported_at?: string;
}

export interface MetricCoverage {
  numerator: number;
  denominator: number;
  rate: number;
  calls_covered: number;
  calls_total: number;
  calls_rate: number;
  meetings_covered: number;
  meetings_total: number;
  meetings_rate: number;
  definition: string;
}

export interface ConnectionMetric {
  numerator: number;
  denominator: number;
  rate: number;
  unknown_count: number;
  definition: string;
}

export interface CallConnectionMetrics {
  stored_connection_rate: ConnectionMetric;
  stored_conversation_rate: ConnectionMetric;
  first_dial_count: number;
  repeat_dial_count: number;
}

export interface DashboardMetrics {
  total_unique_records: number;
  total_calls: number;
  total_meetings: number;
  transcript_coverage: MetricCoverage;
  routing_distribution: {
    counts: Record<string, number>;
    total_assignments: number;
    distinct_records: number;
    multi_route_note: string;
  };
  review_status_distribution: Record<string, number>;
  missing_or_unusable_text_count: number;
  records_requiring_review_count: number;
  activity_by_person: Array<{
    name: string;
    role: string;
    total_records: number;
    calls: number;
    meetings: number;
    usable_transcripts: number;
    connected_calls: number;
  }>;
  activity_by_hour: Array<{
    hour: string;
    calls: number;
    meetings: number;
    total: number;
  }>;
  call_connection_metrics: CallConnectionMetrics;
  active_filters: {
    source_type: string;
    person: string;
  };
}

export interface ImportResult {
  batch_id: string;
  revision: number;
  total_records_in_batch: number;
  inserted_records: number;
  updated_records: number;
  ignored_records: number;
  total_unique_in_db: number;
  stale_analyses_flagged: number;
  message: string;
}

export interface ImportBatchRecord {
  batch_id: string;
  revision: number;
  filename: string;
  imported_at: string;
  total_records_in_batch: number;
  inserted_count: number;
  updated_count: number;
  ignored_count: number;
  total_unique_in_db: number;
}
