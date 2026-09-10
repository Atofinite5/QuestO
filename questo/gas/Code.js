/**
 * Questo Platform - Main Controller & Event Dispatcher (Unified 2.0)
 * File: gas/Code.js
 * 
 * Installs the custom UI menu '⚡ Questo AI 2.0' and provides a stunning
 * interactive Sidebar and Modal Command Center with custom SVGs and glowing icons.
 */

/**
 * Executes automatically when the Google Sheet is opened.
 */
function onOpen(e) {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('⚡ Questo AI 2.0')
    .addItem('✨ Open Questo AI Command Center (Glowing UI)', 'showCommandCenter')
    .addSeparator()
    .addItem('⚡ Initialize / Reset All 8 Sheets', 'menuInitializeSheet')
    .addSeparator()
    .addItem('◈ Run AI Standup Analysis', 'menuRunStandupAnalysis')
    .addItem('❖ Schedule Meeting with Google Meet Link', 'menuScheduleMeeting')
    .addItem('✦ Extract Action Items from Meeting Notes', 'menuExtractMeetingActions')
    .addSeparator()
    .addItem('❂ Submit Leave / Exam PTO Request', 'menuSubmitLeaveRequest')
    .addItem('✔ Quick-Approve Pending Leave Request', 'menuApproveLeaveRequest')
    .addSeparator()
    .addItem('▲ Generate AI Performance & Health Analytics', 'menuGeneratePerformanceAnalytics')
    .addItem('◼ Generate Weekly Executive Summary', 'menuGenerateWeeklySummary')
    .addItem('★ Recalculate XP & Org Hierarchy Levels', 'menuRecalculateLeaderboard')
    .addSeparator()
    .addItem('⚙ Configure API Keys & n8n Webhook', 'menuConfigureSettings')
    .addItem('ℹ About Questo Enterprise 2.0', 'menuShowAbout')
    .addToUi();
}

/**
 * Opens a polished, dark-mode Sidebar Command Center with custom glowing SVG icons.
 */
function showCommandCenter() {
  const html = HtmlService.createHtmlOutput(getCommandCenterHtml())
    .setTitle('⚡ Questo Enterprise 2.0')
    .setWidth(360);
  SpreadsheetApp.getUi().showSidebar(html);
}

/**
 * Returns HTML + CSS + SVG icons for the Command Center sidebar.
 */
