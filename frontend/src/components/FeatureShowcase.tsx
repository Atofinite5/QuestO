import React from 'react';
import { 
  ShieldAlert, Sparkles, Workflow, Database, CalendarCheck, 
  Award, Lock, Cpu, ArrowUpRight 
} from 'lucide-react';

export const FeatureShowcase: React.FC = () => {
  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/[0.06]">
      
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-mono text-indigo-400 mb-4">
          <Cpu className="w-3.5 h-3.5" />
          <span>Architected for High-Growth Tech Companies</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
          Engineered for Executive Clarity, <br />
          <span className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Built for Developer Velocity
          </span>
        </h2>
        <p className="text-slate-400 text-base leading-relaxed">
          From unstructured founder vision to real-time intern standup triage, Questo operates as an autonomous engineering operating system on top of your Google Workspace.
        </p>
      </div>

      {/* Bento Grid Layout (60/40 visual hierarchy) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Large Flagship Card 1: Real-time Blocker Sentinel (Span 7) */}
        <div className="md:col-span-7 p-8 rounded-3xl bg-[#0e111a] border border-white/[0.08] relative overflow-hidden group hover:border-indigo-500/40 transition-all shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none -z-0" />
          
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-6">
              <ShieldAlert className="w-6 h-6" />
            </div>

            <h3 className="text-2xl font-bold text-white mb-3">
              Real-Time Daily EOD & Blocker Sentinel
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Interns submit tasks completed, challenges overcome, and blockers faced. Gemini 2.5 Flash evaluates sentiment, flags critical operational risks, and immediately triggers visual alerts and direct emails to the CTO.
            </p>

            {/* Visual Mini Mockup */}
            <div className="p-4 rounded-2xl bg-[#07090e] border border-white/[0.06] text-xs font-mono space-y-2">
              <div className="flex items-center justify-between text-rose-400 font-semibold pb-2 border-b border-white/[0.06]">
                <span>🚨 CTO Real-Time Alert</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300">P0 Dependency</span>
              </div>
              <div className="text-slate-300">
                <span className="text-indigo-400">Intern:</span> Rohan Sharma (rohan.intern@company.com)
              </div>
              <div className="text-slate-300">
                <span className="text-rose-400">Blocker:</span> Vertex AI quota exhausted on testing cluster
              </div>
              <div className="text-emerald-400 pt-1">
                ✔ Resolution: Instant 1-on-1 Google Meet sync dispatched + quota unblocked
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Founder -> CTO AI Roadmap Decomposer (Span 5) */}
        <div className="md:col-span-5 p-8 rounded-3xl bg-[#0e111a] border border-white/[0.08] relative overflow-hidden group hover:border-indigo-500/40 transition-all shadow-2xl flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -z-0" />
          
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-6">
              <Sparkles className="w-6 h-6" />
            </div>

            <h3 className="text-2xl font-bold text-white mb-3">
              AI Work Scraper & Decomposer
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Paste raw founder voice notes or specs. Gemini 2.5 Flash generates a milestone-driven 4-week engineer roadmap with tickets, XP bounties, and auto-provisions a dedicated Google Sheet tab.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[#07090e] border border-white/[0.06] text-xs font-mono text-indigo-300 flex items-center justify-between">
            <span>Milestones: 4 Weeks Structured</span>
            <span className="text-emerald-400 font-bold">+900 XP Bounties</span>
          </div>
        </div>

        {/* Card 3: Zero Formula Injection Security (Span 4) */}
        <div className="md:col-span-4 p-8 rounded-3xl bg-[#0e111a] border border-white/[0.08] relative overflow-hidden group hover:border-indigo-500/40 transition-all shadow-2xl">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6">
            <Lock className="w-6 h-6" />
          </div>

          <h3 className="text-xl font-bold text-white mb-2">
            Zero Formula Injection (CWE-1236)
          </h3>
          <p className="text-slate-400 text-sm leading-relaxed mb-4">
            Neutralizes dangerous formula prefixes (<code className="text-indigo-300">=, +, -, @, \t, \r, |</code>) across all user inputs before writing to Google Sheets.
          </p>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400">
            <span>STRIDE Hardened & Tested</span>
          </span>
        </div>

        {/* Card 4: Talent Pipeline with One-Click Decisions (Span 4) */}
        <div className="md:col-span-4 p-8 rounded-3xl bg-[#0e111a] border border-white/[0.08] relative overflow-hidden group hover:border-indigo-500/40 transition-all shadow-2xl">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-6">
            <Database className="w-6 h-6" />
          </div>

          <h3 className="text-xl font-bold text-white mb-2">
            Talent Ingestion & Fast-Track
          </h3>
          <p className="text-slate-400 text-sm leading-relaxed mb-4">
            Review candidate resumes, trigger fast-track selections or polite feedback, and automatically dispatch tailored Gmail offer packages in seconds.
          </p>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-400">
            <span>Integrated Gmail Dispatch</span>
          </span>
        </div>

        {/* Card 5: Gamification Engine & Leaderboards (Span 4) */}
        <div className="md:col-span-4 p-8 rounded-3xl bg-[#0e111a] border border-white/[0.08] relative overflow-hidden group hover:border-indigo-500/40 transition-all shadow-2xl">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-6">
            <Award className="w-6 h-6" />
          </div>

          <h3 className="text-xl font-bold text-white mb-2">
            XP Engine & Quadratic Leveling
          </h3>
          <p className="text-slate-400 text-sm leading-relaxed mb-4">
            Keep engineering teams engaged with task XP, daily standup streaks, milestone badges, and autonomous org hierarchy recalculation.
          </p>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-400">
            <span>Level = floor(sqrt(XP / 50)) + 1</span>
          </span>
        </div>

      </div>

    </section>
  );
};
