import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Edit3, ShieldAlert, Clock, Calendar, User,
  FileCode, CheckSquare, Sparkles, Hash
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
        <div className="w-5 h-5 border-2 border-[#D6ED17] border-t-transparent rounded-full animate-spin" />
        <span className="text-xs text-linear-dim font-mono mt-2">Loading conversation...</span>
      </div>
    );
  }

  if (error || !conversation) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/inbox')}
          className="inline-flex items-center gap-1.5 text-xs font-mono text-[#D6ED17] hover:underline mb-3 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Inbox
        </button>
        <div className="p-4 bg-linear-panel border border-linear-border rounded-lg text-linear-text text-xs">
          {error || 'Conversation record not found.'}
        </div>
      </div>
    );
  }

  const analysis = conversation.analysis;
  const turns = conversation.transcript_payload?.turns || [];

  return (
    <div className="p-4 sm:p-6 space-y-4 max-w-[1600px] mx-auto bg-linear-bg text-linear-text">
      {/* Linear Top Bar */}
      <div className="flex items-center justify-between border-b border-linear-border pb-3">
        <button
          onClick={() => navigate('/inbox')}
          className="inline-flex items-center gap-1.5 text-xs text-linear-muted hover:text-linear-text transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3 h-3" />
          <span>Inbox</span>
          <span className="text-linear-dim">/</span>
          <span className="font-mono text-linear-text font-semibold">{conversation.record_ref}</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Review Status Selector */}
          <div className="flex items-center gap-1.5 bg-linear-surface border border-linear-border rounded-md px-2.5 py-1 text-xs">
            <span className="text-linear-dim text-[11px] font-mono">Review:</span>
            <select
              value={conversation.review_status}
              disabled={isUpdatingStatus}
              onChange={e => handleStatusChange(e.target.value)}
              className="bg-transparent text-linear-text font-medium text-xs focus:outline-hidden cursor-pointer"
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
            className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold text-[#08090A] bg-[#D6ED17] hover:bg-[#cde410] rounded-md transition-all cursor-pointer shadow-xs"
          >
            <Edit3 className="w-3 h-3 text-[#08090A]" />
            <span>Override</span>
            <kbd className="kbd text-[9px] bg-black/10 border-black/20 text-[#08090A] ml-1">E</kbd>
          </button>
        </div>
      </div>

      {/* Header Record Card */}
      <div className="bg-linear-panel rounded-lg border border-linear-border p-4 space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
              <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-white/[0.06] text-linear-text">
                {conversation.record_ref}
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono uppercase bg-white/[0.04] text-linear-dim">
                {conversation.source_type}
              </span>
              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-white/[0.04] text-linear-dim">
                Rev {conversation.applied_revision}
              </span>
              <StatusBadge status={conversation.review_status} freshness={conversation.analysis_freshness} />
            </div>

            <h1 className="text-base sm:text-lg font-semibold text-linear-text tracking-tight font-heading">
              {conversation.title}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
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
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-linear-border text-xs font-mono">
          <div>
            <div className="text-linear-dim text-[10px] uppercase">Participant</div>
            <div className="text-linear-text flex items-center gap-1 mt-0.5 font-sans font-medium">
              <User className="w-3 h-3 text-linear-dim" />
              {conversation.person_name || 'Unassigned'}
            </div>
            <div className="text-[10px] text-linear-dim">{conversation.person_role}</div>
          </div>

          <div>
            <div className="text-linear-dim text-[10px] uppercase">Timestamp</div>
            <div className="text-linear-text flex items-center gap-1 mt-0.5">
              <Calendar className="w-3 h-3 text-linear-dim" />
              21 Aug 2026
            </div>
            <div className="text-[10px] text-linear-dim">
              {conversation.started_at ? conversation.started_at.slice(11, 19) : '--:--'} UTC
            </div>
          </div>

          <div>
            <div className="text-linear-dim text-[10px] uppercase">Duration & Status</div>
            <div className="text-linear-text flex items-center gap-1 mt-0.5">
              <Clock className="w-3 h-3 text-linear-dim" />
              {conversation.duration_seconds ? `${conversation.duration_seconds}s` : 'N/A'}
            </div>
            <div className="text-[10px] text-linear-dim">
              {conversation.payload.recording_status || (conversation.is_connected ? 'Connected' : 'Not connected')}
            </div>
          </div>

          <div>
            <div className="text-linear-dim text-[10px] uppercase">Source ID</div>
            <div className="text-[#D6ED17] truncate mt-0.5 text-[11px]" title={conversation.source_id}>
              {conversation.source_id}
            </div>
            <div className="text-[10px] text-linear-dim">Batch: {conversation.batch_id}</div>
          </div>
        </div>
      </div>

      {/* Stale Warning Banner if applicable */}
      {conversation.analysis_freshness === 'stale_pending_review' && (
        <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-md flex items-start gap-2.5 text-xs text-amber-200">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-amber-300">Analysis Stale / Pending Review: </span>
            A newer source revision ({conversation.applied_revision}) arrived with updated transcript content. Previous manual override is preserved, but you should verify newly supplied turns.
          </div>
        </div>
      )}

      {/* Two-Column Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Transcript & Turns (7 Cols) */}
        <div className="lg:col-span-7 space-y-3">
          <EvidenceViewer
            sourceType={conversation.source_type}
            callTranscript={conversation.call_transcript}
            turns={turns}
            unavailableReason={conversation.transcript_payload?.unavailable_reason}
            highlightTurn={highlightTurn}
          />

          {/* Toggle Raw Source Payload */}
          <div className="bg-linear-panel rounded-lg border border-linear-border p-3">
            <button
              onClick={() => setShowRawPayload(!showRawPayload)}
              className="w-full flex items-center justify-between text-xs text-linear-muted hover:text-linear-text cursor-pointer"
            >
              <div className="flex items-center gap-1.5">
                <FileCode className="w-3.5 h-3.5 text-[#D6ED17]" />
                <span className="font-mono text-[11px]">raw_envelope_payload.json</span>
              </div>
              <span className="text-[10px] font-mono text-linear-dim">{showRawPayload ? 'collapse' : 'expand'}</span>
            </button>

            {showRawPayload && (
              <pre className="mt-2.5 p-3 bg-linear-bg text-linear-muted border border-linear-border rounded text-[10px] font-mono overflow-x-auto max-h-80">
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

        {/* Right: Rationale, Findings & Actions (5 Cols) */}
        <div className="lg:col-span-5 space-y-3">
          {/* Routing Rationale Card */}
          <div className="bg-linear-panel p-4 rounded-lg border border-linear-border space-y-2">
            <div className="text-[10px] font-mono uppercase tracking-wider text-linear-dim">
              Routing Rationale
            </div>
            <p className="text-xs text-linear-text leading-relaxed bg-linear-surface p-2.5 rounded border border-linear-border">
              {conversation.route_reasoning || 'No specific routing reasoning recorded.'}
            </p>
            {conversation.manual_route_override && (
              <div className="text-[11px] text-[#D6ED17] bg-[#D6ED17]/10 p-2 rounded border border-[#D6ED17]/25 font-mono">
                <strong>OVERRIDE: </strong> {conversation.review_notes || 'Manual override recorded.'}
              </div>
            )}
          </div>

          {/* Key Findings Card */}
          {analysis && analysis.key_findings && analysis.key_findings.length > 0 && (
            <div className="bg-linear-panel p-4 rounded-lg border border-linear-border space-y-3">
              <div className="flex items-center justify-between border-b border-linear-border pb-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-linear-dim">
                  Evidence-Backed Findings
                </span>
                <span className="text-[10px] font-mono text-linear-dim">{analysis.key_findings.length} points</span>
              </div>

              <div className="space-y-2">
                {analysis.key_findings.map((f, i) => (
                  <div key={i} className="p-2.5 rounded bg-linear-surface border border-linear-border space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-xs text-linear-text">{f.topic}</span>
                      <span className="text-[9px] font-mono text-[#D6ED17] bg-[#D6ED17]/10 px-1.5 py-0.2 rounded border border-[#D6ED17]/20">
                        {f.evidence_ref}
                      </span>
                    </div>
                    <p className="text-xs text-linear-muted leading-relaxed">{f.finding}</p>

                    {f.exact_quote && (
                      <blockquote className="text-[11px] text-linear-text italic bg-linear-bg p-2 rounded border-l-2 border-[#D6ED17] font-mono leading-relaxed">
                        "{f.exact_quote}"
                      </blockquote>
                    )}

                    {f.screen_rule_impact && (
                      <div className="text-[10px] text-linear-dim pt-1 border-t border-linear-border/60">
                        <span className="text-linear-muted">Impact: </span>
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
            <div className="bg-linear-panel p-4 rounded-lg border border-linear-border space-y-2">
              <div className="text-[10px] font-mono uppercase tracking-wider text-linear-dim">
                Recommended Actions
              </div>

              <div className="space-y-1.5">
                {analysis.recommended_actions.map((act, i) => (
                  <div key={i} className="p-2.5 rounded bg-linear-surface border border-linear-border space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-medium text-linear-text">{act.action}</span>
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-white/[0.04] text-linear-muted">
                        {act.priority}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] text-linear-dim font-mono">
                      <span>Owner: <strong className="text-[#D6ED17]">{act.owner || 'Unassigned'}</strong></span>
                      {act.due_timeline && (
                        <span>• {act.due_timeline}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Boundaries & Uncertainty */}
          {analysis && analysis.limitations_and_uncertainties && (
            <div className="bg-linear-panel p-4 rounded-lg border border-linear-border space-y-1.5 text-xs">
              <div className="text-[10px] font-mono uppercase tracking-wider text-linear-dim">
                Evidence Boundaries
              </div>
              <ul className="list-disc list-inside space-y-1 text-linear-dim leading-relaxed text-[11px]">
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
