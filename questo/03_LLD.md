# Questo Low-Level Design (03_LLD.md)

## 1. Unified Module Structure & File Mapping

Questo Apps Script modules in `questo/gas/`:

```
questo/gas/
├── Code.js                # Core trigger routing, UI menu ('⚡ Questo AI 2.0'), modal dialogs
├── Setup.js               # Idempotent 8-tab sheet initializer, dropdown validations & styling
├── CalendarService.js     # Google Meet conference link provisioning & AI agenda synthesis
├── LeaveService.js        # PTO state machine, approval routing, streak freeze & task rescheduling
├── AnalyticsService.js    # Delivery reliability %, burnout risk, and Gemini 1-on-1 performance cards
├── TaskService.js         # Task lifecycle, P0 blocker detection, completion timestamps
├── StandupService.js      # Daily standup logging, sentiment/health scoring & streak counting
├── GamificationService.js # Quadratic level curve, XP bounties, streak freeze checks, badges
├── AiService.js           # Gemini 1.5 Flash / Pro & OpenAI REST connectors with JSON extraction
├── WebhookService.js      # Inbound doPost(e) router & outbound n8n dispatcher with token auth
└── ReportService.js       # Weekly velocity calculation & executive digest compiler
```

---

## 2. Mathematical Models & Business Logic

### 2.1 Level Progression Curve
XP increases non-linearly to create a satisfying leveling progression:
$$\text{Level} = \left\lfloor \sqrt{\frac{\text{Total XP}}{50}} \right\rfloor + 1$$

### 2.2 Streak Protection Formula (Leave State Machine)
When checking if an employee's streak increments or resets during daily standup checks:
$$\text{Streak Status} = \begin{cases} 
\text{Frozen (Maintained)}, & \text{if } \text{isApprovedLeave}(\text{email}, \text{today}) = \text{TRUE} \\
\text{Streak} + 1, & \text{if standup submitted today} \\
0 \text{ (Reset)}, & \text{if absent without approved leave}
\end{cases}$$

### 2.3 Delivery Reliability Metric
Measures an employee's execution consistency:
$$\text{Delivery Reliability} = \left( \frac{\text{Completed Quests on or before ETA}}{\text{Total Completed Quests}} \right) \times 100\%$$

### 2.4 Burnout Risk Evaluation Matrix
- $\text{Burnout Warning (🔴)} \iff (\text{Open P0/P1 Blockers} \ge 2) \lor (\text{In-Flight Quests} \ge 8)$
- $\text{Moderate Load (🟡)} \iff (\text{Open Blockers} = 1) \lor (\text{In-Flight Quests} \in [5, 7])$
- $\text{Healthy (🟢)} \iff \text{Otherwise}$

---

## 3. Service Signatures & Interfaces

### 3.1 CalendarService
- `scheduleMeeting({ title, meetingType, host, attendees, startTime, endTime }): Object`
  - Generates Google Calendar event with native Google Meet link.
  - Generates 3-bullet AI agenda based on attendee blockers.
  - Writes row to `📅 Scheduled Meetings & Meet Links`.

### 3.2 LeaveService
- `submitLeave(email, leaveType, startDate, endDate, reason): string`
- `approveLeave(leaveId, decisionRemarks): boolean`
  - Sets `Streak Protected?` = `TRUE`.
  - Automatically shifts due dates forward by `daysCount` for active tasks.
- `isEmployeeOnApprovedLeave(email, targetDate): boolean`

### 3.3 AnalyticsService
- `generateAllAnalytics(): void`
  - Computes reliability %, standup consistency, and burnout scores.
  - Calls `AiService.callGemini()` to author customized 1-on-1 coaching review cards.
