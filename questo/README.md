# Questo Enterprise Platform 2.0 — Quickstart & Operations Guide

Welcome to **Questo Enterprise 2.0**, the comprehensive company operations, employee task management, and performance intelligence platform orchestrated via **Google Sheets**, **Google Apps Script (GAS)**, and **n8n Multi-Agent workflows**.

Questo connects the complete organizational pipeline: **CEO $\rightarrow$ CTO $\rightarrow$ Team Leads $\rightarrow$ Engineers $\rightarrow$ Interns / Students**.

---

## 📁 Repository Structure

```
questo/
├── 01_ARCHITECTURE.md              # System topology, event schemas, API contracts
├── 02_HLD.md                       # High Level Design: user journeys, SLAs, capacity
├── 03_LLD.md                       # Low Level Design: math models, locking, interfaces
├── 04_SECURITY_CVE.md              # STRIDE threat model, CVE hardening, secret hygiene
├── 05_QUALITY_RUBRIC.md            # 95+ code quality criteria & verification harness
├── README.md                       # This unified operations guide
├── gas/                            # Google Apps Script Source Files (Paste into Sheet)
│   ├── Code.js                     # Main menu ('⚡ Questo AI 2.0'), modal dialogs, triggers
│   ├── Setup.js                    # One-click generator for all 8 sheets, dropdowns & colors
│   ├── CalendarService.js          # Google Meet auto-generation & blocker-aware agendas
│   ├── LeaveService.js             # PTO state machine, streak-freezing & task rescheduling
│   ├── AnalyticsService.js         # Delivery reliability %, burnout risk, AI 1-on-1 cards
│   ├── TaskService.js              # State transitions, P0 blocker detection, XP trigger
│   ├── StandupService.js           # Daily standup logging & AI risk/sentiment analysis
│   ├── GamificationService.js      # XP engine, quadratic level curve, badges & streaks
│   ├── AiService.js                # Gemini 1.5 Flash / OpenAI connector & prompt engine
│   ├── WebhookService.js           # doPost(e) Web App API and outbound n8n dispatcher
│   └── ReportService.js            # Weekly report synthesis & team velocity compiler
└── n8n/                            # Importable n8n Multi-Agent Workflow Templates
    ├── workflow_standup_agent.json # Daily standup parser + risk evaluation agent
    ├── workflow_blocker_alert.json # P0 blocker auto-escalation bot (Slack)
    ├── workflow_meeting_parser.json# Audio/transcript to structured quests
    ├── workflow_weekly_digest.json # Friday executive report & leaderboard cron
    ├── workflow_leave_approval.json# Interactive Slack leave approval with streak freeze
    └── workflow_meeting_scheduler.json # Google Meet scheduler + AI pre-meeting agendas
```

---

## 🚀 Step 1: Set Up Google Sheet & Apps Script

