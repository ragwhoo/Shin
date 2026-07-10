param([switch]$Silent)

$ErrorActionPreference = "Stop"
$BACKEND = Join-Path $PSScriptRoot "experience-engine\backend"
$JAR = Join-Path $BACKEND "target\experience-engine-0.1.0.jar"
$BRAIN = Join-Path $PSScriptRoot "engineering-brain"
$PORT = 8080

# ── Check Java ──────────────────────────────────────────────
$v = (java -version 2>&1) -join "`n"
if ($v -notmatch "version") {
    Write-Host "Java 21 required. Download: https://adoptium.net/" -ForegroundColor Red
    exit 1
}

# ── Already running? ────────────────────────────────────────
try {
    $r = Invoke-WebRequest -Uri "http://localhost:$PORT/api/v1/concepts" -UseBasicParsing -TimeoutSec 2
    if ($r.StatusCode -eq 200) { Write-Host "EE already running"; exit 0 }
} catch {}

# ── Build JAR if missing ────────────────────────────────────
if (-not (Test-Path $JAR)) {
    Write-Host "Building (one-time)..."
    $mvn = if (Get-Command "mvn.cmd" -ErrorAction SilentlyContinue) { "mvn.cmd" }
           elseif (Get-Command "mvn" -ErrorAction SilentlyContinue) { "mvn" }
           else { Write-Host "Maven not found. Run: winget install Apache.Maven"; exit 1 }
    & $mvn package -DskipTests -q -f $BACKEND
}

# ── Start ───────────────────────────────────────────────────
$env:ENGINEERING_BRAIN_PATH = $BRAIN
$proc = Start-Process -WindowStyle Hidden -FilePath "java.exe" `
    -ArgumentList "-jar ""$JAR"" --experience-engine.brain-path=""$BRAIN""" `
    -WorkingDirectory $BACKEND -PassThru

for ($i = 0; $i -lt 30; $i++) {
    Start-Sleep -Seconds 1
    try { $r = Invoke-WebRequest -Uri "http://localhost:$PORT/api/v1/concepts" -UseBasicParsing -TimeoutSec 2
          if ($r.StatusCode -eq 200) {
              Write-Host "EE ready on port $PORT"
              if (-not $Silent) {
                  Write-Host ""
                  Write-Host "Tell your agent: 'load the engineering-experience-engine skill'" -ForegroundColor Cyan
              }
              exit 0
          }
    } catch {}
}
Write-Host "Failed to start" -ForegroundColor Red
exit 1
