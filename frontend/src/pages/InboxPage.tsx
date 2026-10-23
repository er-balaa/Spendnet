import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Search, Phone, Video, Edit3, ArrowUpDown, RefreshCw, AlertCircle, CheckCircle,
  Filter, X
} from 'lucide-react';
import { fetchConversations, fetchFilterOptions } from '../services/api';
import { ConversationItem } from '../types';
import { RouteBadge } from '../components/RouteBadge';
import { StatusBadge } from '../components/StatusBadge';
import { RouteEditorModal } from '../components/RouteEditorModal';

export const InboxPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters from URL or state
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [sourceType, setSourceType] = useState(searchParams.get('source_type') || 'all');
  const [person, setPerson] = useState(searchParams.get('person') || 'all');
  const [reviewStatus, setReviewStatus] = useState(searchParams.get('review_status') || 'all');
  const [hasTranscript, setHasTranscript] = useState<string>(searchParams.get('has_transcript') || 'all');
  const [sortBy, setSortBy] = useState('record_ref');
  const [order, setOrder] = useState('asc');

  // Filter options
  const [filterOptions, setFilterOptions] = useState<{
    source_types: string[];
    persons: Array<{ name: string; role: string }>;
    review_statuses: string[];
  }>({ source_types: [], persons: [], review_statuses: [] });

  // Route editor modal state
  const [editingConv, setEditingConv] = useState<ConversationItem | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const convs = await fetchConversations({
        source_type: sourceType !== 'all' ? sourceType : undefined,
        person: person !== 'all' ? person : undefined,
        review_status: reviewStatus !== 'all' ? reviewStatus : undefined,
        has_transcript: hasTranscript === 'yes' ? true : hasTranscript === 'no' ? false : undefined,
        search: searchTerm || undefined,
        sort_by: sortBy,
        order: order
      });
      setConversations(convs);

      const filtersData = await fetchFilterOptions();
      setFilterOptions(filtersData);
    } catch (err: any) {
      setError(err.message || 'Failed to load conversations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [sourceType, person, reviewStatus, hasTranscript, sortBy, order]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      loadData();
    }, 250);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const toggleSort = (field: string) => {
    if (sortBy === field) {
      setOrder(order === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setOrder('asc');
    }
  };

  const safeConversations = Array.isArray(conversations) ? conversations : [];

  return (
    <div className="p-4 sm:p-6 space-y-4 max-w-[1600px] mx-auto bg-linear-bg text-linear-text">
      {/* Linear Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-linear-border pb-3">
        <div className="flex items-center gap-2.5">
          <h1 className="text-base font-semibold tracking-tight text-linear-text font-heading">
            Inbox
          </h1>
          <span className="px-2 py-0.5 text-[11px] font-mono text-[#D6ED17] bg-[#D6ED17]/10 border border-[#D6ED17]/30 rounded">
            {safeConversations.length} items
          </span>
          <span className="text-[11px] text-linear-dim hidden md:inline">
            • 44 verified source records (Asia/Kolkata)
          </span>
        </div>

        {/* Action Bar */}
        <div className="flex items-center gap-2">
          <button
            onClick={loadData}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-linear-muted hover:text-linear-text bg-linear-surface hover:bg-linear-hover border border-linear-border rounded-md transition-colors cursor-pointer"
            title="Refresh records (R)"
          >
            <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin text-[#D6ED17]' : ''}`} />
            <span>Sync</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-md text-rose-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={loadData}
            className="px-2.5 py-0.5 text-xs text-rose-300 bg-white/[0.06] border border-rose-500/40 rounded hover:bg-white/[0.1] cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* Linear Filter Toolbar */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[220px] max-w-md">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-linear-dim" />
          <input
            type="text"
            placeholder="Filter records by title, ref, person..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full text-xs pl-8 pr-12 py-1.5 rounded-md border border-linear-border bg-linear-surface text-linear-text placeholder:text-linear-dim focus:outline-hidden focus:border-[#D6ED17]/80 transition-colors"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            <kbd className="kbd">/</kbd>
          </div>
        </div>

        {/* Source Type Filter */}
        <select
          value={sourceType}
          onChange={e => setSourceType(e.target.value)}
          className="text-xs px-2.5 py-1.5 rounded-md border border-linear-border bg-linear-surface text-linear-text font-medium focus:outline-hidden cursor-pointer"
        >
          <option value="all">All Types</option>
          <option value="call">Calls (30)</option>
          <option value="meeting">Meetings (14)</option>
        </select>

        {/* Person Filter */}
        <select
          value={person}
          onChange={e => setPerson(e.target.value)}
          className="text-xs px-2.5 py-1.5 rounded-md border border-linear-border bg-linear-surface text-linear-text font-medium focus:outline-hidden cursor-pointer max-w-[160px]"
        >
          <option value="all">All People</option>
          <optgroup label="Call Representatives">
            {filterOptions.persons
              .filter(p => p.role === 'Call Representative')
              .map(p => (
                <option key={p.name} value={p.name}>{p.name}</option>
              ))}
          </optgroup>
          <optgroup label="Meeting Organizers">
            {filterOptions.persons
              .filter(p => p.role === 'Meeting Organizer')
              .map(p => (
                <option key={p.name} value={p.name}>{p.name}</option>
              ))}
          </optgroup>
        </select>

        {/* Review Status Filter */}
        <select
          value={reviewStatus}
          onChange={e => setReviewStatus(e.target.value)}
          className="text-xs px-2.5 py-1.5 rounded-md border border-linear-border bg-linear-surface text-linear-text font-medium focus:outline-hidden cursor-pointer"
        >
          <option value="all">All Review States</option>
          <option value="Reviewed">Reviewed</option>
          <option value="Awaiting Review">Awaiting Review</option>
          <option value="Under Review">Under Review</option>
          <option value="Missing Transcript">Missing Transcript</option>
          <option value="Unusable Text">Unusable Text</option>
        </select>

        {/* Transcript Filter */}
        <select
          value={hasTranscript}
          onChange={e => setHasTranscript(e.target.value)}
          className="text-xs px-2.5 py-1.5 rounded-md border border-linear-border bg-linear-surface text-linear-text font-medium focus:outline-hidden cursor-pointer"
        >
          <option value="all">All Transcripts</option>
          <option value="yes">Usable Text</option>
          <option value="no">Missing / Silent</option>
        </select>

        {/* Clear Filters */}
        {(sourceType !== 'all' || person !== 'all' || reviewStatus !== 'all' || hasTranscript !== 'all' || searchTerm) && (
          <button
            onClick={() => {
              setSourceType('all');
              setPerson('all');
              setReviewStatus('all');
              setHasTranscript('all');
              setSearchTerm('');
            }}
            className="inline-flex items-center gap-1 text-[11px] text-[#D6ED17] hover:underline px-1.5 py-1 transition-colors cursor-pointer"
          >
            <X className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Linear Ultra-Dense Table */}
      <div className="bg-linear-panel rounded-lg border border-linear-border overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-linear-surface border-b border-linear-border text-linear-dim uppercase font-mono font-semibold text-[10px] tracking-wider select-none">
              <tr>
                <th className="py-2.5 px-3 cursor-pointer hover:text-linear-text w-28" onClick={() => toggleSort('record_ref')}>
                  <div className="flex items-center gap-1">
                    <span>ID / Type</span>
                    <ArrowUpDown className="w-2.5 h-2.5" />
                  </div>
                </th>
                <th className="py-2.5 px-3">Title / Counterparty</th>
                <th className="py-2.5 px-3 w-40">Participant</th>
                <th className="py-2.5 px-3 cursor-pointer hover:text-linear-text w-32" onClick={() => toggleSort('started_at')}>
                  <div className="flex items-center gap-1">
                    <span>Timestamp</span>
                    <ArrowUpDown className="w-2.5 h-2.5" />
                  </div>
                </th>
                <th className="py-2.5 px-3 text-center w-24">Text</th>
                <th className="py-2.5 px-3">Assigned Routes</th>
                <th className="py-2.5 px-3 w-36">Status</th>
                <th className="py-2.5 px-3 text-center w-16">Rev</th>
                <th className="py-2.5 px-3 text-right w-12"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-linear-border/60">
              {loading ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-linear-dim font-mono">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-4 h-4 border-2 border-[#D6ED17] border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs">Fetching records...</span>
                    </div>
                  </td>
                </tr>
              ) : safeConversations.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-linear-dim font-mono">
                    <div className="flex flex-col items-center gap-2">
                      <p className="text-xs">No records matching active filter query.</p>
                      <button
                        type="button"
                        onClick={() => {
                          setSearchTerm('');
                          setSourceType('all');
                          setPerson('all');
                          setReviewStatus('all');
                          setHasTranscript('all');
                          setSortBy('record_ref');
                          setOrder('asc');
                          loadData();
                        }}
                        className="px-2.5 py-1 text-xs text-linear-text bg-linear-surface border border-linear-border rounded hover:bg-linear-hover transition-colors"
                      >
                        Reset filters
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                safeConversations.map(conv => (
                  <tr
                    key={`${conv.source_type}-${conv.source_id}`}
                    onClick={() => navigate(`/conversations/${conv.source_type}/${conv.source_id}`)}
                    className="hover:bg-linear-hover cursor-pointer transition-colors group"
                  >
                    {/* Ref & Type */}
                    <td className="py-2 px-3 font-mono text-linear-text whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        {conv.source_type === 'call' ? (
                          <span title="Phone Call"><Phone className="w-3 h-3 text-blue-400 shrink-0" /></span>
                        ) : (
                          <span title="Meeting"><Video className="w-3 h-3 text-emerald-400 shrink-0" /></span>
                        )}
                        <span className="font-semibold text-xs">{conv.record_ref}</span>
                      </div>
                    </td>

                    {/* Title */}
                    <td className="py-2 px-3 max-w-sm">
                      <div className="font-medium text-linear-text truncate leading-tight" title={conv.title}>
                        {conv.title}
                      </div>
                      <div className="text-[10px] text-linear-dim font-mono truncate" title={conv.source_id}>
                        {conv.source_id.slice(0, 20)}...
                      </div>
                    </td>

                    {/* Participant & Role */}
                    <td className="py-2 px-3 whitespace-nowrap">
                      <div className="text-linear-text font-medium text-xs">
                        {conv.person_name || 'Unassigned'}
                      </div>
                      <div className="text-[10px] text-linear-dim font-mono">
                        {conv.person_role}
                      </div>
                    </td>

                    {/* Timestamp */}
                    <td className="py-2 px-3 whitespace-nowrap font-mono text-[11px] text-linear-muted">
                      <div>21 Aug</div>
                      <div className="text-[10px] text-linear-dim">
                        {conv.started_at ? conv.started_at.slice(11, 19) : '--:--:--'} UTC
                      </div>
                    </td>

                    {/* Transcript status */}
                    <td className="py-2 px-3 text-center whitespace-nowrap">
                      {conv.has_usable_transcript ? (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <CheckCircle className="w-2.5 h-2.5" />
                          yes
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-mono text-linear-dim bg-white/[0.03]">
                          no
                        </span>
                      )}
                    </td>

                    {/* Assigned Routes */}
                    <td className="py-2 px-3">
                      <div className="flex flex-wrap gap-1">
                        {conv.assigned_routes.map(r => (
                          <RouteBadge
                            key={r}
                            route={r}
                            isOverride={conv.manual_route_override?.includes(r)}
                          />
                        ))}
                      </div>
                    </td>

                    {/* Review State */}
                    <td className="py-2 px-3 whitespace-nowrap">
                      <StatusBadge status={conv.review_status} freshness={conv.analysis_freshness} />
                    </td>

                    {/* Revision */}
                    <td className="py-2 px-3 text-center font-mono">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        conv.applied_revision === 2
                          ? 'bg-[#D6ED17] text-[#08090A]'
                          : 'bg-white/[0.05] text-linear-dim'
                      }`}>
                        v{conv.applied_revision}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-2 px-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingConv(conv);
                        }}
                        className="p-1 text-linear-dim hover:text-[#D6ED17] hover:bg-white/[0.08] rounded transition-colors cursor-pointer"
                        title="Override routes (E)"
                      >
                        <Edit3 className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Route Editor Modal */}
      {editingConv && (
        <RouteEditorModal
          sourceType={editingConv.source_type}
          sourceId={editingConv.source_id}
          recordRef={editingConv.record_ref}
          title={editingConv.title}
          suggestedRoutes={editingConv.suggested_routes}
          manualOverride={editingConv.manual_route_override}
          isOpen={true}
          onClose={() => setEditingConv(null)}
          onSuccess={() => {
            setEditingConv(null);
            loadData();
          }}
        />
      )}
    </div>
  );
};
