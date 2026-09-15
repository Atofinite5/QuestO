import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, AlertTriangle, AlertOctagon, Send, Sparkles, 
  Calendar, Award, UserPlus, RefreshCw, ChevronRight, Check, X,
  FileText, Shield, ArrowUpRight, Flame, Clock
} from 'lucide-react';
import { ApiService, InternEodItem, ApplicantItem, RoadmapMilestone } from '../services/api';

interface InteractiveAppProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onBlockerUpdate: (count: number) => void;
}

export const InteractiveApp: React.FC<InteractiveAppProps> = ({
  activeTab,
  setActiveTab,
  onBlockerUpdate
}) => {
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
  const [selectedInternForCoaching, setSelectedInternForCoaching] = useState('Rohan Sharma');
  const [coachingResult, setCoachingResult] = useState<any>(null);

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

      // Confetti celebratory burst for completing EOD!
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.7 }
      });

      setLastSubmissionResult(result);
      await loadEods();
    } catch (err: any) {
      alert('Submission error: ' + err.message);
    } finally {
      setIsSubmittingEod(false);
    }
  };

  const handleAcknowledgeEod = async () => {
    if (!selectedEod) return;
    await ApiService.acknowledgeEod(selectedEod.updateId, ctoFeedback);
    setCtoFeedback('');
    setSelectedEod(null);
    await loadEods();
    alert(`EOD ${selectedEod.updateId} marked as Acknowledged. Resolution email delivered to ${selectedEod.internEmail}.`);
  };

  // Roadmap Handlers
  const handleGenerateRoadmap = async () => {
    setIsGeneratingRoadmap(true);
    setAcceptedRoadmap(false);
    try {
      const res = await ApiService.generateRoadmap(founderWork, internName);
      setRoadmap(res);
    } catch (err: any) {
      alert('Error generating roadmap: ' + err.message);
    } finally {
      setIsGeneratingRoadmap(false);
    }
  };

  // Applicant Handlers
  const handleDecideApplicant = async (decision: 'Selected' | 'Rejected') => {
    if (!selectedApplicant) return;
    await ApiService.decideApplicant(selectedApplicant.appId, decision, applicantActionFeedback);
    setSelectedApplicant(null);
    setApplicantActionFeedback('');
    await loadApplicants();
    alert(`Candidate ${selectedApplicant.name} marked as ${decision}. Notification email dispatched.`);
  };

  const handleAddApplicant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newApplicantForm.name || !newApplicantForm.email) return;
    await ApiService.submitApplication(newApplicantForm);
    setShowAddApplicant(false);
    setNewApplicantForm({
      name: '',
      email: '',
      role: 'AI Systems Engineering Intern',
      skills: 'PyTorch, LangChain, n8n',
      resumeUrl: 'https://drive.google.com/sample_resume'
    });
    await loadApplicants();
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
        '1. Blocker Triage & Technical Obstacle Root Cause Analysis',
        '2. Architectural Clarifications with CTO',
        '3. Milestone Alignment & Resource Allocation'
      ]
    };
    setScheduledMeeting(result);
  };

  // Analytics Handlers
  const handleRunCoaching = () => {
    setCoachingResult({
      intern: selectedInternForCoaching,
      reliabilityScore: '94.2%',
      blockerResolutionTime: '< 2.4 hrs',
      currentLevel: 'Level 4 (Senior Apprentice)',
      xpTotal: '1,420 XP',
      streakDays: 14,
      aiFeedback: [
        '🚀 Excellent momentum on API integration milestones.',
        '💡 Proactive blocker escalation allows CTO to unblock dependencies within hours.',
        '🎯 Recommendation: Encourage writing end-to-end integration tests for week 3 evaluation harness.'
      ]
    });
  };

  // Active Critical Blocker in state
  const activeCriticalBlocker = eodList.find(x => x.hasBlocker && !x.reviewStatus.includes('Acknowledged'));

  const filteredEods = eodList.filter(item => {
    if (eodFilter === 'blockers') return item.hasBlocker;
    if (eodFilter === 'pending') return !item.reviewStatus.includes('Acknowledged');
    return true;
  });

  return (
    <section id="command-center" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-white/[0.08] gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-mono font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4" />
            <span>Interactive Sandbox Environment</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Questo Enterprise Control Center
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Experience the real-time company intelligence engines running live in your browser.
          </p>
        </div>

        {/* Live Active Status Pill */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs font-mono text-slate-300 self-start md:self-auto">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Synchronized with 8 Google Sheets Tabs</span>
        </div>
      </div>

      {/* Nav Tab Controls */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 border-b border-white/[0.06]">
        <button
          onClick={() => setActiveTab('eod')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all whitespace-nowrap ${
            activeTab === 'eod'
              ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-white border border-indigo-500/40 shadow-lg shadow-indigo-500/10'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
          }`}
        >
          <span>📋 Intern Daily EOD & Blocker Desk</span>
          {activeCriticalBlocker && (
            <span className="bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full animate-pulse">
              🚨 1
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('roadmap')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all whitespace-nowrap ${
            activeTab === 'roadmap'
              ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-white border border-indigo-500/40 shadow-lg shadow-indigo-500/10'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
          }`}
        >
          <span>🤖 Founder &rarr; CTO AI Roadmap</span>
        </button>

        <button
          onClick={() => setActiveTab('applicants')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all whitespace-nowrap ${
            activeTab === 'applicants'
              ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-white border border-indigo-500/40 shadow-lg shadow-indigo-500/10'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
          }`}
        >
          <span>💼 Talent & Applicant Pipeline</span>
        </button>

        <button
          onClick={() => setActiveTab('meetings')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all whitespace-nowrap ${
            activeTab === 'meetings'
              ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-white border border-indigo-500/40 shadow-lg shadow-indigo-500/10'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
          }`}
        >
          <span>📅 Instant Meet Scheduler</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all whitespace-nowrap ${
            activeTab === 'analytics'
              ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-white border border-indigo-500/40 shadow-lg shadow-indigo-500/10'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
          }`}
        >
          <span>📈 AI Performance & Coaching</span>
        </button>
      </div>

      {/* ==================== TAB 1: INTERN DAILY EOD & CTO BLOCKER DESK ==================== */}
      {activeTab === 'eod' && (
        <div className="space-y-6">
          
          {/* Real-time Blocker Alert Callout Banner */}
          {activeCriticalBlocker && (
            <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-rose-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl shadow-rose-950/40 animate-pulse">
              <div className="flex items-start gap-3">
                <AlertOctagon className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-sm text-white flex items-center gap-2">
                    <span>🚨 CRITICAL BLOCKER: {activeCriticalBlocker.internName} is blocked!</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/30 text-rose-300">
                      {activeCriticalBlocker.updateId}
                    </span>
                  </div>
                  <p className="text-xs text-rose-200/90 mt-0.5 line-clamp-1">
                    "{activeCriticalBlocker.blockers}"
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedEod(activeCriticalBlocker)}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition-colors shrink-0 shadow-lg"
              >
                Review & Resolve Blocker
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column: Intern Daily EOD Submission Portal */}
            <div className="lg:col-span-5 p-6 rounded-2xl bg-[#0e111a] border border-white/[0.08] shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    <Send className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Intern Daily EOD Submission</h3>
                    <p className="text-xs text-slate-400">Accomplishments, challenges, and blockers</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[11px] font-mono font-bold text-indigo-400">
                  +20 XP
                </span>
              </div>

              <form onSubmit={handleSubmitEod} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Intern Name</label>
                    <input
                      type="text"
                      value={eodForm.name}
                      onChange={e => setEodForm({...eodForm, name: e.target.value})}
                      className="w-full px-3 py-2 rounded-lg bg-[#07090e] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Intern Email</label>
                    <input
                      type="email"
                      value={eodForm.email}
                      onChange={e => setEodForm({...eodForm, email: e.target.value})}
                      className="w-full px-3 py-2 rounded-lg bg-[#07090e] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    📋 Tasks completed today:
                  </label>
                  <textarea
                    rows={2}
                    value={eodForm.tasks}
                    onChange={e => setEodForm({...eodForm, tasks: e.target.value})}
                    placeholder="List key tasks completed..."
                    className="w-full px-3 py-2 rounded-lg bg-[#07090e] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    ⚡ Challenges encountered & how you overcame them:
                  </label>
                  <textarea
                    rows={2}
                    value={eodForm.challenges}
                    onChange={e => setEodForm({...eodForm, challenges: e.target.value})}
                    placeholder="Describe technical friction and resolution..."
                    className="w-full px-3 py-2 rounded-lg bg-[#07090e] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-rose-300 mb-1">
                    🚧 Blockers faced (challenges you couldn't overcome):
                  </label>
                  <textarea
                    rows={2}
                    value={eodForm.blockers}
                    onChange={e => setEodForm({...eodForm, blockers: e.target.value})}
                    placeholder="Specify blockers for CTO escalation, or 'None'..."
                    className="w-full px-3 py-2 rounded-lg bg-[#07090e] border border-rose-500/30 text-xs text-rose-100 focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    🎯 Planned objectives for tomorrow:
                  </label>
                  <textarea
                    rows={2}
                    value={eodForm.tomorrow}
                    onChange={e => setEodForm({...eodForm, tomorrow: e.target.value})}
                    placeholder="Tomorrow's milestones..."
                    className="w-full px-3 py-2 rounded-lg bg-[#07090e] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingEod}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold text-xs shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2"
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
                <div className="mt-4 p-3 rounded-xl bg-[#07090e] border border-indigo-500/30 text-xs space-y-1.5 font-mono">
                  <div className="flex items-center justify-between text-indigo-400 font-bold">
                    <span>✅ Logged: {lastSubmissionResult.updateId}</span>
                    <span className="text-emerald-400">+20 XP Awarded</span>
                  </div>
                  <div className="text-slate-300">
                    <strong>Sentiment:</strong> {lastSubmissionResult.sentimentHealth}
                  </div>
                  <div className={lastSubmissionResult.hasBlocker ? 'text-rose-400' : 'text-slate-400'}>
                    <strong>Risks:</strong> {lastSubmissionResult.extractedRisks}
                  </div>
                  <div className="text-cyan-300">
                    <strong>CTO Advice:</strong> {lastSubmissionResult.suggestedAdvice}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: CTO Blocker & Review Desk */}
            <div className="lg:col-span-7 space-y-4">
              
              {/* CTO Review Action Drawer (when a row is selected) */}
              {selectedEod ? (
                <div className="p-5 rounded-2xl bg-[#0e111a] border border-indigo-500/40 shadow-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-indigo-400" />
                      <span className="text-sm font-bold text-white">
                        CTO Resolution Panel: {selectedEod.updateId}
                      </span>
                    </div>
                    <button
                      onClick={() => setSelectedEod(null)}
                      className="p-1 rounded-lg text-slate-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-3 rounded-xl bg-[#07090e] border border-white/[0.06] text-xs space-y-1">
                    <div className="text-slate-300">
                      <strong>Intern:</strong> {selectedEod.internName} ({selectedEod.internEmail})
                    </div>
                    <div className="text-slate-300">
                      <strong>Reported Blocker:</strong>{' '}
                      <span className={selectedEod.hasBlocker ? 'text-rose-400 font-semibold' : 'text-slate-400'}>
                        {selectedEod.blockers}
                      </span>
                    </div>
                    <div className="text-indigo-300">
                      <strong>AI Health Assessment:</strong> {selectedEod.sentimentHealth}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      CTO Guidance / Resolution Notes (Delivered via email to intern):
                    </label>
                    <textarea
                      rows={3}
                      value={ctoFeedback}
                      onChange={e => setCtoFeedback(e.target.value)}
                      placeholder="e.g. Quota approved on Google Cloud Project. Please re-run the benchmark..."
                      className="w-full px-3 py-2 rounded-lg bg-[#07090e] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleAcknowledgeEod}
                      className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-lg transition-colors flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Acknowledge & Send Guidance to Intern</span>
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab('meetings');
                        setMeetForm(prev => ({
                          ...prev,
                          attendees: selectedEod.internEmail,
                          title: `CTO Blocker Triage: ${selectedEod.internName} (${selectedEod.updateId})`
                        }));
                      }}
                      className="px-4 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.12] text-white font-semibold text-xs transition-colors flex items-center gap-1.5"
                    >
                      <Calendar className="w-4 h-4" />
                      <span>Schedule 1-on-1 Sync</span>
                    </button>
                  </div>
                </div>
              ) : null}

              {/* Live EOD Standup Feed Table */}
              <div className="p-6 rounded-2xl bg-[#0e111a] border border-white/[0.08] shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <span>Live Daily EOD Feed</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-white/[0.06] text-slate-400 font-mono">
                        {eodList.length} total
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400">Chronological feed of team updates</p>
                  </div>

                  {/* Filter Pills */}
                  <div className="flex items-center gap-1 bg-[#07090e] p-1 rounded-xl border border-white/[0.06]">
                    <button
                      onClick={() => setEodFilter('all')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                        eodFilter === 'all' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setEodFilter('blockers')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                        eodFilter === 'blockers' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      🚨 Blockers Only
                    </button>
                    <button
                      onClick={() => setEodFilter('pending')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                        eodFilter === 'pending' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Pending
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-white/[0.08] text-slate-400">
                        <th className="pb-2.5 font-semibold">Report ID</th>
                        <th className="pb-2.5 font-semibold">Intern</th>
                        <th className="pb-2.5 font-semibold">Tasks Completed</th>
                        <th className="pb-2.5 font-semibold">Blockers</th>
                        <th className="pb-2.5 font-semibold">Status</th>
                        <th className="pb-2.5 font-semibold text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.04]">
                      {filteredEods.map((item) => (
                        <tr key={item.updateId} className="hover:bg-white/[0.02] transition-colors">
                          <td className="py-3 font-mono font-semibold text-slate-300">
                            {item.updateId}
                          </td>
                          <td className="py-3">
                            <div className="font-semibold text-white">{item.internName}</div>
                            <div className="text-[10px] text-slate-400">{item.internEmail}</div>
                          </td>
                          <td className="py-3 max-w-[180px]">
                            <p className="text-slate-300 truncate" title={item.doneYesterday}>
                              {item.doneYesterday.replace('📋 TASKS COMPLETED:\n', '')}
                            </p>
                          </td>
                          <td className="py-3 max-w-[160px]">
                            {item.hasBlocker ? (
                              <span className="text-rose-400 font-semibold truncate block" title={item.blockers}>
                                🚨 {item.blockers}
                              </span>
                            ) : (
                              <span className="text-slate-400">None</span>
                            )}
                          </td>
                          <td className="py-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                              item.hasBlocker && !item.reviewStatus.includes('Acknowledged')
                                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                : item.reviewStatus.includes('Acknowledged')
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                            }`}>
                              {item.reviewStatus}
                            </span>
                          </td>
                          <td className="py-3 text-right">
                            <button
                              onClick={() => setSelectedEod(item)}
                              className="px-2.5 py-1 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-white text-xs font-semibold transition-colors"
                            >
                              Review
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>

            </div>

          </div>

        </div>
      )}

      {/* ==================== TAB 2: FOUNDER -> CTO AI ROADMAP ==================== */}
      {activeTab === 'roadmap' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#0e111a] border border-white/[0.08] shadow-xl">
            <div className="flex items-center gap-2 text-indigo-400 mb-2">
              <Sparkles className="w-5 h-5" />
              <span className="text-xs font-mono font-semibold uppercase">Gemini 2.5 Flash Work Decomposer</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              Translate Raw Founder Specs into 4-Week Milestone Roadmaps
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Enter unstructured engineering objectives or founder ideas. Gemini translates them into sequential deliverables, task tickets, and XP bounties.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Intern Name</label>
                <input
                  type="text"
                  value={internName}
                  onChange={e => setInternName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#07090e] border border-white/[0.08] text-xs text-white"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Founder / Executive Objective Description:
              </label>
              <textarea
                rows={3}
                value={founderWork}
                onChange={e => setFounderWork(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#07090e] border border-white/[0.08] text-xs text-white"
              />
            </div>

            <button
              onClick={handleGenerateRoadmap}
              disabled={isGeneratingRoadmap}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold text-xs shadow-lg shadow-indigo-500/25 transition-all flex items-center gap-2"
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
                <h4 className="text-base font-bold text-white">
                  Generated 4-Week Milestone Plan for {internName}
                </h4>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setAcceptedRoadmap(true);
                      confetti({ particleCount: 50, spread: 60 });
                      alert(`Roadmap Accepted! Dedicated Google Sheet provisioned: '🎓 Intern - ${internName}'. Confirmation email sent.`);
                    }}
                    disabled={acceptedRoadmap}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                      acceptedRoadmap
                        ? 'bg-emerald-600 text-white'
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg'
                    }`}
                  >
                    {acceptedRoadmap ? '✅ Sheet Provisioned & Sent' : '✅ Accept & Provision Google Sheet'}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {roadmap.map(milestone => (
                  <div key={milestone.week} className="p-5 rounded-2xl bg-[#0e111a] border border-white/[0.08] shadow-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        WEEK {milestone.week}
                      </span>
                      <span className="text-xs font-mono font-bold text-amber-400">
                        +{milestone.xpBounty} XP Bounty
                      </span>
                    </div>

                    <h5 className="font-bold text-sm text-white">{milestone.title}</h5>

                    <div>
                      <div className="text-[11px] font-semibold text-slate-400 mb-1">Deliverables:</div>
                      <ul className="space-y-1">
                        {milestone.deliverables.map((d, i) => (
                          <li key={i} className="text-xs text-slate-300 flex items-start gap-1.5">
                            <span className="text-indigo-400 font-bold">•</span>
                            <span>{d}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-2 border-t border-white/[0.06]">
                      <div className="text-[11px] font-semibold text-slate-400 mb-2">Milestone Task Tickets:</div>
                      <div className="space-y-1.5">
                        {milestone.tasks.map(t => (
                          <div key={t.id} className="p-2 rounded-lg bg-[#07090e] border border-white/[0.04] flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-mono text-slate-500">{t.id}</span>
                              <span className="text-white font-medium">{t.title}</span>
                            </div>
                            <span className="text-[11px] font-mono text-indigo-400">+{t.xp} XP</span>
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

      {/* ==================== TAB 3: TALENT & APPLICANT PIPELINE ==================== */}
      {activeTab === 'applicants' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#0e111a] border border-white/[0.08] shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="text-base font-bold text-white">Talent Pipeline & Fast-Track Decision Engine</h3>
                <p className="text-xs text-slate-400">Review candidate applicants and dispatch offer/rejection emails via Gmail</p>
              </div>
              <button
                onClick={() => setShowAddApplicant(!showAddApplicant)}
                className="px-3.5 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-white text-xs font-semibold transition-colors flex items-center gap-1.5 self-start"
              >
                <UserPlus className="w-4 h-4" />
                <span>{showAddApplicant ? 'Close Form' : 'Ingest New Applicant'}</span>
              </button>
            </div>

            {/* Ingest Candidate Form */}
            {showAddApplicant && (
              <form onSubmit={handleAddApplicant} className="p-4 rounded-xl bg-[#07090e] border border-white/[0.06] mb-6 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Candidate Name</label>
                    <input
                      type="text"
                      required
                      value={newApplicantForm.name}
                      onChange={e => setNewApplicantForm({...newApplicantForm, name: e.target.value})}
                      className="w-full px-3 py-2 rounded-lg bg-[#0e111a] border border-white/[0.08] text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Candidate Email</label>
                    <input
                      type="email"
                      required
                      value={newApplicantForm.email}
                      onChange={e => setNewApplicantForm({...newApplicantForm, email: e.target.value})}
                      className="w-full px-3 py-2 rounded-lg bg-[#0e111a] border border-white/[0.08] text-xs text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Target Role</label>
                    <input
                      type="text"
                      value={newApplicantForm.role}
                      onChange={e => setNewApplicantForm({...newApplicantForm, role: e.target.value})}
                      className="w-full px-3 py-2 rounded-lg bg-[#0e111a] border border-white/[0.08] text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Skills</label>
                    <input
                      type="text"
                      value={newApplicantForm.skills}
                      onChange={e => setNewApplicantForm({...newApplicantForm, skills: e.target.value})}
                      className="w-full px-3 py-2 rounded-lg bg-[#0e111a] border border-white/[0.08] text-xs text-white"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs"
                >
                  Save Candidate
                </button>
              </form>
            )}

            {/* Selected Applicant Decision Drawer */}
            {selectedApplicant && (
              <div className="p-4 rounded-xl bg-[#07090e] border border-indigo-500/40 mb-6 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white">
                    CTO Decision for: {selectedApplicant.name} ({selectedApplicant.appId})
                  </span>
                  <button onClick={() => setSelectedApplicant(null)} className="text-slate-400 hover:text-white">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-xs text-slate-300">
                  Role: <strong className="text-white">{selectedApplicant.role}</strong> | Skills: {selectedApplicant.skills}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Personalized Notes / Guidance for Candidate:
                  </label>
                  <textarea
                    rows={2}
                    value={applicantActionFeedback}
                    onChange={e => setApplicantActionFeedback(e.target.value)}
                    placeholder="Enter interview notes or offer welcome message..."
                    className="w-full px-3 py-2 rounded-lg bg-[#0e111a] border border-white/[0.08] text-xs text-white"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleDecideApplicant('Selected')}
                    className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors"
                  >
                    ✅ Select Candidate & Send Offer Email
                  </button>
                  <button
                    onClick={() => handleDecideApplicant('Rejected')}
                    className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition-colors"
                  >
                    ❌ Courteous Rejection Email
                  </button>
                </div>
              </div>
            )}

            {/* Applicant Roster Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-white/[0.08] text-slate-400">
                    <th className="pb-2.5 font-semibold">App ID</th>
                    <th className="pb-2.5 font-semibold">Candidate</th>
                    <th className="pb-2.5 font-semibold">Target Role</th>
                    <th className="pb-2.5 font-semibold">Key Skills</th>
                    <th className="pb-2.5 font-semibold">Decision</th>
                    <th className="pb-2.5 font-semibold text-right">Review</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {applicants.map(c => (
                    <tr key={c.appId} className="hover:bg-white/[0.02]">
                      <td className="py-3 font-mono font-semibold text-slate-300">{c.appId}</td>
                      <td className="py-3">
                        <div className="font-semibold text-white">{c.name}</div>
                        <div className="text-[10px] text-slate-400">{c.email}</div>
                      </td>
                      <td className="py-3 text-slate-300">{c.role}</td>
                      <td className="py-3 text-slate-400 max-w-[200px] truncate">{c.skills}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          c.decision === 'Selected'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : c.decision === 'Rejected'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                        }`}>
                          {c.decision}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => setSelectedApplicant(c)}
                          className="px-2.5 py-1 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-white text-xs font-semibold"
                        >
                          Decide
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        </div>
      )}

      {/* ==================== TAB 4: INSTANT MEET SCHEDULER ==================== */}
      {activeTab === 'meetings' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#0e111a] border border-white/[0.08] shadow-xl">
            <h3 className="text-base font-bold text-white mb-1">Instant Google Meet Generator & AI Agenda</h3>
            <p className="text-xs text-slate-400 mb-6">
              Create native Google Meet links with pre-meeting agendas dispatched directly to attendee calendars.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Meeting Title</label>
                <input
                  type="text"
                  value={meetForm.title}
                  onChange={e => setMeetForm({...meetForm, title: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg bg-[#07090e] border border-white/[0.08] text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Attendee Email(s)</label>
                <input
                  type="text"
                  value={meetForm.attendees}
                  onChange={e => setMeetForm({...meetForm, attendees: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg bg-[#07090e] border border-white/[0.08] text-xs text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Meeting Type</label>
                <select
                  value={meetForm.type}
                  onChange={e => setMeetForm({...meetForm, type: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg bg-[#07090e] border border-white/[0.08] text-xs text-white"
                >
                  <option>Incident Triage</option>
                  <option>1-on-1 Mentorship Sync</option>
                  <option>Architecture Review</option>
                  <option>Sprint & Milestone Planning</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Duration (Minutes)</label>
                <input
                  type="number"
                  value={meetForm.duration}
                  onChange={e => setMeetForm({...meetForm, duration: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg bg-[#07090e] border border-white/[0.08] text-xs text-white"
                />
              </div>
            </div>

            <button
              onClick={handleScheduleMeet}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold text-xs shadow-lg shadow-indigo-500/25 transition-all flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Generate Google Meet & Dispatch Calendar Invite</span>
            </button>

            {scheduledMeeting && (
              <div className="mt-6 p-4 rounded-xl bg-[#07090e] border border-emerald-500/30 text-xs space-y-2">
                <div className="flex items-center justify-between text-emerald-400 font-bold">
                  <span>✅ Calendar Invite Dispatched</span>
                  <a
                    href={scheduledMeeting.meetLink}
                    target="_blank"
                    rel="noreferrer"
                    className="underline flex items-center gap-1 text-cyan-300"
                  >
                    Join Meet Link: {scheduledMeeting.meetLink}
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
                <div className="text-slate-300">
                  <strong>Title:</strong> {scheduledMeeting.title} ({scheduledMeeting.duration} mins)
                </div>
                <div className="text-slate-300">
                  <strong>Attendees:</strong> {scheduledMeeting.attendees}
                </div>
                <div className="pt-2 border-t border-white/[0.06]">
                  <div className="font-semibold text-slate-400 mb-1">AI Generated Pre-Meeting Agenda:</div>
                  <ul className="space-y-1 text-slate-300">
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

      {/* ==================== TAB 5: AI PERFORMANCE & COACHING RADAR ==================== */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#0e111a] border border-white/[0.08] shadow-xl">
            <h3 className="text-base font-bold text-white mb-1">Continuous AI Performance & Health Coaching</h3>
            <p className="text-xs text-slate-400 mb-4">
              Synthesize daily standup history, task completion rates, and blocker metrics into actionable coaching feedback.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3 mb-6">
              <select
                value={selectedInternForCoaching}
                onChange={e => setSelectedInternForCoaching(e.target.value)}
                className="w-full sm:w-64 px-3 py-2 rounded-lg bg-[#07090e] border border-white/[0.08] text-xs text-white"
              >
                <option>Rohan Sharma</option>
                <option>Ananya Verma</option>
                <option>Devansh Kulkarni</option>
              </select>
              <button
                onClick={handleRunCoaching}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold text-xs shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Run AI Performance Evaluation</span>
              </button>
            </div>

            {coachingResult && (
              <div className="space-y-4">
                {/* Metric Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-xl bg-[#07090e] border border-white/[0.06]">
                    <div className="text-[11px] text-slate-400 mb-1">Delivery Reliability</div>
                    <div className="text-xl font-bold font-mono text-emerald-400">
                      {coachingResult.reliabilityScore}
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#07090e] border border-white/[0.06]">
                    <div className="text-[11px] text-slate-400 mb-1">Blocker Resolution</div>
                    <div className="text-xl font-bold font-mono text-indigo-400">
                      {coachingResult.blockerResolutionTime}
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#07090e] border border-white/[0.06]">
                    <div className="text-[11px] text-slate-400 mb-1">Org Hierarchy Tier</div>
                    <div className="text-sm font-bold text-cyan-300">
                      {coachingResult.currentLevel}
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#07090e] border border-white/[0.06]">
                    <div className="text-[11px] text-slate-400 mb-1">Submission Streak</div>
                    <div className="text-xl font-bold font-mono text-amber-400 flex items-center gap-1">
                      <Flame className="w-4 h-4" />
                      <span>{coachingResult.streakDays} Days</span>
                    </div>
                  </div>
                </div>

                {/* AI Coaching Guidance Box */}
                <div className="p-4 rounded-xl bg-[#07090e] border border-indigo-500/30 text-xs space-y-2">
                  <div className="font-bold text-indigo-300 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    <span>Gemini 2.5 Flash Coaching Assessment:</span>
                  </div>
                  <ul className="space-y-1.5 text-slate-300">
                    {coachingResult.aiFeedback.map((item: string, idx: number) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </section>
  );
};
