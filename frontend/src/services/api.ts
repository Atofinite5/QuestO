/**
 * Questo Enterprise 2.0 — Dynamic Frontend API Client
 * File: src/services/api.ts
 * 
 * Supports both Live Google Apps Script Web App execution and
 * instant high-fidelity local simulation with full persistence in localStorage.
 */

export interface InternEodPayload {
  internName: string;
  internEmail: string;
  tasksCompleted: string;
  challengesOvercome: string;
  blockers: string;
  tomorrowPlan: string;
}

export interface InternEodItem {
  updateId: string;
  timestamp: string;
  internEmail: string;
  internName: string;
  doneYesterday: string;
  plannedToday: string;
  blockers: string;
  hasBlocker: boolean;
  sentimentHealth: string;
  extractedRisks: string;
  xpAwarded: number | string;
  reviewStatus: string;
  ctoFeedback: string;
}

export interface ApplicantItem {
  appId: string;
  name: string;
  email: string;
  role: string;
  skills: string;
  resumeUrl: string;
  decision: 'Pending' | 'Selected' | 'Rejected';
  feedback?: string;
  timestamp: string;
}

export interface RoadmapMilestone {
  week: number;
  title: string;
  deliverables: string[];
  xpBounty: number;
  tasks: Array<{
    id: string;
    title: string;
    description: string;
    xp: number;
  }>;
}

export interface BackendSettings {
  webAppUrl: string;
  n8nWebhookUrl: string;
  aiModel?: string;
  useLiveBackend: boolean;
}

const SETTINGS_KEY = 'questo_backend_settings';
const STORAGE_EOD_KEY = 'questo_eods';
const STORAGE_APPS_KEY = 'questo_applicants';
const STORAGE_TASKS_KEY = 'questo_tasks';
const STORAGE_LEAVES_KEY = 'questo_leaves';
const STORAGE_MEETINGS_KEY = 'questo_meetings';
const STORAGE_TEAM_KEY = 'questo_team';

// Initial Mock Seed Data
const DEFAULT_EODS: InternEodItem[] = [
  {
    updateId: 'EOD-3042',
    timestamp: '2026-09-15 17:45:00',
    internEmail: 'rohan.intern@company.com',
    internName: 'Rohan Sharma',
    doneYesterday: '📋 TASKS COMPLETED:\n• Built Cloudflare tunnel caching fallback for image retrieval.\n• Integrated client preloader memory cache.\n\n⚡ CHALLENGES OVERCOME:\nEncountered SSL handshake latency; resolved via TCP keep-alive tuning.',
    plannedToday: '• Execute precision-recall benchmarks on image crawler.\n• Prepare milestone demo for CTO sync.',
    blockers: 'Dependencies on external quota limit for Vertex AI API.',
    hasBlocker: true,
    sentimentHealth: '7/10 - Focused velocity, but external infrastructure bottleneck detected',
    extractedRisks: 'P0 Dependency: Vertex AI quota limit may stall week 2 eval milestone if not unblocked today.',
    xpAwarded: 20,
    reviewStatus: '🚨 Blocker Escalated',
    ctoFeedback: ''
  },
  {
    updateId: 'EOD-2991',
    timestamp: '2026-09-15 16:30:00',
    internEmail: 'ananya.dev@company.com',
    internName: 'Ananya Verma',
    doneYesterday: '📋 TASKS COMPLETED:\n• Implemented zero-formula-injection sanitization for CSV imports.\n• Authored 14 unit test assertions.',
    plannedToday: '• Integrate webhook dispatcher with n8n workflow engine.',
    blockers: 'None',
    hasBlocker: false,
    sentimentHealth: '9/10 - Exceptional momentum and robust code coverage',
    extractedRisks: 'None',
    xpAwarded: 20,
    reviewStatus: '✅ Acknowledged & Unblocked by CTO',
    ctoFeedback: 'Great work on the sanitization layer! Approved for staging merge.'
  },
  {
    updateId: 'EOD-2884',
    timestamp: '2026-09-14 18:00:00',
    internEmail: 'dev.intern@company.com',
    internName: 'Devansh Kulkarni',
    doneYesterday: '📋 TASKS COMPLETED:\n• Set up local Docker eval harness.\n• Benchmarked ScaNN vector search latency.',
    plannedToday: '• Add hybrid sparse/dense reranking.',
    blockers: 'None',
    hasBlocker: false,
    sentimentHealth: '8/10 - Solid progress on architecture foundation',
    extractedRisks: 'None',
    xpAwarded: 20,
    reviewStatus: '✅ Acknowledged & Unblocked by CTO',
    ctoFeedback: 'Well done. ScaNN benchmarks look very promising.'
  }
];

