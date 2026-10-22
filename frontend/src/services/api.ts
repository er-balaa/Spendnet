import {
  ConversationItem,
  ConversationDetail,
  DashboardMetrics,
  ImportResult,
  ImportBatchRecord
} from '../types';

const rawBase = (import.meta.env.VITE_API_URL as string) || '';
const API_BASE = rawBase ? `${rawBase.replace(/\/$/, '')}/api` : '/api';

export async function fetchDashboardMetrics(sourceType?: string, person?: string): Promise<DashboardMetrics> {
  const params = new URLSearchParams();
  if (sourceType && sourceType !== 'all') params.append('source_type', sourceType);
  if (person && person !== 'all') params.append('person', person);
  params.append('_t', Date.now().toString());
  
  const res = await fetch(`${API_BASE}/dashboard/metrics?${params.toString()}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch dashboard metrics');
  return res.json();
}

export async function fetchFilterOptions(): Promise<{
  source_types: string[];
  persons: Array<{ name: string; role: string }>;
  review_statuses: string[];
}> {
  const res = await fetch(`${API_BASE}/dashboard/filters?_t=${Date.now()}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch filters');
  return res.json();
}

export async function fetchConversations(params?: {
  source_type?: string;
  person?: string;
  review_status?: string;
  has_transcript?: boolean;
  search?: string;
  sort_by?: string;
  order?: string;
}): Promise<ConversationItem[]> {
  const searchParams = new URLSearchParams();
  if (params?.source_type && params.source_type !== 'all') searchParams.append('source_type', params.source_type);
  if (params?.person && params.person !== 'all') searchParams.append('person', params.person);
  if (params?.review_status && params.review_status !== 'all') searchParams.append('review_status', params.review_status);
  if (params?.has_transcript !== undefined) searchParams.append('has_transcript', String(params.has_transcript));
  if (params?.search) searchParams.append('search', params.search);
  if (params?.sort_by) searchParams.append('sort_by', params.sort_by);
  if (params?.order) searchParams.append('order', params.order);
  searchParams.append('_t', Date.now().toString());

  const query = searchParams.toString();
  const url = `${API_BASE}/conversations?${query}`;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch conversations');
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

export async function fetchConversationDetail(sourceType: string, sourceId: string): Promise<ConversationDetail> {
  const res = await fetch(`${API_BASE}/conversations/${sourceType}/${sourceId}`);
  if (!res.ok) throw new Error(`Failed to fetch conversation (${sourceType}, ${sourceId})`);
  return res.json();
}

export async function updateConversationRoutes(
  sourceType: string,
  sourceId: string,
  routes: string[],
  reviewNotes?: string
): Promise<{ status: string; message: string }> {
  const res = await fetch(`${API_BASE}/conversations/${sourceType}/${sourceId}/routes`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ routes, review_notes: reviewNotes })
  });
  if (!res.ok) throw new Error('Failed to update routes');
  return res.json();
}

export async function resetConversationRoute(sourceType: string, sourceId: string): Promise<{ status: string; message: string }> {
  const res = await fetch(`${API_BASE}/conversations/${sourceType}/${sourceId}/reset-route`, {
    method: 'POST'
  });
  if (!res.ok) throw new Error('Failed to reset route');
  return res.json();
}

export async function updateConversationReviewStatus(
  sourceType: string,
  sourceId: string,
  status: string,
  reviewNotes?: string
): Promise<{ status: string }> {
  const res = await fetch(`${API_BASE}/conversations/${sourceType}/${sourceId}/review-status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ review_status: status, review_notes: reviewNotes })
  });
  if (!res.ok) throw new Error('Failed to update review status');
  return res.json();
}

export async function triggerInitialImport(): Promise<ImportResult> {
  const res = await fetch(`${API_BASE}/imports/initial`, { method: 'POST' });
  if (!res.ok) throw new Error('Initial import failed');
  return res.json();
}

export async function triggerRepeatImport(shuffle: boolean = true): Promise<ImportResult> {
  const res = await fetch(`${API_BASE}/imports/repeat?shuffle=${shuffle}`, { method: 'POST' });
  if (!res.ok) throw new Error('Repeat import failed');
  return res.json();
}

export async function triggerUpdateImport(): Promise<ImportResult> {
  const res = await fetch(`${API_BASE}/imports/update`, { method: 'POST' });
  if (!res.ok) throw new Error('Update import failed');
  return res.json();
}

export async function triggerResetDatabase(mode: 'empty' | 'initial' | 'demo' = 'demo'): Promise<any> {
  const res = await fetch(`${API_BASE}/imports/reset?mode=${mode}`, { method: 'POST' });
  if (!res.ok) throw new Error('Reset failed');
  return res.json();
}

export async function fetchImportHistory(): Promise<ImportBatchRecord[]> {
  const res = await fetch(`${API_BASE}/imports/history`);
  if (!res.ok) throw new Error('Failed to fetch import history');
  return res.json();
}

export async function fetchManagerBrief(): Promise<{
  date: string;
  timezone: string;
  title: string;
  content_markdown: string;
}> {
  const res = await fetch(`${API_BASE}/brief/`);
  if (!res.ok) throw new Error('Failed to fetch manager brief');
  return res.json();
}

export async function generateExports(): Promise<{
  status: string;
  total_records: number;
  message: string;
}> {
  const res = await fetch(`${API_BASE}/exports/generate`, { method: 'POST' });
  if (!res.ok) throw new Error('Export generation failed');
  return res.json();
}

export async function fetchManifest(): Promise<{
  generated_at: string;
  total_records: number;
  manifest: any[];
}> {
  const res = await fetch(`${API_BASE}/exports/manifest`);
  if (!res.ok) throw new Error('Failed to fetch manifest');
  return res.json();
}

export function getExportDownloadUrl(): string {
  return `${API_BASE}/exports/download`;
}

export async function fetchHealth(): Promise<{
  status: string;
  database?: string;
  cluster_type?: string;
  database_name?: string;
  unique_records?: number;
  database_error?: string;
}> {
  const res = await fetch(`${API_BASE}/health`);
  if (!res.ok) throw new Error('Health check failed');
  return res.json();
}
