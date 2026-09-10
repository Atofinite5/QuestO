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

    const newRow = [
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
    let processed = 0;

    for (let i = 1; i < data.length; i++) {
      const email = data[i][2];
      const doneYesterday = data[i][3];
      const plannedToday = data[i][4];
      const blockers = data[i][5];
      const currentHealth = data[i][6];

      // Check if unanalyzed
      if (!currentHealth || currentHealth === 'Evaluating...' || currentHealth === 'Manual review pending') {
        try {
          const aiResult = AiService.analyzeStandup(doneYesterday, plannedToday, blockers, email);
          if (aiResult) {
            sheet.getRange(i + 1, 7).setValue(`${aiResult.sentimentScore}/10 - ${aiResult.sentimentSummary}`);
            sheet.getRange(i + 1, 8).setValue(aiResult.extractedRisks || 'None');
            processed++;
          }
        } catch (err) {
          Logger.log(`Failed to process standup row ${i + 1}: ${err.message}`);
        }
      }
    }

    SpreadsheetApp.getActive().toast(`Processed ${processed} standup entries with AI.`, 'Standup AI Analysis', 5);
  }
};
