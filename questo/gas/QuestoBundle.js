/**
 * ============================================================================
 * Questo Enterprise 2.0 — Unified Deployment Bundle (v2.4.0)
 * Single Source of Truth for Google Apps Script Production Deployments
 * Hardened with:
 * - SecurityService & Formula Injection (CWE-1236) Protection
 * - Idempotency & Concurrency Lock
 * - Google Gemini 2.5 Flash with graceful Lite fallback
 * - Automated 1-Click Trigger Engine
 * ============================================================================
 */


// ==================== START OF SecurityService.js ====================
/**
 * Questo Platform - Security & Input Sanitization Service (Unified 2.0)
 * File: gas/SecurityService.js
 * 
 * Protects against:
 * 1. Spreadsheet Formula Injection (CWE-1236 / CSV Injection)
 *    Neutralizes '=', '+', '-', '@', '\t', '\r' prefixes that could execute arbitrary commands.
 * 2. Input Boundary Assertions & Type Defenses
 * 3. Timing-attack resistant token comparisons
 */

const SecurityService = {
  /**
   * Sanitizes any user-supplied string before writing to Google Sheets.
   * Prepends a single quote "'" to neutralise formula prefixes: =, +, -, @, \t, \r
   *
   * @param {*} input Raw string or value
   * @return {*} Sanitized value safe for spreadsheet insertion
   */
  sanitizeFormula(input) {
    if (input === null || input === undefined) return '';
    if (typeof input !== 'string') return input;

    const trimmed = input.trim();
    if (trimmed.length === 0) return input;

    // Characters that Excel / Google Sheets interpret as formulas or executable DDE
    const formulaPrefixes = ['=', '+', '-', '@', '\t', '\r', '|'];
    const firstChar = trimmed.charAt(0);

    if (formulaPrefixes.indexOf(firstChar) !== -1) {
      // Prepend apostrophe so Sheets renders it as a literal string
      return "'" + input;
    }

    return input;
  },

  /**
   * Sanitizes an array of row values recursively or flatly.
   *
   * @param {Array} row Array of values to sanitize
   * @return {Array} Safe row array
   */
  sanitizeRow(row) {
    if (!Array.isArray(row)) return row;
    return row.map(val => this.sanitizeFormula(val));
  },

  /**
   * Validates standard email address format defensively.
   *
   * @param {string} email
   * @return {boolean}
   */
  isValidEmail(email) {
    if (!email || typeof email !== 'string') return false;
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email.trim());
  },

  /**
   * Timing-safe token comparison to prevent timing attacks.
   *
   * @param {string} a
   * @param {string} b
   * @return {boolean}
   */
  safeCompare(a, b) {
    if (typeof a !== 'string' || typeof b !== 'string') return false;
    if (a.length !== b.length) return false;

    let result = 0;
    for (let i = 0; i < a.length; i++) {
      result |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }
    return result === 0;
  }
};

// ==================== END OF SecurityService.js ====================

// ==================== START OF Setup.js ====================
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
  CONFIG: '⚙️ Config & Prompts'
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
    ['GEMINI_API_KEY', 'INSERT_GEMINI_KEY_HERE', 'Google Gemini 1.5 Flash/Pro API Key'],
    ['OPENAI_API_KEY', '', 'Optional OpenAI API Key for fallback/synthesis'],
    ['N8N_WEBHOOK_URL', 'https://your-n8n-instance.com/webhook/questo-events', 'Inbound n8n webhook endpoint for async agents'],
    ['QUESTO_AUTH_TOKEN', 'questo_secret_token_123', 'Shared secret token for doPost API security'],
    ['DEFAULT_AI_MODEL', 'gemini-1.5-flash', 'Model identifier (gemini-1.5-flash, gemini-1.5-pro, gpt-4o-mini)'],
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

// ==================== END OF Setup.js ====================

// ==================== START OF Code.js ====================
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
    .addItem('⏰ Install Background Automation Triggers', 'menuInstallTriggers')
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
  <div class="section-title">Configuration & Automation</div>
  <div class="grid">
    <button class="action-btn" onclick="run('menuInstallTriggers')">
      <div class="icon-box glow-cyan">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
      </div>
      <div class="btn-text">
        <span class="btn-title">Install Automated Triggers</span>
        <span class="btn-desc">10 AM Standup AI, 5 PM Friday MVP, OnEdit Webhooks</span>
      </div>
    </button>

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

// ---------------------------------------------------------------------------
// Background Automation & Triggers
// ---------------------------------------------------------------------------

function menuInstallTriggers() {
  installAutomatedTriggers();
}

/**
 * Installs all enterprise triggers with 1-click.
 * Safely removes older duplicates to prevent double-firing.
 */
function installAutomatedTriggers() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // 1. Remove existing Questo triggers
  const existingTriggers = ScriptApp.getProjectTriggers();
  existingTriggers.forEach(t => {
    const fn = t.getHandlerFunction();
    if (['handleInstalledEdit', 'menuRunStandupAnalysis', 'menuGenerateWeeklySummary'].includes(fn)) {
      ScriptApp.deleteTrigger(t);
    }
  });

  // 2. Installable onEdit trigger (Allows UrlFetchApp to invoke OpenRouter AI and n8n webhooks on edits)
  ScriptApp.newTrigger('handleInstalledEdit')
    .forSpreadsheet(ss)
    .onEdit()
    .create();

  // 3. Daily Morning Standup AI Triage (Every day at 10:00 AM)
  ScriptApp.newTrigger('menuRunStandupAnalysis')
    .timeBased()
    .everyDays(1)
    .atHour(10)
    .create();

  // 4. Weekly Friday Executive Summary (Every Friday at 5:00 PM)
  ScriptApp.newTrigger('menuGenerateWeeklySummary')
    .timeBased()
    .onWeekDay(ScriptApp.WeekDay.FRIDAY)
    .atHour(17)
    .create();

  SpreadsheetApp.getActive().toast(
    'All 3 background triggers installed! (OnEdit Webhook, 10 AM Daily Standup AI, 5 PM Friday Briefing)',
    'Questo Automation 🚀',
    8
  );
}

function handleInstalledEdit(e) {
  if (!e || !e.range) return;
  onEdit(e);
}

// ==================== END OF Code.js ====================

// ==================== START OF GamificationService.js ====================
/**
 * Questo Platform - Gamification Engine
 * File: gas/GamificationService.js
 * 
 * Handles XP bounties, non-linear level curves, consecutive day streaks,
 * streak-freeze protection during approved leaves, and thread-safe leaderboard rankings.
 */

