import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Search, Filter, Phone, Video, Calendar, Clock, CheckCircle,
  AlertCircle, Edit3, ArrowUpDown, RefreshCw, FileText
} from 'lucide-react';
import { fetchConversations, fetchFilterOptions } from '../services/api';
import { ConversationItem } from '../types';
import { RouteBadge } from '../components/RouteBadge';
import { StatusBadge } from '../components/StatusBadge';
import { RouteEditorModal } from '../components/RouteEditorModal';

export const InboxPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

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
    }, 300);
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
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Conversation Inbox
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-semibold bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100">
              {safeConversations.length} records
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Review inbound and outbound customer interactions, verify transcripts, and manage routing destinations.
          </p>
        </div>

        <button
          onClick={loadData}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg shadow-2xs self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh
        </button>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={loadData}
            className="px-2.5 py-1 text-xs font-semibold text-rose-700 bg-white border border-rose-200 rounded-md hover:bg-rose-100"
          >
            Retry
          </button>
        </div>
      )}

      {/* Filters Bar */}
      <div id="tour-inbox-filters" className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search */}
          <div className="relative lg:col-span-1">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search title, ref, rep..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 bg-slate-50/50"
            />
          </div>

          {/* Source Type Filter */}
          <div>
            <select
              value={sourceType}
              onChange={e => setSourceType(e.target.value)}
              className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-white font-medium text-slate-700 focus:outline-hidden"
            >
              <option value="all">All Types (Calls & Meetings)</option>
              <option value="call">Calls Only (30)</option>
              <option value="meeting">Meetings Only (14)</option>
            </select>
          </div>

          {/* Person Filter */}
          <div>
            <select
              value={person}
              onChange={e => setPerson(e.target.value)}
              className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-white font-medium text-slate-700 focus:outline-hidden"
            >
              <option value="all">All People</option>
              <optgroup label="Call Representatives">
                {filterOptions.persons
                  .filter(p => p.role === 'Call Representative')
                  .map(p => (
                    <option key={p.name} value={p.name}>{p.name} (Rep)</option>
                  ))}
              </optgroup>
              <optgroup label="Meeting Organizers">
                {filterOptions.persons
                  .filter(p => p.role === 'Meeting Organizer')
                  .map(p => (
                    <option key={p.name} value={p.name}>{p.name} (Organizer)</option>
                  ))}
              </optgroup>
            </select>
          </div>

          {/* Review Status Filter */}
          <div>
            <select
              value={reviewStatus}
              onChange={e => setReviewStatus(e.target.value)}
              className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-white font-medium text-slate-700 focus:outline-hidden"
            >
              <option value="all">All Review States</option>
              <option value="Reviewed">Reviewed</option>
              <option value="Awaiting Review">Awaiting Review</option>
              <option value="Under Review">Under Review</option>
              <option value="Missing Transcript">Missing Transcript</option>
              <option value="Unusable Text">Unusable Text</option>
            </select>
          </div>

          {/* Transcript Availability Filter */}
          <div>
            <select
              value={hasTranscript}
              onChange={e => setHasTranscript(e.target.value)}
              className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-white font-medium text-slate-700 focus:outline-hidden"
            >
              <option value="all">All Transcripts</option>
              <option value="yes">Usable Text Available</option>
              <option value="no">Missing / No Speech</option>
            </select>
          </div>
        </div>

        {/* Clear Filters Button */}
        {(sourceType !== 'all' || person !== 'all' || reviewStatus !== 'all' || hasTranscript !== 'all' || searchTerm) && (
          <div className="flex justify-end pt-1">
            <button
              onClick={() => {
                setSourceType('all');
                setPerson('all');
                setReviewStatus('all');
                setHasTranscript('all');
                setSearchTerm('');
              }}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
            >
              Clear all active filters
            </button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold text-[10px]">
              <tr>
                <th className="py-3 px-4 cursor-pointer hover:bg-slate-100/70" onClick={() => toggleSort('record_ref')}>
                  <div className="flex items-center gap-1">
                    <span>Ref / Type</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4">Title / Context</th>
                <th className="py-3 px-4">Participant & Role</th>
                <th className="py-3 px-4 cursor-pointer hover:bg-slate-100/70" onClick={() => toggleSort('started_at')}>
                  <div className="flex items-center gap-1">
                    <span>Date & Time</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4 text-center">Transcript</th>
                <th className="py-3 px-4">Assigned Routes</th>
                <th className="py-3 px-4">Review State</th>
                <th className="py-3 px-4 text-center">Revision</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                      <span>Loading records...</span>
                    </div>
                  </td>
                </tr>
              ) : safeConversations.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center gap-3">
                      <p className="text-sm font-medium text-slate-600">No conversations matched the filter criteria.</p>
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
                        className="px-3.5 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition-colors shadow-2xs cursor-pointer"
                      >
                        Reset All Filters & Load 44 Records
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                safeConversations.map(conv => (
                  <tr
                    key={`${conv.source_type}-${conv.source_id}`}
                    onClick={() => navigate(`/conversations/${conv.source_type}/${conv.source_id}`)}
                    className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                  >
                    {/* Ref & Type */}
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      <div className="flex items-center gap-2">
                        {conv.source_type === 'call' ? (
                          <div className="p-1 rounded-md bg-indigo-50 text-indigo-600" title="Phone Call">
                            <Phone className="w-3.5 h-3.5" />
                          </div>
                        ) : (
                          <div className="p-1 rounded-md bg-cyan-50 text-cyan-600" title="Meeting">
                            <Video className="w-3.5 h-3.5" />
                          </div>
                        )}
                        <span>{conv.record_ref}</span>
                      </div>
                    </td>

                    {/* Title */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="font-semibold text-slate-900 truncate" title={conv.title}>
                        {conv.title}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono truncate" title={conv.source_id}>
                        ID: {conv.source_id.slice(0, 16)}...
                      </div>
                    </td>

                    {/* Participant & Role */}
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-800">
                        {conv.person_name || 'Unassigned'}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {conv.person_role}
                      </div>
                    </td>

                    {/* Date & Time */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-600">
                      <div>21 Aug 2026</div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {conv.started_at ? conv.started_at.slice(11, 19) : '--:--:--'} UTC
                      </div>
                    </td>

                    {/* Transcript status */}
                    <td className="py-3.5 px-4 text-center">
                      {conv.has_usable_transcript ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle className="w-3 h-3" />
                          Usable
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-500 border border-slate-200">
                          Missing
                        </span>
                      )}
                    </td>

                    {/* Assigned Routes */}
                    <td className="py-3.5 px-4 max-w-sm">
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
                    <td className="py-3.5 px-4">
                      <StatusBadge status={conv.review_status} freshness={conv.analysis_freshness} />
                    </td>

                    {/* Revision */}
                    <td className="py-3.5 px-4 text-center font-mono">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        conv.applied_revision === 2 ? 'bg-indigo-100 text-indigo-800' : 'bg-slate-100 text-slate-600'
                      }`}>
                        v{conv.applied_revision}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingConv(conv);
                        }}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                        title="Edit Routes / Override"
                      >
                        <Edit3 className="w-4 h-4" />
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
