# Questo Quality Rubric & Verification Harness (05_QUALITY_RUBRIC.md)

## 1. 95+ Code Quality Scoring Standard

Every module in Questo is benchmarked against the following quality dimensions:

| Dimension | Target Standard | Verification Method |
|---|---|---|
| **Cyclomatic Complexity** | $< 10$ per function | No nested callbacks $> 2$ levels; extracted helper routines |
| **Error Handling** | 100% try-catch boundaries on network and IO | Every `UrlFetchApp` and Sheet edit has safe fallbacks and informative error logs |
| **Idempotency** | Complete idempotency on webhook ingestion | Deduplication via `CacheService` idempotency keys |
| **Type Safety & Defensive Validation** | Strict input boundary assertions | Validates email formats, non-empty strings, numeric clampings |
| **Security / CWE Compliance** | Zero Spreadsheet Formula Injection (CWE-1236) | All dynamic text written to cells is sanitized against `=, +, -, @` prefixes |

---

## 2. End-to-End Verification Harness

### Test Scenario 1: Initial Bootstrap
- **Action**: Run `initializeQuestoSheet()` from Apps Script editor.
- **Expected Outcome**: All 6 tabs created with precise column headers, font formatting (Consolas/Inter), dropdown validations, conditional formatting rules, and sample rows populated.

### Test Scenario 2: Blocker Detection & Auto-Escalation
- **Action**: Change a task's status to `Blocked` with priority `P0 - Blocker` and details `"API Gateway returning 502"`.
- **Expected Outcome**:
  1. Row is conditionally styled in soft red.
  2. Outbound event is dispatched to n8n webhook.
  3. AI evaluation generates actionable recommendation.
  4. Notification sent to management channel.

### Test Scenario 3: Task Completion & XP Level Up
- **Action**: Change a task's status to `Done`.
- **Expected Outcome**:
  1. `Completed At` timestamp auto-populates.
  2. Employee's `Total XP` increments by task bounty.
  3. If crossing a level threshold ($50, 200, 450, \dots$), level increments and congratulations toast appears in the sheet.

### Test Scenario 4: Meeting Transcript to Action Items
- **Action**: Paste 3 paragraphs of meeting minutes into `🎙️ Meeting Notes & Actions` and click `⚡ Questo AI -> Extract Action Items`.
- **Expected Outcome**:
  1. Gemini extracts 2-4 concrete tasks with assignees and ETAs.
  2. Automatically appends rows into `📋 Tasks & Quests`.