1. **Create a Google Sheet**:
   - Open [Google Sheets](https://sheets.new) in your browser.
   - Title it `Questo - Company Operations & Tasks`.
2. **Open the Apps Script Editor**:
   - In Google Sheets, click **Extensions** $\rightarrow$ **Apps Script**.
3. **Copy the Script Files**:
   - Delete any default boilerplate in `Code.gs`.
   - Click the `+` icon next to **Files** $\rightarrow$ **Script** for each file in `questo/gas/`:
     - `Setup.gs` (copy from `questo/gas/Setup.js`)
     - `CalendarService.gs` (copy from `questo/gas/CalendarService.js`)
     - `LeaveService.gs` (copy from `questo/gas/LeaveService.js`)
     - `AnalyticsService.gs` (copy from `questo/gas/AnalyticsService.js`)
     - `AiService.gs` (copy from `questo/gas/AiService.js`)
     - `GamificationService.gs` (copy from `questo/gas/GamificationService.js`)
     - `TaskService.gs` (copy from `questo/gas/TaskService.js`)
     - `StandupService.gs` (copy from `questo/gas/StandupService.js`)
     - `WebhookService.gs` (copy from `questo/gas/WebhookService.js`)
     - `ReportService.gs` (copy from `questo/gas/ReportService.js`)
     - `Code.gs` (copy from `questo/gas/Code.js`)
   - Save your project (`Cmd + S`).

---

## ⚡ Step 2: One-Click Initialization

1. In the Apps Script editor, select function `initializeQuestoSheet` from the dropdown and click **Run**.
2. Authorize Google Sheets and Google Calendar permissions when prompted.
3. Switch back to your Google Sheet:
   - All 8 operational tabs are generated:
     1. `📋 Tasks & Quests`: Task tracking, P0-P3 priorities, ETAs, and XP bounties.
     2. `⏱️ Daily Standups`: Daily updates with AI sentiment and risk scores.
     3. `🏆 Employees & Org Hierarchy`: CEO $\rightarrow$ CTO $\rightarrow$ Leads $\rightarrow$ Interns pipeline, XP, levels, and streaks.
     4. `🏖️ Leave & PTO Management`: Student/employee leave tracking, streak freeze status, and task auto-rescheduling.
     5. `📅 Scheduled Meetings & Meet Links`: Meeting coordinator with native Google Meet links and AI agendas.
     6. `📈 Performance & Health Analytics`: Delivery reliability %, burnout risk, and AI 1-on-1 coaching cards.
     7. `🎙️ Meeting Notes & Actions`: Transcript ingestion and task extractor.
     8. `📊 Weekly Summaries`: Executive briefs and team velocity.
     9. `⚙️ Config & Prompts`: Master configurations.
4. Refresh the sheet: the **`⚡ Questo AI 2.0`** menu will appear at the top!

---

## 🔑 Step 3: Configure AI Keys & Deploy Web App

1. **Add Gemini API Key**:
   - In Google Sheets, click **`⚡ Questo AI 2.0`** $\rightarrow$ **`⚙️ Configure API Keys & n8n Webhook`**.
   - Enter your Gemini API key (from [Google AI Studio](https://aistudio.google.com/)).
2. **Deploy as a Web App (for n8n communication)**:
   - In Apps Script editor, click **Deploy** $\rightarrow$ **New deployment**.
   - Select type: **Web app**.
   - Execute as: **Me** (`your-email@company.com`).
   - Who has access: **Anyone**.
   - Click **Deploy** and copy the **Web app URL** (`https://script.google.com/macros/s/.../exec`).

---

## 🤖 Step 4: Import n8n Agent Workflows

In your n8n workspace, import the workflow JSON files from `questo/n8n/`:
1. `workflow_standup_agent.json`: Ingests standups via Slack, runs Gemini risk triage, updates Questo.
2. `workflow_blocker_alert.json`: Listens for P0 blockers and dispatches alerts to `#incident-ops`.
3. `workflow_meeting_parser.json`: Converts meeting notes into assigned tasks.
4. `workflow_weekly_digest.json`: Friday 5 PM cron generating the executive brief and leaderboard.
5. `workflow_leave_approval.json`: Sends interactive Slack leave approval requests to managers; freezes streaks and reschedules tasks.
6. `workflow_meeting_scheduler.json`: Schedules Google Meet links with customized pre-meeting blocker agendas.

---

## 🌟 Key Capabilities & Operational Rules

### 1. Automated Google Meet Coordination
- Click **`⚡ Questo AI 2.0`** $\rightarrow$ **`📅 Schedule Meeting with Google Meet Link`**.
- Input title and attendees.
- Questo creates the Google Calendar event, provisions a native `meet.google.com` room, scans attendee active blockers in Questo, generates a 3-bullet AI agenda, and writes it directly to the sheet.

### 2. Leave & PTO Engine with Streak Protection
- Interns and students click **`🏖️ Submit Leave / Exam PTO Request`**.
- The request routes to their manager based on the `🏆 Employees & Org Hierarchy` tab.
- Upon approval:
  - The employee's standup streak is **frozen** (not broken or reset).
  - Assigned active tasks with deadlines during the leave are **automatically extended** by the leave duration.

### 3. AI Performance & Burnout Analytics
- Click **`📈 Generate AI Performance & Health Analytics`**.
- Computes on-time delivery reliability %, standup consistency, and flags burnout warning signs before deadlines fail.
- Gemini 1.5 Pro generates 3-sentence actionable 1-on-1 coaching cards for managers.
