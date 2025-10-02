# WoW Meta Site Server Starter
Write-Host "Starting WoW Meta Site on port 3002..." -ForegroundColor Green
Set-Location -Path $PSScriptRoot
$env:PORT = "3002"
npm start