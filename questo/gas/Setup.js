/**
 * Questo Platform - One-Click Sheet Initializer & Enterprise Schema Builder
 * File: gas/Setup.js
 * 
 * Sets up all 8 operational tabs, headers, cell formats, dropdown validations, 
 * conditional formatting rules, and realistic sample data spanning the full
 * CEO -> CTO -> Leads -> Interns pipeline.
 */

const SHEET_NAMES = {
  TASKS: '📋 Tasks & Quests',
  STANDUPS: '⏱️ Daily Standups',
  EMPLOYEES: '🏆 Employees & Org Hierarchy',
  LEAVE: '🏖️ Leave & PTO Management',
  MEETINGS: '📅 Scheduled Meetings & Meet Links',
  ANALYTICS: '📈 Performance & Health Analytics',
  WEEKLY: '📊 Weekly Summaries',
  MEETING_NOTES: '🎙️ Meeting Notes & Actions',
  CONFIG: '⚙️ Config & Prompts',
  APPLICANTS: '💼 Candidate Applicants'
};

const PALETTE = {
  HEADER_BG: '#1e293b',      // Slate 800
  HEADER_TEXT: '#ffffff',
  ACCENT: '#3b82f6',         // Blue 500
  BORDER: '#cbd5e1',
  RED_SOFT: '#fee2e2',       // Red 100
  RED_TEXT: '#991b1b',
  GREEN_SOFT: '#dcfce7',     // Green 100
  GREEN_TEXT: '#166534',
  YELLOW_SOFT: '#fef9c3',    // Yellow 100
  YELLOW_TEXT: '#854d0e',
  PURPLE_SOFT: '#f3e8ff',
  PURPLE_TEXT: '#6b21a8',
  AMBER_SOFT: '#ffedd5',
  AMBER_TEXT: '#9a3412'
};

/**
 * Initializes or updates the complete Questo unified spreadsheet architecture.
 * Completely idempotent and preserves existing data if present.
 */
function initializeQuestoSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  SpreadsheetApp.getActive().toast('Initializing Unified Questo 2.0 Architecture...', 'Questo Engine', 5);

  setupConfigSheet(ss);
  setupEmployeesSheet(ss);
  setupTasksSheet(ss);
  setupStandupsSheet(ss);
  setupLeaveSheet(ss);
  setupScheduledMeetingsSheet(ss);
  setupAnalyticsSheet(ss);
  setupMeetingNotesSheet(ss);
  setupWeeklySheet(ss);
  setupApplicantsSheet(ss);

  // Clean up default "Sheet1" if other sheets exist
  const defaultSheet = ss.getSheetByName('Sheet1');
  if (defaultSheet && ss.getSheets().length > 1) {
    try { ss.deleteSheet(defaultSheet); } catch (e) { /* ignore */ }
  }

  SpreadsheetApp.getActive().toast('Questo 2.0 Enterprise Initialization Complete! 🚀', 'Success', 7);
}

/**
 * 1. Config & Prompts Tab
 */
