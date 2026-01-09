# Fix Register Script Folder Numbering
$basePath = "c:\Personal Files\Eduction 4th year\Service\Project\Real-Estate-Microservices\Katalon\Scripts\Authentication\Register"

Write-Host "Renaming Register script folders (017-028 to 016-027)..."

# Rename from highest to lowest to avoid conflicts
Rename-Item "$basePath\TC_AUTH_027_Register_Role_Persistence" "TEMP_027" -Force
Rename-Item "$basePath\TC_AUTH_026_Register_Auto_Login" "TEMP_026" -Force
Rename-Item "$basePath\TC_AUTH_025_Register_Password_Masking" "TEMP_025" -Force
Rename-Item "$basePath\TC_AUTH_024_Register_Page_Elements" "TEMP_024" -Force
Rename-Item "$basePath\TC_AUTH_023_Register_Maximum_Password_Length" "TEMP_023" -Force
Rename-Item "$basePath\TC_AUTH_022_Register_Minimum_Password_Length" "TEMP_022" -Force
Rename-Item "$basePath\TC_AUTH_021_Register_Long_Input_Handling" "TEMP_021" -Force
Rename-Item "$basePath\TC_AUTH_020_Register_Missing_Fields" "TEMP_020" -Force
Rename-Item "$basePath\TC_AUTH_019_Register_Weak_Password" "TEMP_019" -Force
# 018 is missing, that's the duplicate email test
Rename-Item "$basePath\TC_AUTH_017_Register_Valid_Developer" "TEMP_017" -Force

# Now rename to final numbers
Rename-Item "$basePath\TEMP_027" "TC_AUTH_027_Register_Role_Persistence" -Force
Rename-Item "$basePath\TEMP_026" "TC_AUTH_026_Register_Auto_Login" -Force
Rename-Item "$basePath\TEMP_025" "TC_AUTH_025_Register_Password_Masking" -Force
Rename-Item "$basePath\TEMP_024" "TC_AUTH_024_Register_Page_Elements" -Force
Rename-Item "$basePath\TEMP_023" "TC_AUTH_023_Register_Maximum_Password_Length" -Force
Rename-Item "$basePath\TEMP_022" "TC_AUTH_022_Register_Minimum_Password_Length" -Force
Rename-Item "$basePath\TEMP_021" "TC_AUTH_021_Register_Long_Input_Handling" -Force
Rename-Item "$basePath\TEMP_020" "TC_AUTH_020_Register_Missing_Fields" -Force
Rename-Item "$basePath\TEMP_019" "TC_AUTH_019_Register_Weak_Password" -Force
Rename-Item "$basePath\TEMP_017" "TC_AUTH_017_Register_Valid_Developer" -Force

# 016 is already correct (Register_Valid_User)

Write-Host "DONE! Register folders now numbered 016-027"
Get-ChildItem $basePath | Sort-Object Name | Select-Object Name
