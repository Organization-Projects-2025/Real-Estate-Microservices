# Clean up duplicate TC_AUTH_017 in Login folder

$duplicatePath = ".\Scripts\Authentication\Login\TC_AUTH_017_Invalid_Email_Format"

if (Test-Path $duplicatePath) {
    Write-Host "Found duplicate: $duplicatePath" -ForegroundColor Yellow
    Remove-Item -Path $duplicatePath -Recurse -Force
    Write-Host "DELETED duplicate TC_AUTH_017_Invalid_Email_Format from Login" -ForegroundColor Green
} else {
    Write-Host "No duplicate found" -ForegroundColor Cyan
}

# List all TC_AUTH_017 folders to verify
Write-Host "`nAll TC_AUTH_017 folders:" -ForegroundColor Cyan
Get-ChildItem -Path . -Filter "*TC_AUTH_017*" -Recurse -Directory | Select-Object FullName
