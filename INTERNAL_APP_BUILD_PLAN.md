# Questo Enterprise 2.0 — Internal App Build Execution Plan

> **FOR AI AGENT**: This document is a step-by-step, self-contained execution plan. Read it fully before writing a single line of code. Everything you need — file paths, component structure, data shapes, design rules — is in here. Follow each phase in order. Build. Verify the build compiles. Move to next phase.

---

## Context: What Already Exists

The repo is at `/Users/sky_walker/Documents/Projects/Questo/QuestO`.

### What is already built and working:
| File/Folder | Status | Notes |
|---|---|---|
| `frontend/` | ✅ Working | React 19 + TypeScript + Tailwind + Vite. `bun run build` passes cleanly. |
| `frontend/src/types/index.ts` | ✅ Created | All shared TypeScript types (User, Task, Standup, Leave, Meeting, etc.) |
| `frontend/src/contexts/AuthContext.tsx` | ✅ Created | Auth provider with 5 demo accounts, localStorage session persistence |
| `frontend/src/layouts/DashboardLayout.tsx` | ✅ Created | Sidebar + top bar shell using `react-router-dom` `<Outlet />` |
| `frontend/node_modules/react-router-dom` | ✅ Installed | v7.18.5 installed via pnpm |
| `questo/gas/*.js` | ✅ All GAS backend files | All 16 files syntax-verified. These run in Google Apps Script, not Node. |
| `questo/n8n/*.json` | ✅ All n8n workflow blueprints | Valid JSON. Import these into an n8n instance. |

### What the landing page looks like:
The existing `frontend/src/App.tsx` is a marketing landing page (Hero, FeatureShowcase, ArchitectureSection, Footer). **Do NOT delete or modify it**. The internal app will be a separate route (`/app/*`) that only authenticated users can access.

---

## Architecture to Build

```
http://localhost:5173/           → Landing page (existing App.tsx — do not touch)
http://localhost:5173/login      → Login page (new)
http://localhost:5173/app        → Internal Dashboard home (protected, requires auth)
http://localhost:5173/app/standups   → Daily Standups & EOD desk
http://localhost:5173/app/tasks      → Tasks & Quests board
http://localhost:5173/app/roadmaps   → Founder → CTO → Intern Roadmap
http://localhost:5173/app/team       → Org chart & leaderboard
http://localhost:5173/app/talent     → Applicant pipeline
http://localhost:5173/app/leaves     → Leave & PTO management
http://localhost:5173/app/meetings   → Meeting scheduler
http://localhost:5173/app/analytics  → Performance & burnout analytics
http://localhost:5173/app/settings   → Backend configuration
```

---

## Design Rules (Follow Exactly)

- **Color palette**: White background (light mode), `zinc-950` (dark mode). Accents: `indigo-600` for primary, `rose-500` for alerts/blockers, `emerald-500` for success.
- **Typography**: Inter font (already loaded). Headings are `font-semibold` with `tracking-tight`. Body is `text-sm`.
- **Cards**: `bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl` with `shadow-sm`.
- **Buttons - Primary**: `bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 rounded-full px-4 py-2 text-sm font-medium hover:opacity-90`
- **Buttons - Secondary**: `bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-full px-4 py-2 text-sm font-medium hover:bg-zinc-200 dark:hover:bg-zinc-700`
- **Inputs**: `w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500`
- **Status badges**: Use pill-shaped `rounded-full px-2.5 py-0.5 text-xs font-medium` with matching bg/text colors (see below).
- **Page padding**: `px-4 sm:px-6 lg:px-8 py-6 max-w-screen-xl mx-auto`
- **No landing page elements inside /app**: No hero banners, no "features", no marketing copy.

### Status Badge Color Reference
```
P0 - Blocker   → bg-rose-100   text-rose-700   dark:bg-rose-500/20  dark:text-rose-400
P1 - High      → bg-orange-100 text-orange-700  dark:bg-orange-500/20 dark:text-orange-400
P2 - Medium    → bg-yellow-100 text-yellow-700  dark:bg-yellow-500/20 dark:text-yellow-400
P3 - Low       → bg-zinc-100   text-zinc-600   dark:bg-zinc-800     dark:text-zinc-400

Done           → bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400
In Progress    → bg-blue-100   text-blue-700   dark:bg-blue-500/20  dark:text-blue-400
Blocked        → bg-rose-100   text-rose-700   dark:bg-rose-500/20  dark:text-rose-400
In Review      → bg-purple-100 text-purple-700  dark:bg-purple-500/20 dark:text-purple-400
Open           → bg-zinc-100   text-zinc-600   dark:bg-zinc-800     dark:text-zinc-400

Approved Leave → bg-emerald-100 text-emerald-700
Pending Leave  → bg-yellow-100 text-yellow-700
Rejected Leave → bg-rose-100   text-rose-700

Selected       → bg-emerald-100 text-emerald-700
Rejected       → bg-rose-100   text-rose-700
Pending        → bg-zinc-100   text-zinc-600
```

