---
name: engineering-experience-engine
description: Use before any planning, implementation, architecture, refactoring, debugging, deployment, security, database, payment integration, authentication, or large codebase change. Automatically reviews accumulated engineering experience before plans are created and extracts new learnings after work completes. Do NOT use for trivial formatting changes, typo fixes, documentation edits, or single-file edits with no behavioral change.
---

# Engineering Experience Engine

## Overview

The Engineering Experience Engine (EE) is a **mandatory** engineering judgment layer. It enforces that every engineering decision is informed by accumulated past experience before any code is written, and that every implementation contributes new learnings back to the knowledge base.

The EE plugin enforces this through **4 enforcement layers**:
1. **System prompt injection** — instructions baked into every conversation
2. **Permission gate** — denies write/execute permissions until review succeeds
3. **Tool gate** — blocks edit/write by modifying args to surface gate message
4. **Session-end safety** — queues unextracted learnings for recovery

**The only valid workflow:**
```
Task → curl review API → Judgment Package → Plan → Implement → curl learn API
```

**The following is BLOCKED:**
```
Task → Plan → Implement
```

## Enforcement Architecture

```
User Request
      ↓
┌─────────────────────────────────────────────┐
│  Layer 1: System Prompt (experimental.chat. │
│           system.transform)                  │
│  Injects: "edit/write blocked until review  │
│           succeeds"                          │
└─────────────────────────────────────────────┘
      ↓
Agent considers using edit/write
      ↓
┌─────────────────────────────────────────────┐
│  Layer 2: Permission Gate (permission.ask)  │
│  If reviewCompleted == false: DENY          │
└─────────────────────────────────────────────┘
      ↓
┌─────────────────────────────────────────────┐
│  Layer 3: Tool Gate (tool.execute.before)   │
│  If reviewCompleted == false:               │
│    edit → oldString made unmatchable        │
│    write → redirected to temp file          │
└─────────────────────────────────────────────┘
      ↓
Task completed
      ↓
┌─────────────────────────────────────────────┐
│  Layer 4: Learning Enforcement              │
│  If reviewCompleted AND implementationDone  │
│  AND NOT learningCompleted:                 │
│    → Session end: queue to pending-learn.yml│
└─────────────────────────────────────────────┘
```

## Lifecycle

```
OpenCode Starts
      ↓
Plugin loads: 4 enforcement hooks registered
      ↓
experimental.chat.system.transform fires
  → Injects mandatory workflow into system prompt
      ↓
User sends task
      ↓
Agent checks: is EE backend running on :8080?
  → curl.exe -s http://localhost:8080/api/v1/concepts
  → If down → run: powershell -File "$env:USERPROFILE\.agents\skills\engineering-experience-engine\scripts\start-ee.ps1"
      ↓
Agent runs review via bash+curl:
  curl.exe -X POST http://localhost:8080/api/v1/review -H "Content-Type: application/json" -d '{"task":"..."}'
  → tool.execute.after detects review JSON in output
  → reviewCompleted = true for this session
      ↓
Agent displays judgment package
      ↓
Agent states adopted recommendations
      ↓
Agent produces plan (Risks, Architecture, Plan, Tests, Deployment)
      ↓
Agent tries edit/write
  → permission.ask fires → permission granted (review done)
  → tool.execute.before fires → tracks implementationStarted = true
  → Tool executes normally
      ↓
Implementation complete
      ↓
Agent submits learnings via bash+curl:
  curl.exe -X POST http://localhost:8080/api/v1/learn -H "Content-Type: application/json" -d '{"type":"experience","title":"...","content":"..."}'
  → tool.execute.after detects success → learningCompleted = true
  → Knowledge persisted to engineering-brain/
      ↓
OpenCode Closes
  → event hook fires → session.status=end
  → If implementationDone && NOT learningCompleted:
      → Write to pending-learn.yml
  → Cleanup session state
```

## Tool Gating Details

### Blocked tools (until review succeeds):

| Tool | Block Behavior |
|---|---|
| `edit` | oldString set to unmatchable token (harmless failure) |
| `write` | Redirected to `%TEMP%\EE_BLOCKED_<timestamp>.txt` |

### Not blocked (always available):
- `bash` — needed for curl API calls, git, npm, tests, etc.

### If a tool gets blocked:

1. The gate message tells you exactly why
2. Run the review curl command immediately
3. After review completes, retry the blocked operation
4. The gate automatically opens once review is confirmed

## Task Lifecycle States

Tracked per session by the plugin:

| State | Set When | Purpose |
|---|---|---|
| `reviewCompleted` | curl review API returns valid judgment | Allows edit/write tools |
| `implementationStarted` | First edit/write after review | Triggers learning requirement |
| `learningCompleted` | curl learn API returns success | Satisfies learning requirement |

