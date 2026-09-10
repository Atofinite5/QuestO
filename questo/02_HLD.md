# Questo High-Level Design (02_HLD.md)

## 1. System Objectives & Personas

Questo 2.0 unifies the entire corporate hierarchy into an actionable, synchronized engine:
1. **Executive / CEO**: Monitors company-wide velocity, macro delivery timelines, headcount distribution, and department MVPs.
2. **Technical Leadership / CTO**: Tracks technical debt, architecture reviews, systemic blocker patterns, and P0/P1 incidents.
3. **Team Leads & Managers**: Triage daily updates, assign quests, approve leaves, conduct 1-on-1s using AI coaching cards, and guide interns.
4. **Engineers & Contributors**: Update task progress, track XP bounties, and unblock teammates.
5. **Interns & Students**: Request study/exam leaves with guaranteed streak-freezing, participate in mentorship 1-on-1s, and execute beginner-friendly quests.

---

## 2. Core Operational Workflows (End-to-End Journeys)

### Journey A: Student/Intern Leave Initiation & Streak Freeze
1. An intern or student submits an **Exam / Study Leave** request for 4 days via Slack or the in-sheet menu.
2. The request is recorded as `Pending` in `🏖️ Leave & PTO Management`.
3. n8n sends an interactive approval card to their designated mentor/manager on Slack with `[Approve]` and `[Reject]` buttons.
4. Upon approval:
   - Status updates to `Approved`.
   - `Streak Protected?` turns `TRUE` (standup streak is frozen and protected).
   - Any active quests due during the exam window are automatically extended by 4 days.

### Journey B: Automated Meeting Scheduling & Google Meet Provisioning
1. A lead wants to schedule a 1-on-1 mentorship session with an intern.
2. The request is submitted via the menu or n8n Slack bot.
3. `CalendarService`:
   - Provisions a native Google Meet video conference link.
   - Creates the event in Google Calendar and invites both participants.
   - Scans active blockers in `📋 Tasks & Quests` and uses Gemini to write a customized 3-point agenda.
   - Writes the record into `📅 Scheduled Meetings & Meet Links`.

### Journey C: AI Performance Review & Burnout Early Warning
1. Leadership runs **`📈 Generate AI Performance & Health Analytics`**.
2. The engine computes:
   - Delivery Reliability (% tasks closed before deadline).
   - Average Blocker Resolution Time.
   - Standup Consistency.
3. If an engineer has multiple unresolved P0 blockers or high task overload, the risk flag turns `🔴 Burnout Warning`.
4. Gemini synthesizes a concise 3-sentence 1-on-1 coaching card highlighting strengths and constructive focus areas for manager reviews.

### Journey D: Daily Standups & RPG Gamification Loop
1. Contributors submit daily standups.
2. Gemini 1.5 Flash computes sentiment, velocity, and extracts hidden risks.
3. Base XP (+15 XP) is awarded, consecutive streaks increment, and levels update dynamically using the quadratic curve ($\lfloor\sqrt{\text{XP}/50}\rfloor + 1$).