function getCommandCenterHtml() {
  return `<!DOCTYPE html>
<html>
<head>
  <base target="_top">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #090d16;
      --card-bg: rgba(26, 34, 52, 0.7);
      --border: rgba(99, 102, 241, 0.2);
      --border-hover: rgba(99, 102, 241, 0.5);
      --primary-cyan: #06b6d4;
      --primary-indigo: #6366f1;
      --primary-purple: #a855f7;
      --text: #f8fafc;
      --text-muted: #94a3b8;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: 'Inter', -apple-system, sans-serif;
      background: linear-gradient(180deg, #090d16 0%, #0f172a 100%);
      color: var(--text);
      padding: 16px 12px;
      font-size: 13px;
      line-height: 1.4;
      min-height: 100vh;
    }
    .brand-card {
      background: radial-gradient(circle at top left, rgba(99, 102, 241, 0.15), transparent 70%),
                  rgba(15, 23, 42, 0.8);
      border: 1px solid rgba(99, 102, 241, 0.3);
      border-radius: 12px;
      padding: 14px;
      margin-bottom: 16px;
      box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.5), 0 0 15px rgba(99, 102, 241, 0.2);
      text-align: center;
    }
    .brand-title {
      font-size: 15px;
      font-weight: 700;
      letter-spacing: 0.5px;
      background: linear-gradient(135deg, #38bdf8 0%, #818cf8 50%, #c084fc 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
    }
    .brand-sub {
      color: var(--text-muted);
      font-size: 11px;
    }
    .section-title {
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      color: #64748b;
      margin: 14px 4px 8px;
    }
    .grid {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .action-btn {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 12px;
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 10px;
      color: var(--text);
      cursor: pointer;
      text-align: left;
      font-size: 12px;
      font-weight: 500;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      backdrop-filter: blur(8px);
    }
    .action-btn:hover {
      background: rgba(30, 41, 69, 0.9);
      border-color: var(--border-hover);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px -2px rgba(0, 0, 0, 0.5), 0 0 12px var(--glow-color, rgba(99, 102, 241, 0.3));
    }
    .action-btn:active {
      transform: translateY(0);
    }
    .icon-box {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      position: relative;
    }
    .icon-box svg {
      width: 18px;
      height: 18px;
      filter: drop-shadow(0 0 6px currentColor);
    }
    .btn-text {
      flex-grow: 1;
    }
    .btn-title {
      font-weight: 600;
      font-size: 12px;
      color: #f1f5f9;
      display: block;
    }
    .btn-desc {
      font-size: 10px;
      color: var(--text-muted);
      display: block;
    }

    /* Glow color variants */
    .glow-cyan {
      --glow-color: rgba(6, 182, 212, 0.4);
      background: rgba(6, 182, 212, 0.12);
      color: #38bdf8;
      border: 1px solid rgba(6, 182, 212, 0.3);
    }
    .glow-indigo {
      --glow-color: rgba(99, 102, 241, 0.4);
      background: rgba(99, 102, 241, 0.12);
      color: #818cf8;
      border: 1px solid rgba(99, 102, 241, 0.3);
    }
    .glow-purple {
      --glow-color: rgba(168, 85, 247, 0.4);
      background: rgba(168, 85, 247, 0.12);
      color: #c084fc;
      border: 1px solid rgba(168, 85, 247, 0.3);
    }
    .glow-emerald {
      --glow-color: rgba(16, 185, 129, 0.4);
      background: rgba(16, 185, 129, 0.12);
      color: #34d399;
      border: 1px solid rgba(16, 185, 129, 0.3);
    }
    .glow-amber {
      --glow-color: rgba(245, 158, 11, 0.4);
      background: rgba(245, 158, 11, 0.12);
      color: #fbbf24;
      border: 1px solid rgba(245, 158, 11, 0.3);
    }
    .glow-rose {
      --glow-color: rgba(244, 63, 94, 0.4);
      background: rgba(244, 63, 94, 0.12);
      color: #fb7185;
      border: 1px solid rgba(244, 63, 94, 0.3);
    }

    /* Status indicator */
    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(16, 185, 129, 0.1);
      border: 1px solid rgba(16, 185, 129, 0.3);
      color: #34d399;
      padding: 3px 8px;
      border-radius: 999px;
      font-size: 10px;
      font-weight: 500;
      margin-top: 6px;
    }
    .pulse-dot {
      width: 6px;
      height: 6px;
      background: #10b981;
      border-radius: 50%;
      box-shadow: 0 0 8px #10b981;
      animation: pulse 2s infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.4; transform: scale(1.2); }
    }
    .toast-msg {
      display: none;
      position: fixed;
      bottom: 12px;
      left: 12px;
      right: 12px;
      background: #1e293b;
      border: 1px solid #38bdf8;
      border-radius: 8px;
      padding: 10px;
      font-size: 11px;
      color: #38bdf8;
      text-align: center;
      box-shadow: 0 4px 15px rgba(0,0,0,0.6);
    }
  </style>
</head>
<body>

  <!-- Brand Header -->
  <div class="brand-card">
    <div class="brand-title">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 0 8px #38bdf8);">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
      </svg>
      Questo Enterprise 2.0
    </div>
    <div class="brand-sub">AI Ops, Meetings & Gamified Performance</div>
    <div class="status-badge">
      <span class="pulse-dot"></span> System Online & Synchronized
    </div>
  </div>

  <!-- System Setup -->
  <div class="section-title">System Foundation</div>
  <div class="grid">
    <button class="action-btn" onclick="run('menuInitializeSheet')">
      <div class="icon-box glow-indigo">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path>
          <path d="M12 12v9"></path>
          <path d="m16 16-4-4-4 4"></path>
        </svg>
      </div>
      <div class="btn-text">
        <span class="btn-title">Initialize / Reset Sheets</span>
        <span class="btn-desc">Bootstrap 8 operational tabs with schema & styling</span>
      </div>
    </button>
  </div>

  <!-- AI & Meetings -->
  <div class="section-title">AI Automation & Meetings</div>
  <div class="grid">
    <button class="action-btn" onclick="run('menuRunStandupAnalysis')">
      <div class="icon-box glow-cyan">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="11" width="18" height="10" rx="2"></rect>
          <circle cx="12" cy="5" r="2"></circle>
          <path d="M12 7v4"></path>
          <line x1="8" y1="16" x2="8" y2="16"></line>
          <line x1="16" y1="16" x2="16" y2="16"></line>
        </svg>
      </div>
      <div class="btn-text">
        <span class="btn-title">Run AI Standup Analysis</span>
        <span class="btn-desc">Sentiment (1-10) and blocker risk triage</span>
      </div>
    </button>

    <button class="action-btn" onclick="run('menuScheduleMeeting')">
      <div class="icon-box glow-purple">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
          <path d="m9 16 2 2 4-4"></path>
        </svg>
      </div>
      <div class="btn-text">
        <span class="btn-title">Schedule Google Meet</span>
        <span class="btn-desc">Auto-provisions Meet link + AI blocker agenda</span>
      </div>
    </button>

    <button class="action-btn" onclick="run('menuExtractMeetingActions')">
      <div class="icon-box glow-amber">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
          <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
          <line x1="12" y1="19" x2="12" y2="22"></line>
        </svg>
      </div>
      <div class="btn-text">
        <span class="btn-title">Extract Meeting Action Items</span>
        <span class="btn-desc">Parse transcripts into assigned tasks with bounties</span>
      </div>
    </button>
  </div>

  <!-- Leave & Org Protection -->
  <div class="section-title">Leave & Streak Protection</div>
  <div class="grid">
    <button class="action-btn" onclick="run('menuSubmitLeaveRequest')">
      <div class="icon-box glow-rose">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="12" y1="18" x2="12" y2="12"></line>
          <line x1="9" y1="15" x2="15" y2="15"></line>
        </svg>
      </div>
      <div class="btn-text">
        <span class="btn-title">Submit Leave / PTO Request</span>
        <span class="btn-desc">Study/exam leave with streak-freeze protection</span>
      </div>
    </button>

    <button class="action-btn" onclick="run('menuApproveLeaveRequest')">
      <div class="icon-box glow-emerald">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
      </div>
      <div class="btn-text">
        <span class="btn-title">Quick-Approve Pending Leave</span>
        <span class="btn-desc">Freezes streak & auto-reschedules task deadlines</span>
      </div>
    </button>
  </div>

  <!-- Analytics & Gamification -->
  <div class="section-title">Performance & Analytics</div>
  <div class="grid">
    <button class="action-btn" onclick="run('menuGeneratePerformanceAnalytics')">
      <div class="icon-box glow-cyan">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="20" x2="18" y2="10"></line>
          <line x1="12" y1="20" x2="12" y2="4"></line>
          <line x1="6" y1="20" x2="6" y2="14"></line>
        </svg>
      </div>
      <div class="btn-text">
        <span class="btn-title">Generate AI Health & Burnout</span>
        <span class="btn-desc">Delivery reliability % + 1-on-1 coaching cards</span>
      </div>
    </button>

    <button class="action-btn" onclick="run('menuGenerateWeeklySummary')">
      <div class="icon-box glow-purple">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
      </div>
      <div class="btn-text">
        <span class="btn-title">Generate Weekly Executive Brief</span>
        <span class="btn-desc">Velocity metrics, systemic blockers & MVP</span>
      </div>
    </button>

    <button class="action-btn" onclick="run('menuRecalculateLeaderboard')">
      <div class="icon-box glow-amber">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
          <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
          <path d="M4 22h16"></path>
          <path d="M10 14.66V17c0 .55-.45 1-1 1H7v4h10v-4h-2c-.55 0-1-.45-1-1v-2.34"></path>
          <path d="M6 4h12v7a6 6 0 0 1-12 0V4Z"></path>
        </svg>
      </div>
      <div class="btn-text">
        <span class="btn-title">Recalculate XP & Levels</span>
        <span class="btn-desc">Quadratic level formula & leaderboard sync</span>
      </div>
    </button>
  </div>

  <!-- Settings -->
  <div class="section-title">Configuration</div>
  <div class="grid">
    <button class="action-btn" onclick="run('menuConfigureSettings')">
      <div class="icon-box glow-indigo">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
        </svg>
      </div>
      <div class="btn-text">
        <span class="btn-title">Configure API Keys</span>
        <span class="btn-desc">Gemini API Key & n8n Webhook Endpoint</span>
      </div>
    </button>
  </div>

  <div id="toast" class="toast-msg"></div>

  <script>
    function run(functionName) {
      showToast('Executing ' + functionName + '...');
      google.script.run
        .withSuccessHandler(function() {
          showToast('Operation completed successfully!');
          setTimeout(hideToast, 2500);
        })
        .withFailureHandler(function(err) {
          showToast('Error: ' + err.message);
          setTimeout(hideToast, 4000);
        })[functionName]();
    }

    function showToast(msg) {
      var t = document.getElementById('toast');
      t.innerText = msg;
      t.style.display = 'block';
    }

    function hideToast() {
      var t = document.getElementById('toast');
      t.style.display = 'none';
    }
  </script>
</body>
</html>`;
}