## Pre-Planning Workflow

After review curl returns a judgment package:

### Step 1: Run Review

Use PowerShell (preferred — no quoting issues):

```powershell
$body = @{task="Describe what you are about to build or fix"} | ConvertTo-Json
Invoke-RestMethod -Uri http://localhost:8080/api/v1/review -Method Post -Body $body -ContentType "application/json"
```

Or write a temp JSON file and curl it (works in any shell):

```bash
curl.exe -s -X POST http://localhost:8080/api/v1/review -H "Content-Type: application/json" -d @%TEMP%\ee-review.json
```

> **Never use inline JSON** (`-d '{"task":"..."}'`) — it breaks with spaces, quotes, or special characters.

### Step 2: Display Judgment Package

```
Experience Review

Concepts: ...
Confidence: ...

Lessons:
  - ...

Warnings:
  - ...

Recommendations:
  - ...

Evidence: ...
```

### Step 3: Analyze

1. **Lessons** — which past experiences are relevant? What failures should be avoided?
2. **Warnings** — what does the engine flag as high-risk?
3. **Recommendations** — which architectures, technologies, or patterns are suggested?
4. **Evidence** — what principles, experiences, and decisions support the findings?

### Step 4: State Adoptions

Explicitly state which recommendations were adopted and why:

```
Recommendations Adopted:
- [recommendation] — adopted because [reason]
- [recommendation] — not adopted because [reason]
```

### Step 5: Produce Plan

Only after review, produce:

```
Risks
Architecture
Implementation Plan
Testing Strategy
Deployment Considerations
```

## Post-Execution Learning

After implementation completes, submit extracted knowledge via curl.

Use PowerShell (preferred):

```powershell
$body = @{type="experience"; title="Fixed db connection pool leak"; content="Added validation to HikariCP config"} | ConvertTo-Json
Invoke-RestMethod -Uri http://localhost:8080/api/v1/learn -Method Post -Body $body -ContentType "application/json"
```

Or write a temp JSON file and curl it:

```bash
curl.exe -s -X POST http://localhost:8080/api/v1/learn -H "Content-Type: application/json" -d @"%TEMP%\ee-learn.json"
```

Supported types: `experience`, `principle`, `failure`, `architecture`, `decision`.

The backend saves the YAML to `engineering-brain/{type}s/{id}.yml` and adds it to the in-memory graph automatically. Future reviews will search across all saved learnings.

Update `engineering-brain/graph/relations.yml` if new edges are needed.

## Recovery: Pending Learnings

If a session ends without submitting learnings after implementation:

1. The plugin writes to `~/.agents/skills/engineering-experience-engine/pending-learn.yml`
2. Next session: check the pending file via bash and submit learnings via curl

## Starting the Backend

**Auto-start:** The plugin auto-starts the backend when you run `curl` to `/api/v1/review` or `/api/v1/learn`. You don't need to start it manually.

Manual start (if auto-start fails):
```powershell
powershell -File "$env:USERPROFILE\.agents\skills\engineering-experience-engine\scripts\start-ee.ps1"
```

Or directly:
```bash
java -jar ~/Desktop/SHIN/experience-engine/backend/target/experience-engine-0.1.0.jar --experience-engine.brain-path=~/Desktop/SHIN/engineering-brain
```

## First-Time Setup

```powershell
# 1. Build the JAR (needs Java 21 + Maven, one-time only)
cd ~/Desktop/SHIN/experience-engine/backend
mvn package -DskipTests -q

# 2. Start the backend
powershell -File "$env:USERPROFILE\.agents\skills\engineering-experience-engine\scripts\start-ee.ps1"
```

After that, the JAR is cached. Subsequent starts don't need Maven.

## Backend Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| Permission denied for write | review not completed | Run review curl first |
| Tool blocked with gate message | review not completed | Run review curl first |
| Connection refused | EE not started | Run start-ee.ps1 or let plugin auto-start it |
| 500 from review | Brain YAML error | Check engineering-brain YAML syntax |
| No concepts matched | Task too vague | Broaden task description |
| Low confidence | No relevant experience | Proceed normally |
| Java OOM | Heap too small | Add `-Xmx256m` to mvn command |

## Filesystem Layout

```
~/.agents/skills/engineering-experience-engine/
  SKILL.md
  pending-learn.yml          # Unsubmitted learnings from aborted sessions
  scripts/
    start-ee.ps1
    stop-ee.ps1
    status-ee.ps1

~/.opencode/plugins/ee-experience/
  plugin.json
  dist/plugin.js             # Enforcement plugin (hooks only, no custom tools)

~/.config/opencode/plugins/ee-experience/
  package.json               # Auto-discovery location (copy of above)

~/Desktop/SHIN/
  engineering-brain/         # YAML knowledge base (canonical source)
  experience-engine/         # Backend
```
