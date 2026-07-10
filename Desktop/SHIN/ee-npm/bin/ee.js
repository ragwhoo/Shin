#!/usr/bin/env node
const { execSync, spawn } = require("child_process");
const { existsSync, mkdirSync } = require("fs");
const { join } = require("path");
const path = require("path");
const https = require("https");
const http = require("http");
const os = require("os");

const EE_HOME = join(os.homedir(), ".ee");
const BRAIN_DIR = join(EE_HOME, "engineering-brain");
const JAR = join(EE_HOME, "ee.jar");
const PLUGIN_DIR = join(os.homedir(), ".config", "opencode", "plugins", "ee-experience");
const SKILL_DIR = join(os.homedir(), ".agents", "skills", "engineering-experience-engine");
const RELEASE_URL = "https://github.com/ragwhoo/Shin/releases/latest/download/ee.zip";
const PORT = 8080;

const cmd = process.argv[2];

function log(msg) { console.log(msg); }
function ok(msg) { console.log(`  \u2713 ${msg}`); }
function step(msg) { console.log(`\n\u2192 ${msg}`); }

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = require("fs").createWriteStream(dest);
    const proto = url.startsWith("https") ? https : http;
    proto.get(url, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        download(res.headers.location, dest).then(resolve).catch(reject);
        return;
      }
      res.pipe(file);
      file.on("finish", () => { file.close(); resolve(); });
    }).on("error", reject);
  });
}

function isRunning() {
  try {
    const res = require("child_process").execSync(
      `powershell -Command "try { $r = Invoke-WebRequest -Uri 'http://localhost:${PORT}/api/v1/concepts' -UseBasicParsing -TimeoutSec 3; Write-Output $r.StatusCode } catch { Write-Output 'down' }"`,
      { encoding: "utf-8", timeout: 10000 }
    ).trim();
    return res === "200";
  } catch { return false; }
}

async function ensureSetup() {
  if (existsSync(JAR)) return true;

  step("First-time setup");

  // Check Java
  try {
    const v = execSync("java -version 2>&1", { encoding: "utf-8" });
    if (!v.match(/"(\d+)/) || parseInt(v.match(/"(\d+)/)[1]) < 21) {
      log("  Java 21+ required. Install from: https://adoptium.net/");
      return false;
    }
    ok("Java found");
  } catch {
    log("  Java 21+ required. Install from: https://adoptium.net/");
    return false;
  }

  // Download EE
  step("Downloading EE (" + RELEASE_URL + ")");
  if (!existsSync(EE_HOME)) mkdirSync(EE_HOME, { recursive: true });
  const zipPath = join(os.tmpdir(), "ee.zip");
  try {
    await download(RELEASE_URL, zipPath);
    ok("Downloaded");
  } catch (e) {
    log("  Download failed: " + e.message);
    return false;
  }

  // Extract (use PowerShell for Windows zip extraction)
  step("Extracting...");
  try {
    execSync(
      `powershell -Command "Expand-Archive -Path '${zipPath}' -DestinationPath '${EE_HOME}' -Force"`,
      { encoding: "utf-8", timeout: 30000 }
    );
    require("fs").unlinkSync(zipPath);
    ok("Extracted to " + EE_HOME);
  } catch (e) {
    log("  Extraction failed: " + e.message);
    return false;
  }

  // Install plugin
  if (existsSync(join(EE_HOME, "plugin"))) {
    step("Installing OpenCode plugin...");
    if (!existsSync(PLUGIN_DIR)) mkdirSync(PLUGIN_DIR, { recursive: true });
    execSync(`xcopy "${join(EE_HOME, "plugin")}" "${PLUGIN_DIR}" /E /I /Y`, { encoding: "utf-8", timeout: 10000 });
    ok("Plugin installed");
  }

  // Install skill
  if (existsSync(join(EE_HOME, "skill"))) {
    step("Installing skill...");
    if (!existsSync(SKILL_DIR)) mkdirSync(SKILL_DIR, { recursive: true });
    execSync(`xcopy "${join(EE_HOME, "skill")}" "${SKILL_DIR}" /E /I /Y`, { encoding: "utf-8", timeout: 10000 });
    ok("Skill installed");
  }

  return true;
}

async function main() {
  if (!cmd || cmd === "start") {
    if (isRunning()) { log("EE is already running on port " + PORT); return; }
    const setup = await ensureSetup();
    if (!setup) { process.exit(1); }

    step("Starting EE backend...");
    const env = { ...process.env, ENGINEERING_BRAIN_PATH: BRAIN_DIR };
    const child = spawn("java", [
      "-jar", JAR,
      "--experience-engine.brain-path=" + BRAIN_DIR
    ], { env, stdio: "ignore", detached: true });
    child.unref();

    for (let i = 0; i < 30; i++) {
      await sleep(1000);
      if (isRunning()) {
        log("EE ready on port " + PORT);
        log("\nTell your OpenCode agent: 'load the engineering-experience-engine skill'");
        return;
      }
    }
    log("Failed to start within 30s");
    process.exit(1);
  }

  if (cmd === "stop") {
    try {
      execSync(
        `powershell -Command "$conn = Get-NetTCPConnection -LocalPort ${PORT} -ErrorAction SilentlyContinue; if ($conn) { $pids = $conn.OwningProcess; $pids | ForEach-Object { Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue }; Write-Output 'stopped' } else { Write-Output 'not running' }"`,
        { encoding: "utf-8", timeout: 10000 }
      );
      log("EE stopped");
    } catch { log("EE not running"); }
    return;
  }

  if (cmd === "status") {
    if (isRunning()) {
      log("EE is running on port " + PORT);
    } else {
      log("EE is not running");
    }
    return;
  }

  if (cmd === "--help" || cmd === "-h") {
    log("Usage: shin <command>");
    log("");
    log("Commands:");
    log("  shin start    Start the EE backend (first run downloads + installs)");
    log("  shin stop     Stop the EE backend");
    log("  shin status   Check if EE is running");
    return;
  }

  log("Unknown command: " + cmd);
  log("Run 'ee --help' for usage");
}

main().catch(e => { console.error(e); process.exit(1); });
