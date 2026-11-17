import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Send, Sparkles, Filter, Search, CheckCircle2, 
  AlertOctagon, Clock, User, Award, ArrowUpRight 
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { ApiService, InternEodItem } from '../../services/api';
import { PageHeader } from '../../components/ui/PageHeader';
import { Badge } from '../../components/ui/Badge';

export const StandupsPage: React.FC = () => {
  const { user } = useAuth();

  const [eodList, setEodList] = useState<InternEodItem[]>([]);
  const [filter, setFilter] = useState<'all' | 'blockers' | 'pending'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSubmission, setLastSubmission] = useState<any>(null);

  // CTO Review state
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [ctoFeedbackMap, setCtoFeedbackMap] = useState<Record<string, string>>({});

  // EOD Form state
  const [form, setForm] = useState({
    name: user?.name || 'Rohan Sharma',
    email: user?.email || 'rohan.intern@company.com',
    tasks: '',
    challenges: '',
    blockers: '',
    tomorrow: ''
  });

  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        name: user.name,
        email: user.email
      }));
    }
    loadEods();
  }, [user]);

  const loadEods = async () => {
    const data = await ApiService.getRecentEods();
    setEodList(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.tasks) return;
    setIsSubmitting(true);

    const result = await ApiService.submitInternEod({
      internName: form.name,
      internEmail: form.email,
      tasksCompleted: form.tasks,
      challengesOvercome: form.challenges,
      blockers: form.blockers,
      tomorrowPlan: form.tomorrow
    });

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    setLastSubmission(result);
    setForm((prev) => ({
      ...prev,
      tasks: '',
      challenges: '',
      blockers: '',
      tomorrow: ''
    }));

    await loadEods();
    setIsSubmitting(false);
  };

  const handleAcknowledge = async (updateId: string) => {
    const feedback = ctoFeedbackMap[updateId] || 'Acknowledged and approved by CTO.';
    await ApiService.acknowledgeEod(updateId, feedback);
    setCtoFeedbackMap((prev) => ({ ...prev, [updateId]: '' }));
    await loadEods();
  };

  const filteredList = eodList.filter((item) => {
    if (filter === 'blockers' && !item.hasBlocker) return false;
    if (filter === 'pending' && item.reviewStatus.includes('Acknowledged')) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        item.internName.toLowerCase().includes(q) ||
        item.internEmail.toLowerCase().includes(q) ||
        item.blockers.toLowerCase().includes(q) ||
        item.doneYesterday.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <PageHeader
        title="Daily Standups & EOD Desk"
        subtitle="Submit daily updates, identify hidden risks with Gemini, and unblock engineers in real time."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Submission Form (5 Cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-100 dark:border-zinc-800">
            <div>
              <h3 className="text-sm font-semibold text-zinc-950 dark:text-white">
                Submit Your Daily EOD
              </h3>
              <p className="text-xs text-zinc-400">Awarded +20 XP on submission</p>
            </div>
            <div className="px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 font-mono text-[10px] font-bold border border-amber-200 dark:border-amber-500/20">
              +20 XP Bounty
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-500 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-500 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  readOnly
                  value={form.email}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-500 outline-none cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-500 mb-1">
                Tasks Completed Today
              </label>
              <textarea
                required
                rows={3}
                value={form.tasks}
                onChange={(e) => setForm({ ...form, tasks: e.target.value })}
                placeholder="• Completed API endpoint integration&#10;• Authored 12 unit assertions"
                className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-500 mb-1">
                Challenges Overcome
              </label>
              <textarea
                rows={2}
                value={form.challenges}
                onChange={(e) => setForm({ ...form, challenges: e.target.value })}
                placeholder="Encountered CORS preflight headers issue; resolved via middleware."
                className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                  Blockers (If Any)
                </label>
                <span className="text-[10px] text-rose-500 font-medium">Triggers P0 Escalation</span>
              </div>
              <textarea
                rows={2}
                value={form.blockers}
                onChange={(e) => setForm({ ...form, blockers: e.target.value })}
                placeholder="Write 'None' if unblocked. Otherwise specify dependency / API bottleneck."
                className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-500 mb-1">
                Tomorrow's Planned Quests
              </label>
              <textarea
                required
                rows={2}
                value={form.tomorrow}
                onChange={(e) => setForm({ ...form, tomorrow: e.target.value })}
                placeholder="• Benchmark latency across mobile clients&#10;• Sync with team lead"
                className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 rounded-xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 font-semibold text-xs hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Evaluating with Gemini...' : 'Submit Daily Update (+20 XP)'}</span>
            </button>
          </form>

          {/* Submission Feedback Toast */}
          {lastSubmission && (
            <div className="mt-4 p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-emerald-700 dark:text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>Update {lastSubmission.updateId} Recorded!</span>
              </div>
              <p className="text-zinc-600 dark:text-zinc-300 text-[11px]">
                {lastSubmission.sentimentHealth}
              </p>
              {lastSubmission.hasBlocker && (
                <div className="text-[11px] font-medium text-rose-600 dark:text-rose-400 mt-1">
                  ⚠️ P0 Blocker dispatched to Slack #incident-ops
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: EOD Feed & CTO Review (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-zinc-900 p-3 rounded-2xl border border-zinc-200 dark:border-zinc-800">
            {/* Filter Pills */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setFilter('all')}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  filter === 'all'
                    ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950'
                    : 'text-zinc-500 hover:text-zinc-950 dark:hover:text-white'
                }`}
              >
                All Updates
              </button>
              <button
                type="button"
                onClick={() => setFilter('blockers')}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  filter === 'blockers'
                    ? 'bg-rose-600 text-white'
                    : 'text-zinc-500 hover:text-rose-600'
                }`}
              >
                Blockers
              </button>
              <button
                type="button"
                onClick={() => setFilter('pending')}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  filter === 'pending'
                    ? 'bg-amber-600 text-white'
                    : 'text-zinc-500 hover:text-amber-600'
                }`}
              >
                Pending Review
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-zinc-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search engineer or blocker..."
                className="pl-8 pr-3 py-1.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-48"
              />
            </div>
          </div>

          {/* Cards List */}
          <div className="space-y-3">
            {filteredList.map((item) => {
              const isExpanded = expandedId === item.updateId;
              return (
                <div
                  key={item.updateId}
                  className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 shadow-sm space-y-3"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-xs">
                        {item.internName.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-zinc-950 dark:text-white">
                          {item.internName}
                        </h4>
                        <span className="text-[10px] text-zinc-400">
                          {item.internEmail} • {item.timestamp}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {item.hasBlocker ? (
                        <Badge color="rose">P0 Blocker</Badge>
                      ) : (
                        <Badge color="emerald">Clear</Badge>
                      )}
                      <span className="text-xs font-mono font-bold text-amber-500">
                        +{item.xpAwarded} XP
                      </span>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="text-xs space-y-1.5 text-zinc-700 dark:text-zinc-300">
                    <p className="whitespace-pre-line font-mono text-[11px] bg-zinc-50 dark:bg-zinc-950/60 p-2.5 rounded-xl border border-zinc-100 dark:border-zinc-800/80">
                      {item.doneYesterday}
                    </p>

                    <div>
                      <span className="font-semibold text-zinc-500">Tomorrow's Plan: </span>
                      <span>{item.plannedToday}</span>
                    </div>

                    {item.hasBlocker && (
                      <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-700 dark:text-rose-400">
                        <span className="font-bold">⚠️ Critical Blocker:</span> {item.blockers}
                      </div>
                    )}

                    <div className="text-[11px] text-zinc-400 flex items-center gap-2">
                      <Sparkles className="w-3 h-3 text-indigo-400" />
                      <span>{item.sentimentHealth}</span>
                    </div>
                  </div>

                  {/* CTO Feedback Section */}
                  <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="text-[11px] text-zinc-400">
                      Status: <strong className="text-zinc-800 dark:text-zinc-200">{item.reviewStatus}</strong>
                    </span>

                    {!item.reviewStatus.includes('Acknowledged') ? (
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <input
                          type="text"
                          value={ctoFeedbackMap[item.updateId] || ''}
                          onChange={(e) =>
                            setCtoFeedbackMap({ ...ctoFeedbackMap, [item.updateId]: e.target.value })
                          }
                          placeholder="CTO note / unblock instruction..."
                          className="px-2.5 py-1 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs flex-1 sm:w-60 outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => handleAcknowledge(item.updateId)}
                          className="px-3 py-1 rounded-lg bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 text-xs font-semibold hover:opacity-90 shrink-0"
                        >
                          Acknowledge
                        </button>
                      </div>
                    ) : (
                      item.ctoFeedback && (
                        <span className="text-[11px] text-emerald-600 dark:text-emerald-400 italic">
                          Feedback: "{item.ctoFeedback}"
                        </span>
                      )
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </div>
  );
};

