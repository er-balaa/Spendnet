import React, { useEffect, useState } from 'react';
import {
  FolderArchive, Download, RefreshCw, FileText, CheckCircle2,
  ExternalLink, Search, ShieldCheck, Clock
} from 'lucide-react';
import { generateExports, fetchManifest, getExportDownloadUrl } from '../services/api';
import { RouteBadge } from '../components/RouteBadge';
import { StatusBadge } from '../components/StatusBadge';

export const ExportsPage: React.FC = () => {
  const [manifest, setManifest] = useState<any[]>([]);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [generatedAt, setGeneratedAt] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const loadManifest = async () => {
    setLoading(true);
    try {
      const data = await fetchManifest();
      setManifest(data.manifest || []);
      setTotalRecords(data.total_records || 0);
      setGeneratedAt(data.generated_at || '');
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadManifest();
  }, []);

  const handleGenerate = async () => {
    setGenerating(true);
    setMessage(null);
    try {
      const res = await generateExports();
      setMessage(res.message);
      await loadManifest();
    } catch (err: any) {
      alert(err.message || 'Export generation failed');
    } finally {
      setGenerating(false);
    }
  };

  const filteredManifest = manifest.filter(item => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      item.record_ref?.toLowerCase().includes(term) ||
      item.title?.toLowerCase().includes(term) ||
      item.assigned_routes?.toLowerCase().includes(term) ||
      item.source_id?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Exports & Artifact Manifest
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Download organized output reports, verify machine-readable JSON/CSV manifests, and trace artifacts to source records.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg shadow-2xs transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${generating ? 'animate-spin text-indigo-600' : ''}`} />
            {generating ? 'Generating Archive...' : 'Regenerate Exports'}
          </button>

          <a
            href={getExportDownloadUrl()}
            download="spendnest_revenue_intelligence_exports.zip"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-2xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Download ZIP Archive
          </a>
        </div>
      </div>

      {message && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Exported Logical Records
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">{totalRecords} Records</div>
          <div className="text-[11px] text-slate-400 mt-1">Every record mapped to physical report file</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Archive Structure
          </div>
          <div className="text-sm font-bold text-slate-800 mt-2">
            <code>conversations/</code>, <code>by_route/</code>, <code>manager_brief/</code>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Relative paths inside ZIP archive</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Manifest Formats
          </div>
          <div className="text-sm font-bold text-slate-800 mt-2">
            manifest.json & manifest.csv
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Generated: {generatedAt ? new Date(generatedAt).toLocaleTimeString() : 'Ready'}
          </div>
        </div>
      </div>

      {/* Manifest Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden space-y-4">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Machine-Readable Manifest
            </h3>
            <p className="text-[11px] text-slate-500">
              Traces each source identity (source_type, source_id) to assigned routes, review states, and relative paths
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search manifest..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 bg-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/70 border-b border-slate-200 text-slate-500 uppercase font-semibold text-[10px]">
              <tr>
                <th className="py-2.5 px-4">Ref / Type</th>
                <th className="py-2.5 px-4">Source ID</th>
                <th className="py-2.5 px-4">Title</th>
                <th className="py-2.5 px-4">Assigned Routes</th>
                <th className="py-2.5 px-4 text-center">Override?</th>
                <th className="py-2.5 px-4">Review State</th>
                <th className="py-2.5 px-4">Primary Output Path</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">Loading manifest...</td>
                </tr>
              ) : filteredManifest.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">No records found.</td>
                </tr>
              ) : (
                filteredManifest.map(item => (
                  <tr key={`${item.source_type}-${item.source_id}`} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      {item.record_ref}
                      <span className="text-[10px] text-slate-400 block font-normal">{item.source_type}</span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-500 max-w-[140px] truncate" title={item.source_id}>
                      {item.source_id}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-800 max-w-xs truncate" title={item.title}>
                      {item.title}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {(item.assigned_routes || '').split(';').map((r: string) => (
                          <span key={r.trim()} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-medium">
                            {r.trim()}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {item.manual_route_override ? (
                        <span className="px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 font-bold text-[10px]">
                          Yes
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[10px]">No</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={item.review_status} freshness={item.analysis_freshness} />
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-indigo-600 max-w-[180px] truncate" title={item.output_paths?.[0]}>
                      {item.output_paths?.[0] || 'N/A'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
