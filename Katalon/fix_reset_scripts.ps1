# Fix ResetPassword Script Folder Numbering
$basePath = "c:\Personal Files\Eduction 4th year\Service\Project\Real-Estate-Microservices\Katalon\Scripts\Authentication\ResetPassword"

Write-Host "Renaming ResetPassword script folders..."
Rename-Item "$basePath\TC_AUTH_036_ResetPassword_Page_Elements" "TEMP_036" -Force
Rename-Item "$basePath\TC_AUTH_035_ResetPassword_Invalid_Token" "TC_AUTH_034_ResetPassword_Invalid_Token" -Force
Rename-Item "$basePath\TC_AUTH_034_ResetPassword_Password_Mismatch" "TC_AUTH_033_ResetPassword_Password_Mismatch" -Force
Rename-Item "$basePath\TC_AUTH_033_ResetPassword_Valid_Token" "TC_AUTH_032_ResetPassword_Valid_Token" -Force
Rename-Item "$basePath\TEMP_036" "TC_AUTH_035_ResetPassword_Page_Elements" -Force

Write-Host "DONE! Script folders now numbered 032-035"
Get-ChildItem $basePath | Select-Object Name
