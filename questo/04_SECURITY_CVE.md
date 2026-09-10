# Questo Security Architecture & CVE Hardening (04_SECURITY_CVE.md)

## 1. Threat Modeling (STRIDE Analysis)

| Threat Category | Potential Attack Vector | Questo Mitigation Strategy |
|---|---|---|
| **Spoofing** | Forged webhook requests to `doPost(e)` imitating n8n or an external bot | Mandatory API token or HMAC-SHA256 signature verification in HTTP headers (`X-Questo-Signature`) |
| **Tampering** | Unauthorized modifications of XP scores, levels, or task statuses directly in Sheets | Granular Google Sheets Range Protections: only authorized leads can edit `Total XP` directly; employee updates are gated via Script or Form |
| **Repudiation** | An employee denies submitting an update or modifying a task | Immutable audit log in `⏱️ Daily Standups` recording timestamp, authenticated Google user email, and client IP |
| **Information Disclosure** | Exposure of Gemini / OpenAI API keys in sheet cells or client scripts | API keys are stored strictly in `PropertiesService.getScriptProperties()` (server-side only); never written to spreadsheet cells |
| **Denial of Service** | Flooding the Apps Script `doPost(e)` endpoint with large transcripts | Payload size cap (< 1MB enforced in `doPost`), rate-limiting cache, and immediate validation rejection |
| **Elevation of Privilege** | An employee editing formulas to elevate their gamification ranking | Level and Rank are computed using protected formulas and backend batch reconciliation |

---

## 2. Secrets Management & Credential Hygiene

- **Rule 1**: NEVER hardcode API keys in `.js` or `.gs` files.
- **Rule 2**: Keys must be populated via `PropertiesService.getScriptProperties().setProperty('GEMINI_API_KEY', '...')` or configured through the secure dialog in `⚡ Questo AI -> Configure API Keys`.
- **Rule 3**: Outbound webhooks to n8n include a shared secret token verified by n8n Webhook authentication nodes.

---

## 3. LLM Prompt Injection & Output Sanitization

To prevent malicious task descriptions or meeting transcripts from hijacking LLM system behavior:
1. **Strict System Delimiters**: User-provided text is wrapped within unambiguous XML delimiters (e.g. `<user_standup>...</user_standup>`).
2. **Schema Enforcement**: All LLM calls request strictly structured JSON (via Gemini's `response_mime_type: "application/json"` and OpenAI's `response_format: { type: "json_object" }`).
3. **Regex Sanitization**: Strips executable macro strings (e.g. `=cmd|' /C ...'`) before writing AI recommendations into Google Sheet cells to eliminate CSV/Spreadsheet Injection (CWE-1236).
