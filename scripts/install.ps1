# Ultra Forge installer — Windows PowerShell
#   .\scripts\install.ps1                      Claude Code skills, global (%USERPROFILE%\.claude\skills)
#   .\scripts\install.ps1 -Project -ProjectDir C:\path\to\project   Make a project Ultra-Forge-ready for every AI tool
#   .\scripts\install.ps1 -Codex               also copy skills to %USERPROFILE%\.codex\skills
#   .\scripts\install.ps1 -Dir PATH            copy skills to any folder
#   .\scripts\install.ps1 -Template DIR        copy the website template into DIR
# If scripts are blocked: Set-ExecutionPolicy -Scope Process Bypass
param([switch]$Project, [string]$ProjectDir = (Get-Location).Path, [switch]$Codex, [string]$Dir = "", [string]$Template = "")
$ErrorActionPreference = "Stop"
$Here = Split-Path -Parent $PSScriptRoot
function Copy-Skills($dest) {
  New-Item -ItemType Directory -Force -Path $dest | Out-Null
  Get-ChildItem "$Here\skills" -Directory | ForEach-Object {
    $t = Join-Path $dest $_.Name; if (Test-Path $t) { Remove-Item $t -Recurse -Force }
    Copy-Item $_.FullName $t -Recurse }
  Write-Host "  + skills -> $dest"
}
Write-Host "Ultra Forge installer"
if (-not $Project) { Copy-Skills "$env:USERPROFILE\.claude\skills" }
if ($Codex) { Copy-Skills "$env:USERPROFILE\.codex\skills" }
if ($Dir) { Copy-Skills $Dir }
if ($Project) {
  New-Item -ItemType Directory -Force -Path $ProjectDir | Out-Null; Set-Location $ProjectDir
  Copy-Skills "$ProjectDir\.claude\skills"
  New-Item -ItemType Directory -Force -Path ultra-forge, .cursor\rules, .github\workflows, scripts, packaging | Out-Null
  Copy-Item "$Here\skills", "$Here\library" ultra-forge -Recurse -Force
  Copy-Item "$Here\MASTER_PROMPT.md", "$Here\START_HERE.md" ultra-forge -Force
  if (-not (Test-Path site)) { Copy-Item "$Here\site" site -Recurse }
  foreach ($f in "AGENTS.md","CLAUDE.md","GEMINI.md",".windsurfrules",".gitignore") { if (-not (Test-Path $f)) { Copy-Item "$Here\$f" $f } }
  Copy-Item "$Here\.cursor\rules\ultra-forge.mdc" .cursor\rules -Force
  if (-not (Test-Path .github\copilot-instructions.md)) { Copy-Item "$Here\.github\copilot-instructions.md" .github }
  Get-ChildItem "$Here\.github\workflows" | ForEach-Object { if (-not (Test-Path ".github\workflows\$($_.Name)")) { Copy-Item $_.FullName .github\workflows } }
  Get-ChildItem "$Here\scripts" | ForEach-Object { if (-not (Test-Path "scripts\$($_.Name)")) { Copy-Item $_.FullName scripts } }
  if (-not (Test-Path packaging\android)) { Copy-Item "$Here\packaging\*" packaging -Recurse }
  Write-Host "  + project ready: $ProjectDir"
}
if ($Template) { New-Item -ItemType Directory -Force -Path $Template | Out-Null; Copy-Item "$Here\site\*" $Template -Recurse -Force; Write-Host "  + template -> $Template" }
Write-Host "Done. Next: edit site\config.js, then: cd site; python -m http.server 8080  ->  http://localhost:8080"
