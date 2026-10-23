import React, { useEffect, useState } from 'react';
import {
  Download, RefreshCw, Search
} from 'lucide-react';
import { generateExports, fetchManifest, getExportDownloadUrl } from '../services/api';
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
    <div className="p-4 sm:p-6 space-y-4 max-w-[1600px] mx-auto bg-linear-bg text-linear-text">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-linear-border pb-3">
        <div>
          <h1 className="text-base font-semibold tracking-tight text-linear-text font-heading">
            Exports & Artifact Manifest
          </h1>
          <p className="text-[11px] text-linear-dim font-mono mt-0.5">
            Download organized output reports • Machine-readable manifest.json / manifest.csv
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-linear-muted hover:text-linear-text bg-linear-surface border border-linear-border rounded-md transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3 h-3 ${generating ? 'animate-spin text-[#D6ED17]' : ''}`} />
            <span>{generating ? 'Compiling...' : 'Regenerate'}</span>
          </button>

          <a
            href={getExportDownloadUrl()}
            download="spendnest_revenue_intelligence_exports.zip"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#08090A] bg-[#D6ED17] hover:bg-[#cde410] rounded-md transition-all cursor-pointer shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-[#08090A]" />
            <span>Download ZIP</span>
          </a>
        </div>
      </div>

      {message && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-md text-xs flex items-center gap-2 font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>{message}</span>
        </div>
      )}

      {/* KPI stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-linear-panel p-3.5 rounded-md border border-linear-border">
          <div className="text-[10px] font-mono uppercase text-linear-dim">Logical Records</div>
          <div className="text-xl font-semibold text-linear-text font-mono mt-1">{totalRecords}</div>
        </div>

        <div className="bg-linear-panel p-3.5 rounded-md border border-linear-border">
          <div className="text-[10px] font-mono uppercase text-linear-dim">Archive Structure</div>
          <div className="text-xs font-mono text-[#D6ED17] mt-1 truncate">conversations/ • by_route/ • manager_brief/</div>
        </div>

        <div className="bg-linear-panel p-3.5 rounded-md border border-linear-border">
          <div className="text-[10px] font-mono uppercase text-linear-dim">Generated Timestamp</div>
          <div className="text-xs font-mono text-linear-text mt-1">
            {generatedAt ? new Date(generatedAt).toLocaleTimeString() : 'Ready'}
          </div>
        </div>
      </div>

      {/* Manifest Table */}
      <div className="bg-linear-panel rounded-md border border-linear-border overflow-hidden">
        <div className="p-3 bg-linear-surface border-b border-linear-border flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span className="text-xs font-mono uppercase text-linear-text font-semibold">
            Artifact Manifest
          </span>

          <div className="relative w-full sm:w-64">
            <Search className="w-3 h-3 absolute left-2.5 top-1/2 -translate-y-1/2 text-linear-dim" />
            <input
              type="text"
              placeholder="Search manifest..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full text-xs pl-7 pr-3 py-1 rounded border border-linear-border bg-linear-bg text-linear-text placeholder:text-linear-dim focus:outline-hidden focus:border-[#D6ED17]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-linear-surface/60 border-b border-linear-border text-linear-dim uppercase font-mono text-[10px]">
              <tr>
                <th className="py-2 px-3">Ref / Type</th>
                <th className="py-2 px-3">Source ID</th>
                <th className="py-2 px-3">Title</th>
                <th className="py-2 px-3">Assigned Routes</th>
                <th className="py-2 px-3 text-center">Override?</th>
                <th className="py-2 px-3">State</th>
                <th className="py-2 px-3">Output File</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-linear-border/60 font-mono text-[11px]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-linear-dim font-mono">Loading manifest...</td>
                </tr>
              ) : filteredManifest.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-linear-dim font-mono">No records found.</td>
                </tr>
              ) : (
                filteredManifest.map(item => (
                  <tr key={`${item.source_type}-${item.source_id}`} className="hover:bg-linear-hover transition-colors">
                    <td className="py-2 px-3 font-semibold text-linear-text">
                      {item.record_ref}
                      <span className="text-[10px] text-linear-dim block uppercase font-normal">{item.source_type}</span>
                    </td>
                    <td className="py-2 px-3 text-linear-dim truncate max-w-[140px]" title={item.source_id}>
                      {item.source_id}
                    </td>
                    <td className="py-2 px-3 font-sans text-linear-text truncate max-w-xs" title={item.title}>
                      {item.title}
                    </td>
                    <td className="py-2 px-3">
                      <div className="flex flex-wrap gap-1 font-sans">
                        {(item.assigned_routes || '').split(';').map((r: string) => (
                          <span key={r.trim()} className="px-1.5 py-0.2 rounded bg-white/[0.04] text-linear-muted text-[10px] border border-linear-border">
                            {r.trim()}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-2 px-3 text-center">
                      {item.manual_route_override ? (
                        <span className="px-1.5 py-0.2 rounded bg-[#D6ED17] text-[#08090A] font-bold text-[10px]">
                          YES
                        </span>
                      ) : (
                        <span className="text-linear-dim text-[10px]">no</span>
                      )}
                    </td>
                    <td className="py-2 px-3">
                      <StatusBadge status={item.review_status} freshness={item.analysis_freshness} />
                    </td>
                    <td className="py-2 px-3 text-[#D6ED17] truncate max-w-[180px]" title={item.output_paths?.[0]}>
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