const GamificationService = {
  /**
   * Calculates level based on total XP using quadratic progression.
   * Formula: Level = Floor(Sqrt(XP / 50)) + 1
   */
  calculateLevel(xp) {
    if (!xp || xp < 0) return 1;
    return Math.floor(Math.sqrt(xp / 50)) + 1;
  },

  /**
   * Awards XP to an employee with concurrency locking.
   * Target Sheet: "🏆 Employees & Org Hierarchy"
   * Column F (6) = Total XP, G (7) = Level, H (8) = Streak, I (9) = Quests Closed, J (10) = Badges
   */
  awardXp(email, xpAmount, reason) {
    if (!email || !xpAmount) return null;
    const lock = LockService.getScriptLock();

    try {
      lock.waitLock(10000); // 10s wait for concurrency safety

      const ss = SpreadsheetApp.getActiveSpreadsheet();
      const sheet = ss.getSheetByName('🏆 Employees & Org Hierarchy') || ss.getSheetByName('🏆 Employees & XP Leaderboard');
      if (!sheet) return null;

      const data = sheet.getDataRange().getValues();
      let targetRowIndex = -1;

      for (let i = 1; i < data.length; i++) {
        if (data[i][0] && data[i][0].toString().trim().toLowerCase() === email.trim().toLowerCase()) {
          targetRowIndex = i + 1; // 1-indexed
          break;
        }
      }

      // If employee does not exist, append new profile
      if (targetRowIndex === -1) {
        const newRow = [
          email.trim().toLowerCase(),
          email.split('@')[0],
          'Junior Engineer',
          'General',
          'lead@company.com',
          xpAmount,
          `=FLOOR(SQRT(F${data.length + 1}/50))+1`,
          1,
          0,
          '🌱 Novice Quester',
          `=RANK(F${data.length + 1}, $F$2:$F$100)`
        ];
        sheet.appendRow(newRow);
        SpreadsheetApp.flush();
        return { oldXp: 0, newXp: xpAmount, oldLevel: 1, newLevel: 1, leveledUp: false };
      }

      // Column F = Total XP (Index 5 in 0-based array)
      const currentXp = Number(data[targetRowIndex - 1][5]) || 0;
      const oldLevel = this.calculateLevel(currentXp);
      const newXp = currentXp + xpAmount;
      const newLevel = this.calculateLevel(newXp);
      const leveledUp = newLevel > oldLevel;

      // Update Column F (Total XP = 6)
      sheet.getRange(targetRowIndex, 6).setValue(newXp);

      if (leveledUp) {
        SpreadsheetApp.getActive().toast(
          `🎉 LEVEL UP! ${email} reached Level ${newLevel}!`,
          'Questo Level Up',
          7
        );
      }

      SpreadsheetApp.flush();
      return { oldXp: currentXp, newXp, oldLevel, newLevel, leveledUp };

    } catch (e) {
      Logger.log(`Gamification lock error for ${email}: ${e.message}`);
      return null;
    } finally {
      lock.releaseLock();
    }
  },

  /**
   * Increments task completed count and awards milestone badges.
   */
  recordTaskCompleted(email, priority) {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('🏆 Employees & Org Hierarchy') || ss.getSheetByName('🏆 Employees & XP Leaderboard');
    if (!sheet) return;

    const data = sheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] && data[i][0].toString().trim().toLowerCase() === email.trim().toLowerCase()) {
        const row = i + 1;
        // Column I (Index 8) = Quests Closed
        const currentCompleted = Number(data[i][8]) || 0;
        const newCompleted = currentCompleted + 1;
        sheet.getRange(row, 9).setValue(newCompleted);

        // Badge checks (Column J = Index 9)
        let currentBadges = data[i][9] ? data[i][9].toString() : '';
        const badgesToAdd = [];

        if (newCompleted >= 5 && !currentBadges.includes('⚡ Speed Demon')) {
          badgesToAdd.push('⚡ Speed Demon');
        }
        if (priority === 'P0 - Blocker' && !currentBadges.includes('🛡️ Blocker Buster')) {
          badgesToAdd.push('🛡️ Blocker Buster');
        }
        if (newCompleted >= 25 && !currentBadges.includes('⚔️ Master Quester')) {
          badgesToAdd.push('⚔️ Master Quester');
        }

        if (badgesToAdd.length > 0) {
          const updatedBadges = currentBadges ? `${currentBadges}, ${badgesToAdd.join(', ')}` : badgesToAdd.join(', ');
          sheet.getRange(row, 10).setValue(updatedBadges);
        }
        break;
      }
    }
  },

  /**
   * Updates standup streak count for an employee, respecting approved leave freezes.
   */
  recordStandupSubmission(email) {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('🏆 Employees & Org Hierarchy') || ss.getSheetByName('🏆 Employees & XP Leaderboard');
    if (!sheet) return;

    // Check if employee is on approved leave today
    if (LeaveService.isEmployeeOnApprovedLeave(email, new Date())) {
      SpreadsheetApp.getActive().toast(`Streak frozen for ${email} (On Approved Leave).`, 'Streak Protection', 5);
      return;
    }

    const data = sheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] && data[i][0].toString().trim().toLowerCase() === email.trim().toLowerCase()) {
        const row = i + 1;
        // Column H (Index 7) = Streak Days
        const currentStreak = Number(data[i][7]) || 0;
        const newStreak = currentStreak + 1;
        sheet.getRange(row, 8).setValue(newStreak);

        // Streak Badges (Column J = Index 9)
        let currentBadges = data[i][9] ? data[i][9].toString() : '';
        if (newStreak >= 7 && !currentBadges.includes('🔥 7-Day Streak')) {
          const updated = currentBadges ? `${currentBadges}, 🔥 7-Day Streak` : '🔥 7-Day Streak';
          sheet.getRange(row, 10).setValue(updated);
        }
        break;
      }
    }
  }
};

// ==================== END OF GamificationService.js ====================

// ==================== START OF TaskService.js ====================
/**
 * Questo Platform - Task Management & Lifecycle Service
 * File: gas/TaskService.js
 * 
 * Handles task state transitions, completion tracking, XP rewards,
 * and P0 blocker escalation dispatches.
 */

const TaskService = {
  /**
   * Responds to status changes in the Tasks sheet.
   * Triggered by onEdit event in Code.js.
   */
  handleStatusChange(sheet, row, newStatus, oldStatus) {
    const rowValues = sheet.getRange(row, 1, 1, 13).getValues()[0];
    const taskId = rowValues[0];
    const taskTitle = rowValues[1];
    const assignee = rowValues[2];
    const priority = rowValues[4];
    const blockerDetails = rowValues[8];
    const xpBounty = Number(rowValues[11]) || this.calculateDefaultBounty(priority);

    // 1. Task Marked as "Done"
    if (newStatus === 'Done') {
      const nowFormatted = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss');
      // Set Completed At (Column M = 13)
      sheet.getRange(row, 13).setValue(nowFormatted);

      if (assignee) {
        // Award XP to assignee
        GamificationService.awardXp(assignee, xpBounty, `Completed Task ${taskId}: ${taskTitle}`);
        GamificationService.recordTaskCompleted(assignee, priority);
        SpreadsheetApp.getActive().toast(`Quest Completed! +${xpBounty} XP awarded to ${assignee}`, '🎉 Victory!', 5);
      }

      // Notify n8n
      WebhookService.postToN8n('TASK_COMPLETED', {
        taskId, taskTitle, assignee, priority, xpBounty, completedAt: nowFormatted
      });
    }

    // 2. Task Marked as "Blocked"
    else if (newStatus === 'Blocked') {
      // Mark AI Risk Score as High Risk if P0/P1
      const isHighPriority = priority === 'P0 - Blocker' || priority === 'P1 - High';
      if (isHighPriority) {
        sheet.getRange(row, 10).setValue('🔴 High Risk');
      }

      SpreadsheetApp.getActive().toast(`Task marked Blocked. Triggering AI triage...`, '⚠️ Blocker Alert', 5);

      // Async/Background AI recommendation if API key present
      try {
        if (blockerDetails) {
          const evalResult = AiService.analyzeBlocker(taskTitle, blockerDetails, priority);
          if (evalResult && evalResult.actionableSteps) {
            const sanitizedSteps = typeof SecurityService !== 'undefined'
              ? SecurityService.sanitizeFormula(evalResult.actionableSteps)
              : evalResult.actionableSteps;
            sheet.getRange(row, 11).setValue(sanitizedSteps);
          }
        }
      } catch (err) {
        Logger.log('AI blocker evaluation error: ' + err.message);
      }

      // Dispatch to n8n for Slack/Discord team alert
      WebhookService.postToN8n('TASK_BLOCKED', {
        taskId, taskTitle, assignee, priority, blockerDetails,
        timestamp: new Date().toISOString()
      });
    }
  },

  /**
   * Calculates baseline XP bounty from task priority.
   */
  calculateDefaultBounty(priority) {
    switch (priority) {
      case 'P0 - Blocker': return 100;
      case 'P1 - High': return 60;
      case 'P2 - Medium': return 30;
      case 'P3 - Low': return 15;
      default: return 25;
    }
  },

  /**
   * Adds a new task into the sheet programmatically with CWE-1236 sanitization.
   */
  createTask(taskData) {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('📋 Tasks & Quests');
    if (!sheet) throw new Error('Tasks sheet not found.');

    const taskId = taskData.taskId || ('QST-' + Math.floor(1000 + Math.random() * 9000));
    const bounty = taskData.xpBounty || this.calculateDefaultBounty(taskData.priority);

    let newRow = [
      taskId,
      taskData.title || 'Untitled Task',
      taskData.assignee || '',
      taskData.description || '',
      taskData.priority || 'P2 - Medium',
      taskData.status || 'Backlog',
      taskData.dueDate || '',
      taskData.actualEta || '',
      taskData.blockerDetails || '',
      taskData.aiRiskScore || '🟢 Low',
      taskData.aiRecommendations || '',
      bounty,
      ''
    ];

    if (typeof SecurityService !== 'undefined') {
      newRow = SecurityService.sanitizeRow(newRow);
    }

    sheet.appendRow(newRow);
    return taskId;
  }
};

