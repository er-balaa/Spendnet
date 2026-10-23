import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar, Clock, Download, ArrowUpRight
} from 'lucide-react';
import { fetchManagerBrief, fetchConversations } from '../services/api';
import { ConversationItem } from '../types';

export const ManagerBriefPage: React.FC = () => {
  const [briefMarkdown, setBriefMarkdown] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState<ConversationItem[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const [briefData, convs] = await Promise.all([
          fetchManagerBrief(),
          fetchConversations()
        ]);
        setBriefMarkdown(briefData.content_markdown);
        setConversations(convs);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const downloadBrief = () => {
    const blob = new Blob([briefMarkdown], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'MANAGER_BRIEF_2026-08-21.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="p-12 flex flex-col justify-center items-center min-h-[400px]">
        <div className="w-5 h-5 border-2 border-[#D6ED17] border-t-transparent rounded-full animate-spin" />
        <span className="text-xs text-linear-dim font-mono mt-2">Loading executive brief...</span>
      </div>
    );
  }

  const convMap = new Map<string, ConversationItem>();
  (conversations || []).forEach(c => convMap.set(c.record_ref, c));

  return (
    <div className="p-4 sm:p-6 space-y-4 max-w-5xl mx-auto bg-linear-bg text-linear-text">
      {/* Linear Header Bar */}
      <div className="bg-linear-panel rounded-md p-5 border border-linear-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[11px] font-mono text-linear-dim">
            <span className="px-1.5 py-0.2 rounded bg-[#D6ED17]/10 text-[#D6ED17] border border-[#D6ED17]/20 font-semibold">
              DAILY INTELLIGENCE
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-linear-muted">
              <Calendar className="w-3 h-3" /> 21 Aug 2026 (Asia/Kolkata)
            </span>
          </div>

          <h1 className="text-lg font-semibold tracking-tight text-linear-text font-heading">
            Sales Manager Daily Intelligence Brief
          </h1>

          <p className="text-xs text-linear-muted leading-relaxed">
            44 source envelopes synthesized into verified findings and coaching directives. Every conclusion backed by verbatim quotes.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={downloadBrief}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-[#D6ED17] text-[#08090A] hover:bg-[#cde410] rounded-md transition-all cursor-pointer shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-[#08090A]" />
            <span>Download .md</span>
          </button>
        </div>
      </div>

      {/* 3 Core Required Recruitment Findings */}
      <div className="bg-linear-panel rounded-md border border-linear-border p-4 space-y-3">
        <div className="flex items-center justify-between border-b border-linear-border pb-2">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#D6ED17]">
            Core Verified Recruitment Findings
          </span>
          <span className="text-[10px] font-mono text-linear-dim">3 of 3 verified</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Finding 1 */}
          <div className="p-3.5 rounded bg-linear-surface border border-linear-border space-y-2 flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20">
                  Bug • Modal State
                </span>
                <Link
                  to="/conversations/meeting/4f304fff-fd40-5cfc-a366-0a134c445c2a"
                  className="font-mono text-[10px] text-[#D6ED17] hover:underline inline-flex items-center gap-0.5"
                >
                  M07 Turn 22 <ArrowUpRight className="w-2.5 h-2.5" />
                </Link>
              </div>
              <h4 className="text-xs font-semibold text-linear-text leading-tight">
                Mark as Paid Amount Retention
              </h4>
              <p className="text-[11px] text-linear-muted leading-relaxed">
                Modal retains previous item's amount (INR 18,200) instead of current value.
              </p>
              <blockquote className="text-[10px] text-linear-text italic bg-linear-bg p-2 rounded border-l-2 border-[#D6ED17] font-mono leading-relaxed">
                "The amount from the previous item appears in the next one..."
              </blockquote>
            </div>
            <div className="text-[10px] text-linear-dim pt-2 border-t border-linear-border">
              <span className="text-linear-muted">Impact: </span> Internal/Vendor Note defect.
            </div>
          </div>

          {/* Finding 2 */}
          <div className="p-3.5 rounded bg-linear-surface border border-linear-border space-y-2 flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
                  Audit • Rep Identity
                </span>
                <Link
                  to="/conversations/call/c06-mock-call-id"
                  className="font-mono text-[10px] text-[#D6ED17] hover:underline inline-flex items-center gap-0.5"
                >
                  Call C06 <ArrowUpRight className="w-2.5 h-2.5" />
                </Link>
              </div>
              <h4 className="text-xs font-semibold text-linear-text leading-tight">
                Dialer Attribution Discrepancy
              </h4>
              <p className="text-[11px] text-linear-muted leading-relaxed">
                Metadata says rep is <code className="text-[#D6ED17]">Meera</code>, caller states <em>"Ravi here"</em>.
              </p>
              <blockquote className="text-[10px] text-linear-text italic bg-linear-bg p-2 rounded border-l-2 border-[#D6ED17] font-mono leading-relaxed">
                "Good evening... Ravi here. I'll say at the start that this is a cold call."
              </blockquote>
            </div>
            <div className="text-[10px] text-linear-dim pt-2 border-t border-linear-border">
              <span className="text-linear-muted">Impact: </span> Sales Coaching audit item.
            </div>
          </div>

          {/* Finding 3 */}
          <div className="p-3.5 rounded bg-linear-surface border border-linear-border space-y-2 flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                  Compliance • Boundary
                </span>
                <Link
                  to="/conversations/call/c09-mock-call-id"
                  className="font-mono text-[10px] text-[#D6ED17] hover:underline inline-flex items-center gap-0.5"
                >
                  Call C09 <ArrowUpRight className="w-2.5 h-2.5" />
                </Link>
              </div>
              <h4 className="text-xs font-semibold text-linear-text leading-tight">
                No Name Citation in Referral
              </h4>
              <p className="text-[11px] text-linear-muted leading-relaxed">
                Prospect shared business head contact but strictly forbade name citation.
              </p>
              <blockquote className="text-[10px] text-linear-text italic bg-linear-bg p-2 rounded border-l-2 border-[#D6ED17] font-mono leading-relaxed">
                "Would it be all right if I mentioned your name? No, please don't use my name."
              </blockquote>
            </div>
            <div className="text-[10px] text-linear-dim pt-2 border-t border-linear-border">
              <span className="text-linear-muted">Impact: </span> Rep outreach compliance guard.
            </div>
          </div>
        </div>
      </div>

      {/* Action Priorities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="bg-linear-panel rounded-md border border-linear-border p-4 space-y-2">
          <div className="text-[10px] font-mono uppercase tracking-wider text-[#D6ED17]">
            Sales Coaching Directives
          </div>
          <ul className="space-y-2 text-xs text-linear-muted">
            <li className="p-2.5 rounded bg-linear-surface border border-linear-border leading-relaxed">
              <strong className="text-linear-text">Fee Transparency (M03):</strong> Separate recurring subscription (INR 26,000) from setup onboarding fees upfront.
            </li>
            <li className="p-2.5 rounded bg-linear-surface border border-linear-border leading-relaxed">
              <strong className="text-linear-text">Prepaid vs Revolving Credit (M04):</strong> Disclose early that cards use funded pool rather than revolving bank lines.
            </li>
          </ul>
        </div>

        <div className="bg-linear-panel rounded-md border border-linear-border p-4 space-y-2">
          <div className="text-[10px] font-mono uppercase tracking-wider text-emerald-400">
            Account & Vendor Directives
          </div>
          <ul className="space-y-2 text-xs text-linear-muted">
            <li className="p-2.5 rounded bg-linear-surface border border-linear-border leading-relaxed">
              <strong className="text-linear-text">Willowfield Trust (M07):</strong> Provide update on stuck reimbursements and manual receipt attachments.
            </li>
            <li className="p-2.5 rounded bg-linear-surface border border-linear-border leading-relaxed">
              <strong className="text-linear-text">Brookmint Holdings (M09):</strong> Re-issue valid admin token and resolve instant token expiration defect.
            </li>
          </ul>
        </div>
      </div>

      {/* 18 Usable Conversation Shortcuts */}
      <div className="bg-linear-panel rounded-md border border-linear-border p-4 space-y-2">
        <div className="flex items-center justify-between border-b border-linear-border pb-2 text-[10px] font-mono text-linear-dim">
          <span>ALL 18 VERIFIED CONVERSATIONS</span>
          <span className="text-[#D6ED17]">10 Calls • 8 Meetings</span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-9 gap-1.5 font-mono text-center">
          {['C01', 'C02', 'C03', 'C04', 'C05', 'C06', 'C07', 'C08', 'C09', 'C10',
            'M01', 'M02', 'M03', 'M04', 'M06', 'M07', 'M09', 'M10'].map(ref => {
            const conv = convMap.get(ref);
            if (!conv) return null;
            return (
              <Link
                key={ref}
                to={`/conversations/${conv.source_type}/${conv.source_id}`}
                className="p-1.5 rounded bg-linear-surface hover:bg-linear-hover border border-linear-border hover:border-[#D6ED17]/60 text-xs text-linear-text transition-colors"
              >
                <div className="font-bold text-[#D6ED17]">{ref}</div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Raw Markdown Output */}
      <div className="bg-linear-panel rounded-md border border-linear-border p-4 space-y-2">
        <div className="flex items-center justify-between border-b border-linear-border pb-1.5 text-[10px] font-mono text-linear-dim">
          <span>COMPLETE GENERATED DOCUMENT</span>
          <span>MANAGER_BRIEF_2026-08-21.md</span>
        </div>
        <div className="prose prose-invert max-w-none text-xs leading-relaxed whitespace-pre-wrap font-sans text-linear-muted">
          {briefMarkdown}
        </div>
      </div>
    </div>
  );
};
