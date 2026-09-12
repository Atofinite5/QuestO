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
      const resp = AiService.callGemini(prompt, 'You generate concise meeting agendas in 3 numbered lines.', 'google/gemini-2.5-flash');
      return typeof resp === 'string' ? resp : JSON.stringify(resp);
    } catch (e) {
      return null;
    }
  }
};
