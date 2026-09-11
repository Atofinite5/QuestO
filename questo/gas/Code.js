function menuConfigureSettings() {
  const ui = SpreadsheetApp.getUi();
  const prompt1 = ui.prompt(
    'Configure OpenRouter / Gemini API Key',
    'Enter your OpenRouter API Key (sk-or-...) or Google Gemini Key:\n(We use OpenRouter with google/gemini-flash-1.5)',
    ui.ButtonSet.OK_CANCEL
  );
  if (prompt1.getSelectedButton() === ui.Button.OK) {
    const key = prompt1.getResponseText().trim();
    if (key) {
      PropertiesService.getScriptProperties().setProperty('OPENROUTER_API_KEY', key);
      PropertiesService.getScriptProperties().setProperty('GEMINI_API_KEY', key);
      ui.alert('API Key Saved', 'OpenRouter Gemini 1.5 Flash key saved securely into Script Properties!', ui.ButtonSet.OK);
    }
  }

  const prompt2 = ui.prompt('Configure n8n Webhook URL', 'Enter the n8n Webhook URL to receive Questo events (optional):', ui.ButtonSet.OK_CANCEL);
  if (prompt2.getSelectedButton() === ui.Button.OK) {
    const url = prompt2.getResponseText().trim();
    if (url) {
      PropertiesService.getScriptProperties().setProperty('N8N_WEBHOOK_URL', url);
      ui.alert('n8n Webhook URL saved successfully!');
    }
  }
}

function menuShowAbout() {
  const ui = SpreadsheetApp.getUi();
  const message = `Questo Enterprise v2.0
AI-Powered Company Operations, Meeting Orchestrator & Gamified Performance Engine.

AI Provider: OpenRouter (google/gemini-flash-1.5)

Features:
• Full Pipeline: CEO -> CTO -> Leads -> Interns / Students
• Automated Meetings: Auto-provisions Google Meet links & AI blocker agendas
• Leave & PTO Engine: Streak-freezing protection & task auto-rescheduling
• AI Performance Analytics: Delivery reliability %, burnout warnings, 1-on-1 cards
• Gamification: RPG-style XP, Leveling curve, Badges, and Streaks`;

  ui.alert('About Questo Enterprise 2.0', message, ui.ButtonSet.OK);
}
