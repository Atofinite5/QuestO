/**
 * Questo Platform - Main Controller & Event Dispatcher (Unified 2.0)
 * File: gas/Code.js
 * 
 * Installs the custom UI menu '⚡ Questo AI 2.0', handles onOpen/onEdit event triggers,
 * provides modal dialogs for meeting scheduling, leave management, standups,
 * and AI performance analytics.
 */

/**
 * Executes automatically when the Google Sheet is opened.
 */
function onOpen(e) {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('⚡ Questo AI 2.0')
    .addItem('🚀 Initialize / Reset All 8 Sheets', 'menuInitializeSheet')
    .addSeparator()
    .addItem('🤖 Run AI Standup Analysis', 'menuRunStandupAnalysis')
    .addItem('📅 Schedule Meeting with Google Meet Link', 'menuScheduleMeeting')
    .addItem('🎙️ Extract Action Items from Meeting Notes', 'menuExtractMeetingActions')
    .addSeparator()
    .addItem('🏖️ Submit Leave / Exam PTO Request', 'menuSubmitLeaveRequest')
    .addItem('✅ Quick-Approve Pending Leave Request', 'menuApproveLeaveRequest')
    .addSeparator()
    .addItem('📈 Generate AI Performance & Health Analytics', 'menuGeneratePerformanceAnalytics')
    .addItem('📊 Generate Weekly Executive Summary', 'menuGenerateWeeklySummary')
    .addItem('🏆 Recalculate XP & Org Hierarchy Levels', 'menuRecalculateLeaderboard')
    .addSeparator()
    .addItem('⚙️ Configure API Keys & n8n Webhook', 'menuConfigureSettings')
    .addItem('ℹ️ About Questo Enterprise 2.0', 'menuShowAbout')
    .addToUi();
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
  const message = `Questo Enterprise v2.0
AI-Powered Company Operations, Meeting Orchestrator & Gamified Performance Engine.

Features:
• Full Pipeline: CEO -> CTO -> Leads -> Interns / Students
• Automated Meetings: Auto-provisions Google Meet links & AI blocker agendas
• Leave & PTO Engine: Streak-freezing protection & task auto-rescheduling
• AI Performance Analytics: Delivery reliability %, burnout warnings, 1-on-1 cards
• Gamification: RPG-style XP, Leveling curve, Badges, and Streaks`;

  ui.alert('About Questo Enterprise 2.0', message, ui.ButtonSet.OK);
}