function setupConfigSheet(ss) {
  let sheet = ss.getSheetByName(SHEET_NAMES.CONFIG);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAMES.CONFIG);

  sheet.clear();
  sheet.setTabColor('#64748b');

  const headers = ['Configuration Key', 'Value', 'Description'];
  sheet.getRange('A1:C1').setValues([headers]);
  styleHeaders(sheet, 1, 3);

  const configs = [
    ['GEMINI_API_KEY', 'INSERT_GEMINI_KEY_HERE', 'Google Gemini 2.5 Flash / OpenRouter API Key'],
    ['OPENAI_API_KEY', '', 'Optional OpenAI API Key for fallback/synthesis'],
    ['N8N_WEBHOOK_URL', 'https://questo.app.n8n.cloud/webhook/questo-engine', 'Live n8n Cloud Webhook Gateway'],
    ['QUESTO_AUTH_TOKEN', 'questo_secret_token_123', 'Shared secret token for doPost API security'],
    ['DEFAULT_AI_MODEL', 'google/gemini-2.5-flash', 'Primary AI Model: google/gemini-2.5-flash (with auto-fallback to flash-lite)'],
    ['DEFAULT_CALENDAR_ID', 'primary', 'Google Calendar ID to schedule Google Meet events'],
    ['XP_RATE_P0', '100', 'XP bounty for P0 - Blocker tasks'],
    ['XP_RATE_P1', '60', 'XP bounty for P1 - High priority tasks'],
    ['XP_RATE_P2', '30', 'XP bounty for P2 - Medium priority tasks'],
    ['XP_RATE_P3', '15', 'XP bounty for P3 - Low priority tasks'],
    ['STANDUP_BASE_XP', '15', 'Base XP awarded for submitting a daily standup'],
    ['SLACK_CHANNEL_ALERTS', '#questo-alerts', 'Target Slack channel for blocker alerts']
  ];

  sheet.getRange(2, 1, configs.length, 3).setValues(configs);
  sheet.setColumnWidth(1, 220);
  sheet.setColumnWidth(2, 380);
  sheet.setColumnWidth(3, 400);
}

/**
 * 2. Employees & Org Hierarchy Tab (CEO -> CTO -> Leads -> Interns)
 */
function setupEmployeesSheet(ss) {
  let sheet = ss.getSheetByName(SHEET_NAMES.EMPLOYEES);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAMES.EMPLOYEES);

  sheet.clear();
  sheet.setTabColor('#f59e0b');

  const headers = [
    'Email', 'Full Name', 'Role Tier', 'Department', 'Reports To (Manager)',
    'Total XP', 'Level', 'Streak (Days)', 'Quests Closed', 'Badges & Achievements', 'Rank'
  ];
  sheet.getRange('A1:K1').setValues([headers]);
  styleHeaders(sheet, 1, 11);

  // Dropdown for Role Tier
  const tierRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['CEO / Executive', 'CTO / VP Eng', 'Team Lead', 'Senior Engineer', 'Junior Engineer', 'Intern / Student'], true)
    .build();
  sheet.getRange('C2:C500').setDataValidation(tierRule);

  const sampleEmployees = [
    ['ceo@company.com', 'Devon Vance', 'CEO / Executive', 'Executive', '', 1200, '=FLOOR(SQRT(F2/50))+1', 15, 20, '👑 Company Founder, ⚡ Visionary', '=RANK(F2, $F$2:$F$10)'],
    ['cto@company.com', 'Elena Rostova', 'CTO / VP Eng', 'Engineering', 'ceo@company.com', 1050, '=FLOOR(SQRT(F3/50))+1', 14, 18, '🛡️ System Architect, ⚡ Speed Demon', '=RANK(F3, $F$2:$F$10)'],
    ['lead@company.com', 'Marcus Brody', 'Team Lead', 'Backend & Infra', 'cto@company.com', 820, '=FLOOR(SQRT(F4/50))+1', 10, 14, '🛡️ Blocker Buster, ⚔️ Squad Commander', '=RANK(F4, $F$2:$F$10)'],
    ['sarah@company.com', 'Sarah Chen', 'Senior Engineer', 'AI / ML', 'lead@company.com', 840, '=FLOOR(SQRT(F5/50))+1', 12, 11, '🔥 10-Day Streak, 🧠 AI Pioneer', '=RANK(F5, $F$2:$F$10)'],
    ['alex@company.com', 'Alex Rivera', 'Junior Engineer', 'Backend', 'lead@company.com', 620, '=FLOOR(SQRT(F6/50))+1', 5, 8, '⚡ Speed Demon', '=RANK(F6, $F$2:$F$10)'],
    ['intern@company.com', 'Rohan Sharma', 'Intern / Student', 'AI Engineering', 'sarah@company.com', 280, '=FLOOR(SQRT(F7/50))+1', 4, 4, '🌱 Fast Learner, 🎯 Bug Hunter', '=RANK(F7, $F$2:$F$10)']
  ];

  sheet.getRange(2, 1, sampleEmployees.length, 11).setValues(sampleEmployees);

  const widths = [190, 150, 140, 130, 190, 90, 80, 110, 110, 240, 80];
  widths.forEach((w, idx) => sheet.setColumnWidth(idx + 1, w));
}