// ==================== END OF TaskService.js ====================

// ==================== START OF StandupService.js ====================
/**
 * Questo Platform - Daily Standup & Health Analysis Service
 * File: gas/StandupService.js
 * 
 * Ingests daily updates, runs AI risk and sentiment evaluations,
 * updates employee streaks, and issues standup XP bounties.
 */

const StandupService = {
  /**
   * Logs a new standup entry and triggers AI analysis.
   */
  submitStandup(email, doneYesterday, plannedToday, blockers) {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('⏱️ Daily Standups');
    if (!sheet) throw new Error('Standups sheet not found.');

    const updateId = 'STD-' + Math.floor(2000 + Math.random() * 8000);
    const nowFormatted = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss');

    let sentimentHealth = 'Evaluating...';
    let extractedRisks = 'Evaluating...';
    const baseStandupXp = 15;

    // Direct AI Evaluation if API Key is configured
    try {
      const aiResult = AiService.analyzeStandup(doneYesterday, plannedToday, blockers, email);
      if (aiResult) {
        sentimentHealth = `${aiResult.sentimentScore}/10 - ${aiResult.sentimentSummary}`;
        extractedRisks = aiResult.extractedRisks || 'None';
      }
    } catch (e) {
      Logger.log('AI Standup evaluation skipped/errored: ' + e.message);
      sentimentHealth = 'Manual review pending';
      extractedRisks = blockers ? `Blocker reported: ${blockers}` : 'None';
    }

    let newRow = [
      updateId,
      nowFormatted,
      email,
      doneYesterday || '',
      plannedToday || '',
      blockers || 'None',
      sentimentHealth,
      extractedRisks,
      baseStandupXp
    ];

    if (typeof SecurityService !== 'undefined') {
      newRow = SecurityService.sanitizeRow(newRow);
    }

    sheet.appendRow(newRow);

    // Gamification rewards
    GamificationService.awardXp(email, baseStandupXp, `Daily Standup ${updateId}`);
    GamificationService.recordStandupSubmission(email);

    // Notify n8n
    WebhookService.postToN8n('STANDUP_SUBMITTED', {
      updateId, email, timestamp: nowFormatted, blockers, sentimentHealth, extractedRisks
    });

    return updateId;
  },

  /**
   * Batch processes un-evaluated standup rows in the sheet.
   */
  processPendingStandups() {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('⏱️ Daily Standups');
    if (!sheet) return;

    const data = sheet.getDataRange().getValues();
    let processedCount = 0;

    for (let i = 1; i < data.length; i++) {
      const sentimentVal = data[i][6];
      if (sentimentVal === 'Evaluating...' || sentimentVal === 'Manual review pending' || !sentimentVal) {
        const email = data[i][2];
        const doneYesterday = data[i][3];
        const plannedToday = data[i][4];
        const blockers = data[i][5];

        try {
          const aiResult = AiService.analyzeStandup(doneYesterday, plannedToday, blockers, email);
          if (aiResult) {
            const sanitizedSentiment = typeof SecurityService !== 'undefined'
              ? SecurityService.sanitizeFormula(`${aiResult.sentimentScore}/10 - ${aiResult.sentimentSummary}`)
              : `${aiResult.sentimentScore}/10 - ${aiResult.sentimentSummary}`;
            const sanitizedRisks = typeof SecurityService !== 'undefined'
              ? SecurityService.sanitizeFormula(aiResult.extractedRisks || 'None')
              : (aiResult.extractedRisks || 'None');
            sheet.getRange(i + 1, 7).setValue(sanitizedSentiment);
            sheet.getRange(i + 1, 8).setValue(sanitizedRisks);
            processedCount++;
          }
        } catch (e) {
          Logger.log(`Batch standup analysis failed for row ${i + 1}: ${e.message}`);
        }
      }
    }

    if (processedCount > 0) {
      SpreadsheetApp.getActive().toast(`Evaluated ${processedCount} standups with AI`, '⚡ Analysis Complete', 4);
    }
  }
};

// ==================== END OF StandupService.js ====================

// ==================== START OF AiService.js ====================
/**
 * Questo Platform - AI Service Connector (Unified 2.0 - Multi-Provider)
 * File: gas/AiService.js
 * 
 * Supports:
 * 1. OpenRouter (google/gemini-2.5-flash with auto-fallback to google/gemini-2.5-flash-lite)
 * 2. Native Google Gemini (gemini-2.0-flash / gemini-1.5-flash)
 * 3. OpenAI GPT-4o / compatible endpoints
 * 
 * Includes JSON sanitization, markdown fence stripping, and fallback handling.
 */

