param(
    [int]$Port = 8080
)

$ErrorActionPreference = "SilentlyContinue"

$conn = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
if (-not $conn) {
    Write-Host "stopped"
    exit 0
}

$pid = $conn.OwningProcess
$proc = Get-Process -Id $pid -ErrorAction SilentlyContinue

if (-not $proc) {
    Write-Host "stopped"
    exit 0
}

try {
    $response = Invoke-WebRequest -Uri "http://localhost:$Port/api/v1/concepts" -UseBasicParsing -TimeoutSec 3
    $count = ($response.Content | ConvertFrom-Json).Count
    Write-Host "running (PID: $pid, Memory: $([math]::Round($proc.WorkingSet64/1MB,1))MB, Concepts: $count)"
} catch {
    Write-Host "starting (PID: $pid)"
}
