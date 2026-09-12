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
