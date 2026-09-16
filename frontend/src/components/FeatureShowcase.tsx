import React from 'react';
import { 
  Bot, ShieldCheck, Database, Workflow, 
  Sparkles, Zap, Lock, RefreshCcw, BellRing, ArrowRight 
} from 'lucide-react';

export const FeatureShowcase: React.FC = () => {
  return (
    <section id="features" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-mono font-semibold uppercase tracking-wider mb-4 border border-indigo-500/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Bento Grid Architecture</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-semibold text-zinc-950 dark:text-white tracking-[-0.02em]">
          Built for Velocity, Concurrency & Security
        </h2>
        <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-300 mt-4 leading-relaxed">
          Questo combines serverless Google Apps Script, Gemini 2.5 Flash thinking heuristics, and n8n pipelines into an enterprise operational engine.
        </p>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Multi-Agent Triage (Spans 2 cols on md) */}
        <div className="md:col-span-2 p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm dark:shadow-2xl relative overflow-hidden group hover:border-indigo-500/40 transition-colors">
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 blur-[90px] pointer-events-none" />
          <div className="relative z-10 flex flex-col justify-between h-full">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 flex items-center justify-center mb-6">
                <Bot className="w-6 h-6" />
              </div>
              <span className="text-xs font-mono font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                Autonomous Triage
              </span>
              <h3 className="text-2xl font-bold text-zinc-950 dark:text-white mt-1 mb-3">
                Gemini 2.5 Flash Thinking Sentinel
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-xl">
                Every intern daily report is synthesized within 15ms. Gemini extracts latent roadblocks, scores sentiment, evaluates technical blockers, and suggests exact operational directives directly to the CTO.
              </p>
            </div>

            <div className="mt-8 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 font-mono text-xs text-zinc-700 dark:text-zinc-300">
              <div className="text-zinc-400 text-[10px] uppercase mb-1">Live Pipeline Payload:</div>
              <div className="text-indigo-600 dark:text-indigo-400">POST /api/eod/sentinel</div>
              <div className="text-zinc-500 dark:text-zinc-400 mt-1">
                {`{ "blocker": "Quota exceeded on Vertex API", "sentiment": "Frustrated", "urgency": "CRITICAL" }`}
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Security & CWE-1236 Neutralization */}
        <div className="p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm dark:shadow-2xl relative overflow-hidden group hover:border-indigo-500/40 transition-colors">
          <div className="absolute top-0 right-0 w-60 h-60 bg-emerald-500/10 blur-[80px] pointer-events-none" />
          <div className="relative z-10 flex flex-col justify-between h-full">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <span className="text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                Formula Injection Barrier
              </span>
              <h3 className="text-xl font-bold text-zinc-950 dark:text-white mt-1 mb-3">
                Zero CWE-1236 Vulnerabilities
              </h3>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                Inputs starting with <code className="text-rose-600 dark:text-rose-400 font-mono">= + - @</code> are stripped before spreadsheet insertion, preventing remote command execution in Google Sheets.
              </p>
            </div>

            <div className="mt-6 flex items-center gap-2 text-xs font-mono text-emerald-600 dark:text-emerald-400">
              <Lock className="w-4 h-4" />
              <span>Sanitization Barrier Active</span>
            </div>
          </div>
        </div>

        {/* Card 3: LockService Multiplayer Concurrency */}
        <div className="p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm dark:shadow-2xl relative overflow-hidden group hover:border-indigo-500/40 transition-colors">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 flex items-center justify-center mb-6">
            <RefreshCcw className="w-6 h-6" />
          </div>
          <span className="text-xs font-mono font-semibold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">
            High Concurrency
          </span>
          <h3 className="text-xl font-bold text-zinc-950 dark:text-white mt-1 mb-3">
            Apps Script LockService
          </h3>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
            Eliminates race conditions when 100+ interns submit daily standups at 5:00 PM simultaneously. Guaranteed single-threaded sheet mutation with 30s timeout fallbacks.
          </p>
        </div>

        {/* Card 4: n8n Event Orchestration (Spans 2 cols on md) */}
        <div className="md:col-span-2 p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm dark:shadow-2xl relative overflow-hidden group hover:border-indigo-500/40 transition-colors">
          <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 blur-[90px] pointer-events-none" />
          <div className="relative z-10 flex flex-col justify-between h-full">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 flex items-center justify-center mb-6">
                <Workflow className="w-6 h-6" />
              </div>
              <span className="text-xs font-mono font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                Event Fabric
              </span>
              <h3 className="text-2xl font-bold text-zinc-950 dark:text-white mt-1 mb-3">
                Decoupled n8n Automation Engine
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-xl">
                Connects Google Sheets triggers to Slack channels, Gmail notification queues, and automated Google Meet calendar appointments without bloating the core Apps Script execution limit.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-center">
                <div className="text-xs font-bold text-zinc-950 dark:text-white">Slack Webhooks</div>
                <div className="text-[10px] text-zinc-400 mt-0.5">Real-time alerts</div>
              </div>
              <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-center">
                <div className="text-xs font-bold text-zinc-950 dark:text-white">Gmail Dispatch</div>
                <div className="text-[10px] text-zinc-400 mt-0.5">Decisions & advice</div>
              </div>
              <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-center">
                <div className="text-xs font-bold text-zinc-950 dark:text-white">Google Meet</div>
                <div className="text-[10px] text-zinc-400 mt-0.5">Automated syncs</div>
              </div>
              <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-center">
                <div className="text-xs font-bold text-zinc-950 dark:text-white">Sheet Ledger</div>
                <div className="text-[10px] text-zinc-400 mt-0.5">8 Synced tabs</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
