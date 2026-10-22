import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Edit3, ShieldAlert, CheckCircle2, Clock, Calendar, User,
  FileCode, CheckSquare, Sparkles, ExternalLink, RefreshCw
} from 'lucide-react';
import { fetchConversationDetail, updateConversationReviewStatus } from '../services/api';
import { ConversationDetail } from '../types';
import { RouteBadge } from '../components/RouteBadge';
import { StatusBadge } from '../components/StatusBadge';
import { RouteEditorModal } from '../components/RouteEditorModal';
import { EvidenceViewer } from '../components/EvidenceViewer';

export const ConversationDetailPage: React.FC = () => {
  const { sourceType, sourceId } = useParams<{ sourceType: string; sourceId: string }>();
  const navigate = useNavigate();

  const [conversation, setConversation] = useState<ConversationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [highlightTurn, setHighlightTurn] = useState<number | null>(null);
  const [showRawPayload, setShowRawPayload] = useState(false);
  const [isEditingRoute, setIsEditingRoute] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const loadDetail = async () => {
    if (!sourceType || !sourceId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchConversationDetail(sourceType, sourceId);
      setConversation(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load conversation details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDetail();
  }, [sourceType, sourceId]);

  const handleStatusChange = async (newStatus: string) => {
    if (!sourceType || !sourceId) return;
    setIsUpdatingStatus(true);
    try {
      await updateConversationReviewStatus(sourceType, sourceId, newStatus);
      await loadDetail();
    } catch (err: any) {
      alert(err.message || 'Failed to update review status');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-semibold text-slate-500 mt-3">Loading conversation details...</span>
      </div>
    );
  }

  if (error || !conversation) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/inbox')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Inbox
        </button>
        <div className="p-6 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs">
          {error || 'Conversation not found.'}
        </div>
      </div>
    );
  }

  const analysis = conversation.analysis;
  const turns = conversation.transcript_payload?.turns || [];

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/inbox')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Inbox
        </button>

        <div className="flex items-center gap-2">
          {/* Status Selector */}
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg p-1 text-xs shadow-2xs">
            <span className="text-slate-400 pl-2 font-medium">Status:</span>
            <select
              value={conversation.review_status}
              disabled={isUpdatingStatus}
              onChange={e => handleStatusChange(e.target.value)}
              className="bg-transparent text-slate-800 font-semibold focus:outline-hidden pr-2 cursor-pointer"
            >
              <option value="Reviewed">Reviewed</option>
              <option value="Awaiting Review">Awaiting Review</option>
              <option value="Under Review">Under Review</option>
              <option value="Missing Transcript">Missing Transcript</option>
              <option value="Unusable Text">Unusable Text</option>
            </select>
          </div>

          <button
            onClick={() => setIsEditingRoute(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-2xs transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
            Edit Routes
          </button>
        </div>
      </div>

      {/* Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-mono font-bold text-sm px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-800 border border-slate-200">
                {conversation.record_ref}
              </span>
              <span className="px-2 py-0.5 rounded-md text-xs font-semibold bg-indigo-50 text-indigo-700 uppercase">
                {conversation.source_type}
              </span>
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                Revision {conversation.applied_revision}
              </span>
              <StatusBadge status={conversation.review_status} freshness={conversation.analysis_freshness} />
            </div>

            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              {conversation.title}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {conversation.assigned_routes.map(r => (
              <RouteBadge
                key={r}
                route={r}
                isOverride={conversation.manual_route_override?.includes(r)}
              />
            ))}
          </div>
        </div>

        {/* Metadata Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-100 text-xs">
          <div>
            <div className="text-slate-400 font-medium">Participant</div>
            <div className="font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
              <User className="w-3.5 h-3.5 text-slate-400" />
              {conversation.person_name || 'Unassigned'}
            </div>
            <div className="text-[11px] text-slate-400">{conversation.person_role}</div>
          </div>

          <div>
            <div className="text-slate-400 font-medium">Recorded Date & Time</div>
            <div className="font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              21 Aug 2026
            </div>
            <div className="text-[11px] text-slate-400 font-mono">
              {conversation.started_at ? conversation.started_at.slice(11, 19) : '--:--'} UTC
            </div>
          </div>

          <div>
            <div className="text-slate-400 font-medium">Duration & Capture</div>
            <div className="font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {conversation.duration_seconds ? `${conversation.duration_seconds}s` : 'Not recorded'}
            </div>
            <div className="text-[11px] text-slate-400">
              {conversation.payload.recording_status || (conversation.is_connected ? 'Connected' : 'Not connected')}
            </div>
          </div>

          <div>
            <div className="text-slate-400 font-medium">Source Identity</div>
            <div className="font-mono text-[11px] text-slate-700 truncate mt-0.5" title={conversation.source_id}>
              {conversation.source_id}
            </div>
            <div className="text-[11px] text-slate-400">Batch: {conversation.batch_id}</div>
          </div>
        </div>
      </div>

      {/* Freshness Alert Banner if Stale */}
      {conversation.analysis_freshness === 'stale_pending_review' && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900">
            <span className="font-bold">Analysis Stale / Pending Review: </span>
            A newer source revision ({conversation.applied_revision}) arrived with updated transcript content. The existing routing override is preserved, but you should review the newly supplied text below and confirm the review status.
          </div>
        </div>
      )}

      {/* Two-Column Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Transcript & Raw Evidence (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <EvidenceViewer
            sourceType={conversation.source_type}
            callTranscript={conversation.call_transcript}
            turns={turns}
            unavailableReason={conversation.transcript_payload?.unavailable_reason}
            highlightTurn={highlightTurn}
          />

          {/* Toggle Raw Source Payload */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4">
            <button
              onClick={() => setShowRawPayload(!showRawPayload)}
              className="w-full flex items-center justify-between text-xs font-semibold text-slate-700 hover:text-slate-900"
            >
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-indigo-600" />
                <span>Inspect Raw Envelope & Source Payload</span>
              </div>
              <span className="text-slate-400">{showRawPayload ? 'Hide' : 'Show'}</span>
            </button>

            {showRawPayload && (
              <pre className="mt-4 p-4 bg-slate-900 text-slate-200 rounded-lg text-[11px] font-mono overflow-x-auto max-h-96">
                {JSON.stringify(
                  {
                    source_type: conversation.source_type,
                    source_id: conversation.source_id,
                    applied_revision: conversation.applied_revision,
                    payload: conversation.payload,
                    transcript_payload: conversation.transcript_payload
                  },
                  null,
                  2
                )}
              </pre>
            )}
          </div>
        </div>

        {/* Right Column: Intelligence, Findings & Actions (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Routing Rationale Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Routing Rationale & Decisions
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
              {conversation.route_reasoning || 'No specific routing reasoning recorded.'}
            </p>
            {conversation.manual_route_override && (
              <div className="text-[11px] text-indigo-700 bg-indigo-50/70 p-2.5 rounded-lg border border-indigo-100">
                <span className="font-bold">Manager Override Active: </span>
                {conversation.review_notes || 'Manual override saved in database.'}
              </div>
            )}
          </div>

          {/* Key Findings Card */}
          {analysis && analysis.key_findings && analysis.key_findings.length > 0 && (
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                Evidence-Backed Findings
              </h3>

              <div className="space-y-3">
                {analysis.key_findings.map((f, i) => (
                  <div key={i} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/60 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900">{f.topic}</span>
                      <span className="text-[10px] font-mono text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded">
                        {f.evidence_ref}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">{f.finding}</p>

                    {f.exact_quote && (
                      <blockquote className="text-[11px] text-slate-600 italic bg-white p-2 rounded border-l-2 border-indigo-500">
                        "{f.exact_quote}"
                      </blockquote>
                    )}

                    {f.screen_rule_impact && (
                      <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-200/60">
                        <span className="font-semibold text-slate-700">Product Impact: </span>
                        {f.screen_rule_impact}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommended Next Actions */}
          {analysis && analysis.recommended_actions && analysis.recommended_actions.length > 0 && (
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <CheckSquare className="w-3.5 h-3.5 text-emerald-600" />
                Recommended Next Steps
              </h3>

              <div className="space-y-2">
                {analysis.recommended_actions.map((act, i) => (
                  <div key={i} className="p-3 rounded-lg border border-slate-100 bg-white shadow-2xs space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-semibold text-slate-900">{act.action}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        act.priority === 'High' ? 'bg-rose-50 text-rose-700' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {act.priority}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] text-slate-500">
                      <span>Owner: <strong className="text-slate-700 font-mono">{act.owner || 'Unassigned in text'}</strong></span>
                      {act.due_timeline && (
                        <span>• Timeline: <strong className="text-slate-700">{act.due_timeline}</strong></span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Explicit Limitations & Uncertainty */}
          {analysis && analysis.limitations_and_uncertainties && (
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-slate-400" />
                Evidence Boundaries & Uncertainty
              </h3>
              <ul className="list-disc list-inside space-y-1 text-xs text-slate-600 leading-relaxed">
                {analysis.limitations_and_uncertainties.map((u, i) => (
                  <li key={i}>{u}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Route Editor Modal */}
      <RouteEditorModal
        sourceType={conversation.source_type}
        sourceId={conversation.source_id}
        recordRef={conversation.record_ref}
        title={conversation.title}
        suggestedRoutes={conversation.suggested_routes}
        manualOverride={conversation.manual_route_override}
        currentNotes={conversation.review_notes}
        isOpen={isEditingRoute}
        onClose={() => setIsEditingRoute(false)}
        onSuccess={() => {
          setIsEditingRoute(false);
          loadDetail();
        }}
      />
    </div>
  );
};