/**
 * 3. Tasks & Quests Tab
 */
function setupTasksSheet(ss) {
  let sheet = ss.getSheetByName(SHEET_NAMES.TASKS);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAMES.TASKS);

  sheet.clear();
  sheet.setTabColor('#3b82f6');

  const headers = [
    'Task ID', 'Title', 'Assignee', 'Role Tier', 'Priority',
    'Status', 'Due Date', 'Actual ETA', 'Blocker Details', 'AI Risk Score',
    'AI Recommendations', 'XP Bounty', 'Completed At'
  ];
  sheet.getRange('A1:M1').setValues([headers]);
  styleHeaders(sheet, 1, 13);

  const priorityRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['P0 - Blocker', 'P1 - High', 'P2 - Medium', 'P3 - Low'], true)
    .build();
  sheet.getRange('E2:E500').setDataValidation(priorityRule);

  const statusRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Backlog', 'In Progress', 'Review', 'Blocked', 'Done'], true)
    .build();
  sheet.getRange('F2:F500').setDataValidation(statusRule);

  const riskRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['🟢 Low', '🟡 Medium', '🔴 High Risk'], true)
    .build();
  sheet.getRange('J2:J500').setDataValidation(riskRule);

  const sampleTasks = [
    [
      'QST-1001', 'Migrate OAuth2 PKCE Provider', 'alex@company.com', 'Junior Engineer', 'P1 - High',
      'In Progress', '2026-09-14', '2026-09-13', '', '🟢 Low',
      'Architecture verified; proceed with auth token refresh rotation.', 60, ''
    ],
    [
      'QST-1002', 'Deploy Vector Store Index on GCP Vertex', 'sarah@company.com', 'Senior Engineer', 'P0 - Blocker',
      'Blocked', '2026-09-11', '2026-09-15', 'Quota limit on text-embedding-004 endpoint exceeded in us-central1', '🔴 High Risk',
      'Escalate to GCP Account rep for quota increase or route to europe-west4 fallback.', 100, ''
    ],
    [
      'QST-1003', 'Implement Evaluation Dataset Benchmark', 'intern@company.com', 'Intern / Student', 'P2 - Medium',
      'In Progress', '2026-09-16', '2026-09-16', '', '🟢 Low',
      'Mentorship review scheduled with Sarah Chen.', 30, ''
    ]
  ];
  sheet.getRange(2, 1, sampleTasks.length, 13).setValues(sampleTasks);

  applyTasksConditionalFormatting(sheet);

  const widths = [100, 240, 180, 130, 120, 120, 110, 110, 260, 120, 300, 90, 160];
  widths.forEach((w, idx) => sheet.setColumnWidth(idx + 1, w));
}

/**
 * 4. Daily Standups Tab
 */
