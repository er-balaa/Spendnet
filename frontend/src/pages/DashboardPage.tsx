import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
  Cell
} from 'recharts';
import {
  PhoneCall, Users, FileText, CheckCircle2, AlertTriangle, Filter, ArrowRight
} from 'lucide-react';
import { fetchDashboardMetrics, fetchFilterOptions } from '../services/api';
import { DashboardMetrics } from '../types';
import { MetricCard } from '../components/MetricCard';

const ROUTE_COLORS: Record<string, string> = {
  'Sales Coaching': '#a855f7',
  'Deal Next Steps': '#10b981',
  'Customer Follow-up': '#38bdf8',
  'Internal / Vendor Note': '#f59e0b',
  'Human Review': '#f43f5e'
};

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [sourceTypeFilter, setSourceTypeFilter] = useState('all');
  const [personFilter, setPersonFilter] = useState('all');
  const [filterOptions, setFilterOptions] = useState<{
    source_types: string[];
    persons: Array<{ name: string; role: string }>;
  }>({ source_types: [], persons: [] });

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [metricsData, filtersData] = await Promise.all([
        fetchDashboardMetrics(sourceTypeFilter, personFilter),
        fetchFilterOptions()
      ]);
      setMetrics(metricsData);
      setFilterOptions({
        source_types: filtersData.source_types,
        persons: filtersData.persons
      });
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [sourceTypeFilter, personFilter]);

  if (loading && !metrics) {
    return (
      <div className="p-12 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-2 text-linear-dim font-mono text-xs">
          <div className="w-5 h-5 border-2 border-[#D6ED17] border-t-transparent rounded-full animate-spin" />
          <span>Computing telemetry...</span>
        </div>
      </div>
    );
  }

  if (error || !metrics) {
    return (
      <div className="p-6">
        <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-md text-rose-300 text-xs">
          {error || 'Unable to load metrics'}
        </div>
      </div>
    );
  }

  const routingChartData = Object.entries(metrics.routing_distribution.counts).map(([name, count]) => ({
    name,
    count,
    fill: ROUTE_COLORS[name] || '#64748b'
  }));

  const callReps = metrics.activity_by_person.filter(p => p.role === 'Call Representative');
  const meetingOrganizers = metrics.activity_by_person.filter(p => p.role === 'Meeting Organizer');

  return (
    <div className="p-4 sm:p-6 space-y-5 max-w-[1600px] mx-auto bg-linear-bg text-linear-text">
      {/* Linear Page Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-linear-border pb-3">
        <div>
          <h1 className="text-base font-semibold tracking-tight text-linear-text font-heading">
            Telemetry Overview
          </h1>
          <p className="text-[11px] text-linear-muted font-mono mt-0.5">
            21 August 2026 • Asia/Kolkata • {metrics.total_unique_records} Verified Records
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-linear-surface border border-linear-border rounded-md text-xs">
            <Filter className="w-3 h-3 text-linear-dim" />
            <select
              value={sourceTypeFilter}
              onChange={e => setSourceTypeFilter(e.target.value)}
              className="bg-transparent text-linear-text text-xs focus:outline-hidden cursor-pointer [color-scheme:dark] dark:bg-[#14171E]"
            >
              <option value="all" className="bg-[#14171E] text-[#F0F1F3]">All Types</option>
              <option value="call" className="bg-[#14171E] text-[#F0F1F3]">Calls (30)</option>
              <option value="meeting" className="bg-[#14171E] text-[#F0F1F3]">Meetings (14)</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-linear-surface border border-linear-border rounded-md text-xs">
            <Users className="w-3 h-3 text-linear-dim" />
            <select
              value={personFilter}
              onChange={e => setPersonFilter(e.target.value)}
              className="bg-transparent text-linear-text text-xs focus:outline-hidden max-w-[160px] cursor-pointer [color-scheme:dark] dark:bg-[#14171E]"
            >
              <option value="all" className="bg-[#14171E] text-[#F0F1F3]">All People</option>
              <optgroup label="Call Representatives" className="bg-[#0E1015] text-[#8B909A] font-semibold">
                {filterOptions.persons
                  .filter(p => p.role === 'Call Representative')
                  .map(p => (
                    <option key={p.name} value={p.name} className="bg-[#14171E] text-[#F0F1F3]">{p.name}</option>
                  ))}
              </optgroup>
              <optgroup label="Meeting Organizers" className="bg-[#0E1015] text-[#8B909A] font-semibold">
                {filterOptions.persons
                  .filter(p => p.role === 'Meeting Organizer')
                  .map(p => (
                    <option key={p.name} value={p.name} className="bg-[#14171E] text-[#F0F1F3]">{p.name}</option>
                  ))}
              </optgroup>
            </select>
          </div>

          {(sourceTypeFilter !== 'all' || personFilter !== 'all') && (
            <button
              onClick={() => {
                setSourceTypeFilter('all');
                setPersonFilter('all');
              }}
              className="text-[11px] text-[#D6ED17] hover:underline px-1.5 transition-colors cursor-pointer"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Top Headline Metric Cards (Linear Pro KPI grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <MetricCard
          title="Total Unique Records"
          value={metrics.total_unique_records}
          subtitle={`(${metrics.total_calls} calls, ${metrics.total_meetings} meetings)`}
          denominatorExplanation="Count of distinct (source_type, source_id) composite identities matching active filter."
          icon={<FileText className="w-3.5 h-3.5 text-[#D6ED17]" />}
          onClick={() => navigate('/inbox')}
        />

        <MetricCard
          title="Transcript Coverage"
          value={`${metrics.transcript_coverage.rate}%`}
          subtitle={`${metrics.transcript_coverage.numerator} / ${metrics.transcript_coverage.denominator} records`}
          denominatorExplanation={metrics.transcript_coverage.definition}
          icon={<CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
          onClick={() => navigate('/inbox?has_transcript=yes')}
        />

        <MetricCard
          title="Call Connected Rate"
          value={`${metrics.call_connection_metrics.stored_connection_rate.rate}%`}
          subtitle={`${metrics.call_connection_metrics.stored_connection_rate.numerator} / ${metrics.call_connection_metrics.stored_connection_rate.denominator} calls`}
          denominatorExplanation={metrics.call_connection_metrics.stored_connection_rate.definition}
          icon={<PhoneCall className="w-3.5 h-3.5 text-[#D6ED17]" />}
        />

        <MetricCard
          title="Needs Review"
          value={metrics.records_requiring_review_count}
          subtitle={`${metrics.missing_or_unusable_text_count} missing/unusable`}
          denominatorExplanation="Records awaiting review, missing usable transcripts, or with stale analysis."
          icon={<AlertTriangle className="w-3.5 h-3.5 text-amber-400" />}
          onClick={() => navigate('/inbox?review_status=Awaiting%20Review')}
        />
      </div>

      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Routing Distribution Chart */}
        <div className="bg-linear-panel p-4 rounded-lg border border-linear-border space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-semibold tracking-tight text-linear-text font-mono uppercase">
                Routing Distribution
              </h3>
              <p className="text-[11px] text-linear-dim mt-0.5">
                {metrics.routing_distribution.total_assignments} assignments across {metrics.total_unique_records} records
              </p>
            </div>
            <span className="text-[10px] font-mono px-1.5 py-0.2 bg-white/[0.04] text-linear-muted border border-linear-border rounded">
              multi-route
            </span>
          </div>

          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={routingChartData} margin={{ top: 10, right: 10, left: -25, bottom: 15 }}>
                <CartesianGrid strokeDasharray="2 2" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#8B909A' }} angle={-10} textAnchor="end" stroke="transparent" />
                <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: '#8B909A' }} stroke="transparent" />
                <Tooltip
                  formatter={(val: any) => [`${val} conversations`, 'Assigned']}
                  contentStyle={{ backgroundColor: '#151619', borderRadius: '6px', fontSize: '11px', border: '1px solid #23252A', color: '#F0F1F3', fontFamily: 'JetBrains Mono' }}
                />
                <Bar dataKey="count" radius={[3, 3, 0, 0]}>
                  {routingChartData.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Activity by Hour (Asia/Kolkata Timeline) */}
        <div className="bg-linear-panel p-4 rounded-lg border border-linear-border space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-semibold tracking-tight text-linear-text font-mono uppercase">
                Timeline Activity (Asia/Kolkata)
              </h3>
              <p className="text-[11px] text-linear-dim mt-0.5">
                Interaction starts on Friday, 21 August 2026
              </p>
            </div>
          </div>

          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics.activity_by_hour} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="2 2" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="hour" tick={{ fontSize: 10, fill: '#8B909A' }} interval={2} stroke="transparent" />
                <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: '#8B909A' }} stroke="transparent" />
                <Tooltip contentStyle={{ backgroundColor: '#151619', borderRadius: '6px', fontSize: '11px', border: '1px solid #23252A', color: '#F0F1F3', fontFamily: 'JetBrains Mono' }} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
                <Bar dataKey="calls" name="Calls" fill="#2A2F3D" stackId="a" radius={[0, 0, 0, 0]} />
                <Bar dataKey="meetings" name="Meetings" fill="#D6ED17" stackId="a" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Tables: Rep Activity & Organizer Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Call Reps */}
        <div className="bg-linear-panel rounded-lg border border-linear-border overflow-hidden">
          <div className="px-3.5 py-2.5 border-b border-linear-border flex items-center justify-between bg-linear-surface">
            <h3 className="text-xs font-semibold text-linear-text font-mono uppercase">
              Call Activity by Rep
            </h3>
            <span className="text-[10px] font-mono text-[#D6ED17]">
              {callReps.length} Reps
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-linear-surface/50 border-b border-linear-border text-linear-dim uppercase font-mono text-[10px]">
                <tr>
                  <th className="py-2 px-3">Rep</th>
                  <th className="py-2 px-3 text-center">Calls</th>
                  <th className="py-2 px-3 text-center">Connected</th>
                  <th className="py-2 px-3 text-center">Text</th>
                  <th className="py-2 px-3 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-linear-border/60">
                {callReps.map(rep => (
                  <tr key={rep.name} className="hover:bg-linear-hover transition-colors">
                    <td className="py-2 px-3 font-medium text-linear-text">{rep.name}</td>
                    <td className="py-2 px-3 text-center font-mono text-linear-muted">{rep.calls}</td>
                    <td className="py-2 px-3 text-center font-mono text-emerald-400">{rep.connected_calls}</td>
                    <td className="py-2 px-3 text-center font-mono text-[#D6ED17] font-semibold">{rep.usable_transcripts}</td>
                    <td className="py-2 px-3 text-right">
                      <button
                        onClick={() => navigate(`/inbox?person=${encodeURIComponent(rep.name)}&source_type=call`)}
                        className="text-[#D6ED17] hover:underline font-mono text-[11px] inline-flex items-center gap-0.5 cursor-pointer"
                      >
                        view <ArrowRight className="w-2.5 h-2.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Meeting Organizers */}
        <div className="bg-linear-panel rounded-lg border border-linear-border overflow-hidden">
          <div className="px-3.5 py-2.5 border-b border-linear-border flex items-center justify-between bg-linear-surface">
            <h3 className="text-xs font-semibold text-linear-text font-mono uppercase">
              Meeting Organizers
            </h3>
            <span className="text-[10px] font-mono text-linear-dim">
              {meetingOrganizers.length} Organizers
            </span>
          </div>

          <div className="overflow-x-auto max-h-[240px] overflow-y-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-linear-surface/50 border-b border-linear-border text-linear-dim uppercase font-mono text-[10px] sticky top-0 backdrop-blur-xs">
                <tr>
                  <th className="py-2 px-3">Organizer</th>
                  <th className="py-2 px-3 text-center">Meetings</th>
                  <th className="py-2 px-3 text-center">Text</th>
                  <th className="py-2 px-3 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-linear-border/60">
                {meetingOrganizers.map(org => (
                  <tr key={org.name} className="hover:bg-linear-hover transition-colors">
                    <td className="py-2 px-3 font-mono text-[11px] text-linear-text">{org.name}</td>
                    <td className="py-2 px-3 text-center font-mono text-linear-muted">{org.meetings}</td>
                    <td className="py-2 px-3 text-center font-mono text-[#D6ED17] font-semibold">{org.usable_transcripts}</td>
                    <td className="py-2 px-3 text-right">
                      <button
                        onClick={() => navigate(`/inbox?person=${encodeURIComponent(org.name)}&source_type=meeting`)}
                        className="text-[#D6ED17] hover:underline font-mono text-[11px] inline-flex items-center gap-0.5 cursor-pointer"
                      >
                        view <ArrowRight className="w-2.5 h-2.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
