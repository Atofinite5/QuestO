import React from 'react';
import { Bell, Sparkles, Settings, ExternalLink } from 'lucide-react';
import { GithubIcon } from './GithubIcon';

interface NavbarProps {
  blockerCount: number;
  onOpenSettings: () => void;
  onScrollToSection: (id: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  blockerCount,
  onOpenSettings,
  onScrollToSection,
  setActiveTab
}) => {
  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-[#07080c]/80 border-b border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onScrollToSection('hero')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 via-indigo-500 to-purple-600 flex items-center justify-center font-extrabold text-xl text-white shadow-lg shadow-indigo-500/25">
            Q
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                Questo Enterprise
              </span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                v2.7.0
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Autonomous Leadership & Ops Platform
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <button 
            onClick={() => { setActiveTab('eod'); onScrollToSection('command-center'); }} 
            className="hover:text-white transition-colors flex items-center gap-1.5"
          >
            <span>Intern EOD Sentinel</span>
            {blockerCount > 0 && (
              <span className="bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full animate-pulse">
                {blockerCount}
              </span>
            )}
          </button>
          <button 
            onClick={() => { setActiveTab('roadmap'); onScrollToSection('command-center'); }} 
            className="hover:text-white transition-colors"
          >
            Roadmap AI
          </button>
          <button 
            onClick={() => { setActiveTab('applicants'); onScrollToSection('command-center'); }} 
            className="hover:text-white transition-colors"
          >
            Talent Pipeline
          </button>
          <button 
            onClick={() => onScrollToSection('features')} 
            className="hover:text-white transition-colors"
          >
            Features
          </button>
          <button 
            onClick={() => onScrollToSection('architecture')} 
            className="hover:text-white transition-colors"
          >
            Architecture
          </button>
        </nav>

        {/* Right CTA / Controls */}
        <div className="flex items-center gap-3">
          {/* Gemini Health Status Pill */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Gemini 2.5 Flash Online</span>
          </div>

          {/* CTO Alert Bell */}
          <button
            onClick={() => { setActiveTab('eod'); onScrollToSection('command-center'); }}
            title="CTO Blocker Alerts"
            className={`relative p-2 rounded-lg border transition-all ${
              blockerCount > 0 
                ? 'bg-rose-500/15 border-rose-500/40 text-rose-300 hover:bg-rose-500/25' 
                : 'bg-white/[0.04] border-white/[0.08] text-slate-300 hover:bg-white/[0.08]'
            }`}
          >
            <Bell className="w-4 h-4" />
            {blockerCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ring-2 ring-[#07080c] animate-bounce">
                {blockerCount}
              </span>
            )}
          </button>

          {/* Settings / Backend Connector */}
          <button
            onClick={onOpenSettings}
            title="Configure Backend Connection"
            className="p-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-slate-300 hover:bg-white/[0.08] transition-colors"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* GitHub Link */}
          <a
            href="https://github.com/Atofinite5/QuestO"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] text-xs font-semibold text-white transition-colors"
          >
            <GithubIcon className="w-3.5 h-3.5" />
            <span>GitHub</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>
        </div>

      </div>
    </header>
  );
};
