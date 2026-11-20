import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CheckSquare, Flame, AlertOctagon, Users, Sparkles, 
  ArrowRight, ShieldAlert, Award, Calendar, ExternalLink,
  CalendarOff, MessageSquare, Clock, CheckCircle2, Video
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { ApiService, InternEodItem } from '../../services/api';
import { TaskItem, TeamMember } from '../../types';
import { PageHeader } from '../../components/ui/PageHeader';
import { StatCard } from '../../components/ui/StatCard';
import { Badge } from '../../components/ui/Badge';

export const DashboardHome: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [eods, setEods] = useState<InternEodItem[]>([]);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [selectedEod, setSelectedEod] = useState<InternEodItem | null>(null);
  const [ctoReply, setCtoReply] = useState('');
  const [isAcknowledging, setIsAcknowledging] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    const [eodsData, tasksData, teamData] = await Promise.all([
      ApiService.getRecentEods(),
      ApiService.getTasks(),
      ApiService.getTeam(),
    ]);
    setEods(eodsData);
    setTasks(tasksData);
    setTeam(teamData);
  };

  const handleAcknowledge = async (eodId: string) => {
    setIsAcknowledging(true);
    await ApiService.acknowledgeEod(eodId, ctoReply || 'Reviewed and unblocked by CTO.');
    setCtoReply('');
    setSelectedEod(null);
    await loadDashboardData();
    setIsAcknowledging(false);
  };

  const handleTaskStatusChange = async (taskId: string, newStatus: TaskItem['status']) => {
    await ApiService.updateTaskStatus(taskId, newStatus);
    await loadDashboardData();
  };

  const isIntern = user?.role === 'INTERN';

  // Active blockers across company
  const activeBlockers = eods.filter(
    (e) => e.hasBlocker && !e.reviewStatus.includes('Acknowledged')
  );

  // General Team Metrics
  const activeTasks = tasks.filter((t) => t.status !== 'Done');
  const completedTasks = tasks.filter((t) => t.status === 'Done');
  const blockedTasks = tasks.filter((t) => t.status === 'Blocked');

  const totalTeamXp = team.reduce((acc, m) => acc + (m.totalXp || 0), 0);
  const topMember = [...team].sort((a, b) => (b.totalXp || 0) - (a.totalXp || 0))[0];

  const uniqueEodSubmitters = new Set(eods.map((e) => e.internEmail.toLowerCase())).size;
  const totalRoster = team.length > 0 ? team.length : 5;
  const standupPercentage = Math.min(100, Math.round((uniqueEodSubmitters / totalRoster) * 100));

  // Intern-specific calculations
  const myTasks = tasks.filter(
    (t) =>
      (user?.email && t.assigneeEmail.toLowerCase() === user.email.toLowerCase()) ||
      (user?.name && t.assignee.toLowerCase().includes(user.name.toLowerCase()))
  );
  const displayInternTasks = myTasks.length > 0 ? myTasks : tasks.slice(0, 4);
  const myActiveTasks = displayInternTasks.filter((t) => t.status !== 'Done');
  const myCompletedTasks = displayInternTasks.filter((t) => t.status === 'Done');

  const myTeamRecord = team.find(
    (m) =>
      (user?.email && m.email.toLowerCase() === user.email.toLowerCase()) ||
      (user?.name && m.name.toLowerCase().includes(user.name.toLowerCase()))
  );
  const myLevel = myTeamRecord?.level || Math.floor(Math.sqrt((myTeamRecord?.totalXp || 1420) / 50)) + 1;
  const myXp = myTeamRecord?.totalXp || 1420;
  const myStreak = myTeamRecord?.streakDays || 14;

  const myEods = eods.filter(
    (e) =>
      (user?.email && e.internEmail.toLowerCase() === user.email.toLowerCase()) ||
      (user?.name && e.internName.toLowerCase().includes(user.name.toLowerCase()))
  );
  const myLatestEod = myEods[0] || eods[0];
  const myActiveBlocker = myEods.find((e) => e.hasBlocker && !e.reviewStatus.includes('Acknowledged'));

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Dynamic Header tailored by Role */}
      <PageHeader
        title={isIntern ? `Intern Workspace • ${user?.name || 'Engineer'}` : `Executive Command • ${user?.name || 'Leader'}`}
        subtitle={`${currentDate} • Logged in as ${user?.role || 'Contributor'}`}
        action={
          <div className="flex items-center gap-2 flex-wrap">
            {isIntern ? (
              <>
                <button
                  onClick={() => navigate('/app/standups')}
                  className="px-4 py-2 rounded-full bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 text-xs font-semibold hover:opacity-90 transition-opacity flex items-center gap-1.5 shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400 dark:text-indigo-600" />
                  <span>Submit Today's EOD</span>
                </button>
                <button
                  onClick={() => navigate('/app/leaves')}
                  className="px-4 py-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-semibold hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors flex items-center gap-1.5"
                >
                  <CalendarOff className="w-3.5 h-3.5 text-amber-500" />
                  <span>Request Study Leave</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate('/app/roadmaps')}
                  className="px-4 py-2 rounded-full bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 text-xs font-semibold hover:opacity-90 transition-opacity flex items-center gap-1.5 shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400 dark:text-indigo-600" />
                  <span>Deconstruct Roadmap</span>
                </button>
                <button
                  onClick={() => navigate('/app/standups')}
                  className="px-4 py-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-semibold hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors flex items-center gap-1.5"
                >
                  <Users className="w-3.5 h-3.5 text-blue-500" />
                  <span>Review Standups</span>
                </button>
              </>
            )}
          </div>
        }
      />

      {/* 4 Stat Cards tailored by Role */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {isIntern ? (
          <>
            <StatCard
              label="My Active Quests"
              value={`${myActiveTasks.length} Active`}
              trend={`${myCompletedTasks.length} completed this sprint`}
              trendPositive={true}
              icon={<CheckSquare className="w-4 h-4 text-indigo-500" />}
            />
            <StatCard
              label="My Experience & Rank"
              value={`Level ${myLevel}`}
              trend={`${myXp.toLocaleString()} Total XP`}
              trendPositive={true}
              icon={<Flame className="w-4 h-4 text-amber-500" />}
            />
            <StatCard
              label="Standup Streak"
              value={`${myStreak} Days 🔥`}
              trend="Protected against reset on leave"
              trendPositive={true}
              icon={<Award className="w-4 h-4 text-emerald-500" />}
            />
            <StatCard
              label="My Blocker Status"
              value={myActiveBlocker ? '1 Escalated' : 'All Clear'}
              trend={myActiveBlocker ? 'CTO notified & addressing' : 'Pacing smoothly'}
              trendPositive={!myActiveBlocker}
              icon={<ShieldAlert className={`w-4 h-4 ${myActiveBlocker ? 'text-rose-500' : 'text-emerald-500'}`} />}
            />
          </>
        ) : (
          <>
            <StatCard
              label="Active Quests"
              value={`${activeTasks.length} Active`}
              trend={`${completedTasks.length} completed • ${blockedTasks.length} blocked`}
              trendPositive={blockedTasks.length === 0}
              icon={<CheckSquare className="w-4 h-4" />}
            />
            <StatCard
              label="Team XP Pool"
              value={`${totalTeamXp.toLocaleString()} XP`}
              trend={topMember ? `Top: ${topMember.name.split(' ')[0]} (${topMember.totalXp.toLocaleString()} XP)` : 'Active sprint'}
              trendPositive={true}
              icon={<Flame className="w-4 h-4 text-amber-500" />}
            />
            <StatCard
              label="Standup Rate"
              value={`${standupPercentage}%`}
              trend={`${uniqueEodSubmitters} of ${totalRoster} submitted`}
              trendPositive={standupPercentage >= 80}
              icon={<Users className="w-4 h-4 text-blue-500" />}
            />
            <StatCard
              label="Critical Blockers"
              value={`${activeBlockers.length} Active`}
              trend={activeBlockers.length > 0 ? 'Requires leadership action' : 'All clear'}
              trendPositive={activeBlockers.length === 0}
              icon={<AlertOctagon className="w-4 h-4 text-rose-500" />}
            />
          </>
        )}
      </div>

      {/* Main Grid: Left=Work Feed, Right=Action/Desk */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {isIntern ? (
          /* ── INTERN VIEW: MY ASSIGNED TASKS (Left) + MY STANDUP & FEEDBACK (Right) ── */
          <>
            {/* Left: My Quests */}
            <div className="lg:col-span-2 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
                <div>
                  <h3 className="text-sm font-semibold text-zinc-950 dark:text-white">
                    My Assigned Quests & Sprints
                  </h3>
                  <p className="text-xs text-zinc-400">Update quest statuses directly from your desk</p>
                </div>
                <button
                  onClick={() => navigate('/app/tasks')}
                  className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                >
                  <span>View All Quests</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="space-y-3">
                {displayInternTasks.map((task) => (
                  <div
                    key={task.taskId}
                    className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200/80 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-bold text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">
                          {task.taskId}
                        </span>
                        <h4 className="text-xs font-bold text-zinc-950 dark:text-white">
                          {task.title}
                        </h4>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono font-bold text-amber-500">
                          +{task.xpBounty} XP
                        </span>
                        <select
                          value={task.status}
                          onChange={(e) => handleTaskStatusChange(task.taskId, e.target.value as any)}
                          className="px-2 py-0.5 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-[11px] font-medium text-zinc-700 dark:text-zinc-300 outline-none"
                        >
                          <option value="Open">Open</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Blocked">Blocked</option>
                          <option value="In Review">In Review</option>
                          <option value="Done">Done</option>
                        </select>
                      </div>
                    </div>

                    <p className="text-[11px] text-zinc-600 dark:text-zinc-400 line-clamp-1">
                      {task.description}
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-zinc-400 pt-1 border-t border-zinc-100 dark:border-zinc-800/60">
                      <span>Deadline: {task.deadline.substring(0, 10)}</span>
                      <span className="font-medium text-indigo-500">Priority: {task.priority}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: My Standup & CTO Review Desk */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 shadow-sm space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-indigo-500" />
                    <h3 className="text-sm font-semibold text-zinc-950 dark:text-white">
                      My Standup & CTO Review
                    </h3>
                  </div>
                  <Badge color="blue">Today</Badge>
                </div>

                {myLatestEod ? (
                  <div className="space-y-3 pt-2">
                    <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-100 dark:border-zinc-800 text-xs space-y-1.5">
                      <span className="text-[10px] text-zinc-400 uppercase font-semibold">Latest Status:</span>
                      <p className="text-zinc-700 dark:text-zinc-300 line-clamp-2">
                        {myLatestEod.plannedToday}
                      </p>
                      <div className="text-[10px] text-zinc-400 pt-1">
                        AI Health: {myLatestEod.sentimentHealth}
                      </div>
                    </div>

                    {myLatestEod.ctoFeedback ? (
                      <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-xs space-y-1">
                        <span className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>CTO Note & Advice:</span>
                        </span>
                        <p className="text-emerald-900 dark:text-emerald-200 italic">
                          "{myLatestEod.ctoFeedback}"
                        </p>
                      </div>
                    ) : (
                      <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-100 dark:border-zinc-800 text-[11px] text-zinc-400">
                        {myLatestEod.hasBlocker ? '🚨 Blocker escalated to CTO review queue.' : '✅ Standup acknowledged. No blockers reported.'}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="py-8 text-center text-xs text-zinc-400">
                    No EOD report submitted yet today.
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  onClick={() => navigate('/app/meetings')}
                  className="w-full py-2 px-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <Video className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Join Mentorship Meet</span>
                </button>
              </div>
            </div>
          </>
        ) : (
          /* ── LEADERSHIP VIEW: ALL STANDUPS (Left) + ACTIVE BLOCKER DESK (Right) ── */
          <>
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
          </>
        )}

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
            onClick={() => navigate(isIntern ? '/app/leaves' : '/app/talent')}
            className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500/50 cursor-pointer transition-colors shadow-sm"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold mb-2">
              {isIntern ? '🏖️' : '💼'}
            </div>
            <h4 className="text-sm font-semibold text-zinc-950 dark:text-white">{isIntern ? 'Study & Exam PTO' : 'Talent Pipeline'}</h4>
            <p className="text-xs text-zinc-400 mt-0.5">{isIntern ? 'Streak freeze & exam leave' : 'Kanban review & candidate selection'}</p>
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
            onClick={() => navigate(isIntern ? '/app/team' : '/app/analytics')}
            className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500/50 cursor-pointer transition-colors shadow-sm"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold mb-2">
              {isIntern ? '🏆' : '📈'}
            </div>
            <h4 className="text-sm font-semibold text-zinc-950 dark:text-white">{isIntern ? 'Team Leaderboard' : 'Burnout & Velocity'}</h4>
            <p className="text-xs text-zinc-400 mt-0.5">{isIntern ? 'XP rankings & sprint levels' : 'Reliability % and AI 1-on-1 cards'}</p>
          </div>
        </div>
      </div>

    </div>
  );
};