/**
 * Handles spreadsheet edit events.
 */
function onEdit(e) {
  if (!e || !e.range) return;

  const range = e.range;
  const sheet = range.getSheet();
  const sheetName = sheet.getName();
  const row = range.getRow();
  const col = range.getColumn();

  // Guard: Ignore header row edits
  if (row === 1) return;

  // 1. Task Status Changes in "📋 Tasks & Quests" (Column F = 6)
  if (sheetName === '📋 Tasks & Quests' && col === 6) {
    const newStatus = e.value;
    const oldStatus = e.oldValue;
    TaskService.handleStatusChange(sheet, row, newStatus, oldStatus);
  }

  // 2. Direct Leave Status change in "🏖️ Leave & PTO Management" (Column J = 10)
  if (sheetName === '🏖️ Leave & PTO Management' && col === 10) {
    const newStatus = e.value;
    if (newStatus === 'Approved') {
      const leaveId = sheet.getRange(row, 1).getValue();
      LeaveService.approveLeave(leaveId, 'Approved directly via sheet dropdown.');
    }
  }

  // 3. Direct Standup edits in "⏱️ Daily Standups"
  if (sheetName === '⏱️ Daily Standups' && (col === 4 || col === 5 || col === 6)) {
    sheet.getRange(row, 7).setValue('Manual edit: pending AI analysis');
  }
}