const DEFAULT_APPLICANTS: ApplicantItem[] = [
  {
    appId: 'APP-1001',
    name: 'Aarav Patel',
    email: 'aarav.patel@stanford.edu',
    role: 'AI Systems Engineering Intern',
    skills: 'PyTorch, Rust, LangChain, Distributed Eval, CUDA',
    resumeUrl: 'https://drive.google.com/sample_resume_aarav',
    decision: 'Selected',
    feedback: 'Outstanding open-source contribution to vector search benchmarks. Top candidate.',
    timestamp: '2026-09-12 14:20:00'
  },
  {
    appId: 'APP-1002',
    name: 'Maya Sen',
    email: 'maya.sen@cmu.edu',
    role: 'Full-Stack Operations Intern',
    skills: 'React 19, TypeScript, Tailwind, Google Apps Script, Node.js',
    resumeUrl: 'https://drive.google.com/sample_resume_maya',
    decision: 'Pending',
    feedback: '',
    timestamp: '2026-09-14 10:15:00'
  },
  {
    appId: 'APP-1003',
    name: 'Vikram Joshi',
    email: 'vikram.j@berkeley.edu',
    role: 'Infra & Reliability Engineering',
    skills: 'Docker, Kubernetes, GCP Cloud Run, Terraform',
    resumeUrl: 'https://drive.google.com/sample_resume_vikram',
    decision: 'Pending',
    feedback: '',
    timestamp: '2026-09-15 09:40:00'
  }
];

