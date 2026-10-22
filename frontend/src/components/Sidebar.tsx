import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Inbox,
  Workflow,
  FileText,
  FolderArchive,
  RefreshCw,
  HelpCircle,
  Presentation,
  Lightbulb
} from 'lucide-react';

interface SidebarProps {
  recordsCount?: number;
  onOpenTour?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ recordsCount, onOpenTour }) => {
  const navItems = [
    {
      to: '/',
      label: 'Overview Dashboard',
      icon: LayoutDashboard,
      badge: null
    },
    {
      to: '/inbox',
      label: 'Conversation Inbox',
      icon: Inbox,
      badge: recordsCount ? String(recordsCount) : '44'
    },
    {
      to: '/routing',
      label: 'Routing & Analysis',
      icon: Workflow,
      badge: null
    },
    {
      to: '/brief',
      label: 'Manager Brief (21 Aug)',
      icon: FileText,
      badge: 'Brief'
    },
    {
      to: '/exports',
      label: 'Exports & Downloads',
      icon: FolderArchive,
      badge: null
    },
    {
      to: '/imports',
      label: 'Import & Replay Controls',
      icon: RefreshCw,
      badge: 'Replay'
    }
  ];

  return (
    <aside className="w-64 shrink-0 bg-white border-r border-slate-200 min-h-[calc(100vh-61px)] flex flex-col justify-between">
      <div className="p-4 space-y-6">
        <div>
          <div className="px-3 mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Workspaces
          </div>
          <nav id="tour-sidebar-nav" className="space-y-1">
            {navItems.map(item => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg transition-colors ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-700 font-bold border-l-3 border-indigo-600'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-slate-100 text-slate-600 rounded">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* User Guide Interactive Tour Launcher */}
        {onOpenTour && (
          <button
            type="button"
            onClick={onOpenTour}
            className="w-full flex items-center justify-between p-3 bg-indigo-50 hover:bg-indigo-100/80 border border-indigo-200 rounded-xl text-left transition-colors cursor-pointer group shadow-2xs"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0">
                <Lightbulb className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="text-xs font-bold text-indigo-950 group-hover:text-indigo-700">
                  Interactive User Guide
                </div>
                <div className="text-[10px] text-indigo-700">
                  Start Feature Tour
                </div>
              </div>
            </div>
          </button>
        )}

        {/* Data Contract Guardrails Callout */}
        <div id="tour-sidebar-rules" className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
            <HelpCircle className="w-4 h-4 text-indigo-600" />
            <span>Data Contract Rules</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Identity is composite <code className="text-indigo-700 bg-indigo-50 px-1 py-0.5 rounded font-mono">(source_type, source_id)</code>. Revisions overwrite source payload but preserve candidate analysis and manual overrides.
          </p>
        </div>
      </div>

      <div className="p-4 border-t border-slate-200 bg-slate-50/50">
        <div className="text-[11px] text-slate-500">
          <span className="font-semibold text-slate-700">SpendNest Revenue Intel</span>
          <div>Assessment Delivery v2.0</div>
        </div>
      </div>
    </aside>
  );
};
