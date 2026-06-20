import { tool } from "@opencode-ai/plugin/tool";
import { execSync } from "child_process";
import { existsSync, appendFileSync, mkdirSync } from "fs";
import { join } from "path";

const SCRIPTS_DIR = join(process.env.USERPROFILE, ".agents", "skills", "engineering-experience-engine", "scripts");
const BRAIN_DIR = join(process.env.USERPROFILE, "Desktop", "SHIN", "engineering-brain");
const PENDING_LEARN_DIR = join(process.env.USERPROFILE, ".agents", "skills", "engineering-experience-engine");

// ─── Task Lifecycle State ───────────────────────────────────────────────
// Tracks per-session: whether review, implementation, and learning completed
const STATE = {
  reviewed: new Set(),      // session IDs that completed ee_review
  implemented: new Set(),   // session IDs that used implementation tools AFTER review
  learned: new Set(),       // session IDs that completed ee_learn
  pendingTasks: new Map(),  // sessionId -> task description
};

const IMPLEMENTATION_TOOLS = new Set(["edit", "write", "bash"]);
const REVIEW_TOOL = "ee_review";
const LEARN_TOOL = "ee_learn";

// ─── Helpers ────────────────────────────────────────────────────────────

function runScript(name, args = "") {
  const scriptPath = join(SCRIPTS_DIR, name);
  if (!existsSync(scriptPath)) return `Script not found: ${scriptPath}`;
  try {
    return execSync(`powershell -File "${scriptPath}" ${args}`, {
      encoding: "utf-8", timeout: 60000,
      env: { ...process.env, ENGINEERING_BRAIN_PATH: BRAIN_DIR },
    }).trim();
  } catch (e) {
    return `Error: ${e.stderr || e.message}`;
  }
}

function isRunning() {
  try {
    const res = execSync(
      `powershell -Command "try { $r = Invoke-WebRequest -Uri 'http://localhost:8080/api/v1/concepts' -UseBasicParsing -TimeoutSec 3; Write-Output $r.StatusCode } catch { Write-Output 'down' }"`,
      { encoding: "utf-8", timeout: 10000 }
    ).trim();
    return res === "200";
  } catch { return false; }
}