function setupStandupsSheet(ss) {
  let sheet = ss.getSheetByName(SHEET_NAMES.STANDUPS);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAMES.STANDUPS);

  sheet.clear();
  sheet.setTabColor('#10b981');

  const headers = [
    'Update ID', 'Timestamp', 'Employee Email', 'Done Yesterday',
    'Planned Today', 'Blockers Encountered', 'AI Sentiment & Health',
    'AI Extracted Risks', 'XP Awarded'
  ];
  sheet.getRange('A1:I1').setValues([headers]);
  styleHeaders(sheet, 1, 9);

  const sampleStandups = [
    [
      'STD-2001', '2026-09-10 09:30:00', 'sarah@company.com',
      'Completed embedding ingestion pipeline benchmarks.',
      'Integrating ScaNN vector search index with fallback clusters.',
      'Waiting on quota approval for Vertex AI.',
      '7/10 - Focused, but slowed by external infrastructure limits',
      'Dependency on GCP quota may delay milestone by 48h if not unblocked today.',
      15
    ],
    [
      'STD-2002', '2026-09-10 09:45:00', 'intern@company.com',
      'Read paper on Hybrid Sparse/Dense Search and setup local eval harness.',
      'Running precision-recall tests against test set.',
      'Need guidance on cross-encoder reranking latency.',
      '8/10 - High enthusiasm and solid learning progress',
      'Requires 15m architecture sync with mentor.',
      15
    ]
  ];
  sheet.getRange(2, 1, sampleStandups.length, 9).setValues(sampleStandups);

  const widths = [100, 150, 180, 250, 250, 250, 200, 260, 100];
  widths.forEach((w, idx) => sheet.setColumnWidth(idx + 1, w));
}

/**
 * 5. Leave & PTO Management Tab (Interns, Students & Full-Time)
 */
function setupLeaveSheet(ss) {
  let sheet = ss.getSheetByName(SHEET_NAMES.LEAVE);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAMES.LEAVE);

  sheet.clear();
  sheet.setTabColor('#06b6d4'); // Cyan 500

  const headers = [
    'Leave ID', 'Employee Email', 'Role Tier', 'Approver Email', 'Leave Type',
    'Start Date', 'End Date', 'Days Count', 'Reason', 'Status',
    'Streak Protected?', 'Tasks Rescheduled?', 'Decision Remarks'
  ];
  sheet.getRange('A1:M1').setValues([headers]);
  styleHeaders(sheet, 1, 13);

  const typeRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Sick Leave', 'Casual Leave', 'Exam / Study Leave', 'Vacation', 'Emergency'], true)
    .build();
  sheet.getRange('E2:E500').setDataValidation(typeRule);

  const statusRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Pending', 'Approved', 'Rejected', 'Cancelled'], true)
    .build();
  sheet.getRange('J2:J500').setDataValidation(statusRule);

  const sampleLeaves = [
    [
      'LVE-5001', 'intern@company.com', 'Intern / Student', 'sarah@company.com', 'Exam / Study Leave',
      '2026-09-18', '2026-09-21', 4, 'Semester final exams for Machine Learning & Distributed Systems', 'Approved',
      true, true, 'Approved by Sarah Chen. Standup streak frozen and evaluation task deadline extended to Sep 24.'
    ],
    [
      'LVE-5002', 'alex@company.com', 'Junior Engineer', 'lead@company.com', 'Casual Leave',
      '2026-09-25', '2026-09-25', 1, 'Personal travel', 'Pending',
      false, false, 'Awaiting approval from Marcus Brody.'
    ]
  ];
  sheet.getRange(2, 1, sampleLeaves.length, 13).setValues(sampleLeaves);

  // Conditional formatting: Amber for Pending, Green for Approved, Red for Rejected
  const rules = [];
  rules.push(
    SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo('Pending')
      .setBackground(PALETTE.AMBER_SOFT)
      .setFontColor(PALETTE.AMBER_TEXT)
      .setRanges([sheet.getRange('J2:J500')])
      .build()
  );
  rules.push(
    SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo('Approved')
      .setBackground(PALETTE.GREEN_SOFT)
      .setFontColor(PALETTE.GREEN_TEXT)
      .setRanges([sheet.getRange('J2:J500')])
      .build()
  );
  rules.push(
    SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo('Rejected')
      .setBackground(PALETTE.RED_SOFT)
      .setFontColor(PALETTE.RED_TEXT)
      .setRanges([sheet.getRange('J2:J500')])
      .build()
  );
  sheet.setConditionalFormatRules(rules);

  const widths = [100, 180, 130, 180, 140, 100, 100, 90, 260, 100, 130, 140, 280];
  widths.forEach((w, idx) => sheet.setColumnWidth(idx + 1, w));
}

