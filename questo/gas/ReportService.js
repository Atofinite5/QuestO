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
