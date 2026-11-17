import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowUpRight, Star, ShieldCheck, Sparkles, Check, 
  Bot, Clock, Users, Database, Layers, Flame, Search
} from 'lucide-react';

interface HeroProps {
  onLaunchSandbox?: () => void;
  onSubmitEod?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onLaunchSandbox, onSubmitEod }) => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = [
    'All',
    'Engineering',
    'AI Systems',
    'Roadmaps',
    'Talent Pipeline',
    '1-on-1 Meets',
    'Architecture'
  ];

  // ADPList style mentor/intern leader showcase cards
  const leaders = [
    {
      name: 'Rohan Sharma',
      role: 'AI Systems Engineering Intern',
      company: 'Questo Labs',
      rating: '4.9',
      reviews: '48 reports',
      sessions: '14 day streak',
      avatarColor: 'from-blue-500 to-indigo-600',
      initials: 'RS',
      status: 'Blocked on Vertex Quota',
      hasBlocker: true,
      tag: 'PyTorch • LangChain'
    },
    {
      name: 'Ananya Verma',
      role: 'Full-Stack Lead Intern',
      company: 'Ex-Google Fellow',
      rating: '5.0',
      reviews: '62 reports',
      sessions: '21 day streak',
      avatarColor: 'from-purple-500 to-pink-600',
      initials: 'AV',
      status: 'All PRs Merged',
      hasBlocker: false,
      tag: 'React 19 • Apps Script'
    },
    {
      name: 'Devansh Kulkarni',
      role: 'Infrastructure & Data Intern',
      company: 'QuestO Core',
      rating: '4.8',
      reviews: '39 reports',
      sessions: '11 day streak',
      avatarColor: 'from-emerald-500 to-teal-600',
      initials: 'DK',
      status: 'Reviewing ScaNN Vector Eval',
      hasBlocker: false,
      tag: 'BigQuery • n8n'
    }
  ];

  return (
    <section id="hero" className="pt-16 sm:pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
      
      {/* Social Proof Star Rating Badge (ADPList Style) */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-700 dark:text-zinc-300 font-medium mb-8 animate-fade-in">
        <div className="flex items-center text-amber-500">
          <Star className="w-3.5 h-3.5 fill-current" />
          <Star className="w-3.5 h-3.5 fill-current" />
          <Star className="w-3.5 h-3.5 fill-current" />
          <Star className="w-3.5 h-3.5 fill-current" />
          <Star className="w-3.5 h-3.5 fill-current" />
        </div>
        <span className="font-semibold text-zinc-950 dark:text-white">4.9 out of 5</span>
        <span className="text-zinc-400">•</span>
        <span>Synchronized with 8 Google Sheets Tabs</span>
      </div>

      {/* Main Big Headline (ADPList Style: text-5xl to text-7xl, leading-[1.08]) */}
      <h1 className="text-4xl sm:text-6xl lg:text-[72px] font-semibold tracking-[-0.03em] text-zinc-950 dark:text-white leading-[1.08] max-w-4xl mx-auto">
        Autonomous engineering leadership for your team.
      </h1>

      {/* Subhead (ADPList Style: text-lg to text-xl, warm gray, max-w-2xl) */}
      <p className="mt-5 text-lg sm:text-xl text-zinc-600 dark:text-zinc-300 font-normal leading-relaxed max-w-2xl mx-auto">
        Turn daily blocker chaos into forward momentum. Deconstruct milestones with Gemini 2.5 Flash, resolve engineering hurdles, and automate ops across your entire workspace.
      </p>

      {/* Primary Action Buttons (ADPList Pill Button Sizing) */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
        <button
          type="button"
          onClick={() => navigate('/login')}
          className="w-full sm:w-auto rounded-full px-8 py-4 bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 font-medium text-base hover:opacity-90 transition-opacity shadow-sm inline-flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 cursor-pointer"
        >
          <span>Enter Workspace</span>
          <ArrowUpRight className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => navigate('/login')}
          className="w-full sm:w-auto rounded-full px-7 py-4 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-900 dark:text-white font-medium text-base transition-colors border border-zinc-200 dark:border-zinc-800 inline-flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-indigo-500" />
          <span>Sign In to Submit Standup</span>
        </button>
      </div>

      {/* Micro Info Text */}
      <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">
        Includes instant Gemini Sentinel triage • Zero setup required • Free for teams
      </p>

      {/* Domain Category Filter Pills (ADPList Style) */}
      <div className="mt-12 flex items-center justify-center gap-2 overflow-x-auto py-2">
        {categories.map(cat => (
          <button
            key={cat}
            type="button"
            onClick={() => {
              setActiveCategory(cat);
              if (onLaunchSandbox) onLaunchSandbox();
            }}
            className={`px-4 py-2 rounded-full text-xs font-medium transition-colors whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
              activeCategory === cat
                ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 font-semibold'
                : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-800/80'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Three ADPList-Style Editorial Pillar Cards */}
      <div className="mt-14 text-left">
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-semibold text-zinc-950 dark:text-white tracking-tight">
            You don't need to have it all figured out. Just a place to start.
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
            Three core pillars designed to keep engineers unblocked and founders aligned.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Pillar 1: Get unstuck on blockers */}
          <div 
            onClick={onSubmitEod}
            className="p-7 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:border-zinc-400 dark:hover:border-zinc-700 cursor-pointer transition-colors flex flex-col justify-between"
          >
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-300 text-xs font-semibold mb-4 border border-rose-200 dark:border-rose-500/20">
                <span>Blocker Resolution</span>
              </div>
              <h3 className="text-xl font-semibold text-zinc-950 dark:text-white mb-2">
                Get unstuck on technical hurdles
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Priorities, dependency bottlenecks, and "what should I do next?" — surfaced instantly to the CTO with Gemini 2.5 sentiment scoring.
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400">
              <span>Review Blocker Desk</span>
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>

          {/* Pillar 2: Deconstruct Milestones */}
          <div 
            onClick={onLaunchSandbox}
            className="p-7 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:border-zinc-400 dark:hover:border-zinc-700 cursor-pointer transition-colors flex flex-col justify-between"
          >
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-4 border border-indigo-200 dark:border-indigo-500/20">
                <span>Milestone Engine</span>
              </div>
              <h3 className="text-xl font-semibold text-zinc-950 dark:text-white mb-2">
                Decompose raw founder vision
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Transform open-ended engineering goals into 4-week sequential task tickets, deliverables, and XP bounties provisioned directly to Google Sheets.
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400">
              <span>Generate 4-Week Roadmap</span>
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>

          {/* Pillar 3: Level up craft & velocity */}
          <div 
            onClick={onLaunchSandbox}
            className="p-7 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:border-zinc-400 dark:hover:border-zinc-700 cursor-pointer transition-colors flex flex-col justify-between"
          >
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs font-semibold mb-4 border border-emerald-200 dark:border-emerald-500/20">
                <span>Velocity & Radar</span>
              </div>
              <h3 className="text-xl font-semibold text-zinc-950 dark:text-white mb-2">
                Level up engineering craft
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Sharpen delivery with 1-on-1 Google Meet syncs, 7-day velocity telemetry, and continuous AI coaching assessments.
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400">
              <span>Inspect Velocity Radar</span>
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>

        </div>
      </div>

      {/* ADPList Style: Experienced People & Team Directory Showcase */}
      <div className="mt-16 text-left">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-2">
          <div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-zinc-950 dark:text-white tracking-tight">
              Active engineering talent. Guidance for your next step.
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
              Top engineers, interns, and team leads delivering on core project milestones.
            </p>
          </div>
          <button
            type="button"
            onClick={onLaunchSandbox}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            <span>View all talent & pipeline</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {leaders.map(leader => (
            <div 
              key={leader.name}
              onClick={onLaunchSandbox}
              className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:border-zinc-400 dark:hover:border-zinc-700 cursor-pointer transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${leader.avatarColor} text-white font-bold flex items-center justify-center text-sm shadow-sm`}>
                    {leader.initials}
                  </div>
                  <div>
                    <h4 className="font-semibold text-base text-zinc-950 dark:text-white leading-tight">
                      {leader.name}
                    </h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                      {leader.role}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300 text-xs font-semibold border border-amber-200 dark:border-amber-500/20">
                  <Star className="w-3 h-3 fill-current" />
                  <span>{leader.rating}</span>
                </div>
              </div>

              <div className="text-xs font-mono text-zinc-500 dark:text-zinc-400 mb-4 flex items-center gap-2">
                <span>{leader.company}</span>
                <span>•</span>
                <span>{leader.reviews}</span>
                <span>•</span>
                <span className="text-amber-500">{leader.sessions}</span>
              </div>

              <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 text-xs flex items-center justify-between">
                <span className={`font-medium ${leader.hasBlocker ? 'text-rose-600 dark:text-rose-400 font-semibold' : 'text-zinc-600 dark:text-zinc-300'}`}>
                  {leader.status}
                </span>
                <span className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400">
                  {leader.tag}
                </span>
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs font-semibold text-zinc-900 dark:text-white">
                <span>Schedule 1-on-1 Sync</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400" />
              </div>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
};
