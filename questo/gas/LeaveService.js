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
