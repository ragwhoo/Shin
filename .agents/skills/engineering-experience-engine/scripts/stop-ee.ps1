param(
    [int]$Port = 8080,
    [int]$GracePeriodSeconds = 5
)

$ErrorActionPreference = "SilentlyContinue"

$conns = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue | Where-Object { $_.State -eq "Listen" }
if (-not $conns) {
    Write-Host "EE not running on port $Port"
    exit 0
}

# Find the Java process owning the port (skip any shell wrappers)
$pid = ($conns | ForEach-Object { $_.OwningProcess } | Select-Object -Unique | Where-Object {
    $p = Get-Process -Id $_ -ErrorAction SilentlyContinue
    $p -and $p.ProcessName -eq "java"
}) | Select-Object -First 1

if (-not $pid) {
    Write-Host "EE Java process not found on port $Port"
    exit 0
}

$proc = Get-Process -Id $pid -ErrorAction SilentlyContinue

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
