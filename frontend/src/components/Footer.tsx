import React from 'react';
import { Heart, Shield, Terminal, ArrowUpRight } from 'lucide-react';
import { GithubIcon } from './GithubIcon';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/[0.08] bg-[#07080c] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-indigo-600 flex items-center justify-center font-extrabold text-sm text-white">
            Q
          </div>
          <div>
            <div className="text-sm font-bold text-white">Questo Enterprise 2.0</div>
            <div className="text-xs text-slate-400">Autonomous Leadership & Operations Platform</div>
          </div>
        </div>

        <div className="flex items-center gap-6 text-xs text-slate-400 font-medium">
          <a
            href="https://github.com/Atofinite5/QuestO"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors flex items-center gap-1"
          >
            <GithubIcon className="w-3.5 h-3.5" />
            <span>GitHub Repository</span>
            <ArrowUpRight className="w-3 h-3" />
          </a>
          <span className="text-slate-600">•</span>
          <span className="flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>Zero Formula Injection (CWE-1236)</span>
          </span>
          <span className="text-slate-600">•</span>
          <span>MIT License</span>
        </div>

        <div className="text-xs text-slate-500 font-mono">
          Engineered with React 19 SWC & Gemini 2.5 Flash
        </div>

      </div>
    </footer>
  );
};
