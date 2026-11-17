/**
 * Questo Enterprise 2.0 — Dashboard Shell Layout
 * 
 * Professional sidebar navigation + top bar + content area.
 * Inspired by Linear, Vercel Dashboard, and Notion.
 */

import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, ClipboardList, ListChecks, Map as MapIcon,
  Users, UserPlus, CalendarOff, Video, BarChart3, Settings,
  ChevronLeft, ChevronRight, LogOut, Search, Bell, ExternalLink,
  Sparkles, PanelLeftClose, PanelLeft, Command, Sun, Moon,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface SidebarLink {
  label: string;
  path: string;
  icon: React.ReactNode;
  badge?: number;
}

interface SidebarSection {
  title: string;
  links: SidebarLink[];
}

export const DashboardLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() =>
    document.documentElement.classList.contains('dark')
  );

  const toggleTheme = () => {
    if (darkMode) {
      document.documentElement.classList.remove('dark');
      setDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      setDarkMode(true);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const sections: SidebarSection[] = [
    {
      title: 'OVERVIEW',
      links: [
        { label: 'Dashboard', path: '/app', icon: <LayoutDashboard className="w-4 h-4" /> },
      ],
    },
    {
      title: 'WORK',
      links: [
        { label: 'Daily Standups', path: '/app/standups', icon: <ClipboardList className="w-4 h-4" /> },
        { label: 'Tasks & Quests', path: '/app/tasks', icon: <ListChecks className="w-4 h-4" /> },
        { label: 'Roadmaps', path: '/app/roadmaps', icon: <MapIcon className="w-4 h-4" /> },
      ],
    },
    {
      title: 'PEOPLE',
      links: [
        { label: 'Team', path: '/app/team', icon: <Users className="w-4 h-4" /> },
        { label: 'Talent Pipeline', path: '/app/talent', icon: <UserPlus className="w-4 h-4" /> },
        { label: 'Leaves & PTO', path: '/app/leaves', icon: <CalendarOff className="w-4 h-4" /> },
      ],
    },
    {
      title: 'OPERATIONS',
      links: [
        { label: 'Meetings', path: '/app/meetings', icon: <Video className="w-4 h-4" /> },
        { label: 'Analytics', path: '/app/analytics', icon: <BarChart3 className="w-4 h-4" /> },
      ],
    },
  ];

  const isActivePath = (path: string) => {
    if (path === '/app') return location.pathname === '/app';
    return location.pathname.startsWith(path);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className={`flex items-center gap-2.5 px-4 h-14 border-b border-zinc-200 dark:border-zinc-800 shrink-0 ${sidebarCollapsed ? 'justify-center' : ''}`}>
        <div className="w-8 h-8 rounded-lg bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 flex items-center justify-center font-extrabold text-sm shrink-0">
          Q
        </div>
        {!sidebarCollapsed && (
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-sm text-zinc-950 dark:text-white truncate">Questo</span>
            <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium">Enterprise 2.0</span>
          </div>
        )}
      </div>

      {/* Nav Sections */}
      <nav className="flex-1 overflow-y-auto py-3 px-2.5 space-y-5">
        {sections.map((section) => (
          <div key={section.title}>
            {!sidebarCollapsed && (
              <div className="px-2 mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                {section.title}
              </div>
            )}
            <div className="space-y-0.5">
              {section.links.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  end={link.path === '/app'}
                  onClick={() => setMobileMenuOpen(false)}
                  className={() =>
                    `group flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] font-medium transition-colors ${
                      isActivePath(link.path)
                        ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-950 dark:text-white'
                        : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-200'
                    } ${sidebarCollapsed ? 'justify-center' : ''}`
                  }
                  title={sidebarCollapsed ? link.label : undefined}
                >
                  <span className={`shrink-0 ${isActivePath(link.path) ? 'text-indigo-600 dark:text-indigo-400' : 'text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-600 dark:group-hover:text-zinc-300'}`}>
                    {link.icon}
                  </span>
                  {!sidebarCollapsed && <span className="truncate">{link.label}</span>}
                  {!sidebarCollapsed && link.badge !== undefined && link.badge > 0 && (
                    <span className="ml-auto px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-rose-500 text-white">
                      {link.badge}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom: Settings + Collapse */}
      <div className="border-t border-zinc-200 dark:border-zinc-800 px-2.5 py-2.5 space-y-0.5 shrink-0">
        <NavLink
          to="/app/settings"
          className={() =>
            `group flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] font-medium transition-colors ${
              isActivePath('/app/settings')
                ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-950 dark:text-white'
                : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-200'
            } ${sidebarCollapsed ? 'justify-center' : ''}`
          }
          title={sidebarCollapsed ? 'Settings' : undefined}
        >
          <Settings className={`w-4 h-4 shrink-0 ${isActivePath('/app/settings') ? 'text-indigo-600 dark:text-indigo-400' : 'text-zinc-400 dark:text-zinc-500'}`} />
          {!sidebarCollapsed && <span>Settings</span>}
        </NavLink>
        <button
          type="button"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className={`hidden lg:flex items-center gap-2.5 w-full px-2.5 py-2 rounded-lg text-[13px] font-medium text-zinc-400 dark:text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors ${sidebarCollapsed ? 'justify-center' : ''}`}
        >
          {sidebarCollapsed ? <PanelLeft className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
          {!sidebarCollapsed && <span>Collapse</span>}
        </button>
      </div>

      {/* User Card */}
      <div className="border-t border-zinc-200 dark:border-zinc-800 px-2.5 py-2.5 shrink-0">
        <div className="relative">
          <button
            type="button"
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className={`flex items-center gap-2.5 w-full px-2.5 py-2 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors ${sidebarCollapsed ? 'justify-center' : ''}`}
          >
            <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${user?.avatarColor || 'from-zinc-400 to-zinc-600'} flex items-center justify-center text-white text-[10px] font-bold shrink-0`}>
              {user?.initials || '?'}
            </div>
            {!sidebarCollapsed && (
              <div className="flex flex-col text-left min-w-0 flex-1">
                <span className="text-[13px] font-medium text-zinc-900 dark:text-white truncate">{user?.name}</span>
                <span className="text-[10px] text-zinc-400 dark:text-zinc-500 truncate">{user?.role?.replace('_', ' ')}</span>
              </div>
            )}
          </button>

          {/* User Dropdown */}
          {userMenuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
              <div className={`absolute z-50 bottom-full mb-1 ${sidebarCollapsed ? 'left-0' : 'left-0 right-0'} min-w-[180px] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl py-1`}>
                <div className="px-3 py-2 border-b border-zinc-100 dark:border-zinc-800">
                  <p className="text-xs font-medium text-zinc-900 dark:text-white">{user?.name}</p>
                  <p className="text-[10px] text-zinc-500 truncate">{user?.email}</p>
                </div>
                <button
                  onClick={() => { navigate('/'); setUserMenuOpen(false); }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-xs text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Back to Website
                </button>
                <button
                  onClick={() => { handleLogout(); setUserMenuOpen(false); }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 flex flex-col transition-all duration-200 ${
          sidebarCollapsed ? 'w-[60px]' : 'w-[240px]'
        } ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {sidebarContent}
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top Bar */}
        <header className="h-14 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex items-center justify-between px-4 lg:px-6 shrink-0 z-20">
          <div className="flex items-center gap-3">
            {/* Mobile hamburger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <PanelLeft className="w-4 h-4" />
            </button>

            {/* Search */}
            <div className="hidden sm:flex items-center gap-2 px-3 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 text-xs text-zinc-400 dark:text-zinc-500 w-64 cursor-pointer hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors">
              <Search className="w-3.5 h-3.5" />
              <span>Search anything...</span>
              <kbd className="ml-auto px-1.5 py-0.5 rounded text-[10px] font-mono bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">⌘K</kbd>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              title="Toggle theme"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Notifications */}
            <button
              type="button"
              className="relative w-8 h-8 flex items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500" />
            </button>

            {/* Quick AI Action */}
            <button
              type="button"
              className="hidden sm:flex items-center gap-1.5 px-3 h-8 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              AI Action
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

