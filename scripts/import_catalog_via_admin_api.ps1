param(
  [string]$BaseUrl = 'https://amaliscafeteria.com',
  [Parameter(Mandatory = $true)][string]$SourceFile,
  [string]$CredentialsFile = '',
  [string]$AdminEmail = '',
  [string]$AdminPassword = '',
  [string]$BackupFile = '',
  [string]$ReportFile = '',
  [switch]$DryRun
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Normalize-Text([string]$value) {
  if ([string]::IsNullOrWhiteSpace($value)) {
    return ''
  }

  $normalized = $value.Trim().ToLowerInvariant().Normalize([Text.NormalizationForm]::FormD)
  $sb = New-Object Text.StringBuilder
  foreach ($ch in $normalized.ToCharArray()) {
    if ([Globalization.CharUnicodeInfo]::GetUnicodeCategory($ch) -ne [Globalization.UnicodeCategory]::NonSpacingMark) {
      [void]$sb.Append($ch)
    }
  }

  return [regex]::Replace($sb.ToString(), '\s+', ' ').Trim()
}

function Product-Key($name, $category) {
  return (Normalize-Text ([string]$name)) + '||' + (Normalize-Text ([string]$category))
}

function Invoke-JsonRequest {
  param(
    [Parameter(Mandatory = $true)][string]$Url,
    [Parameter(Mandatory = $true)][ValidateSet('GET', 'POST')][string]$Method,
    [Microsoft.PowerShell.Commands.WebRequestSession]$Session,
    $Body
  )

  if ($Method -eq 'GET') {
    $response = Invoke-WebRequest -Uri $Url -Method GET -WebSession $Session -UseBasicParsing -TimeoutSec 30
  } else {
    $jsonBody = if ($null -eq $Body) { '{}' } else { $Body | ConvertTo-Json -Depth 12 -Compress }
    $response = Invoke-WebRequest -Uri $Url -Method POST -ContentType 'application/json' -Body $jsonBody -WebSession $Session -UseBasicParsing -TimeoutSec 30
  }

  return ($response.Content | ConvertFrom-Json)
}

function Parse-AdminCredentials {
  param([Parameter(Mandatory = $true)][string]$Path)

  if (-not (Test-Path $Path)) {
    throw "credentials file not found: $Path"
  }

  $lines = Get-Content $Path
  $email = $null
  $password = $null

  foreach ($line in $lines) {
    if (-not $email -and $line -match '^[\s]*Usuario\s*:\s*(.+)$') {
      $email = $Matches[1].Trim()
    }

    if (-not $password -and $line -match '(?i)^[\s]*contrase[^:]*:\s*(.+)$') {
      $password = $Matches[1].Trim()
    }
  }

  if (-not $email -or -not $password) {
    throw "could not parse admin credentials from: $Path"
  }

  return @{
    email = $email
    password = $password
  }
}

if (-not (Test-Path $SourceFile)) {
  throw "source file not found: $SourceFile"
}

$rawSource = Get-Content -Raw $SourceFile | ConvertFrom-Json
$sourceProducts = @()

if ($rawSource -is [System.Array]) {
  $sourceProducts = @($rawSource)
} elseif ($null -ne $rawSource.menuProducts -and $rawSource.menuProducts -is [System.Array]) {
  $sourceProducts = @($rawSource.menuProducts)
} else {
  throw 'source file has invalid format (expected array or { menuProducts: [] })'
}

$credentials = $null
if (-not [string]::IsNullOrWhiteSpace($AdminEmail) -and -not [string]::IsNullOrWhiteSpace($AdminPassword)) {
  $credentials = @{
    email = $AdminEmail
    password = $AdminPassword
  }
} else {
  if ([string]::IsNullOrWhiteSpace($CredentialsFile)) {
    $foundCredentialFile = Get-ChildItem 'C:\Users\USUARIO\Downloads\amalis constr*' -ErrorAction SilentlyContinue | Select-Object -First 1
    if (-not $foundCredentialFile) {
      throw 'credentials file was not provided and could not be auto-discovered'
    }
    $CredentialsFile = $foundCredentialFile.FullName
  }
  $credentials = Parse-AdminCredentials -Path $CredentialsFile
}

$session = New-Object Microsoft.PowerShell.Commands.WebRequestSession

$login = Invoke-JsonRequest -Url "$BaseUrl/api/auth/login.php" -Method POST -Session $session -Body @{
  email = $credentials.email
  password = $credentials.password
}
if (-not $login.ok) {
  throw 'admin login failed'
}

$beforePayload = Invoke-JsonRequest -Url "$BaseUrl/api/get_products.php" -Method GET -Session $session
$beforeProducts = @($beforePayload.menuProducts)

if ([string]::IsNullOrWhiteSpace($BackupFile)) {
  $tsForBackup = Get-Date -Format 'yyyyMMdd_HHmmss'
  $BackupFile = "docs/exports/menu_products_copy_active_prod_preimport_$tsForBackup.json"
}

$backupDir = Split-Path -Path $BackupFile -Parent
if ($backupDir -and -not (Test-Path $backupDir)) {
  [void](New-Item -ItemType Directory -Path $backupDir -Force)
}

$backupPayload = [ordered]@{
  generated_at = (Get-Date).ToUniversalTime().ToString('o')
  source = "$BaseUrl/api/get_products.php"
  menuCategories = @($beforePayload.menuCategories)
  menuProducts = $beforeProducts
  featuredProducts = @($beforePayload.featuredProducts)
}
($backupPayload | ConvertTo-Json -Depth 12) + "`n" | Set-Content -Path $BackupFile -Encoding UTF8

$currentByKey = @{}
foreach ($product in $beforeProducts) {
  $key = Product-Key $product.name $product.category
  if (-not $currentByKey.ContainsKey($key)) {
    $currentByKey[$key] = @()
  }
  $currentByKey[$key] += ,$product
}
foreach ($key in @($currentByKey.Keys)) {
  $currentByKey[$key] = @($currentByKey[$key] | Sort-Object @{Expression = 'sort_order'; Ascending = $true}, @{Expression = 'id'; Ascending = $true})
}

$sourceSorted = @($sourceProducts | Sort-Object @{Expression = 'category'; Ascending = $true}, @{Expression = 'sort_order'; Ascending = $true}, @{Expression = 'name'; Ascending = $true})
$categoryCounters = @{}
$desiredProducts = @()

foreach ($product in $sourceSorted) {
  $category = [string]$product.category
  if (-not $categoryCounters.ContainsKey($category)) {
    $categoryCounters[$category] = 0
  }
  $categoryCounters[$category] = [int]$categoryCounters[$category] + 1

  $desiredProducts += ,([pscustomobject]@{
      name = [string]$product.name
      price = [double]$product.price
      category = $category
      description = [string]$product.description
      image = [string]$product.image
      alt_text = [string]$product.alt_text
      image_title = [string]$product.image_title
      chef_suggestion = [string]$product.chef_suggestion
      ingredients = @($product.ingredients)
      allergens = @($product.allergens)
      featured = [bool]$product.featured
      active = 1
      sort_order = [int]$categoryCounters[$category]
    })
}

$sourceKeys = New-Object 'System.Collections.Generic.HashSet[string]'
$deactivateIds = New-Object 'System.Collections.Generic.HashSet[int]'

$result = [ordered]@{
  dry_run = [bool]$DryRun
  source_file = (Resolve-Path $SourceFile).Path
  backup_file = (Resolve-Path $BackupFile).Path
  source_products = $desiredProducts.Count
  before_products = $beforeProducts.Count
  inserted = 0
  updated = 0
  deactivated = 0
  omitted = 0
  duplicate_conflicts = 0
  errors = @()
}

foreach ($desired in $desiredProducts) {
  $key = Product-Key $desired.name $desired.category
  [void]$sourceKeys.Add($key)

  $payload = [ordered]@{
    name = $desired.name
    price = $desired.price
    category = $desired.category
    description = $desired.description
    image = $desired.image
    alt_text = $desired.alt_text
    image_title = $desired.image_title
    chef_suggestion = $desired.chef_suggestion
    ingredients = @($desired.ingredients)
    allergens = @($desired.allergens)
    featured = $desired.featured
    active = 1
    sort_order = $desired.sort_order
  }

  if ($currentByKey.ContainsKey($key) -and $currentByKey[$key].Count -gt 0) {
    $primary = $currentByKey[$key][0]
    $payload.id = [int]$primary.id

    if (-not $DryRun) {
      try {
        $updateResponse = Invoke-JsonRequest -Url "$BaseUrl/api/products/update.php" -Method POST -Session $session -Body $payload
        if ($updateResponse.ok) {
          $result.updated++
        } else {
          $result.omitted++
          $result.errors += "update_not_ok: id=$($primary.id) name=$($desired.name) category=$($desired.category)"
        }
      } catch {
        $result.omitted++
        $result.errors += "update_exception: id=$($primary.id) name=$($desired.name) category=$($desired.category) message=$($_.Exception.Message)"
      }
    } else {
      $result.updated++
    }

    if ($currentByKey[$key].Count -gt 1) {
      $duplicates = @($currentByKey[$key][1..($currentByKey[$key].Count - 1)])
      foreach ($dup in $duplicates) {
        [void]$deactivateIds.Add([int]$dup.id)
        $result.duplicate_conflicts++
      }
    }
  } else {
    if (-not $DryRun) {
      try {
        $createResponse = Invoke-JsonRequest -Url "$BaseUrl/api/products/create.php" -Method POST -Session $session -Body $payload
        if ($createResponse.ok) {
          $result.inserted++
        } else {
          $result.omitted++
          $result.errors += "create_not_ok: name=$($desired.name) category=$($desired.category)"
        }
      } catch {
        $result.omitted++
        $result.errors += "create_exception: name=$($desired.name) category=$($desired.category) message=$($_.Exception.Message)"
      }
    } else {
      $result.inserted++
    }
  }
}

foreach ($existing in $beforeProducts) {
  $existingKey = Product-Key $existing.name $existing.category
  if (-not $sourceKeys.Contains($existingKey)) {
    [void]$deactivateIds.Add([int]$existing.id)
  }
}

foreach ($id in $deactivateIds) {
  if (-not $DryRun) {
    try {
      $deleteResponse = Invoke-JsonRequest -Url "$BaseUrl/api/products/delete.php" -Method POST -Session $session -Body @{ id = [int]$id }
      if ($deleteResponse.ok) {
        $result.deactivated++
      } else {
        $result.errors += "delete_not_ok: id=$id"
      }
    } catch {
      $result.errors += "delete_exception: id=$id message=$($_.Exception.Message)"
    }
  } else {
    $result.deactivated++
  }
}

$afterPayload = if ($DryRun) { $beforePayload } else { Invoke-JsonRequest -Url "$BaseUrl/api/get_products.php" -Method GET -Session $session }
$afterProducts = @($afterPayload.menuProducts)

$afterCategoryCounts = @{}
foreach ($product in $afterProducts) {
  $category = [string]$product.category
  if (-not $afterCategoryCounts.ContainsKey($category)) {
    $afterCategoryCounts[$category] = 0
  }
  $afterCategoryCounts[$category] = [int]$afterCategoryCounts[$category] + 1
}

$sourceCategoryCounts = @{}
foreach ($product in $desiredProducts) {
  $category = [string]$product.category
  if (-not $sourceCategoryCounts.ContainsKey($category)) {
    $sourceCategoryCounts[$category] = 0
  }
  $sourceCategoryCounts[$category] = [int]$sourceCategoryCounts[$category] + 1
}

$afterKeySet = New-Object 'System.Collections.Generic.HashSet[string]'
foreach ($product in $afterProducts) {
  [void]$afterKeySet.Add((Product-Key $product.name $product.category))
}

$missingKeys = @()
foreach ($desired in $desiredProducts) {
  $key = Product-Key $desired.name $desired.category
  if (-not $afterKeySet.Contains($key)) {
    $missingKeys += $key
  }
}

$categoryDiff = @()
$allCategories = @($sourceCategoryCounts.Keys + $afterCategoryCounts.Keys | Select-Object -Unique)
foreach ($category in $allCategories) {
  $expected = if ($sourceCategoryCounts.ContainsKey($category)) { [int]$sourceCategoryCounts[$category] } else { 0 }
  $actual = if ($afterCategoryCounts.ContainsKey($category)) { [int]$afterCategoryCounts[$category] } else { 0 }
  if ($expected -ne $actual) {
    $categoryDiff += "${category}: expected=$expected actual=$actual"
  }
}

$result.after_products = $afterProducts.Count
$result.after_categories = $afterCategoryCounts
$result.validation = [ordered]@{
  count_match = ($afterProducts.Count -eq $desiredProducts.Count)
  category_match = ($categoryDiff.Count -eq 0)
  missing_keys = $missingKeys
  category_differences = $categoryDiff
}

if ([string]::IsNullOrWhiteSpace($ReportFile)) {
  $tsForReport = Get-Date -Format 'yyyyMMdd_HHmmss'
  $ReportFile = "docs/exports/menu_products_import_report_$tsForReport.json"
}

$reportDir = Split-Path -Path $ReportFile -Parent
if ($reportDir -and -not (Test-Path $reportDir)) {
  [void](New-Item -ItemType Directory -Path $reportDir -Force)
}

($result | ConvertTo-Json -Depth 12) + "`n" | Set-Content -Path $ReportFile -Encoding UTF8

Write-Output ("report_file=" + (Resolve-Path $ReportFile).Path)
Write-Output ("backup_file=" + (Resolve-Path $BackupFile).Path)
Write-Output ("inserted=$($result.inserted)")
Write-Output ("updated=$($result.updated)")
Write-Output ("deactivated=$($result.deactivated)")
Write-Output ("omitted=$($result.omitted)")
Write-Output ("duplicate_conflicts=$($result.duplicate_conflicts)")
Write-Output ("after_products=$($result.after_products)")
Write-Output ("expected_products=$($result.source_products)")
Write-Output ("count_match=$($result.validation.count_match)")
Write-Output ("category_match=$($result.validation.category_match)")
Write-Output ("errors_count=$($result.errors.Count)")
