import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { 
  BarChart3, TrendingUp, TrendingDown, AlertTriangle, ShieldCheck, 
  Sparkles, Flame, Users, CheckCircle2, RefreshCw, Calendar, 
  ArrowUpRight, Clock, Video, Award, HeartHandshake, Eye,
  Activity, Layers, Filter, Compass, Zap
} from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Badge } from '../../components/ui/Badge';

interface VelocityDataPoint {
  day: string;
  date: string;
  completed: number;
  blocked: number;
  xp: number;
  sentiment: number;
}

interface MemberDeepDive {
  id: string;
  name: string;
  email: string;
  role: string;
  level: string;
  levelNum: number;
  avatarColor: string;
  initials: string;
  xpTotal: number;
  streakDays: number;
  reliabilityScore: number;
  standupConsistency: number;
  architectureScore: number;
  blockerResolutionTime: string;
  burnoutRisk: 'Low' | 'Medium' | 'High';
  burnoutReason?: string;
  workloadTasks: number;
  completedTasks: number;
  aiFeedback: string[];
  recentBlocker?: string;
}

const TIMEFRAME_DATA: Record<string, VelocityDataPoint[]> = {
  '14d': [
    { day: 'Mon', date: 'Sep 08', completed: 3, blocked: 0, xp: 120, sentiment: 8.8 },
    { day: 'Tue', date: 'Sep 09', completed: 5, blocked: 1, xp: 190, sentiment: 8.5 },
    { day: 'Wed', date: 'Sep 10', completed: 4, blocked: 0, xp: 150, sentiment: 9.0 },
    { day: 'Thu', date: 'Sep 11', completed: 7, blocked: 1, xp: 260, sentiment: 8.2 },
    { day: 'Fri', date: 'Sep 12', completed: 6, blocked: 0, xp: 210, sentiment: 9.2 },
    { day: 'Sat', date: 'Sep 13', completed: 2, blocked: 0, xp: 60, sentiment: 8.0 },
    { day: 'Sun', date: 'Sep 14', completed: 1, blocked: 0, xp: 30, sentiment: 8.0 },
    { day: 'Mon', date: 'Sep 15', completed: 6, blocked: 0, xp: 240, sentiment: 8.9 },
    { day: 'Tue', date: 'Sep 16', completed: 8, blocked: 1, xp: 320, sentiment: 8.4 },
    { day: 'Wed', date: 'Sep 17', completed: 4, blocked: 2, xp: 160, sentiment: 6.8 }, // Vertex AI Quota drop
    { day: 'Thu', date: 'Sep 18', completed: 9, blocked: 0, xp: 380, sentiment: 9.1 },
    { day: 'Fri', date: 'Sep 19', completed: 8, blocked: 0, xp: 340, sentiment: 9.4 },
    { day: 'Sat', date: 'Sep 20', completed: 3, blocked: 0, xp: 90, sentiment: 8.5 },
    { day: 'Sun', date: 'Sep 21', completed: 2, blocked: 0, xp: 60, sentiment: 8.2 },
  ],
  '7d': [
    { day: 'Mon', date: 'Sep 15', completed: 6, blocked: 0, xp: 240, sentiment: 8.9 },
    { day: 'Tue', date: 'Sep 16', completed: 8, blocked: 1, xp: 320, sentiment: 8.4 },
    { day: 'Wed', date: 'Sep 17', completed: 4, blocked: 2, xp: 160, sentiment: 6.8 },
    { day: 'Thu', date: 'Sep 18', completed: 9, blocked: 0, xp: 380, sentiment: 9.1 },
    { day: 'Fri', date: 'Sep 19', completed: 8, blocked: 0, xp: 340, sentiment: 9.4 },
    { day: 'Sat', date: 'Sep 20', completed: 3, blocked: 0, xp: 90, sentiment: 8.5 },
    { day: 'Sun', date: 'Sep 21', completed: 2, blocked: 0, xp: 60, sentiment: 8.2 },
  ],
  '30d': [
    { day: 'W1', date: 'Week 1', completed: 26, blocked: 3, xp: 980, sentiment: 8.6 },
    { day: 'W2', date: 'Week 2', completed: 32, blocked: 2, xp: 1240, sentiment: 8.8 },
    { day: 'W3', date: 'Week 3', completed: 29, blocked: 4, xp: 1120, sentiment: 7.9 },
    { day: 'W4', date: 'Week 4', completed: 38, blocked: 1, xp: 1490, sentiment: 9.2 },
  ]
};