// ---------------------------------------------------------------------------
// Custom Menu Action Handlers
// ---------------------------------------------------------------------------

function menuInitializeSheet() {
  const ui = SpreadsheetApp.getUi();
  const response = ui.alert(
    'Initialize Questo Enterprise Architecture',
    'This will configure all 8 operational sheets (Tasks, Standups, Hierarchy, Leave, Meetings, Analytics, Notes, Weekly) with headers, validations, and conditional formatting. Proceed?',
    ui.ButtonSet.YES_NO
  );

  if (response === ui.Button.YES) {
    initializeQuestoSheet();
  }
}

function menuRunStandupAnalysis() {
  StandupService.processPendingStandups();
}

function menuScheduleMeeting() {
  const ui = SpreadsheetApp.getUi();
  const titleResp = ui.prompt('Schedule Meeting', 'Enter Meeting Title (e.g. 1-on-1 Mentorship Sync):', ui.ButtonSet.OK_CANCEL);
  if (titleResp.getSelectedButton() !== ui.Button.OK) return;
  const title = titleResp.getResponseText().trim() || 'Team Sync';

  const attendeesResp = ui.prompt('Attendees', 'Enter comma-separated attendee emails:', ui.ButtonSet.OK_CANCEL);
  if (attendeesResp.getSelectedButton() !== ui.Button.OK) return;
  const attendees = attendeesResp.getResponseText().trim();

  const now = new Date();
  const start = new Date(now.getTime() + 3600000); // 1 hour from now
  const end = new Date(start.getTime() + 1800000);   // 30 mins duration

  const res = CalendarService.scheduleMeeting({
    title: title,
    meetingType: '1-on-1 Mentorship',
    host: Session.getActiveUser().getEmail() || 'lead@company.com',
    attendees: attendees,
    startTime: start.toISOString(),
    endTime: end.toISOString()
  });

  ui.alert('Meeting Scheduled!', `Meeting ID: ${res.meetingId}\nGoogle Meet Link:\n${res.meetLink}\n\nAI Agenda:\n${res.agenda}`, ui.ButtonSet.OK);
}

