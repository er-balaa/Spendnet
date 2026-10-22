import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
  PieChart, Pie, Cell
} from 'recharts';
import {
  PhoneCall, Users, FileText, CheckCircle2, Clock, AlertTriangle, Filter,
  ArrowRight, ShieldCheck, HelpCircle
} from 'lucide-react';
import { fetchDashboardMetrics, fetchFilterOptions } from '../services/api';
import { DashboardMetrics } from '../types';
import { MetricCard } from '../components/MetricCard';
import { RouteBadge } from '../components/RouteBadge';

const ROUTE_COLORS: Record<string, string> = {
  'Sales Coaching': '#9333ea',
  'Deal Next Steps': '#059669',
  'Customer Follow-up': '#2563eb',
  'Internal / Vendor Note': '#d97706',
  'Human Review': '#e11d48'
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
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold text-slate-500">Calculating dashboard metrics from MongoDB...</span>
        </div>
      </div>
    );
  }

  if (error || !metrics) {
    return (
      <div className="p-8">
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs">
          {error || 'Unable to load metrics'}
        </div>
      </div>
    );
  }

  // Format routing data for Recharts
  const routingChartData = Object.entries(metrics.routing_distribution.counts).map(([name, count]) => ({
    name,
    count,
    fill: ROUTE_COLORS[name] || '#64748b'
  }));

  // Separate Call Reps from Meeting Organizers
  const callReps = metrics.activity_by_person.filter(p => p.role === 'Call Representative');
  const meetingOrganizers = metrics.activity_by_person.filter(p => p.role === 'Meeting Organizer');

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Overview Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Activity and intelligence metrics for 21 August 2026 (Asia/Kolkata timezone). All numbers derived strictly from source records.
          </p>
        </div>

        {/* Dynamic Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg shadow-2xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sourceTypeFilter}
              onChange={e => setSourceTypeFilter(e.target.value)}
              className="text-xs bg-transparent text-slate-700 font-medium focus:outline-hidden"
            >
              <option value="all">All Source Types</option>
              <option value="call">Calls Only (30)</option>
              <option value="meeting">Meetings Only (14)</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg shadow-2xs">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={personFilter}
              onChange={e => setPersonFilter(e.target.value)}
              className="text-xs bg-transparent text-slate-700 font-medium focus:outline-hidden max-w-[200px]"
            >
              <option value="all">All Persons</option>
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
          </div>

          {(sourceTypeFilter !== 'all' || personFilter !== 'all') && (
            <button
              onClick={() => {
                setSourceTypeFilter('all');
                setPersonFilter('all');
              }}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 px-2.5 py-1.5"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Top Headline Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Unique Records"
          value={metrics.total_unique_records}
          subtitle={`(${metrics.total_calls} calls, ${metrics.total_meetings} meetings)`}
          denominatorExplanation="Count of distinct (source_type, source_id) composite identities matching active filter."
          icon={<FileText className="w-5 h-5 text-indigo-600" />}
          onClick={() => navigate('/inbox')}
          accentColor="border-l-indigo-600"
        />

        <MetricCard
          title="Transcript Coverage"
          value={`${metrics.transcript_coverage.rate}%`}
          subtitle={`${metrics.transcript_coverage.numerator} / ${metrics.transcript_coverage.denominator} records`}
          denominatorExplanation={metrics.transcript_coverage.definition}
          icon={<CheckCircle2 className="w-5 h-5 text-emerald-600" />}
          onClick={() => navigate('/inbox?has_transcript=true')}
          accentColor="border-l-emerald-600"
        />

        <MetricCard
          title="Calls Connected Rate"
          value={`${metrics.call_connection_metrics.stored_connection_rate.rate}%`}
          subtitle={`${metrics.call_connection_metrics.stored_connection_rate.numerator} / ${metrics.call_connection_metrics.stored_connection_rate.denominator} calls`}
          denominatorExplanation={metrics.call_connection_metrics.stored_connection_rate.definition}
          icon={<PhoneCall className="w-5 h-5 text-blue-600" />}
          accentColor="border-l-blue-600"
        />

        <MetricCard
          title="Records Requiring Review"
          value={metrics.records_requiring_review_count}
          subtitle={`${metrics.missing_or_unusable_text_count} missing/unusable text`}
          denominatorExplanation="Records awaiting human review, missing usable transcripts, or with stale analysis needing confirmation."
          icon={<AlertTriangle className="w-5 h-5 text-amber-600" />}
          onClick={() => navigate('/inbox?review_status=Awaiting%20Review')}
          accentColor="border-l-amber-500"
        />
      </div>

      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Routing Distribution Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Conversation Routing Distribution
              </h3>
              <p className="text-[11px] text-slate-500">
                Assigned destinations ({metrics.routing_distribution.total_assignments} assignments across {metrics.total_unique_records} records)
              </p>
            </div>
            <span className="text-[10px] font-semibold px-2 py-1 bg-indigo-50 text-indigo-700 rounded-md border border-indigo-100">
              Multi-Route Enabled
            </span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={routingChartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-15} textAnchor="end" />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(val: any) => [`${val} conversations`, 'Assigned']}
                  contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {routingChartData.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <p className="text-[11px] text-slate-400 italic">
            * Note: Sum of route assignments exceeds unique records because complex interactions can serve multiple operational purposes.
          </p>
        </div>

        {/* Activity by Hour (Asia/Kolkata Timeline) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Activity by Hour (Asia/Kolkata Timeline)
              </h3>
              <p className="text-[11px] text-slate-500">
                Interaction start times across Friday, 21 August 2026
              </p>
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics.activity_by_hour} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="hour" tick={{ fontSize: 10 }} interval={2} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="calls" name="Calls" fill="#6366f1" stackId="a" />
                <Bar dataKey="meetings" name="Meetings" fill="#06b6d4" stackId="a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Activity by Person (Call Representatives vs Meeting Organizers) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Call Representatives Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Call Activity by Representative
              </h3>
              <p className="text-[11px] text-slate-500">
                Sales development reps initiating phone calls
              </p>
            </div>
            <span className="text-xs font-semibold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
              {callReps.length} Reps
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/70 border-b border-slate-200 text-slate-500 uppercase font-semibold text-[10px]">
                <tr>
                  <th className="py-2.5 px-4">Representative</th>
                  <th className="py-2.5 px-4 text-center">Total Calls</th>
                  <th className="py-2.5 px-4 text-center">Connected</th>
                  <th className="py-2.5 px-4 text-center">Usable Text</th>
                  <th className="py-2.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {callReps.map(rep => (
                  <tr key={rep.name} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4 font-semibold text-slate-900">{rep.name}</td>
                    <td className="py-3 px-4 text-center font-mono">{rep.calls}</td>
                    <td className="py-3 px-4 text-center font-mono text-emerald-700">{rep.connected_calls}</td>
                    <td className="py-3 px-4 text-center font-mono text-indigo-700">{rep.usable_transcripts}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => navigate(`/inbox?person=${encodeURIComponent(rep.name)}&source_type=call`)}
                        className="text-indigo-600 hover:text-indigo-800 font-semibold inline-flex items-center gap-1"
                      >
                        Inspect <ArrowRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Meeting Organizers Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold text-slate-900">
                  Meeting Activity by Organizer
                </h3>
                <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200 rounded px-1.5 py-0.5 font-medium" title="Organizer != Confirmed Rep">
                  Organizer != Sales Rep
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Calendar organizers (does not imply attendance or selling role)
              </p>
            </div>
            <span className="text-xs font-semibold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
              {meetingOrganizers.length} Organizers
            </span>
          </div>

          <div className="overflow-x-auto max-h-[320px] overflow-y-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/70 border-b border-slate-200 text-slate-500 uppercase font-semibold text-[10px] sticky top-0">
                <tr>
                  <th className="py-2.5 px-4">Organizer Email</th>
                  <th className="py-2.5 px-4 text-center">Meetings</th>
                  <th className="py-2.5 px-4 text-center">Usable Text</th>
                  <th className="py-2.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {meetingOrganizers.map(org => (
                  <tr key={org.name} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4 font-semibold text-slate-900 font-mono text-[11px]">{org.name}</td>
                    <td className="py-3 px-4 text-center font-mono">{org.meetings}</td>
                    <td className="py-3 px-4 text-center font-mono text-indigo-700">{org.usable_transcripts}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => navigate(`/inbox?person=${encodeURIComponent(org.name)}&source_type=meeting`)}
                        className="text-indigo-600 hover:text-indigo-800 font-semibold inline-flex items-center gap-1"
                      >
                        Inspect <ArrowRight className="w-3 h-3" />
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