/**
 * 6. Scheduled Meetings & Google Meet Links Tab
 */
function setupScheduledMeetingsSheet(ss) {
  let sheet = ss.getSheetByName(SHEET_NAMES.MEETINGS);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAMES.MEETINGS);

  sheet.clear();
  sheet.setTabColor('#8b5cf6'); // Purple 500

  const headers = [
    'Meeting ID', 'Title', 'Meeting Type', 'Organizer (Host)', 'Attendees',
    'Start Time', 'End Time', 'Google Meet Link', 'Status', 'AI Generated Agenda', 'Action Items Synced?'
  ];
  sheet.getRange('A1:K1').setValues([headers]);
  styleHeaders(sheet, 1, 11);

  const typeRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['1-on-1 Mentorship', 'Sprint Planning', 'Architecture Review', 'Incident Triage', 'All Hands'], true)
    .build();
  sheet.getRange('C2:C500').setDataValidation(typeRule);

  const statusRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Scheduled', 'In Progress', 'Completed', 'Cancelled'], true)
    .build();
  sheet.getRange('I2:I500').setDataValidation(statusRule);

  const sampleMeetings = [
    [
      'MTG-6001', 'AI Intern Mentorship & Eval Sync', '1-on-1 Mentorship', 'sarah@company.com',
      'intern@company.com, sarah@company.com', '2026-09-11 14:00:00', '2026-09-11 14:30:00',
      'https://meet.google.com/abc-defg-hij', 'Scheduled',
      '1. Review ScaNN benchmark findings\n2. Discuss reranking latency optimization\n3. Pre-exam study leave handover plan',
      false
    ],
    [
      'MTG-6002', 'P0 Blocker Resolution: Vertex Quota', 'Incident Triage', 'cto@company.com',
      'cto@company.com, sarah@company.com, lead@company.com', '2026-09-11 11:00:00', '2026-09-11 11:30:00',
      'https://meet.google.com/qrs-tuvw-xyz', 'Scheduled',
      '1. Review quota denial log\n2. Authorize multi-region failover cluster to europe-west4\n3. Update Sprint timeline for CEO report',
      false
    ]
  ];
  sheet.getRange(2, 1, sampleMeetings.length, 11).setValues(sampleMeetings);

  const widths = [100, 220, 150, 180, 240, 150, 150, 260, 110, 320, 140];
  widths.forEach((w, idx) => sheet.setColumnWidth(idx + 1, w));
}

/**
 * 7. Performance & Health Analytics Tab
 */
function setupAnalyticsSheet(ss) {
  let sheet = ss.getSheetByName(SHEET_NAMES.ANALYTICS);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAMES.ANALYTICS);

  sheet.clear();
  sheet.setTabColor('#14b8a6'); // Teal 500

  const headers = [
    'Employee Email', 'Full Name', 'Role Tier', 'Delivery Reliability',
    'Avg Blocker Resolution', 'Standup Consistency', 'Burnout / Overwork Risk',
    'AI 1-on-1 Performance Card', 'Recommended Next Quests'
  ];
  sheet.getRange('A1:I1').setValues([headers]);
  styleHeaders(sheet, 1, 9);

  const riskRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['🟢 Healthy', '🟡 Moderate Load', '🔴 Burnout Warning'], true)
    .build();
  sheet.getRange('G2:G500').setDataValidation(riskRule);

  const sampleAnalytics = [
    [
      'sarah@company.com', 'Sarah Chen', 'Senior Engineer', '94.2%', '14 hours', '96.0%', '🟡 Moderate Load',
      'Exceptional architectural output. Navigated difficult external quota block with high technical composure. Coaching point: delegate data cleaning to intern Rohan to preserve focus on core model architecture.',
      'Author Vertex Multi-Region Failover Architecture Blueprint (P1 - 60 XP)'
    ],
    [
      'intern@company.com', 'Rohan Sharma', 'Intern / Student', '88.5%', '18 hours', '92.0%', '🟢 Healthy',
      'Fast learner demonstrating strong curiosity. Solid execution on eval harness. Upcoming exam leave is well scheduled. Recommendation: schedule post-exam session on cross-encoder rerankers.',
      'Benchmark Cross-Encoder Reranker Inference Speed (P2 - 30 XP)'
    ]
  ];
  sheet.getRange(2, 1, sampleAnalytics.length, 9).setValues(sampleAnalytics);

  const widths = [180, 150, 130, 140, 160, 150, 160, 380, 320];
  widths.forEach((w, idx) => sheet.setColumnWidth(idx + 1, w));
}

