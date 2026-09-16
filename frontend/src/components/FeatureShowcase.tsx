import React from 'react';
import { 
  ShieldAlert, Sparkles, Workflow, Database, CalendarCheck, 
  Award, Lock, Cpu, ArrowUpRight 
} from 'lucide-react';

export const FeatureShowcase: React.FC = () => {
  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-zinc-200 dark:border-white/[0.06]">
      
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-mono text-indigo-600 dark:text-indigo-400 mb-4">
          <Cpu className="w-3.5 h-3.5" />
          <span>Architected for High-Growth Tech Companies</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-zinc-950 dark:text-white tracking-tight mb-4">
          Engineered for Executive Clarity, <br />
          <span className="bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 dark:from-cyan-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
            Built for Developer Velocity
          </span>
        </h2>
        <p className="text-zinc-600 dark:text-slate-400 text-base leading-relaxed">
          From unstructured founder vision to real-time intern standup triage, Questo operates as an autonomous engineering operating system on top of your Google Workspace.
        </p>
      </div>

      {/* Bento Grid Layout (60/40 visual hierarchy) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Large Flagship Card 1: Real-time Blocker Sentinel (Span 7) */}
        <div className="md:col-span-7 p-8 rounded-3xl bg-white dark:bg-[#0e111a] border border-zinc-200 dark:border-white/[0.08] relative overflow-hidden group hover:border-indigo-500/40 transition-all shadow-sm dark:shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none -z-0" />
          
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 dark:text-rose-400 mb-6">
              <ShieldAlert className="w-6 h-6" />
            </div>

            <h3 className="text-2xl font-bold text-zinc-950 dark:text-white mb-3">
              Real-Time Daily EOD & Blocker Sentinel
            </h3>
            <p className="text-zinc-600 dark:text-slate-400 text-sm leading-relaxed mb-6">
              Interns submit tasks completed, challenges overcome, and blockers faced. Gemini 2.5 Flash evaluates sentiment, flags critical operational risks, and immediately triggers visual alerts and direct emails to the CTO.
            </p>

            {/* Visual Mini Mockup */}
            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-[#07090e] border border-zinc-200 dark:border-white/[0.06] text-xs font-mono space-y-2">
              <div className="flex items-center justify-between text-rose-600 dark:text-rose-400 font-semibold pb-2 border-b border-zinc-200 dark:border-white/[0.06]">
                <span>🚨 CTO Real-Time Alert</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-700 dark:text-rose-300">P0 Dependency</span>
              </div>
              <div className="text-zinc-700 dark:text-slate-300">
                <span className="text-zinc-400 dark:text-slate-500">Intern:</span> Rohan Sharma
              </div>
              <div className="text-zinc-700 dark:text-slate-300">
                <span className="text-zinc-400 dark:text-slate-500">Blocker:</span> Vertex AI API quota bottleneck on image pipeline
              </div>
              <div className="text-emerald-600 dark:text-emerald-400">
                <span className="text-zinc-400 dark:text-slate-500">Action:</span> Instant 1-on-1 sync scheduled with CTO
              </div>
            </div>
          </div>
        </div>

        {/* Medium Card 2: Founder to CTO Roadmap Decomposer (Span 5) */}
        <div className="md:col-span-5 p-8 rounded-3xl bg-white dark:bg-[#0e111a] border border-zinc-200 dark:border-white/[0.08] relative overflow-hidden group hover:border-indigo-500/40 transition-all shadow-sm dark:shadow-2xl">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-6">
            <Sparkles className="w-6 h-6" />
          </div>

          <h3 className="text-2xl font-bold text-zinc-950 dark:text-white mb-3">
            Founder ➔ CTO Decomposer
          </h3>
          <p className="text-zinc-600 dark:text-slate-400 text-sm leading-relaxed mb-6">
            Transform high-level executive concepts into a 4-week engineer roadmap with tickets, XP bounties, and auto-generated intern sheets.
          </p>

          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-[#07090e] border border-zinc-200 dark:border-white/[0.06] text-xs font-mono space-y-2">
            <div className="flex items-center justify-between text-indigo-600 dark:text-indigo-400 font-semibold">
              <span>Week 1 Milestone</span>
              <span className="text-amber-500">+250 XP</span>
            </div>
            <div className="text-zinc-700 dark:text-slate-300">Architecture & LangChain harness</div>
            <div className="text-zinc-400 dark:text-slate-500 text-[11px]">3 tickets • Auto-provisioned</div>
          </div>
        </div>

        {/* Medium Card 3: Enterprise CWE-1236 Security Barrier (Span 5) */}
        <div className="md:col-span-5 p-8 rounded-3xl bg-white dark:bg-[#0e111a] border border-zinc-200 dark:border-white/[0.08] relative overflow-hidden group hover:border-indigo-500/40 transition-all shadow-sm dark:shadow-2xl">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-6">
            <Lock className="w-6 h-6" />
          </div>

          <h3 className="text-2xl font-bold text-zinc-950 dark:text-white mb-3">
            CWE-1236 Formula Defense
          </h3>
          <p className="text-zinc-600 dark:text-slate-400 text-sm leading-relaxed mb-6">
            Every cell write to Google Sheets is sanitized against formula injection attacks (=, +, -, @, tabs). 100% defense against remote command execution.
          </p>

          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-[#07090e] border border-zinc-200 dark:border-white/[0.06] text-xs font-mono text-emerald-600 dark:text-emerald-400">
            ✓ FormulaSanitizer.sanitizeFormula() active on all 8 tabs
          </div>
        </div>

        {/* Large Flagship Card 4: Multi-Agent Orchestration & Sheets (Span 7) */}
        <div className="md:col-span-7 p-8 rounded-3xl bg-white dark:bg-[#0e111a] border border-zinc-200 dark:border-white/[0.08] relative overflow-hidden group hover:border-indigo-500/40 transition-all shadow-sm dark:shadow-2xl">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-600 dark:text-cyan-400 mb-6">
            <Workflow className="w-6 h-6" />
          </div>

          <h3 className="text-2xl font-bold text-zinc-950 dark:text-white mb-3">
            Google Sheets as Multiplayer Enterprise DB
          </h3>
          <p className="text-zinc-600 dark:text-slate-400 text-sm leading-relaxed mb-6">
            Eliminates multi-thousand dollar SaaS fees by using Google Sheets with LockService concurrency control as your live operational database. Seamlessly connected to n8n automation pipelines and Gmail.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center font-mono text-xs">
            <div className="p-3 rounded-xl bg-zinc-50 dark:bg-[#07090e] border border-zinc-200 dark:border-white/[0.06]">
              <div className="text-indigo-600 dark:text-indigo-400 font-bold">10s Mutex</div>
              <div className="text-zinc-500 dark:text-slate-400 text-[10px]">LockService</div>
            </div>
            <div className="p-3 rounded-xl bg-zinc-50 dark:bg-[#07090e] border border-zinc-200 dark:border-white/[0.06]">
              <div className="text-cyan-600 dark:text-cyan-400 font-bold">8 Tabs</div>
              <div className="text-zinc-500 dark:text-slate-400 text-[10px]">Auto-Migrated</div>
            </div>
            <div className="p-3 rounded-xl bg-zinc-50 dark:bg-[#07090e] border border-zinc-200 dark:border-white/[0.06]">
              <div className="text-emerald-600 dark:text-emerald-400 font-bold">n8n Hook</div>
              <div className="text-zinc-500 dark:text-slate-400 text-[10px]">Auto Dispatch</div>
            </div>
            <div className="p-3 rounded-xl bg-zinc-50 dark:bg-[#07090e] border border-zinc-200 dark:border-white/[0.06]">
              <div className="text-purple-600 dark:text-purple-400 font-bold">0$/mo DB</div>
              <div className="text-zinc-500 dark:text-slate-400 text-[10px]">Google Cloud</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