---

## Phase 1: Routing & Auth Gate

### 1.1 — Update `src/main.tsx`

Replace the existing `main.tsx` entirely with:

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { RootRouter } from './RootRouter';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <RootRouter />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
```

### 1.2 — Create `src/RootRouter.tsx`

This is the top-level router that separates public routes (landing, login) from protected app routes.

```tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

// Public pages
import { App } from './App';                        // existing landing page
import { LoginPage } from './pages/auth/LoginPage';

// Protected layout
import { DashboardLayout } from './layouts/DashboardLayout';

// Internal app pages
import { DashboardHome } from './pages/app/DashboardHome';
import { StandupsPage } from './pages/app/StandupsPage';
import { TasksPage } from './pages/app/TasksPage';
import { RoadmapsPage } from './pages/app/RoadmapsPage';
import { TeamPage } from './pages/app/TeamPage';
import { TalentPage } from './pages/app/TalentPage';
import { LeavesPage } from './pages/app/LeavesPage';
import { MeetingsPage } from './pages/app/MeetingsPage';
import { AnalyticsPage } from './pages/app/AnalyticsPage';
import { AppSettingsPage } from './pages/app/AppSettingsPage';

// Route guard
function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <div className="h-screen flex items-center justify-center bg-zinc-950"><div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export function RootRouter() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<App />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Protected Internal App */}
      <Route
        path="/app"
        element={
          <RequireAuth>
            <DashboardLayout />
          </RequireAuth>
        }
      >
        <Route index element={<DashboardHome />} />
        <Route path="standups" element={<StandupsPage />} />
        <Route path="tasks" element={<TasksPage />} />
        <Route path="roadmaps" element={<RoadmapsPage />} />
        <Route path="team" element={<TeamPage />} />
        <Route path="talent" element={<TalentPage />} />
        <Route path="leaves" element={<LeavesPage />} />
        <Route path="meetings" element={<MeetingsPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="settings" element={<AppSettingsPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
```

### 1.3 — Modify `src/App.tsx`

The existing `App.tsx` has `export const App` and `export default App`. The landing page works as-is.  
Only change needed: remove the `export default App` line if it conflicts, and ensure the named export `App` is used in `RootRouter.tsx`.  
**Do not restructure App.tsx further.**

---

## Phase 2: Login Page

Create: `src/pages/auth/LoginPage.tsx`

**What it must contain:**
- Full-screen centered layout. Dark/light aware (`bg-zinc-50 dark:bg-zinc-950`).
- Left column (on `lg+` screens): Brand panel with product name, tagline, and 3 feature bullet points.
- Right column: Login form card (`max-w-sm mx-auto`).
- Form fields: Email (`type="email"`) and Password (`type="password"`).
- A primary **Sign In** button that calls `useAuth().login(email, password)`.
- On success: `navigate('/app')`.
- On failure: show inline error message below the form in rose-colored text.
- Below the form: a **Demo Accounts** section with 5 clickable rows (one per demo user). Each row has the user's name, email, role badge, and a "Use this account →" button that pre-fills the email and sets password to `demo`. The 5 accounts from `AuthContext.tsx` are:
  - `founder@questo.app` / CEO
  - `cto@questo.app` / CTO
  - `lead@questo.app` / TEAM LEAD
  - `rohan.intern@company.com` / INTERN
  - `ananya.dev@company.com` / ENGINEER
- Password is always `demo` for all accounts.
- Link in top-left: `← Back to website` → navigates to `/`.
- Include a light/dark toggle button in the top-right corner.
- **No sign-up link.** This is an invite-only internal tool.

---

## Phase 3: Internal Pages (Build in This Order)

For each page, follow this pattern:
1. Create the file at the specified path.
2. Use mock data sourced from `src/services/api.ts` (the existing service file — it has `ApiService` with `getRecentEods()`, `getApplicants()`, etc.).
3. Each page has a **Page Header** (title + subtitle + optional action button).
4. Build the most important section first, secondary sections below.

---

### Phase 3.1 — `src/pages/app/DashboardHome.tsx`

**Purpose**: Executive overview for whoever is logged in. KPI snapshot.

**Layout**: 
```
[ Page Header: "Good morning, {name}" + current date ]
[ Stat Cards Row: 4 cards across ]
[ Two columns: Left=Activity Feed (recent standups), Right=Active Blockers ]
[ Bottom: Quick Actions grid ]
```

**Stat Cards (4):**
1. **Active Tasks** — count of tasks not in `Done` status (use mock: `12 Active / 3 Blocked`)
2. **Team XP Today** — total XP awarded today (mock: `+340 XP`)
3. **Standup Rate** — % of team that submitted today (mock: `82%`)
4. **Open Blockers** — count of P0/P1 unresolved (mock: `2 P0 Blockers`)

Each stat card: `bg-white dark:bg-zinc-900 rounded-2xl border p-5`. Title is `text-xs text-zinc-500 uppercase tracking-wide`. Value is `text-2xl font-bold`. Show a trend arrow (+/- vs yesterday) in `text-xs text-emerald-600` or `text-rose-500`.

**Activity Feed (left column):**  
Call `ApiService.getRecentEods()`. Render a scrollable list of the last 5 standup cards, each showing: name, timestamp, blocker badge if `hasBlocker`, and sentiment score. Clicking one expands it inline (no modal needed).

**Active Blockers (right column):**  
Filter EODs where `hasBlocker === true && !reviewStatus.includes('Acknowledged')`. Show each as a "blocker card" with the person's name, blocker description, and an **Acknowledge** button that calls `ApiService.acknowledgeEod()`.

**Quick Actions (bottom):**  
A grid of 4 action cards. Each is a card with an icon, title, and subtitle. Clicking navigates:
- 📋 Submit EOD → `/app/standups`
- 👤 Review Applicants → `/app/talent`
- 📅 Schedule Meeting → `/app/meetings`
- 📈 View Analytics → `/app/analytics`

---

### Phase 3.2 — `src/pages/app/StandupsPage.tsx`

**Purpose**: Daily standup submission and CTO review desk.

**Layout**:
```
[ Page Header: "Daily Standups" + "Submit EOD" button ]
[ Two columns on lg+: Left=Submission Form, Right=EOD Feed ]
```

**Left — Submission Form:**  
A form card with:
- Intern Name (text input, pre-filled from `user.name`)
- Intern Email (text input, pre-filled from `user.email`, readonly)
- Tasks Completed (textarea, 4 rows)
- Challenges Overcome (textarea, 3 rows)
- Blockers (textarea with placeholder "Write 'None' if no blockers")
- Tomorrow's Plan (textarea, 3 rows)
- Submit button: calls `ApiService.submitInternEod()`. On success, fire confetti (`canvas-confetti`) and show a success panel: "✅ EOD Submitted! +20 XP" with the AI-extracted sentiment and risk.

**Right — EOD Feed (CTO View):**  
Render all EODs from `ApiService.getRecentEods()`.
- Filter tabs at top: **All** | **Blockers** | **Pending Review**
- Search box that filters by name/email.
- Each EOD rendered as a card:
  - Header: name + timestamp + status badge + XP badge
  - Body: "Done Yesterday" and "Today's Plan" text (collapsed to 3 lines, "Show more" toggle)
  - If `hasBlocker`: show a rose-colored blocker section with the blocker text
  - If `sentimentHealth`: show sentiment score as a colored pill
  - Footer: CTO Feedback input + **Acknowledge & Unblock** button (calls `ApiService.acknowledgeEod()`)

---

### Phase 3.3 — `src/pages/app/TasksPage.tsx`

**Purpose**: Task/Quest management with status tracking.

**Data**: Use inline mock data (since `ApiService` doesn't yet have a `getTasks()` function). Define an array of `TaskItem[]` objects at the top of the file using the type from `types/index.ts`.

**Mock task data to use:**
```ts
const MOCK_TASKS: TaskItem[] = [
  { taskId: 'QST-1001', title: 'Build Cloudflare tunnel caching fallback', description: 'Implement resilient caching for image retrieval pipeline', assignee: 'Rohan Sharma', assigneeEmail: 'rohan.intern@company.com', priority: 'P1 - High', status: 'In Progress', xpBounty: 60, createdAt: '2026-09-10 10:00:00', deadline: '2026-09-20 18:00:00', tags: ['infra', 'caching'] },
  { taskId: 'QST-1002', title: 'Zero-formula-injection sanitization for CSV imports', description: 'CWE-1236 mitigation on all data ingestion paths', assignee: 'Ananya Verma', assigneeEmail: 'ananya.dev@company.com', priority: 'P0 - Blocker', status: 'Done', xpBounty: 100, createdAt: '2026-09-11 09:00:00', deadline: '2026-09-13 18:00:00', completedAt: '2026-09-12 16:30:00', tags: ['security', 'backend'] },
  { taskId: 'QST-1003', title: 'Integrate webhook dispatcher with n8n engine', description: 'Wire bidirectional event pipeline between GAS and n8n', assignee: 'Ananya Verma', assigneeEmail: 'ananya.dev@company.com', priority: 'P1 - High', status: 'In Review', xpBounty: 60, createdAt: '2026-09-12 08:00:00', deadline: '2026-09-18 18:00:00', tags: ['n8n', 'integration'] },
  { taskId: 'QST-1004', title: 'Precision-recall benchmarks on image crawler', description: 'Evaluate Vertex AI retrieval accuracy across test datasets', assignee: 'Rohan Sharma', assigneeEmail: 'rohan.intern@company.com', priority: 'P0 - Blocker', status: 'Blocked', xpBounty: 100, createdAt: '2026-09-12 11:00:00', deadline: '2026-09-16 18:00:00', blockerDetails: 'External quota limit on Vertex AI API — waiting for infra team approval', tags: ['AI', 'evaluation'] },
  { taskId: 'QST-1005', title: 'Set up local Docker eval harness', description: 'Reproducible containerized environment for all evals', assignee: 'Devansh Kulkarni', assigneeEmail: 'dev.intern@company.com', priority: 'P2 - Medium', status: 'Done', xpBounty: 30, createdAt: '2026-09-11 14:00:00', deadline: '2026-09-15 18:00:00', completedAt: '2026-09-14 18:00:00', tags: ['devops', 'docker'] },
  { taskId: 'QST-1006', title: 'Hybrid sparse/dense reranking module', description: 'Implement and benchmark ScaNN + BM25 fusion approach', assignee: 'Devansh Kulkarni', assigneeEmail: 'dev.intern@company.com', priority: 'P2 - Medium', status: 'Open', xpBounty: 30, createdAt: '2026-09-15 09:00:00', deadline: '2026-09-22 18:00:00', tags: ['search', 'AI'] },
  { taskId: 'QST-1007', title: 'Write 14 unit test assertions for sanitization layer', description: 'Full branch coverage for all injection-mitigation paths', assignee: 'Ananya Verma', assigneeEmail: 'ananya.dev@company.com', priority: 'P2 - Medium', status: 'Done', xpBounty: 30, createdAt: '2026-09-11 10:00:00', deadline: '2026-09-13 18:00:00', completedAt: '2026-09-12 15:00:00', tags: ['testing'] },
];
```

**Layout**:
```
[ Page Header + "New Task" button ]
[ Stats Row: Open / In Progress / Blocked / Done counts ]
[ Filter bar: Status tabs | Priority dropdown | Search input ]
[ Task List: One card per task ]
```

**Task card**: Shows `taskId` badge, title, assignee avatar+name, priority badge, status badge, deadline, XP bounty, tags. If `Blocked`, show a rose-colored banner with `blockerDetails`. Allow clicking a task to expand it inline (not a modal).

---

### Phase 3.4 — `src/pages/app/RoadmapsPage.tsx`

**Purpose**: Founder → CTO AI Roadmap breakdown panel.

**Layout**:
```
[ Page Header: "Intern Roadmaps" ]
[ Two columns: Left=Generator Form, Right=Roadmap Output ]
```

**Left — Generator:**  
- Textarea: "Founder's Vision / Work Description" (large, 6 rows)
- Input: Intern Name
- Input: Intern Email
- Dropdown: Total Weeks (4, 6, 8)
- **Generate Roadmap** button — calls `ApiService.generateRoadmap()`. Show loading spinner while generating.

**Right — Roadmap Output:**  
When roadmap is generated, show it as a vertical timeline:
- Each week is a "milestone card" with week number badge (e.g., `W1`), title, XP bounty badge, deliverables as a bulleted list, and task rows below.
- Each task row: task ID, title, description, XP badge.
- At the bottom: **Accept Roadmap** (emerald button) | **Reject** (rose button) | **Undo** (zinc button).
- Accepting shows a success toast "Roadmap provisioned → intern sheet created."

---

### Phase 3.5 — `src/pages/app/TeamPage.tsx`

**Purpose**: Org hierarchy, XP leaderboard, team member profiles.

**Data**: Define inline `MOCK_TEAM: TeamMember[]` using the type from `types/index.ts`.

**Mock data:**
```ts
[
  { email: 'cto@questo.app', name: 'Aditya Kumar', role: 'CTO', title: 'Chief Technology Officer', department: 'Engineering', reportsTo: 'founder@questo.app', totalXp: 15200, level: 17, streakDays: 42, tasksCompleted: 183, deliveryReliability: 97, avatarColor: 'from-indigo-500 to-violet-600', initials: 'AK', joinedAt: '2026-01-01', status: 'Active' },
  { email: 'lead@questo.app', name: 'Priya Patel', role: 'TEAM_LEAD', title: 'Engineering Lead', department: 'Engineering', reportsTo: 'cto@questo.app', totalXp: 8600, level: 13, streakDays: 28, tasksCompleted: 94, deliveryReliability: 94, avatarColor: 'from-cyan-500 to-blue-600', initials: 'PP', joinedAt: '2026-02-15', status: 'Active' },
  { email: 'ananya.dev@company.com', name: 'Ananya Verma', role: 'ENGINEER', title: 'Software Engineer', department: 'Engineering', reportsTo: 'lead@questo.app', totalXp: 4200, level: 9, streakDays: 21, tasksCompleted: 47, deliveryReliability: 92, avatarColor: 'from-purple-500 to-pink-600', initials: 'AV', joinedAt: '2026-03-01', status: 'Active' },
  { email: 'rohan.intern@company.com', name: 'Rohan Sharma', role: 'INTERN', title: 'AI Systems Engineering Intern', department: 'AI Research', reportsTo: 'lead@questo.app', totalXp: 1420, level: 4, streakDays: 14, tasksCompleted: 12, deliveryReliability: 86, avatarColor: 'from-blue-500 to-indigo-600', initials: 'RS', joinedAt: '2026-09-01', status: 'Active' },
  { email: 'dev.intern@company.com', name: 'Devansh Kulkarni', role: 'INTERN', title: 'Infrastructure & Data Intern', department: 'Platform', reportsTo: 'lead@questo.app', totalXp: 980, level: 3, streakDays: 11, tasksCompleted: 8, deliveryReliability: 90, avatarColor: 'from-emerald-500 to-teal-600', initials: 'DK', joinedAt: '2026-09-01', status: 'Active' },
]
```

**Layout**:
```
[ Page Header: "Team" + "Invite Member" button (decorative) ]
[ Leaderboard Podium: Top 3 members with XP & level prominently displayed ]
[ Full Table: All members ranked by XP with Level, Streak, Tasks Done, Reliability%, Status badge ]
```

**Leaderboard Podium**: Show top 3 members in a row with their avatar (gradient circle + initials), name, role, XP total as big number, and level. Rank 1 gets a 🥇 badge, Rank 2 gets 🥈, Rank 3 gets 🥉.

**Table columns**: Rank | Member (avatar + name + email) | Role | Level | Total XP | Streak | Tasks Done | Reliability | Status

---

### Phase 3.6 — `src/pages/app/TalentPage.tsx`

**Purpose**: Job applicant review pipeline.

**Data**: Call `ApiService.getApplicants()` and `ApiService.submitApplication()` and `ApiService.decideApplicant()`.

**Layout**:
```
[ Page Header: "Talent Pipeline" + "Add Applicant" button ]
[ Kanban Board: 3 columns — Pending | Selected | Rejected ]
[ OR Table View toggle ]
```

**Toggle**: View toggle between Kanban and Table (default: Kanban).

**Kanban column**: Shows count badge in column header. Each applicant card:
- Name (bold) + email (muted)
- Role badge
- Skills pills (split by `, `, max 3 shown then `+N more`)
- Resume link (external link icon)
- Timestamp (muted, relative)
- Action buttons: `Select ✓` (emerald) | `Reject ✗` (rose) — only shown on "Pending" column cards
- Clicking card expands a drawer or modal with full details + feedback input + action buttons

**Add Applicant**: Button opens a modal/slide-in with form fields: Name, Email, Role, Skills, Resume URL.

---

### Phase 3.7 — `src/pages/app/LeavesPage.tsx`

**Purpose**: Leave & PTO request management.

**Data**: Inline mock data. Define `MOCK_LEAVES: LeaveRequest[]` using type from `types/index.ts`.

**Mock data:**
```ts
[
  { leaveId: 'LVE-1001', employeeEmail: 'rohan.intern@company.com', employeeName: 'Rohan Sharma', leaveType: 'Exam / Study', startDate: '2026-09-20', endDate: '2026-09-23', daysCount: 4, reason: 'University semester exams — Computer Networks & OS', status: 'Pending', streakProtected: false, tasksRescheduled: 0, submittedAt: '2026-09-15 10:00:00' },
  { leaveId: 'LVE-1002', employeeEmail: 'ananya.dev@company.com', employeeName: 'Ananya Verma', leaveType: 'Personal', startDate: '2026-09-25', endDate: '2026-09-25', daysCount: 1, reason: 'Family event', status: 'Approved', approverEmail: 'lead@questo.app', streakProtected: true, tasksRescheduled: 1, submittedAt: '2026-09-14 14:00:00' },
  { leaveId: 'LVE-1003', employeeEmail: 'dev.intern@company.com', employeeName: 'Devansh Kulkarni', leaveType: 'Sick', startDate: '2026-09-16', endDate: '2026-09-16', daysCount: 1, reason: 'Fever', status: 'Approved', approverEmail: 'lead@questo.app', streakProtected: true, tasksRescheduled: 0, submittedAt: '2026-09-16 09:00:00' },
]
```

**Layout**:
```
[ Page Header: "Leaves & PTO" + "Submit Request" button ]
[ Stats Row: Pending | Approved | Rejected counts ]
[ Leave Cards List ]
```

**Leave card**: Shows employee name + avatar, leave type badge, date range, days count, reason, status badge. If `Pending` and current user is `CTO` or `TEAM_LEAD`: show **Approve** (emerald) and **Reject** (rose) buttons. If `Approved`: show `Streak Protected: ✓` and `Tasks Rescheduled: N`.

**Submit Request Form** (shown as a slide-in panel when button is clicked):
- Select Leave Type (dropdown)
- Start Date (date input)
- End Date (date input)
- Reason (textarea)
- Submit button (saves to local state only, no API call needed)

---

### Phase 3.8 — `src/pages/app/MeetingsPage.tsx`

**Purpose**: Schedule and view Google Meet sessions.

**Data**: Inline mock data for existing meetings. New meetings created locally.

**Mock meetings:**
```ts
[
  { meetingId: 'MTG-001', title: '1-on-1 CTO Blocker Resolution with Rohan', attendees: ['cto@questo.app', 'rohan.intern@company.com'], meetLink: 'https://meet.google.com/abc-defg-hij', scheduledAt: '2026-09-16 15:00:00', duration: 30, type: '1-on-1 Mentorship', agenda: ['1. Vertex AI quota blocker root cause analysis', '2. Workaround evaluation: local fallback vs quota increase request', '3. Week 2 milestone re-scoping if quota not resolved'], createdBy: 'cto@questo.app', status: 'Scheduled' },
  { meetingId: 'MTG-002', title: 'Weekly Sprint Planning', attendees: ['lead@questo.app', 'ananya.dev@company.com', 'dev.intern@company.com'], meetLink: 'https://meet.google.com/xyz-uvwx-yz1', scheduledAt: '2026-09-15 10:00:00', duration: 60, type: 'Sprint Planning', agenda: ['1. Sprint 3 backlog grooming', '2. Capacity check for upcoming exams', '3. Blockers from last sprint retro'], createdBy: 'lead@questo.app', status: 'Completed' },
]
```

**Layout**:
```
[ Page Header: "Meetings" + "Schedule Meeting" button ]
[ Two columns: Left=Meeting Feed, Right=Scheduler Form ]
```

**Left — Meeting Feed:** Cards showing each meeting. Each card has: title, date/time, duration pill, attendee avatar stack, type badge, status badge. If `Scheduled`: show "Join Meeting" button (opens `meetLink` in new tab). Show agenda as a numbered list inside the expanded card.

**Right — Scheduler Form:**  
- Meeting Title (input)
- Attendees (comma-separated email input)
- Meeting Type (dropdown: Standup / Sprint Planning / Incident Triage / 1-on-1 Mentorship / Demo Review)
- Date (date input)
- Time (time input)
- Duration (dropdown: 15 / 30 / 45 / 60 minutes)
- **Schedule Meeting** button: generates a fake `meet.google.com/xxx-xxxx-xxx` link (random 3-4-3 character groups), creates the meeting locally, shows it in the feed. Display a success panel showing the generated Meet link with a "Copy Link" button.

---

### Phase 3.9 — `src/pages/app/AnalyticsPage.tsx`

**Purpose**: Performance, burnout risk, and AI coaching for each team member.

**Data**: Inline mock analytics data for each team member.

**Layout**:
```
[ Page Header: "Performance Analytics" + "Generate Report" button ]
[ Summary Stat Cards: Avg Reliability | Burnout Risk Count | Avg Streak | Top XP Earner ]
[ Member Analytics Cards: One per team member ]
```

**Member analytics card:**  
Large card for each member. Contains:
- Left: Avatar, name, role, level badge
- Center: 3 metrics as mini stats:
  - Delivery Reliability (shown as a colored progress bar: green > 90%, yellow 70-90%, red < 70%)
  - Standup Consistency (progress bar)
  - Avg Blocker Resolution Time
- Right: Burnout Risk badge (`🟢 Low` / `🟡 Medium` / `🔴 High`) and Streak Days
- Bottom: AI 1-on-1 Coaching Card (3 bullet points of AI feedback text in an indigo-tinted box)

**Mock analytics data:**
```ts
[
  { employeeName: 'Rohan Sharma', employeeEmail: 'rohan.intern@company.com', reliabilityScore: 86, blockerResolutionTime: '< 4.1 hrs', standupConsistency: 93, currentLevel: 'Level 4 — Senior Apprentice', xpTotal: 1420, streakDays: 14, burnoutRisk: 'Medium', aiFeedback: ['High velocity on API integration milestone with strong fundamentals.', 'Proactive blocker escalation is good — dependency on external Vertex AI quota needs CTO unblocking.', 'Recommendation: Prepare local fallback eval harness to unblock self while quota is being resolved.'] },
  { employeeName: 'Ananya Verma', employeeEmail: 'ananya.dev@company.com', reliabilityScore: 97, blockerResolutionTime: '< 1.2 hrs', standupConsistency: 100, currentLevel: 'Level 9 — Senior Engineer', xpTotal: 4200, streakDays: 21, burnoutRisk: 'Low', aiFeedback: ['Exceptional on-time delivery rate of 97% — consistently closes tasks before deadline.', 'Zero blockers in last 14 days shows strong self-sufficiency and system knowledge.', 'Recommendation: Consider leading architecture review for the n8n integration phase.'] },
  { employeeName: 'Devansh Kulkarni', employeeEmail: 'dev.intern@company.com', reliabilityScore: 90, blockerResolutionTime: '< 2.8 hrs', standupConsistency: 85, currentLevel: 'Level 3 — Apprentice', xpTotal: 980, streakDays: 11, burnoutRisk: 'Low', aiFeedback: ['Strong infrastructure foundation work with Docker and ScaNN benchmarks.', 'Standup consistency at 85% — 2 missed updates last week. Encourage daily habit.', 'Recommendation: Move to hybrid reranking task (ScaNN + BM25) this sprint for high impact.'] },
]
```

---

### Phase 3.10 — `src/pages/app/AppSettingsPage.tsx`

**Purpose**: Configure the Google Apps Script backend connection.

**Layout**:
```
[ Page Header: "Settings" ]
[ Two columns on lg+: Left=Nav (sections list), Right=Content ]
```

**Settings sections:**

**General:**
- App Name (readonly, "Questo Enterprise 2.0")
- Version (readonly, "v2.7.0")
- Logged in as (readonly: `user.name` / `user.email`)
- Role (readonly: `user.role`)

**Backend Connection:**  
Wraps the existing `ApiService` settings pattern:
- Google Apps Script Web App URL (text input + "Test Connection" button)
- OpenRouter / Gemini API Key (password input, masked)
- n8n Webhook URL (text input)
- Toggle: **Use Live Backend** (switch)  
  When off: uses localStorage simulation (default). When on: sends real HTTP requests to the GAS Web App URL.
- **Save Settings** button (calls `ApiService.saveSettings()`)

**Demo Instructions:**  
An info box explaining:
> "To connect a live backend: (1) Copy `questo/gas/QuestoBundle.js` into Google Apps Script. (2) Run `initializeQuestoSheet()`. (3) Deploy as Web App. (4) Paste the URL above. (5) Add your OpenRouter API key."

**Danger Zone:**
- **Sign Out** button (rose, calls `logout()`)

---

## Phase 4: Connecting the Landing Page

In the existing `frontend/src/App.tsx`, the Navbar has a **"Launch Workspace"** button that calls `scrollToSection('command-center')`. After the internal app is built:

1. Change the **"Launch Workspace"** button in `Navbar.tsx` so it navigates to `/login` (or `/app` if already authenticated) instead of scrolling.
2. Remove the `InteractiveApp`, `FeatureShowcase`, and `ArchitectureSection` components from the landing page **OR** keep them (the user's call). They can be hidden via commenting, not deleted.
3. The two CTA buttons in `Hero.tsx` ("Launch Control Center" and "Submit Daily Standup") should both navigate to `/login`.

**How to change navigation in Navbar.tsx:**
```tsx
import { useNavigate } from 'react-router-dom';
const navigate = useNavigate();
// Change: onClick={() => onScrollToSection('command-center')}
// To:     onClick={() => navigate('/login')}
```

---

## Phase 5: Shared UI Components (Create These First, Reference Them in Pages)

Create: `src/components/ui/` folder with these small reusable components.

### `src/components/ui/PageHeader.tsx`
```tsx
interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}
// Renders: h1 (title) + p (subtitle) + optional action on the right
// Use: in every page as the first element
```

### `src/components/ui/StatCard.tsx`
```tsx
interface StatCardProps {
  label: string;
  value: string | number;
  trend?: string;         // e.g. "+12% vs yesterday"
  trendPositive?: boolean;
  icon?: React.ReactNode;
}
// Card with label, big value, optional trend text
```

### `src/components/ui/Badge.tsx`
```tsx
interface BadgeProps {
  children: React.ReactNode;
  color?: 'zinc' | 'rose' | 'orange' | 'yellow' | 'emerald' | 'blue' | 'purple' | 'indigo';
}
// Renders a rounded pill badge with the correct color class
// Map color → Tailwind classes using the Status Badge Color Reference table above
```

### `src/components/ui/EmptyState.tsx`
```tsx
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}
// Centered empty state: icon, title, description, optional button
// Use when lists/tables have no items
```

---

## Phase 6: Final Verification Checklist

After building all phases, run these checks:

```bash
cd QuestO/frontend

