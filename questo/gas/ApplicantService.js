/**
 * Questo Platform - Candidate Applicant & Mailing Service (Unified 2.0)
 * File: gas/ApplicantService.js
 * 
 * Manages the Candidate Application Pipeline:
 * 1. Ingests candidate applications from Dashboard/Form into "💼 Candidate Applicants"
 * 2. Formats and organizes candidate details: Name, Email, Skills, Resume URL, Experience
 * 3. Handles CTO/Founder Selection or Rejection decisions
 * 4. Automatically triggers personalized HTML acceptance or rejection emails
 *    via GmailApp/MailApp, and dispatches an event to n8n webhook.
 */

const ApplicantService = {
  /**
   * Ingests a new job or internship applicant.
   * @param {Object} data { name, email, role, skills, resumeUrl, portfolioUrl, notes }
   * @returns {string} applicationId
   */
  submitApplication(data) {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAMES.APPLICANTS);
    if (!sheet) throw new Error('Candidate Applicants sheet not found.');

    const appId = 'APP-' + Math.floor(1000 + Math.random() * 9000);
    const nowFormatted = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss');

    const name = (data.name || 'Anonymous Applicant').trim();
    const email = (data.email || '').trim().toLowerCase();
    const role = (data.role || 'AI Engineering Intern').trim();
    const skills = Array.isArray(data.skills) ? data.skills.join(', ') : (data.skills || 'Python, LangChain');
    const resumeUrl = (data.resumeUrl || data.resume || '#').trim();
    const portfolioUrl = (data.portfolioUrl || data.portfolio || '').trim();
    const notes = (data.notes || '').trim();

    let newRow = [
      appId,
      nowFormatted,
      name,
      email,
      role,
      skills,
      resumeUrl,
      portfolioUrl,
      'New',          // Status: New | Under Review | Selected | Rejected
      'Pending',      // Decision
      Session.getActiveUser().getEmail() || 'admin@company.com',
      notes,
      ''              // Mail Sent At
    ];

    if (typeof SecurityService !== 'undefined') {
      newRow = SecurityService.sanitizeRow(newRow);
    }

    sheet.appendRow(newRow);

    // Notify leadership & n8n
    WebhookService.postToN8n('APPLICANT_RECEIVED', {
      appId, name, email, role, skills, resumeUrl, timestamp: nowFormatted
    });

    return appId;
  },

  /**
   * Processes a hiring decision (Select or Reject) and sends candidate email.
   * @param {string} appId Candidate ID (e.g. APP-1024)
   * @param {string} decision 'Selected' | 'Rejected'
   * @param {string} reviewerEmail CTO or Founder email
   * @param {string} customFeedback Optional custom note or offer details
   */
  processDecision(appId, decision, reviewerEmail, customFeedback) {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAMES.APPLICANTS);
    if (!sheet) throw new Error('Candidate Applicants sheet not found.');

    const data = sheet.getDataRange().getValues();
    let rowIndex = -1;
    let candidateData = null;

    for (let i = 1; i < data.length; i++) {
      if (data[i][0] && data[i][0].toString().trim().toUpperCase() === appId.trim().toUpperCase()) {
        rowIndex = i + 1;
        candidateData = {
          appId: data[i][0],
          appliedAt: data[i][1],
          name: data[i][2],
          email: data[i][3],
          role: data[i][4],
          skills: data[i][5],
          resumeUrl: data[i][6],
          currentStatus: data[i][8]
        };
        break;
      }
    }

    if (rowIndex === -1 || !candidateData) {
      throw new Error(`Applicant ${appId} not found.`);
    }

    const nowFormatted = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss');
    const reviewer = reviewerEmail || Session.getActiveUser().getEmail() || 'Leadership';

    // Update Status, Decision, Reviewer, and Mail Sent timestamp
    sheet.getRange(rowIndex, 9).setValue(decision);              // Status
    sheet.getRange(rowIndex, 10).setValue(decision);             // Decision
    sheet.getRange(rowIndex, 11).setValue(reviewer);             // Reviewed By
    sheet.getRange(rowIndex, 13).setValue(nowFormatted);         // Mail Sent At

    // Dispatch preferred HTML notification email to candidate
    this.sendDecisionEmail(candidateData, decision, customFeedback);

    // Notify n8n
    WebhookService.postToN8n('APPLICANT_DECISION', {
      appId,
      name: candidateData.name,
      email: candidateData.email,
      role: candidateData.role,
      decision,
      reviewer,
      timestamp: nowFormatted
    });

    return {
      status: 'success',
      appId,
      decision,
      candidateEmail: candidateData.email,
      sentAt: nowFormatted
    };
  },

  /**
   * Sends personalized candidate email based on CTO/Founder selection or rejection.
   */
  sendDecisionEmail(candidate, decision, feedback) {
    const isSelected = decision.toLowerCase() === 'selected' || decision.toLowerCase() === 'accepted';
    const subject = isSelected
      ? `🎉 Congratulations! Offer for ${candidate.role} at Questo`
      : `Update on your application for ${candidate.role} at Questo`;

    const htmlBody = isSelected
      ? this.buildAcceptanceEmail(candidate, feedback)
      : this.buildRejectionEmail(candidate, feedback);

    try {
      MailApp.sendEmail({
        to: candidate.email,
        subject: subject,
        htmlBody: htmlBody,
        name: 'Questo Talent & Engineering Team'
      });
      Logger.log(`Decision email successfully delivered to ${candidate.email}`);
    } catch (e) {
      Logger.log(`Direct MailApp send failed, attempting GmailApp: ${e.message}`);
      try {
        GmailApp.sendEmail(candidate.email, subject, '', {
          htmlBody: htmlBody,
          name: 'Questo Talent & Engineering Team'
        });
      } catch (gErr) {
        Logger.log(`Gmail dispatch error: ${gErr.message}`);
      }
    }
  },

  /**
   * Builds high-touch HTML Acceptance / Offer email
   */
  buildAcceptanceEmail(candidate, feedback) {
    return `
      <div style="font-family: 'Inter', -apple-system, sans-serif; background-color: #0f172a; color: #f8fafc; padding: 32px; border-radius: 12px; max-width: 600px; margin: auto;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="background: linear-gradient(135deg, #38bdf8 0%, #818cf8 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin: 0; font-size: 26px;">
            ⚡ Questo Enterprise
          </h1>
          <p style="color: #94a3b8; font-size: 14px; margin-top: 4px;">Engineering Leadership Team</p>
        </div>

        <div style="background: rgba(30, 41, 59, 0.7); border: 1px solid rgba(99, 102, 241, 0.3); border-radius: 8px; padding: 24px; line-height: 1.6;">
          <h2 style="color: #38bdf8; font-size: 18px; margin-top: 0;">Congratulations, ${candidate.name}! 🎉</h2>
          <p>We were thoroughly impressed by your background, your demonstrated skills in <strong>${candidate.skills}</strong>, and your passion for high-velocity software engineering.</p>
          <p>The Founder and CTO have officially approved your candidacy for the position of <strong>${candidate.role}</strong>.</p>
          
          ${feedback ? `<div style="background: rgba(59, 130, 246, 0.1); border-left: 3px solid #38bdf8; padding: 12px; margin: 16px 0; font-size: 13px; color: #cbd5e1;"><em>"${feedback}"</em></div>` : ''}

          <p style="margin-top: 16px;"><strong>Next Steps:</strong></p>
          <ul style="color: #cbd5e1; padding-left: 20px;">
            <li>Our engineering leads will provision your workspace and git access.</li>
            <li>Your customized weekly project milestones and roadmap have been prepared by our AI system.</li>
            <li>Check your inbox for a follow-up invite to your onboarding sync with the CTO.</li>
          </ul>

          <div style="text-align: center; margin: 24px 0 8px;">
            <a href="https://questo.app" style="background: linear-gradient(135deg, #2563eb, #7c3aed); color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">
              Access Questo Workspace &rarr;
            </a>
          </div>
        </div>

        <div style="text-align: center; margin-top: 24px; color: #64748b; font-size: 12px;">
          Questo Enterprise 2.0 • Autonomous Talent & Engineering Operations
        </div>
      </div>
    `;
  },

  /**
   * Builds courteous, professional HTML Rejection email
   */
  buildRejectionEmail(candidate, feedback) {
    return `
      <div style="font-family: 'Inter', -apple-system, sans-serif; background-color: #0f172a; color: #f8fafc; padding: 32px; border-radius: 12px; max-width: 600px; margin: auto;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="background: linear-gradient(135deg, #38bdf8 0%, #818cf8 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin: 0; font-size: 26px;">
            ⚡ Questo Enterprise
          </h1>
          <p style="color: #94a3b8; font-size: 14px; margin-top: 4px;">Talent & Engineering Leadership</p>
        </div>

        <div style="background: rgba(30, 41, 59, 0.7); border: 1px solid rgba(148, 163, 184, 0.2); border-radius: 8px; padding: 24px; line-height: 1.6;">
          <p>Hi ${candidate.name},</p>
          <p>Thank you for taking the time to apply for the <strong>${candidate.role}</strong> position at Questo and sharing your portfolio with our leadership team.</p>
          <p>While our engineering team was impressed with your capabilities, we have decided to move forward with other candidates whose skill sets more closely align with our immediate project requirements at this time.</p>
          
          ${feedback ? `<div style="background: rgba(148, 163, 184, 0.1); border-left: 3px solid #64748b; padding: 12px; margin: 16px 0; font-size: 13px; color: #cbd5e1;"><em>Note from reviewers: "${feedback}"</em></div>` : ''}

          <p>We will keep your resume and portfolio in our active talent directory for future engineering openings that match your profile. We wish you the very best in your career endeavors.</p>
          <p style="margin-top: 20px;">Warm regards,<br><strong>Questo Engineering & Founder Office</strong></p>
        </div>

        <div style="text-align: center; margin-top: 24px; color: #64748b; font-size: 12px;">
          Questo Enterprise 2.0 • Autonomous Talent Operations
        </div>
      </div>
    `;
  },

  /**
   * Retrieves all candidate applicants for dashboard display.
   */
  getApplicantsForDashboard() {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAMES.APPLICANTS);
    if (!sheet) return [];

    const data = sheet.getDataRange().getValues();
    const list = [];

    for (let i = 1; i < data.length; i++) {
      if (!data[i][0]) continue;
      list.push({
        appId: data[i][0],
        appliedAt: data[i][1],
        name: data[i][2],
        email: data[i][3],
        role: data[i][4],
        skills: data[i][5],
        resumeUrl: data[i][6],
        portfolioUrl: data[i][7],
        status: data[i][8],
        decision: data[i][9],
        reviewedBy: data[i][10],
        notes: data[i][11],
        mailSentAt: data[i][12]
      });
    }

    return list;
  }
};