function menuSubmitLeaveRequest() {
  const ui = SpreadsheetApp.getUi();
  const typeResp = ui.prompt('Leave Type', 'Enter Leave Type (Sick Leave, Casual Leave, Exam / Study Leave, Vacation):', ui.ButtonSet.OK_CANCEL);
  if (typeResp.getSelectedButton() !== ui.Button.OK) return;
  const leaveType = typeResp.getResponseText().trim() || 'Casual Leave';

  const daysResp = ui.prompt('Duration', 'How many days from today? (Enter integer, e.g. 3):', ui.ButtonSet.OK_CANCEL);
  if (daysResp.getSelectedButton() !== ui.Button.OK) return;
  const days = parseInt(daysResp.getResponseText().trim(), 10) || 1;

  const reasonResp = ui.prompt('Reason', 'Brief reason for leave:', ui.ButtonSet.OK_CANCEL);
  if (reasonResp.getSelectedButton() !== ui.Button.OK) return;
  const reason = reasonResp.getResponseText().trim() || 'Personal';

  const email = Session.getActiveUser().getEmail() || 'intern@company.com';
  const start = new Date();
  const end = new Date(start.getTime() + ((days - 1) * 24 * 60 * 60 * 1000));

  const leaveId = LeaveService.submitLeave(
    email,
    leaveType,
    Utilities.formatDate(start, Session.getScriptTimeZone(), 'yyyy-MM-dd'),
    Utilities.formatDate(end, Session.getScriptTimeZone(), 'yyyy-MM-dd'),
    reason
  );

  ui.alert('Leave Submitted!', `Leave request ${leaveId} created and routed for manager approval.`, ui.ButtonSet.OK);
}

function menuApproveLeaveRequest() {
  const ui = SpreadsheetApp.getUi();
  const resp = ui.prompt('Approve Leave', 'Enter Leave ID to approve (e.g. LVE-5001):', ui.ButtonSet.OK_CANCEL);
  if (resp.getSelectedButton() !== ui.Button.OK) return;
  const leaveId = resp.getResponseText().trim();

  if (leaveId) {
    const success = LeaveService.approveLeave(leaveId, 'Approved via Questo AI Menu.');
    if (success) {
      ui.alert('Success', `Leave ${leaveId} approved! Streak is protected and active tasks rescheduled.`, ui.ButtonSet.OK);
    } else {
      ui.alert('Error', `Leave ID ${leaveId} not found.`, ui.ButtonSet.OK);
    }
  }
}

function menuGeneratePerformanceAnalytics() {
  AnalyticsService.generateAllAnalytics();
}