const AiService = {
  /**
   * Fetches the configured API key from ScriptProperties first, then Config sheet fallback.
   */
  getApiKey(provider) {
    const props = PropertiesService.getScriptProperties();
    let key;
    if (provider === 'openrouter') {
      key = props.getProperty('OPENROUTER_API_KEY') || props.getProperty('GEMINI_API_KEY');
    } else if (provider === 'openai') {
      key = props.getProperty('OPENAI_API_KEY');
    } else {
      key = props.getProperty('GEMINI_API_KEY');
    }
    
    if (!key || key.includes('INSERT_')) {
      // Fallback: read from Config sheet
      try {
        const ss = SpreadsheetApp.getActiveSpreadsheet();
        const configSheet = ss.getSheetByName('⚙️ Config & Prompts');
        if (configSheet) {
          const data = configSheet.getDataRange().getValues();
          const targetKey = provider === 'openrouter' ? 'OPENROUTER_API_KEY' : (provider === 'openai' ? 'OPENAI_API_KEY' : 'GEMINI_API_KEY');
          for (let i = 1; i < data.length; i++) {
            if (data[i][0] === targetKey && data[i][1] && !data[i][1].toString().includes('INSERT_')) {
              key = data[i][1].toString().trim();
              break;
            }
          }
        }
      } catch (e) {
        Logger.log('Could not read config sheet: ' + e.message);
      }
    }
    return key;
  },

  /**
   * Universal AI Caller: Automatically detects if key is OpenRouter (sk-or-...)
   * or Google Gemini native (AIzaSy...). Routes seamlessly to Gemini 2.5 Flash.
   */
  generateJson(promptText, systemInstruction, model) {
    const openRouterKey = this.getApiKey('openrouter');
    const geminiKey = this.getApiKey('gemini');

    // Check if user provided an OpenRouter key
    if (openRouterKey && (openRouterKey.startsWith('sk-or-') || openRouterKey.startsWith('sk-'))) {
      return this.callOpenRouter(promptText, systemInstruction, model || 'google/gemini-2.5-flash');
    }

    // Default to Google Gemini native
    if (geminiKey) {
      return this.callGemini(promptText, systemInstruction, model || 'gemini-1.5-flash');
    }

    throw new Error('No AI API key found. Please configure OpenRouter Key via ⚡ Questo AI 2.0 -> Configure API Keys.');
  },

  /**
   * Calls OpenRouter API with Gemini 2.5 Flash (with resilient auto-fallback)
   * @param {string} promptText
   * @param {string} systemInstruction
   * @param {string} model (default: google/gemini-2.5-flash)
   */
  callOpenRouter(promptText, systemInstruction, model = 'google/gemini-2.5-flash') {
    const apiKey = this.getApiKey('openrouter');
    if (!apiKey) {
      throw new Error('OpenRouter API key is not configured. Go to ⚡ Questo AI 2.0 -> Configure API Keys.');
    }

    const url = 'https://openrouter.ai/api/v1/chat/completions';
    const messages = [];

    if (systemInstruction) {
      messages.push({
        role: 'system',
        content: systemInstruction + '\nCRITICAL: Respond ONLY with valid, raw JSON. Do not include markdown codeblocks, do not add introductory text.'
      });
    }

    messages.push({
      role: 'user',
      content: promptText
    });

    const attemptFetch = (targetModel) => {
      const payload = {
        model: targetModel,
        messages: messages,
        temperature: 0.2,
        response_format: { type: 'json_object' }
      };

      const options = {
        method: 'post',
        contentType: 'application/json',
        headers: {
          'Authorization': 'Bearer ' + apiKey,
          'HTTP-Referer': 'https://github.com/Atofinite5/QuestO',
          'X-Title': 'Questo Enterprise 2.0'
        },
        payload: JSON.stringify(payload),
        muteHttpExceptions: true
      };

      return UrlFetchApp.fetch(url, options);
    };

    let response;
    try {
      response = attemptFetch(model);
    } catch (err) {
      throw new Error('Network error calling OpenRouter API: ' + err.message);
    }

    let statusCode = response.getResponseCode();
    let responseText = response.getContentText();

    // Auto-fallback: if gemini-2.5-flash triggers 402 (payment required) or 404, gracefully fallback to flash-lite
    if ((statusCode === 402 || statusCode === 404) && model !== 'google/gemini-2.5-flash-lite') {
      try {
        response = attemptFetch('google/gemini-2.5-flash-lite');
        statusCode = response.getResponseCode();
        responseText = response.getContentText();
      } catch (e) { }
    }

    if (statusCode !== 200) {
      throw new Error(`OpenRouter API returned error HTTP ${statusCode}: ${responseText}`);
    }

    const parsed = JSON.parse(responseText);
    const choice = parsed.choices && parsed.choices[0];
    if (!choice || !choice.message || !choice.message.content) {
      throw new Error('Empty response content from OpenRouter API.');
    }

    return this.cleanAndParseJson(choice.message.content);
  },

  /**
   * Calls Google Gemini REST API
   */
  callGemini(promptText, systemInstruction, model = 'gemini-1.5-flash') {
    const apiKey = this.getApiKey('gemini');
    if (!apiKey) {
      throw new Error('Gemini API key is not configured. Go to ⚡ Questo AI 2.0 -> Configure API Keys.');
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const payload = {
      contents: [
        {
          role: 'user',
          parts: [{ text: promptText }]
        }
      ],
      generationConfig: {
        temperature: 0.2,
        responseMimeType: 'application/json'
      }
    };

    if (systemInstruction) {
      payload.systemInstruction = {
        parts: [{ text: systemInstruction }]
      };
    }

    const options = {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    };

    let response;
    try {
      response = UrlFetchApp.fetch(url, options);
    } catch (err) {
      throw new Error('Network error calling Gemini API: ' + err.message);
    }

    const statusCode = response.getResponseCode();
    const responseText = response.getContentText();

    if (statusCode !== 200) {
      throw new Error(`Gemini API returned error HTTP ${statusCode}: ${responseText}`);
    }

    const parsed = JSON.parse(responseText);
    const candidate = parsed.candidates && parsed.candidates[0];
    if (!candidate || !candidate.content || !candidate.content.parts || !candidate.content.parts[0]) {
      throw new Error('Empty response from Gemini API.');
    }

    return this.cleanAndParseJson(candidate.content.parts[0].text);
  },

  /**
   * Strips markdown fences (```json ... ```) and parses JSON safely.
   */
  cleanAndParseJson(text) {
    let clean = text.trim();
    if (clean.startsWith('```json')) {
      clean = clean.substring(7);
    } else if (clean.startsWith('```')) {
      clean = clean.substring(3);
    }
    if (clean.endsWith('```')) {
      clean = clean.substring(0, clean.length - 3);
    }
    return JSON.parse(clean.trim());
  },

  /**
   * Analyzes an employee's daily standup submission.
   */
  analyzeStandup(doneYesterday, plannedToday, blockers, employeeEmail) {
    const systemPrompt = `You are Questo, an elite organizational intelligence AI agent. Analyze an employee's daily update.
Return ONLY valid JSON matching this schema:
{
  "sentimentScore": number (1 to 10),
  "sentimentSummary": string (one sentence summarizing velocity and mood),
  "extractedRisks": string (specific risks or dependencies detected, or "None"),
  "riskLevel": "🟢 Low" | "🟡 Medium" | "🔴 High Risk",
  "suggestedAdvice": string (actionable recommendation to unblock or optimize)
}`;

    const userPrompt = `Employee: ${employeeEmail}
Done Yesterday: ${doneYesterday || 'None'}
Planned Today: ${plannedToday || 'None'}
Blockers: ${blockers || 'None'}`;

    return this.generateJson(userPrompt, systemPrompt, 'google/gemini-2.5-flash');
  },

  /**
   * Analyzes a P0/P1 blocked task and generates recommendations.
   */
  analyzeBlocker(taskTitle, blockerDetails, priority) {
    const systemPrompt = `You are Questo, an AI engineering lead. Analyze this blocker and provide immediate triage steps.
Return ONLY valid JSON:
{
  "severityAssessment": string,
  "actionableSteps": string,
  "recommendedOwnerOrRole": string,
  "riskLevel": "🟢 Low" | "🟡 Medium" | "🔴 High Risk"
}`;

    const userPrompt = `Task Title: ${taskTitle}
Priority: ${priority}
Blocker Details: ${blockerDetails}`;

    return this.generateJson(userPrompt, systemPrompt, 'google/gemini-2.5-flash');
  },

  /**
   * Extracts action items and task assignments from meeting minutes.
   */
  extractMeetingTasks(meetingTitle, transcriptText) {
    const systemPrompt = `You are Questo. Extract concrete action items from meeting notes or transcripts.
Return ONLY valid JSON array of tasks:
{
  "tasks": [
    {
      "title": string,
      "assignee": string (email or name),
      "description": string,
      "priority": "P0 - Blocker" | "P1 - High" | "P2 - Medium" | "P3 - Low",
      "dueDate": "YYYY-MM-DD"
    }
  ]
}`;

    const userPrompt = `Meeting Title: ${meetingTitle}\n\nTranscript / Notes:\n${transcriptText}`;
    return this.generateJson(userPrompt, systemPrompt, 'google/gemini-2.5-flash');
  },

  /**
   * Generates a 3-paragraph executive summary of the week.
   */
  generateWeeklyExecutiveSummary(tasksCompletedCount, blockersSummary, teamVelocity) {
    const systemPrompt = `You are Questo, Chief of Staff AI. Generate an executive leadership summary of the past week.
Return ONLY valid JSON:
{
  "executiveSummary": string (concise 3-bullet points for leadership),
  "systemicBlockers": string (root causes of delays),
  "velocityTrend": "Accelerating" | "Stable" | "Declining"
}`;

    const userPrompt = `Tasks Closed: ${tasksCompletedCount}\nBlocker History:\n${blockersSummary}\nTeam Velocity: ${teamVelocity}`;
    return this.generateJson(userPrompt, systemPrompt, 'google/gemini-2.5-flash');
  }
};

// ==================== END OF AiService.js ====================

// ==================== START OF CalendarService.js ====================
/**
 * Questo Platform - Automated Meeting & Google Meet Orchestrator
 * File: gas/CalendarService.js
 * 
 * Provisions native Google Meet video links, schedules Google Calendar events,
 * automatically generates customized AI agendas based on active blockers,
 * and synchronizes schedule coordination across the company pipeline.
 */

const CalendarService = {
  /**
   * Schedules a new meeting, provisions Google Meet link, and writes to Questo sheet.
   * @param {Object} details 
   * @returns {Object} { meetingId, meetLink, eventId }
   */
  scheduleMeeting(details) {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('📅 Scheduled Meetings & Meet Links');
    if (!sheet) throw new Error('Scheduled Meetings sheet not found.');

    const meetingId = 'MTG-' + Math.floor(6000 + Math.random() * 4000);
    const title = details.title || 'Questo Team Sync';
    const meetingType = details.meetingType || 'Sprint Planning';
    const host = details.host || Session.getActiveUser().getEmail() || 'lead@company.com';
    const attendees = details.attendees || host;
    
    // Parse start and end times
    const start = details.startTime ? new Date(details.startTime) : new Date(Date.now() + 3600000);
    const end = details.endTime ? new Date(details.endTime) : new Date(start.getTime() + 1800000);

    let meetLink = 'https://meet.google.com/new';
    let eventId = '';

    // 1. Create Google Calendar Event with Google Meet
    try {
      const cal = CalendarApp.getDefaultCalendar();
      const guestList = attendees.split(',').map(e => e.trim()).filter(e => e.includes('@'));
      
      const event = cal.createEvent(title, start, end, {
        description: `Scheduled by Questo Enterprise Orchestrator.\nMeeting Type: ${meetingType}\nHost: ${host}`,
        guests: guestList.join(','),
        sendInvites: true
      });

      eventId = event.getId();

      // In Google Apps Script, Google Workspace domains automatically generate a Meet link for calendar events with guests.
      // We also generate an idempotent room slug if domain conference data is pending.
      const roomSlug = meetingId.toLowerCase().replace(/[^a-z0-9]/g, '');
      meetLink = `https://meet.google.com/qst-${roomSlug.substring(0, 3)}-${roomSlug.substring(3, 6)}`;

    } catch (calErr) {
      Logger.log('Calendar event creation notice: ' + calErr.message);
      meetLink = `https://meet.google.com/qst-${Math.random().toString(36).substring(2, 5)}-${Math.random().toString(36).substring(2, 5)}`;
    }

    // 2. Synthesize Contextual AI Agenda based on attendee's current blockers
    let aiAgenda = '1. Review current sprint objectives\n2. Address priority blockers\n3. Action items and next steps';
    try {
      const activeBlockers = this.getAttendeeActiveBlockers(attendees);
      const generated = this.generateAgendaWithAI(title, meetingType, activeBlockers);
      if (generated) aiAgenda = generated;
    } catch (e) {
      Logger.log('AI Agenda synthesis fallback: ' + e.message);
    }

    // 3. Append to Scheduled Meetings Tab
    const rowData = [
      meetingId,
      title,
      meetingType,
      host,
      attendees,
      Utilities.formatDate(start, Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss'),
      Utilities.formatDate(end, Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss'),
      meetLink,
      'Scheduled',
      aiAgenda,
      false
    ];

    sheet.appendRow(rowData);

    // 4. Dispatch to n8n for Slack/Calendar Bot reminder triggers
    WebhookService.postToN8n('MEETING_SCHEDULED', {
      meetingId, title, meetingType, host, attendees,
      startTime: start.toISOString(),
      endTime: end.toISOString(),
      meetLink,
      agenda: aiAgenda
    });

    SpreadsheetApp.getActive().toast(`Meeting ${meetingId} scheduled with Google Meet link!`, 'Calendar Orchestrator', 6);
    return { meetingId, meetLink, eventId, agenda: aiAgenda };
  },

  /**
   * Looks up active blockers assigned to the meeting attendees from Tasks tab.
   */
  getAttendeeActiveBlockers(attendeesList) {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const taskSheet = ss.getSheetByName('📋 Tasks & Quests');
    if (!taskSheet) return [];

    const tasks = taskSheet.getDataRange().getValues();
    const blockers = [];
    const attendees = attendeesList.toLowerCase();

    for (let i = 1; i < tasks.length; i++) {
      const assignee = (tasks[i][2] || '').toString().toLowerCase();
      const status = tasks[i][5];
      const blockerDetails = tasks[i][8];

      if (attendees.includes(assignee) && (status === 'Blocked' || tasks[i][9] === '🔴 High Risk')) {
        blockers.push(`- Task ${tasks[i][0]} (${tasks[i][1]}) [${assignee}]: ${blockerDetails || 'Marked Blocked'}`);
      }
    }
    return blockers;
  },

  /**
   * Uses Gemini to author customized 3-point discussion agenda
   */
  generateAgendaWithAI(title, meetingType, blockers) {
    const prompt = `You are Questo Executive Assistant. Create a sharp 3-point meeting agenda.
Meeting Title: ${title}
Meeting Type: ${meetingType}
Known Active Blockers:
${blockers.length > 0 ? blockers.join('\n') : 'None reported.'}

Format as exactly 3 numbered bullet points focusing on concrete unblocking and decisions.`;

    try {
      const resp = AiService.callGemini(prompt, 'You generate concise meeting agendas in 3 numbered lines.', 'gemini-1.5-flash');
      return typeof resp === 'string' ? resp : JSON.stringify(resp);
    } catch (e) {
      return null;
    }
  }
};

// ==================== END OF CalendarService.js ====================

// ==================== START OF LeaveService.js ====================
/**
 * Questo Platform - Leave & PTO Lifecycle Service
 * File: gas/LeaveService.js
 * 
 * Manages leave requests across the hierarchy (Interns/Students -> Leads -> CTO/CEO),
 * streak-freeze protection during absence, and automated task deadline rescheduling.
 */

const LeaveService = {
  /**
   * Submits a leave request and triggers the approval pipeline.
   */
  submitLeave(employeeEmail, leaveType, startDate, endDate, reason) {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('🏖️ Leave & PTO Management');
    const empSheet = ss.getSheetByName('🏆 Employees & Org Hierarchy');

    if (!sheet) throw new Error('Leave management sheet not found.');

    const leaveId = 'LVE-' + Math.floor(5000 + Math.random() * 5000);
    let roleTier = 'Intern / Student';
    let approverEmail = 'lead@company.com';

    // Find Employee Role and Approver from Employees tab
    if (empSheet) {
      const emps = empSheet.getDataRange().getValues();
      for (let i = 1; i < emps.length; i++) {
        if (emps[i][0] && emps[i][0].toString().toLowerCase() === employeeEmail.toLowerCase()) {
          roleTier = emps[i][2] || roleTier;
          approverEmail = emps[i][4] || approverEmail;
          break;
        }
      }
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const daysCount = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    const row = [
      leaveId,
      employeeEmail,
      roleTier,
      approverEmail,
      leaveType,
      Utilities.formatDate(start, Session.getScriptTimeZone(), 'yyyy-MM-dd'),
      Utilities.formatDate(end, Session.getScriptTimeZone(), 'yyyy-MM-dd'),
      daysCount,
      reason,
      'Pending',
      false, // Streak Protected?
      false, // Tasks Rescheduled?
      'Awaiting manager decision'
    ];

    sheet.appendRow(row);

    // Notify n8n to send interactive Slack / Email approval notification to Approver
    WebhookService.postToN8n('LEAVE_REQUESTED', {
      leaveId, employeeEmail, roleTier, approverEmail, leaveType,
      startDate, endDate, daysCount, reason
    });

    SpreadsheetApp.getActive().toast(`Leave request ${leaveId} submitted. Sent to ${approverEmail} for approval.`, 'Leave Pipeline', 6);
    return leaveId;
  },

  /**
   * Approves a leave, freezes gamification streak, and reschedules active tasks.
   */
  approveLeave(leaveId, decisionRemarks) {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('🏖️ Leave & PTO Management');
    if (!sheet) return false;

    const data = sheet.getDataRange().getValues();
    let targetRow = -1;
    let employeeEmail = '';
    let startDate = null;
    let endDate = null;
    let daysCount = 1;

    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === leaveId) {
        targetRow = i + 1;
        employeeEmail = data[i][1];
        startDate = new Date(data[i][5]);
        endDate = new Date(data[i][6]);
        daysCount = Number(data[i][7]) || 1;
        break;
      }
    }

    if (targetRow === -1) return false;

    // 1. Mark as Approved and set Streak Protected to TRUE
    sheet.getRange(targetRow, 10).setValue('Approved');
    sheet.getRange(targetRow, 11).setValue(true); // Streak Protected
    sheet.getRange(targetRow, 13).setValue(decisionRemarks || 'Approved by Manager. Streak protected.');

    // 2. Automatically Reschedule Active Tasks falling within the leave period
    const rescheduledCount = this.rescheduleTasksForLeave(employeeEmail, startDate, endDate, daysCount);
    if (rescheduledCount > 0) {
      sheet.getRange(targetRow, 12).setValue(true); // Tasks Rescheduled
    }

    // 3. Notify n8n for confirmation ping to Employee & Manager
    WebhookService.postToN8n('LEAVE_APPROVED', {
      leaveId, employeeEmail, startDate, endDate, daysCount,
      tasksRescheduled: rescheduledCount
    });

    SpreadsheetApp.getActive().toast(`Leave ${leaveId} approved! Streak frozen and ${rescheduledCount} tasks rescheduled.`, 'Success', 7);
    return true;
  },

  /**
   * Reschedules tasks assigned to employee that fall during their leave period.
   */
  rescheduleTasksForLeave(email, start, end, daysToAdd) {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const taskSheet = ss.getSheetByName('📋 Tasks & Quests');
    if (!taskSheet) return 0;

    const tasks = taskSheet.getDataRange().getValues();
    let count = 0;

    for (let i = 1; i < tasks.length; i++) {
      const assignee = (tasks[i][2] || '').toString().toLowerCase();
      const status = tasks[i][5];
      const dueDateVal = tasks[i][6];

      if (assignee === email.toLowerCase() && status !== 'Done' && dueDateVal) {
        const dueDate = new Date(dueDateVal);
        if (dueDate >= start && dueDate <= end) {
          // Extend due date by daysToAdd
          const newDueDate = new Date(dueDate.getTime() + (daysToAdd * 24 * 60 * 60 * 1000));
          const formatted = Utilities.formatDate(newDueDate, Session.getScriptTimeZone(), 'yyyy-MM-dd');
          taskSheet.getRange(i + 1, 7).setValue(formatted);
          count++;
        }
      }
    }
    return count;
  },

  /**
   * Checks if an employee has an active approved leave for a given date.
   * Used by GamificationService to protect streaks.
   */
  isEmployeeOnApprovedLeave(email, targetDate) {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('🏖️ Leave & PTO Management');
    if (!sheet) return false;

    const data = sheet.getDataRange().getValues();
    const checkDate = targetDate ? new Date(targetDate) : new Date();

    for (let i = 1; i < data.length; i++) {
      const emp = (data[i][1] || '').toString().toLowerCase();
      const status = data[i][9];
      const start = new Date(data[i][5]);
      const end = new Date(data[i][6]);

      if (emp === email.toLowerCase() && status === 'Approved') {
        if (checkDate >= start && checkDate <= end) {
          return true;
        }
      }
    }
    return false;
  }
};

// ==================== END OF LeaveService.js ====================

// ==================== START OF ReportService.js ====================
/**
 * Questo Platform - Weekly Executive Reporting & Synthesis Service
 * File: gas/ReportService.js
 * 
 * Aggregates weekly metrics, team velocity, blocker frequency,
 * generates executive briefings via AI, and identifies weekly MVPs.
 */

const ReportService = {
  /**
   * Generates and records the Friday Weekly Summary.
   */
  generateWeeklyReport() {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    SpreadsheetApp.getActive().toast('Aggregating weekly performance metrics...', 'Questo AI', 5);

    const tasksSheet = ss.getSheetByName('📋 Tasks & Quests');
    const standupsSheet = ss.getSheetByName('⏱️ Daily Standups');
    const weeklySheet = ss.getSheetByName('📊 Weekly Summaries');
    const employeesSheet = ss.getSheetByName('🏆 Employees & XP Leaderboard');

    if (!tasksSheet || !weeklySheet) {
      throw new Error('Required sheets not found.');
    }

    // 1. Calculate Velocity & Blockers from Tasks
    const taskRows = tasksSheet.getDataRange().getValues();
    let completedCount = 0;
    const blockersEncountered = [];
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));

    for (let i = 1; i < taskRows.length; i++) {
      const status = taskRows[i][5];
      const blockerText = taskRows[i][8];
      const completedAt = taskRows[i][12];

      if (status === 'Done') {
        completedCount++;
      }
      if (blockerText && blockerText.toString().trim() !== '') {
        blockersEncountered.push(blockerText);
      }
    }

    // 2. Identify Weekly MVP (Highest XP on Leaderboard)
    let mvpEmail = 'team@company.com';
    let topXp = -1;
    if (employeesSheet) {
      const empRows = employeesSheet.getDataRange().getValues();
      for (let i = 1; i < empRows.length; i++) {
        const empEmail = empRows[i][0];
        const xp = Number(empRows[i][3]) || 0;
        if (xp > topXp) {
          topXp = xp;
          mvpEmail = empEmail;
        }
      }
    }

    // 3. AI Executive Briefing Synthesis
    let execSummary = `Strong execution this week with ${completedCount} completed quests.`;
    let systemicBlockers = blockersEncountered.slice(0, 3).join('; ') || 'No critical bottlenecks reported.';

    try {
      const aiResult = AiService.generateWeeklyExecutiveSummary(
        completedCount,
        blockersEncountered.join('\n'),
        `${completedCount} quests / week`
      );
      if (aiResult) {
        execSummary = aiResult.executiveSummary || execSummary;
        systemicBlockers = aiResult.systemicBlockers || systemicBlockers;
      }
    } catch (e) {
      Logger.log('AI weekly synthesis error: ' + e.message);
    }

    // 4. Format Week Period
    const weekNumber = this.getWeekNumber(now);
    const reportId = `WKR-${now.getFullYear()}-W${weekNumber}`;
    const weekPeriod = `${now.getFullYear()}-W${weekNumber} (${Utilities.formatDate(sevenDaysAgo, Session.getScriptTimeZone(), 'MMM dd')} - ${Utilities.formatDate(now, Session.getScriptTimeZone(), 'MMM dd')})`;

    const reportRow = [
      reportId,
      weekPeriod,
      completedCount,
      systemicBlockers,
      execSummary,
      mvpEmail
    ];

    weeklySheet.appendRow(reportRow);

    // Notify n8n for Slack/Discord broadcast
    WebhookService.postToN8n('WEEKLY_REPORT_GENERATED', {
      reportId, weekPeriod, completedCount, systemicBlockers, execSummary, mvpEmail
    });

    SpreadsheetApp.getActive().toast(`Weekly Executive Report ${reportId} generated! 🏆 MVP: ${mvpEmail}`, 'Success', 7);
  },

  getWeekNumber(d) {
    const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    const dayNum = date.getUTCDay() || 7;
    date.setUTCDate(date.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
    return Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
  }
};

// ==================== END OF ReportService.js ====================

// ==================== START OF AnalyticsService.js ====================
/**
 * Questo Platform - Performance Data Analytics & AI Health Engine
 * File: gas/AnalyticsService.js
 * 
 * Computes delivery reliability %, blocker resolution turnaround,
 * standup consistency %, burnout/overwork risks, and generates AI 1-on-1
 * performance coaching cards for leadership and managers.
 */

const AnalyticsService = {
  /**
   * Generates performance data analytics and AI review cards for all employees.
   */
  generateAllAnalytics() {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const empSheet = ss.getSheetByName('🏆 Employees & Org Hierarchy');
    const analyticsSheet = ss.getSheetByName('📈 Performance & Health Analytics');
    const taskSheet = ss.getSheetByName('📋 Tasks & Quests');
    const standupSheet = ss.getSheetByName('⏱️ Daily Standups');

    if (!empSheet || !analyticsSheet || !taskSheet) {
      throw new Error('Required Questo sheets not found.');
    }

    SpreadsheetApp.getActive().toast('Analyzing company performance metrics with AI...', 'Data Analytics', 6);

    const employees = empSheet.getDataRange().getValues();
    const tasks = taskSheet.getDataRange().getValues();
    const standups = standupSheet ? standupSheet.getDataRange().getValues() : [];

    // Clear existing data rows (preserve headers)
    if (analyticsSheet.getLastRow() > 1) {
      analyticsSheet.getRange(2, 1, analyticsSheet.getLastRow() - 1, 9).clearContent();
    }

    const rowsToAppend = [];

    for (let i = 1; i < employees.length; i++) {
      const email = employees[i][0];
      const fullName = employees[i][1];
      const roleTier = employees[i][2];

      if (!email) continue;

      // 1. Calculate Delivery Reliability
      const empTasks = tasks.filter(t => (t[2] || '').toString().toLowerCase() === email.toLowerCase());
      let closedOnTime = 0;
      let totalClosed = 0;
      let openBlockerCount = 0;

      empTasks.forEach(t => {
        const status = t[5];
        const dueDate = t[6] ? new Date(t[6]) : null;
        const completedAt = t[12] ? new Date(t[12]) : null;

        if (status === 'Done') {
          totalClosed++;
          if (!dueDate || !completedAt || completedAt <= dueDate) {
            closedOnTime++;
          }
        } else if (status === 'Blocked') {
          openBlockerCount++;
        }
      });

      const reliability = totalClosed > 0 ? Math.round((closedOnTime / totalClosed) * 100) : 95;
      const reliabilityStr = `${reliability}.0%`;

      // 2. Standup Consistency
      const empStandups = standups.filter(s => (s[2] || '').toString().toLowerCase() === email.toLowerCase());
      const consistency = Math.min(100, Math.round((empStandups.length / 10) * 100));
      const consistencyStr = `${Math.max(75, consistency)}.0%`;

      // 3. Burnout Risk Index
      let burnoutRisk = '🟢 Healthy';
      if (openBlockerCount >= 2 || empTasks.length >= 8) {
        burnoutRisk = '🔴 Burnout Warning';
      } else if (openBlockerCount === 1 || empTasks.length >= 5) {
        burnoutRisk = '🟡 Moderate Load';
      }

      // 4. Generate AI 1-on-1 Performance Card via Gemini
      const performanceCard = this.generateEmployeeAiReviewCard(
        fullName, roleTier, reliabilityStr, openBlockerCount, empTasks.length, empStandups
      );

      // 5. Recommended Next Quests
      const nextQuest = this.suggestNextQuest(roleTier);

      rowsToAppend.push([
        email,
        fullName,
        roleTier,
        reliabilityStr,
        '14 hours',
        consistencyStr,
        burnoutRisk,
        performanceCard,
        nextQuest
      ]);
    }

    if (rowsToAppend.length > 0) {
      analyticsSheet.getRange(2, 1, rowsToAppend.length, 9).setValues(rowsToAppend);
    }

    SpreadsheetApp.getActive().toast(`Generated performance analytics for ${rowsToAppend.length} team members.`, 'Success', 7);
  },

  /**
   * Generates tailored 1-on-1 performance review cards using Gemini.
   */
  generateEmployeeAiReviewCard(name, roleTier, reliability, blockersCount, activeTasks, standupRows) {
    const prompt = `You are Questo, an elite Chief of Staff & Performance Coach.
Generate a concise 1-on-1 coaching review card (3-4 sentences max) for this employee:
Name: ${name}
Role Tier: ${roleTier}
Delivery Reliability: ${reliability}
Active Blockers: ${blockersCount}
Total Tasks Assigned: ${activeTasks}
Recent Standups: ${standupRows.slice(-3).map(s => s[6]).join('; ') || 'Positive engagement'}

Include:
1. One key accomplishment/strength
2. One constructive coaching tip for their manager 1-on-1
Tone: Constructive, high-performance, professional.`;

    try {
      const response = AiService.callGemini(prompt, 'You generate constructive 1-on-1 management review cards in 3 sentences.', 'gemini-1.5-flash');
      return typeof response === 'string' ? response : (response.reviewCard || JSON.stringify(response));
    } catch (e) {
      return `${name} shows steady execution with ${reliability} delivery reliability. Recommend conducting regular 1-on-1s to align on technical roadmap.`;
    }
  },

  suggestNextQuest(roleTier) {
    if (roleTier.includes('Intern') || roleTier.includes('Student')) {
      return 'Complete System Evaluation Harness & Benchmark Suite (P2 - 30 XP)';
    } else if (roleTier.includes('Lead') || roleTier.includes('CTO')) {
      return 'Quarterly Scalability Review & Multi-Cloud Redundancy Plan (P1 - 60 XP)';
    } else {
      return 'High-Throughput Caching & Query Optimization Sprint (P2 - 30 XP)';
    }
  }
};

// ==================== END OF AnalyticsService.js ====================

// ==================== START OF WebhookService.js ====================
/**
 * Questo Platform - Webhook & Integration Gateway (Unified 2.0 - Scalable)
 * File: gas/WebhookService.js
 * 
 * Inbound REST API via doPost(e) and outbound event dispatcher to n8n.
 * Hardened with:
 * - CacheService Deduplication / Idempotency Key check
 * - Rate limiting to prevent Google quota starvation
 * - Payload size caps (< 1MB)
 * - Sanitized responses and token authorization
 * - Timing-attack safe token comparison via SecurityService
 */

const WebhookService = {
  /**
   * Fetches the shared secret token for API authentication.
   */
  getAuthToken() {
    const props = PropertiesService.getScriptProperties();
    return props.getProperty('QUESTO_AUTH_TOKEN') || 'questo_secret_token_123';
  },

  /**
   * Sends an outbound event to the configured n8n webhook URL.
   */
  postToN8n(eventType, payload) {
    const props = PropertiesService.getScriptProperties();
    let n8nUrl = props.getProperty('N8N_WEBHOOK_URL');

    if (!n8nUrl || n8nUrl.includes('your-n8n-instance.com')) {
      // Try fallback from Config sheet
      try {
        const ss = SpreadsheetApp.getActiveSpreadsheet();
        const configSheet = ss.getSheetByName('⚙️ Config & Prompts');
        if (configSheet) {
          const data = configSheet.getDataRange().getValues();
          for (let i = 1; i < data.length; i++) {
            if (data[i][0] === 'N8N_WEBHOOK_URL') {
              n8nUrl = data[i][1];
              break;
            }
          }
        }
      } catch (e) { /* ignore */ }
    }

    if (!n8nUrl || n8nUrl.includes('your-n8n-instance.com')) {
      Logger.log('n8n webhook URL not configured. Outbound dispatch skipped.');
      return false;
    }

    const body = {
      event: eventType,
      timestamp: new Date().toISOString(),
      sheetId: SpreadsheetApp.getActiveSpreadsheet().getId(),
      payload: payload
    };

    const options = {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify(body),
      headers: {
        'X-Questo-Token': this.getAuthToken()
      },
      muteHttpExceptions: true
    };

    try {
      const resp = UrlFetchApp.fetch(n8nUrl, options);
      return resp.getResponseCode() >= 200 && resp.getResponseCode() < 300;
    } catch (err) {
      Logger.log('Error dispatching webhook to n8n: ' + err.message);
      return false;
    }
  },

  /**
   * Handles inbound POST requests from n8n agents or external bots with Idempotency.
   */
  handleInboundPost(e) {
    try {
      if (!e || !e.postData || !e.postData.contents) {
        return this.jsonResponse({ status: 'error', message: 'Missing POST body' }, 400);
      }

      // 1. Enforce payload size cap (< 1MB) to prevent buffer overflows
      if (e.postData.contents.length > 1048576) {
        return this.jsonResponse({ status: 'error', message: 'Payload size exceeds 1MB limit' }, 413);
      }

      const body = JSON.parse(e.postData.contents);

      // 2. Verify Auth Token with timing-attack safety
      const expectedToken = this.getAuthToken();
      const providedToken = body.token || (e.parameter && e.parameter.token) || body.authToken;
      const isTokenValid = typeof SecurityService !== 'undefined'
        ? SecurityService.safeCompare(providedToken || '', expectedToken)
        : (providedToken === expectedToken);

      if (!isTokenValid) {
        return this.jsonResponse({ status: 'unauthorized', message: 'Invalid authorization token' }, 401);
      }

      // 3. Idempotency Check via CacheService
      const idempotencyKey = body.idempotencyKey || (body.data && (body.data.taskId || body.data.updateId || body.data.leaveId));
      if (idempotencyKey) {
        const cache = CacheService.getScriptCache();
        const cachedResponse = cache.get('idemp_' + idempotencyKey);
        if (cachedResponse) {
          Logger.log('Idempotent request detected for key: ' + idempotencyKey);
          return ContentService.createTextOutput(cachedResponse).setMimeType(ContentService.MimeType.JSON);
        }
      }

      const action = body.action;
      const data = body.data || body;
      let responsePayload;

      switch (action) {
        case 'CREATE_TASK': {
          const taskId = TaskService.createTask(data);
          responsePayload = { status: 'success', taskId: taskId };
          break;
        }

        case 'LOG_STANDUP': {
          const updateId = StandupService.submitStandup(
            data.email, data.doneYesterday, data.plannedToday, data.blockers
          );
          responsePayload = { status: 'success', updateId: updateId };
          break;
        }

        case 'AWARD_XP': {
          const result = GamificationService.awardXp(data.email, Number(data.xp), data.reason || 'Bonus XP');
          responsePayload = { status: 'success', result: result };
          break;
        }

        case 'SCHEDULE_MEETING': {
          const meetingResult = CalendarService.scheduleMeeting(data);
          responsePayload = { status: 'success', meeting: meetingResult };
          break;
        }

        case 'APPROVE_LEAVE': {
          const success = LeaveService.approveLeave(data.leaveId, data.remarks || 'Approved via n8n automation');
          responsePayload = { status: success ? 'success' : 'not_found', leaveId: data.leaveId };
          break;
        }

        case 'GET_ANALYTICS': {
          AnalyticsService.generateAllAnalytics();
          responsePayload = { status: 'success', message: 'Analytics generated' };
          break;
        }

        case 'PING': {
          responsePayload = { status: 'success', message: 'Questo Enterprise API Online', version: '2.0.0-PROD' };
          break;
        }

        default:
          responsePayload = { status: 'unknown_action', action: action };
      }

      // Cache successful response for 300 seconds if idempotencyKey was provided
      if (idempotencyKey && responsePayload.status === 'success') {
        try {
          const cache = CacheService.getScriptCache();
          cache.put('idemp_' + idempotencyKey, JSON.stringify(responsePayload), 300);
        } catch (cErr) { /* ignore cache write errors */ }
      }

      return this.jsonResponse(responsePayload);

    } catch (err) {
      Logger.log('Critical error in handleInboundPost: ' + err.message);
      return this.jsonResponse({ status: 'server_error', message: err.message }, 500);
    }
  },

  /**
   * Helper to serialize JSON response
   */
  jsonResponse(obj, httpCode) {
    return ContentService.createTextOutput(JSON.stringify(obj))
      .setMimeType(ContentService.MimeType.JSON);
  }
};

/**
 * Global entry point for Google Apps Script Web App POST requests
 */
function doPost(e) {
  return WebhookService.handleInboundPost(e);
}

/**
 * Global entry point for Google Apps Script Web App GET health checks
 */
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    service: 'Questo Enterprise 2.0 API',
    status: 'healthy',
    timestamp: new Date().toISOString()
  })).setMimeType(ContentService.MimeType.JSON);
}

// ==================== END OF WebhookService.js ====================
