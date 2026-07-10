param(
    [string]$BrainPath = "$env:USERPROFILE\Desktop\SHIN\engineering-brain",
    [string]$BackendPath = "$env:USERPROFILE\Desktop\SHIN\experience-engine\backend",
    [int]$Port = 8080,
    [int]$TimeoutSeconds = 30
)

$ErrorActionPreference = "Stop"

# Check if already running
try {
    $existing = Invoke-WebRequest -Uri "http://localhost:$Port/api/v1/concepts" -UseBasicParsing -TimeoutSec 3
    if ($existing.StatusCode -eq 200) {
        Write-Host "EE already running on port $Port"
        exit 0
    }
} catch { }

# Validate paths
if (-not (Test-Path $BrainPath)) {
    Write-Error "engineering-brain not found at $BrainPath"
    exit 1
}
if (-not (Test-Path $BackendPath)) {
    Write-Error "experience-engine backend not found at $BackendPath"
    exit 1
}

$JarPath = Join-Path $BackendPath "target\experience-engine-0.1.0.jar"

# Build JAR if missing
if (-not (Test-Path $JarPath)) {
    Write-Host "JAR not found. Building with Maven (needed once)..."
    try {
        $build = Start-Process -NoNewWindow -FilePath "mvn.cmd" `
            -ArgumentList "package -DskipTests -q" `
            -WorkingDirectory $BackendPath `
            -PassThru -Wait
        if ($build.ExitCode -ne 0) {
            Write-Error "Maven build failed"
            exit 1
        }
    } catch {
        Write-Error "Maven not found. Install Java 21 and Maven, or run: cd $BackendPath && mvn spring-boot:run"
        exit 1
    }
}

Write-Host "Starting EE backend..."

$env:ENGINEERING_BRAIN_PATH = $BrainPath

$process = Start-Process -WindowStyle Hidden -FilePath "java.exe" `
    -ArgumentList "-jar ""$JarPath"" --experience-engine.brain-path=""$BrainPath""" `
    -WorkingDirectory $BackendPath `
    -PassThru

# Wait for service to be ready
$timer = [System.Diagnostics.Stopwatch]::StartNew()
while ($timer.Elapsed.TotalSeconds -lt $TimeoutSeconds) {
    Start-Sleep -Milliseconds 1000
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:$Port/api/v1/concepts" -UseBasicParsing -TimeoutSec 2
        if ($response.StatusCode -eq 200) {
            $elapsed = [math]::Round($timer.Elapsed.TotalSeconds, 1)
            Write-Host "EE started in ${elapsed}s on port $Port"
            exit 0
        }
    } catch { }
}

Write-Error "EE failed to start within ${TimeoutSeconds}s"
exit 1
