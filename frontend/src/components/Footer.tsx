import React from 'react';
import { ShieldCheck, Sparkles, ExternalLink } from 'lucide-react';
import { GithubIcon } from './GithubIcon';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-zinc-200 dark:border-white/[0.08] bg-white dark:bg-[#050609] py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        
        {/* Brand & Mission */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 via-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-sm">
            Q
          </div>
          <div>
            <div className="font-bold text-sm text-zinc-950 dark:text-white">Questo Enterprise</div>
            <div className="text-xs text-zinc-500 dark:text-slate-400">Autonomous Leadership & Operations Platform</div>
          </div>
        </div>

        {/* Security & Verification Badges */}
        <div className="flex items-center gap-4 text-xs font-mono text-zinc-600 dark:text-slate-400">
          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>CWE-1236 Hardened</span>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Gemini 2.5 Flash</span>
          </span>
          <span>•</span>
          <span>LockService Mutex</span>
        </div>

        {/* Links */}
        <div className="flex items-center gap-4 text-xs font-medium text-zinc-500 dark:text-slate-400">
          <a
            href="https://github.com/Atofinite5/QuestO"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-zinc-900 dark:hover:text-white transition-colors flex items-center gap-1"
          >
            <GithubIcon className="w-3.5 h-3.5" />
            <span>GitHub Repository</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

      </div>
    </footer>
  );
};