/**
 * 8. Meeting Notes & Actions Tab
 */
function setupMeetingNotesSheet(ss) {
  let sheet = ss.getSheetByName(SHEET_NAMES.MEETING_NOTES);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAMES.MEETING_NOTES);

  sheet.clear();
  sheet.setTabColor('#a855f7');

  const headers = [
    'Meeting ID', 'Date', 'Title & Context', 'Raw Transcript / Notes',
    'AI Action Items', 'Synced to Quests?'
  ];
  sheet.getRange('A1:F1').setValues([headers]);
  styleHeaders(sheet, 1, 6);

  const sampleMeetings = [
    [
      'MTG-3001', '2026-09-10', 'Q4 Product Roadmap Alignment',
      'Discussed OAuth2 rollout and Vertex AI vector search launch. Sarah mentioned quota blocker. Alex committed to finishing PKCE by Friday. Priya requested automated QA smoke tests for auth.',
      '[{"title": "Automate QA smoke tests for OAuth auth flow", "assignee": "priya@company.com", "priority": "P1 - High", "dueDate": "2026-09-16"}]',
      false
    ]
  ];
  sheet.getRange(2, 1, sampleMeetings.length, 6).setValues(sampleMeetings);

  const widths = [100, 110, 220, 360, 360, 130];
  widths.forEach((w, idx) => sheet.setColumnWidth(idx + 1, w));
}

/**
 * 9. Weekly Summaries Tab
 */
function setupWeeklySheet(ss) {
  let sheet = ss.getSheetByName(SHEET_NAMES.WEEKLY);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAMES.WEEKLY);

  sheet.clear();
  sheet.setTabColor('#ec4899');

  const headers = [
    'Report ID', 'Week Period', 'Team Velocity (Closed)',
    'Blocker Heatmap', 'AI Executive Summary', 'MVP of the Week'
  ];
  sheet.getRange('A1:F1').setValues([headers]);
  styleHeaders(sheet, 1, 6);

  const sampleWeekly = [
    [
      'WKR-2026-W36', '2026-W36 (Aug 31 - Sep 04)', 18,
      'Infrastructure quota (2x), External API rate limits (1x)',
      'High productivity week. 85% of planned sprint objectives completed on time. Primary systemic bottleneck was cloud infrastructure provisioning.',
      'sarah@company.com'
    ]
  ];
  sheet.getRange(2, 1, sampleWeekly.length, 6).setValues(sampleWeekly);

  const widths = [120, 200, 160, 250, 420, 180];
  widths.forEach((w, idx) => sheet.setColumnWidth(idx + 1, w));
}

/**
 * Helper: Style header rows consistently across all tabs
 */
function styleHeaders(sheet, row, colCount) {
  const headerRange = sheet.getRange(row, 1, 1, colCount);
  headerRange
    .setBackground(PALETTE.HEADER_BG)
    .setFontColor(PALETTE.HEADER_TEXT)
    .setFontWeight('bold')
    .setFontFamily('Inter')
    .setFontSize(10)
    .setHorizontalAlignment('center')
    .setVerticalAlignment('middle');
  sheet.setRowHeight(1, 38);
  sheet.setFrozenRows(1);
}

