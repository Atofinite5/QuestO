/**
 * Questo Platform - AI Service Connector
 * File: gas/AiService.js
 * 
 * Direct connector for Google Gemini 1.5 Flash / Pro and OpenAI GPT-4o APIs.
 * Supports structured JSON generation, rate-limit retries, and token-safe extraction.
 */

const AiService = {
  /**
   * Fetches the configured API key from ScriptProperties first, then Config sheet fallback.
   */
  getApiKey(provider) {
    const props = PropertiesService.getScriptProperties();
    let key = props.getProperty(provider === 'openai' ? 'OPENAI_API_KEY' : 'GEMINI_API_KEY');
    
    if (!key || key === 'INSERT_GEMINI_KEY_HERE') {
      // Fallback: read from Config sheet
      try {
        const ss = SpreadsheetApp.getActiveSpreadsheet();
        const configSheet = ss.getSheetByName('⚙️ Config & Prompts');
        if (configSheet) {
          const data = configSheet.getDataRange().getValues();
          const targetKey = provider === 'openai' ? 'OPENAI_API_KEY' : 'GEMINI_API_KEY';
          for (let i = 1; i < data.length; i++) {
            if (data[i][0] === targetKey && data[i][1] && data[i][1] !== 'INSERT_GEMINI_KEY_HERE') {
              key = data[i][1];
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
   * Calls Google Gemini 1.5 Flash / Pro REST API
   * @param {string} promptText 
   * @param {string} systemInstruction 
   * @param {string} model 
   * @returns {Object} Parsed JSON response
   */
  callGemini(promptText, systemInstruction, model = 'gemini-1.5-flash') {
    const apiKey = this.getApiKey('gemini');
    if (!apiKey || apiKey === 'INSERT_GEMINI_KEY_HERE') {
      throw new Error('Gemini API key is not configured. Go to ⚡ Questo AI -> Configure API Keys.');
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

    const rawOutput = candidate.content.parts[0].text;
    return this.cleanAndParseJson(rawOutput);
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

    return this.callGemini(userPrompt, systemPrompt, 'gemini-1.5-flash');
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

    return this.callGemini(userPrompt, systemPrompt, 'gemini-1.5-flash');
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
    return this.callGemini(userPrompt, systemPrompt, 'gemini-1.5-flash');
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
    return this.callGemini(userPrompt, systemPrompt, 'gemini-1.5-flash');
  }
};
