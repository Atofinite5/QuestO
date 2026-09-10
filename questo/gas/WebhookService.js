/**
 * Questo Platform - Webhook & Integration Gateway (Unified 2.0)
 * File: gas/WebhookService.js
 * 
 * Inbound REST API via doPost(e) and outbound event dispatcher to n8n.
 * Supports task lifecycle, standup logging, Google Meet scheduling,
 * leave approvals, and AI performance data analytics.
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
   * Handles inbound POST requests from n8n agents or external bots.
   */
  handleInboundPost(e) {
    try {
      if (!e || !e.postData || !e.postData.contents) {
        return ContentService.createTextOutput(JSON.stringify({
          status: 'error',
          message: 'Missing POST body'
        })).setMimeType(ContentService.MimeType.JSON);
      }

      const body = JSON.parse(e.postData.contents);

      // Verify Auth Token
      const token = body.token || (e.parameter && e.parameter.token);
      if (token !== this.getAuthToken()) {
        return ContentService.createTextOutput(JSON.stringify({
          status: 'unauthorized',
          message: 'Invalid authorization token'
        })).setMimeType(ContentService.MimeType.JSON);
      }

      const action = body.action;
      const data = body.data || {};

      switch (action) {
        case 'CREATE_TASK': {
          const taskId = TaskService.createTask(data);
          return this.jsonResponse({ status: 'success', taskId: taskId });
        }

        case 'LOG_STANDUP': {
          const updateId = StandupService.submitStandup(
            data.email, data.doneYesterday, data.plannedToday, data.blockers
          );
          return this.jsonResponse({ status: 'success', updateId: updateId });
        }

        case 'AWARD_XP': {
          const result = GamificationService.awardXp(data.email, Number(data.xp), data.reason || 'Bonus XP');
          return this.jsonResponse({ status: 'success', result: result });
        }

        case 'SCHEDULE_MEETING': {
          const meetingResult = CalendarService.scheduleMeeting(data);
          return this.jsonResponse({ status: 'success', meeting: meetingResult });
        }

        case 'SUBMIT_LEAVE': {
          const leaveId = LeaveService.submitLeave(
            data.email, data.leaveType, data.startDate, data.endDate, data.reason
          );
          return this.jsonResponse({ status: 'success', leaveId: leaveId });
        }

        case 'APPROVE_LEAVE': {
          const success = LeaveService.approveLeave(data.leaveId, data.remarks);
          return this.jsonResponse({ status: success ? 'success' : 'not_found', leaveId: data.leaveId });
        }

        case 'GENERATE_ANALYTICS': {
          AnalyticsService.generateAllAnalytics();
          return this.jsonResponse({ status: 'success', message: 'Analytics generated' });
        }

        case 'TRIGGER_WEEKLY_REPORT': {
          ReportService.generateWeeklyReport();
          return this.jsonResponse({ status: 'success', message: 'Weekly report generated' });
        }

        default:
          return this.jsonResponse({ status: 'error', message: `Unknown action: ${action}` });
      }

    } catch (err) {
      Logger.log('Inbound POST error: ' + err.message);
      return this.jsonResponse({ status: 'error', message: err.message });
    }
  },

  jsonResponse(obj) {
    return ContentService.createTextOutput(JSON.stringify(obj))
      .setMimeType(ContentService.MimeType.JSON);
  }
};

/**
 * Top-level Google Apps Script Web App Entrypoint
 */
function doPost(e) {
  return WebhookService.handleInboundPost(e);
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: 'online',
    platform: 'Questo Enterprise AI Orchestration Engine 2.0',
    timestamp: new Date().toISOString()
  })).setMimeType(ContentService.MimeType.JSON);
}
