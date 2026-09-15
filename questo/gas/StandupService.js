/**
 * Questo Platform - Daily Standup, Intern EOD & Blocker Intelligence Service
 * File: gas/StandupService.js
 * 
 * Ingests daily updates and intern EOD reports, runs AI risk and sentiment evaluations,
 * updates employee streaks, issues standup XP bounties, and notifies the CTO in real-time.
 */

const StandupService = {
  /**
   * Helper to retrieve the active CTO email from hierarchy sheet or active user fallback.
   */
  getCtoEmail() {
    try {
      const ss = SpreadsheetApp.getActiveSpreadsheet();
      const hierarchySheet = ss.getSheetByName('🏆 Employees & Org Hierarchy') || ss.getSheetByName('🏆 Employees & XP Leaderboard');
      if (hierarchySheet) {
        const data = hierarchySheet.getDataRange().getValues();
        for (let i = 1; i < data.length; i++) {
          const role = (data[i][2] || '').toString();
          if (role.toLowerCase().includes('cto') || role.toLowerCase().includes('vp eng')) {
            return data[i][0] ? data[i][0].toString().trim() : 'cto@company.com';
          }
        }
      }
    } catch (e) { /* fallback */ }
    return 'cto@company.com';
  },

  /**
   * Submits an intern's structured Daily EOD Report, runs AI risk & sentiment evaluation,
   * logs to ⏱️ Daily Standups tab, notifies the CTO via in-app notification & email,
   * awards XP, and fires n8n webhooks.
   *
   * @param {Object} data { internEmail, internName, tasksCompleted, challengesOvercome, blockers, tomorrowPlan }
   */
  submitInternEod(data) {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('⏱️ Daily Standups');
    if (!sheet) throw new Error('Daily Standups sheet not found. Please run initialization first.');

    const internEmail = (data.internEmail || '').trim();
    const internName = (data.internName || internEmail.split('@')[0] || 'Intern').trim();
    const tasksCompleted = (data.tasksCompleted || '').trim();
    const challengesOvercome = (data.challengesOvercome || '').trim();
    const blockers = (data.blockers || '').trim();
    const tomorrowPlan = (data.tomorrowPlan || '').trim();

    if (!internEmail) throw new Error('Intern email is required.');
    if (!tasksCompleted) throw new Error('Tasks completed today are required.');

    const updateId = 'EOD-' + Math.floor(2000 + Math.random() * 8000);
    const nowFormatted = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss');

    const hasBlocker = blockers.length > 0 &&
      blockers.toLowerCase() !== 'none' &&
      blockers.toLowerCase() !== 'no' &&
      blockers.toLowerCase() !== 'nil' &&
      blockers.toLowerCase() !== 'n/a';

    // Combine tasks & challenges for rich AI context
    let formattedDone = `📋 TASKS COMPLETED:\n${tasksCompleted}`;
    if (challengesOvercome && challengesOvercome.toLowerCase() !== 'none' && challengesOvercome.toLowerCase() !== 'n/a') {
      formattedDone += `\n\n⚡ CHALLENGES OVERCOME:\n${challengesOvercome}`;
    }

    let sentimentHealth = 'Evaluating...';
    let extractedRisks = 'Evaluating...';
    let riskLevel = hasBlocker ? '🔴 High Risk' : '🟢 Low';
    let suggestedAdvice = hasBlocker ? 'Verify dependency and unblock intern in upcoming 1-on-1.' : 'None needed; on track.';
    const baseStandupXp = 20;

    // Run AI Evaluation
    try {
      const aiResult = AiService.analyzeStandup(formattedDone, tomorrowPlan, blockers || 'None', internEmail);
      if (aiResult) {
        sentimentHealth = `${aiResult.sentimentScore}/10 - ${aiResult.sentimentSummary}`;
        extractedRisks = aiResult.extractedRisks || (hasBlocker ? `Blocker: ${blockers}` : 'None');
        riskLevel = aiResult.riskLevel || riskLevel;
        suggestedAdvice = aiResult.suggestedAdvice || suggestedAdvice;
      }
    } catch (e) {
      Logger.log('AI Standup evaluation fallback: ' + e.message);
      sentimentHealth = hasBlocker ? '5/10 - Blocked on dependencies' : '8/10 - Consistent daily execution';
      extractedRisks = hasBlocker ? `Reported Blocker: ${blockers}` : 'None';
    }

    // Row Schema:
    // 1:Update ID | 2:Timestamp | 3:Employee Email | 4:Done Yesterday / Tasks | 5:Planned Today | 6:Blockers | 7:Sentiment | 8:Risks | 9:XP | 10:CTO Status | 11:CTO Feedback
    const initialStatus = hasBlocker ? '🚨 Blocker Escalated' : 'Pending CTO Review';
    let newRow = [
      updateId,
      nowFormatted,
      internEmail,
      formattedDone,
      tomorrowPlan || 'Follow weekly milestone roadmap',
      blockers || 'None',
      sentimentHealth,
      extractedRisks,
      baseStandupXp,
      initialStatus,
      '' // CTO Feedback
    ];

    if (typeof SecurityService !== 'undefined') {
      newRow = SecurityService.sanitizeRow(newRow);
    }
    sheet.appendRow(newRow);

    // Gamification rewards & streak
    try {
      GamificationService.awardXp(internEmail, baseStandupXp, `Daily Intern EOD Report ${updateId}`);
      GamificationService.recordStandupSubmission(internEmail);
    } catch (gErr) {
      Logger.log('Gamification warning: ' + gErr.message);
    }

    // Record notification for CTO Admin Portal
    const notification = {
      id: 'notif_' + updateId,
      updateId: updateId,
      type: hasBlocker ? 'CRITICAL_BLOCKER' : 'INTERN_EOD',
      internName: internName,
      internEmail: internEmail,
      timestamp: nowFormatted,
      tasksSnippet: tasksCompleted.substring(0, 150) + (tasksCompleted.length > 150 ? '...' : ''),
      blockers: blockers || 'None',
      hasBlocker: hasBlocker,
      riskLevel: riskLevel,
      status: initialStatus,
      read: false
    };
    this.addCtoNotification(notification);

    // Send direct email alert to CTO
    this.sendCtoNotificationEmail(internName, internEmail, updateId, tasksCompleted, challengesOvercome, blockers, sentimentHealth, extractedRisks, suggestedAdvice, hasBlocker);

    // Outbound n8n dispatch
    WebhookService.postToN8n('INTERN_EOD_SUBMITTED', {
      updateId,
      internEmail,
      internName,
      tasksCompleted,
      challengesOvercome,
      blockers: blockers || 'None',
      tomorrowPlan,
      sentimentHealth,
      extractedRisks,
      hasBlocker,
      riskLevel,
      suggestedAdvice,
      timestamp: nowFormatted
    });

    return {
      status: 'success',
      updateId: updateId,
      hasBlocker: hasBlocker,
      riskLevel: riskLevel,
      sentimentHealth: sentimentHealth,
      extractedRisks: extractedRisks,
      suggestedAdvice: suggestedAdvice
    };
  },

  /**
   * Dispatches high-fidelity notification email directly to the CTO.
   */
  sendCtoNotificationEmail(internName, internEmail, updateId, tasks, challenges, blockers, sentiment, risks, advice, hasBlocker) {
    const ctoEmail = this.getCtoEmail();
    const subject = hasBlocker
      ? `🚨 [Questo Blocker Alert] ${internName} is blocked — Daily EOD (${updateId})`
      : `📋 [Questo Daily EOD] ${internName} submitted daily report (${updateId})`;

    const htmlBody = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 640px; margin: auto; background-color: #0b0f19; color: #f8fafc; border-radius: 12px; overflow: hidden; border: 1px solid #334155;">
        <div style="background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%); padding: 24px; text-align: center; border-bottom: 1px solid #4338ca;">
          <h2 style="margin: 0; color: #38bdf8; font-size: 20px;">Questo Enterprise — CTO Operations Desk</h2>
          <p style="margin: 6px 0 0 0; color: #94a3b8; font-size: 13px;">Daily Intern EOD & Blocker Intelligence Alert</p>
        </div>
        <div style="padding: 24px;">
          <div style="margin-bottom: 18px; padding: 12px 16px; background: rgba(30, 41, 59, 0.8); border-radius: 8px; border-left: 4px solid ${hasBlocker ? '#ef4444' : '#10b981'};">
            <strong style="color: #fff; font-size: 14px;">Intern:</strong> <span style="color: #38bdf8;">${internName}</span> (${internEmail})<br>
            <strong style="color: #fff; font-size: 14px;">Report ID:</strong> <code>${updateId}</code> &nbsp;|&nbsp; 
            <span style="color: ${hasBlocker ? '#ef4444' : '#10b981'}; font-weight: bold;">${hasBlocker ? '🚨 Critical Blocker Reported' : '✅ Progress on Track'}</span>
          </div>

          <h3 style="color: #93c5fd; font-size: 13px; margin: 16px 0 6px; text-transform: uppercase; letter-spacing: 0.5px;">📋 Tasks Completed Today</h3>
          <div style="background: #020617; padding: 12px; border-radius: 6px; font-size: 13px; line-height: 1.5; color: #e2e8f0; border: 1px solid #1e293b; white-space: pre-wrap;">${tasks || 'None specified'}</div>

          ${challenges ? `
          <h3 style="color: #fde047; font-size: 13px; margin: 16px 0 6px; text-transform: uppercase; letter-spacing: 0.5px;">⚡ Challenges Encountered & Overcome</h3>
          <div style="background: #020617; padding: 12px; border-radius: 6px; font-size: 13px; line-height: 1.5; color: #e2e8f0; border: 1px solid #1e293b; white-space: pre-wrap;">${challenges}</div>
          ` : ''}

          <h3 style="color: ${hasBlocker ? '#f87171' : '#94a3b8'}; font-size: 13px; margin: 16px 0 6px; text-transform: uppercase; letter-spacing: 0.5px;">🚧 Blockers Faced (Unresolved)</h3>
          <div style="background: ${hasBlocker ? 'rgba(239, 68, 68, 0.15)' : '#020617'}; padding: 12px; border-radius: 6px; font-size: 13px; line-height: 1.5; color: ${hasBlocker ? '#fca5a5' : '#94a3b8'}; border: 1px solid ${hasBlocker ? '#b91c1c' : '#1e293b'}; white-space: pre-wrap;">${blockers || 'None (Smooth progress)'}</div>

          <div style="background: rgba(99, 102, 241, 0.12); border: 1px solid rgba(99, 102, 241, 0.35); border-radius: 8px; padding: 14px; margin-top: 20px;">
            <div style="font-weight: 700; color: #a5b4fc; font-size: 13px; margin-bottom: 6px;">🧠 AI Sentinel Analysis</div>
            <div style="font-size: 12px; color: #cbd5e1; margin-bottom: 4px;"><strong>Sentiment & Health:</strong> ${sentiment}</div>
            <div style="font-size: 12px; color: #cbd5e1; margin-bottom: 4px;"><strong>Extracted Risks:</strong> ${risks}</div>
            <div style="font-size: 12px; color: #38bdf8;"><strong>CTO Action Recommendation:</strong> ${advice || 'Review in Questo Control Center.'}</div>
          </div>

          <div style="text-align: center; margin-top: 24px; padding-top: 16px; border-top: 1px solid #1e293b;">
            <p style="font-size: 12px; color: #94a3b8; margin: 0;">You can acknowledge, unblock, or schedule a 1-on-1 sync with this intern directly in the Questo Admin Control Center.</p>
          </div>
        </div>
      </div>
    `;

    try {
      MailApp.sendEmail({
        to: ctoEmail,
        subject: subject,
        htmlBody: htmlBody
      });
    } catch (e) {
      Logger.log('Could not send CTO notification email: ' + e.message);
    }
  },

  /**
   * Adds an in-memory/cache CTO notification item.
   */
  addCtoNotification(notif) {
    try {
      const props = PropertiesService.getScriptProperties();
      let notifs = [];
      const raw = props.getProperty('QUESTO_CTO_NOTIFICATIONS');
      if (raw) {
        try { notifs = JSON.parse(raw); } catch (e) { notifs = []; }
      }
      notifs.unshift(notif);
      if (notifs.length > 30) notifs = notifs.slice(0, 30);
      props.setProperty('QUESTO_CTO_NOTIFICATIONS', JSON.stringify(notifs));
    } catch (err) {
      Logger.log('Error adding CTO notification: ' + err.message);
    }
  },

  /**
   * Returns recent CTO notifications.
   */
  getCtoNotifications() {
    try {
      const props = PropertiesService.getScriptProperties();
      const raw = props.getProperty('QUESTO_CTO_NOTIFICATIONS');
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (e) { /* ignore */ }
    return [];
  },

  /**
   * Marks all CTO notifications as read.
   */
  markNotificationsRead() {
    try {
      const props = PropertiesService.getScriptProperties();
      let notifs = this.getCtoNotifications();
      notifs.forEach(n => { n.read = true; });
      props.setProperty('QUESTO_CTO_NOTIFICATIONS', JSON.stringify(notifs));
      return { status: 'success' };
    } catch (e) {
      return { status: 'error', message: e.message };
    }
  },

  /**
   * Returns recent EOD / Standup entries formatted for the CTO Admin Desk.
   */
  getRecentEodsForCto(limit = 20) {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('⏱️ Daily Standups');
    if (!sheet) return [];

    const data = sheet.getDataRange().getValues();
    if (data.length <= 1) return [];

    const results = [];
    // Read backwards from bottom (most recent first)
    for (let i = data.length - 1; i >= 1 && results.length < limit; i--) {
      const row = data[i];
      const updateId = row[0] ? row[0].toString() : '';
      const timestamp = row[1] ? (row[1] instanceof Date ? Utilities.formatDate(row[1], Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss') : row[1].toString()) : '';
      const email = row[2] ? row[2].toString() : '';
      const done = row[3] ? row[3].toString() : '';
      const planned = row[4] ? row[4].toString() : '';
      const blockers = row[5] ? row[5].toString() : 'None';
      const sentiment = row[6] ? row[6].toString() : '';
      const risks = row[7] ? row[7].toString() : '';
      const xp = row[8] ? row[8].toString() : '20';
      const reviewStatus = row[9] ? row[9].toString() : (blockers && blockers.toLowerCase() !== 'none' ? '🚨 Blocker Escalated' : 'Pending CTO Review');
      const ctoFeedback = row[10] ? row[10].toString() : '';

      const hasBlocker = blockers.length > 0 &&
        blockers.toLowerCase() !== 'none' &&
        blockers.toLowerCase() !== 'no' &&
        blockers.toLowerCase() !== 'nil' &&
        blockers.toLowerCase() !== 'n/a';

      results.push({
        updateId: updateId,
        timestamp: timestamp,
        internEmail: email,
        internName: email.split('@')[0],
        doneYesterday: done,
        plannedToday: planned,
        blockers: blockers,
        hasBlocker: hasBlocker,
        sentimentHealth: sentiment,
        extractedRisks: risks,
        xpAwarded: xp,
        reviewStatus: reviewStatus,
        ctoFeedback: ctoFeedback
      });
    }
    return results;
  },

  /**
   * CTO acknowledges and unblocks an intern EOD report.
   */
  acknowledgeEod(updateId, ctoFeedback, ctoEmail) {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('⏱️ Daily Standups');
    if (!sheet) throw new Error('Daily Standups sheet not found.');

    const data = sheet.getDataRange().getValues();
    let rowIndex = -1;
    let internEmail = '';

    for (let i = 1; i < data.length; i++) {
      if (data[i][0] && data[i][0].toString().trim() === updateId.trim()) {
        rowIndex = i + 1;
        internEmail = data[i][2] ? data[i][2].toString() : '';
        break;
      }
    }

    if (rowIndex === -1) throw new Error('EOD update ' + updateId + ' not found.');

    const reviewer = ctoEmail || this.getCtoEmail();
    const statusText = '✅ Acknowledged & Unblocked by CTO';
    sheet.getRange(rowIndex, 10).setValue(statusText); // Column J: Review Status
    if (ctoFeedback) {
      sheet.getRange(rowIndex, 11).setValue(ctoFeedback); // Column K: CTO Feedback
    }

    // Update notifications in memory/cache
    try {
      const props = PropertiesService.getScriptProperties();
      const notifs = this.getCtoNotifications();
      notifs.forEach(n => {
        if (n.updateId === updateId) {
          n.status = statusText;
          n.read = true;
        }
      });
      props.setProperty('QUESTO_CTO_NOTIFICATIONS', JSON.stringify(notifs));
    } catch (err) { /* ignore */ }

    // Email intern with CTO guidance & resolution
    if (internEmail && internEmail.includes('@')) {
      try {
        MailApp.sendEmail({
          to: internEmail,
          subject: `✅ [Questo] CTO Feedback & Resolution on your EOD (${updateId})`,
          htmlBody: `
            <div style="font-family: sans-serif; padding: 20px; background: #0b0f19; color: #f8fafc; border-radius: 8px;">
              <h3 style="color: #38bdf8;">Questo Platform — Daily Standup Resolution</h3>
              <p>Hi there,</p>
              <p>Your CTO (<strong>${reviewer}</strong>) has reviewed your Daily EOD report <code>${updateId}</code>.</p>
              <div style="background: #1e293b; padding: 14px; border-left: 4px solid #10b981; border-radius: 4px; margin: 16px 0;">
                <strong style="color: #86efac;">CTO Feedback & Next Steps:</strong><br>
                <p style="margin-top: 6px; color: #f1f5f9;">${ctoFeedback || 'Reviewed and approved! Keep pushing forward.'}</p>
              </div>
              <p style="font-size: 12px; color: #94a3b8;">Questo Automated Engineering Ops</p>
            </div>
          `
        });
      } catch (mErr) {
        Logger.log('Could not send intern acknowledgment email: ' + mErr.message);
      }
    }

    return { status: 'success', updateId: updateId, reviewer: reviewer };
  },

  /**
   * Logs a generic standup entry and triggers AI analysis.
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
      baseStandupXp,
      'Pending CTO Review',
      ''
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
