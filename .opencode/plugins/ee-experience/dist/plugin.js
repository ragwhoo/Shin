import { execSync } from "child_process";
import { existsSync, appendFileSync, mkdirSync } from "fs";
import { join } from "path";

const SCRIPTS_DIR = join(process.env.USERPROFILE, ".agents", "skills", "engineering-experience-engine", "scripts");
const BRAIN_DIR = join(process.env.USERPROFILE, "Desktop", "SHIN", "engineering-brain");
const PENDING_LEARN_DIR = join(process.env.USERPROFILE, ".agents", "skills", "engineering-experience-engine");

const STATE = {
  reviewed: new Set(),
  implemented: new Set(),
  learned: new Set(),
  pendingTasks: new Map(),
};

const IMPLEMENTATION_TOOLS = new Set(["edit", "write"]);

function isRunning() {
  try {
    const res = execSync(
      `powershell -Command "try { $r = Invoke-WebRequest -Uri 'http://localhost:8080/api/v1/concepts' -UseBasicParsing -TimeoutSec 3; Write-Output $r.StatusCode } catch { Write-Output 'down' }"`,
      { encoding: "utf-8", timeout: 10000 }
    ).trim();
    return res === "200";
  } catch { return false; }
}

function autoStart() {
  const scriptPath = join(SCRIPTS_DIR, "start-ee.ps1");
  if (!existsSync(scriptPath)) return "Script not found";
  try {
    return execSync(`powershell -File "${scriptPath}"`, {
      encoding: "utf-8", timeout: 120000,
      env: { ...process.env, ENGINEERING_BRAIN_PATH: BRAIN_DIR },
    }).trim();
  } catch (e) {
    return e.stderr || e.message;
  }
}

function queuePendingLearning(sessionId) {
  const task = STATE.pendingTasks.get(sessionId) || "unknown task";
  const filePath = join(PENDING_LEARN_DIR, "pending-learn.yml");
  const entry = `\n# Pending learning from session ${sessionId} (${new Date().toISOString()})\n# Task: ${task}\n# The session completed implementation without extracting learnings.\n# Write a .md file to engineering-brain/learnings/ with what you learned.\n`;
  try {
    if (!existsSync(PENDING_LEARN_DIR)) mkdirSync(PENDING_LEARN_DIR, { recursive: true });
    appendFileSync(filePath, entry, "utf-8");
  } catch {}
}

function isImplementationTool(toolName) {
  return IMPLEMENTATION_TOOLS.has(toolName);
}

function isImplementationPermission(type) {
  if (!type || typeof type !== "string") return false;
  const impl = ["write", "modify", "create", "delete", "edit", "execute", "command", "file_write", "workspace_write", "file_modify"];
  return impl.some(k => type.toLowerCase().includes(k));
}

function needsReview(sessionId) {
  return !STATE.reviewed.has(sessionId);
}

function needsLearning(sessionId) {
  return STATE.reviewed.has(sessionId) && STATE.implemented.has(sessionId) && !STATE.learned.has(sessionId);
}

// Detect whether a bash command performs EE review API call
function isEEApiCall(command) {
  const c = command.toLowerCase();
  return c.includes("localhost:8080/api/v1/");
}

// Detect whether bash output contains a valid EE review response
function parseReviewFromOutput(output) {
  try {
    const jsonMatch = output.match(/\{(?:[^{}]|(?:[^{}]*))*\}/s);
    if (!jsonMatch) return null;
    const parsed = JSON.parse(jsonMatch[0]);
    if (parsed && (parsed.concepts || parsed.lessons || parsed.warnings)) {
      return parsed;
    }
  } catch {}
  return null;
}

// Detect whether bash output contains a valid EE learn response
function parseLearnFromOutput(output) {
  try {
    if (output.includes("success") || output.includes("saved") || output.includes("written")) {
      return true;
    }
  } catch {}
  return false;
}