const MEMBERS_DATA: MemberDeepDive[] = [
  {
    id: 'rohan',
    name: 'Rohan Sharma',
    email: 'rohan.intern@company.com',
    role: 'AI Systems Engineering Intern',
    level: 'Level 4 — Senior Apprentice',
    levelNum: 4,
    avatarColor: 'from-blue-500 to-indigo-600',
    initials: 'RS',
    xpTotal: 1420,
    streakDays: 14,
    reliabilityScore: 86,
    standupConsistency: 93,
    architectureScore: 88,
    blockerResolutionTime: '< 4.1 hrs',
    burnoutRisk: 'Medium',
    burnoutReason: 'External Vertex AI quota limit stall; active high-priority blocker waiting on infrastructure team.',
    workloadTasks: 5,
    completedTasks: 12,
    recentBlocker: 'External quota limit on Vertex AI API — dependency awaiting CTO grant.',
    aiFeedback: [
      'Velocity on API integration milestones is above average with strong conceptual fundamentals in vector search.',
      'Proactive blocker escalation is good — dependency on external Vertex AI quota requires immediate CTO unblocking.',
      'Recommendation: Author mock fallback harnesses to unblock benchmarks independently while quota is being approved.'
    ]
  },
  {
    id: 'ananya',
    name: 'Ananya Verma',
    email: 'ananya.dev@company.com',
    role: 'Full-Stack Software Engineer',
    level: 'Level 9 — Senior Engineer',
    levelNum: 9,
    avatarColor: 'from-purple-500 to-pink-600',
    initials: 'AV',
    xpTotal: 4200,
    streakDays: 21,
    reliabilityScore: 97,
    standupConsistency: 100,
    architectureScore: 98,
    blockerResolutionTime: '< 1.2 hrs',
    burnoutRisk: 'Low',
    workloadTasks: 4,
    completedTasks: 47,
    recentBlocker: 'None in last 14 days',
    aiFeedback: [
      'Exceptional on-time delivery rate of 97% — consistently closes tasks ahead of scheduled deadlines.',
      'Zero unresolved blockers in last 14 days demonstrates robust self-sufficiency and defensive sanitization design.',
      'Recommendation: Have Ananya lead the upcoming n8n bidirectional webhook architecture review and mentor interns.'
    ]
  },
  {
    id: 'devansh',
    name: 'Devansh Kulkarni',
    email: 'dev.intern@company.com',
    role: 'Infrastructure & Data Intern',
    level: 'Level 3 — Apprentice',
    levelNum: 3,
    avatarColor: 'from-emerald-500 to-teal-600',
    initials: 'DK',
    xpTotal: 980,
    streakDays: 11,
    reliabilityScore: 90,
    standupConsistency: 85,
    architectureScore: 91,
    blockerResolutionTime: '< 2.8 hrs',
    burnoutRisk: 'Low',
    workloadTasks: 3,
    completedTasks: 8,
    recentBlocker: 'Minor Docker compose network DNS delay (resolved)',
    aiFeedback: [
      'Strong infrastructure foundation with Docker and ScaNN vector search latency benchmarking.',
      'Standup consistency is at 85% with 2 missed daily updates last week. Encourage daily habit building.',
      'Recommendation: Assign hybrid reranking quest (ScaNN + BM25) for high-impact sprint deliverable.'
    ]
  }
];

