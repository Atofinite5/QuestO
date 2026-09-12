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
      max-width: 1200px;
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
    @media (max-width: 768px) {
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
    }
    .badge {
      padding: 4px 10px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 600;
    }
    .badge-selected { background: #14532d; color: #86efac; }
    .badge-rejected { background: #7f1d1d; color: #fca5a5; }
    .badge-pending { background: #1e3a8a; color: #93c5fd; }
    .preview-box {
      background: #020617;
      border: 1px solid #1e293b;
      border-radius: 8px;
      padding: 14px;
      font-family: monospace;
      font-size: 12px;
      color: #a5f3fc;
      max-height: 240px;
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
      <div>
        <span style="font-size:12px; color:#10b981; background:rgba(16,185,129,0.1); padding:6px 12px; border-radius:20px; border:1px solid rgba(16,185,129,0.3);">
          🟢 Gemini 2.5 Flash Online
        </span>
      </div>
    </div>

    <!-- Nav Tabs -->
    <div class="nav-tabs">
      <button class="nav-tab active" onclick="switchTab('applicants')">💼 Applicant & Talent Pipeline</button>
      <button class="nav-tab" onclick="switchTab('interns')">🎓 Founder &rarr; CTO Roadmap & Approvals</button>
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
          <button class="btn btn-primary" onclick="submitCandidate()">Ingest Candidate</button>
        </div>

        <div class="card">
          <div class="card-title">⚡ 1-Click Select / Reject Mail Action</div>
          <p style="color:var(--text-muted); font-size:13px; margin-bottom:14px;">
            Selecting or Rejecting a candidate automatically updates the Google Sheet and dispatches a formatted notification email to the candidate's inbox.
          </p>
          <label>Selected Candidate ID:</label>
          <input type="text" id="targetAppId" placeholder="e.g. APP-1001">
          <label>Custom Feedback / Note:</label>
          <textarea id="decFeedback" rows="3" placeholder="Optional personalized review feedback..."></textarea>
          <div style="display:flex; gap:10px;">
            <button class="btn btn-select" onclick="decideCandidate('Selected')">✅ Select & Send Offer Email</button>
            <button class="btn btn-reject" onclick="decideCandidate('Rejected')">❌ Reject & Send Status Email</button>
          </div>
        </div>
      </div>

      <div class="card">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
          <div class="card-title" style="margin-bottom:0;">📋 Candidate Applications Pipeline</div>
          <button class="btn" style="background:#334155; color:#fff;" onclick="fetchApplicants()">🔄 Refresh</button>
        </div>
        <div id="appLoader" style="display:none; color:#38bdf8; margin:10px 0;">Fetching candidates from Google Sheets...</div>
        <table id="applicantTable">
          <thead>
            <tr>
              <th>App ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Skills</th>
              <th>Decision</th>
              <th>Quick Actions</th>
            </tr>
          </thead>
          <tbody id="applicantBody"></tbody>
        </table>
      </div>
    </div>

    <!-- Tab 2: Founder -> CTO Intern Roadmap -->
    <div id="tab-interns" class="tab-content">
      <div class="card">
        <div class="card-title">⚡ Scrape & Decompose Work (Founder &rarr; CTO via Gemini 2.5 Flash)</div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
          <div>
            <label>Intern Name:</label>
            <input type="text" id="intName" value="Rohan Sharma">
          </div>
          <div>
            <label>Intern Email:</label>
            <input type="email" id="intEmail" value="intern@company.com">
          </div>
        </div>
        <label>Founder's Work Scope / Feature Requirements:</label>
        <textarea id="intWork" rows="4">Build an autonomous evaluation pipeline for LLM agents. Scrape agent execution traces, compute ROUGE & faithfulness metrics against gold datasets, build automated regression charts, and deploy a REST endpoint for verification.</textarea>
        
        <div style="display:flex; gap:10px; align-items:center;">
          <button class="btn btn-ai" onclick="generateInternRoadmap()">⚡ Decompose with Gemini 2.5 Flash</button>
          <span id="aiWait" style="display:none; color:#38bdf8;">Gemini analyzing and creating schedule...</span>
        </div>

        <div id="roadmapBox" style="display:none; margin-top:16px;">
          <div style="font-weight:600; color:#c4b5fd; margin-bottom:6px;">Generated Roadmap Preview:</div>
          <div id="roadmapJson" class="preview-box"></div>
          <div style="margin-top:12px; display:flex; gap:10px;">
            <button class="btn btn-select" onclick="acceptInternRoadmap()">✅ Accept & Provision Google Sheet</button>
            <button class="btn" style="background:#d97706; color:white;" onclick="undoInternRoadmap()">↩️ Undo</button>
            <button class="btn btn-reject" onclick="rejectInternRoadmap()">❌ Discard Draft</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Tab 3: Meetings -->
    <div id="tab-meetings" class="tab-content">
      <div class="card">
        <div class="card-title">📅 Instant Intern / Team Meeting Scheduler</div>
        <label>Meeting Title:</label>
        <input type="text" id="mTitle" value="Weekly Engineering Sync & Roadmap Review">
        <div style="display:grid; grid-template-columns:2fr 1fr; gap:12px;">
          <div>
            <label>Attendee Email(s):</label>
            <input type="text" id="mAttendees" value="intern@company.com">
          </div>
          <div>
            <label>Duration (Mins):</label>
            <input type="number" id="mDuration" value="30">
          </div>
        </div>
        <button class="btn btn-primary" onclick="scheduleMeet()">📅 Schedule Google Meet & Send Invites</button>
        <div id="meetResult" style="display:none; margin-top:14px;" class="preview-box"></div>
      </div>
    </div>

    <!-- Tab 4: Performance Analytics -->
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

    function switchTab(tabName) {
      document.querySelectorAll('.nav-tab').forEach(function(t) { t.classList.remove('active'); });
      document.querySelectorAll('.tab-content').forEach(function(c) { c.classList.remove('active'); });
      
      document.getElementById('tab-' + tabName).classList.add('active');
      event.target.classList.add('active');
      if (tabName === 'applicants') fetchApplicants();
    }

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
    };
  </script>
</body>
</html>`;
}
