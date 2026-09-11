# Questo Enterprise 2.0 — 5-Day Implementation Roadmap & Execution Ledger

> [!IMPORTANT]
> **AGENT DIRECTIVE / PERSISTENT MEMORY**:
> Any AI agent reading this repository MUST inspect this document first. This document serves as the single source of truth for the 5-day implementation progress. The user does **NOT** need to repeat or recall the roadmap; the agent must inspect the **Live Phase Tracking Ledger** below to immediately resume from the exact active phase and step.

---

## 📊 Live Phase Tracking Ledger

| Day | Phase Name | Status | Key Deliverable | Verified Date |
|:---:|:---|:---:|:---|:---:|
| **Day 1** | **Foundation & Scalable Architecture Bootstrap** | 🟢 **COMPLETED** | Git CI, 8-tab Google Sheet, Scalable GAS Webhooks (v2.0.1) | 2026-09-11 |
| **Day 2** | **AI Foundation, Tasks, Standups & Gamification** | 🟢 **COMPLETED** | OpenRouter Gemini 1.5 Flash, Task transitions, LockService XP | 2026-09-12 |
| **Day 3** | **Advanced Services (Leave & Meetings)** | 🟡 **IN PROGRESS** | PTO streak freeze, Google Meet agendas, Burnout AI | — |
| **Day 4** | **n8n Multi-Agent Fabric & Slack Integration** | ⚪ *Pending* | Web App deployment, 6 imported n8n workflows | — |
| **Day 5** | **Security Audit, Quality Harness & Go-Live** | ⚪ *Pending* | 05_QUALITY_RUBRIC tests, STRIDE audit, Production lock | — |

---

## 📅 Visual Gantt Implementation Timeline

```mermaid
gantt
    title Questo Enterprise 2.0 — 5-Day Implementation Roadmap
    dateFormat  YYYY-MM-DD
    section Day 1: Foundation
    Git Setup & Repository Bootstrap       :done, d1_1, 2026-09-11, 1d
    Google Sheet Master Ledger & Schema    :done, d1_2, 2026-09-11, 1d
    Scalable Webhook Architecture (v2.0.1) :done, d1_3, 2026-09-11, 1d
    section Day 2: Core Engine
    OpenRouter Gemini 1.5 Flash Setup      :done, d2_1, 2026-09-12, 1d
    Task & Blocker Lifecycle Engine        :done, d2_2, 2026-09-12, 1d
    Gamification, XP & Concurrency Lock    :done, d2_3, 2026-09-12, 1d
    Standup Ingestion & Sentiment Scoring  :done, d2_4, 2026-09-12, 1d
    section Day 3: Advanced Services
    Leave Engine & Streak Freeze           :active, d3_1, 2026-09-13, 1d
    Google Meet Auto-Provisioning & Agendas:d3_2, 2026-09-13, 1d
    Burnout Early Warning & 1-on-1 Cards   :d3_3, 2026-09-13, 1d
    Weekly Velocity & Executive Digest     :d3_4, 2026-09-13, 1d
    section Day 4: n8n Multi-Agent Fabric
    GAS Web App Deployment (doPost)        :d4_1, 2026-09-14, 1d
    Import 6 n8n Workflow Templates        :d4_2, 2026-09-14, 1d
    Slack Bot & Interactive Approval Nodes :d4_3, 2026-09-14, 1d
    section Day 5: Testing & Go-Live
    Run 05_QUALITY_RUBRIC Test Harness     :d5_1, 2026-09-15, 1d
    Security Audit & CWE-1236 Hardening    :d5_2, 2026-09-15, 1d
    Org Onboarding & Production Launch     :d5_3, 2026-09-15, 1d
```

---

## 🛠️ Detailed Day-by-Day Implementation Guide

### Day 1: Foundation & Spreadsheet Ledger Bootstrap
* **Status**: 🟢 **COMPLETED & PROMOTED TO PROD (`v2.0.1`)**
* **Accomplished**:
  - [x] Initialized Git with branching structure (`develop`, `staging`, `main`).
  - [x] GitHub Actions CI pipeline running with automated syntax, JSON schema, and secret leak scanning.
  - [x] Single-arrow pipeline with **CacheService Idempotency** and **LockService Concurrency** to prevent bottlenecks.
  - [x] Single-bundle Apps Script engine with glowing SVG Command Center UI.
  - [x] Promoted cleanly through `feat` $\rightarrow$ `develop` $\rightarrow$ `staging` $\rightarrow$ `main` with semantic tag `v2.0.1`.

---

### Day 2: AI Foundation, Tasks, Standups & Gamification
* **Status**: 🟢 **COMPLETED (`v2.1.0`)**
* **Primary Objective**: Wire OpenRouter Gemini 1.5 Flash credentials, validate task lifecycle, test thread-safe XP awards, and standup risk triage.
* **Accomplished**:
  - [x] Integrated OpenRouter endpoint (`https://openrouter.ai/api/v1/chat/completions`) with `google/gemini-flash-1.5`.
  - [x] Auto-detection for OpenRouter keys (`sk-or-...`) with native Gemini fallback.
  - [x] Task state machine: `In Progress` $\rightarrow$ `Done` awards XP bounties, timestamps completion, and records badge criteria.
  - [x] Standup sentiment & risk scoring via OpenRouter Gemini.
  - [x] Thread-safe `LockService` concurrency handling for XP increments.

---

### Day 3: Advanced Services (Leave Engine, Google Meet & Burnout Analytics)
* **Status**: 🟡 **ACTIVE IN PROGRESS**
* **Primary Objective**: PTO streak-freeze protection, task due-date auto-rescheduling, Google Meet auto-generation, burnout warning signals.
* **Goals**:
  1. Validate Leave Request creation with employee tier lookup.
  2. Test `approveLeave`: ensure active task ETAs shift forward by `daysCount` and `Streak Protected?` is set to `TRUE`.
  3. Validate Google Meet scheduling with automated room provisioning.
  4. Generate AI 1-on-1 performance coaching cards and burnout risk indicators.
