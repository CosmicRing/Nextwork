param(
  [ValidateSet("preview", "upload")]
  [string]$Mode = "preview",
  [string]$CliPath = "",
  [string]$ProjectRoot = "",
  [string]$Version = "0.1.0",
  [string]$Desc = "看看工资首发小程序包"
)

$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
if (-not $ProjectRoot) {
  $ProjectRoot = Join-Path $repoRoot "miniprogram"
}

$projectConfigPath = Join-Path $ProjectRoot "project.config.json"
if (-not (Test-Path -LiteralPath $projectConfigPath)) {
  throw "Missing project.config.json under $ProjectRoot"
}

$projectConfig = Get-Content -LiteralPath $projectConfigPath -Raw -Encoding UTF8 | ConvertFrom-Json
if ($Mode -eq "upload" -and $projectConfig.appid -eq "touristappid") {
  throw "UPLOAD_BLOCKED: replace project.config.json appid with the real Mini Program AppID before upload."
}

function Find-WechatCli {
  param([string]$ExplicitPath)

  if ($ExplicitPath) {
    if (Test-Path -LiteralPath $ExplicitPath) {
      return (Resolve-Path -LiteralPath $ExplicitPath).Path
    }
    throw "WeChat DevTools CLI not found at $ExplicitPath"
  }

  $candidatePaths = @(
    (Join-Path $env:ProgramFiles "Tencent\微信web开发者工具\cli.bat"),
    (Join-Path ${env:ProgramFiles(x86)} "Tencent\微信web开发者工具\cli.bat"),
    (Join-Path $env:LOCALAPPDATA "Programs\微信开发者工具\cli.bat"),
    (Join-Path $env:LOCALAPPDATA "Tencent\微信开发者工具\cli.bat")
  )

  foreach ($candidate in $candidatePaths) {
    if ($candidate -and (Test-Path -LiteralPath $candidate)) {
      return (Resolve-Path -LiteralPath $candidate).Path
    }
  }

  throw "WeChat DevTools cli.bat was not found. Pass -CliPath or install 微信web开发者工具 and enable Settings -> Security -> Service Port."
}

$resolvedCliPath = Find-WechatCli -ExplicitPath $CliPath
$resolvedProjectRoot = (Resolve-Path -LiteralPath $ProjectRoot).Path

if ($Mode -eq "preview") {
  & $resolvedCliPath preview --project $resolvedProjectRoot
} else {
  & $resolvedCliPath upload --project $resolvedProjectRoot -v $Version -d $Desc
}

if ($LASTEXITCODE -ne 0) {
  throw "WeChat DevTools CLI exited with code $LASTEXITCODE"
}
