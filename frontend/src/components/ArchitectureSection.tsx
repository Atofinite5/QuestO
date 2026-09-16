import React from 'react';
import { Database, Bot, Workflow, Users, Shield, Cpu, Zap, Radio } from 'lucide-react';

export const ArchitectureSection: React.FC = () => {
  return (
    <section id="architecture" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-zinc-200 dark:border-zinc-800">
      
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs font-mono font-semibold uppercase tracking-wider mb-4 border border-cyan-500/20">
          <Cpu className="w-3.5 h-3.5" />
          <span>System Topology</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-semibold text-zinc-950 dark:text-white tracking-[-0.02em]">
          How Questo Orchestrates Autonomous Ops
        </h2>
        <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-300 mt-4 leading-relaxed">
          A four-tier operational fabric orchestrating intern reports, multi-agent AI triage, and executive dashboards.
        </p>
      </div>

      {/* Layer Stack Diagram */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-16">
        
        {/* Step 1 */}
        <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm relative text-left">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">LAYER 01</span>
            <Users className="w-4 h-4 text-zinc-400" />
          </div>
          <h4 className="font-bold text-base text-zinc-950 dark:text-white mb-2">Edge Ingestion</h4>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
            Interns and candidates interact via responsive React 19 UI or direct Web App endpoints.
          </p>
          <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 text-[11px] font-mono text-zinc-500">
            Latency: &lt; 20ms
          </div>
        </div>

        {/* Step 2 */}
        <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm relative text-left">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">LAYER 02</span>
            <Shield className="w-4 h-4 text-zinc-400" />
          </div>
          <h4 className="font-bold text-base text-zinc-950 dark:text-white mb-2">Lock & Sanitize</h4>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
            Google Apps Script LockService prevents concurrent row corruption; CWE-1236 sanitizer strips malicious prefixes.
          </p>
          <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
            0 Formula Exploits
          </div>
        </div>

        {/* Step 3 */}
        <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm relative text-left">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400">LAYER 03</span>
            <Bot className="w-4 h-4 text-zinc-400" />
          </div>
          <h4 className="font-bold text-base text-zinc-950 dark:text-white mb-2">Gemini 2.5 Inference</h4>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
            Flash thinking model extracts blockers, calculates risk indices, and returns structured JSON instructions.
          </p>
          <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 text-[11px] font-mono text-zinc-500">
            15ms Inference
          </div>
        </div>

        {/* Step 4 */}
        <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm relative text-left">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400">LAYER 04</span>
            <Workflow className="w-4 h-4 text-zinc-400" />
          </div>
          <h4 className="font-bold text-base text-zinc-950 dark:text-white mb-2">n8n Event Webhooks</h4>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
            Dispatches critical blockers to CTO Slack, logs ledger to Google Sheets, and issues Google Meet calendar invites.
          </p>
          <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 text-[11px] font-mono text-cyan-600 dark:text-cyan-400">
            Multi-Platform Sync
          </div>
        </div>

      </div>

      {/* Spreadsheet Tabs Inventory Table */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm dark:shadow-xl">
        <div className="flex items-center gap-2 mb-4">
          <Database className="w-4 h-4 text-indigo-500" />
          <h3 className="font-bold text-base text-zinc-950 dark:text-white">Active Google Sheets Schema Architecture</h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800">
            <div className="font-mono font-bold text-indigo-600 dark:text-indigo-400">1. Intern_Daily_EOD</div>
            <p className="text-[11px] text-zinc-500 mt-1">UpdateId, Timestamp, Name, Tasks, Challenges, Blockers, Plan, Sentiment</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800">
            <div className="font-mono font-bold text-emerald-600 dark:text-emerald-400">2. Intern_Directory</div>
            <p className="text-[11px] text-zinc-500 mt-1">InternId, Name, Email, Role, Status, TotalXP, Level, StreakDays</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800">
            <div className="font-mono font-bold text-purple-600 dark:text-purple-400">3. Applicants</div>
            <p className="text-[11px] text-zinc-500 mt-1">AppId, Timestamp, Name, Email, Role, Skills, ResumeLink, Decision</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800">
            <div className="font-mono font-bold text-cyan-600 dark:text-cyan-400">4. Meetings</div>
            <p className="text-[11px] text-zinc-500 mt-1">MeetId, Timestamp, Attendees, Title, Type, Duration, MeetUrl, Agenda</p>
          </div>
        </div>
      </div>

    </section>
  );
};
