param(
    [int]$Port = 8080,
    [int]$GracePeriodSeconds = 5
)

$ErrorActionPreference = "SilentlyContinue"

$conn = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
if (-not $conn) {
    Write-Host "EE not running on port $Port"
    exit 0
}

$pid = $conn.OwningProcess
$proc = Get-Process -Id $pid -ErrorAction SilentlyContinue
if (-not $proc) {
    Write-Host "EE process not found (PID: $pid)"
    exit 0
}

Write-Host "Stopping EE (PID: $pid, Process: $($proc.ProcessName))..."

# Graceful shutdown via close
$proc.CloseMainWindow() | Out-Null
Start-Sleep -Seconds $GracePeriodSeconds

# Force kill if still running
if (-not $proc.HasExited) {
    Write-Host "Graceful shutdown timed out, force killing..."
    $proc.Kill()
    Start-Sleep -Seconds 1
}

Write-Host "EE stopped"
exit 0
