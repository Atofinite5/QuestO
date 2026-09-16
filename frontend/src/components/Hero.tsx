import React, { useState } from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Zap, Terminal, Copy, Check, Users, Clock, TrendingUp, TrendingDown } from 'lucide-react';

interface HeroProps {
  onLaunchSandbox: () => void;
  onSubmitEod: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onLaunchSandbox, onSubmitEod }) => {
  const [copied, setCopied] = useState(false);
  const cloneCmd = 'git clone https://github.com/Atofinite5/QuestO.git';

  const handleCopy = () => {
    navigator.clipboard.writeText(cloneCmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="hero" className="relative pt-16 pb-16 overflow-hidden">
      {/* Background Radial Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[850px] h-[450px] bg-gradient-to-b from-indigo-500/15 via-purple-500/10 to-transparent blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-28 left-1/4 w-[350px] h-[350px] bg-cyan-500/10 blur-[100px] pointer-events-none -z-10" />
      
      {/* Background Grid Lines */}
      <div className="absolute inset-0 bg-grid-pattern bg-[size:32px_32px] opacity-30 dark:opacity-40 pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Release Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-100 dark:bg-white/[0.04] border border-zinc-200 dark:border-white/[0.1] backdrop-blur-md mb-8 hover:border-indigo-500/40 transition-colors">
          <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-ping" />
          <span className="text-xs font-medium text-zinc-700 dark:text-slate-300">
            Enterprise Release v2.7.0
          </span>
          <span className="text-zinc-400 dark:text-slate-500">•</span>
          <span className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold flex items-center gap-1">
            Real-Time Intern Daily EOD & CTO Blocker Sentinel
            <Sparkles className="w-3 h-3" />
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-zinc-950 dark:text-white mb-6 leading-[1.1]">
          Autonomous Engineering Leadership <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 dark:from-cyan-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
            & Operations Intelligence
          </span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-3xl mx-auto text-lg sm:text-xl text-zinc-600 dark:text-slate-300 font-normal leading-relaxed mb-10">
          Deconstruct founder vision into structured 4-week engineer roadmaps, 
          capture intern daily EOD accomplishments, and auto-escalate dependencies to the CTO 
          in real-time — orchestrated via <span className="text-zinc-950 dark:text-white font-medium">Google Sheets</span>, <span className="text-indigo-600 dark:text-indigo-400 font-medium">Gemini 2.5 Flash</span>, and <span className="text-cyan-600 dark:text-cyan-400 font-medium">n8n</span>.
        </p>

        {/* Primary CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <button
            onClick={onLaunchSandbox}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold text-base shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 group"
          >
            <span>Launch Live Control Center</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={onSubmitEod}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-zinc-100 dark:bg-white/[0.06] hover:bg-zinc-200 dark:hover:bg-white/[0.1] border border-zinc-200 dark:border-white/[0.12] text-zinc-900 dark:text-white font-semibold text-base backdrop-blur-md hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
          >
            <span>Submit Daily Intern EOD</span>
            <span className="text-xs bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 font-mono px-2 py-0.5 rounded-full border border-indigo-500/30">
              +20 XP
            </span>
          </button>
        </div>

        {/* Terminal Quick Deploy Command */}
        <div className="max-w-xl mx-auto mb-14">
          <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-zinc-900 dark:bg-[#0b0e17] border border-zinc-700 dark:border-white/[0.08] shadow-2xl">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-300 overflow-x-auto">
              <Terminal className="w-4 h-4 text-indigo-400 shrink-0" />
              <span className="text-slate-500">$</span>
              <span className="text-slate-200">{cloneCmd}</span>
            </div>
            <button
              onClick={handleCopy}
              className="ml-3 p-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-slate-400 hover:text-white transition-colors"
              title="Copy to clipboard"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Antigravity Spec: KPI Cards Row with Trend Indicators */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
          
          <div className="p-5 rounded-2xl bg-white dark:bg-[#0e111a] border border-zinc-200 dark:border-white/[0.08] shadow-sm dark:shadow-none hover:border-indigo-500/40 transition-all text-left">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-zinc-500 dark:text-slate-400">Gemini 2.5 Triage</span>
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                <TrendingDown className="w-3 h-3" />
                -34% lat
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-zinc-900 dark:text-white">15ms</span>
              <span className="text-xs text-zinc-400 dark:text-slate-500 font-mono">avg</span>
            </div>
            <p className="text-[11px] text-zinc-400 dark:text-slate-500 mt-1">Sub-second JSON inference</p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#0e111a] border border-zinc-200 dark:border-white/[0.08] shadow-sm dark:shadow-none hover:border-indigo-500/40 transition-all text-left">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-zinc-500 dark:text-slate-400">Blocker SLA</span>
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                <TrendingUp className="w-3 h-3" />
                100%
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-rose-500 dark:text-rose-400">&lt; 2.4h</span>
              <span className="text-xs text-zinc-400 dark:text-slate-500 font-mono">MTTR</span>
            </div>
            <p className="text-[11px] text-zinc-400 dark:text-slate-500 mt-1">Real-time CTO dispatch</p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#0e111a] border border-zinc-200 dark:border-white/[0.08] shadow-sm dark:shadow-none hover:border-indigo-500/40 transition-all text-left">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-zinc-500 dark:text-slate-400">Security Barrier</span>
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                <ShieldCheck className="w-3 h-3" />
                Passed
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">0 CWE</span>
              <span className="text-xs text-zinc-400 dark:text-slate-500 font-mono">CWE-1236</span>
            </div>
            <p className="text-[11px] text-zinc-400 dark:text-slate-500 mt-1">Formula neutralizer active</p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#0e111a] border border-zinc-200 dark:border-white/[0.08] shadow-sm dark:shadow-none hover:border-indigo-500/40 transition-all text-left">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-zinc-500 dark:text-slate-400">Sheets Sync</span>
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                <Users className="w-3 h-3" />
                Synced
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-cyan-600 dark:text-cyan-400">8 Tabs</span>
              <span className="text-xs text-zinc-400 dark:text-slate-500 font-mono">LockService</span>
            </div>
            <p className="text-[11px] text-zinc-400 dark:text-slate-500 mt-1">Multiplayer concurrency</p>
          </div>

        </div>

      </div>
    </section>
  );
};