# 1. TypeScript + Build must pass with 0 errors
bun run build

# 2. Dev server starts
bun run dev

# 3. Manual route checks in browser
# / → landing page loads, "Launch Workspace" goes to /login
# /login → login form visible, demo accounts visible
# Log in as cto@questo.app / demo → redirects to /app
# /app → Dashboard loads with KPI cards
# /app/standups → EOD form + feed loads
# /app/tasks → Task cards load
# /app/roadmaps → Generator form loads
# /app/team → Leaderboard loads
# /app/talent → Kanban board loads
# /app/leaves → Leave list loads
# /app/meetings → Meetings list + scheduler loads
# /app/analytics → Analytics cards load
# /app/settings → Settings form loads
# Log out → redirects to /login
# Navigating to /app without auth → redirects to /login
```

---

## File Structure After Completion

```
frontend/src/
├── contexts/
│   └── AuthContext.tsx           ✅ DONE
├── layouts/
│   └── DashboardLayout.tsx       ✅ DONE
├── types/
│   └── index.ts                  ✅ DONE
├── components/
│   ├── ui/
│   │   ├── PageHeader.tsx         🔲 BUILD
│   │   ├── StatCard.tsx           🔲 BUILD
│   │   ├── Badge.tsx              🔲 BUILD
│   │   └── EmptyState.tsx         🔲 BUILD
│   ├── ArchitectureSection.tsx    (existing)
│   ├── CommandPalette.tsx         (existing)
│   ├── FeatureShowcase.tsx        (existing)
│   ├── Footer.tsx                 (existing)
│   ├── GithubIcon.tsx             (existing)
│   ├── Hero.tsx                   (existing, minor nav update)
│   ├── InteractiveApp.tsx         (existing, stays)
│   ├── Navbar.tsx                 (existing, one nav update)
│   ├── SettingsModal.tsx          (existing)
│   └── Toast.tsx                  (existing)
├── pages/
│   ├── auth/
│   │   └── LoginPage.tsx          🔲 BUILD
│   └── app/
│       ├── DashboardHome.tsx      🔲 BUILD
│       ├── StandupsPage.tsx       🔲 BUILD
│       ├── TasksPage.tsx          🔲 BUILD
│       ├── RoadmapsPage.tsx       🔲 BUILD
│       ├── TeamPage.tsx           🔲 BUILD
│       ├── TalentPage.tsx         🔲 BUILD
│       ├── LeavesPage.tsx         🔲 BUILD
│       ├── MeetingsPage.tsx       🔲 BUILD
│       ├── AnalyticsPage.tsx      🔲 BUILD
│       └── AppSettingsPage.tsx    🔲 BUILD
├── services/
│   └── api.ts                     (existing, do not modify)
├── App.tsx                        (existing landing page, do not restructure)
├── RootRouter.tsx                 🔲 BUILD
└── main.tsx                       🔲 MODIFY (wrap with BrowserRouter + AuthProvider)
```

---

## Important Notes for the AI Agent

1. **Never modify** `App.tsx` structure, `services/api.ts`, or any existing component files except `Navbar.tsx` (one line change) and `main.tsx` (wrap with providers).
2. **Every page must compile cleanly.** Run `bun run build` after completing each phase before moving to the next.
3. **Mock data lives in the page files** unless `ApiService` already has the method (EODs, applicants, roadmap generation).
4. **No UI framework beyond what's already installed**: React 19, Tailwind CSS, Lucide React, `canvas-confetti`. Do not add shadcn, Radix, Headless UI, or any other component library.
5. **Dark mode**: every Tailwind class must have a `dark:` variant. The `dark` class on `<html>` is already managed by the existing App.tsx code — the `darkMode` state in App.tsx must be refactored to a context if used in the internal app. For now, default to dark mode in internal app by checking `document.documentElement.classList.contains('dark')`.
6. **Icons**: Use Lucide React only. Import from `lucide-react`. All icons already in the project: check `InteractiveApp.tsx` for the full import list.
7. **The build must pass with 0 TypeScript errors.** Use type assertions `as` where necessary but prefer proper typing.