export const EEExperiencePlugin = async (ctx) => {
  return {
    "experimental.chat.system.transform": async (input, output) => {
      output.system.push(
        "",
        "=== ENGINEERING EXPERIENCE ENGINE ===",
        "Review first: curl -X POST http://localhost:8080/api/v1/review -H \"Content-Type: application/json\" -d '{\"task\":\"...\"}'",
        "edit/write blocked until review succeeds. No exceptions.",
        "Learn after: curl -X POST http://localhost:8080/api/v1/learn -H \"Content-Type: application/json\" -d '{\"type\":\"experience\",\"title\":\"...\",\"content\":\"...\"}'",
        "====================================="
      );
    },

    "permission.ask": async (input, output) => {
      const sessionId = input?.sessionID || "default";
      if (isImplementationPermission(input?.type) && needsReview(sessionId)) {
        output.status = "deny";
      }
    },

    "tool.execute.before": async (input, output) => {
      const sessionId = input.sessionID || "default";
      const toolName = input.tool;

      if (toolName === "bash") {
        const cmd = output.args?.command || "";
        if (isEEApiCall(cmd) && !isRunning()) {
          const result = autoStart();
          for (let i = 0; i < 15; i++) {
            execSync("powershell -Command \"Start-Sleep -Seconds 2\"", { encoding: "utf-8", timeout: 5000 });
            if (isRunning()) break;
          }
          if (!isRunning()) {
            output.args.command = `Write-Host 'EE backend failed to start: ${result.replace(/'/g, "''")}'`;
          }
        }
        return;
      }

      if (isImplementationTool(toolName)) {
        if (needsReview(sessionId)) {
          const blockMsg = `\n=== BLOCKED BY ENGINEERING EXPERIENCE ENGINE ===\n\nThis implementation tool (${toolName}) cannot execute because:\n\n  Engineering Experience Review has not been completed.\n\nRequired workflow:\n  1. curl.exe -X POST http://localhost:8080/api/v1/review -H \"Content-Type: application/json\" -d '{\"task\":\"your task description\"}'\n  2. Review the judgment package\n  3. State adopted recommendations\n  4. Produce plan\n  5. Then implement\n\nRun the review curl command now, then retry this operation.\n================================================\n`;

          if (toolName === "edit") {
            output.args = { ...output.args, oldString: "__EE_BLOCK__NO_MATCH_TOKEN__", newString: "" };
          } else if (toolName === "write") {
            const tempDir = process.env.TEMP || "C:\\Temp";
            const safePath = join(tempDir, `EE_BLOCKED_${Date.now()}.txt`);
            output.args = { ...output.args, filePath: safePath, content: blockMsg };
          }

          console.log(`[EE] BLOCKED ${toolName} for session ${sessionId} — review required`);
          return;
        }

        if (!STATE.implemented.has(sessionId)) {
          STATE.implemented.add(sessionId);
          console.log(`[EE] TRACK implementation started for session ${sessionId}`);
        }
      }
    },

    "tool.execute.after": async (input, output) => {
      const sessionId = input.sessionID || "default";
      const toolName = input.tool;

      if (toolName === "bash") {
        const cmd = input.args?.command || "";
        const result = output?.output || "";

        if (isEEApiCall(cmd)) {
          const reviewData = parseReviewFromOutput(result);
          if (reviewData) {
            STATE.reviewed.add(sessionId);
            STATE.pendingTasks.set(sessionId, cmd);
            console.log(`[EE] Review detected via bash for session ${sessionId}`);
          } else if (parseLearnFromOutput(result)) {
            STATE.learned.add(sessionId);
            console.log(`[EE] Learning detected via bash for session ${sessionId}`);
          }
        }
      }
    },

    event: async ({ event }) => {
      if (event.type === "session.status") {
        const status = event.properties?.status;
        const sessionId = event.properties?.sessionID || "default";

        if (status === "end" || status === "idle") {
          if (needsLearning(sessionId)) {
            queuePendingLearning(sessionId);
            console.log(`[EE] Session ended with pending learning: ${sessionId}`);
          }

          STATE.reviewed.delete(sessionId);
          STATE.implemented.delete(sessionId);
          STATE.learned.delete(sessionId);
          STATE.pendingTasks.delete(sessionId);
        }
      }
    },
  };
};

export default EEExperiencePlugin;
