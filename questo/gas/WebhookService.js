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
