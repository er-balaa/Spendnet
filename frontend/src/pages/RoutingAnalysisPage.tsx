import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight, BookOpen, Edit3
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
}> = [
  {
    name: 'Sales Coaching',
    description: 'Conversations requiring rep enablement, script adjustments, objection handling, or attribution audits.',
    criteria: 'Cold call resistance, rep identity discrepancies (C06), fee structure misunderstandings (M03), boundary violations (C09, C10).'
  },
  {
    name: 'Deal Next Steps',
    description: 'Active commercial opportunities requiring proposals, partner terms, or stakeholder demo scheduling.',
    criteria: 'Qualified interest in cards/wallets, custom API developer pricing (C03), partner commission structures (M01, C07), warm referrals (C08).'
  },
  {
    name: 'Customer Follow-up',
    description: 'Post-interaction customer tasks, collateral deliveries, bug status communications, and account onboarding.',
    criteria: 'Collateral requests (C05, C10), partner guidance documentation (M01), bug workarounds (M07), admin login fixes (M09).'
  },
  {
    name: 'Internal / Vendor Note',
    description: 'Software bugs, technical roadmap dependencies, vendor integrations, and internal billing SOPs.',
    criteria: 'Vendor evaluation for e-invoicing (M02), UI form/modal bugs (M07), auth token bugs (M09), internal billing training (M10).'
  },
  {
    name: 'Human Review',
    description: 'Ambiguous calls, missing text requiring intake judgment, severe customer churn risks, or stale analysis needing human confirmation.',
    criteria: 'Records with no usable transcript, impending card network termination (M04), stale analysis after source updates.'
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
    <div className="p-4 sm:p-6 space-y-4 max-w-[1600px] mx-auto bg-linear-bg text-linear-text">
      {/* Linear Header */}
      <div className="border-b border-linear-border pb-3 flex items-center justify-between">
        <div>
          <h1 className="text-base font-semibold tracking-tight text-linear-text font-heading">
            Routing Matrix & Taxonomy
          </h1>
          <p className="text-[11px] text-linear-dim font-mono mt-0.5">
            Deterministic destination routing grounded in transcript evidence • Multi-route enabled
          </p>
        </div>
      </div>

      {/* Segmented Category Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
        {CATEGORIES.map(cat => {
          const count = conversations.filter(c => c.assigned_routes.includes(cat.name)).length;
          const isActive = activeCategory === cat.name;
          return (
            <button
              key={cat.name}
              onClick={() => setActiveCategory(cat.name)}
              className={`p-3 rounded-md border text-left transition-all cursor-pointer ${
                isActive
                  ? 'bg-linear-surface border-[#D6ED17] text-linear-text shadow-xs'
                  : 'bg-linear-panel border-linear-border hover:bg-linear-surface text-linear-muted'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-xs font-semibold ${isActive ? 'text-[#D6ED17]' : 'text-linear-text'}`}>
                  {cat.name}
                </span>
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                  isActive ? 'bg-[#D6ED17] text-[#08090A] font-bold' : 'bg-white/[0.04] text-linear-dim'
                }`}>
                  {count}
                </span>
              </div>
              <p className="text-[10px] line-clamp-2 leading-tight text-linear-dim">
                {cat.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* Category Deep Dive Panel */}
      <div className="p-4 rounded-md border border-linear-border bg-linear-panel">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          <div className="space-y-1 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-[#D6ED17]">
              <span>Active Destination</span>
            </div>
            <h2 className="text-sm font-semibold text-linear-text">
              {currentCategoryInfo.name} ({filteredConversations.length} records)
            </h2>
            <p className="text-xs text-linear-muted leading-relaxed">
              {currentCategoryInfo.description}
            </p>
          </div>
          <div className="lg:text-right max-w-md pt-2 lg:pt-0 border-t lg:border-t-0 border-linear-border">
            <span className="text-[10px] font-mono uppercase tracking-wider text-linear-dim">
              Criteria
            </span>
            <p className="text-xs text-linear-text mt-0.5 leading-relaxed">
              {currentCategoryInfo.criteria}
            </p>
          </div>
        </div>
      </div>

      {/* Conversations in this Category */}
      <div className="bg-linear-panel rounded-md border border-linear-border overflow-hidden">
        <div className="px-3.5 py-2.5 bg-linear-surface border-b border-linear-border flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-linear-text font-mono">
            {activeCategory} ({filteredConversations.length} records)
          </h3>
        </div>

        <div className="divide-y divide-linear-border/60">
          {loading ? (
            <div className="p-12 text-center text-xs text-linear-dim font-mono">
              Loading records...
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="p-12 text-center text-xs text-linear-dim font-mono">
              No conversations currently assigned to {activeCategory}.
            </div>
          ) : (
            filteredConversations.map(conv => (
              <div
                key={`${conv.source_type}-${conv.source_id}`}
                onClick={() => navigate(`/conversations/${conv.source_type}/${conv.source_id}`)}
                className="p-3 hover:bg-linear-hover cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="font-mono text-xs font-semibold text-linear-text bg-white/[0.05] px-1.5 py-0.5 rounded">
                      {conv.record_ref}
                    </span>
                    <span className="font-medium text-xs text-linear-text">
                      {conv.title}
                    </span>
                    <StatusBadge status={conv.review_status} freshness={conv.analysis_freshness} />
                  </div>
                  <div className="text-[11px] text-linear-dim flex items-center gap-2 font-mono">
                    <span>{conv.person_name || 'Unassigned'} ({conv.person_role})</span>
                    <span>•</span>
                    <span>Rev v{conv.applied_revision}</span>
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
                    className="p-1 text-linear-dim hover:text-[#D6ED17] hover:bg-white/[0.08] rounded transition-colors cursor-pointer"
                    title="Change Route Override"
                  >
                    <Edit3 className="w-3 h-3" />
                  </button>

                  <ArrowRight className="w-3.5 h-3.5 text-linear-dim" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Case Study Callout */}
      <div className="p-3.5 bg-linear-panel rounded-md border border-linear-border space-y-1.5 text-xs">
        <div className="flex items-center gap-1.5 font-semibold text-linear-text font-mono text-[11px]">
          <BookOpen className="w-3 h-3 text-[#D6ED17]" />
          <span>Case Study: Multi-Route Edge Decision (M04 — Cedarwave)</span>
        </div>
        <p className="text-linear-muted leading-relaxed text-[11px]">
          Customer has INR 1.3 crore bank line, physical cards shutting down, and tooling bug preventing department updates. Assigned to Customer Follow-up, Internal / Vendor Note, and Human Review rather than a single reductive bucket.
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
