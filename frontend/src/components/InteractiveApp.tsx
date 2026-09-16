import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, AlertOctagon, Send, Sparkles, 
  Calendar, Award, UserPlus, RefreshCw, X,
  Shield, ArrowUpRight, Flame, Search, TrendingUp, TrendingDown,
  Activity, BarChart3, CheckSquare, Layers, LayoutGrid, ListFilter
} from 'lucide-react';
import { ApiService, InternEodItem, ApplicantItem, RoadmapMilestone } from '../services/api';

interface InteractiveAppProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onBlockerUpdate: (count: number) => void;
  onShowToast?: (toast: { type: 'success' | 'error' | 'info'; title: string; description?: string }) => void;
}

export const InteractiveApp: React.FC<InteractiveAppProps> = ({
  activeTab,
  setActiveTab,
  onBlockerUpdate,
  onShowToast
}) => {
  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [applicantViewMode, setApplicantViewMode] = useState<'table' | 'kanban'>('kanban');

  // EOD State
  const [eodList, setEodList] = useState<InternEodItem[]>([]);
  const [eodFilter, setEodFilter] = useState<'all' | 'blockers' | 'pending'>('all');
  const [selectedEod, setSelectedEod] = useState<InternEodItem | null>(null);
  const [ctoFeedback, setCtoFeedback] = useState('');
  const [isSubmittingEod, setIsSubmittingEod] = useState(false);
  const [eodForm, setEodForm] = useState({
    name: 'Rohan Sharma',
    email: 'rohan.intern@company.com',
    tasks: '• Finalized image cache layer with client preloader\n• Validated Cloudflare tunnel connection',
    challenges: 'Faced CORS preflight delays on mobile; resolved by setting allowed headers.',
    blockers: 'Dependencies on external quota limit for Vertex AI API.',
    tomorrow: '• Run precision-recall eval benchmarks\n• Prepare demo for CTO weekly sync'
  });
  const [lastSubmissionResult, setLastSubmissionResult] = useState<any>(null);

  // Roadmap State
  const [founderWork, setFounderWork] = useState(
    'Build end-to-end multi-agent evaluation framework with LangChain and n8n. Benchmarks against GPT-4o and Claude 3.5 Sonnet. Week 1 local harness, Week 2 evaluation dataset, Week 3 live scoring dashboard, Week 4 production deployment on GCP.'
  );
  const [internName, setInternName] = useState('Rohan Sharma');
  const [roadmap, setRoadmap] = useState<RoadmapMilestone[] | null>(null);
  const [isGeneratingRoadmap, setIsGeneratingRoadmap] = useState(false);
  const [acceptedRoadmap, setAcceptedRoadmap] = useState(false);

  // Applicant State
  const [applicants, setApplicants] = useState<ApplicantItem[]>([]);
  const [selectedApplicant, setSelectedApplicant] = useState<ApplicantItem | null>(null);
  const [applicantActionFeedback, setApplicantActionFeedback] = useState('');
  const [newApplicantForm, setNewApplicantForm] = useState({
    name: '',
    email: '',
    role: 'AI Systems Engineering Intern',
    skills: 'PyTorch, LangChain, n8n',
    resumeUrl: 'https://drive.google.com/sample_resume'
  });
  const [showAddApplicant, setShowAddApplicant] = useState(false);

  // Meeting State
  const [meetForm, setMeetForm] = useState({
    attendees: 'rohan.intern@company.com',
    title: '1-on-1 CTO Blocker Resolution & Mentorship',
    type: 'Incident Triage',
    duration: '30'
  });
  const [scheduledMeeting, setScheduledMeeting] = useState<any>(null);

  // Analytics State
  const [coachingResult] = useState<any>({
    intern: 'Rohan Sharma',
    reliabilityScore: 94,
    blockerResolutionTime: '< 2.4 hrs',
    currentLevel: 'Level 4 (Senior Apprentice)',
    xpTotal: '1,420 XP',
    streakDays: 14,
    aiFeedback: [
      'High velocity on API integration and test harness milestones.',
      'Proactive blocker escalation allows CTO to unblock dependencies within hours.',
      'Recommendation: Add automated regression suites for week 3 evaluation harness.'
    ]
  });

  // Load initial data
  useEffect(() => {
    loadEods();
    loadApplicants();
  }, []);

  const loadEods = async () => {
    const list = await ApiService.getRecentEods();
    setEodList(list);
    const blockers = list.filter(x => x.hasBlocker && !x.reviewStatus.includes('Acknowledged')).length;
    onBlockerUpdate(blockers);
  };

  const loadApplicants = async () => {
    const list = await ApiService.getApplicants();
    setApplicants(list);
  };

  // EOD Handlers
  const handleSubmitEod = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eodForm.email || !eodForm.tasks) {
      alert('Email and Tasks Completed are required.');
      return;
    }
    setIsSubmittingEod(true);

    try {
      const result = await ApiService.submitInternEod({
        internName: eodForm.name,
        internEmail: eodForm.email,
        tasksCompleted: eodForm.tasks,
        challengesOvercome: eodForm.challenges,
        blockers: eodForm.blockers,
        tomorrowPlan: eodForm.tomorrow
      });

      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.7 }
      });

      setLastSubmissionResult(result);
      if (onShowToast) {
        onShowToast({
          type: 'success',
          title: 'Daily EOD Submitted (+20 XP)',
          description: `Logged update ${result.updateId}. Sentiment: ${result.sentimentHealth}`
        });
      }
      await loadEods();
    } catch (err: any) {
      if (onShowToast) {
        onShowToast({
          type: 'error',
          title: 'Submission Error',
          description: err.message
        });
      } else {
        alert('Submission error: ' + err.message);
      }
    } finally {
      setIsSubmittingEod(false);
    }
  };

  const handleAcknowledgeEod = async () => {
    if (!selectedEod) return;
    await ApiService.acknowledgeEod(selectedEod.updateId, ctoFeedback);
    const targetId = selectedEod.updateId;
    const targetEmail = selectedEod.internEmail;
    setCtoFeedback('');
    setSelectedEod(null);
    await loadEods();

    if (onShowToast) {
      onShowToast({
        type: 'success',
        title: 'Blocker Acknowledged & Resolved',
        description: `EOD ${targetId} marked resolved. Resolution email delivered to ${targetEmail}.`
      });
    }
  };

  // Roadmap Handlers
  const handleGenerateRoadmap = async () => {
    setIsGeneratingRoadmap(true);
    setAcceptedRoadmap(false);
    try {
      const res = await ApiService.generateRoadmap(founderWork, internName);
      setRoadmap(res);
      if (onShowToast) {
        onShowToast({
          type: 'success',
          title: '4-Week Roadmap Decomposed',
          description: `Generated milestones, tickets, and XP bounties for ${internName}.`
        });
      }
    } catch (err: any) {
      if (onShowToast) {
        onShowToast({
          type: 'error',
          title: 'Roadmap Generation Failed',
          description: err.message
        });
      }
    } finally {
      setIsGeneratingRoadmap(false);
    }
  };

  // Applicant Handlers
  const handleDecideApplicant = async (decision: 'Selected' | 'Rejected') => {
    if (!selectedApplicant) return;
    const name = selectedApplicant.name;
    const appId = selectedApplicant.appId;
    await ApiService.decideApplicant(appId, decision, applicantActionFeedback);
    setSelectedApplicant(null);
    setApplicantActionFeedback('');
    await loadApplicants();

    if (onShowToast) {
      onShowToast({
        type: decision === 'Selected' ? 'success' : 'info',
        title: `Candidate ${decision}`,
        description: `${name} (${appId}) marked as ${decision}. Notification email dispatched.`
      });
    }
  };

  const handleAddApplicant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newApplicantForm.name || !newApplicantForm.email) return;
    await ApiService.submitApplication(newApplicantForm);
    const name = newApplicantForm.name;
    setShowAddApplicant(false);
    setNewApplicantForm({
      name: '',
      email: '',
      role: 'AI Systems Engineering Intern',
      skills: 'PyTorch, LangChain, n8n',
      resumeUrl: 'https://drive.google.com/sample_resume'
    });
    await loadApplicants();

    if (onShowToast) {
      onShowToast({
        type: 'success',
        title: 'Applicant Ingested',
        description: `${name} added to the talent pipeline.`
      });
    }
  };

  // Meeting Handlers
  const handleScheduleMeet = () => {
    const meetId = Math.random().toString(36).substring(2, 5) + '-' + 
                   Math.random().toString(36).substring(2, 6) + '-' + 
                   Math.random().toString(36).substring(2, 5);
    const result = {
      meetLink: `https://meet.google.com/${meetId}`,
      title: meetForm.title,
      attendees: meetForm.attendees,
      duration: meetForm.duration,
      agenda: [
        '1. Blocker Triage and Root Cause Clarification',
        '2. Architectural Review with CTO',
        '3. Milestone Roadmap Alignment'
      ]
    };
    setScheduledMeeting(result);

    if (onShowToast) {
      onShowToast({
        type: 'success',
        title: 'Google Meet Dispatched',
        description: `Invite & AI agenda sent to ${meetForm.attendees}.`
      });
    }
  };

  // Active Critical Blocker in state
  const activeCriticalBlocker = eodList.find(x => x.hasBlocker && !x.reviewStatus.includes('Acknowledged'));

  const filteredEods = eodList.filter(item => {
    if (eodFilter === 'blockers' && !item.hasBlocker) return false;
    if (eodFilter === 'pending' && item.reviewStatus.includes('Acknowledged')) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        item.internName.toLowerCase().includes(q) ||
        item.internEmail.toLowerCase().includes(q) ||
        item.updateId.toLowerCase().includes(q) ||
        item.blockers.toLowerCase().includes(q) ||
        item.doneYesterday.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <section id="command-center" className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-zinc-200 dark:border-zinc-800 gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-mono font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4" />
            <span>Interactive Operational Workspace</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-950 dark:text-white tracking-tight">
            Questo Enterprise Control Center
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
            Real-time multi-agent workflows running on Google Sheets, Gemini 2.5 Flash, and n8n.
          </p>
        </div>

        {/* Live Synchronized Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-mono text-zinc-600 dark:text-zinc-300 self-start md:self-auto">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Synchronized with 8 Google Sheets Tabs</span>
        </div>
      </div>

      {/* Nav Tab Controls */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 border-b border-zinc-200 dark:border-zinc-800/80">
        <button
          type="button"
          onClick={() => setActiveTab('eod')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-medium text-sm transition-colors whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
            activeTab === 'eod'
              ? 'bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-white border border-indigo-200 dark:border-indigo-500/40 shadow-sm'
              : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900'
          }`}
        >
          <span>Intern Daily EOD & Blocker Desk</span>
          {activeCriticalBlocker && (
            <span className="bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full animate-pulse">
              1 Alert
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('roadmap')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-medium text-sm transition-colors whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
            activeTab === 'roadmap'
              ? 'bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-white border border-indigo-200 dark:border-indigo-500/40 shadow-sm'
              : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900'
          }`}
        >
          <span>Founder ➔ CTO AI Roadmap</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('applicants')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-medium text-sm transition-colors whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
            activeTab === 'applicants'
              ? 'bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-white border border-indigo-200 dark:border-indigo-500/40 shadow-sm'
              : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900'
          }`}
        >
          <span>Talent & Candidate Pipeline</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('meetings')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-medium text-sm transition-colors whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
            activeTab === 'meetings'
              ? 'bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-white border border-indigo-200 dark:border-indigo-500/40 shadow-sm'
              : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900'
          }`}
        >
          <span>Instant Meet Scheduler</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-medium text-sm transition-colors whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
            activeTab === 'analytics'
              ? 'bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-white border border-indigo-200 dark:border-indigo-500/40 shadow-sm'
              : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900'
          }`}
        >
          <span>Team Velocity & Coaching Radar</span>
        </button>
      </div>

      {/* ==================== TAB 1: INTERN DAILY EOD & CTO BLOCKER DESK ==================== */}
      {activeTab === 'eod' && (
        <div className="space-y-6">
          
          {/* Real-time Blocker Alert Callout Banner */}
          {activeCriticalBlocker && (
            <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-rose-900 dark:text-rose-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg shadow-rose-950/20">
              <div className="flex items-start gap-3">
                <AlertOctagon className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-sm text-zinc-950 dark:text-white flex items-center gap-2">
                    <span>CRITICAL BLOCKER: {activeCriticalBlocker.internName} is blocked!</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-700 dark:text-rose-300">
                      {activeCriticalBlocker.updateId}
                    </span>
                  </div>
                  <p className="text-xs text-rose-800 dark:text-rose-200/90 mt-0.5 line-clamp-1">
                    "{activeCriticalBlocker.blockers}"
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedEod(activeCriticalBlocker)}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition-colors shrink-0 shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
              >
                Review & Resolve Blocker
              </button>
            </div>
          )}

          {/* Antigravity Split Screen Master-Detail Layout */}
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            
            {/* Left Column: Submission Form */}
            <div className={`transition-[width] duration-300 ${selectedEod ? 'w-full lg:w-4/12' : 'w-full lg:w-5/12'} p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm dark:shadow-xl`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                    <Send className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-zinc-950 dark:text-white">Intern Daily EOD Portal</h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">Accomplishments, challenges, and blockers</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[11px] font-mono font-bold text-indigo-600 dark:text-indigo-400">
                  +20 XP
                </span>
              </div>

              <form onSubmit={handleSubmitEod} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1">Intern Name</label>
                    <input
                      type="text"
                      value={eodForm.name}
                      onChange={e => setEodForm({...eodForm, name: e.target.value})}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1">Intern Email</label>
                    <input
                      type="email"
                      value={eodForm.email}
                      onChange={e => setEodForm({...eodForm, email: e.target.value})}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Tasks completed today:
                  </label>
                  <textarea
                    rows={2}
                    value={eodForm.tasks}
                    onChange={e => setEodForm({...eodForm, tasks: e.target.value})}
                    placeholder="List key tasks completed..."
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Challenges encountered & how you overcame them:
                  </label>
                  <textarea
                    rows={2}
                    value={eodForm.challenges}
                    onChange={e => setEodForm({...eodForm, challenges: e.target.value})}
                    placeholder="Describe technical friction and resolution..."
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-rose-600 dark:text-rose-300 mb-1">
                    Blockers faced (challenges you couldn't overcome):
                  </label>
                  <textarea
                    rows={2}
                    value={eodForm.blockers}
                    onChange={e => setEodForm({...eodForm, blockers: e.target.value})}
                    placeholder="Specify blockers for CTO escalation, or 'None'..."
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-rose-300 dark:border-rose-500/30 text-xs text-rose-900 dark:text-rose-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Planned objectives for tomorrow:
                  </label>
                  <textarea
                    rows={2}
                    value={eodForm.tomorrow}
                    onChange={e => setEodForm({...eodForm, tomorrow: e.target.value})}
                    placeholder="Tomorrow's milestones..."
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:border-transparent"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingEod}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold text-xs shadow-md shadow-indigo-500/25 transition-colors flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                >
                  {isSubmittingEod ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Submit Daily EOD & Run Gemini Sentinel (+20 XP)</span>
                    </>
                  )}
                </button>
              </form>

              {/* Real-time AI Sentiment & Sentinel Result Card */}
              {lastSubmissionResult && (
                <div className="mt-4 p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-indigo-200 dark:border-indigo-500/30 text-xs space-y-1.5 font-mono">
                  <div className="flex items-center justify-between text-indigo-600 dark:text-indigo-400 font-bold">
                    <span>Logged: {lastSubmissionResult.updateId}</span>
                    <span className="text-emerald-600 dark:text-emerald-400">+20 XP Awarded</span>
                  </div>
                  <div className="text-zinc-800 dark:text-zinc-300">
                    <strong>Sentiment:</strong> {lastSubmissionResult.sentimentHealth}
                  </div>
                  <div className={lastSubmissionResult.hasBlocker ? 'text-rose-600 dark:text-rose-400 font-semibold' : 'text-zinc-500 dark:text-zinc-400'}>
                    <strong>Risks:</strong> {lastSubmissionResult.extractedRisks}
                  </div>
                  <div className="text-cyan-600 dark:text-cyan-300">
                    <strong>CTO Advice:</strong> {lastSubmissionResult.suggestedAdvice}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: EOD Standup Feed Table (Dynamic flex width) */}
            <div className={`transition-[width] duration-300 ${selectedEod ? 'w-full lg:w-4/12' : 'w-full lg:w-7/12'} p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm dark:shadow-xl`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <h3 className="text-base font-bold text-zinc-950 dark:text-white flex items-center gap-2">
                    <span>Live Daily EOD Feed</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-mono">
                      {filteredEods.length} reports
                    </span>
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">Real-time submissions and risk scoring</p>
                </div>

                {/* Filter & Search Bar */}
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-zinc-400" />
                    <input
                      type="text"
                      placeholder="Search report or blocker..."
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      className="pl-8 pr-3 py-1.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:border-transparent w-40 sm:w-44"
                    />
                  </div>

                  <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-950 p-1 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                    <button
                      type="button"
                      onClick={() => setEodFilter('all')}
                      className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                        eodFilter === 'all' ? 'bg-indigo-600 text-white' : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
                      }`}
                    >
                      All
                    </button>
                    <button
                      type="button"
                      onClick={() => setEodFilter('blockers')}
                      className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                        eodFilter === 'blockers' ? 'bg-rose-600 text-white' : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
                      }`}
                    >
                      Blockers
                    </button>
                    <button
                      type="button"
                      onClick={() => setEodFilter('pending')}
                      className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                        eodFilter === 'pending' ? 'bg-indigo-600 text-white' : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
                      }`}
                    >
                      Pending
                    </button>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400">
                      <th className="pb-2.5 font-semibold">Report</th>
                      <th className="pb-2.5 font-semibold">Intern</th>
                      <th className="pb-2.5 font-semibold">Health Score</th>
                      <th className="pb-2.5 font-semibold">Status</th>
                      <th className="pb-2.5 font-semibold text-right">Triage</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
                    {filteredEods.map((item) => {
                      const score = item.hasBlocker ? 60 : 95;
                      const isSelected = selectedEod?.updateId === item.updateId;
                      return (
                        <tr 
                          key={item.updateId} 
                          onClick={() => setSelectedEod(item)}
                          className={`cursor-pointer transition-colors ${
                            isSelected 
                              ? 'bg-indigo-50/80 dark:bg-indigo-900/30 font-medium' 
                              : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/40'
                          }`}
                        >
                          <td className="py-3 font-mono text-zinc-600 dark:text-zinc-300">
                            {item.updateId}
                          </td>
                          <td className="py-3">
                            <div className="font-semibold text-zinc-900 dark:text-white">{item.internName}</div>
                            <div className="text-[10px] text-zinc-400">{item.internEmail}</div>
                          </td>
                          <td className="py-3 w-28">
                            <div className="flex items-center justify-between text-[10px] font-mono mb-1 text-zinc-500 dark:text-zinc-400">
                              <span>{score}%</span>
                              <span>{item.hasBlocker ? 'Risk' : 'Good'}</span>
                            </div>
                            <div className="w-full h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden">
                              <div 
                                className={`h-full rounded-full transition-[width] duration-300 ${
                                  item.hasBlocker ? 'bg-rose-500' : 'bg-emerald-500'
                                }`} 
                                style={{ width: `${score}%` }} 
                              />
                            </div>
                          </td>
                          <td className="py-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                              item.hasBlocker && !item.reviewStatus.includes('Acknowledged')
                                ? 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300 border border-rose-200 dark:border-rose-500/30'
                                : item.reviewStatus.includes('Acknowledged')
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30'
                                : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30'
                            }`}>
                              {item.reviewStatus}
                            </span>
                          </td>
                          <td className="py-3 text-right">
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); setSelectedEod(item); }}
                              className="px-2.5 py-1 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-white text-xs font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                            >
                              Inspect
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

            </div>

            {/* Antigravity Spec: Slide-Over Inspection Drawer (w-4/12 when selected) */}
            {selectedEod && (
              <div className="w-full lg:w-4/12 p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-indigo-300 dark:border-indigo-500/40 shadow-2xl space-y-4 animate-scale-in">
                <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span className="text-sm font-bold text-zinc-950 dark:text-white">
                      CTO Triage: {selectedEod.updateId}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedEod(null)}
                    className="p-1.5 rounded-xl text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs space-y-2">
                  <div>
                    <span className="text-zinc-400">Intern:</span>{' '}
                    <strong className="text-zinc-900 dark:text-white">{selectedEod.internName}</strong> ({selectedEod.internEmail})
                  </div>
                  <div>
                    <span className="text-zinc-400">Tasks Completed:</span>
                    <p className="text-zinc-700 dark:text-zinc-300 font-mono text-[11px] mt-0.5 whitespace-pre-line">
                      {selectedEod.doneYesterday}
                    </p>
                  </div>
                  <div>
                    <span className="text-zinc-400">Blockers:</span>
                    <p className={`font-mono text-[11px] mt-0.5 ${selectedEod.hasBlocker ? 'text-rose-600 dark:text-rose-400 font-semibold' : 'text-zinc-500'}`}>
                      {selectedEod.blockers}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-[11px]">
                    <span className="text-indigo-600 dark:text-indigo-400 font-semibold">Gemini Assessment:</span>
                    <span className="font-mono text-zinc-600 dark:text-zinc-300">{selectedEod.sentimentHealth}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    CTO Guidance / Resolution (Email dispatched):
                  </label>
                  <textarea
                    rows={3}
                    value={ctoFeedback}
                    onChange={e => setCtoFeedback(e.target.value)}
                    placeholder="e.g. Quota approved on Google Cloud Project. Please re-run the benchmark..."
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:border-transparent"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={handleAcknowledgeEod}
                    className="w-full py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow transition-colors flex items-center justify-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Acknowledge & Deliver Guidance</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('meetings');
                      setMeetForm(prev => ({
                        ...prev,
                        attendees: selectedEod.internEmail,
                        title: `CTO Blocker Triage: ${selectedEod.internName} (${selectedEod.updateId})`
                      }));
                    }}
                    className="w-full py-2.5 rounded-2xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Schedule 1-on-1 Google Meet</span>
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>
      )}

      {/* ==================== TAB 2: FOUNDER -> CTO AI ROADMAP ==================== */}
      {activeTab === 'roadmap' && (
        <div className="space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm dark:shadow-xl">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 mb-2">
              <Sparkles className="w-5 h-5" />
              <span className="text-xs font-mono font-semibold uppercase">Gemini 2.5 Flash Work Decomposer</span>
            </div>
            <h3 className="text-lg font-bold text-zinc-950 dark:text-white mb-2">
              Translate Raw Founder Specs into 4-Week Milestone Roadmaps
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-6">
              Enter unstructured engineering objectives or founder vision. Gemini translates them into sequential deliverables, task tickets, and XP bounties.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1">Target Intern / Engineer Name</label>
                <input
                  type="text"
                  value={internName}
                  onChange={e => setInternName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:border-transparent"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Founder / Executive Objective Description:
              </label>
              <textarea
                rows={3}
                value={founderWork}
                onChange={e => setFounderWork(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:border-transparent"
              />
            </div>

            <button
              type="button"
              onClick={handleGenerateRoadmap}
              disabled={isGeneratingRoadmap}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold text-xs shadow-md shadow-indigo-500/25 transition-colors flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              {isGeneratingRoadmap ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Decomposing Milestones with Gemini...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate 4-Week Milestone Roadmap</span>
                </>
              )}
            </button>
          </div>

          {/* Generated Roadmap Timeline */}
          {roadmap && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-base font-bold text-zinc-950 dark:text-white">
                  Generated 4-Week Milestone Plan for {internName}
                </h4>
                <button
                  type="button"
                  onClick={() => {
                    setAcceptedRoadmap(true);
                    confetti({ particleCount: 50, spread: 60 });
                    if (onShowToast) {
                      onShowToast({
                        type: 'success',
                        title: 'Roadmap Accepted',
                        description: `Dedicated Google Sheet provisioned: 'Intern - ${internName}'. Confirmation dispatched.`
                      });
                    }
                  }}
                  disabled={acceptedRoadmap}
                  className={`px-4 py-2 rounded-2xl text-xs font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                    acceptedRoadmap
                      ? 'bg-emerald-600 text-white'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow'
                  }`}
                >
                  {acceptedRoadmap ? 'Sheet Provisioned & Sent' : 'Accept & Provision Google Sheet'}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {roadmap.map(milestone => (
                  <div key={milestone.week} className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30">
                        WEEK {milestone.week}
                      </span>
                      <span className="text-xs font-mono font-bold text-amber-500 dark:text-amber-400">
                        +{milestone.xpBounty} XP Bounty
                      </span>
                    </div>

                    <h5 className="font-bold text-sm text-zinc-950 dark:text-white">{milestone.title}</h5>

                    <div>
                      <div className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 mb-1">Deliverables:</div>
                      <ul className="space-y-1">
                        {milestone.deliverables.map((d, i) => (
                          <li key={i} className="text-xs text-zinc-700 dark:text-zinc-300 flex items-start gap-1.5">
                            <span className="text-indigo-500 font-bold">•</span>
                            <span>{d}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
                      <div className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 mb-2">Task Tickets:</div>
                      <div className="space-y-1.5">
                        {milestone.tasks.map(t => (
                          <div key={t.id} className="p-2 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-mono text-zinc-400">{t.id}</span>
                              <span className="text-zinc-800 dark:text-white font-medium">{t.title}</span>
                            </div>
                            <span className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400 font-bold">+{t.xp} XP</span>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ==================== TAB 3: TALENT & CANDIDATE PIPELINE ==================== */}
      {activeTab === 'applicants' && (
        <div className="space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm dark:shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="text-base font-bold text-zinc-950 dark:text-white">Talent Pipeline & Fast-Track Decision Engine</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Review candidate applicants and dispatch offer/rejection emails via Gmail</p>
              </div>

              <div className="flex items-center gap-2">
                {/* View Mode Toggle */}
                <div className="flex items-center gap-1 p-1 bg-zinc-100 dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                  <button
                    type="button"
                    onClick={() => setApplicantViewMode('kanban')}
                    title="Kanban Board View"
                    className={`p-1.5 rounded-xl transition-colors ${
                      applicantViewMode === 'kanban' 
                        ? 'bg-indigo-600 text-white' 
                        : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
                    }`}
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setApplicantViewMode('table')}
                    title="Table View"
                    className={`p-1.5 rounded-xl transition-colors ${
                      applicantViewMode === 'table' 
                        ? 'bg-indigo-600 text-white' 
                        : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
                    }`}
                  >
                    <ListFilter className="w-4 h-4" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setShowAddApplicant(!showAddApplicant)}
                  className="px-3.5 py-2 rounded-2xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white text-xs font-semibold transition-colors flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>{showAddApplicant ? 'Close Form' : 'Ingest Candidate'}</span>
                </button>
              </div>
            </div>

            {/* Ingest Candidate Form */}
            {showAddApplicant && (
              <form onSubmit={handleAddApplicant} className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 mb-6 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1">Candidate Name</label>
                    <input
                      type="text"
                      required
                      value={newApplicantForm.name}
                      onChange={e => setNewApplicantForm({...newApplicantForm, name: e.target.value})}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1">Candidate Email</label>
                    <input
                      type="email"
                      required
                      value={newApplicantForm.email}
                      onChange={e => setNewApplicantForm({...newApplicantForm, email: e.target.value})}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1">Target Role</label>
                    <input
                      type="text"
                      value={newApplicantForm.role}
                      onChange={e => setNewApplicantForm({...newApplicantForm, role: e.target.value})}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1">Skills</label>
                    <input
                      type="text"
                      value={newApplicantForm.skills}
                      onChange={e => setNewApplicantForm({...newApplicantForm, skills: e.target.value})}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:border-transparent"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                >
                  Save Candidate
                </button>
              </form>
            )}

            {/* Selected Applicant Decision Drawer */}
            {selectedApplicant && (
              <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-indigo-300 dark:border-indigo-500/40 mb-6 space-y-3 animate-scale-in">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-zinc-950 dark:text-white">
                    CTO Decision for: {selectedApplicant.name} ({selectedApplicant.appId})
                  </span>
                  <button 
                    type="button"
                    onClick={() => setSelectedApplicant(null)} 
                    className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white p-1 rounded-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-xs text-zinc-700 dark:text-zinc-300">
                  Role: <strong className="text-zinc-950 dark:text-white">{selectedApplicant.role}</strong> | Skills: {selectedApplicant.skills}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1">
                    Personalized Notes / Guidance for Candidate:
                  </label>
                  <textarea
                    rows={2}
                    value={applicantActionFeedback}
                    onChange={e => setApplicantActionFeedback(e.target.value)}
                    placeholder="Enter interview notes or offer welcome message..."
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:border-transparent"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleDecideApplicant('Selected')}
                    className="flex-1 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                  >
                    Select Candidate & Send Offer Email
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDecideApplicant('Rejected')}
                    className="flex-1 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
                  >
                    Courteous Rejection Email
                  </button>
                </div>
              </div>
            )}

            {/* Kanban View */}
            {applicantViewMode === 'kanban' ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { title: 'In Review', status: 'Applied', color: 'border-indigo-500/30' },
                  { title: 'Selected / Offer', status: 'Selected', color: 'border-emerald-500/30' },
                  { title: 'Archive / Rejected', status: 'Rejected', color: 'border-zinc-500/30' }
                ].map(col => {
                  const colItems = applicants.filter(a => {
                    if (col.status === 'Applied') return a.decision === 'Pending';
                    return a.decision === col.status;
                  });
                  return (
                    <div key={col.status} className={`p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border ${col.color}`}>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold text-zinc-900 dark:text-white">{col.title}</span>
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                          {colItems.length}
                        </span>
                      </div>

                      <div className="space-y-2.5">
                        {colItems.map(c => (
                          <div
                            key={c.appId}
                            onClick={() => setSelectedApplicant(c)}
                            className="p-3.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:border-indigo-500/40 cursor-pointer transition-colors"
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-bold text-xs text-zinc-900 dark:text-white">{c.name}</span>
                              <span className="text-[10px] font-mono text-zinc-400">{c.appId}</span>
                            </div>
                            <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mb-2">{c.role}</div>
                            <div className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 p-1.5 rounded-lg border border-indigo-100 dark:border-indigo-900/40 truncate">
                              {c.skills}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Table View */
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400">
                      <th className="pb-2.5 font-semibold">App ID</th>
                      <th className="pb-2.5 font-semibold">Candidate</th>
                      <th className="pb-2.5 font-semibold">Target Role</th>
                      <th className="pb-2.5 font-semibold">Key Skills</th>
                      <th className="pb-2.5 font-semibold">Decision</th>
                      <th className="pb-2.5 font-semibold text-right">Review</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
                    {applicants.map(c => (
                      <tr key={c.appId} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                        <td className="py-3 font-mono text-zinc-600 dark:text-zinc-300">{c.appId}</td>
                        <td className="py-3">
                          <div className="font-semibold text-zinc-900 dark:text-white">{c.name}</div>
                          <div className="text-[10px] text-zinc-400">{c.email}</div>
                        </td>
                        <td className="py-3 text-zinc-700 dark:text-zinc-300">{c.role}</td>
                        <td className="py-3 text-zinc-500 dark:text-zinc-400 max-w-[200px] truncate">{c.skills}</td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            c.decision === 'Selected'
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30'
                              : c.decision === 'Rejected'
                              ? 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300 border border-rose-200 dark:border-rose-500/30'
                              : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30'
                          }`}>
                            {c.decision}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <button
                            type="button"
                            onClick={() => setSelectedApplicant(c)}
                            className="px-2.5 py-1 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-white text-xs font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                          >
                            Decide
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

          </div>
        </div>
      )}

      {/* ==================== TAB 4: INSTANT MEET SCHEDULER ==================== */}
      {activeTab === 'meetings' && (
        <div className="space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm dark:shadow-xl">
            <h3 className="text-base font-bold text-zinc-950 dark:text-white mb-1">Instant Google Meet Generator & AI Agenda</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-6">
              Create native Google Meet links with pre-meeting agendas dispatched directly to attendee calendars.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1">Meeting Title</label>
                <input
                  type="text"
                  value={meetForm.title}
                  onChange={e => setMeetForm({...meetForm, title: e.target.value})}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1">Attendee Email(s)</label>
                <input
                  type="text"
                  value={meetForm.attendees}
                  onChange={e => setMeetForm({...meetForm, attendees: e.target.value})}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1">Meeting Type</label>
                <select
                  value={meetForm.type}
                  onChange={e => setMeetForm({...meetForm, type: e.target.value})}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:border-transparent"
                >
                  <option>Incident Triage</option>
                  <option>1-on-1 Mentorship Sync</option>
                  <option>Architecture Review</option>
                  <option>Sprint & Milestone Planning</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1">Duration (Minutes)</label>
                <input
                  type="number"
                  value={meetForm.duration}
                  onChange={e => setMeetForm({...meetForm, duration: e.target.value})}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:border-transparent"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleScheduleMeet}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold text-xs shadow-md shadow-indigo-500/25 transition-colors flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              <Calendar className="w-4 h-4" />
              <span>Generate Google Meet & Dispatch Calendar Invite</span>
            </button>

            {scheduledMeeting && (
              <div className="mt-6 p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-emerald-300 dark:border-emerald-500/30 text-xs space-y-2 animate-scale-in">
                <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                  <span>Calendar Invite Dispatched</span>
                  <a
                    href={scheduledMeeting.meetLink}
                    target="_blank"
                    rel="noreferrer"
                    className="underline flex items-center gap-1 text-cyan-600 dark:text-cyan-300"
                  >
                    Join Meet Link: {scheduledMeeting.meetLink}
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
                <div className="text-zinc-700 dark:text-zinc-300">
                  <strong>Title:</strong> {scheduledMeeting.title} ({scheduledMeeting.duration} mins)
                </div>
                <div className="text-zinc-700 dark:text-zinc-300">
                  <strong>Attendees:</strong> {scheduledMeeting.attendees}
                </div>
                <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800">
                  <div className="font-semibold text-zinc-600 dark:text-zinc-400 mb-1">AI Generated Pre-Meeting Agenda:</div>
                  <ul className="space-y-1 text-zinc-700 dark:text-zinc-300">
                    {scheduledMeeting.agenda.map((item: string, idx: number) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* ==================== TAB 5: AI PERFORMANCE & VELOCITY RADAR ==================== */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm dark:shadow-xl">
            <h3 className="text-base font-bold text-zinc-950 dark:text-white mb-1">Continuous AI Performance & Health Coaching</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-6">
              Synthesize daily standup history, task completion rates, and blocker metrics into actionable coaching feedback.
            </p>

            {/* Metric Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
                <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mb-1">Delivery Reliability</div>
                <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
                  94.2%
                </div>
                <div className="w-full h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-700 mt-2 overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '94.2%' }} />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
                <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mb-1">Blocker Resolution</div>
                <div className="text-2xl font-bold font-mono text-indigo-600 dark:text-indigo-400">
                  &lt; 2.4 hrs
                </div>
                <div className="w-full h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-700 mt-2 overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: '85%' }} />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
                <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mb-1">Org Hierarchy Tier</div>
                <div className="text-base font-bold text-cyan-600 dark:text-cyan-300 truncate">
                  Senior Apprentice
                </div>
                <div className="text-[10px] text-zinc-400 font-mono mt-1">Level 4 • 1,420 XP</div>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
                <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mb-1">Submission Streak</div>
                <div className="text-2xl font-bold font-mono text-amber-500 dark:text-amber-400 flex items-center gap-1">
                  <Flame className="w-5 h-5 text-amber-500" />
                  <span>14 Days</span>
                </div>
                <div className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1">Active Pacing</div>
              </div>
            </div>

            {/* Visual 7-Day Velocity & Blocker Trend Chart */}
            <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-indigo-500" />
                  <span className="text-xs font-bold text-zinc-900 dark:text-white">7-Day Team Velocity & Blocker Triage Telemetry</span>
                </div>
                <div className="flex items-center gap-4 text-[11px] font-medium">
                  <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span>Tasks Completed</span>
                  </div>
                  <div className="flex items-center gap-1 text-rose-500">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    <span>Blockers Resolved</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-2 pt-4">
                {[
                  { day: 'Mon', tasks: 12, blockers: 2 },
                  { day: 'Tue', tasks: 16, blockers: 1 },
                  { day: 'Wed', tasks: 14, blockers: 3 },
                  { day: 'Thu', tasks: 19, blockers: 0 },
                  { day: 'Fri', tasks: 22, blockers: 1 },
                  { day: 'Sat', tasks: 8, blockers: 0 },
                  { day: 'Sun', tasks: 15, blockers: 1 },
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center gap-2">
                    <div className="w-full flex items-end justify-center gap-1.5 h-24 pb-1">
                      <div 
                        className="w-3.5 bg-emerald-500 rounded-t-sm transition-colors hover:bg-emerald-400" 
                        style={{ height: `${(item.tasks / 24) * 100}%` }}
                        title={`${item.tasks} tasks`}
                      />
                      <div 
                        className="w-2.5 bg-rose-500/80 rounded-t-sm transition-colors hover:bg-rose-400" 
                        style={{ height: `${(item.blockers / 5) * 80}%` }}
                        title={`${item.blockers} blockers`}
                      />
                    </div>
                    <span className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400">{item.day}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Coaching Guidance Box */}
            <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-indigo-200 dark:border-indigo-500/30 text-xs space-y-2">
              <div className="font-bold text-indigo-600 dark:text-indigo-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>Gemini 2.5 Flash Coaching Assessment:</span>
              </div>
              <ul className="space-y-1.5 text-zinc-700 dark:text-zinc-300">
                {coachingResult.aiFeedback.map((item: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
