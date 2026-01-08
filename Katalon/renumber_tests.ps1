# Authentication Test Cases Renumbering Script
# This script renames test cases to follow sequential numbering and consistent naming

$baseDir = "c:\Personal Files\Eduction 4th year\Service\Project\Real-Estate-Microservices\Katalon"

# Define the new numbering scheme
$renameMap = @{
    # LOGIN TESTS (TC_AUTH_001-016)
    "TC_AUTH_001_Login_Valid_Credentials" = "TC_AUTH_001_Login_Valid_Credentials"
    "TC_AUTH_002_Login_Invalid_Email" = "TC_AUTH_002_Login_Invalid_Email"
    "TC_AUTH_003_Login_Incorrect_Password" = "TC_AUTH_003_Login_Incorrect_Password"
    "TC_AUTH_004_Login_Empty_Fields" = "TC_AUTH_004_Login_Empty_Fields"
    "TC_AUTH_005_Forgot_Password_Link" = "TC_AUTH_005_ForgotPassword_Link"
    "TC_AUTH_017_Invalid_Email_Format" = "TC_AUTH_006_Login_Invalid_Email_Format"
    "TC_AUTH_018_Email_Special_Characters" = "TC_AUTH_007_Login_Email_Special_Characters"
    "TC_AUTH_020_Email_Trimming" = "TC_AUTH_008_Login_Email_Trimming"
    "TC_AUTH_024_Login_Page_Elements" = "TC_AUTH_009_Login_Page_Elements"
    "TC_AUTH_026_Password_Masking" = "TC_AUTH_010_Login_Password_Masking"
    "TC_AUTH_027_Loading_Indicator" = "TC_AUTH_011_Login_Loading_Indicator"
    "TC_AUTH_030_XSS_Prevention" = "TC_AUTH_012_Login_XSS_Prevention"
    "TC_AUTH_032_Password_Not_In_URL" = "TC_AUTH_013_Login_Password_Not_In_URL"
    "TC_AUTH_034_Session_Persistence" = "TC_AUTH_014_Login_Session_Persistence"
    "TC_AUTH_035_Logout_Functionality" = "TC_AUTH_015_Logout_Functionality"
    "TC_AUTH_037_Back_Button_After_Login" = "TC_AUTH_016_Login_Back_Button_After_Login"
    
    # REGISTER TESTS (TC_AUTH_017-028)
    "TC_AUTH_006_Register_Valid_User" = "TC_AUTH_017_Register_Valid_User"
    "TC_AUTH_007_Register_Valid_Developer" = "TC_AUTH_018_Register_Valid_Developer"
    "TC_AUTH_008_Register_Duplicate_Email" = "TC_AUTH_019_Register_Duplicate_Email"
    "TC_AUTH_009_Register_Weak_Password" = "TC_AUTH_020_Register_Weak_Password"
    "TC_AUTH_010_Register_Missing_Fields" = "TC_AUTH_021_Register_Missing_Fields"
    "TC_AUTH_019_Long_Input_Handling" = "TC_AUTH_022_Register_Long_Input_Handling"
    "TC_AUTH_022_Minimum_Password_Length" = "TC_AUTH_023_Register_Minimum_Password_Length"
    "TC_AUTH_023_Maximum_Password_Length" = "TC_AUTH_024_Register_Maximum_Password_Length"
    "TC_AUTH_025_Register_Page_Elements" = "TC_AUTH_025_Register_Page_Elements"
    "TC_AUTH_027_Register_Password_Masking" = "TC_AUTH_026_Register_Password_Masking"
    "TC_AUTH_036_Register_Auto_Login" = "TC_AUTH_027_Register_Auto_Login"
    "TC_AUTH_040_Role_Persistence" = "TC_AUTH_028_Register_Role_Persistence"
    
    # FORGOT PASSWORD TESTS (TC_AUTH_029-032)
    "TC_AUTH_011_Forgot_Password_Valid_Email" = "TC_AUTH_029_ForgotPassword_Valid_Email"
    "TC_AUTH_012_Forgot_Password_Invalid_Email" = "TC_AUTH_030_ForgotPassword_Invalid_Email"
    "TC_AUTH_013_Forgot_Password_Empty_Email" = "TC_AUTH_031_ForgotPassword_Empty_Email"
    "TC_AUTH_029_ForgotPassword_Page_Elements" = "TC_AUTH_032_ForgotPassword_Page_Elements"
    
    # RESET PASSWORD TESTS (TC_AUTH_033-036)
    "TC_AUTH_014_Reset_Password_Valid_Token" = "TC_AUTH_033_ResetPassword_Valid_Token"
    "TC_AUTH_015_Reset_Password_Mismatch" = "TC_AUTH_034_ResetPassword_Password_Mismatch"
    "TC_AUTH_016_Reset_Password_Invalid_Token" = "TC_AUTH_035_ResetPassword_Invalid_Token"
    "TC_AUTH_030_ResetPassword_Page_Elements" = "TC_AUTH_036_ResetPassword_Page_Elements"
}

Write-Host "=== Authentication Test Cases Renumbering ===" -ForegroundColor Cyan
Write-Host ""

# Create a list to track renames
$renamesPerformed = @()

foreach ($oldName in $renameMap.Keys) {
    $newName = $renameMap[$oldName]
    
    if ($oldName -eq $newName) {
        Write-Host "SKIP: $oldName (no change needed)" -ForegroundColor Gray
        continue
    }
    
    # Find test case file
    $tcFiles = Get-ChildItem -Path "$baseDir\Test Cases\Authentication" -Recurse -Filter "$oldName.tc"
    
    foreach ($tcFile in $tcFiles) {
        $oldTcPath = $tcFile.FullName
        $newTcPath = $oldTcPath -replace [regex]::Escape($oldName), $newName
        
        # Find corresponding script folder
        $oldScriptPath = $oldTcPath -replace "Test Cases", "Scripts" -replace "\.tc$", ""
        $newScriptPath = $oldScriptPath -replace [regex]::Escape($oldName), $newName
        
        Write-Host "Renaming: $oldName -> $newName" -ForegroundColor Yellow
        
        # Rename Script folder first (if exists)
        if (Test-Path $oldScriptPath) {
            Move-Item -Path $oldScriptPath -Destination $newScriptPath -Force
            Write-Host "  ✓ Script folder renamed" -ForegroundColor Green
        }
        
        # Rename .tc file
        if (Test-Path $oldTcPath) {
            Move-Item -Path $oldTcPath -Destination $newTcPath -Force
            Write-Host "  ✓ Test case file renamed" -ForegroundColor Green
            
            # Update content of .tc file
            $content = Get-Content $newTcPath -Raw
            $content = $content -replace [regex]::Escape($oldName), $newName
            Set-Content -Path $newTcPath -Value $content -NoNewline
            Write-Host "  ✓ Test case content updated" -ForegroundColor Green
        }
        
        $renamesPerformed += "$oldName -> $newName"
    }
}

Write-Host ""
Write-Host "=== Renaming Complete ===" -ForegroundColor Cyan
Write-Host "Total renames performed: $($renamesPerformed.Count)" -ForegroundColor Green
Write-Host ""
if ($renamesPerformed.Count -gt 0) {
    Write-Host "Renamed files:" -ForegroundColor Cyan
    foreach ($rename in $renamesPerformed) {
        Write-Host "  $rename" -ForegroundColor White
    }
}