export class ApiService {
  public static getSettings(): BackendSettings {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.geminiKey) {
          delete parsed.geminiKey;
          localStorage.setItem(SETTINGS_KEY, JSON.stringify(parsed));
        }
        return parsed;
      } catch (e) { /* ignore */ }
    }
    return {
      webAppUrl: '',
      n8nWebhookUrl: '',
      aiModel: 'deepseek/deepseek-flash',
      useLiveBackend: false
    };
  }

  public static saveSettings(settings: BackendSettings) {
    const { geminiKey: _legacySecret, ...safeSettings } = settings as BackendSettings & { geminiKey?: string };
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(safeSettings));
  }

  public static async testBackendConnection(url: string): Promise<{ success: boolean; message: string; version?: string }> {
    if (!url) return { success: false, message: 'URL is required' };
    try {
      const pingUrl = url.includes('?') ? `${url}&format=json` : `${url}?format=json`;
      const res = await fetch(pingUrl, { method: 'GET' });
      const data = await res.json();
      return {
        success: true,
        message: 'Connected to Questo Enterprise API',
        version: data.version || '2.7.0'
      };
    } catch (err: any) {
      return {
        success: false,
        message: 'Could not reach backend URL: ' + (err.message || 'Network error')
      };
    }
  }

  // --- Intern Daily EOD Operations ---
  public static async getRecentEods(): Promise<InternEodItem[]> {
    const settings = this.getSettings();
    if (settings.useLiveBackend && settings.webAppUrl) {
      try {
        const res = await fetch(settings.webAppUrl, {
          method: 'POST',
          body: JSON.stringify({ action: 'GET_INTERN_EODS', limit: 30 })
        });
        const json = await res.json();
        if (json.status === 'success' && json.eods) {
          return json.eods;
        }
      } catch (e) {
        console.warn('Live backend failed, falling back to local store:', e);
      }
    }

    const saved = localStorage.getItem(STORAGE_EOD_KEY);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    localStorage.setItem(STORAGE_EOD_KEY, JSON.stringify(DEFAULT_EODS));
    return DEFAULT_EODS;
  }

  public static async submitInternEod(payload: InternEodPayload): Promise<{
    updateId: string;
    sentimentHealth: string;
    extractedRisks: string;
    hasBlocker: boolean;
    suggestedAdvice: string;
    riskLevel: string;
  }> {
    const settings = this.getSettings();
    if (settings.useLiveBackend && settings.webAppUrl) {
      try {
        const res = await fetch(settings.webAppUrl, {
          method: 'POST',
          body: JSON.stringify({ action: 'SUBMIT_INTERN_EOD', ...payload })
        });
        const json = await res.json();
        if (json.status === 'success' && json.result) {
          return json.result;
        }
      } catch (e) {
        console.warn('Live backend submit failed, using simulator:', e);
      }
    }

    // Local High-Fidelity Simulation
    const updateId = 'EOD-' + Math.floor(3000 + Math.random() * 7000);
    const nowFormatted = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const hasBlocker = payload.blockers.trim().length > 0 &&
      payload.blockers.toLowerCase() !== 'none' &&
      payload.blockers.toLowerCase() !== 'no' &&
      payload.blockers.toLowerCase() !== 'nil';

    const riskLevel = hasBlocker ? '🔴 High Risk' : '🟢 Low';
    const sentimentScore = hasBlocker ? 6 : 9;
    const sentimentHealth = hasBlocker
      ? `${sentimentScore}/10 - Intern made solid progress on tasks but hit critical blocker`
      : `${sentimentScore}/10 - Excellent momentum and high velocity completion`;

    const extractedRisks = hasBlocker
      ? `Blocker Detected: ${payload.blockers}`
      : 'None detected';

    const suggestedAdvice = hasBlocker
      ? 'CTO intervention recommended: Unblock dependency or allocate infra quota.'
      : 'Maintain current velocity and milestone pacing.';

    let formattedDone = `📋 TASKS COMPLETED:\n${payload.tasksCompleted}`;
    if (payload.challengesOvercome && payload.challengesOvercome.toLowerCase() !== 'none') {
      formattedDone += `\n\n⚡ CHALLENGES OVERCOME:\n${payload.challengesOvercome}`;
    }

    const newItem: InternEodItem = {
      updateId,
      timestamp: nowFormatted,
      internEmail: payload.internEmail,
      internName: payload.internName || payload.internEmail.split('@')[0],
      doneYesterday: formattedDone,
      plannedToday: payload.tomorrowPlan,
      blockers: payload.blockers || 'None',
      hasBlocker,
      sentimentHealth,
      extractedRisks,
      xpAwarded: 20,
      reviewStatus: hasBlocker ? '🚨 Blocker Escalated' : 'Pending CTO Review',
      ctoFeedback: ''
    };

    const current = await this.getRecentEods();
    const updated = [newItem, ...current];
    localStorage.setItem(STORAGE_EOD_KEY, JSON.stringify(updated));

    return {
      updateId,
      sentimentHealth,
      extractedRisks,
      hasBlocker,
      suggestedAdvice,
      riskLevel
    };
  }

  public static async acknowledgeEod(updateId: string, feedback: string): Promise<boolean> {
    const settings = this.getSettings();
    if (settings.useLiveBackend && settings.webAppUrl) {
      try {
        await fetch(settings.webAppUrl, {
          method: 'POST',
          body: JSON.stringify({ action: 'ACKNOWLEDGE_EOD', updateId, feedback })
        });
      } catch (e) { /* ignore */ }
    }

    const list = await this.getRecentEods();
    const item = list.find(x => x.updateId === updateId);
    if (item) {
      item.reviewStatus = '✅ Acknowledged & Unblocked by CTO';
      item.ctoFeedback = feedback || 'Reviewed and unblocked by CTO.';
      localStorage.setItem(STORAGE_EOD_KEY, JSON.stringify(list));
      return true;
    }
    return false;
  }

  // --- Applicant Pipeline Operations ---
  public static async getApplicants(): Promise<ApplicantItem[]> {
    const saved = localStorage.getItem(STORAGE_APPS_KEY);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    localStorage.setItem(STORAGE_APPS_KEY, JSON.stringify(DEFAULT_APPLICANTS));
    return DEFAULT_APPLICANTS;
  }

  public static async decideApplicant(appId: string, decision: 'Selected' | 'Rejected', feedback: string): Promise<boolean> {
    const list = await this.getApplicants();
    const target = list.find(a => a.appId === appId);
    if (target) {
      target.decision = decision;
      target.feedback = feedback;
      localStorage.setItem(STORAGE_APPS_KEY, JSON.stringify(list));
      return true;
    }
    return false;
  }

  public static async submitApplication(app: Partial<ApplicantItem>): Promise<ApplicantItem> {
    const list = await this.getApplicants();
    const newApp: ApplicantItem = {
      appId: 'APP-' + Math.floor(1004 + Math.random() * 8000),
      name: app.name || 'Candidate',
      email: app.email || '',
      role: app.role || 'Software Engineering Intern',
      skills: app.skills || 'Python, TypeScript, React',
      resumeUrl: app.resumeUrl || 'https://drive.google.com/sample_resume',
      decision: 'Pending',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    const updated = [newApp, ...list];
    localStorage.setItem(STORAGE_APPS_KEY, JSON.stringify(updated));
    return newApp;
  }

  public static async submitApplication(app: Partial<ApplicantItem>): Promise<ApplicantItem> {
    const list = await this.getApplicants();
    const newApp: ApplicantItem = {
      appId: 'APP-' + Math.floor(1004 + Math.random() * 8000),
      name: app.name || 'Candidate',
      email: app.email || '',
      role: app.role || 'Software Engineering Intern',
      skills: app.skills || 'Python, TypeScript, React',
      resumeUrl: app.resumeUrl || 'https://drive.google.com/sample_resume',
      decision: 'Pending',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    const updated = [newApp, ...list];
    localStorage.setItem(STORAGE_APPS_KEY, JSON.stringify(updated));
    return newApp;
  }

  // --- Founder -> CTO AI Roadmap Generator ---
  public static async generateRoadmap(workDetails: string, internName: string): Promise<RoadmapMilestone[]> {
    // High-fidelity structured breakdown
    return [
      {
        week: 1,
        title: 'Environment Harness & Baseline Architecture',
        deliverables: [
          'Set up local development container and testing harness',
          'Configure Google Cloud Platform credentials and secrets',
          'Implement core data schemas and sanitization layers'
        ],
        xpBounty: 150,
        tasks: [
          { id: 'T-101', title: 'Local repo bootstrap & Dockerfile', description: 'Create reproducible containerized environment', xp: 40 },
          { id: 'T-102', title: 'Input sanitization & security checks', description: 'Neutralize formula injection CWE-1236', xp: 50 },
          { id: 'T-103', title: 'Unit test suite with 90%+ branch coverage', description: 'Write mock test harnesses', xp: 60 }
        ]
      },
      {
        week: 2,
        title: 'Core Engine Implementation & Model Integration',
        deliverables: [
          'Integrate Gemini 2.5 Flash API connector with prompt schema',
          'Implement structured JSON validation and clean parsing',
          'Benchmark token latency and error fallback channels'
        ],
        xpBounty: 200,
        tasks: [
          { id: 'T-201', title: 'Gemini 2.5 Flash integration', description: 'Wire temperature 0.2 JSON schema endpoint', xp: 60 },
          { id: 'T-202', title: 'Inbound POST router & idempotency cache', description: 'Prevent duplicate webhook execution', xp: 70 },
          { id: 'T-203', title: 'Real-time telemetry event logging', description: 'Log latency to operations sheet', xp: 70 }
        ]
      },
      {
        week: 3,
        title: 'Real-Time CTO Alert Sentinel & Automation Workflows',
        deliverables: [
          'Daily EOD reporting portal with 3-part structured fields',
          'Automated blocker detection and risk-escalation engine',
          'n8n multi-agent webhook event synchronization'
        ],
        xpBounty: 250,
        tasks: [
          { id: 'T-301', title: 'Intern EOD Portal UI & backend handler', description: 'Build tasks, challenges, and blocker ingestion', xp: 80 },
          { id: 'T-302', title: 'CTO Alert Bell & Live Blocker Banner', description: 'Immediate visual alert on blocker detection', xp: 80 },
          { id: 'T-303', title: 'Outbound n8n webhook dispatcher', description: 'Trigger Slack and Discord notifications', xp: 90 }
        ]
      },
      {
        week: 4,
        title: 'Production Hardening, Benchmarking & Executive Signoff',
        deliverables: [
          'Full-screen web application production deployment',
          'Automated Google Meet 1-on-1 scheduler with agenda generator',
          'Final code review, security audit, and executive signoff'
        ],
        xpBounty: 300,
        tasks: [
          { id: 'T-401', title: 'Production domain deployment & SSL', description: 'Configure custom domain and edge cache', xp: 100 },
          { id: 'T-402', title: 'End-to-end user acceptance testing', description: 'Verify all 8 Google Sheets tabs synchronization', xp: 100 },
          { id: 'T-403', title: 'Final executive presentation & handoff', description: 'Present metrics and delivery velocity to CTO', xp: 100 }
        ]
      }
    ];
  }

  // ── Tasks ─────────────────────────────────────────────────────────────────

  private static readonly DEFAULT_TASKS = [
    { taskId: 'QST-1001', title: 'Build Cloudflare tunnel caching fallback', description: 'Implement resilient caching for image retrieval pipeline to handle latency spikes.', assignee: 'Rohan Sharma', assigneeEmail: 'rohan.intern@company.com', priority: 'P1 - High' as const, status: 'In Progress' as const, xpBounty: 60, createdAt: '2026-09-10 10:00:00', deadline: '2026-09-20 18:00:00', tags: ['infra', 'caching'] },
    { taskId: 'QST-1002', title: 'Zero-formula-injection sanitization for CSV imports', description: 'CWE-1236 mitigation on all data ingestion paths in Google Apps Script.', assignee: 'Ananya Verma', assigneeEmail: 'ananya.dev@company.com', priority: 'P0 - Blocker' as const, status: 'Done' as const, xpBounty: 100, createdAt: '2026-09-11 09:00:00', deadline: '2026-09-13 18:00:00', completedAt: '2026-09-12 16:30:00', tags: ['security', 'backend'] },
    { taskId: 'QST-1003', title: 'Integrate webhook dispatcher with n8n engine', description: 'Wire bidirectional event pipeline between GAS doPost(e) and n8n webhook nodes.', assignee: 'Ananya Verma', assigneeEmail: 'ananya.dev@company.com', priority: 'P1 - High' as const, status: 'In Review' as const, xpBounty: 60, createdAt: '2026-09-12 08:00:00', deadline: '2026-09-18 18:00:00', tags: ['n8n', 'integration'] },
    { taskId: 'QST-1004', title: 'Precision-recall benchmarks on image crawler', description: 'Evaluate Vertex AI retrieval accuracy across 500 test benchmark items.', assignee: 'Rohan Sharma', assigneeEmail: 'rohan.intern@company.com', priority: 'P0 - Blocker' as const, status: 'Blocked' as const, xpBounty: 100, createdAt: '2026-09-12 11:00:00', deadline: '2026-09-16 18:00:00', blockerDetails: 'External quota limit on Vertex AI API — waiting for infra team quota grant.', tags: ['AI', 'evaluation'] },
    { taskId: 'QST-1005', title: 'Set up local Docker eval harness', description: 'Reproducible containerized test environment for regression runs.', assignee: 'Devansh Kulkarni', assigneeEmail: 'dev.intern@company.com', priority: 'P2 - Medium' as const, status: 'Done' as const, xpBounty: 30, createdAt: '2026-09-11 14:00:00', deadline: '2026-09-15 18:00:00', completedAt: '2026-09-14 18:00:00', tags: ['devops', 'docker'] },
    { taskId: 'QST-1006', title: 'Hybrid sparse/dense reranking module', description: 'Implement ScaNN vector search + BM25 reciprocal rank fusion.', assignee: 'Devansh Kulkarni', assigneeEmail: 'dev.intern@company.com', priority: 'P2 - Medium' as const, status: 'Open' as const, xpBounty: 30, createdAt: '2026-09-15 09:00:00', deadline: '2026-09-22 18:00:00', tags: ['search', 'AI'] },
    { taskId: 'QST-1007', title: 'Write 14 unit test assertions for sanitization layer', description: 'Full branch coverage ensuring malicious characters are escaped.', assignee: 'Ananya Verma', assigneeEmail: 'ananya.dev@company.com', priority: 'P2 - Medium' as const, status: 'Done' as const, xpBounty: 30, createdAt: '2026-09-11 10:00:00', deadline: '2026-09-13 18:00:00', completedAt: '2026-09-12 15:00:00', tags: ['testing'] },
  ];

  public static async getTasks(): Promise<import('../types').TaskItem[]> {
    const saved = localStorage.getItem(STORAGE_TASKS_KEY);
    if (saved) { try { return JSON.parse(saved); } catch { /* ignore */ } }
    localStorage.setItem(STORAGE_TASKS_KEY, JSON.stringify(this.DEFAULT_TASKS));
    return this.DEFAULT_TASKS;
  }

  public static async saveTask(task: import('../types').TaskItem): Promise<void> {
    const list = await this.getTasks();
    const idx = list.findIndex(t => t.taskId === task.taskId);
    if (idx >= 0) list[idx] = task; else list.unshift(task);
    localStorage.setItem(STORAGE_TASKS_KEY, JSON.stringify(list));
  }

  public static async saveTasksBatch(newTasks: import('../types').TaskItem[]): Promise<void> {
    const list = await this.getTasks();
    for (const task of newTasks) {
      const idx = list.findIndex(t => t.taskId === task.taskId);
      if (idx >= 0) list[idx] = task; else list.unshift(task);
    }
    localStorage.setItem(STORAGE_TASKS_KEY, JSON.stringify(list));
  }

  public static async updateTaskStatus(taskId: string, status: import('../types').TaskItem['status']): Promise<void> {
    const list = await this.getTasks();
    const task = list.find(t => t.taskId === taskId);
    if (task) {
      task.status = status;
      if (status === 'Done') task.completedAt = new Date().toISOString().replace('T', ' ').substring(0, 19);
      localStorage.setItem(STORAGE_TASKS_KEY, JSON.stringify(list));
    }
  }

  // ── Leaves ────────────────────────────────────────────────────────────────

  private static readonly DEFAULT_LEAVES = [
    { leaveId: 'LVE-1001', employeeEmail: 'rohan.intern@company.com', employeeName: 'Rohan Sharma', leaveType: 'Exam / Study' as const, startDate: '2026-09-20', endDate: '2026-09-23', daysCount: 4, reason: 'University semester exams — Computer Networks & Distributed Systems', status: 'Pending' as const, streakProtected: false, tasksRescheduled: 0, submittedAt: '2026-09-15 10:00:00' },
    { leaveId: 'LVE-1002', employeeEmail: 'ananya.dev@company.com', employeeName: 'Ananya Verma', leaveType: 'Personal' as const, startDate: '2026-09-25', endDate: '2026-09-25', daysCount: 1, reason: 'Family engagement event', status: 'Approved' as const, approverEmail: 'lead@questo.app', streakProtected: true, tasksRescheduled: 1, submittedAt: '2026-09-14 14:00:00' },
    { leaveId: 'LVE-1003', employeeEmail: 'dev.intern@company.com', employeeName: 'Devansh Kulkarni', leaveType: 'Sick' as const, startDate: '2026-09-16', endDate: '2026-09-16', daysCount: 1, reason: 'Viral fever recovery', status: 'Approved' as const, approverEmail: 'lead@questo.app', streakProtected: true, tasksRescheduled: 0, submittedAt: '2026-09-16 09:00:00' },
  ];

  public static async getLeaves(): Promise<import('../types').LeaveRequest[]> {
    const saved = localStorage.getItem(STORAGE_LEAVES_KEY);
    if (saved) { try { return JSON.parse(saved); } catch { /* ignore */ } }
    localStorage.setItem(STORAGE_LEAVES_KEY, JSON.stringify(this.DEFAULT_LEAVES));
    return this.DEFAULT_LEAVES;
  }

  public static async submitLeave(leave: import('../types').LeaveRequest): Promise<void> {
    const list = await this.getLeaves();
    list.unshift(leave);
    localStorage.setItem(STORAGE_LEAVES_KEY, JSON.stringify(list));
  }

  public static async updateLeaveStatus(leaveId: string, status: 'Approved' | 'Rejected', approverEmail: string): Promise<void> {
    const list = await this.getLeaves();
    const item = list.find(l => l.leaveId === leaveId);
    if (item) {
      item.status = status;
      if (status === 'Approved') { item.streakProtected = true; item.tasksRescheduled = 2; item.approverEmail = approverEmail; }
      localStorage.setItem(STORAGE_LEAVES_KEY, JSON.stringify(list));
    }
  }

  // ── Meetings ──────────────────────────────────────────────────────────────

  private static readonly DEFAULT_MEETINGS = [
    { meetingId: 'MTG-001', title: '1-on-1 CTO Blocker Resolution & Mentorship', attendees: ['cto@questo.app', 'rohan.intern@company.com'], meetLink: 'https://meet.google.com/kvr-nxpw-qtm', scheduledAt: '2026-09-16 15:00:00', duration: 30, type: '1-on-1 Mentorship' as const, agenda: ['1. Vertex AI quota limit triage & local caching fallback review', '2. Cloudflare tunnel SSL handshake latency mitigation discussion', '3. Week 2 milestone re-scoping and mentor guidance'], createdBy: 'cto@questo.app', status: 'Scheduled' as const },
    { meetingId: 'MTG-002', title: 'Weekly Engineering Sprint & Retrospective', attendees: ['lead@questo.app', 'ananya.dev@company.com', 'dev.intern@company.com'], meetLink: 'https://meet.google.com/zbw-hfya-vbc', scheduledAt: '2026-09-15 10:00:00', duration: 45, type: 'Sprint Planning' as const, agenda: ['1. Sprint 3 backlog review and quest allocations', '2. Exam leave window capacity adjustments', '3. Code hygiene and CWE-1236 sanitization signoff'], createdBy: 'lead@questo.app', status: 'Completed' as const },
  ];

  public static async getMeetings(): Promise<import('../types').MeetingItem[]> {
    const saved = localStorage.getItem(STORAGE_MEETINGS_KEY);
    if (saved) { try { return JSON.parse(saved); } catch { /* ignore */ } }
    localStorage.setItem(STORAGE_MEETINGS_KEY, JSON.stringify(this.DEFAULT_MEETINGS));
    return this.DEFAULT_MEETINGS;
  }

  public static async saveMeeting(meeting: import('../types').MeetingItem): Promise<void> {
    const list = await this.getMeetings();
    list.unshift(meeting);
    localStorage.setItem(STORAGE_MEETINGS_KEY, JSON.stringify(list));
  }

  // ── Team ──────────────────────────────────────────────────────────────────

  private static readonly DEFAULT_TEAM = [
    { email: 'cto@questo.app', name: 'Aditya Kumar', role: 'CTO' as const, title: 'Chief Technology Officer', department: 'Engineering', reportsTo: 'founder@questo.app', totalXp: 15200, level: 17, streakDays: 42, tasksCompleted: 183, deliveryReliability: 97, avatarColor: 'from-indigo-500 to-violet-600', initials: 'AK', joinedAt: '2026-01-01', status: 'Active' as const },
    { email: 'lead@questo.app', name: 'Priya Patel', role: 'TEAM_LEAD' as const, title: 'Engineering Lead', department: 'Engineering', reportsTo: 'cto@questo.app', totalXp: 8600, level: 13, streakDays: 28, tasksCompleted: 94, deliveryReliability: 94, avatarColor: 'from-cyan-500 to-blue-600', initials: 'PP', joinedAt: '2026-02-15', status: 'Active' as const },
    { email: 'ananya.dev@company.com', name: 'Ananya Verma', role: 'ENGINEER' as const, title: 'Software Engineer', department: 'Engineering', reportsTo: 'lead@questo.app', totalXp: 4200, level: 9, streakDays: 21, tasksCompleted: 47, deliveryReliability: 92, avatarColor: 'from-purple-500 to-pink-600', initials: 'AV', joinedAt: '2026-03-01', status: 'Active' as const },
    { email: 'rohan.intern@company.com', name: 'Rohan Sharma', role: 'INTERN' as const, title: 'AI Systems Engineering Intern', department: 'AI Research', reportsTo: 'lead@questo.app', totalXp: 1420, level: 4, streakDays: 14, tasksCompleted: 12, deliveryReliability: 86, avatarColor: 'from-blue-500 to-indigo-600', initials: 'RS', joinedAt: '2026-09-01', status: 'Active' as const },
    { email: 'dev.intern@company.com', name: 'Devansh Kulkarni', role: 'INTERN' as const, title: 'Infrastructure & Data Intern', department: 'Platform', reportsTo: 'lead@questo.app', totalXp: 980, level: 3, streakDays: 11, tasksCompleted: 8, deliveryReliability: 90, avatarColor: 'from-emerald-500 to-teal-600', initials: 'DK', joinedAt: '2026-09-01', status: 'Active' as const },
  ];

  public static async getTeam(): Promise<import('../types').TeamMember[]> {
    const saved = localStorage.getItem(STORAGE_TEAM_KEY);
    if (saved) { try { return JSON.parse(saved); } catch { /* ignore */ } }
    localStorage.setItem(STORAGE_TEAM_KEY, JSON.stringify(this.DEFAULT_TEAM));
    return this.DEFAULT_TEAM;
  }
}
