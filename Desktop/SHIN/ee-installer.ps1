<#
.SYNOPSIS
    One-command installer for Engineering Experience Engine
    Run: irm https://ee.dev/install.ps1 | iex
#>

$ErrorActionPreference = "Stop"
$Host.UI.RawUI.WindowTitle = "Engineering Experience Engine — Installing..."

# ─── Config ──────────────────────────────────────────────────
$EE_HOME = Join-Path $env:USERPROFILE "EE"
$BRAIN_DIR = Join-Path $EE_HOME "engineering-brain"
$PLUGIN_DIR = "$env:USERPROFILE\.config\opencode\plugins\ee-experience"
$SKILL_DIR = "$env:USERPROFILE\.agents\skills\engineering-experience-engine"
$PORT = 8080

function Write-Step {
    param([string]$Message)
    Write-Host "`n→ $Message" -ForegroundColor Cyan
}

function Write-OK {
    Write-Host "  ✓" -ForegroundColor Green
}

# ─── 1. Check/Install Java ───────────────────────────────────
Write-Step "Checking Java..."
$javaVer = (java -version 2>&1) -join "`n"
if ($javaVer -match '"(\d+)') {
    $ver = $Matches[1]
    if ([int]$ver -ge 21) {
        Write-OK
    } else {
        Write-Host "  Java $ver found, need 21+. Installing..." -ForegroundColor Yellow
        winget install "Eclipse Temurin 21 LTS" --accept-source-agreements 2>&1 | Out-Null
    }
} else {
    Write-Host "  Java not found. Installing..." -ForegroundColor Yellow
    winget install "Eclipse Temurin 21 LTS" --accept-source-agreements 2>&1 | Out-Null
}

# ─── 2. Download EE ──────────────────────────────────────────
if (-not (Test-Path $EE_HOME)) {
    Write-Step "Downloading EE..."
    New-Item -ItemType Directory -Path $EE_HOME -Force | Out-Null
    
    # Download from GitHub releases (replace URL with your actual release)
    $releaseUrl = "https://github.com/YOUR_USER/experience-engine/releases/latest/download/ee.zip"
    $zipPath = "$env:TEMP\ee.zip"
    
    try {
        Invoke-WebRequest -Uri $releaseUrl -OutFile $zipPath -UseBasicParsing -TimeoutSec 60
        Expand-Archive -Path $zipPath -DestinationPath $EE_HOME -Force
        Remove-Item $zipPath -Force
        Write-OK
    } catch {
        Write-Host "  Download failed. Using local files if available..." -ForegroundColor Yellow
        # Fallback: check if running from SHIN directory
        $localPath = Join-Path $PSScriptRoot ".."
        if (Test-Path (Join-Path $localPath "engineering-brain")) {
            Copy-Item -Recurse -Path (Join-Path $localPath "engineering-brain") -Destination $EE_HOME -Force
            Copy-Item -Recurse -Path (Join-Path $localPath "experience-engine") -Destination $EE_HOME -Force
        }
    }
}

# ─── 3. Build JAR ────────────────────────────────────────────
$JAR = Join-Path $EE_HOME "experience-engine\backend\target\experience-engine-0.1.0.jar"
if (-not (Test-Path $JAR)) {
    Write-Step "Building EE backend..."
    $backendDir = Join-Path $EE_HOME "experience-engine\backend"
    if (Get-Command "mvn.cmd" -ErrorAction SilentlyContinue) {
        & mvn.cmd package -DskipTests -q -f $backendDir 2>&1 | Out-Null
    } elseif (Get-Command "mvn" -ErrorAction SilentlyContinue) {
        & mvn package -DskipTests -q -f $backendDir 2>&1 | Out-Null
    } else {
        Write-Host "  Installing Maven..."
        winget install Apache.Maven --accept-source-agreements 2>&1 | Out-Null
        $env:Path = [Environment]::GetEnvironmentVariable("Path", "Machine")
        & mvn.cmd package -DskipTests -q -f $backendDir 2>&1 | Out-Null
    }
    if (Test-Path $JAR) { Write-OK } else { Write-Host "  ✗ Failed" -ForegroundColor Red }
}

# ─── 4. Install plugin ───────────────────────────────────────
Write-Step "Installing OpenCode plugin..."
$pluginSrc = Join-Path $EE_HOME "experience-engine\plugin"
if (Test-Path $pluginSrc) {
    if (-not (Test-Path $PLUGIN_DIR)) { New-Item -ItemType Directory -Path $PLUGIN_DIR -Force | Out-Null }
    Copy-Item -Recurse -Path "$pluginSrc\*" -Destination $PLUGIN_DIR -Force
    Write-OK
} else {
    Write-Host "  Plugin files not found - copy manually from source" -ForegroundColor Yellow
}

# ─── 5. Install skill ────────────────────────────────────────
Write-Step "Installing skill..."
$skillSrc = Join-Path $EE_HOME "experience-engine\skill"
if (Test-Path $skillSrc) {
    if (-not (Test-Path $SKILL_DIR)) { New-Item -ItemType Directory -Path $SKILL_DIR -Force | Out-Null }
    Copy-Item -Recurse -Path "$skillSrc\*" -Destination $SKILL_DIR -Force
    Write-OK
} else {
    Write-Host "  Skill files not found - copy manually from source" -ForegroundColor Yellow
}

# ─── 6. Start backend ────────────────────────────────────────
Write-Step "Starting EE backend..."
try {
    $r = Invoke-WebRequest -Uri "http://localhost:$PORT/api/v1/concepts" -UseBasicParsing -TimeoutSec 2
    if ($r.StatusCode -eq 200) {
        Write-Host "  EE already running" -ForegroundColor Green
    }
} catch {
    $env:ENGINEERING_BRAIN_PATH = $BRAIN_DIR
    $proc = Start-Process -WindowStyle Hidden -FilePath "java.exe" `
        -ArgumentList "-jar ""$JAR"" --experience-engine.brain-path=""$BRAIN_DIR""" `
        -WorkingDirectory (Join-Path $EE_HOME "experience-engine\backend") -PassThru
    
    for ($i = 0; $i -lt 30; $i++) {
        Start-Sleep -Seconds 1
        try {
            $r = Invoke-WebRequest -Uri "http://localhost:$PORT/api/v1/concepts" -UseBasicParsing -TimeoutSec 2
            if ($r.StatusCode -eq 200) { break }
        } catch {}
    }
}

# ─── Done ─────────────────────────────────────────────────────
Write-Host ""
Write-Host "══════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host "  EE is ready!" -ForegroundColor Green
Write-Host "  Concepts loaded: $((Invoke-WebRequest -Uri "http://localhost:$PORT/api/v1/concepts" -UseBasicParsing).Content | ConvertFrom-Json | ForEach-Object Count)" -ForegroundColor Green
Write-Host "" -ForegroundColor Green
Write-Host "  Tell your OpenCode agent:" -ForegroundColor White
Write-Host "  'load the engineering-experience-engine skill'" -ForegroundColor Cyan
Write-Host "══════════════════════════════════════════════════════" -ForegroundColor Green
