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
3. **Tool gate** — blocks edit/write/bash by modifying args to surface gate message
4. **Session-end safety** — queues unextracted learnings for recovery

**The only valid workflow:**
```
Task → ee_review → Judgment Package → Plan → Implement → ee_learn
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
│  Injects: "Implementation tools blocked     │
│           until ee_review succeeds"          │
└─────────────────────────────────────────────┘
      ↓
Agent considers using edit/write/bash
      ↓
┌─────────────────────────────────────────────┐
│  Layer 2: Permission Gate (permission.ask)  │
│  If reviewCompleted == false: DENY          │
│  User sees: permission denied               │
└─────────────────────────────────────────────┘
      ↓
┌─────────────────────────────────────────────┐
│  Layer 3: Tool Gate (tool.execute.before)   │
│  If reviewCompleted == false:               │
│    bash → command replaced with gate msg    │
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
│    → System prompt reminder                 │
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
EE checks: is EE backend running on :8080?
  → No → auto-start via ee_start (or manual)
  → Yes → ready
      ↓
Agent calls ee_review(task)
  → tool.execute.after fires
  → reviewCompleted = true for this session
      ↓
Agent displays judgment package
      ↓
Agent states adopted recommendations
      ↓
Agent produces plan (Risks, Architecture, Plan, Tests, Deployment)
      ↓
Agent tries edit/write/bash
  → permission.ask fires → permission granted (review done)
  → tool.execute.before fires → tracks implementationStarted = true
  → Tool executes normally
      ↓
Implementation complete
      ↓
System prompt reminder: "ee_learn required"
      ↓
Agent calls ee_learn(type, title, content)
  → tool.execute.after fires → learningCompleted = true
  → Knowledge persisted to engineering-brain/
      ↓
OpenCode Closes
  → event hook fires → session.status=end
  → If implementationDone && NOT learningCompleted:
      → Write to pending-learn.yml
  → Cleanup session state
```

## Tool Gating Details

### Blocked tools (until ee_review succeeds):

| Tool | Block Behavior |
|---|---|
| `bash` | Command replaced with gate message + exit 1 |
| `edit` | oldString set to unmatchable token (harmless failure) |
| `write` | Redirected to `%TEMP%\EE_BLOCKED_<timestamp>.txt` |

### If a tool gets blocked:

1. The gate message tells you exactly why
2. Call `ee_review(task="...")` immediately
3. After review completes, retry the blocked operation
4. The gate automatically opens once review is confirmed

## Task Lifecycle States

Tracked per session by the plugin:

| State | Set When | Purpose |
|---|---|---|
| `reviewCompleted` | ee_review succeeds | Allows implementation tools |
| `implementationStarted` | First edit/write/bash after review | Triggers learning requirement |
| `learningCompleted` | ee_learn succeeds | Satisfies learning requirement |

## Pre-Planning Workflow

After ee_review returns a judgment package:

### Step 1: Display Judgment Package

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

### Step 2: Analyze

1. **Lessons** — which past experiences are relevant? What failures should be avoided?
2. **Warnings** — what does the engine flag as high-risk?
3. **Recommendations** — which architectures, technologies, or patterns are suggested?
4. **Evidence** — what principles, experiences, and decisions support the findings?

### Step 3: State Adoptions

Explicitly state which recommendations were adopted and why:

```
Recommendations Adopted:
- [recommendation] — adopted because [reason]
- [recommendation] — not adopted because [reason]
```

### Step 4: Produce Plan

Only after review, produce:

```
Risks
Architecture
Implementation Plan
Testing Strategy
Deployment Considerations
```

## Post-Execution Learning

After implementation completes, call `ee_learn` with extracted knowledge.

### Experience:
```yaml
title: <descriptive title>
problem: <what problem was solved>
root_cause: <why it occurred>
solution: <how it was fixed>
outcome: <result>
tags: [<tag1>, <tag2>]
confidence: 0.7
```

### Principle:
```yaml
title: <principle title>
lesson: <the lesson learned>
confidence: 0.7
```

### Failure:
```yaml
title: <failure title>
impact: <what happened>
lesson: <how to prevent>
confidence: 0.7
```

### Architecture:
```yaml
title: <architecture title>
components: [<component1>, <component2>]
used_in: <context>
confidence: 0.6
```

After `ee_learn`, also persist the memory to `engineering-brain/` on disk:
- `engineering-brain/experiences/` for experiences
- `engineering-brain/principles/` for principles
- `engineering-brain/failures/` for failures
- `engineering-brain/architectures/` for architectures

Update `engineering-brain/graph/relations.yml` if new edges are needed.

## Recovery: Pending Learnings

If a session ends without calling `ee_learn` after implementation:

1. The plugin writes to `~/.agents/skills/engineering-experience-engine/pending-learn.yml`
2. Next session: call `ee_pending` to check for pending items
3. Review the work done and submit learnings via `ee_learn`

## Backend Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| Permission denied for write | review not completed | Call ee_review first |
| Tool blocked with gate message | review not completed | Call ee_review first |
| Connection refused | EE not started | ee_review auto-starts it; or run start-ee.ps1 |
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
  dist/plugin.js             # Enforcement plugin (4 hooks)

~/Desktop/SHIN/
  engineering-brain/         # YAML knowledge base (canonical source)
  experience-engine/         # Backend + frontend
```