function reviewTask(task) {
  if (!isRunning()) return JSON.stringify({
    error: "EE not running", confidence: "low",
    concepts: [], lessons: [], warnings: [], recommendations: [], evidence: []
  });
  try {
    const body = JSON.stringify({ task }).replace(/"/g, '\\"');
    const res = execSync(
      `powershell -Command "$r = Invoke-WebRequest -Uri 'http://localhost:8080/api/v1/review' -Method POST -ContentType 'application/json' -Body '${body}' -UseBasicParsing; Write-Output ($r.Content | ConvertFrom-Json | ConvertTo-Json -Depth 5)"`,
      { encoding: "utf-8", timeout: 30000 }
    ).trim();
    return res;
  } catch (e) {
    return JSON.stringify({ error: e.message, confidence: "low", concepts: [], lessons: [], warnings: [], recommendations: [], evidence: [] });
  }
}

function queuePendingLearning(sessionId) {
  const task = STATE.pendingTasks.get(sessionId) || "unknown task";
  const filePath = join(PENDING_LEARN_DIR, "pending-learn.yml");
  const entry = `\n# Pending learning from session ${sessionId} (${new Date().toISOString()})\n# Task: ${task}\n# The session completed implementation without calling ee_learn.\n# Review the work done and submit learnings via ee_learn.\n`;
  try {
    if (!existsSync(PENDING_LEARN_DIR)) mkdirSync(PENDING_LEARN_DIR, { recursive: true });
    appendFileSync(filePath, entry, "utf-8");
  } catch {}
}

// Check whether a tool should be considered "implementation work"
function isImplementationTool(toolName) {
  return IMPLEMENTATION_TOOLS.has(toolName);
}

// Check whether a permission type is related to implementation
function isImplementationPermission(type) {
  if (!type || typeof type !== "string") return false;
  const impl = ["write", "modify", "create", "delete", "edit", "execute", "command", "file_write", "workspace_write", "file_modify"];
  const t = type.toLowerCase();
  return impl.some(k => t.includes(k));
}

function needsReview(sessionId) {
  return !STATE.reviewed.has(sessionId);
}

function needsLearning(sessionId) {
  return STATE.reviewed.has(sessionId) && STATE.implemented.has(sessionId) && !STATE.learned.has(sessionId);
}

// ─── Plugin Export ──────────────────────────────────────────────────────

export const EEExperiencePlugin = async (ctx) => {
  return {
    // ── System Prompt Enforcement (primary) ──────────────────────────
    "experimental.chat.system.transform": async (input, output) => {
      output.system.push(
        "",
        "═══════════════════════════════════════════════════════════════",
        "ENGINEERING EXPERIENCE ENGINE — MANDATORY ENFORCEMENT",
        "═══════════════════════════════════════════════════════════════",
        "",
        "BEFORE using any implementation tool (edit, write, bash):",
        "  1. Call ee_review with your task description.",
        "  2. Wait for the judgment package (concepts, lessons, warnings, recommendations).",
        "  3. Display: 'Experience Review' heading + full judgment package.",
        "  4. State which recommendations were adopted and why.",
        "  5. Only then produce: Risks → Architecture → Plan → Tests → Deployment.",
        "",
        "IMPLEMENTATION TOOLS ARE BLOCKED until ee_review succeeds.",
        "If you try edit/write/bash without review, they will fail.",
        "",
        "AFTER implementation completes:",
        "  - You MUST call ee_learn to extract experiences, principles, failures, or architectures.",
        "  - If ee_review was called AND implementation tools were used, ee_learn is REQUIRED.",
        "  - Extract: what was learned, what went wrong, what patterns emerged.",
        "",
        "VALID WORKFLOW (only this is allowed):",
        "  Task → ee_review → Judgment Package → Plan → Implement → ee_learn",
        "",
        "INVALID WORKFLOW (will be blocked):",
        "  Task → Plan → Implement",
        "",
        "This is system-enforced. Not optional. Not skippable.",
        "═══════════════════════════════════════════════════════════════"
      );
    },

    // ── Permission Gate (secondary enforcement) ──────────────────────
    "permission.ask": async (input, output) => {
      const sessionId = input?.sessionID || "default";
      if (isImplementationPermission(input?.type) && needsReview(sessionId)) {
        output.status = "deny";
        // Log the block for debugging
        console.log(`[EE] DENIED ${input.type} for session ${sessionId} — review required`);
      }
    },

    // ── Tool Execution Gate (tertiary enforcement, firewalls permission bypasses) ──
    "tool.execute.before": async (input, output) => {
      const sessionId = input.sessionID || "default";
      const toolName = input.tool;

      // Track ee_review calls
      if (toolName === REVIEW_TOOL) {
        // Don't block review — let it proceed
        return;
      }

      // Track ee_learn calls
      if (toolName === LEARN_TOOL) {
        // Don't block learning — let it proceed
        return;
      }

      // Gate implementation tools
      if (isImplementationTool(toolName)) {
        if (needsReview(sessionId)) {
          // Block: modify args to show gate message instead of doing work
          const blockMsg = `\n=== BLOCKED BY ENGINEERING EXPERIENCE ENGINE ===\n\nThis implementation tool (${toolName}) cannot execute because:\n\n  Engineering Experience Review has not been completed.\n\nRequired workflow:\n  1. Call ee_review(task=\"your task description\")\n  2. Review the judgment package\n  3. State adopted recommendations\n  4. Produce plan\n  5. Then implement\n\nCall ee_review now, then retry this operation.\n================================================\n`;

          if (toolName === "bash") {
            // Replace command with gate message
            output.args = { ...output.args, command: `Write-Host '${blockMsg.replace(/'/g, "''")}'; exit 1` };
          } else if (toolName === "edit") {
            // Make edit fail harmlessly
            output.args = { ...output.args, oldString: "__EE_BLOCK__NO_MATCH_TOKEN__", newString: "" };
          } else if (toolName === "write") {
            // Redirect to temp location instead of intended path
            const tempDir = process.env.TEMP || "C:\\Temp";
            const safePath = join(tempDir, `EE_BLOCKED_${Date.now()}.txt`);
            output.args = { ...output.args, filePath: safePath, content: blockMsg };
          }

          console.log(`[EE] BLOCKED ${toolName} for session ${sessionId} — review required`);
          return;
        }

        // Review was done — track implementation
        if (!STATE.implemented.has(sessionId)) {
          STATE.implemented.add(sessionId);
          console.log(`[EE] TRACK implementation started for session ${sessionId}`);
        }
      }
    },

    // ── Post-Execution Tracking ──────────────────────────────────────
    "tool.execute.after": async (input, output) => {
      const sessionId = input.sessionID || "default";
      const toolName = input.tool;

      if (toolName === REVIEW_TOOL) {
        // Check if review succeeded
        try {
          const result = JSON.parse(output?.output || "{}");
          if (result.concepts || result.confidence === "high" || result.confidence === "medium" || result.lessons?.length > 0) {
            STATE.reviewed.add(sessionId);
            STATE.pendingTasks.set(sessionId, input.args?.task || "unknown");
            console.log(`[EE] Review completed for session ${sessionId}: ${(result.concepts || []).join(", ")}`);
          }
        } catch {
          // If output isn't JSON, it might still be valid (error case)
          if (output?.output && !output.output.includes("EE not running")) {
            STATE.reviewed.add(sessionId);
          }
        }
      }

      if (toolName === LEARN_TOOL) {
        STATE.learned.add(sessionId);
        console.log(`[EE] Learning completed for session ${sessionId}`);
      }
    },

    // ── Event Hook ───────────────────────────────────────────────────
    event: async ({ event }) => {
      if (event.type === "session.status") {
        const status = event.properties?.status;
        const sessionId = event.properties?.sessionID || "default";

        if (status === "end" || status === "idle") {
          // Session ending — check for unfulfilled learning requirement
          if (needsLearning(sessionId)) {
            queuePendingLearning(sessionId);
            console.log(`[EE] Session ended with pending learning: ${sessionId}`);
          }

          // Cleanup state
          STATE.reviewed.delete(sessionId);
          STATE.implemented.delete(sessionId);
          STATE.learned.delete(sessionId);
          STATE.pendingTasks.delete(sessionId);
        }
      }
    },

    // ── Tools ────────────────────────────────────────────────────────
    tool: {
      ee_start: tool({
        description: "Start the Engineering Experience Engine backend. Only needed if ee_review reports it's not running.",
        args: {},
        async execute() {
          if (isRunning()) return "EE is already running";
          return runScript("start-ee.ps1");
        },
      }),

      ee_stop: tool({
        description: "Stop the Engineering Experience Engine backend.",
        args: {},
        async execute() {
          return runScript("stop-ee.ps1");
        },
      }),

      ee_status: tool({
        description: "Check EE backend status and lifecycle state for the current session.",
        args: {},
        async execute() {
          const status = runScript("status-ee.ps1");
          // Use a synthetic session ID — in practice the real ID comes from context
          return `Backend: ${status}`;
        },
      }),

      ee_pending: tool({
        description: "Check for unextracted learnings from previous sessions. Call this at session start.",
        args: {},
        async execute() {
          const pendingPath = join(PENDING_LEARN_DIR, "pending-learn.yml");
          if (!existsSync(pendingPath)) return "No pending learnings";
          try {
            const content = execSync(`type "${pendingPath}"`, { encoding: "utf-8", timeout: 5000 }).trim();
            return content || "No pending learnings";
          } catch { return "No pending learnings"; }
        },
      }),

      ee_review: tool({
        description: "🔴 MANDATORY: Submit a task to the Engineering Experience Engine for review. ALL implementation work (edit/write/bash) is BLOCKED until this succeeds. Call this BEFORE any plan or code.",
        args: {
          task: tool.schema.string().describe("Task description. Be specific for best concept matching."),
        },
        async execute(args) {
          if (!isRunning()) {
            const result = runScript("start-ee.ps1");
            if (!result.includes("started") && !result.includes("already running")) {
              return `EE failed to start: ${result}`;
            }
            for (let i = 0; i < 15; i++) {
              await new Promise(r => setTimeout(r, 2000));
              if (isRunning()) break;
            }
          }
          if (!isRunning()) return JSON.stringify({
            error: "EE could not be started", confidence: "low",
            concepts: [], lessons: [], warnings: [], recommendations: [], evidence: []
          });
          return reviewTask(args.task);
        },
      }),

      ee_learn: tool({
        description: "🔴 REQUIRED AFTER IMPLEMENTATION: Submit extracted knowledge to the EE. If ee_review was used and implementation tools ran, this MUST be called before the task is complete.",
        args: {
          type: tool.schema.string().describe("Memory type: experience, principle, failure, or architecture"),
          title: tool.schema.string().describe("Descriptive title"),
          content: tool.schema.string().describe("YAML content body"),
        },
        async execute(args) {
          if (!isRunning()) {
            queuePendingLearning("default");
            return "EE not running; knowledge queued for next session. Make sure to call ee_pending at session start.";
          }
          try {
            const body = JSON.stringify({ type: args.type, title: args.title, content: args.content }).replace(/"/g, '\\"');
            const res = execSync(
              `powershell -Command "$r = Invoke-WebRequest -Uri 'http://localhost:8080/api/v1/learn' -Method POST -ContentType 'application/json' -Body '${body}' -UseBasicParsing; Write-Output ($r.Content)"`,
              { encoding: "utf-8", timeout: 30000 }
            ).trim();
            return res;
          } catch (e) {
            return `Error submitting knowledge: ${e.message}`;
          }
        },
      }),
    },
  };
};

export default EEExperiencePlugin;