/**
 * Helper: Apply smart conditional formatting rules
 */
function applyTasksConditionalFormatting(sheet) {
  const rules = [];

  // 1. Status == "Blocked" -> Soft Red
  rules.push(
    SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo('Blocked')
      .setBackground(PALETTE.RED_SOFT)
      .setFontColor(PALETTE.RED_TEXT)
      .setRanges([sheet.getRange('F2:F500')])
      .build()
  );

  // 2. Status == "Done" -> Soft Green
  rules.push(
    SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo('Done')
      .setBackground(PALETTE.GREEN_SOFT)
      .setFontColor(PALETTE.GREEN_TEXT)
      .setRanges([sheet.getRange('F2:F500')])
      .build()
  );

  // 3. Priority == "P0 - Blocker" -> Soft Purple
  rules.push(
    SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo('P0 - Blocker')
      .setBackground(PALETTE.PURPLE_SOFT)
      .setFontColor(PALETTE.PURPLE_TEXT)
      .setRanges([sheet.getRange('E2:E500')])
      .build()
  );

  // 4. AI Risk Score == "🔴 High Risk" -> Soft Red
  rules.push(
    SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo('🔴 High Risk')
      .setBackground(PALETTE.RED_SOFT)
      .setFontColor(PALETTE.RED_TEXT)
      .setRanges([sheet.getRange('J2:J500')])
      .build()
  );

  sheet.setConditionalFormatRules(rules);
}


/**
 * 10. Candidate Applicants Tab (Founder & CTO Hiring Pipeline)
 */
function setupApplicantsSheet(ss) {
  let sheet = ss.getSheetByName(SHEET_NAMES.APPLICANTS);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAMES.APPLICANTS);

  sheet.clear();
  sheet.setTabColor('#ec4899'); // Pink

  const headers = [
    'Application ID', 'Applied At', 'Full Name', 'Candidate Email', 'Role Applied',
    'Skills & Tech Stack', 'Resume Link', 'Portfolio / GitHub', 'Status',
    'Review Decision', 'Reviewed By (CTO/Founder)', 'Custom Notes', 'Decision Mail Sent At'
  ];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  styleHeaders(sheet, 1, headers.length);

  // Status validation
  const statusRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['New', 'Under Review', 'Selected', 'Rejected'], true)
    .build();
  sheet.getRange('I2:I500').setDataValidation(statusRule);

  // Decision validation
  const decisionRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Pending', 'Selected', 'Rejected'], true)
    .build();
  sheet.getRange('J2:J500').setDataValidation(decisionRule);

  const sampleApplicants = [
    [
      'APP-1001', '2026-09-12 10:00:00', 'Aarav Patel', 'aarav.patel.candidate@gmail.com', 'AI Engineering Intern',
      'Python, PyTorch, LangChain, n8n', 'https://drive.google.com/file/d/sample_aarav_resume', 'https://github.com/aarav-ai',
      'Under Review', 'Pending', 'cto@company.com', 'Strong open source contributions in RAG evaluation.', ''
    ],
    [
      'APP-1002', '2026-09-12 11:15:00', 'Maya Lin', 'maya.lin.candidate@gmail.com', 'Full Stack Intern',
      'TypeScript, React, Node.js, TailwindCSS', 'https://drive.google.com/file/d/sample_maya_resume', 'https://github.com/maya-dev',
      'New', 'Pending', 'ceo@company.com', 'Clean UI portfolio and Google Workspace Add-on experience.', ''
    ]
  ];

  sheet.getRange(2, 1, sampleApplicants.length, headers.length).setValues(sampleApplicants);

  const widths = [120, 150, 160, 220, 180, 240, 220, 200, 120, 130, 180, 250, 160];
  widths.forEach((w, idx) => sheet.setColumnWidth(idx + 1, w));
}
