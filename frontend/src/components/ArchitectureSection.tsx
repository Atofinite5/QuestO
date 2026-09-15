import React from 'react';
import { Layers, ArrowRight, Shield, Terminal, Cpu, Database, Network } from 'lucide-react';

export const ArchitectureSection: React.FC = () => {
  return (
    <section id="architecture" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/[0.06]">
      
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-mono text-cyan-400 mb-4">
          <Network className="w-3.5 h-3.5" />
          <span>System Topology & Event Flow</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
          Decoupled, Resilient, <br />
          <span className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Enterprise Cloud Architecture
          </span>
        </h2>
        <p className="text-slate-400 text-sm leading-relaxed">
          Questo combines the simplicity and real-time multiplayer collaboration of Google Sheets with the power of Gemini 2.5 Flash, React 19 SWC frontend, and n8n workflow agents.
        </p>
      </div>

      {/* Visual Architecture Topology Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-12">
        
        <div className="p-5 rounded-2xl bg-[#0e111a] border border-white/[0.08] shadow-lg space-y-3">
          <div className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
            Layer 1 • Client
          </div>
          <h4 className="text-base font-bold text-white">React 19 + SWC Frontend</h4>
          <p className="text-xs text-slate-400">
            Ultra-fast browser interface with instantaneous HMR, offline simulation fallback, and live Google Apps Script REST connectivity.
          </p>
          <div className="text-[11px] font-mono text-slate-500">
            Vite • Tailwind • Lucide • TypeScript
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0e111a] border border-indigo-500/30 shadow-lg space-y-3">
          <div className="text-xs font-mono text-indigo-400 font-bold uppercase tracking-wider">
            Layer 2 • Brain
          </div>
          <h4 className="text-base font-bold text-white">Gemini 2.5 Flash</h4>
          <p className="text-xs text-slate-400">
            Sub-second inference for 4-week milestone decomposition, standup sentiment triage, risk extraction, and executive advice.
          </p>
          <div className="text-[11px] font-mono text-indigo-400">
            Temperature 0.2 • JSON Schema Mode
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0e111a] border border-white/[0.08] shadow-lg space-y-3">
          <div className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
            Layer 3 • Database
          </div>
          <h4 className="text-base font-bold text-white">Google Sheets (8 Tabs)</h4>
          <p className="text-xs text-slate-400">
            Multiplayer relational single source of truth for company tasks, standups, candidate pipeline, and org hierarchy.
          </p>
          <div className="text-[11px] font-mono text-emerald-400">
            LockService • Zero Formula Injection
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0e111a] border border-white/[0.08] shadow-lg space-y-3">
          <div className="text-xs font-mono text-purple-400 font-bold uppercase tracking-wider">
            Layer 4 • Automation
          </div>
          <h4 className="text-base font-bold text-white">n8n Multi-Agent Bus</h4>
          <p className="text-xs text-slate-400">
            Event-driven webhooks for Slack blocker escalation bots, calendar synchronization, and weekly executive digests.
          </p>
          <div className="text-[11px] font-mono text-purple-400">
            Outbound Webhook Dispatcher
          </div>
        </div>

      </div>

      {/* Synchronized Sheets Schema Table */}
      <div className="p-6 rounded-2xl bg-[#0e111a] border border-white/[0.08] shadow-xl">
        <h4 className="text-base font-bold text-white mb-4">
          Synchronized 8-Tab Google Sheets Data Schema
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-[#07090e] border border-white/[0.06]">
            <span className="font-bold text-indigo-400">🏆 Employees & Org</span>
            <p className="text-slate-400 text-[11px] mt-1">XP, level, role, department, manager hierarchy</p>
          </div>
          <div className="p-3 rounded-xl bg-[#07090e] border border-white/[0.06]">
            <span className="font-bold text-emerald-400">📋 All Tasks</span>
            <p className="text-slate-400 text-[11px] mt-1">Priority, state transitions, reviewer, blocker flags</p>
          </div>
          <div className="p-3 rounded-xl bg-[#07090e] border border-white/[0.06]">
            <span className="font-bold text-rose-400">⏱️ Daily Standups</span>
            <p className="text-slate-400 text-[11px] mt-1">Tasks, challenges, blockers, CTO review status</p>
          </div>
          <div className="p-3 rounded-xl bg-[#07090e] border border-white/[0.06]">
            <span className="font-bold text-cyan-400">💼 Candidate Pipeline</span>
            <p className="text-slate-400 text-[11px] mt-1">Resumes, skills, decision status, feedback notes</p>
          </div>
          <div className="p-3 rounded-xl bg-[#07090e] border border-white/[0.06]">
            <span className="font-bold text-amber-400">📅 Calendar & Meets</span>
            <p className="text-slate-400 text-[11px] mt-1">Google Meet links, attendee invites, agendas</p>
          </div>
          <div className="p-3 rounded-xl bg-[#07090e] border border-white/[0.06]">
            <span className="font-bold text-purple-400">🏖️ Leave Requests</span>
            <p className="text-slate-400 text-[11px] mt-1">PTO dates, streak-freezing, coverage delegation</p>
          </div>
          <div className="p-3 rounded-xl bg-[#07090e] border border-white/[0.06]">
            <span className="font-bold text-blue-400">📈 Analytics & Health</span>
            <p className="text-slate-400 text-[11px] mt-1">Reliability %, blocker resolution, burnout risk</p>
          </div>
          <div className="p-3 rounded-xl bg-[#07090e] border border-white/[0.06]">
            <span className="font-bold text-slate-300">⚙️ Settings & Keys</span>
            <p className="text-slate-400 text-[11px] mt-1">Gemini API credentials and n8n webhook URLs</p>
          </div>
        </div>
      </div>

    </section>
  );
};
