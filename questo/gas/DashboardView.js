/**
 * Questo Enterprise 2.0 — Standalone Web App Frontend HTML Generator
 * File: gas/DashboardView.js
 */

function getStandaloneDashboardHtml() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Questo Enterprise 2.0 — Control Center</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #090d16;
      --card-bg: rgba(26, 34, 52, 0.7);
      --border: rgba(99, 102, 241, 0.2);
      --primary: #6366f1;
      --accent: #38bdf8;
      --success: #10b981;
      --warning: #f59e0b;
      --danger: #ef4444;
      --text: #f8fafc;
      --text-muted: #94a3b8;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Inter', sans-serif;
      background: linear-gradient(135deg, #090d16 0%, #0f172a 50%, #0b0f19 100%);
      color: var(--text);
      min-height: 100vh;
      padding: 24px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .container {
      width: 100%;
      max-width: 1280px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: rgba(15, 23, 42, 0.85);
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 18px 24px;
      margin-bottom: 24px;
      backdrop-filter: blur(12px);
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 0 20px rgba(99, 102, 241, 0.15);
    }
    .logo-group {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .logo-badge {
      background: linear-gradient(135deg, #38bdf8, #6366f1);
      width: 42px;
      height: 42px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 20px;
      color: white;
      box-shadow: 0 0 15px rgba(99, 102, 241, 0.5);
    }
    .title {
      font-size: 20px;
      font-weight: 700;
      background: linear-gradient(135deg, #38bdf8 0%, #818cf8 50%, #c084fc 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .subtitle {
      font-size: 12px;
      color: var(--text-muted);
    }
    .nav-tabs {
      display: flex;
      gap: 8px;
      margin-bottom: 20px;
      flex-wrap: wrap;
    }
    .nav-tab {
      background: rgba(30, 41, 59, 0.6);
      border: 1px solid var(--border);
      color: var(--text-muted);
      padding: 10px 18px;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      font-size: 13px;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .nav-tab.active, .nav-tab:hover {
      background: rgba(99, 102, 241, 0.2);
      border-color: #818cf8;
      color: #fff;
    }
    .tab-content {
      display: none;
    }
    .tab-content.active {
      display: block;
    }
    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }
    @media (max-width: 900px) {
      .grid-2 { grid-template-columns: 1fr; }
    }
    .card {
      background: rgba(15, 23, 42, 0.75);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 20px;
      backdrop-filter: blur(10px);
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
      margin-bottom: 20px;
    }
    .card-title {
      font-size: 15px;
      font-weight: 700;
      color: #38bdf8;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .btn {
      padding: 9px 16px;
      border-radius: 8px;
      border: none;
      font-weight: 600;
      cursor: pointer;
      font-size: 13px;
      transition: all 0.2s;
    }
    .btn-primary { background: linear-gradient(135deg, #6366f1, #3b82f6); color: white; }
    .btn-select { background: #16a34a; color: white; margin-right: 6px; }
    .btn-reject { background: #dc2626; color: white; }
    .btn-ai { background: linear-gradient(135deg, #8b5cf6, #3b82f6); color: white; }
    .btn-warn { background: linear-gradient(135deg, #f59e0b, #d97706); color: white; }
    input, textarea, select {
      width: 100%;
      background: #0b0f19;
      border: 1px solid #334155;
      color: #fff;
      padding: 10px 12px;
      border-radius: 8px;
      font-size: 13px;
      margin: 6px 0 14px;
      box-sizing: border-box;
      font-family: inherit;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
    }
    th {
      background: #1e293b;
      padding: 10px;
      text-align: left;
      font-size: 12px;
      color: #94a3b8;
      border-bottom: 1px solid #334155;
    }
    td {
      padding: 12px 10px;
      font-size: 13px;
      border-bottom: 1px solid rgba(255,255,255,0.06);
      vertical-align: top;
    }
    .badge {
      padding: 4px 10px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 600;
      display: inline-block;
    }
    .badge-selected { background: #14532d; color: #86efac; }
    .badge-rejected { background: #7f1d1d; color: #fca5a5; }
    .badge-pending { background: #1e3a8a; color: #93c5fd; }
    .badge-blocked { background: rgba(239, 68, 68, 0.2); color: #f87171; border: 1px solid #ef4444; }
    .badge-clean { background: rgba(16, 185, 129, 0.2); color: #34d399; border: 1px solid #10b981; }
    .badge-reviewed { background: rgba(59, 130, 246, 0.2); color: #60a5fa; border: 1px solid #3b82f6; }
    
    .alert-banner {
      background: rgba(239, 68, 68, 0.15);
      border: 1px solid #ef4444;
      border-radius: 10px;
      padding: 12px 18px;
      margin-bottom: 18px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      animation: pulseGlow 2.5s infinite;
    }
    @keyframes pulseGlow {
      0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
      70% { box-shadow: 0 0 0 8px rgba(239, 68, 68, 0); }
      100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
    }
    .filter-btn {
      padding: 5px 12px;
      border-radius: 6px;
      border: 1px solid #334155;
      background: #0f172a;
      color: #94a3b8;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }
    .filter-btn.active, .filter-btn:hover {
      background: #6366f1;
      color: #fff;
      border-color: #818cf8;
    }
    .preview-box {
      background: #020617;
      border: 1px solid #1e293b;
      border-radius: 8px;
      padding: 14px;
      font-family: monospace;
      font-size: 12px;
      color: #a5f3fc;
      max-height: 260px;
      overflow-y: auto;
      white-space: pre-wrap;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo-group">
        <div class="logo-badge">Q</div>
        <div>
          <div class="title">Questo Enterprise 2.0</div>
          <div class="subtitle">Autonomous Leadership & Engineering Operations Control Center</div>
        </div>
      </div>
      <div style="display:flex; align-items:center; gap:12px;">
        <!-- CTO Alert Bell Indicator -->
        <div id="ctoNotifBell" onclick="switchTab('eod')" title="Click to view CTO Blocker & EOD Desk" style="cursor:pointer; background:rgba(30,41,59,0.85); border:1px solid var(--border); padding:8px 14px; border-radius:10px; display:flex; align-items:center; gap:8px; transition:all 0.2s;">
          <span style="font-size:13px; font-weight:600; color:#f8fafc;">🔔 CTO Alerts</span>
          <span id="ctoNotifBadge" style="background:#ef4444; color:white; font-size:11px; font-weight:700; padding:2px 7px; border-radius:10px; display:none;">0</span>
        </div>
        <span style="font-size:12px; color:#10b981; background:rgba(16,185,129,0.1); padding:6px 12px; border-radius:20px; border:1px solid rgba(16,185,129,0.3);">
          🟢 Gemini 2.5 Flash Online
        </span>
      </div>
    </div>

    <!-- Nav Tabs -->
    <div class="nav-tabs">
      <button class="nav-tab active" onclick="switchTab('applicants')">💼 Applicant & Talent Pipeline</button>
      <button class="nav-tab" onclick="switchTab('interns')">🎓 Founder &rarr; CTO Roadmap & Approvals</button>
      <button class="nav-tab" onclick="switchTab('eod')">
        📋 Intern Daily EOD & Blocker Desk
        <span id="navEodBadge" style="background:#ef4444; color:white; font-size:10px; font-weight:700; padding:1px 6px; border-radius:8px; display:none;">0</span>
      </button>
      <button class="nav-tab" onclick="switchTab('meetings')">📅 Instant Meeting Scheduler</button>
      <button class="nav-tab" onclick="switchTab('analytics')">📈 Performance Coaching & AI</button>
    </div>

    <!-- Tab 1: Applicant Pipeline -->
    <div id="tab-applicants" class="tab-content active">
      <div class="grid-2">
        <div class="card">
          <div class="card-title">➕ Ingest Candidate Application</div>
          <label>Full Name:</label>
          <input type="text" id="cName" placeholder="e.g. Aarav Patel">
          <label>Email Address:</label>
          <input type="email" id="cEmail" placeholder="candidate@gmail.com">
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
            <div>
              <label>Role:</label>
              <input type="text" id="cRole" value="AI Engineering Intern">
            </div>
            <div>
              <label>Skills:</label>
              <input type="text" id="cSkills" value="Python, PyTorch, LangChain, n8n">
            </div>
          </div>
          <label>Resume Drive Link:</label>
          <input type="text" id="cResume" value="https://drive.google.com/sample_resume">
          <button class="btn btn-primary" onclick="submitCandidate()">Submit Candidate Application</button>
        </div>

        <div class="card">
          <div class="card-title">⚡ CTO / Founder Fast-Track Decision</div>
          <label>Selected Application ID:</label>
          <input type="text" id="targetAppId" placeholder="Click 'Select' or 'Reject' from table below">
          <label>Personalized Feedback / Note to Candidate:</label>
          <textarea id="decFeedback" rows="3" placeholder="Add specific mentorship notes or interview impression..."></textarea>
          <div style="display:flex; gap:10px;">
            <button class="btn btn-select" style="flex:1;" onclick="decideCandidate('Selected')">✅ Select & Send Offer Email</button>
            <button class="btn btn-reject" style="flex:1;" onclick="decideCandidate('Rejected')">❌ Reject & Send Courteous Email</button>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-title" style="display:flex; justify-content:space-between;">
          <span>📋 Active Talent Pipeline & Review Queue</span>
          <button class="btn btn-primary" style="padding:4px 10px; font-size:11px;" onclick="fetchApplicants()">🔄 Refresh Queue</button>
        </div>
        <div id="appLoader" style="display:none; color:#38bdf8; font-size:12px; margin-bottom:10px;">Loading candidate roster...</div>
        <div style="overflow-x:auto;">
          <table>
            <thead>
              <tr>
                <th>App ID</th>
                <th>Candidate</th>
                <th>Email</th>
                <th>Target Role</th>
                <th>Skills</th>
                <th>Decision</th>
                <th>Review Action</th>
              </tr>
            </thead>
            <tbody id="applicantBody">
              <tr><td colspan="7" style="text-align:center; color:#64748b;">Loading candidate roster...</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Tab 2: Intern Roadmap & Work Decomposition -->
    <div id="tab-interns" class="tab-content">
      <div class="card">
        <div class="card-title">🤖 Founder &rarr; CTO Gemini 2.5 Flash Work Scraper & Decomposer</div>
        <p style="font-size:12px; color:var(--text-muted); margin-bottom:12px;">
          Describe raw founder instructions or high-level project specs. Gemini decomposes it into a 4-week structured milestone roadmap.
        </p>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
          <div>
            <label>Intern Full Name:</label>
            <input type="text" id="intName" value="Rohan Sharma">
          </div>
          <div>
            <label>Intern Email:</label>
            <input type="email" id="intEmail" value="rohan.intern@company.com">
          </div>
        </div>
        <label>Founder / CTO High-Level Work Details:</label>
        <textarea id="intWork" rows="4">Build end-to-end multi-agent evaluation framework with LangChain and n8n. Benchmarks against GPT-4o and Claude 3.5 Sonnet. Week 1 local harness, Week 2 evaluation dataset, Week 3 live scoring dashboard, Week 4 production deployment on GCP.</textarea>
        <button class="btn btn-ai" onclick="generateInternRoadmap()">⚡ Generate 4-Week Milestone Roadmap (Gemini 2.5)</button>
        <span id="aiWait" style="display:none; font-size:12px; color:#a5b4fc; margin-left:10px;">🧠 Generating structured roadmap...</span>

        <div id="roadmapBox" style="display:none; margin-top:16px;">
          <div class="preview-box" id="roadmapJson"></div>
          <div style="display:flex; gap:10px; margin-top:12px;">
            <button class="btn btn-select" onclick="acceptInternRoadmap()">✅ Accept & Provision Dedicated Sheet</button>
            <button class="btn btn-warn" onclick="undoInternRoadmap()">↩️ Undo to Previous Draft</button>
            <button class="btn btn-reject" onclick="rejectInternRoadmap()">🗑️ Discard Draft</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Tab 3: Daily EOD & CTO Blocker Desk -->
    <div id="tab-eod" class="tab-content">
      <!-- Live Blocker Alert Callout (Shown when an intern is blocked) -->
      <div id="blockerBanner" class="alert-banner" style="display:none;">
        <div style="display:flex; align-items:center; gap:10px;">
          <span style="font-size:20px;">🚨</span>
          <div>
            <strong style="color:#fca5a5; font-size:14px;" id="blockerBannerTitle">CRITICAL BLOCKER REPORTED</strong>
            <div style="color:#fecaca; font-size:12px;" id="blockerBannerDesc">An intern has reported an active dependency blocker.</div>
          </div>
        </div>
        <button class="btn btn-reject" style="font-size:12px; padding:6px 14px;" onclick="scrollToEodTable()">Review & Resolve</button>
      </div>

      <div class="grid-2">
        <!-- Intern Daily EOD Submission Form -->
        <div class="card">
          <div class="card-title">📝 Intern Daily EOD Submission Portal</div>
          <p style="font-size:12px; color:var(--text-muted); margin-bottom:12px;">
            Submit daily accomplishments, resolved obstacles, and active blockers. Instantly reviewed by AI and notified to the CTO.
          </p>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
            <div>
              <label>Intern Name:</label>
              <input type="text" id="eodName" value="Rohan Sharma">
            </div>
            <div>
              <label>Intern Email:</label>
              <input type="email" id="eodEmail" value="rohan.intern@company.com">
            </div>
          </div>

          <label>📋 Tasks Completed Today:</label>
          <textarea id="eodTasks" rows="3" placeholder="• Finalized client proposal ahead of deadline&#10;• Implemented image preloader fallback on Cloudflare tunnel"></textarea>

          <label>⚡ Challenges Encountered & How You Overcame Them:</label>
          <textarea id="eodChallenges" rows="2" placeholder="Faced permission issue accessing critical dataset. Resolved by coordinating with IT team."></textarea>

          <label>🚧 Blockers Faced (Challenges you couldn't overcome):</label>
          <textarea id="eodBlockers" rows="2" placeholder="Leave empty or 'None' if on track, or specify: e.g. Dependencies on another team's deliverables causing delay."></textarea>

          <label>🎯 Tomorrow's Planned Objectives:</label>
          <textarea id="eodTomorrow" rows="2" placeholder="• Run precision-recall eval benchmarks&#10;• Prepare demo for CTO weekly sync"></textarea>

          <button class="btn btn-primary" id="btnSubmitEod" onclick="submitInternEodForm()">
            🚀 Submit Daily EOD & Alert CTO (+20 XP)
          </button>
          <span id="eodSubmitSpinner" style="display:none; font-size:12px; color:#38bdf8; margin-left:8px;">Submitting & running AI sentinel...</span>

          <div id="eodFeedbackBox" style="display:none; margin-top:14px;" class="preview-box"></div>
        </div>

        <!-- CTO Quick Resolution & Feedback Panel -->
        <div class="card">
          <div class="card-title">🛡️ CTO Triage & Unblocking Action Panel</div>
          <p style="font-size:12px; color:var(--text-muted); margin-bottom:12px;">
            Select an intern report from the table below to review details, send guidance, or schedule a 1-on-1 sync.
          </p>
          <label>Selected Report ID & Intern:</label>
          <input type="text" id="ctoSelectedId" readonly placeholder="Click 'Review' on any row in the feed below" style="background:#1e293b; color:#93c5fd;">

          <div id="ctoDetailView" style="display:none; background:#020617; border:1px solid #1e293b; border-radius:8px; padding:12px; margin-bottom:14px;">
            <div style="font-size:12px; color:#94a3b8; margin-bottom:4px;"><strong>Reported Blockers:</strong></div>
            <div id="ctoDetailBlocker" style="font-size:13px; color:#fca5a5; margin-bottom:8px; font-weight:600;">None</div>

            <div style="font-size:12px; color:#94a3b8; margin-bottom:4px;"><strong>AI Sentinel Assessment:</strong></div>
            <div id="ctoDetailAi" style="font-size:12px; color:#a5f3fc; line-height:1.4; margin-bottom:10px;"></div>
          </div>

          <label>CTO Feedback / Resolution Guidance:</label>
          <textarea id="ctoFeedbackText" rows="3" placeholder="Provide architectural advice, unblocking contact, or acknowledgment for the intern..."></textarea>

          <div style="display:flex; gap:10px;">
            <button class="btn btn-select" style="flex:1;" onclick="acknowledgeSelectedEod()">
              ✅ Acknowledge & Send Guidance
            </button>
            <button class="btn btn-ai" style="flex:1;" onclick="scheduleSyncFromEod()">
              📅 Schedule 1-on-1 Sync
            </button>
          </div>
        </div>
      </div>

      <!-- Live CTO EOD Table -->
      <div class="card" id="eodTableSection">
        <div class="card-title" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
          <div style="display:flex; align-items:center; gap:8px;">
            <span>🔔 CTO Live Daily EOD & Standup Feed</span>
            <span id="eodCounterBadge" class="badge badge-pending">0 reports</span>
          </div>
          <div style="display:flex; gap:8px; align-items:center;">
            <button class="filter-btn active" onclick="setEodFilter('all', this)">All Reports</button>
            <button class="filter-btn" onclick="setEodFilter('blockers', this)">🚨 Blockers Only</button>
            <button class="filter-btn" onclick="setEodFilter('pending', this)">Pending Review</button>
            <button class="btn btn-primary" style="padding:4px 10px; font-size:11px;" onclick="fetchRecentEods()">🔄 Refresh Feed</button>
          </div>
        </div>

        <div id="eodLoader" style="display:none; color:#38bdf8; font-size:12px; margin-bottom:10px;">Refreshing live EOD feed...</div>
        
        <div style="overflow-x:auto;">
          <table>
            <thead>
              <tr>
                <th>ID & Time</th>
                <th>Intern</th>
                <th>Tasks Completed</th>
                <th>Blockers & Challenges</th>
                <th>AI Sentiment & Risk</th>
                <th>CTO Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody id="eodTableBody">
              <tr><td colspan="7" style="text-align:center; color:#64748b;">Loading Daily EOD updates...</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Tab 4: Meeting Scheduler -->
    <div id="tab-meetings" class="tab-content">
      <div class="card">
        <div class="card-title">📅 Instant Google Meet Scheduler & Direct Email Dispatcher</div>
        <p style="font-size:12px; color:var(--text-muted); margin-bottom:12px;">
          Automatically generates a native Google Meet link, populates pre-meeting agenda, and sends invites to participants.
        </p>
        <label>Meeting Title:</label>
        <input type="text" id="mTitle" value="1-on-1 CTO Mentorship & Blocker Resolution">
        <label>Attendee Email(s) (comma-separated):</label>
        <input type="text" id="mAttendees" value="rohan.intern@company.com">
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
          <div>
            <label>Meeting Type:</label>
            <select id="mType">
              <option value="1-on-1 Mentorship">1-on-1 Mentorship Sync</option>
              <option value="Incident Triage">P0/P1 Blocker Incident Triage</option>
              <option value="Architecture Review">Architecture Review</option>
              <option value="Sprint Planning">Sprint & Milestone Planning</option>
            </select>
          </div>
          <div>
            <label>Duration (Minutes):</label>
            <input type="number" id="mDuration" value="30">
          </div>
        </div>
        <button class="btn btn-primary" onclick="scheduleMeet()">📅 Schedule Google Meet & Send Invites</button>
        <div id="meetResult" style="display:none; margin-top:14px;" class="preview-box"></div>
      </div>
    </div>

    <!-- Tab 5: Performance Analytics -->
    <div id="tab-analytics" class="tab-content">
      <div class="card">
        <div class="card-title">📈 Continuous AI Performance & Coaching Evaluation</div>
        <label>Target Intern Sheet Tab:</label>
        <input type="text" id="analysisSheet" value="🎓 Intern - Rohan Sharma">
        <button class="btn btn-ai" onclick="analyzeIntern()">📊 Run AI Performance Evaluation</button>
        <div id="analysisResult" style="display:none; margin-top:14px;" class="preview-box"></div>
      </div>
    </div>

  </div>

  <script>
    var currentRoadmap = null;
    var rawEodList = [];
    var currentEodFilter = 'all';
    var selectedEodItem = null;

    function switchTab(tabName) {
      document.querySelectorAll('.nav-tab').forEach(function(t) { t.classList.remove('active'); });
      document.querySelectorAll('.tab-content').forEach(function(c) { c.classList.remove('active'); });
      
      var targetContent = document.getElementById('tab-' + tabName);
      if (targetContent) targetContent.classList.add('active');

      // Highlight active button
      document.querySelectorAll('.nav-tab').forEach(function(t) {
        if (t.getAttribute('onclick') && t.getAttribute('onclick').indexOf(tabName) !== -1) {
          t.classList.add('active');
        }
      });

      if (tabName === 'applicants') fetchApplicants();
      if (tabName === 'eod') {
        fetchRecentEods();
        fetchCtoNotifications();
      }
    }

    // --- Applicant Pipeline Functions ---
    function fetchApplicants() {
      document.getElementById('appLoader').style.display = 'block';
      google.script.run
        .withSuccessHandler(function(list) {
          document.getElementById('appLoader').style.display = 'none';
          var tbody = document.getElementById('applicantBody');
          tbody.innerHTML = '';
          if (!list || list.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; color:#64748b;">No candidates found in sheet.</td></tr>';
            return;
          }
          list.forEach(function(c) {
            var tr = document.createElement('tr');
            var badgeClass = 'badge-pending';
            if (c.decision === 'Selected') badgeClass = 'badge-selected';
            if (c.decision === 'Rejected') badgeClass = 'badge-rejected';

            tr.innerHTML = '<td><strong>' + c.appId + '</strong></td>' +
              '<td>' + c.name + '</td>' +
              '<td>' + c.email + '</td>' +
              '<td>' + c.role + '</td>' +
              '<td>' + (c.skills || '') + '</td>' +
              '<td><span class="badge ' + badgeClass + '">' + (c.decision || 'Pending') + '</span></td>' +
              '<td>' +
                '<button class="btn btn-select" style="padding:4px 8px; font-size:11px;" onclick="quickDecide(\\'' + c.appId + '\\', \\'Selected\\')">Select</button>' +
                '<button class="btn btn-reject" style="padding:4px 8px; font-size:11px;" onclick="quickDecide(\\'' + c.appId + '\\', \\'Rejected\\')">Reject</button>' +
              '</td>';
            tbody.appendChild(tr);
          });
        })
        .withFailureHandler(function(e) {
          document.getElementById('appLoader').style.display = 'none';
          alert('Error: ' + e.message);
        })
        .getApplicantsForDashboardWrapper();
    }

    function quickDecide(appId, decision) {
      document.getElementById('targetAppId').value = appId;
      decideCandidate(decision);
    }

    function decideCandidate(decision) {
      var appId = document.getElementById('targetAppId').value;
      if (!appId) { alert('Please enter or click an Application ID'); return; }
      var feedback = document.getElementById('decFeedback').value;

      google.script.run
        .withSuccessHandler(function() {
          alert('Application ' + appId + ' marked as ' + decision + '! Preferred notification email delivered.');
          fetchApplicants();
        })
        .processDecisionWrapper(appId, decision, feedback);
    }

    function submitCandidate() {
      var payload = {
        name: document.getElementById('cName').value,
        email: document.getElementById('cEmail').value,
        role: document.getElementById('cRole').value,
        skills: document.getElementById('cSkills').value,
        resumeUrl: document.getElementById('cResume').value
      };
      if (!payload.email || !payload.name) { alert('Name and Email required!'); return; }
      google.script.run
        .withSuccessHandler(function(id) {
          alert('Applicant ingested successfully: ' + id);
          fetchApplicants();
        })
        .submitApplicationWrapper(payload);
    }

    // --- Intern Roadmap Functions ---
    function generateInternRoadmap() {
      document.getElementById('aiWait').style.display = 'inline';
      var work = document.getElementById('intWork').value;
      var name = document.getElementById('intName').value;
      var email = document.getElementById('intEmail').value;

      google.script.run
        .withSuccessHandler(function(res) {
          document.getElementById('aiWait').style.display = 'none';
          currentRoadmap = res.roadmap;
          document.getElementById('roadmapBox').style.display = 'block';
          document.getElementById('roadmapJson').innerText = JSON.stringify(res.roadmap, null, 2);
        })
        .withFailureHandler(function(err) {
          document.getElementById('aiWait').style.display = 'none';
          alert('Error: ' + err.message);
        })
        .generateRoadmapDraftWrapper(work, email, name, 4);
    }

    function acceptInternRoadmap() {
      var name = document.getElementById('intName').value;
      var email = document.getElementById('intEmail').value;
      google.script.run
        .withSuccessHandler(function(res) {
          alert('Roadmap Accepted! Created sheet ' + res.sheetTitle + ' with ' + res.totalTasks + ' milestone tasks. Confirmation email sent to ' + email);
        })
        .acceptAndProvisionInternSheetWrapper(email, name, currentRoadmap);
    }

    function undoInternRoadmap() {
      var email = document.getElementById('intEmail').value;
      google.script.run
        .withSuccessHandler(function(res) {
          if (res.status === 'undone') {
            currentRoadmap = res.roadmap;
            document.getElementById('roadmapJson').innerText = JSON.stringify(res.roadmap, null, 2);
            alert('Restored previous draft!');
          } else { alert(res.message); }
        })
        .undoRoadmapDraftWrapper(email);
    }

    function rejectInternRoadmap() {
      var email = document.getElementById('intEmail').value;
      google.script.run
        .withSuccessHandler(function() {
          document.getElementById('roadmapBox').style.display = 'none';
          alert('Draft discarded.');
        })
        .rejectRoadmapDraftWrapper(email);
    }

    // --- Daily EOD & CTO Blocker Desk Functions ---
    function fetchRecentEods() {
      document.getElementById('eodLoader').style.display = 'block';
      google.script.run
        .withSuccessHandler(function(list) {
          document.getElementById('eodLoader').style.display = 'none';
          rawEodList = list || [];
          renderEodTable();
          updateEodStats();
        })
        .withFailureHandler(function(err) {
          document.getElementById('eodLoader').style.display = 'none';
          console.error('Error fetching EODs:', err);
        })
        .getRecentEodsForCtoWrapper(30);
    }

    function renderEodTable() {
      var tbody = document.getElementById('eodTableBody');
      tbody.innerHTML = '';

      var filtered = rawEodList.filter(function(item) {
        if (currentEodFilter === 'blockers') return item.hasBlocker;
        if (currentEodFilter === 'pending') return (item.reviewStatus || '').indexOf('Acknowledged') === -1;
        return true;
      });

      if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; color:#64748b; padding:20px;">No daily reports found matching filter.</td></tr>';
        return;
      }

      filtered.forEach(function(item) {
        var tr = document.createElement('tr');
        var statusBadge = 'badge-clean';
        if (item.hasBlocker) statusBadge = 'badge-blocked';
        else if ((item.reviewStatus || '').indexOf('Acknowledged') !== -1) statusBadge = 'badge-reviewed';
        else statusBadge = 'badge-pending';

        var blockerText = item.blockers || 'None';
        var blockerSnippet = item.hasBlocker
          ? '<span style="color:#f87171; font-weight:600;">🚨 ' + escapeHtml(blockerText) + '</span>'
          : '<span style="color:#94a3b8;">None</span>';

        var tasksSnippet = escapeHtml(item.doneYesterday || '').substring(0, 160);
        if ((item.doneYesterday || '').length > 160) tasksSnippet += '...';

        tr.innerHTML = '<td><strong>' + item.updateId + '</strong><br><span style="font-size:11px; color:#64748b;">' + (item.timestamp || '') + '</span></td>' +
          '<td><strong>' + escapeHtml(item.internName || '') + '</strong><br><span style="font-size:11px; color:#94a3b8;">' + escapeHtml(item.internEmail || '') + '</span></td>' +
          '<td style="white-space:pre-wrap; max-width:240px; font-size:12px; color:#cbd5e1;">' + tasksSnippet + '</td>' +
          '<td style="max-width:220px; font-size:12px;">' + blockerSnippet + '</td>' +
          '<td style="font-size:12px; color:#a5b4fc; max-width:180px;">' + escapeHtml(item.sentimentHealth || 'Normal') + '<br><span style="font-size:11px; color:#94a3b8;">Risks: ' + escapeHtml(item.extractedRisks || 'None') + '</span></td>' +
          '<td><span class="badge ' + statusBadge + '">' + escapeHtml(item.reviewStatus || 'Pending') + '</span></td>' +
          '<td>' +
            '<button class="btn btn-primary" style="padding:5px 10px; font-size:11px;" onclick="selectEodForReview(\\'' + item.updateId + '\\')">Review</button>' +
          '</td>';

        tbody.appendChild(tr);
      });
    }

    function setEodFilter(filter, btn) {
      currentEodFilter = filter;
      document.querySelectorAll('.filter-btn').forEach(function(b) { b.classList.remove('active'); });
      if (btn) btn.classList.add('active');
      renderEodTable();
    }

    function updateEodStats() {
      var total = rawEodList.length;
      var blockerCount = 0;
      var pendingCount = 0;
      var firstBlocked = null;

      rawEodList.forEach(function(r) {
        if (r.hasBlocker) {
          blockerCount++;
          if (!firstBlocked && (r.reviewStatus || '').indexOf('Acknowledged') === -1) {
            firstBlocked = r;
          }
        }
        if ((r.reviewStatus || '').indexOf('Acknowledged') === -1) {
          pendingCount++;
        }
      });

      document.getElementById('eodCounterBadge').innerText = total + ' reports (' + blockerCount + ' blocked)';

      // Update Nav Badge
      var navBadge = document.getElementById('navEodBadge');
      if (blockerCount > 0) {
        navBadge.innerText = '🚨 ' + blockerCount;
        navBadge.style.display = 'inline-block';
      } else if (pendingCount > 0) {
        navBadge.innerText = pendingCount;
        navBadge.style.display = 'inline-block';
      } else {
        navBadge.style.display = 'none';
      }

      // Update Blocker Alert Banner
      var banner = document.getElementById('blockerBanner');
      if (firstBlocked) {
        banner.style.display = 'flex';
        document.getElementById('blockerBannerTitle').innerText = '🚨 CRITICAL BLOCKER: ' + firstBlocked.internName + ' is blocked!';
        document.getElementById('blockerBannerDesc').innerText = firstBlocked.blockers.substring(0, 140) + '...';
      } else {
        banner.style.display = 'none';
      }
    }

    function selectEodForReview(updateId) {
      var item = rawEodList.find(function(r) { return r.updateId === updateId; });
      if (!item) return;

      selectedEodItem = item;
      document.getElementById('ctoSelectedId').value = item.updateId + ' — ' + item.internName + ' (' + item.internEmail + ')';
      document.getElementById('ctoDetailView').style.display = 'block';
      document.getElementById('ctoDetailBlocker').innerText = item.hasBlocker ? item.blockers : 'None (Execution on track)';
      document.getElementById('ctoDetailBlocker').style.color = item.hasBlocker ? '#f87171' : '#34d399';
      document.getElementById('ctoDetailAi').innerText = 'Health: ' + (item.sentimentHealth || 'Normal') + '\\nRisks: ' + (item.extractedRisks || 'None');

      document.getElementById('ctoFeedbackText').value = item.ctoFeedback || (item.hasBlocker ? 'Investigating dependency. Let\\'s unblock this in our 1-on-1 sync.' : 'Great velocity! Approved.');
      
      // Scroll smoothly to action panel
      document.getElementById('ctoSelectedId').scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    function acknowledgeSelectedEod() {
      if (!selectedEodItem) { alert('Please select a report to review from the feed.'); return; }
      var feedback = document.getElementById('ctoFeedbackText').value;

      google.script.run
        .withSuccessHandler(function(res) {
          alert('Report ' + selectedEodItem.updateId + ' acknowledged and resolution email sent to ' + selectedEodItem.internEmail);
          fetchRecentEods();
          fetchCtoNotifications();
        })
        .withFailureHandler(function(err) {
          alert('Error acknowledging report: ' + err.message);
        })
        .acknowledgeEodWrapper(selectedEodItem.updateId, feedback);
    }

    function scheduleSyncFromEod() {
      if (!selectedEodItem) { alert('Please select an intern report first.'); return; }
      switchTab('meetings');
      document.getElementById('mAttendees').value = selectedEodItem.internEmail;
      document.getElementById('mTitle').value = 'CTO Unblocking Sync: ' + selectedEodItem.internName + ' (' + selectedEodItem.updateId + ')';
      document.getElementById('mType').value = 'Incident Triage';
    }

    function submitInternEodForm() {
      var name = document.getElementById('eodName').value.trim();
      var email = document.getElementById('eodEmail').value.trim();
      var tasks = document.getElementById('eodTasks').value.trim();
      var challenges = document.getElementById('eodChallenges').value.trim();
      var blockers = document.getElementById('eodBlockers').value.trim();
      var tomorrow = document.getElementById('eodTomorrow').value.trim();

      if (!email || !tasks) {
        alert('Intern Email and Tasks Completed Today are required.');
        return;
      }

      document.getElementById('eodSubmitSpinner').style.display = 'inline';
      document.getElementById('btnSubmitEod').disabled = true;

      var payload = {
        internName: name,
        internEmail: email,
        tasksCompleted: tasks,
        challengesOvercome: challenges,
        blockers: blockers,
        tomorrowPlan: tomorrow
      };

      google.script.run
        .withSuccessHandler(function(res) {
          document.getElementById('eodSubmitSpinner').style.display = 'none';
          document.getElementById('btnSubmitEod').disabled = false;

          var box = document.getElementById('eodFeedbackBox');
          box.style.display = 'block';
          box.innerText = '✅ Report Logged: ' + res.updateId +
            '\\n🏆 XP Awarded: +20 XP\\n' +
            '🤖 Sentiment: ' + res.sentimentHealth +
            '\\n⚠️ Risks Extracted: ' + res.extractedRisks +
            '\\n💡 AI Advice for CTO: ' + res.suggestedAdvice +
            '\\n\\nCTO notified via email & in-app desk.';

          alert('Daily EOD submitted successfully! CTO notified.');
          fetchRecentEods();
          fetchCtoNotifications();
        })
        .withFailureHandler(function(err) {
          document.getElementById('eodSubmitSpinner').style.display = 'none';
          document.getElementById('btnSubmitEod').disabled = false;
          alert('Submission Error: ' + err.message);
        })
        .submitInternEodWrapper(payload);
    }

    function fetchCtoNotifications() {
      google.script.run
        .withSuccessHandler(function(notifs) {
          var unreadBlockers = 0;
          var totalUnread = 0;
          (notifs || []).forEach(function(n) {
            if (!n.read) {
              totalUnread++;
              if (n.hasBlocker) unreadBlockers++;
            }
          });

          var bellBadge = document.getElementById('ctoNotifBadge');
          if (unreadBlockers > 0) {
            bellBadge.innerText = '🚨 ' + unreadBlockers;
            bellBadge.style.display = 'inline-block';
          } else if (totalUnread > 0) {
            bellBadge.innerText = totalUnread;
            bellBadge.style.display = 'inline-block';
          } else {
            bellBadge.style.display = 'none';
          }
        })
        .getCtoNotificationsWrapper();
    }

    function scrollToEodTable() {
      var sec = document.getElementById('eodTableSection');
      if (sec) sec.scrollIntoView({ behavior: 'smooth' });
    }

    function escapeHtml(text) {
      if (!text) return '';
      return text.toString()
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }

    // --- Meeting & Analytics Functions ---
    function scheduleMeet() {
      var attendees = document.getElementById('mAttendees').value;
      var title = document.getElementById('mTitle').value;
      var dur = document.getElementById('mDuration').value;

      google.script.run
        .withSuccessHandler(function(res) {
          document.getElementById('meetResult').style.display = 'block';
          document.getElementById('meetResult').innerText = 'Meeting Scheduled!\\nGoogle Meet Link: ' + res.meetLink + '\\nAttendees: ' + res.attendee;
          alert('Scheduled! Meet link emailed to ' + attendees);
        })
        .scheduleInternMeetingWrapper(attendees, '', title, null, dur);
    }

    function analyzeIntern() {
      var title = document.getElementById('analysisSheet').value;
      google.script.run
        .withSuccessHandler(function(res) {
          document.getElementById('analysisResult').style.display = 'block';
          document.getElementById('analysisResult').innerText = JSON.stringify(res, null, 2);
        })
        .getInternAiAnalysisWrapper(title);
    }

    window.onload = function() {
      fetchApplicants();
      fetchRecentEods();
      fetchCtoNotifications();
      // Periodically refresh CTO notifications every 60s
      setInterval(fetchCtoNotifications, 60000);
    };
  </script>
</body>
</html>`;
}
