import React from 'react';
import { Bell, Sparkles, Settings, ExternalLink, Sun, Moon, Search, Command } from 'lucide-react';
import { GithubIcon } from './GithubIcon';

interface NavbarProps {
  blockerCount: number;
  onOpenSettings: () => void;
  onOpenCommandPalette: () => void;
  onScrollToSection: (id: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  darkMode: boolean;
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  blockerCount,
  onOpenSettings,
  onOpenCommandPalette,
  onScrollToSection,
  activeTab,
  setActiveTab,
  darkMode,
  onToggleTheme
}) => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/80 dark:bg-zinc-950/85 border-b border-zinc-200 dark:border-zinc-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo - Semantic button */}
        <button 
          type="button"
          onClick={() => onScrollToSection('hero')}
          className="flex items-center gap-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-xl p-1"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 via-indigo-500 to-purple-600 flex items-center justify-center font-extrabold text-xl text-white shadow-lg shadow-indigo-500/25">
            Q
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-zinc-900 via-zinc-700 to-zinc-900 dark:from-white dark:via-zinc-200 dark:to-zinc-400 bg-clip-text text-transparent">
                Questo Enterprise
              </span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                v2.7.0
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 hidden sm:block">
              Autonomous Leadership & Ops Platform
            </p>
          </div>
        </button>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-600 dark:text-zinc-300">
          <button 
            type="button"
            onClick={() => { setActiveTab('eod'); onScrollToSection('command-center'); }} 
            className="hover:text-zinc-900 dark:hover:text-white transition-colors flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg px-2 py-1"
          >
            <span>Intern EOD Sentinel</span>
            {blockerCount > 0 && (
              <span className="bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full animate-pulse">
                {blockerCount}
              </span>
            )}
          </button>
          <button 
            type="button"
            onClick={() => { setActiveTab('roadmap'); onScrollToSection('command-center'); }} 
            className="hover:text-zinc-900 dark:hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg px-2 py-1"
          >
            Roadmap AI
          </button>
          <button 
            type="button"
            onClick={() => { setActiveTab('applicants'); onScrollToSection('command-center'); }} 
            className="hover:text-zinc-900 dark:hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg px-2 py-1"
          >
            Talent Pipeline
          </button>
          <button 
            type="button"
            onClick={() => onScrollToSection('features')} 
            className="hover:text-zinc-900 dark:hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg px-2 py-1"
          >
            Features
          </button>
          <button 
            type="button"
            onClick={() => onScrollToSection('architecture')} 
            className="hover:text-zinc-900 dark:hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg px-2 py-1"
          >
            Architecture
          </button>
        </nav>

        {/* Right CTA / Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* ⌘K Command Palette Quick Launcher */}
          <button
            type="button"
            onClick={onOpenCommandPalette}
            title="Open Command Palette (Cmd+K)"
            className="hidden lg:flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:border-indigo-500/40 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search actions</span>
            <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-300 dark:border-zinc-700">
              ⌘K
            </kbd>
          </button>

          {/* Gemini Health Status Pill */}
          <div className="hidden xl:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-600 dark:text-emerald-400 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Gemini 2.5 Flash Online</span>
          </div>

          {/* Theme Toggle (Sun/Moon) */}
          <button
            type="button"
            onClick={onToggleTheme}
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-zinc-700" />}
          </button>

          {/* CTO Alert Bell */}
          <button
            type="button"
            onClick={() => { setActiveTab('eod'); onScrollToSection('command-center'); }}
            title="CTO Blocker Alerts"
            className={`relative p-2 rounded-xl border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
              blockerCount > 0 
                ? 'bg-rose-500/15 border-rose-500/40 text-rose-600 dark:text-rose-300 hover:bg-rose-500/25' 
                : 'bg-zinc-100 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800'
            }`}
          >
            <Bell className="w-4 h-4" />
            {blockerCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ring-2 ring-white dark:ring-zinc-950 animate-bounce">
                {blockerCount}
              </span>
            )}
          </button>

          {/* Settings / Backend Connector */}
          <button
            type="button"
            onClick={onOpenSettings}
            title="Configure Backend Connection"
            className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* GitHub Link */}
          <a
            href="https://github.com/Atofinite5/QuestO"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-900 dark:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            <GithubIcon className="w-3.5 h-3.5" />
            <span>GitHub</span>
            <ExternalLink className="w-3 h-3 text-zinc-400" />
          </a>
        </div>

      </div>
    </header>
  );
};
