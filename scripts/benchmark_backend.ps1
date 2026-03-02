param(
  [string]$OutputPath = "docs/reports/backend-latency.json",
  [int]$Samples = 30,
  [int]$Port = 8099,
  [string]$AdminEmail = "bench-admin@example.com",
  [string]$AdminPassword = "BenchPass123"
)

$ErrorActionPreference = "Stop"

function Get-P95Ms {
  param([double[]]$Values)

  if (-not $Values -or $Values.Count -eq 0) {
    return 0
  }

  $sorted = $Values | Sort-Object
  $index = [Math]::Ceiling($sorted.Count * 0.95) - 1
  if ($index -lt 0) {
    $index = 0
  }
  return [Math]::Round($sorted[$index] * 1000, 2)
}

function Get-AvgMs {
  param([double[]]$Values)

  if (-not $Values -or $Values.Count -eq 0) {
    return 0
  }

  return [Math]::Round((($Values | Measure-Object -Average).Average * 1000), 2)
}

if ($Samples -lt 5) {
  throw "Samples must be >= 5"
}

if (!(Test-Path "docs/reports")) {
  New-Item -ItemType Directory -Path "docs/reports" | Out-Null
}

if (!(Test-Path "output")) {
  New-Item -ItemType Directory -Path "output" | Out-Null
}

$setupResult = php api/setup_admin.php --email=$AdminEmail --password=$AdminPassword 2>&1
if ($LASTEXITCODE -ne 0) {
  throw "Failed to upsert benchmark admin: $setupResult"
}

$server = $null

try {
  $server = Start-Process -FilePath "php" -ArgumentList "-S", "127.0.0.1:$Port", "-t", "." -WorkingDirectory (Get-Location).Path -PassThru
  Start-Sleep -Seconds 2

  $loginPayload = @{ email = $AdminEmail; password = $AdminPassword } | ConvertTo-Json -Compress
  $session = New-Object Microsoft.PowerShell.Commands.WebRequestSession
  $loginResponse = Invoke-WebRequest -UseBasicParsing -Uri "http://127.0.0.1:$Port/api/auth/login.php" -Method POST -Body $loginPayload -ContentType "application/json" -WebSession $session
  $loginData = $null
  try {
    $loginData = $loginResponse.Content | ConvertFrom-Json
  } catch {
    throw "Benchmark login failed: invalid JSON response"
  }
  if (-not $loginData.ok) {
    throw "Benchmark login failed: $($loginResponse.Content)"
  }

  $productProbe = Invoke-WebRequest -UseBasicParsing -Uri "http://127.0.0.1:$Port/api/get_products.php" -Method GET -WebSession $session
  $productData = $null
  try {
    $productData = $productProbe.Content | ConvertFrom-Json
  } catch {
    throw "Benchmark probe failed: invalid get_products payload"
  }
  $productId = 0
  if ($productData.menuProducts -and $productData.menuProducts.Count -gt 0) {
    $productId = [int]$productData.menuProducts[0].id
  }
  if ($productId -le 0) {
    throw "Benchmark probe failed: no active menu product found"
  }

  $readTimes = New-Object System.Collections.Generic.List[Double]
  for ($i = 0; $i -lt $Samples; $i++) {
    $timer = [System.Diagnostics.Stopwatch]::StartNew()
    $null = Invoke-WebRequest -UseBasicParsing -Uri "http://127.0.0.1:$Port/api/get_products.php" -Method GET -WebSession $session
    $timer.Stop()
    $readTimes.Add($timer.Elapsed.TotalSeconds)
  }

  $writeTimes = New-Object System.Collections.Generic.List[Double]
  for ($i = 0; $i -lt $Samples; $i++) {
    $sortOrder = if ($i % 2 -eq 0) { 901 } else { 902 }
    $body = @{ id = $productId; sort_order = $sortOrder } | ConvertTo-Json -Compress
    $timer = [System.Diagnostics.Stopwatch]::StartNew()
    $null = Invoke-WebRequest -UseBasicParsing -Uri "http://127.0.0.1:$Port/api/products/update.php" -Method POST -Body $body -ContentType "application/json" -WebSession $session
    $timer.Stop()
    $writeTimes.Add($timer.Elapsed.TotalSeconds)
  }

  $resetBody = @{ id = $productId; sort_order = 1 } | ConvertTo-Json -Compress
  $null = Invoke-WebRequest -UseBasicParsing -Uri "http://127.0.0.1:$Port/api/products/update.php" -Method POST -Body $resetBody -ContentType "application/json" -WebSession $session

  $result = [ordered]@{
    measured_at = (Get-Date).ToString("s")
    samples = $Samples
    read_p95_ms = Get-P95Ms -Values $readTimes.ToArray()
    write_p95_ms = Get-P95Ms -Values $writeTimes.ToArray()
    read_avg_ms = Get-AvgMs -Values $readTimes.ToArray()
    write_avg_ms = Get-AvgMs -Values $writeTimes.ToArray()
    objectives = [ordered]@{
      read_p95_target_ms = 300
      write_p95_target_ms = 500
      read_p95_ok = ((Get-P95Ms -Values $readTimes.ToArray()) -le 300)
      write_p95_ok = ((Get-P95Ms -Values $writeTimes.ToArray()) -le 500)
    }
  }

  $json = $result | ConvertTo-Json -Depth 5
  Set-Content -Path $OutputPath -Value $json -Encoding UTF8
  Write-Output $json
}
finally {
  if ($server -and !$server.HasExited) {
    Stop-Process -Id $server.Id -Force
  }
}
