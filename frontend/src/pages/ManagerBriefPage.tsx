import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText, Calendar, Clock, CheckCircle2, AlertTriangle, ArrowRight,
  Sparkles, Download, ShieldCheck, UserCheck, PhoneCall, ExternalLink
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
      <div className="p-12 flex justify-center items-center min-h-[400px]">
        <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Quick lookup map for conversation links
  const convMap = new Map<string, ConversationItem>();
  (conversations || []).forEach(c => convMap.set(c.record_ref, c));

  return (
    <div className="p-8 space-y-8 max-w-5xl mx-auto">
      {/* Top Banner */}
      <div className="bg-indigo-900 text-white rounded-2xl p-8 shadow-md relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2 text-indigo-200 text-xs font-semibold">
            <Calendar className="w-4 h-4" />
            <span>Friday, 21 August 2026</span>
            <span>•</span>
            <Clock className="w-4 h-4" />
            <span>Asia/Kolkata Timezone (UTC+05:30)</span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight">
            Sales Manager Daily Intelligence Brief
          </h1>
          <p className="text-xs text-indigo-200 max-w-2xl leading-relaxed">
            Consolidated operational review across all 44 unique source records and 18 post-update conversations. Every recommendation is verified against supplied transcript passages.
          </p>

          <div className="pt-3 flex flex-wrap items-center gap-3">
            <button
              onClick={downloadBrief}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold bg-white text-indigo-950 hover:bg-indigo-50 rounded-lg shadow-xs transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Download Brief (.md)
            </button>
            <span className="text-xs text-indigo-300">
              Coverage: 18 / 44 Usable Texts (40.9%)
            </span>
          </div>
        </div>

        {/* Decorative background element */}
        <div className="absolute right-0 bottom-0 translate-x-10 translate-y-10 w-64 h-64 bg-indigo-800/40 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Key Evidence-Backed Findings Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Three Required Recruitment Findings (Traceable to Source Text)
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Finding 1 */}
          <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase text-rose-700">Finding 1: UI Form Bug</span>
              <Link to="/conversations/meeting/4f304fff-fd40-5cfc-a366-0a134c445c2a" className="text-xs font-mono font-bold text-indigo-600 hover:underline">
                M07 Turn 22
              </Link>
            </div>
            <h4 className="text-xs font-bold text-slate-900">Mark as Paid Amount State Retention</h4>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Customer A demonstrated that the payment modal retains the previous transaction's amount (INR 18,200) instead of fetching the current record, requiring repeated form cancellations.
            </p>
            <blockquote className="text-[10px] text-slate-700 italic bg-white p-2 rounded border-l-2 border-rose-500">
              "The amount from the previous item appears in the next one. Each time I have to cancel, leave it and open Mark as paid again..."
            </blockquote>
            <div className="text-[10px] text-slate-500 pt-1 border-t border-rose-100">
              <strong>Product Impact:</strong> Escalated to Engineering as High Priority defect; M07 assigned to Internal/Vendor Note.
            </div>
          </div>

          {/* Finding 2 */}
          <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase text-purple-700">Finding 2: Rep Identity Mismatch</span>
              <Link to="/conversations/call/c06-mock-call-id" className="text-xs font-mono font-bold text-indigo-600 hover:underline">
                Call C06
              </Link>
            </div>
            <h4 className="text-xs font-bold text-slate-900">Dialer Credential Attribution Discrepancy</h4>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Source metadata records <code>rep_name: Meera</code>, but the spoken transcript clearly shows the caller identifying himself as <em>"Ravi here"</em>.
            </p>
            <blockquote className="text-[10px] text-slate-700 italic bg-white p-2 rounded border-l-2 border-purple-500">
              "Good evening, Mr Nikhil. Good evening. Ravi here. I'll say at the start that this is a cold call."
            </blockquote>
            <div className="text-[10px] text-slate-500 pt-1 border-t border-purple-100">
              <strong>Product Impact:</strong> Sales Coaching action item to investigate shared dialer account credentials and rep attribution.
            </div>
          </div>

          {/* Finding 3 */}
          <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase text-amber-700">Finding 3: Explicit Boundary</span>
              <Link to="/conversations/call/c09-mock-call-id" className="text-xs font-mono font-bold text-indigo-600 hover:underline">
                Call C09
              </Link>
            </div>
            <h4 className="text-xs font-bold text-slate-900">Strict Prohibition on Referral Attribution</h4>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Prospect Vedant directed rep to his business head Mr Rishabh on LinkedIn, but explicitly forbade mentioning his name in the outreach.
            </p>
            <blockquote className="text-[10px] text-slate-700 italic bg-white p-2 rounded border-l-2 border-amber-500">
              "Would it be all right if I mentioned your name when contacting him? No, please don't use my name."
            </blockquote>
            <div className="text-[10px] text-slate-500 pt-1 border-t border-amber-100">
              <strong>Product Impact:</strong> SDR outreach instructions explicitly prohibit citing Vedant, protecting relationship trust.
            </div>
          </div>
        </div>
      </div>

      {/* Practical Action Priorities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sales Coaching Priorities */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-purple-700 uppercase tracking-wider">
            <UserCheck className="w-4 h-4" />
            <span>Practical Sales Coaching Priorities</span>
          </div>
          <ul className="space-y-2.5 text-xs text-slate-700">
            <li className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
              <strong>Fee Structure Transparency (M03):</strong> Coach reps to separate recurring software subscriptions (INR 26,000) from one-time onboarding/integration setup (INR 13,000) upfront to prevent prospect confusion and lost trust.
            </li>
            <li className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
              <strong>Early Qualification on Credit vs Prepaid (M03, M04):</strong> Clarify that domestic SpendNest cards operate on a shared funded prepaid pool rather than revolving corporate credit.
            </li>
            <li className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
              <strong>Respecting Prospect Boundaries (C10):</strong> When an executive asks for information via chat and explicitly declines a follow-up call, reps must not pressure for calendar commitments.
            </li>
          </ul>
        </div>

        {/* Customer Follow-up & Vendor Issues */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-700 uppercase tracking-wider">
            <PhoneCall className="w-4 h-4" />
            <span>Customer Follow-up & Vendor Priorities</span>
          </div>
          <ul className="space-y-2.5 text-xs text-slate-700">
            <li className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
              <strong>Willowfield Trust (M07):</strong> Provide immediate engineering updates on stuck reimbursements and confirm document attachment workarounds.
            </li>
            <li className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
              <strong>Brookmint Holdings (M09):</strong> Re-issue valid admin invitation tokens and resolve the instant token expiration authentication bug.
            </li>
            <li className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
              <strong>LedgerBridge Invoicing (M02):</strong> Submit completed volume projections for Singapore/Australia/India compliant e-invoicing ahead of the Q4 AR module release.
            </li>
          </ul>
        </div>
      </div>

      {/* Interactive Links to All 18 Usable Conversations */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-slate-900">
            Direct Evidence Links to All 18 Usable Conversations
          </h3>
          <span className="text-xs text-slate-500">10 Calls • 8 Meetings</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
          {['C01', 'C02', 'C03', 'C04', 'C05', 'C06', 'C07', 'C08', 'C09', 'C10',
            'M01', 'M02', 'M03', 'M04', 'M06', 'M07', 'M09', 'M10'].map(ref => {
            const conv = convMap.get(ref);
            if (!conv) return null;
            return (
              <Link
                key={ref}
                to={`/conversations/${conv.source_type}/${conv.source_id}`}
                className="p-2.5 rounded-lg border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/50 transition-all text-center group"
              >
                <div className="font-mono font-bold text-xs text-slate-900 group-hover:text-indigo-600">
                  {ref}
                </div>
                <div className="text-[10px] text-slate-500 truncate mt-0.5">
                  {conv.title.split('—')[0].replace('Meeting:', '').trim()}
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Full Brief Content Markdown View */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-6 border-b border-slate-100 pb-2">
          Full Markdown Manager Brief Document
        </h3>
        <div className="prose prose-slate max-w-none text-xs leading-relaxed space-y-4 whitespace-pre-wrap font-sans text-slate-800">
          {briefMarkdown}
        </div>
      </div>
    </div>
  );
};