const CATEGORIES_DATA = [
  { name: 'AI Systems & Evaluation', share: 38, xp: 640, color: '#6366f1' },
  { name: 'Security & Sanitization (CWE-1236)', share: 24, xp: 410, color: '#10b981' },
  { name: 'Infrastructure & Docker Caching', share: 22, xp: 370, color: '#38bdf8' },
  { name: 'Operations & Frontend React 19', share: 16, xp: 280, color: '#f59e0b' },
];

export const AnalyticsPage: React.FC = () => {
  const navigate = useNavigate();

  const [timeframe, setTimeframe] = useState<'7d' | '14d' | '30d'>('14d');
  const [metricView, setMetricView] = useState<'all' | 'completed' | 'xp'>('all');
  const [selectedMemberId, setSelectedMemberId] = useState<string>('rohan');
  const [hoveredPoint, setHoveredPoint] = useState<VelocityDataPoint | null>(null);
  const [isRecomputing, setIsRecomputing] = useState(false);
  const [praiseSent, setPraiseSent] = useState<string | null>(null);

  const velocityData = TIMEFRAME_DATA[timeframe];
  const selectedMember = MEMBERS_DATA.find(m => m.id === selectedMemberId) || MEMBERS_DATA[0];

  const handleRecompute = () => {
    setIsRecomputing(true);
    setTimeout(() => {
      setIsRecomputing(false);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    }, 900);
  };

  const handleSendPraise = (name: string) => {
    confetti({ particleCount: 70, spread: 70, origin: { y: 0.7 } });
    setPraiseSent(name);
    setTimeout(() => setPraiseSent(null), 3000);
  };

  // SVG Chart Calculations for Velocity Curve
  const maxCompleted = Math.max(...velocityData.map(d => d.completed), 10);
  const chartHeight = 180;
  const chartWidth = 700;
  const paddingX = 30;
  const paddingY = 25;

  const getCoordinates = (index: number, val: number, max: number) => {
    const x = paddingX + (index / (velocityData.length - 1)) * (chartWidth - paddingX * 2);
    const y = chartHeight - paddingY - (val / max) * (chartHeight - paddingY * 2);
    return { x, y };
  };

  // Generate SVG Path for Completed Quests
  const pointsCompleted = velocityData.map((d, i) => getCoordinates(i, d.completed, maxCompleted));
  const pathD = pointsCompleted.reduce((acc, p, i, arr) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    const prev = arr[i - 1];
    const cpX1 = prev.x + (p.x - prev.x) / 2;
    const cpX2 = cpX1;
    return `${acc} C ${cpX1} ${prev.y}, ${cpX2} ${p.y}, ${p.x} ${p.y}`;
  }, '');

  // Closed area path for gradient
  const areaD = `${pathD} L ${pointsCompleted[pointsCompleted.length - 1].x} ${chartHeight - paddingY} L ${pointsCompleted[0].x} ${chartHeight - paddingY} Z`;

  // Circular gauge circumference helper
  const renderRadialGauge = (score: number, color: string) => {
    const radius = 38;
    const circ = 2 * Math.PI * radius;
    const strokeDash = (score / 100) * circ;
    return (
      <div className="relative w-24 h-24 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="48"
            cy="48"
            r={radius}
            stroke="currentColor"
            strokeWidth="7"
            className="text-zinc-100 dark:text-zinc-800"
            fill="transparent"
          />
          <circle
            cx="48"
            cy="48"
            r={radius}
            stroke={color}
            strokeWidth="7"
            strokeDasharray={circ}
            strokeDashoffset={circ - strokeDash}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
            fill="transparent"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-base font-bold text-zinc-950 dark:text-white">{score}%</span>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      
      {/* Page Header with Timeframe and Recompute */}
      <PageHeader
        title="Performance & Burnout Intelligence"
        subtitle="Sprint burnup curves, real-time burnout telemetry, and Gemini 1-on-1 coaching recommendations."
        action={
          <div className="flex items-center gap-2 flex-wrap">
            {/* Timeframe Selector Pills */}
            <div className="flex items-center p-1 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-xs font-medium">
              {(['7d', '14d', '30d'] as const).map((tf) => (
                <button
                  key={tf}
                  type="button"
                  onClick={() => setTimeframe(tf)}
                  className={`px-3 py-1 rounded-lg transition-colors ${
                    timeframe === tf
                      ? 'bg-white dark:bg-zinc-900 text-zinc-950 dark:text-white font-semibold shadow-xs'
                      : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
                  }`}
                >
                  {tf === '7d' ? '7 Days' : tf === '14d' ? 'Sprint 3 (14d)' : '30 Days'}
                </button>
              ))}
            </div>

            <button
              type="button"
              disabled={isRecomputing}
              onClick={handleRecompute}
              className="px-4 py-2 rounded-full bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 text-xs font-semibold hover:opacity-90 transition-opacity flex items-center gap-1.5 shadow-sm disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRecomputing ? 'animate-spin' : ''}`} />
              <span>{isRecomputing ? 'Processing...' : 'Recompute AI'}</span>
            </button>
          </div>
        }
      />

      {/* 4 Interactive Executive KPI Cards with Mini Sparklines */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* KPI 1: Delivery Reliability */}
        <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs mb-3">
            <span className="font-semibold uppercase tracking-wider text-zinc-400">Delivery Reliability</span>
            <span className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div>
            <div className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-white">
              91.0%
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                +3.2% vs sprint 2
              </span>
              <svg className="w-16 h-6 text-emerald-500 stroke-current fill-none stroke-2">
                <path d="M 0 18 Q 8 16, 16 12 T 32 10 T 48 4 T 64 2" />
              </svg>
            </div>
          </div>
        </div>

        {/* KPI 2: Sprint Velocity Burnup */}
        <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs mb-3">
            <span className="font-semibold uppercase tracking-wider text-zinc-400">Sprint 3 Burnup</span>
            <span className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Zap className="w-4 h-4" />
            </span>
          </div>
          <div>
            <div className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-white">
              142 <span className="text-sm font-normal text-zinc-400">/ 160 SP</span>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
                88.7% on target
              </span>
              <div className="w-16 h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-600 rounded-full" style={{ width: '88.7%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* KPI 3: Mean Time to Unblock (MTTU) */}
        <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs mb-3">
            <span className="font-semibold uppercase tracking-wider text-zinc-400">Mean Time to Unblock</span>
            <span className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div>
            <div className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-white">
              2.4 <span className="text-base font-normal text-zinc-400">hrs</span>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                -58% vs last month
              </span>
              <svg className="w-16 h-6 text-blue-500 stroke-current fill-none stroke-2">
                <path d="M 0 4 Q 16 10, 32 14 T 64 20" />
              </svg>
            </div>
          </div>
        </div>

        {/* KPI 4: Burnout Early Warning Index */}
        <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs mb-3">
            <span className="font-semibold uppercase tracking-wider text-zinc-400">Burnout Watchlist</span>
            <span className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <AlertTriangle className="w-4 h-4" />
            </span>
          </div>
          <div>
            <div className="text-3xl font-bold tracking-tight text-amber-600 dark:text-amber-400 flex items-center gap-2">
              1 Alert
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
            </div>
            <div className="flex items-center justify-between mt-2 text-xs text-zinc-500">
              <span>Rohan (API quota bottleneck)</span>
              <span className="text-indigo-600 dark:text-indigo-400 font-semibold cursor-pointer" onClick={() => setSelectedMemberId('rohan')}>
                Inspect →
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* MAJOR VISUALIZATION 1: Interactive Sprint Velocity & Burnup Area Chart */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 sm:p-7 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-100 dark:border-zinc-800">
          <div>
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-500" />
              <h3 className="text-base font-bold text-zinc-950 dark:text-white">
                Sprint Velocity & Quests Completed Curve
              </h3>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Daily engineering momentum vs blocker stalls across {timeframe === '7d' ? 'the past 7 days' : timeframe === '14d' ? 'Sprint 3' : 'the month'}.
            </p>
          </div>

          {/* Metric View Tabs */}
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-4 text-xs font-medium text-zinc-500 pr-2">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                Quests Closed
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                Blocker Stalls
              </span>
            </div>
          </div>
        </div>

        {/* The SVG Canvas */}
        <div className="relative w-full overflow-x-auto">
          <div className="min-w-[640px]">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="w-full h-56 overflow-visible"
            >
              <defs>
                <linearGradient id="velocityGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0.00" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
                const y = paddingY + ratio * (chartHeight - paddingY * 2);
                return (
                  <g key={i}>
                    <line
                      x1={paddingX}
                      y1={y}
                      x2={chartWidth - paddingX}
                      y2={y}
                      stroke="currentColor"
                      strokeDasharray="4 4"
                      className="text-zinc-100 dark:text-zinc-800/80"
                    />
                    <text
                      x={paddingX - 8}
                      y={y + 3}
                      textAnchor="end"
                      className="text-[9px] fill-zinc-400 font-mono"
                    >
                      {Math.round((1 - ratio) * maxCompleted)}
                    </text>
                  </g>
                );
              })}

              {/* Gradient Area */}
              <path d={areaD} fill="url(#velocityGradient)" />

              {/* Main Line */}
              <path
                d={pathD}
                fill="none"
                stroke="#6366f1"
                strokeWidth="3"
                strokeLinecap="round"
                className="transition-all duration-300"
              />

              {/* Data Points */}
              {velocityData.map((d, i) => {
                const { x, y } = getCoordinates(i, d.completed, maxCompleted);
                const hasBlocker = d.blocked > 0;
                const isHovered = hoveredPoint?.date === d.date;

                return (
                  <g key={i} className="cursor-pointer">
                    {/* Interactive Column hit area */}
                    <rect
                      x={x - 14}
                      y={0}
                      width={28}
                      height={chartHeight}
                      fill="transparent"
                      onMouseEnter={() => setHoveredPoint(d)}
                      onMouseLeave={() => setHoveredPoint(null)}
                    />

                    {/* Blocker Marker if any */}
                    {hasBlocker && (
                      <circle
                        cx={x}
                        cy={y}
                        r={isHovered ? 7 : 5}
                        fill="#ef4444"
                        className="transition-all duration-150 animate-pulse"
                      />
                    )}

                    {/* Quests Point Circle */}
                    <circle
                      cx={x}
                      cy={y}
                      r={isHovered ? 6 : 4}
                      fill={hasBlocker ? '#ef4444' : '#6366f1'}
                      stroke="white"
                      strokeWidth="2"
                      className="dark:stroke-zinc-900 transition-all duration-150"
                    />

                    {/* X-Axis Date Labels */}
                    <text
                      x={x}
                      y={chartHeight - 6}
                      textAnchor="middle"
                      className={`text-[10px] font-mono transition-colors ${
                        isHovered ? 'fill-indigo-600 dark:fill-indigo-400 font-bold' : 'fill-zinc-400'
                      }`}
                    >
                      {d.day}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Interactive Floating Tooltip */}
            {hoveredPoint && (
              <div className="mt-3 p-3.5 rounded-2xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-xl flex items-center justify-between text-xs animate-in fade-in duration-200">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-sm">{hoveredPoint.date} ({hoveredPoint.day})</span>
                  <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 dark:text-indigo-600 font-mono text-[11px] font-bold">
                    +{hoveredPoint.xp} XP Minted
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-emerald-400 dark:text-emerald-600 font-bold">
                    ✓ {hoveredPoint.completed} Quests Closed
                  </span>
                  {hoveredPoint.blocked > 0 ? (
                    <span className="text-rose-400 dark:text-rose-600 font-bold">
                      ⚠️ {hoveredPoint.blocked} Blocker Reported
                    </span>
                  ) : (
                    <span className="text-zinc-400 text-[11px]">Zero Blockers</span>
                  )}
                  <span className="text-zinc-400 text-[11px]">
                    Team Morale: {hoveredPoint.sentiment}/10
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* MAJOR VISUALIZATION 2 & 3: Burnout Radar Scatter Matrix + Domain Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Burnout Sentinel Radar (7 Cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
            <div>
              <h3 className="text-sm font-bold text-zinc-950 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-500" />
                <span>Team Burnout Risk Matrix</span>
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Workload Volume vs Blocker Resolution Latency vs Daily Sentiment.
              </p>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-medium text-zinc-400">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Safe Zone</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500" /> Watch Zone</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500" /> Hazard Zone</span>
            </div>
          </div>

          {/* Interactive Matrix Plot Canvas */}
          <div className="relative h-64 rounded-2xl bg-zinc-50/70 dark:bg-zinc-950/50 border border-zinc-200/80 dark:border-zinc-800/80 p-4 flex flex-col justify-between overflow-hidden">
            
            {/* Visual Zone Backgrounds */}
            <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 opacity-30 pointer-events-none">
              <div className="bg-emerald-500/10 border-r border-b border-zinc-200 dark:border-zinc-800" />
              <div className="bg-amber-500/10 border-b border-zinc-200 dark:border-zinc-800" />
              <div className="bg-blue-500/10 border-r border-zinc-200 dark:border-zinc-800" />
              <div className="bg-rose-500/10" />
            </div>

            {/* Matrix Labels */}
            <div className="relative z-10 flex justify-between text-[10px] font-mono text-zinc-400">
              <span>High Workload</span>
              <span>Stalled Latency</span>
            </div>

            {/* Plotted Engineers */}
            <div className="relative z-10 h-full w-full">
              {/* Rohan Sharma (High workload + Quota Latency -> Yellow Zone) */}
              <div
                onClick={() => setSelectedMemberId('rohan')}
                className={`absolute transition-all cursor-pointer group ${
                  selectedMemberId === 'rohan' ? 'scale-110 z-20' : 'z-10'
                }`}
                style={{ top: '35%', left: '68%' }}
              >
                <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 border-2 border-amber-500 p-1.5 rounded-full shadow-lg">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-[10px]">
                    RS
                  </div>
                  <span className="text-xs font-bold text-zinc-900 dark:text-white pr-2">
                    Rohan (4.1h)
                  </span>
                </div>
                <div className="text-[10px] text-amber-600 dark:text-amber-400 font-bold text-center mt-1">
                  ⚠️ Burnout Watch
                </div>
              </div>

              {/* Ananya Verma (High volume + Ultra Low Latency -> Green Safe Zone) */}
              <div
                onClick={() => setSelectedMemberId('ananya')}
                className={`absolute transition-all cursor-pointer group ${
                  selectedMemberId === 'ananya' ? 'scale-110 z-20' : 'z-10'
                }`}
                style={{ top: '22%', left: '20%' }}
              >
                <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 border-2 border-emerald-500 p-1.5 rounded-full shadow-lg">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 text-white flex items-center justify-center font-bold text-[10px]">
                    AV
                  </div>
                  <span className="text-xs font-bold text-zinc-900 dark:text-white pr-2">
                    Ananya (1.2h)
                  </span>
                </div>
                <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold text-center mt-1">
                  🟢 High Velocity
                </div>
              </div>

              {/* Devansh Kulkarni (Moderate Volume + Moderate Latency -> Green Zone) */}
              <div
                onClick={() => setSelectedMemberId('devansh')}
                className={`absolute transition-all cursor-pointer group ${
                  selectedMemberId === 'devansh' ? 'scale-110 z-20' : 'z-10'
                }`}
                style={{ top: '65%', left: '38%' }}
              >
                <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 border-2 border-emerald-500 p-1.5 rounded-full shadow-lg">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center font-bold text-[10px]">
                    DK
                  </div>
                  <span className="text-xs font-bold text-zinc-900 dark:text-white pr-2">
                    Devansh (2.8h)
                  </span>
                </div>
                <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold text-center mt-1">
                  🟢 Balanced
                </div>
              </div>
            </div>

            <div className="relative z-10 flex justify-between text-[10px] font-mono text-zinc-400">
              <span>← Fast Unblocking (0h)</span>
              <span>Slow Resolution (12h+) →</span>
            </div>
          </div>
        </div>

        {/* Right: Quest Domain Distribution (5 Cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm space-y-4">
          <div className="pb-3 border-b border-zinc-100 dark:border-zinc-800">
            <h3 className="text-sm font-bold text-zinc-950 dark:text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-500" />
              <span>Technology & Task Distribution</span>
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              XP and sprint effort allocation by architecture tier.
            </p>
          </div>

          {/* Segmented Progress Bar */}
          <div className="space-y-2">
            <div className="h-4 w-full rounded-full overflow-hidden flex bg-zinc-100 dark:bg-zinc-800">
              {CATEGORIES_DATA.map((cat, i) => (
                <div
                  key={i}
                  style={{ width: `${cat.share}%`, backgroundColor: cat.color }}
                  title={`${cat.name}: ${cat.share}%`}
                  className="h-full transition-all hover:opacity-80"
                />
              ))}
            </div>
          </div>

          {/* Breakdown Rows */}
          <div className="space-y-3 pt-2">
            {CATEGORIES_DATA.map((cat, i) => (
              <div
                key={i}
                className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: cat.color }}
                  />
                  <div>
                    <span className="font-semibold text-zinc-900 dark:text-white block">
                      {cat.name}
                    </span>
                    <span className="text-[10px] text-zinc-400">
                      {cat.xp} XP generated
                    </span>
                  </div>
                </div>

                <span className="text-sm font-bold font-mono text-zinc-900 dark:text-white">
                  {cat.share}%
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* MAJOR INTERACTIVE SECTION: Individual Engineer Deep Dive & AI Coaching */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 shadow-sm space-y-6">
        
        {/* Selector Tabs for Teammates */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-zinc-100 dark:border-zinc-800">
          <div>
            <h3 className="text-base font-bold text-zinc-950 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              <span>Interactive Engineer Diagnostic Hub</span>
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              Select an engineer to view real-time radial completion gauges, blocker root causes, and AI 1-on-1 coaching cards.
            </p>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto p-1 bg-zinc-100 dark:bg-zinc-800 rounded-2xl">
            {MEMBERS_DATA.map(m => (
              <button
                key={m.id}
                type="button"
                onClick={() => setSelectedMemberId(m.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  selectedMemberId === m.id
                    ? 'bg-white dark:bg-zinc-900 text-zinc-950 dark:text-white shadow-xs'
                    : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${m.avatarColor} text-white flex items-center justify-center text-[9px] font-bold`}>
                  {m.initials}
                </div>
                <span>{m.name.split(' ')[0]}</span>
                {m.burnoutRisk === 'Medium' && (
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Member Diagnostic View */}
        <div className="space-y-6">
          
          {/* Profile Header & Stats */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${selectedMember.avatarColor} text-white flex items-center justify-center font-bold text-xl shadow-md shrink-0`}>
                {selectedMember.initials}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-base font-bold text-zinc-950 dark:text-white">
                    {selectedMember.name}
                  </h4>
                  <Badge color={selectedMember.burnoutRisk === 'Low' ? 'emerald' : 'yellow'}>
                    {selectedMember.burnoutRisk === 'Low' ? '🟢 Low Burnout Risk' : '🟡 Burnout Watch'}
                  </Badge>
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  {selectedMember.role} • {selectedMember.level}
                </p>
              </div>
            </div>

            {/* Quick Counters */}
            <div className="flex items-center gap-5 text-xs">
              <div>
                <span className="text-[10px] text-zinc-400 block uppercase font-semibold">Total XP</span>
                <span className="font-mono font-bold text-amber-500 text-sm">
                  {selectedMember.xpTotal.toLocaleString()} XP
                </span>
              </div>
              <div className="h-8 w-px bg-zinc-200 dark:bg-zinc-800" />
              <div>
                <span className="text-[10px] text-zinc-400 block uppercase font-semibold">Standup Streak</span>
                <span className="font-bold text-rose-500 text-sm">
                  {selectedMember.streakDays} Days 🔥
                </span>
              </div>
              <div className="h-8 w-px bg-zinc-200 dark:bg-zinc-800" />
              <div>
                <span className="text-[10px] text-zinc-400 block uppercase font-semibold">MTTU</span>
                <span className="font-bold text-zinc-900 dark:text-white text-sm">
                  {selectedMember.blockerResolutionTime}
                </span>
              </div>
            </div>
          </div>

          {/* 3 Circular Radial Progress Gauges */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Gauge 1: Reliability */}
            <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-center flex flex-col items-center justify-center">
              {renderRadialGauge(selectedMember.reliabilityScore, '#10b981')}
              <h5 className="text-xs font-bold text-zinc-900 dark:text-white mt-2">
                On-Time Delivery Reliability
              </h5>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                {selectedMember.reliabilityScore >= 90 ? 'Consistently ahead of ETA' : 'Pacing with minor buffer needed'}
              </p>
            </div>

            {/* Gauge 2: Consistency */}
            <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-center flex flex-col items-center justify-center">
              {renderRadialGauge(selectedMember.standupConsistency, '#6366f1')}
              <h5 className="text-xs font-bold text-zinc-900 dark:text-white mt-2">
                Daily Standup Consistency
              </h5>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                {selectedMember.standupConsistency >= 90 ? 'Flawless daily reporting habit' : '2 missed updates this cycle'}
              </p>
            </div>

            {/* Gauge 3: Architecture Quality */}
            <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-center flex flex-col items-center justify-center">
              {renderRadialGauge(selectedMember.architectureScore, '#38bdf8')}
              <h5 className="text-xs font-bold text-zinc-900 dark:text-white mt-2">
                Code & Security Score
              </h5>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Branch coverage & CWE-1236 compliance
              </p>
            </div>

          </div>

          {/* Active Blocker Alert Banner (If present) */}
          {selectedMember.recentBlocker && selectedMember.burnoutRisk === 'Medium' && (
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-xs text-rose-800 dark:text-rose-300 flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
                <div>
                  <span className="font-bold block">Active Critical Bottleneck:</span>
                  <p className="mt-0.5">{selectedMember.recentBlocker}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => navigate('/app/meetings')}
                className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs shrink-0 flex items-center gap-1 shadow-xs"
              >
                <Video className="w-3.5 h-3.5" />
                <span>Schedule Resolution</span>
              </button>
            </div>
          )}

          {/* Gemini 2.5 Pro 1-on-1 Coaching Card & Action Buttons */}
          <div className="p-6 rounded-3xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-500/20 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-indigo-100 dark:border-indigo-500/20">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-500" />
                <h4 className="text-sm font-bold text-indigo-950 dark:text-indigo-200">
                  Gemini 2.5 Pro 1-on-1 Coaching Card for Leadership
                </h4>
              </div>
              <span className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400 font-semibold">
                Updated Daily via Gemini Sentinel
              </span>
            </div>

            <ul className="space-y-2 text-xs text-zinc-700 dark:text-zinc-300">
              {selectedMember.aiFeedback.map((point, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                  <span className="leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>

            {/* Direct 1-on-1 Action Buttons */}
            <div className="pt-3 border-t border-indigo-100 dark:border-indigo-500/20 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => navigate('/app/meetings')}
                  className="px-4 py-2 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Schedule 1-on-1 Google Meet</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSendPraise(selectedMember.name)}
                  className="px-4 py-2 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Award className="w-3.5 h-3.5 text-amber-500" />
                  <span>Award +50 Bonus XP</span>
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/app/leaves')}
                  className="px-4 py-2 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Freeze Streak for Exam</span>
                </button>
              </div>

              {praiseSent && (
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400 animate-in fade-in">
                  🎉 +50 Bonus XP awarded to {praiseSent}!
                </span>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
