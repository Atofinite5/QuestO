import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  UserPlus, Search, ExternalLink, Check, X, 
  LayoutGrid, Table as TableIcon, Award, Sparkles 
} from 'lucide-react';
import { ApiService, ApplicantItem } from '../../services/api';
import { PageHeader } from '../../components/ui/PageHeader';
import { Badge } from '../../components/ui/Badge';

export const TalentPage: React.FC = () => {
  const [applicants, setApplicants] = useState<ApplicantItem[]>([]);
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState<ApplicantItem | null>(null);
  const [feedbackNote, setFeedbackNote] = useState('');

  // Add form state
  const [form, setForm] = useState({
    name: '',
    email: '',
    role: 'AI Systems Engineering Intern',
    skills: 'PyTorch, LangChain, n8n',
    resumeUrl: 'https://drive.google.com/sample_resume'
  });

  useEffect(() => {
    loadApplicants();
  }, []);

  const loadApplicants = async () => {
    const list = await ApiService.getApplicants();
    setApplicants(list);
  };

  const handleDecision = async (appId: string, decision: 'Selected' | 'Rejected') => {
    await ApiService.decideApplicant(appId, decision, feedbackNote);
    if (decision === 'Selected') {
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
    }
    setSelectedApplicant(null);
    setFeedbackNote('');
    await loadApplicants();
  };

  const handleAddApplicant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) return;

    await ApiService.submitApplication(form);
    setShowAddModal(false);
    setForm({
      name: '',
      email: '',
      role: 'AI Systems Engineering Intern',
      skills: 'PyTorch, LangChain, n8n',
      resumeUrl: 'https://drive.google.com/sample_resume'
    });
    await loadApplicants();
  };

  const filtered = applicants.filter(a => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        a.name.toLowerCase().includes(q) ||
        a.email.toLowerCase().includes(q) ||
        a.role.toLowerCase().includes(q) ||
        a.skills.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const pendingList = filtered.filter(a => a.decision === 'Pending');
  const selectedList = filtered.filter(a => a.decision === 'Selected');
  const rejectedList = filtered.filter(a => a.decision === 'Rejected');

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <PageHeader
        title="Talent & Applicant Pipeline"
        subtitle="Review candidates, dispatch automated decision emails via GmailApp, and synchronize with n8n."
        action={
          <div className="flex items-center gap-2">
            <div className="flex items-center p-1 rounded-xl bg-zinc-100 dark:bg-zinc-800">
              <button
                type="button"
                onClick={() => setViewMode('kanban')}
                className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
                  viewMode === 'kanban' ? 'bg-white dark:bg-zinc-900 shadow-xs text-zinc-950 dark:text-white' : 'text-zinc-500'
                }`}
                title="Kanban View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
                  viewMode === 'table' ? 'bg-white dark:bg-zinc-900 shadow-xs text-zinc-950 dark:text-white' : 'text-zinc-500'
                }`}
                title="Table View"
              >
                <TableIcon className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 rounded-full bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 text-xs font-semibold hover:opacity-90 transition-opacity flex items-center gap-1.5 shadow-sm"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add Candidate</span>
            </button>
          </div>
        }
      />

      {/* Search Bar */}
      <div className="relative max-w-sm">
        <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-zinc-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter candidate by name, role, skills..."
          className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs"
        />
      </div>

      {/* Kanban Board Mode */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          
          {/* Column 1: Pending */}
          <div className="bg-zinc-100/70 dark:bg-zinc-900/40 rounded-3xl p-4 border border-zinc-200/60 dark:border-zinc-800/60 space-y-3">
            <div className="flex items-center justify-between px-2">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                Pending Review
              </span>
              <span className="w-5 h-5 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 flex items-center justify-center text-[10px] font-bold">
                {pendingList.length}
              </span>
            </div>

            <div className="space-y-3">
              {pendingList.map(app => (
                <div
                  key={app.appId}
                  onClick={() => setSelectedApplicant(app)}
                  className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs hover:border-indigo-500/50 cursor-pointer transition-colors space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-xs font-bold text-zinc-950 dark:text-white">{app.name}</h4>
                      <span className="text-[10px] text-zinc-400">{app.email}</span>
                    </div>
                    <span className="font-mono text-[9px] font-bold px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500">
                      {app.appId}
                    </span>
                  </div>

                  <p className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400">
                    {app.role}
                  </p>

                  <div className="flex flex-wrap gap-1">
                    {app.skills.split(',').map((skill, i) => (
                      <span key={i} className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-mono">
                        {skill.trim()}
                      </span>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs">
                    <a
                      href={app.resumeUrl}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-[10px] text-zinc-400 hover:text-indigo-500 flex items-center gap-1"
                    >
                      <span>Resume</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDecision(app.appId, 'Selected');
                        }}
                        className="px-2 py-0.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-semibold"
                      >
                        Select
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDecision(app.appId, 'Rejected');
                        }}
                        className="px-2 py-0.5 rounded-lg bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 text-[10px] font-semibold"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: Selected */}
          <div className="bg-emerald-50/30 dark:bg-emerald-950/10 rounded-3xl p-4 border border-emerald-200/50 dark:border-emerald-500/10 space-y-3">
            <div className="flex items-center justify-between px-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Selected / Offers
              </span>
              <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 flex items-center justify-center text-[10px] font-bold">
                {selectedList.length}
              </span>
            </div>

            <div className="space-y-3">
              {selectedList.map(app => (
                <div
                  key={app.appId}
                  className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-emerald-200 dark:border-emerald-500/20 shadow-xs space-y-2.5"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-zinc-950 dark:text-white">{app.name}</h4>
                      <span className="text-[10px] text-zinc-400">{app.email}</span>
                    </div>
                    <Badge color="emerald">Selected</Badge>
                  </div>

                  <p className="text-[11px] font-medium text-zinc-700 dark:text-zinc-300">
                    {app.role}
                  </p>

                  {app.feedback && (
                    <p className="text-[10px] text-emerald-700 dark:text-emerald-400 italic bg-emerald-50 dark:bg-emerald-500/5 p-2 rounded-lg">
                      "{app.feedback}"
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Column 3: Rejected */}
          <div className="bg-zinc-100/70 dark:bg-zinc-900/40 rounded-3xl p-4 border border-zinc-200/60 dark:border-zinc-800/60 space-y-3">
            <div className="flex items-center justify-between px-2">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Rejected / Archived
              </span>
              <span className="w-5 h-5 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-500 flex items-center justify-center text-[10px] font-bold">
                {rejectedList.length}
              </span>
            </div>

            <div className="space-y-3">
              {rejectedList.map(app => (
                <div
                  key={app.appId}
                  className="p-4 rounded-2xl bg-white/70 dark:bg-zinc-900/70 border border-zinc-200 dark:border-zinc-800 opacity-70 space-y-2"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-xs font-semibold text-zinc-950 dark:text-white">{app.name}</h4>
                      <span className="text-[10px] text-zinc-400">{app.role}</span>
                    </div>
                    <Badge color="rose">Rejected</Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      ) : (
        /* Table Mode */
        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 dark:bg-zinc-950/50 text-zinc-400 uppercase text-[10px] font-semibold border-b border-zinc-100 dark:border-zinc-800">
              <tr>
                <th className="px-6 py-3">Applicant ID</th>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3">Skills</th>
                <th className="px-6 py-3">Decision</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 text-zinc-700 dark:text-zinc-300">
              {filtered.map(app => (
                <tr key={app.appId} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30">
                  <td className="px-6 py-3.5 font-mono text-zinc-400">{app.appId}</td>
                  <td className="px-6 py-3.5">
                    <span className="font-semibold block text-zinc-950 dark:text-white">{app.name}</span>
                    <span className="text-[10px] text-zinc-400">{app.email}</span>
                  </td>
                  <td className="px-6 py-3.5">{app.role}</td>
                  <td className="px-6 py-3.5 max-w-xs truncate">{app.skills}</td>
                  <td className="px-6 py-3.5">
                    <Badge color={app.decision === 'Selected' ? 'emerald' : app.decision === 'Rejected' ? 'rose' : 'zinc'}>
                      {app.decision}
                    </Badge>
                  </td>
                  <td className="px-6 py-3.5">
                    {app.decision === 'Pending' ? (
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleDecision(app.appId, 'Selected')}
                          className="px-2 py-0.5 rounded bg-emerald-600 text-white text-[10px] font-semibold"
                        >
                          Select
                        </button>
                        <button
                          onClick={() => handleDecision(app.appId, 'Rejected')}
                          className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 text-[10px] font-semibold"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-[10px] text-zinc-400">Processed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Applicant Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <h3 className="text-base font-bold text-zinc-950 dark:text-white">Add Candidate</h3>
              <button onClick={() => setShowAddModal(false)} className="text-zinc-400 hover:text-zinc-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddApplicant} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold uppercase text-zinc-500 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Maya Sen"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-zinc-500 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="name@university.edu"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-zinc-500 mb-1">Role</label>
                <input
                  type="text"
                  required
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-zinc-500 mb-1">Key Skills</label>
                <input
                  type="text"
                  required
                  value={form.skills}
                  onChange={(e) => setForm({ ...form, skills: e.target.value })}
                  placeholder="React 19, Python, PyTorch"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-zinc-500 mb-1">Resume Link</label>
                <input
                  type="url"
                  value={form.resumeUrl}
                  onChange={(e) => setForm({ ...form, resumeUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-full text-xs font-medium text-zinc-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-full bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 text-xs font-semibold hover:opacity-90"
                >
                  Submit Candidate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