function menuExtractMeetingActions() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const meetingSheet = ss.getSheetByName('🎙️ Meeting Notes & Actions');
  const taskSheet = ss.getSheetByName('📋 Tasks & Quests');

  if (!meetingSheet || !taskSheet) {
    SpreadsheetApp.getUi().alert('Meeting or Task sheet not found. Please run Initialization first.');
    return;
  }

  const rows = meetingSheet.getDataRange().getValues();
  let extractedCount = 0;

  for (let i = 1; i < rows.length; i++) {
    const meetingId = rows[i][0];
    const meetingTitle = rows[i][2];
    const transcript = rows[i][3];
    const isSynced = rows[i][5];

    if (transcript && (!isSynced || isSynced === false)) {
      try {
        const result = AiService.extractMeetingTasks(meetingTitle, transcript);
        if (result && result.tasks && Array.isArray(result.tasks)) {
          meetingSheet.getRange(i + 1, 5).setValue(JSON.stringify(result.tasks));
          
          result.tasks.forEach(t => {
            TaskService.createTask({
              title: t.title,
              assignee: t.assignee,
              description: `Generated from ${meetingTitle} (${meetingId}): ${t.description || ''}`,
              priority: t.priority || 'P2 - Medium',
              dueDate: t.dueDate || ''
            });
            extractedCount++;
          });

          meetingSheet.getRange(i + 1, 6).setValue(true);
        }
      } catch (err) {
        Logger.log(`Error extracting meeting actions: ${err.message}`);
      }
    }
  }

  SpreadsheetApp.getActive().toast(`Extracted and assigned ${extractedCount} tasks from meeting notes.`, 'Action Item Sync', 6);
}

function menuGenerateWeeklySummary() {
  ReportService.generateWeeklyReport();
}

function menuRecalculateLeaderboard() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('🏆 Employees & Org Hierarchy') || ss.getSheetByName('🏆 Employees & XP Leaderboard');
  if (!sheet) return;

  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    const xp = Number(data[i][5]) || 0; // Column F = Total XP
    const level = GamificationService.calculateLevel(xp);
    sheet.getRange(i + 1, 7).setValue(level); // Column G = Level
  }
  SpreadsheetApp.getActive().toast('All employee levels and ranks synchronized.', 'Questo Gamification', 5);
}

function menuConfigureSettings() {
  const ui = SpreadsheetApp.getUi();
  const prompt1 = ui.prompt('Configure Gemini API Key', 'Enter your Google Gemini API Key:', ui.ButtonSet.OK_CANCEL);
  if (prompt1.getSelectedButton() === ui.Button.OK) {
    const key = prompt1.getResponseText().trim();
    if (key) {
      PropertiesService.getScriptProperties().setProperty('GEMINI_API_KEY', key);
      ui.alert('Gemini API key saved securely into Script Properties!');
    }
  }

  const prompt2 = ui.prompt('Configure n8n Webhook URL', 'Enter the n8n Webhook URL to receive Questo events:', ui.ButtonSet.OK_CANCEL);
  if (prompt2.getSelectedButton() === ui.Button.OK) {
    const url = prompt2.getResponseText().trim();
    if (url) {
      PropertiesService.getScriptProperties().setProperty('N8N_WEBHOOK_URL', url);
      ui.alert('n8n Webhook URL saved successfully!');
    }
  }
}

function menuShowAbout() {
  const ui = SpreadsheetApp.getUi();
  const message = `Questo Enterprise v2.0\nAI-Powered Company Operations, Meeting Orchestrator & Gamified Performance Engine.\n\nFeatures:\n• Full Pipeline: CEO -> CTO -> Leads -> Interns / Students\n• Automated Meetings: Auto-provisions Google Meet links & AI blocker agendas\n• Leave & PTO Engine: Streak-freezing protection & task auto-rescheduling\n• AI Performance Analytics: Delivery reliability %, burnout warnings, 1-on-1 cards\n• Gamification: RPG-style XP, Leveling curve, Badges, and Streaks`;

  ui.alert('About Questo Enterprise 2.0', message, ui.ButtonSet.OK);
}
