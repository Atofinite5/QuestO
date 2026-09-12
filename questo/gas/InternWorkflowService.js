/**
 * Questo Platform - Intern Work Decomposition & CTO Approval Engine (Unified 2.0)
 * File: gas/InternWorkflowService.js
 * 
 * Implements:
 * 1. Founder -> CTO Work Delegation via Gemini 2.5 Flash
 * 2. Weekly Work Breakdown generation with Accept, Reject, and Undo
 * 3. Dynamic Intern Dedicated Sheet Provisioning (e.g. "🎓 Intern - Rohan Sharma")
 *    Columns: Task ID | Week | Milestone Goal | Task Title | Description | Priority |
 *             Intern Status [In Progress / Done] | CTO Approval [Pending / Approved / Needs Revision] |
 *             Approved By | Completed At | XP Bounty
 * 4. Intern status updating & CTO manual approval loop
 * 5. Automatic meeting scheduler for CTO/Founder with instant email invite to interns
 * 6. Continuous AI Performance Analysis on intern progress
 */

const InternWorkflowService = {
  /**
   * Generates weekly intern roadmap draft using Gemini 2.5 Flash.
   * Caches result in ScriptCache so Founder/CTO can review, accept, reject, or undo.
   *
   * @param {string} workDetails Details provided by Founder to CTO
   * @param {string} internEmail Target intern email
   * @param {string} internName Target intern name
   * @param {number} totalWeeks Total project weeks (default 4)
   * @returns {Object} roadmap draft
   */
  generateRoadmapDraft(workDetails, internEmail, internName, totalWeeks = 4) {
    const draft = AiService.generateWeeklyInternRoadmap(workDetails, internName, totalWeeks);

    // Save draft into cache for Accept / Reject / Undo actions
    const cache = CacheService.getScriptCache();
    const draftKey = 'draft_' + (internEmail ? internEmail.replace(/[^a-zA-Z0-9]/g, '_') : 'default');
    
    // Store draft & previous state for Undo
    const previous = cache.get(draftKey);
    if (previous) {
      cache.put(draftKey + '_prev', previous, 1800);
    }
    cache.put(draftKey, JSON.stringify(draft), 1800);

    return {
      status: 'draft_ready',
      internEmail,
      internName,
      draftKey,
      roadmap: draft
    };
  },

  /**
   * Reverts (Undo) the most recent roadmap draft.
   */
  undoRoadmapDraft(internEmail) {
    const cache = CacheService.getScriptCache();
    const draftKey = 'draft_' + (internEmail ? internEmail.replace(/[^a-zA-Z0-9]/g, '_') : 'default');
    const prev = cache.get(draftKey + '_prev');

    if (!prev) {
      return { status: 'no_history', message: 'No previous roadmap draft found to undo.' };
    }

    cache.put(draftKey, prev, 1800);
    cache.remove(draftKey + '_prev');
    return { status: 'undone', roadmap: JSON.parse(prev) };
  },

  /**
   * Rejects the roadmap draft.
   */
  rejectRoadmapDraft(internEmail) {
    const cache = CacheService.getScriptCache();
    const draftKey = 'draft_' + (internEmail ? internEmail.replace(/[^a-zA-Z0-9]/g, '_') : 'default');
    cache.remove(draftKey);
    cache.remove(draftKey + '_prev');
    return { status: 'rejected', message: 'Draft discarded.' };
  },

  /**
   * Accepts the roadmap draft and provisions/populates the intern's dedicated sheet.
   * Also populates main "📋 Tasks & Quests" tab and dispatches notification to intern.
   *
   * @param {string} internEmail
   * @param {string} internName
   * @param {Object} explicitRoadmap Optional roadmap object if not pulling from cache
   */
  acceptAndProvisionInternSheet(internEmail, internName, explicitRoadmap = null) {
    let roadmap = explicitRoadmap;
    if (!roadmap) {
      const cache = CacheService.getScriptCache();
      const draftKey = 'draft_' + (internEmail ? internEmail.replace(/[^a-zA-Z0-9]/g, '_') : 'default');
      const cached = cache.get(draftKey);
      if (!cached) throw new Error('No active roadmap draft found to accept. Please generate one first.');
      roadmap = JSON.parse(cached);
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sanitizedName = internName || internEmail.split('@')[0];
    const sheetTitle = `🎓 Intern - ${sanitizedName}`;

    let sheet = ss.getSheetByName(sheetTitle);
    if (!sheet) {
      sheet = ss.insertSheet(sheetTitle);
    } else {
      sheet.clear();
    }

    sheet.setTabColor('#8b5cf6'); // Purple

    // Headers
    const headers = [
      'Task ID', 'Week', 'Weekly Theme', 'Task Title', 'Technical Description',
      'Priority', 'Intern Status', 'CTO Approval', 'Approved By', 'Completed At', 'XP Bounty'
    ];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    styleHeaders(sheet, 1, headers.length);

    // Dropdowns
    const statusRule = SpreadsheetApp.newDataValidation()
      .requireValueInList(['Backlog', 'In Progress', 'Done'], true)
      .build();
    sheet.getRange('G2:G100').setDataValidation(statusRule);

    const approvalRule = SpreadsheetApp.newDataValidation()
      .requireValueInList(['Pending', 'Approved', 'Needs Revision'], true)
      .build();
    sheet.getRange('H2:H100').setDataValidation(approvalRule);

    // Populate rows
    const rows = [];
    const mainTaskRows = [];

    (roadmap.weeks || []).forEach(w => {
      const weekNum = `Week ${w.weekNumber}`;
      const theme = w.theme || w.goals || '';

      (w.tasks || []).forEach((t, idx) => {
        const taskId = t.taskId || `INT-W${w.weekNumber}-${idx + 1}`;
        const bounty = Number(t.xpBounty) || 30;

        rows.push([
          taskId,
          weekNum,
          theme,
          t.title || 'Milestone Task',
          t.description || '',
          t.priority || 'P2 - Medium',
          'Backlog',     // Intern Status
          'Pending',     // CTO Approval
          '',            // Approved By
          '',            // Completed At
          bounty
        ]);

        // Also queue for main Tasks & Quests tab
        mainTaskRows.push({
          taskId,
          title: `[${sanitizedName}] ${t.title}`,
          assignee: internEmail,
          roleTier: 'Intern / Student',
          priority: t.priority || 'P2 - Medium',
          status: 'Backlog',
          xpBounty: bounty,
          description: t.description
        });
      });
    });

    if (rows.length > 0) {
      let safeRows = rows;
      if (typeof SecurityService !== 'undefined') {
        safeRows = rows.map(r => SecurityService.sanitizeRow(r));
      }
      sheet.getRange(2, 1, safeRows.length, headers.length).setValues(safeRows);
    }

    // Auto-fit widths
    const widths = [110, 80, 180, 220, 280, 110, 120, 130, 160, 140, 90];
    widths.forEach((w, i) => sheet.setColumnWidth(i + 1, w));

    // Also register tasks in main TaskService
    mainTaskRows.forEach(t => {
      try { TaskService.createTask(t); } catch (e) { /* ignore duplicate */ }
    });

    // Notify intern via email with full schedule
    this.sendInternRoadmapEmail(internEmail, sanitizedName, roadmap);

    // Notify n8n
    WebhookService.postToN8n('INTERN_ROADMAP_PROVISIONED', {
      internEmail,
      internName: sanitizedName,
      sheetTitle,
      totalTasks: rows.length
    });

    SpreadsheetApp.getActive().toast(`Provisioned roadmap sheet "${sheetTitle}" with ${rows.length} tasks!`, 'Success 🚀', 6);

    return {
      status: 'provisioned',
      sheetTitle,
      totalTasks: rows.length
    };
  },

  /**
   * Updates an intern task's status (In Progress or Done) from sheet or dashboard.
   */
  updateInternTaskStatus(sheetTitle, taskId, newStatus) {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(sheetTitle);
    if (!sheet) throw new Error(`Sheet ${sheetTitle} not found.`);

    const data = sheet.getDataRange().getValues();
    let rowIndex = -1;

    for (let i = 1; i < data.length; i++) {
      if (data[i][0] && data[i][0].toString().trim() === taskId.trim()) {
        rowIndex = i + 1;
        break;
      }
    }

    if (rowIndex === -1) throw new Error(`Task ${taskId} not found in ${sheetTitle}`);

    sheet.getRange(rowIndex, 7).setValue(newStatus); // Column G: Intern Status

    if (newStatus === 'Done') {
      const now = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss');
      sheet.getRange(rowIndex, 10).setValue(now); // Column J: Completed At
    }

    // Sync to main Tasks tab as well
    this.syncStatusToMainTasks(taskId, newStatus);

    return { status: 'updated', taskId, newStatus };
  },

  /**
   * CTO Manual Approval verification.
   * When CTO approves on the panel or sheet, awards XP to the intern.
   */
  approveInternTask(sheetTitle, taskId, decision = 'Approved', ctoEmail = null) {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(sheetTitle);
    if (!sheet) throw new Error(`Sheet ${sheetTitle} not found.`);

    const data = sheet.getDataRange().getValues();
    let rowIndex = -1;
    let taskRow = null;

    for (let i = 1; i < data.length; i++) {
      if (data[i][0] && data[i][0].toString().trim() === taskId.trim()) {
        rowIndex = i + 1;
        taskRow = data[i];
        break;
      }
    }

    if (rowIndex === -1 || !taskRow) throw new Error(`Task ${taskId} not found in ${sheetTitle}`);

    const reviewer = ctoEmail || Session.getActiveUser().getEmail() || 'CTO';
    sheet.getRange(rowIndex, 8).setValue(decision);   // Column H: CTO Approval
    sheet.getRange(rowIndex, 9).setValue(reviewer);   // Column I: Approved By

    // If Approved and Intern marked Done, grant XP
    if (decision === 'Approved') {
      const internNameMatch = sheetTitle.replace('🎓 Intern - ', '').trim();
      const bounty = Number(taskRow[10]) || 30;

      // Lookup intern email from Employees tab
      const internEmail = this.lookupEmployeeEmailByName(internNameMatch);
      if (internEmail) {
        GamificationService.awardXp(internEmail, bounty, `CTO Approved Task ${taskId}: ${taskRow[3]}`);
        GamificationService.recordTaskCompleted(internEmail, taskRow[5]);
      }

      SpreadsheetApp.getActive().toast(`Task ${taskId} approved by ${reviewer}! +${bounty} XP awarded.`, 'CTO Verified ✅', 5);
    }

    return { status: 'approval_logged', taskId, decision, reviewer };
  },

  /**
   * Schedules a dedicated 1-on-1 or review meeting with an intern,
   * provisions Google Meet link, and automatically sends invite email to the intern.
   */
  scheduleInternMeeting(internEmail, internName, meetingTitle, startTime, durationMinutes = 30) {
    const title = meetingTitle || `CTO Sync with ${internName || internEmail}`;
    const start = startTime ? new Date(startTime) : new Date(Date.now() + 3600000);
    const end = new Date(start.getTime() + durationMinutes * 60000);
    const host = Session.getActiveUser().getEmail() || 'cto@company.com';

    // 1. Provision via CalendarService
    const result = CalendarService.scheduleMeeting({
      title,
      meetingType: 'Intern 1-on-1 Review',
      host,
      attendees: `${host}, ${internEmail}`,
      startTime: start.toISOString(),
      endTime: end.toISOString()
    });

    // 2. Dispatch customized HTML email directly to intern
    const formattedDate = Utilities.formatDate(start, Session.getScriptTimeZone(), 'EEEE, MMMM d, yyyy @ HH:mm');
    const htmlBody = `
      <div style="font-family: 'Inter', sans-serif; background-color: #0f172a; color: #f8fafc; padding: 28px; border-radius: 12px; max-width: 580px; margin: auto;">
        <h2 style="color: #38bdf8; margin-top: 0;">📅 New Meeting Scheduled with Engineering Leadership</h2>
        <p>Hi ${internName || 'there'},</p>
        <p>The CTO / Founder has scheduled an engineering sync with you:</p>

        <div style="background: rgba(30, 41, 59, 0.8); border: 1px solid rgba(99, 102, 241, 0.3); border-radius: 8px; padding: 16px; margin: 16px 0;">
          <p style="margin: 4px 0;"><strong>Topic:</strong> ${title}</p>
          <p style="margin: 4px 0;"><strong>When:</strong> ${formattedDate} (${Session.getScriptTimeZone()})</p>
          <p style="margin: 4px 0;"><strong>Host:</strong> ${host}</p>
          <p style="margin: 12px 0 4px;"><strong>Google Meet Video Link:</strong></p>
          <a href="${result.meetLink}" style="color: #38bdf8; font-weight: 600; font-size: 14px; text-decoration: underline;">
            ${result.meetLink}
          </a>
        </div>

        <p style="font-size: 13px; color: #94a3b8;">Please ensure your daily standup and active task progress are up to date before the call.</p>
        <p style="margin-top: 20px; font-size: 12px; color: #64748b;">Questo Autonomous Engineering Operations</p>
      </div>
    `;

    try {
      MailApp.sendEmail({
        to: internEmail,
        subject: `📅 Scheduled: ${title}`,
        htmlBody: htmlBody,
        name: 'Questo Engineering Leadership'
      });
    } catch (e) {
      Logger.log('MailApp send error: ' + e.message);
    }

    return {
      status: 'scheduled_and_mailed',
      meetingId: result.meetingId,
      meetLink: result.meetLink,
      attendee: internEmail
    };
  },

  /**
   * Continuous AI Performance Analysis for an intern.
   */
  getInternAiAnalysis(sheetTitle) {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(sheetTitle);
    if (!sheet) throw new Error(`Sheet ${sheetTitle} not found.`);

    const internName = sheetTitle.replace('🎓 Intern - ', '').trim();
    const data = sheet.getDataRange().getValues();

    const completed = [];
    const inProgress = [];
    const pendingApproval = [];
    const blockers = [];

    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const task = { id: row[0], week: row[1], title: row[3], status: row[6], approval: row[7] };

      if (row[6] === 'Done') completed.push(task);
      if (row[6] === 'In Progress') inProgress.push(task);
      if (row[7] === 'Pending' && row[6] === 'Done') pendingApproval.push(task);
      if (row[5] === 'P0 - Blocker' || row[6] === 'Blocked') blockers.push(task);
    }

    return AiService.analyzeInternPerformance(
      internName, completed, inProgress, pendingApproval, blockers
    );
  },

  /**
   * Syncs task status back to main Tasks & Quests sheet.
   */
  syncStatusToMainTasks(taskId, newStatus) {
    try {
      const ss = SpreadsheetApp.getActiveSpreadsheet();
      const mainTasks = ss.getSheetByName(SHEET_NAMES.TASKS);
      if (!mainTasks) return;

      const data = mainTasks.getDataRange().getValues();
      for (let i = 1; i < data.length; i++) {
        if (data[i][0] && data[i][0].toString().trim() === taskId.trim()) {
          mainTasks.getRange(i + 1, 6).setValue(newStatus); // Status Column
          if (newStatus === 'Done') {
            const now = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss');
            mainTasks.getRange(i + 1, 13).setValue(now); // Completed At Column
          }
          break;
        }
      }
    } catch (e) {
      Logger.log('Sync to main tasks error: ' + e.message);
    }
  },

  lookupEmployeeEmailByName(name) {
    try {
      const ss = SpreadsheetApp.getActiveSpreadsheet();
      const empSheet = ss.getSheetByName(SHEET_NAMES.EMPLOYEES);
      if (!empSheet) return null;
      const data = empSheet.getDataRange().getValues();
      for (let i = 1; i < data.length; i++) {
        if (data[i][1] && data[i][1].toString().toLowerCase().includes(name.toLowerCase())) {
          return data[i][0];
        }
      }
    } catch (e) { }
    return 'intern@company.com';
  },

  sendInternRoadmapEmail(email, name, roadmap) {
    try {
      const weekBullets = (roadmap.weeks || []).map(w => 
        `<li style="margin-bottom: 8px;"><strong>Week ${w.weekNumber} (${w.theme || 'Milestone'}):</strong> ${(w.tasks || []).length} tasks assigned</li>`
      ).join('');

      const htmlBody = `
        <div style="font-family: 'Inter', sans-serif; background-color: #0f172a; color: #f8fafc; padding: 28px; border-radius: 12px; max-width: 580px; margin: auto;">
          <h2 style="color: #8b5cf6; margin-top: 0;">🚀 Your Project Roadmap Has Been Provisioned!</h2>
          <p>Hi ${name},</p>
          <p>The Founder and CTO have finalized your multi-week engineering roadmap on Questo. A dedicated tracking sheet has been created for you.</p>

          <div style="background: rgba(30, 41, 59, 0.8); border: 1px solid rgba(139, 92, 246, 0.3); border-radius: 8px; padding: 16px; margin: 16px 0;">
            <p style="margin: 0 0 8px; color: #c4b5fd;"><strong>Roadmap Overview:</strong></p>
            <ul style="padding-left: 20px; color: #e2e8f0; font-size: 13px;">
              ${weekBullets}
            </ul>
          </div>

          <p style="font-size: 13px; color: #cbd5e1;">Open your Google Sheet to view tasks, mark them <strong>In Progress</strong> and <strong>Done</strong>, and receive XP upon CTO verification!</p>
        </div>
      `;

      MailApp.sendEmail({
        to: email,
        subject: `🚀 Your Engineering Roadmap & Weekly Tasks are Ready!`,
        htmlBody: htmlBody,
        name: 'Questo Engineering Leadership'
      });
    } catch (e) {
      Logger.log('Intern roadmap email error: ' + e.message);
    }
  }
};
