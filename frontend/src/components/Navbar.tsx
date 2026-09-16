import React from 'react';
import { 
  Sparkles, Settings, AlertCircle, Sun, Moon, 
  Terminal, ArrowUpRight, Search 
} from 'lucide-react';
import { GithubIcon } from './GithubIcon';

interface NavbarProps {
  blockerCount: number;
  onOpenSettings: () => void;
  onOpenCommandPalette?: () => void;
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
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        
        {/* Left: Brand Identity */}
        <div 
          onClick={() => onScrollToSection('hero')} 
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-2xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 flex items-center justify-center font-extrabold text-sm shadow-sm transition-transform active:scale-95">
            Q
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base tracking-tight text-zinc-950 dark:text-white">Questo</span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 font-medium">
                v2.0
              </span>
            </div>
          </div>
        </div>

        {/* Center: Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-zinc-600 dark:text-zinc-300">
          <button
            type="button"
            onClick={() => onScrollToSection('hero')}
            className="px-3.5 py-2 rounded-full hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            Overview
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('eod');
              onScrollToSection('command-center');
            }}
            className={`px-3.5 py-2 rounded-full transition-colors relative focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
              activeTab === 'eod' 
                ? 'text-zinc-950 dark:text-white font-semibold' 
                : 'hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/60'
            }`}
          >
            <span>Blocker Desk</span>
            {blockerCount > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold">
                {blockerCount}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('roadmap');
              onScrollToSection('command-center');
            }}
            className={`px-3.5 py-2 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
              activeTab === 'roadmap' 
                ? 'text-zinc-950 dark:text-white font-semibold' 
                : 'hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/60'
            }`}
          >
            Roadmaps
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('applicants');
              onScrollToSection('command-center');
            }}
            className={`px-3.5 py-2 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
              activeTab === 'applicants' 
                ? 'text-zinc-950 dark:text-white font-semibold' 
                : 'hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/60'
            }`}
          >
            Talent
          </button>
          <button
            type="button"
            onClick={() => onScrollToSection('features')}
            className="px-3.5 py-2 rounded-full hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            Features
          </button>
          <button
            type="button"
            onClick={() => onScrollToSection('architecture')}
            className="px-3.5 py-2 rounded-full hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            Architecture
          </button>
        </nav>

        {/* Right: Actions & ADPList-Style Pill CTA */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Quick Command Launcher Button */}
          {onOpenCommandPalette && (
            <button
              type="button"
              onClick={onOpenCommandPalette}
              aria-label="Open Command Palette"
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800/80 dark:hover:bg-zinc-700/80 text-zinc-600 dark:text-zinc-300 text-xs font-medium transition-colors border border-zinc-200/80 dark:border-zinc-700/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              <Search className="w-3.5 h-3.5 text-zinc-400" />
              <span className="hidden sm:inline">Search actions</span>
              <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-500">
                ⌘K
              </kbd>
            </button>
          )}

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label="Toggle Theme"
            className="p-2 rounded-full text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Settings Modal */}
          <button
            type="button"
            onClick={onOpenSettings}
            aria-label="Open Settings"
            className="p-2 rounded-full text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* GitHub Icon */}
          <a
            href="https://github.com/Atofinite5/QuestO"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View Source on GitHub"
            className="p-2 rounded-full text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            <GithubIcon className="w-4 h-4" />
          </a>

          {/* ADPList Style Primary Pill CTA */}
          <button
            type="button"
            onClick={() => onScrollToSection('command-center')}
            className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 text-xs sm:text-sm font-semibold hover:opacity-90 transition-opacity shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            <span>Launch Workspace</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>

        </div>

      </div>
    </header>
  );
};
