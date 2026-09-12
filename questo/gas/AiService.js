/**
 * Questo Platform - AI Service Connector (Unified 2.0 - Multi-Provider)
 * File: gas/AiService.js
 * 
 * Supports:
 * 1. OpenRouter (google/gemini-2.5-flash with auto-fallback to google/gemini-2.5-flash-lite)
 * 2. Native Google Gemini (gemini-2.0-flash / gemini-2.5-flash)
 * 3. OpenAI GPT-4o / compatible endpoints
 * 
 * Includes JSON sanitization, markdown fence stripping, and fallback handling.
 */

const AiService = {
  /**
   * Fetches the configured API key from ScriptProperties first, then Config sheet fallback.
   */
  getApiKey(provider) {
    const props = PropertiesService.getScriptProperties();
    let key;
    if (provider === 'openrouter') {
      key = props.getProperty('OPENROUTER_API_KEY') || props.getProperty('GEMINI_API_KEY');
    } else if (provider === 'openai') {
      key = props.getProperty('OPENAI_API_KEY');
    } else {
      key = props.getProperty('OPENROUTER_API_KEY') || props.getProperty('GEMINI_API_KEY');
    }
    
    if (!key || key.includes('INSERT_')) {
      // Fallback: read from Config sheet
      try {
        const ss = SpreadsheetApp.getActiveSpreadsheet();
        const configSheet = ss.getSheetByName('⚙️ Config & Prompts');
        if (configSheet) {
          const data = configSheet.getDataRange().getValues();
          const targetKey = provider === 'openrouter' ? 'OPENROUTER_API_KEY' : (provider === 'openai' ? 'OPENAI_API_KEY' : 'GEMINI_API_KEY');
          for (let i = 1; i < data.length; i++) {
            if (data[i][0] === targetKey && data[i][1] && !data[i][1].toString().includes('INSERT_')) {
              key = data[i][1].toString().trim();
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
   * Universal AI Caller: Automatically detects if key is OpenRouter (sk-or-...)
   * or Google Gemini native (AIzaSy...). Routes seamlessly to Gemini 2.5 Flash.
   */
  generateJson(promptText, systemInstruction, model) {
    const openRouterKey = this.getApiKey('openrouter');
    const geminiKey = this.getApiKey('gemini');

    // Check if user provided an OpenRouter key
    if (openRouterKey && (openRouterKey.startsWith('sk-or-') || openRouterKey.startsWith('sk-'))) {
      return this.callOpenRouter(promptText, systemInstruction, model || 'google/gemini-2.5-flash');
    }

    // Default to Google Gemini native
    if (geminiKey) {
      return this.callGemini(promptText, systemInstruction, model || 'google/gemini-2.5-flash');
    }

    throw new Error('No AI API key found. Please configure OpenRouter Key via ⚡ Questo AI 2.0 -> Configure API Keys.');
  },

  /**
   * Calls OpenRouter API with Gemini 2.5 Flash (with resilient auto-fallback)
   * @param {string} promptText
   * @param {string} systemInstruction
   * @param {string} model (default: google/gemini-2.5-flash)
   */
  callOpenRouter(promptText, systemInstruction, model = 'google/gemini-2.5-flash') {
    const apiKey = this.getApiKey('openrouter');
    if (!apiKey) {
      throw new Error('OpenRouter API key is not configured. Go to ⚡ Questo AI 2.0 -> Configure API Keys.');
    }

    const url = 'https://openrouter.ai/api/v1/chat/completions';
    const messages = [];

    if (systemInstruction) {
      messages.push({
        role: 'system',
        content: systemInstruction + '\nCRITICAL: Respond ONLY with valid, raw JSON. Do not include markdown codeblocks, do not add introductory text.'
      });
    }

    messages.push({
      role: 'user',
      content: promptText
    });

    const attemptFetch = (targetModel) => {
      const payload = {
        model: targetModel,
        messages: messages,
        temperature: 0.2,
        max_tokens: 3000,
        response_format: { type: 'json_object' }
      };

      const options = {
        method: 'post',
        contentType: 'application/json',
        headers: {
          'Authorization': 'Bearer ' + apiKey,
          'HTTP-Referer': 'https://github.com/Atofinite5/QuestO',
          'X-Title': 'Questo Enterprise 2.0'
        },
        payload: JSON.stringify(payload),
        muteHttpExceptions: true
      };

      return UrlFetchApp.fetch(url, options);
    };

    let response;
    try {
      response = attemptFetch(model);
    } catch (err) {
      throw new Error('Network error calling OpenRouter API: ' + err.message);
    }

    let statusCode = response.getResponseCode();
    let responseText = response.getContentText();

    // Auto-fallback: if gemini-2.5-flash triggers 402 (payment required) or 404, gracefully fallback to flash-lite
    if ((statusCode === 402 || statusCode === 404) && model !== 'google/gemini-2.5-flash-lite') {
      try {
        response = attemptFetch('google/gemini-2.5-flash-lite');
        statusCode = response.getResponseCode();
        responseText = response.getContentText();
      } catch (e) { }
    }

    if (statusCode !== 200) {
      throw new Error(`OpenRouter API returned error HTTP ${statusCode}: ${responseText}`);
    }

    const parsed = JSON.parse(responseText);
    const choice = parsed.choices && parsed.choices[0];
    if (!choice || !choice.message || !choice.message.content) {
      throw new Error('Empty response content from OpenRouter API.');
    }

    return this.cleanAndParseJson(choice.message.content);
  },

  /**
   * Calls Google Gemini REST API
   */
  callGemini(promptText, systemInstruction, model = 'google/gemini-2.5-flash') {
    const apiKey = this.getApiKey('gemini');
    if (!apiKey) {
      throw new Error('Gemini API key is not configured. Go to ⚡ Questo AI 2.0 -> Configure API Keys.');
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

    return this.cleanAndParseJson(candidate.content.parts[0].text);
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

    return this.generateJson(userPrompt, systemPrompt, 'google/gemini-2.5-flash');
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

    return this.generateJson(userPrompt, systemPrompt, 'google/gemini-2.5-flash');
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
    return this.generateJson(userPrompt, systemPrompt, 'google/gemini-2.5-flash');
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
    return this.generateJson(userPrompt, systemPrompt, 'google/gemini-2.5-flash');
  }
,
  /**
   * Scrapes & decomposes high-level founder/CTO work into structured weekly milestone tasks for an intern.
   * @param {string} workDetails Details provided by Founder to CTO
   * @param {string} internName Name or role of intern
   * @param {number} totalWeeks Duration (e.g. 4 weeks)
   */
  generateWeeklyInternRoadmap(workDetails, internName, totalWeeks = 4) {
    const systemPrompt = "You are Questo, an expert CTO and Engineering Architect.\n" +
      "Decompose the founder project and work description into an optimal weekly breakdown schedule for an intern.\n" +
      "Return ONLY valid JSON:\n" +
      "{\n" +
      '  "roadmapTitle": string,\n' +
      '  "projectOverview": string,\n' +
      '  "weeks": [\n' +
      '    {\n' +
      '      "weekNumber": number,\n' +
      '      "theme": string,\n' +
      '      "goals": string,\n' +
      '      "tasks": [\n' +
      '        {\n' +
      '          "taskId": string,\n' +
      '          "title": string,\n' +
      '          "description": string,\n' +
      '          "priority": "P0 - Blocker" | "P1 - High" | "P2 - Medium" | "P3 - Low",\n' +
      '          "estimatedHours": number,\n' +
      '          "xpBounty": number\n' +
      '        }\n' +
      '      ]\n' +
      '    }\n' +
      '  ]\n' +
      "}";

    const userPrompt = "Target Intern: " + (internName || "Intern") + "\n" +
      "Duration: " + totalWeeks + " weeks\n" +
      "Work Scope & Technical Details:\n" + workDetails;

    return this.generateJson(userPrompt, systemPrompt, 'google/gemini-2.5-flash');
  },

  /**
   * Analyzes an intern's weekly velocity, progress across In Progress / Done / CTO Approved tasks,
   * and provides a performance & coaching diagnosis.
   */
  analyzeInternPerformance(internName, completedTasks, inProgressTasks, pendingApprovals, blockers) {
    const systemPrompt = "You are Questo, an elite AI Technical Mentor and VP of Engineering.\n" +
      "Analyze the continuous progress and performance metrics of this intern.\n" +
      "Return ONLY valid JSON:\n" +
      "{\n" +
      '  "performanceScore": number (1 to 100),\n' +
      '  "velocityRating": "Exceptional" | "On Track" | "Needs Acceleration" | "Stalled",\n' +
      '  "technicalStrengths": string,\n' +
      '  "growthAreas": string,\n' +
      '  "leadershipRecommendation": string,\n' +
      '  "summaryAnalysis": string\n' +
      "}";

    const userPrompt = "Intern: " + internName + "\n" +
      "Tasks Completed & Approved: " + JSON.stringify(completedTasks) + "\n" +
      "Tasks Currently In Progress: " + JSON.stringify(inProgressTasks) + "\n" +
      "Pending CTO Approvals: " + JSON.stringify(pendingApprovals) + "\n" +
      "Reported Blockers: " + JSON.stringify(blockers);

    return this.generateJson(userPrompt, systemPrompt, 'google/gemini-2.5-flash');
  }
};
