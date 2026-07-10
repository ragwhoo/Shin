<#
.SYNOPSIS
    Packages EE into a release zip for distribution
    Output: dist/ee.zip
#>

$ErrorActionPreference = "Stop"
$ROOT = $PSScriptRoot
$DIST = Join-Path $ROOT "dist"
$STAGING = Join-Path $DIST "ee"

Write-Host "Packaging EE release..." -ForegroundColor Cyan

# Clean
if (Test-Path $STAGING) { Remove-Item -Recurse -Force $STAGING }
New-Item -ItemType Directory -Path $STAGING -Force | Out-Null
New-Item -ItemType Directory -Path "$STAGING\engineering-brain" -Force | Out-Null
New-Item -ItemType Directory -Path "$STAGING\plugin\dist" -Force | Out-Null
New-Item -ItemType Directory -Path "$STAGING\skill\scripts" -Force | Out-Null

# 1. Build the JAR
Write-Host "  Building JAR..." -NoNewline
$backend = Join-Path $ROOT "experience-engine\backend"
& mvn.cmd package -DskipTests -q -f $backend 2>&1 | Out-Null
Copy-Item (Join-Path $backend "target\experience-engine-0.1.0.jar") "$STAGING\ee.jar"
Write-Host " OK"

# 2. Brain YAML files
Write-Host "  Copying brain..." -NoNewline
Copy-Item -Recurse (Join-Path $ROOT "engineering-brain\*") "$STAGING\engineering-brain\" -Force
Write-Host " OK"

# 3. Plugin
Write-Host "  Copying plugin..." -NoNewline
$pluginSrc = "$env:USERPROFILE\.opencode\plugins\ee-experience"
if (Test-Path $pluginSrc) {
    Copy-Item (Join-Path $pluginSrc "dist\plugin.js") "$STAGING\plugin\dist\" -Force
    Copy-Item (Join-Path $pluginSrc "plugin.json") "$STAGING\plugin\" -Force
    Copy-Item (Join-Path $pluginSrc "package.json") "$STAGING\plugin\" -Force
    Write-Host " OK"
} else {
    Write-Host " SKIP (plugin not found)"
}

# 4. Skill
Write-Host "  Copying skill..." -NoNewline
$skillSrc = "$env:USERPROFILE\.agents\skills\engineering-experience-engine"
if (Test-Path $skillSrc) {
    Copy-Item (Join-Path $skillSrc "SKILL.md") "$STAGING\skill\" -Force
    New-Item -ItemType Directory -Path "$STAGING\skill\scripts" -Force | Out-Null
    Copy-Item (Join-Path $skillSrc "scripts\*.ps1") "$STAGING\skill\scripts\" -Force
    Write-Host " OK"
} else {
    Write-Host " SKIP (skill not found)"
}

# 5. Start script
Write-Host "  Creating start.ps1..." -NoNewline
@"
param(`$Port = 8080)
`$jar = Join-Path `$PSScriptRoot "ee.jar"
`$brain = Join-Path `$PSScriptRoot "engineering-brain"
Write-Host "Starting SHIN..."
`$env:ENGINEERING_BRAIN_PATH = `$brain
`$proc = Start-Process -WindowStyle Hidden -FilePath "java.exe" `
    -ArgumentList "-jar ""`$jar"" --experience-engine.brain-path=""`$brain""" -PassThru
for (`$i = 0; `$i -lt 30; `$i++) {
    Start-Sleep -Seconds 1
    try { `$r = Invoke-WebRequest -Uri "http://localhost:`$Port/api/v1/concepts" -UseBasicParsing -TimeoutSec 2
          if (`$r.StatusCode -eq 200) { Write-Host "SHIN ready on port `$Port"; exit 0 } } catch {}
}
Write-Host "Failed to start" -ForegroundColor Red; exit 1
"@ | Set-Content "$STAGING\start.ps1" -Force
Write-Host " OK"

# 6. Zip it
Write-Host "  Creating zip..." -NoNewline
$zipFile = "$DIST\ee.zip"
if (Test-Path $zipFile) { Remove-Item $zipFile -Force }
Add-Type -AssemblyName System.IO.Compression.FileSystem
[System.IO.Compression.ZipFile]::CreateFromDirectory($STAGING, $zipFile)
$size = [math]::Round((Get-Item $zipFile).Length / 1MB, 1)
Write-Host " OK"

# Cleanup staging
Remove-Item -Recurse -Force $STAGING

Write-Host ""
Write-Host ("Release: " + $zipFile + " (" + $size + " MB)") -ForegroundColor Green
