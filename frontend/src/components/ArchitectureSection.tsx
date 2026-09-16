import React from 'react';
import { Layers, ArrowRight, Shield, Terminal, Cpu, Database, Network } from 'lucide-react';

export const ArchitectureSection: React.FC = () => {
  return (
    <section id="architecture" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-zinc-200 dark:border-white/[0.06]">
      
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-mono text-cyan-600 dark:text-cyan-400 mb-4">
          <Network className="w-3.5 h-3.5" />
          <span>System Topology & Event Flow</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-950 dark:text-white tracking-tight mb-4">
          Decoupled, Resilient, <br />
          <span className="bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 dark:from-cyan-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
            Enterprise Cloud Architecture
          </span>
        </h2>
        <p className="text-zinc-600 dark:text-slate-400 text-sm leading-relaxed">
          Questo combines the simplicity and real-time multiplayer collaboration of Google Sheets with the power of Gemini 2.5 Flash, React 19 SWC frontend, and n8n workflow agents.
        </p>
      </div>

      {/* Visual Architecture Topology Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-12">
        
        <div className="p-5 rounded-2xl bg-white dark:bg-[#0e111a] border border-zinc-200 dark:border-white/[0.08] shadow-sm dark:shadow-lg space-y-3">
          <div className="text-xs font-mono text-cyan-600 dark:text-cyan-400 font-bold uppercase tracking-wider">
            Layer 1 • Client
          </div>
          <h4 className="text-base font-bold text-zinc-950 dark:text-white">React 19 + SWC Frontend</h4>
          <p className="text-xs text-zinc-600 dark:text-slate-400">
            Ultra-fast browser interface with instantaneous HMR, offline simulation fallback, and live Google Apps Script REST connectivity.
          </p>
          <div className="text-[11px] font-mono text-zinc-400 dark:text-slate-500">
            Vite • Tailwind • Lucide • TypeScript
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#0e111a] border border-indigo-200 dark:border-indigo-500/30 shadow-sm dark:shadow-lg space-y-3">
          <div className="text-xs font-mono text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider">
            Layer 2 • Brain
          </div>
          <h4 className="text-base font-bold text-zinc-950 dark:text-white">Gemini 2.5 Flash</h4>
          <p className="text-xs text-zinc-600 dark:text-slate-400">
            Sub-second inference for 4-week milestone decomposition, standup sentiment triage, risk extraction, and executive advice.
          </p>
          <div className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400">
            Temperature 0.2 • JSON Schema Mode
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#0e111a] border border-zinc-200 dark:border-white/[0.08] shadow-sm dark:shadow-lg space-y-3">
          <div className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">
            Layer 3 • Database
          </div>
          <h4 className="text-base font-bold text-zinc-950 dark:text-white">Google Sheets Engine</h4>
          <p className="text-xs text-zinc-600 dark:text-slate-400">
            8 synchronized tabs with LockService concurrency control and CWE-1236 formula sanitization protecting all cell modifications.
          </p>
          <div className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
            Zero DB Hosting Fees • Single Source of Truth
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#0e111a] border border-zinc-200 dark:border-white/[0.08] shadow-sm dark:shadow-lg space-y-3">
          <div className="text-xs font-mono text-purple-600 dark:text-purple-400 font-bold uppercase tracking-wider">
            Layer 4 • Automations
          </div>
          <h4 className="text-base font-bold text-zinc-950 dark:text-white">n8n Workflow Hub</h4>
          <p className="text-xs text-zinc-600 dark:text-slate-400">
            Multi-agent autonomous triggers dispatching Slack notifications, candidate offer letters, and calendar agendas.
          </p>
          <div className="text-[11px] font-mono text-purple-600 dark:text-purple-400">
            Event Hooks • Gmail • Google Calendar
          </div>
        </div>

      </div>

      {/* 8-Tab Data Schema Architecture */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#0e111a] border border-zinc-200 dark:border-white/[0.08] shadow-sm dark:shadow-xl">
        <h4 className="text-base font-bold text-zinc-950 dark:text-white mb-2 flex items-center gap-2">
          <Database className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Synchronized 8-Tab Operational Data Model</span>
        </h4>
        <p className="text-xs text-zinc-600 dark:text-slate-400 mb-6">
          Every table in your Google Sheet is strictly formatted with typed headers and automated formula protections.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          {[
            { tab: 'Employees', desc: 'Hierarchy, XP, PII, Roles' },
            { tab: 'All Tasks', desc: 'Sprint tickets, milestones, bounties' },
            { tab: 'Daily Standups', desc: 'EOD history, sentiment, CTO reviews' },
            { tab: 'Candidate Pipeline', desc: 'Resumes, scores, offer status' },
            { tab: 'Calendar', desc: 'Google Meet URLs, attendee agendas' },
            { tab: 'Leave Requests', desc: 'Approval workflows & balance' },
            { tab: 'Analytics', desc: 'Velocity scores & performance coaching' },
            { tab: 'Settings', desc: 'Gemini keys, webhook endpoints' },
          ].map((item, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-zinc-50 dark:bg-[#07090e] border border-zinc-200 dark:border-white/[0.06] space-y-1">
              <div className="font-bold text-zinc-900 dark:text-white font-mono flex items-center gap-1">
                <span className="text-indigo-500">#</span>
                <span>{item.tab}</span>
              </div>
              <div className="text-[11px] text-zinc-500 dark:text-slate-400">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
};
