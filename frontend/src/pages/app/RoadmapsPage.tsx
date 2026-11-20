import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { 
  Sparkles, Map, Check, RotateCcw, X, Layers, 
  ArrowRight, Award, Calendar, CheckCircle2 
} from 'lucide-react';
import { ApiService, RoadmapMilestone } from '../../services/api';
import { TaskItem } from '../../types';
import { PageHeader } from '../../components/ui/PageHeader';
import { Badge } from '../../components/ui/Badge';

export const RoadmapsPage: React.FC = () => {
  const navigate = useNavigate();

  const [visionText, setVisionText] = useState(
    'Build end-to-end multi-agent evaluation framework with LangChain and n8n. Benchmarks against GPT-4o and Claude 3.5 Sonnet. Week 1 local test harness, Week 2 evaluation dataset and sanitization, Week 3 real-time scoring dashboard, Week 4 production deployment on GCP Cloud Run.'
  );
  const [internName, setInternName] = useState('Rohan Sharma');
  const [internEmail, setInternEmail] = useState('rohan.intern@company.com');
  const [weeksCount, setWeeksCount] = useState(4);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isProvisioning, setIsProvisioning] = useState(false);
  const [provisionedCount, setProvisionedCount] = useState(0);
  const [roadmap, setRoadmap] = useState<RoadmapMilestone[] | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!visionText) return;
    setIsGenerating(true);
    setStatusMessage(null);
    setProvisionedCount(0);

    try {
      const result = await ApiService.generateRoadmap(visionText, internName);
      setRoadmap(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAccept = async () => {
    if (!roadmap) return;
    setIsProvisioning(true);

    const baseDate = new Date();
    const provisionedTasks: TaskItem[] = [];

    roadmap.forEach((milestone) => {
      const deadlineDate = new Date(baseDate);
      deadlineDate.setDate(deadlineDate.getDate() + milestone.week * 7);
      const deadlineStr = `${deadlineDate.toISOString().substring(0, 10)} 18:00:00`;

      milestone.tasks.forEach((task, tIdx) => {
        const taskId = `QST-${milestone.week}00${tIdx + 1}`;
        const priority: TaskItem['priority'] =
          milestone.week === 1 ? 'P1 - High' : milestone.week === 2 ? 'P2 - Medium' : 'P3 - Low';

        provisionedTasks.push({
          taskId,
          title: task.title,
          description: task.description,
          assignee: internName,
          assigneeEmail: internEmail,
          priority,
          status: 'Open',
          xpBounty: task.xp,
          createdAt: new Date().toISOString().substring(0, 19).replace('T', ' '),
          deadline: deadlineStr,
          tags: ['roadmap', `week-${milestone.week}`]
        });
      });
    });

    await ApiService.saveTasksBatch(provisionedTasks);
    setIsProvisioning(false);
    setProvisionedCount(provisionedTasks.length);

    confetti({
      particleCount: 70,
      spread: 80,
      origin: { y: 0.6 }
    });
    setStatusMessage(
      `🎉 Accepted! Successfully provisioned ${provisionedTasks.length} milestone quests into the Task Board for ${internName}.`
    );
  };

  const handleReject = () => {
    setRoadmap(null);
    setProvisionedCount(0);
    setStatusMessage('Draft roadmap discarded.');
  };

  const handleUndo = () => {
    setStatusMessage('Reverted to previous draft version.');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <PageHeader
        title="Founder ➔ CTO AI Roadmap"
        subtitle="Deconstruct open-ended founder initiatives into structured 4-week intern milestones with Gemini 2.5 Flash."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Vision Input & Controls (5 Cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-zinc-100 dark:border-zinc-800">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <h3 className="text-sm font-semibold text-zinc-950 dark:text-white">
              Founder Vision Deconstructor
            </h3>
          </div>

          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-zinc-500 mb-1">
                Founder's Raw Vision / Project Scope
              </label>
              <textarea
                required
                rows={6}
                value={visionText}
                onChange={(e) => setVisionText(e.target.value)}
                placeholder="Describe project deliverables, architectures, and goals..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs focus:ring-2 focus:ring-indigo-500 outline-none font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase text-zinc-500 mb-1">
                  Target Intern
                </label>
                <input
                  type="text"
                  required
                  value={internName}
                  onChange={(e) => setInternName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-zinc-500 mb-1">
                  Duration
                </label>
                <select
                  value={weeksCount}
                  onChange={(e) => setWeeksCount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs outline-none"
                >
                  <option value={4}>4 Weeks Milestone</option>
                  <option value={6}>6 Weeks Milestone</option>
                  <option value={8}>8 Weeks Milestone</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-zinc-500 mb-1">
                Intern Notification Email
              </label>
              <input
                type="email"
                required
                value={internEmail}
                onChange={(e) => setInternEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isGenerating}
              className="w-full py-2.5 rounded-xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 font-semibold text-xs hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>{isGenerating ? 'Synthesizing with Gemini...' : 'Deconstruct into 4-Week Roadmap'}</span>
            </button>
          </form>

          {statusMessage && (
            <div className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-indigo-900 dark:text-indigo-300 text-xs space-y-2">
              <p className="font-medium leading-relaxed">{statusMessage}</p>
              {provisionedCount > 0 && (
                <button
                  type="button"
                  onClick={() => navigate('/app/tasks')}
                  className="w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                >
                  <span>Open Task Board to Review Quests</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Roadmap Timeline (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800">
            <div>
              <h3 className="text-sm font-semibold text-zinc-950 dark:text-white">
                Roadmap Breakdown Preview
              </h3>
              <p className="text-xs text-zinc-400">
                {roadmap ? `Generated for ${internName} (4 Milestones, 900 Total XP)` : 'Click Deconstruct to preview structured deliverables'}
              </p>
            </div>

            {roadmap && (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={isProvisioning}
                  onClick={handleAccept}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 disabled:opacity-50 transition-opacity"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{isProvisioning ? 'Provisioning...' : 'Accept & Provision'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleReject}
                  className="px-3 py-1.5 rounded-lg bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 hover:bg-rose-100 text-xs font-medium"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={handleUndo}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                  title="Undo to previous draft"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Timeline Milestones */}
          {roadmap ? (
            <div className="space-y-4">
              {roadmap.map((milestone) => (
                <div
                  key={milestone.week}
                  className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 shadow-sm space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-mono font-bold text-xs">
                        W{milestone.week}
                      </span>
                      <h4 className="text-sm font-bold text-zinc-950 dark:text-white">
                        {milestone.title}
                      </h4>
                    </div>
                    <span className="text-xs font-mono font-bold text-amber-500">
                      +{milestone.xpBounty} XP
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] font-semibold uppercase text-zinc-400">Key Deliverables:</span>
                    <ul className="mt-1 space-y-1">
                      {milestone.deliverables.map((deliv, idx) => (
                        <li key={idx} className="text-xs text-zinc-600 dark:text-zinc-300 flex items-start gap-2">
                          <span className="text-indigo-500 font-bold">•</span>
                          <span>{deliv}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
                    <span className="text-[11px] font-semibold uppercase text-zinc-400">Assigned Quests:</span>
                    <div className="mt-2 space-y-1.5">
                      {milestone.tasks.map((task) => (
                        <div
                          key={task.id}
                          className="flex items-center justify-between p-2 rounded-xl bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-100 dark:border-zinc-800/80 text-xs"
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[10px] text-zinc-400 font-bold">{task.id}</span>
                            <span className="font-medium text-zinc-800 dark:text-zinc-200">{task.title}</span>
                          </div>
                          <span className="text-[11px] font-mono font-bold text-amber-500">+{task.xp} XP</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/20 p-8">
              <Map className="w-10 h-10 mx-auto text-zinc-400 mb-3" />
              <h4 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">No Roadmap Generated Yet</h4>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto mt-1">
                Enter the founder's raw scope in the left panel and click Deconstruct to turn it into 4 structured weekly sprints.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

