import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Inbox,
  Workflow,
  FileText,
  FolderArchive,
  RefreshCw
} from 'lucide-react';

interface SidebarProps {
  recordsCount?: number;
  onOpenTour?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ recordsCount, onOpenTour }) => {
  const navItems = [
    {
      to: '/',
      label: 'Overview',
      icon: LayoutDashboard,
      badge: null,
      shortcut: '1'
    },
    {
      to: '/inbox',
      label: 'Inbox',
      icon: Inbox,
      badge: recordsCount ? String(recordsCount) : '44',
      shortcut: '2'
    },
    {
      to: '/routing',
      label: 'Routing Matrix',
      icon: Workflow,
      badge: null,
      shortcut: '3'
    },
    {
      to: '/brief',
      label: 'Manager Brief',
      icon: FileText,
      badge: '21 Aug',
      shortcut: '4'
    },
    {
      to: '/exports',
      label: 'Exports',
      icon: FolderArchive,
      badge: null,
      shortcut: '5'
    },
    {
      to: '/imports',
      label: 'Replay Engine',
      icon: RefreshCw,
      badge: null,
      shortcut: '6'
    }
  ];

  return (
    <aside className="w-56 shrink-0 bg-linear-panel border-r border-linear-border h-full flex flex-col justify-between select-none overflow-hidden">
      <div className="p-2 space-y-4">
        <div>
          <div className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-linear-dim font-mono">
            Navigation
          </div>
          <nav id="tour-sidebar-nav" className="space-y-0.5 mt-1">
            {navItems.map(item => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    `group flex items-center justify-between px-2.5 py-1.5 text-xs rounded-md transition-all ${
                      isActive
                        ? 'bg-linear-hover text-linear-text font-medium border-l-2 border-[#D6ED17]'
                        : 'text-linear-muted hover:text-linear-text hover:bg-linear-surface'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className="flex items-center gap-2">
                        <Icon className={`w-3.5 h-3.5 transition-colors ${isActive ? 'text-[#D6ED17]' : 'text-linear-dim group-hover:text-linear-muted'}`} />
                        <span>{item.label}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {item.badge && (
                          <span className={`px-1.5 py-0.2 text-[10px] font-mono rounded ${
                            isActive ? 'bg-[#D6ED17]/15 text-[#D6ED17]' : 'bg-white/[0.04] text-linear-dim'
                          }`}>
                            {item.badge}
                          </span>
                        )}
                        <kbd className="kbd opacity-0 group-hover:opacity-100 transition-opacity">
                          {item.shortcut}
                        </kbd>
                      </div>
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

      </div>

      <div className="p-2.5 border-t border-linear-border text-[10px] text-linear-dim font-mono flex items-center justify-between">
        <span>Linear Pro UI</span>
        <span className="text-[#D6ED17]">v2.1</span>
      </div>
    </aside>
  );
};
