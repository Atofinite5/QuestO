import React, { useState } from 'react';
import { 
  Sparkles, Settings, Sun, Moon, 
  ArrowUpRight, Search, Menu, X 
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (action: () => void) => {
    action();
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/85 dark:bg-zinc-950/85 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[68px] flex items-center justify-between gap-4">
        
        {/* Left: Brand Identity */}
        <button
          type="button"
          onClick={() => onScrollToSection('hero')}
          className="flex items-center gap-3 p-1 -ml-1 rounded-2xl group text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          aria-label="Questo Home"
        >
          <div className="w-9 h-9 rounded-2xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 flex items-center justify-center font-extrabold text-sm shadow-sm transition-transform active:scale-95">
            Q
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-base tracking-tight text-zinc-950 dark:text-white">Questo</span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 font-medium">
              v2.0
            </span>
          </div>
        </button>

        {/* Center: Desktop Navigation Floating Pill */}
        <nav className="hidden md:flex items-center p-1 rounded-full bg-zinc-100/80 dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-zinc-800/80 text-xs font-medium text-zinc-600 dark:text-zinc-300">
          <button
            type="button"
            onClick={() => onScrollToSection('hero')}
            className="px-3.5 py-1.5 rounded-full hover:text-zinc-950 dark:hover:text-white hover:bg-white dark:hover:bg-zinc-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            Overview
          </button>
          
          <button
            type="button"
            onClick={() => {
              setActiveTab('eod');
              onScrollToSection('command-center');
            }}
            className={`px-3.5 py-1.5 rounded-full transition-colors flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
              activeTab === 'eod' 
                ? 'bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white font-semibold shadow-xs' 
                : 'hover:text-zinc-950 dark:hover:text-white hover:bg-white/60 dark:hover:bg-zinc-800/60'
            }`}
          >
            <span>Blocker Desk</span>
            {blockerCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-bold">
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
            className={`px-3.5 py-1.5 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
              activeTab === 'roadmap' 
                ? 'bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white font-semibold shadow-xs' 
                : 'hover:text-zinc-950 dark:hover:text-white hover:bg-white/60 dark:hover:bg-zinc-800/60'
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
            className={`px-3.5 py-1.5 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
              activeTab === 'applicants' 
                ? 'bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white font-semibold shadow-xs' 
                : 'hover:text-zinc-950 dark:hover:text-white hover:bg-white/60 dark:hover:bg-zinc-800/60'
            }`}
          >
            Talent
          </button>

          <button
            type="button"
            onClick={() => onScrollToSection('features')}
            className="px-3.5 py-1.5 rounded-full hover:text-zinc-950 dark:hover:text-white hover:bg-white dark:hover:bg-zinc-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            Features
          </button>

          <button
            type="button"
            onClick={() => onScrollToSection('architecture')}
            className="px-3.5 py-1.5 rounded-full hover:text-zinc-950 dark:hover:text-white hover:bg-white dark:hover:bg-zinc-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            Architecture
          </button>
        </nav>

        {/* Right: Actions & ADPList-Style Pill CTA */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          
          {/* Quick Command Launcher Button */}
          {onOpenCommandPalette && (
            <button
              type="button"
              onClick={onOpenCommandPalette}
              aria-label="Open Command Palette"
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 text-xs font-medium transition-colors border border-zinc-200/80 dark:border-zinc-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              <Search className="w-3.5 h-3.5 text-zinc-400" />
              <span className="hidden lg:inline">Search actions</span>
              <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-500">
                ⌘K
              </kbd>
            </button>
          )}

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label="Toggle Theme"
            className="p-2 rounded-full text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Settings Modal */}
          <button
            type="button"
            onClick={onOpenSettings}
            aria-label="Open Settings"
            className="p-2 rounded-full text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* GitHub Icon */}
          <a
            href="https://github.com/Atofinite5/QuestO"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View Source on GitHub"
            className="hidden sm:inline-flex p-2 rounded-full text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            <GithubIcon className="w-4 h-4" />
          </a>

          {/* ADPList Style Primary Pill CTA */}
          <button
            type="button"
            onClick={() => onScrollToSection('command-center')}
            className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 text-xs sm:text-sm font-semibold hover:opacity-90 transition-opacity shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 whitespace-nowrap"
          >
            <span>Launch Workspace</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>

          {/* Mobile Menu Hamburger Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
            className="md:hidden p-2 rounded-full text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

        </div>

      </div>

      {/* Mobile Drawer Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-200/80 dark:border-zinc-800/80 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl px-4 py-4 space-y-2 animate-fade-in shadow-xl">
          <button
            type="button"
            onClick={() => handleNavClick(() => onScrollToSection('hero'))}
            className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            Overview
          </button>

          <button
            type="button"
            onClick={() => handleNavClick(() => {
              setActiveTab('eod');
              onScrollToSection('command-center');
            })}
            className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors flex items-center justify-between focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            <span>Blocker Desk</span>
            {blockerCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold">
                {blockerCount} Alerts
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => handleNavClick(() => {
              setActiveTab('roadmap');
              onScrollToSection('command-center');
            })}
            className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            Founder ➔ CTO Roadmaps
          </button>

          <button
            type="button"
            onClick={() => handleNavClick(() => {
              setActiveTab('applicants');
              onScrollToSection('command-center');
            })}
            className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            Talent & Candidate Pipeline
          </button>

          <button
            type="button"
            onClick={() => handleNavClick(() => onScrollToSection('features'))}
            className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            Architecture Features
          </button>

          <div className="pt-2 border-t border-zinc-200/80 dark:border-zinc-800/80 flex items-center justify-between px-2">
            <a
              href="https://github.com/Atofinite5/QuestO"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
            >
              <GithubIcon className="w-3.5 h-3.5" />
              <span>GitHub Repository</span>
            </a>
            <span className="text-[11px] font-mono text-zinc-400">Questo v2.0</span>
          </div>
        </div>
      )}

    </header>
  );
};
