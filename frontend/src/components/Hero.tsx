import React, { useState } from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Zap, Terminal, Copy, Check, Users, Clock } from 'lucide-react';

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
    <section id="hero" className="relative pt-16 pb-20 overflow-hidden">
      {/* Background Radial Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[850px] h-[450px] bg-gradient-to-b from-indigo-500/20 via-purple-500/10 to-transparent blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-28 left-1/4 w-[350px] h-[350px] bg-cyan-500/15 blur-[100px] pointer-events-none -z-10" />
      
      {/* Background Grid Lines */}
      <div className="absolute inset-0 bg-grid-pattern bg-[size:32px_32px] opacity-40 pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Release Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.1] backdrop-blur-md mb-8 hover:border-indigo-500/40 transition-colors">
          <span className="flex h-2 w-2 rounded-full bg-indigo-400 animate-ping" />
          <span className="text-xs font-medium text-slate-300">
            Enterprise Release v2.7.0
          </span>
          <span className="text-slate-500">•</span>
          <span className="text-xs text-indigo-400 font-semibold flex items-center gap-1">
            Real-Time Intern Daily EOD & CTO Blocker Sentinel
            <Sparkles className="w-3 h-3" />
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.1]">
          Autonomous Engineering Leadership <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
            & Operations Intelligence
          </span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-3xl mx-auto text-lg sm:text-xl text-slate-300 font-normal leading-relaxed mb-10">
          Deconstruct founder vision into structured 4-week engineer roadmaps, 
          capture intern daily EOD accomplishments, and auto-escalate dependencies to the CTO 
          in real-time — orchestrated via <span className="text-white font-medium">Google Sheets</span>, <span className="text-indigo-400 font-medium">Gemini 2.5 Flash</span>, and <span className="text-cyan-400 font-medium">n8n</span>.
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
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.12] text-white font-semibold text-base backdrop-blur-md hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
          >
            <span>Submit Daily Intern EOD</span>
            <span className="text-xs bg-indigo-500/20 text-indigo-300 font-mono px-2 py-0.5 rounded-full border border-indigo-500/30">
              +20 XP
            </span>
          </button>
        </div>

        {/* Terminal Quick Deploy Command */}
        <div className="max-w-xl mx-auto mb-16">
          <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-[#0b0e17] border border-white/[0.08] shadow-2xl">
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

        {/* Live Operational Metrics Ticker */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-md">
            <div className="flex items-center justify-center gap-2 text-indigo-400 mb-1">
              <Zap className="w-4 h-4" />
              <span className="text-2xl font-bold font-mono">15ms</span>
            </div>
            <p className="text-xs text-slate-400 font-medium">Gemini 2.5 Flash Triage</p>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-md">
            <div className="flex items-center justify-center gap-2 text-rose-400 mb-1">
              <Clock className="w-4 h-4" />
              <span className="text-2xl font-bold font-mono">100%</span>
            </div>
            <p className="text-xs text-slate-400 font-medium">Real-Time Blocker Escalation</p>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-md">
            <div className="flex items-center justify-center gap-2 text-emerald-400 mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-2xl font-bold font-mono">0 CWE</span>
            </div>
            <p className="text-xs text-slate-400 font-medium">Formula Neutralization (CWE-1236)</p>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-md">
            <div className="flex items-center justify-center gap-2 text-cyan-400 mb-1">
              <Users className="w-4 h-4" />
              <span className="text-2xl font-bold font-mono">8 Tabs</span>
            </div>
            <p className="text-xs text-slate-400 font-medium">Synchronized Sheets Schema</p>
          </div>

        </div>

      </div>
    </section>
  );
};
