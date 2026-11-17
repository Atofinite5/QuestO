import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CheckSquare, Flame, AlertOctagon, Users, Sparkles, 
  ArrowRight, ShieldAlert, Award, Calendar, ExternalLink 
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { ApiService, InternEodItem } from '../../services/api';
import { PageHeader } from '../../components/ui/PageHeader';
import { StatCard } from '../../components/ui/StatCard';
import { Badge } from '../../components/ui/Badge';

export const DashboardHome: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [eods, setEods] = useState<InternEodItem[]>([]);
  const [selectedEod, setSelectedEod] = useState<InternEodItem | null>(null);
  const [ctoReply, setCtoReply] = useState('');
  const [isAcknowledging, setIsAcknowledging] = useState(false);

  useEffect(() => {
    loadEods();
  }, []);

  const loadEods = async () => {
    const data = await ApiService.getRecentEods();
    setEods(data);
  };

  const handleAcknowledge = async (eodId: string) => {
    setIsAcknowledging(true);
    await ApiService.acknowledgeEod(eodId, ctoReply || 'Reviewed and unblocked by CTO.');
    setCtoReply('');
    setSelectedEod(null);
    await loadEods();
    setIsAcknowledging(false);
  };

  const activeBlockers = eods.filter(
    (e) => e.hasBlocker && !e.reviewStatus.includes('Acknowledged')
  );

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Page Header */}
      <PageHeader
        title={`Welcome back, ${user?.name || 'Engineer'}`}
        subtitle={`${currentDate} • Logged in as ${user?.role || 'Contributor'}`}
        action={
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/app/standups')}
              className="px-4 py-2 rounded-full bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 text-xs font-semibold hover:opacity-90 transition-opacity flex items-center gap-1.5 shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400 dark:text-indigo-600" />
              <span>Submit Today's EOD</span>
            </button>
          </div>
        }
      />

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          label="Active Quests"
          value="12 Active"
          trend="+3 completed today"
          trendPositive={true}
          icon={<CheckSquare className="w-4 h-4" />}
        />
        <StatCard
          label="Team XP Today"
          value="+340 XP"
          trend="Top: Rohan (+120 XP)"
          trendPositive={true}
          icon={<Flame className="w-4 h-4 text-amber-500" />}
        />
        <StatCard
          label="Standup Rate"
          value="86%"
          trend="4 of 5 submitted"
          trendPositive={true}
          icon={<Users className="w-4 h-4 text-blue-500" />}
        />
        <StatCard
          label="Critical Blockers"
          value={`${activeBlockers.length} Active`}
          trend={activeBlockers.length > 0 ? 'Requires leadership action' : 'All clear'}
          trendPositive={activeBlockers.length === 0}
          icon={<AlertOctagon className="w-4 h-4 text-rose-500" />}
        />
      </div>

      {/* Main Grid: Left=Recent Standup Feed, Right=Active Blocker Desk */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Recent Activity Feed (2 Cols) */}
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-100 dark:border-zinc-800">
            <div>
              <h3 className="text-sm font-semibold text-zinc-950 dark:text-white">
                Recent Daily Standups & EODs
              </h3>
              <p className="text-xs text-zinc-400">Latest submissions across engineering</p>
            </div>
            <button
              onClick={() => navigate('/app/standups')}
              className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
            {eods.slice(0, 4).map((item) => (
              <div
                key={item.updateId}
                onClick={() => setSelectedEod(selectedEod?.updateId === item.updateId ? null : item)}
                className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200/80 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-zinc-900 dark:text-white">
                      {item.internName}
                    </span>
                    <span className="text-[10px] text-zinc-400">
                      {item.timestamp}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {item.hasBlocker ? (
                      <Badge color="rose">Blocker Escalated</Badge>
                    ) : (
                      <Badge color="emerald">All Clear</Badge>
                    )}
                    <span className="text-[10px] font-mono font-bold text-amber-500">
                      +{item.xpAwarded} XP
                    </span>
                  </div>
                </div>

                <p className="text-xs text-zinc-600 dark:text-zinc-300 line-clamp-2">
                  {item.doneYesterday.replace('📋 TASKS COMPLETED:\n', '')}
                </p>

                {/* Inline Expansion */}
                {selectedEod?.updateId === item.updateId && (
                  <div className="mt-3 pt-3 border-t border-zinc-200 dark:border-zinc-800 text-xs space-y-2">
                    <div>
                      <span className="font-semibold text-zinc-700 dark:text-zinc-300">Today's Plan:</span>
                      <p className="text-zinc-600 dark:text-zinc-400 mt-0.5">{item.plannedToday}</p>
                    </div>
                    {item.hasBlocker && (
                      <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400">
                        <span className="font-bold">Blocker Details:</span> {item.blockers}
                      </div>
                    )}
                    <div className="text-[11px] text-zinc-400">
                      AI Health: {item.sentimentHealth}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Urgent Blockers Column */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-500" />
                <h3 className="text-sm font-semibold text-zinc-950 dark:text-white">
                  Active Blocker Desk
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400 text-[10px] font-bold">
                {activeBlockers.length} Critical
              </span>
            </div>

            {activeBlockers.length === 0 ? (
              <div className="py-10 text-center text-xs text-zinc-400">
                🎉 No active blockers reported. Engineering momentum is clear!
              </div>
            ) : (
              <div className="space-y-3">
                {activeBlockers.map((blk) => (
                  <div
                    key={blk.updateId}
                    className="p-3.5 rounded-xl bg-rose-50/50 dark:bg-rose-500/5 border border-rose-200 dark:border-rose-500/20 text-xs"
                  >
                    <div className="flex items-center justify-between font-semibold text-zinc-900 dark:text-white mb-1">
                      <span>{blk.internName}</span>
                      <span className="text-[10px] text-rose-600 dark:text-rose-400 font-mono">P0 Blocker</span>
                    </div>
                    <p className="text-rose-800 dark:text-rose-300 text-[11px] mb-2">
                      {blk.blockers}
                    </p>

                    <div className="space-y-1.5 pt-1">
                      <input
                        type="text"
                        value={ctoReply}
                        onChange={(e) => setCtoReply(e.target.value)}
                        placeholder="CTO resolution / advice note..."
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs"
                      />
                      <button
                        type="button"
                        disabled={isAcknowledging}
                        onClick={() => handleAcknowledge(blk.updateId)}
                        className="w-full py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-medium text-xs transition-colors"
                      >
                        Acknowledge & Unblock
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 text-[11px] text-zinc-400">
            Escalates automatically via n8n to Slack #incident-ops
          </div>
        </div>

      </div>

      {/* Bottom: Quick Operations Grid */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3">
          Quick Workspaces
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            onClick={() => navigate('/app/tasks')}
            className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500/50 cursor-pointer transition-colors shadow-sm"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold mb-2">
              📋
            </div>
            <h4 className="text-sm font-semibold text-zinc-950 dark:text-white">Task Board</h4>
            <p className="text-xs text-zinc-400 mt-0.5">Manage P0-P3 quests & XP bounties</p>
          </div>

          <div
            onClick={() => navigate('/app/talent')}
            className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500/50 cursor-pointer transition-colors shadow-sm"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold mb-2">
              💼
            </div>
            <h4 className="text-sm font-semibold text-zinc-950 dark:text-white">Talent Pipeline</h4>
            <p className="text-xs text-zinc-400 mt-0.5">Kanban review & candidate selection</p>
          </div>

          <div
            onClick={() => navigate('/app/meetings')}
            className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500/50 cursor-pointer transition-colors shadow-sm"
          >
            <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold mb-2">
              📅
            </div>
            <h4 className="text-sm font-semibold text-zinc-950 dark:text-white">Google Meet Sync</h4>
            <p className="text-xs text-zinc-400 mt-0.5">1-on-1s with auto blocker agendas</p>
          </div>

          <div
            onClick={() => navigate('/app/analytics')}
            className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500/50 cursor-pointer transition-colors shadow-sm"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold mb-2">
              📈
            </div>
            <h4 className="text-sm font-semibold text-zinc-950 dark:text-white">Burnout & Velocity</h4>
            <p className="text-xs text-zinc-400 mt-0.5">Reliability % and AI 1-on-1 cards</p>
          </div>
        </div>
      </div>

    </div>
  );
};

