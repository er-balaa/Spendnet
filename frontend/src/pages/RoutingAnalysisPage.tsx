import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Workflow, ArrowRight, ShieldCheck, HelpCircle, Layers, CheckCircle2,
  AlertTriangle, Users, BookOpen, Edit3
} from 'lucide-react';
import { fetchConversations } from '../services/api';
import { ConversationItem, RouteCategory } from '../types';
import { RouteBadge } from '../components/RouteBadge';
import { StatusBadge } from '../components/StatusBadge';
import { RouteEditorModal } from '../components/RouteEditorModal';

const CATEGORIES: Array<{
  name: RouteCategory;
  description: string;
  criteria: string;
  color: string;
}> = [
  {
    name: 'Sales Coaching',
    description: 'Conversations requiring rep enablement, script adjustments, objection handling, or attribution audits.',
    criteria: 'Cold call resistance, rep identity discrepancies (C06), fee structure misunderstandings (M03), boundary violations (C09, C10).',
    color: 'border-purple-500 bg-purple-50/40 text-purple-900'
  },
  {
    name: 'Deal Next Steps',
    description: 'Active commercial opportunities requiring proposals, partner terms, or stakeholder demo scheduling.',
    criteria: 'Qualified interest in cards/wallets, custom API developer pricing (C03), partner commission structures (M01, C07), warm referrals (C08).',
    color: 'border-emerald-500 bg-emerald-50/40 text-emerald-900'
  },
  {
    name: 'Customer Follow-up',
    description: 'Post-interaction customer tasks, collateral deliveries, bug status communications, and account onboarding.',
    criteria: 'Collateral requests (C05, C10), partner guidance documentation (M01), bug workarounds (M07), admin login fixes (M09).',
    color: 'border-blue-500 bg-blue-50/40 text-blue-900'
  },
  {
    name: 'Internal / Vendor Note',
    description: 'Software bugs, technical roadmap dependencies, vendor integrations, and internal billing SOPs.',
    criteria: 'Vendor evaluation for e-invoicing (M02), UI form/modal bugs (M07), auth token bugs (M09), internal billing training (M10).',
    color: 'border-amber-500 bg-amber-50/40 text-amber-900'
  },
  {
    name: 'Human Review',
    description: 'Ambiguous calls, missing text requiring intake judgment, severe customer churn risks, or stale analysis needing human confirmation.',
    criteria: 'Records with no usable transcript, impending card network termination (M04), stale analysis after source updates.',
    color: 'border-rose-500 bg-rose-50/40 text-rose-900'
  }
];

export const RoutingAnalysisPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<RouteCategory>('Sales Coaching');
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingConv, setEditingConv] = useState<ConversationItem | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchConversations();
      setConversations(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredConversations = (conversations || []).filter(c =>
    c.assigned_routes && c.assigned_routes.includes(activeCategory)
  );

  const currentCategoryInfo = CATEGORIES.find(c => c.name === activeCategory)!;

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Routing & Operational Taxonomy
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Differentiated conversation destinations based on verified transcript evidence. Multi-route assignment enabled with full manager override capability.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {CATEGORIES.map(cat => {
          const count = conversations.filter(c => c.assigned_routes.includes(cat.name)).length;
          const isActive = activeCategory === cat.name;
          return (
            <button
              key={cat.name}
              onClick={() => setActiveCategory(cat.name)}
              className={`p-4 rounded-xl border text-left transition-all ${
                isActive
                  ? `border-l-4 ${cat.color} shadow-sm ring-2 ring-indigo-500/20`
                  : 'bg-white border-slate-200 hover:bg-slate-50/80 text-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold">{cat.name}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isActive ? 'bg-white shadow-2xs' : 'bg-slate-100 text-slate-600'
                }`}>
                  {count}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 line-clamp-2">
                {cat.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* Category Deep Dive Card */}
      <div className={`p-6 rounded-2xl border-l-4 border bg-white shadow-xs ${currentCategoryInfo.color}`}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Active Category Overview
            </div>
            <h2 className="text-lg font-bold text-slate-900 mt-0.5">
              {currentCategoryInfo.name} ({filteredConversations.length} records assigned)
            </h2>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              {currentCategoryInfo.description}
            </p>
          </div>
          <div className="hidden sm:block text-right">
            <span className="text-[11px] font-semibold text-slate-500">Assignment Criteria:</span>
            <p className="text-xs text-slate-700 max-w-sm mt-0.5">{currentCategoryInfo.criteria}</p>
          </div>
        </div>
      </div>

      {/* Conversations in this Category */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">
            Conversations Routed to {activeCategory}
          </h3>
          <span className="text-xs text-slate-500">
            {filteredConversations.length} records matching destination
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {loading ? (
            <div className="p-8 text-center text-xs text-slate-400">Loading records...</div>
          ) : filteredConversations.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No conversations currently assigned to {activeCategory}.
            </div>
          ) : (
            filteredConversations.map(conv => (
              <div
                key={`${conv.source_type}-${conv.source_id}`}
                onClick={() => navigate(`/conversations/${conv.source_type}/${conv.source_id}`)}
                className="p-4 hover:bg-slate-50/80 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                      {conv.record_ref}
                    </span>
                    <span className="font-semibold text-xs text-slate-900">
                      {conv.title}
                    </span>
                    <StatusBadge status={conv.review_status} freshness={conv.analysis_freshness} />
                  </div>
                  <div className="text-xs text-slate-500 flex items-center gap-3">
                    <span>Participant: <strong>{conv.person_name || 'Unassigned'}</strong> ({conv.person_role})</span>
                    <span>•</span>
                    <span>Revision: <strong>v{conv.applied_revision}</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div className="flex flex-wrap gap-1">
                    {conv.assigned_routes.map(r => (
                      <RouteBadge
                        key={r}
                        route={r}
                        isOverride={conv.manual_route_override?.includes(r)}
                      />
                    ))}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingConv(conv);
                    }}
                    className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md"
                    title="Change Route Override"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  <ArrowRight className="w-4 h-4 text-slate-300" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Difficult Routing Decision Highlight Box */}
      <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
          <BookOpen className="w-4 h-4 text-indigo-600" />
          <span>Case Study: Difficult Routing Decision (Cedarwave Distribution — M04)</span>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          <strong>The Dilemma:</strong> In meeting M04, the customer’s existing physical card programme is shutting down due to network failures (Customer Follow-up). However, the customer has an existing INR 1.3 crore bank credit line and firmly resists another prepaid card, demanding a third-party bank-card transaction feed (Deal Next Steps vs Internal Note). Simultaneously, a support tooling bug prevented the rep from reassigning departments (Internal Note).
        </p>
        <p className="text-xs text-slate-600 leading-relaxed">
          <strong>Resolution:</strong> Rather than forcing M04 into a single reductive box, our multi-route engine assigns it to <em>Customer Follow-up</em> (account migration retention), <em>Internal / Vendor Note</em> (bank feed and department tooling gap), and <em>Human Review</em> (account churn risk).
        </p>
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
