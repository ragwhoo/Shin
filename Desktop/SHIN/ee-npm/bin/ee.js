#!/usr/bin/env node
const { execSync, spawn } = require("child_process");
const { existsSync, mkdirSync } = require("fs");
const { join } = require("path");
const path = require("path");
const https = require("https");
const http = require("http");
const os = require("os");
const figlet = require("figlet");

const PKG = require(join(__dirname, "..", "package.json"));
const VERSION = PKG.version;
const EE_HOME = join(os.homedir(), ".ee");
const BRAIN_DIR = join(EE_HOME, "engineering-brain");
const JAR = join(EE_HOME, "ee.jar");
const PLUGIN_DIR = join(os.homedir(), ".config", "opencode", "plugins", "ee-experience");
const SKILL_DIR = join(os.homedir(), ".agents", "skills", "engineering-experience-engine");
const RELEASE_URL = "https://github.com/ragwhoo/Shin/releases/latest/download/ee.zip";
const PORT = 8080;

const cmd = process.argv[2];

const ASCII = figlet.textSync("SHIN EXPERIENCE\nENGINE", { font: "ANSI Shadow" });

function log(msg) { console.log(msg); }
function ok(msg) { console.log(`  \u2713 ${msg}`); }
function step(msg) { console.log(`\n\u2192 ${msg}`); }

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const fs = require("fs");
    const file = fs.createWriteStream(dest);
    const proto = url.startsWith("https") ? https : http;
    proto.get(url, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        file.close();
        fs.unlink(dest, () => {});
        download(res.headers.location, dest).then(resolve).catch(reject);
        return;
      }
      res.pipe(file);
      file.on("finish", () => {
        file.close();
        // Small delay to ensure OS releases file lock
        setTimeout(resolve, 500);
      });
    }).on("error", err => {
      file.close();
      fs.unlink(dest, () => {});
      reject(err);
    });
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

function installJava() {
  try {
    execSync("winget install --id EclipseAdoptium.Temurin.21.JDK --accept-package-agreements --silent 2>&1", { encoding: "utf-8", timeout: 120000 });
    ok("Java 21 installed via winget");
  } catch {
    log("  Auto-install failed. Install manually from: https://adoptium.net/");
    process.exit(1);
  }
}

async function ensureSetup() {
  if (existsSync(JAR)) return true;

  step("SHIN v" + VERSION + " first-time setup (developed by ragwhoo)");

  // Check/Install Java
  try {
    const v = execSync("java -version 2>&1", { encoding: "utf-8" });
    if (!v.match(/"(\d+)/) || parseInt(v.match(/"(\d+)/)[1]) < 21) {
      log("  Java version too old. Installing Java 21...");
      installJava();
    } else {
      ok("Java found");
    }
  } catch {
    log("  Java not found. Installing Java 21...");
    installJava();
  }

  // Download EE
  step("Downloading SHIN (" + RELEASE_URL + ")");
  if (!existsSync(EE_HOME)) mkdirSync(EE_HOME, { recursive: true });
  const zipPath = join(os.tmpdir(), "ee.zip");
  try {
    await download(RELEASE_URL, zipPath);
    ok("Downloaded");
  } catch (e) {
    log("  Download failed: " + e.message);
    return false;
  }

  // Extract
  step("Extracting...");
  try {
    execSync(
      `powershell -Command "Start-Sleep 1; Expand-Archive -Path '${zipPath}' -DestinationPath '${EE_HOME}' -Force"`,
      { encoding: "utf-8", timeout: 30000 }
    );
    execSync(`del "${zipPath}"`, { encoding: "utf-8", timeout: 5000 });
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
  if (cmd === "--version" || cmd === "-v") {
    log("shin-engine v" + VERSION);
    return;
  }

  if (!cmd) {
    log(ASCII);
    log("  shin-engine v" + VERSION + " — (developed by ragwhoo)");
    log("");
    log("  Install:  npm install -g shin-engine");
    log("  Usage:    shin --help");
    return;
  }

  if (cmd === "start") {
    if (isRunning()) { log("SHIN v" + VERSION + " is already running on port " + PORT); return; }
    const setup = await ensureSetup();
    if (!setup) { process.exit(1); }

    step("Starting SHIN backend...");
    const env = { ...process.env, ENGINEERING_BRAIN_PATH: BRAIN_DIR };
    const child = spawn("java", [
      "-jar", JAR,
      "--experience-engine.brain-path=" + BRAIN_DIR
    ], { env, stdio: "ignore", detached: true });
    child.unref();

    for (let i = 0; i < 30; i++) {
      await sleep(1000);
      if (isRunning()) {
        log("SHIN v" + VERSION + " ready on port " + PORT + " (developed by ragwhoo)");
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
      log("SHIN stopped");
    } catch { log("SHIN not running"); }
    return;
  }

  if (cmd === "status") {
    if (isRunning()) {
      log("SHIN v" + VERSION + " is running on port " + PORT);
    } else {
      log("SHIN is not running");
    }
    return;
  }

  if (cmd === "view") {
    if (!isRunning()) { log("SHIN is not running. Run 'shin start' first."); return; }
    execSync("powershell -Command \"Start-Process 'http://localhost:" + PORT + "'\"", { timeout: 5000 });
    log("Opening SHIN dashboard...");
    return;
  }

  if (cmd === "--help" || cmd === "-h") {
    log(ASCII);
    log("  shin-engine v" + VERSION + " — (developed by ragwhoo)");
    log("");
    log("Install:");
    log("  npm install -g shin-engine");
    log("");
    log("Commands:");
    log("  shin start    Start the SHIN backend (first run downloads + installs)");
    log("  shin stop     Stop the SHIN backend");
    log("  shin status   Check if SHIN is running");
    log("  shin view     Open the SHIN dashboard in browser");
    log("  shin --version  Show version");
    return;
  }

  log("Unknown command: " + cmd);
  log("Run 'shin --help' for usage");
}

main().catch(e => { console.error(e); process.exit(1); });
