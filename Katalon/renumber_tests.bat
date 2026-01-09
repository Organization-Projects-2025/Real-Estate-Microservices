@echo off
setlocal enabledelayedexpansion

cd /d "c:\Personal Files\Eduction 4th year\Service\Project\Real-Estate-Microservices\Katalon"

echo === Renaming Authentication Test Cases ===
echo.

REM LOGIN TESTS - Renaming to TC_AUTH_006-016
call :RenameTest "Login" "TC_AUTH_018_Email_Special_Characters" "TC_AUTH_007_Login_Email_Special_Characters"
call :RenameTest "Login" "TC_AUTH_020_Email_Trimming" "TC_AUTH_008_Login_Email_Trimming"
call :RenameTest "Login" "TC_AUTH_024_Login_Page_Elements" "TC_AUTH_009_Login_Page_Elements"
call :RenameTest "Login" "TC_AUTH_026_Password_Masking" "TC_AUTH_010_Login_Password_Masking"
call :RenameTest "Login" "TC_AUTH_027_Loading_Indicator" "TC_AUTH_011_Login_Loading_Indicator"
call :RenameTest "Login" "TC_AUTH_030_XSS_Prevention" "TC_AUTH_012_Login_XSS_Prevention"
call :RenameTest "Login" "TC_AUTH_032_Password_Not_In_URL" "TC_AUTH_013_Login_Password_Not_In_URL"
call :RenameTest "Login" "TC_AUTH_034_Session_Persistence" "TC_AUTH_014_Login_Session_Persistence"
call :RenameTest "Login" "TC_AUTH_035_Logout_Functionality" "TC_AUTH_015_Logout_Functionality"
call :RenameTest "Login" "TC_AUTH_037_Back_Button_After_Login" "TC_AUTH_016_Login_Back_Button_After_Login"
call :RenameTest "Login" "TC_AUTH_005_Forgot_Password_Link" "TC_AUTH_005_ForgotPassword_Link"

REM REGISTER TESTS - Renaming to TC_AUTH_017-028
call :RenameTest "Register" "TC_AUTH_006_Register_Valid_User" "TC_AUTH_017_Register_Valid_User"
call :RenameTest "Register" "TC_AUTH_007_Register_Valid_Developer" "TC_AUTH_018_Register_Valid_Developer"
call :RenameTest "Register" "TC_AUTH_008_Register_Duplicate_Email" "TC_AUTH_019_Register_Duplicate_Email"
call :RenameTest "Register" "TC_AUTH_009_Register_Weak_Password" "TC_AUTH_020_Register_Weak_Password"
call :RenameTest "Register" "TC_AUTH_010_Register_Missing_Fields" "TC_AUTH_021_Register_Missing_Fields"
call :RenameTest "Register" "TC_AUTH_019_Long_Input_Handling" "TC_AUTH_022_Register_Long_Input_Handling"
call :RenameTest "Register" "TC_AUTH_022_Minimum_Password_Length" "TC_AUTH_023_Register_Minimum_Password_Length"
call :RenameTest "Register" "TC_AUTH_023_Maximum_Password_Length" "TC_AUTH_024_Register_Maximum_Password_Length"
call :RenameTest "Register" "TC_AUTH_027_Register_Password_Masking" "TC_AUTH_026_Register_Password_Masking"
call :RenameTest "Register" "TC_AUTH_036_Register_Auto_Login" "TC_AUTH_027_Register_Auto_Login"
call :RenameTest "Register" "TC_AUTH_040_Role_Persistence" "TC_AUTH_028_Register_Role_Persistence"

REM FORGOT PASSWORD TESTS - Renaming to TC_AUTH_029-032
call :RenameTest "ForgotPassword" "TC_AUTH_011_Forgot_Password_Valid_Email" "TC_AUTH_029_ForgotPassword_Valid_Email"
call :RenameTest "ForgotPassword" "TC_AUTH_012_Forgot_Password_Invalid_Email" "TC_AUTH_030_ForgotPassword_Invalid_Email"
call :RenameTest "ForgotPassword" "TC_AUTH_013_Forgot_Password_Empty_Email" "TC_AUTH_031_ForgotPassword_Empty_Email"
call :RenameTest "ForgotPassword" "TC_AUTH_029_ForgotPassword_Page_Elements" "TC_AUTH_032_ForgotPassword_Page_Elements"

REM RESET PASSWORD TESTS - Renaming to TC_AUTH_033-036
call :RenameTest "ResetPassword" "TC_AUTH_014_Reset_Password_Valid_Token" "TC_AUTH_033_ResetPassword_Valid_Token"
call :RenameTest "ResetPassword" "TC_AUTH_015_Reset_Password_Mismatch" "TC_AUTH_034_ResetPassword_Password_Mismatch"
call :RenameTest "ResetPassword" "TC_AUTH_016_Reset_Password_Invalid_Token" "TC_AUTH_035_ResetPassword_Invalid_Token"
call :RenameTest "ResetPassword" "TC_AUTH_030_ResetPassword_Page_Elements" "TC_AUTH_036_ResetPassword_Page_Elements"

echo.
echo === Renaming Complete ===
echo.
goto :eof

:RenameTest
set "folder=%~1"
set "oldName=%~2"
set "newName=%~3"

if not exist "Test Cases\Authentication\%folder%\%oldName%.tc" (
    echo SKIP: %oldName% ^(not found^)
    goto :eof
)

echo Renaming: %oldName% -^> %newName%

REM Rename test case file
move /Y "Test Cases\Authentication\%folder%\%oldName%.tc" "Test Cases\Authentication\%folder%\%newName%.tc" >nul 2>&1
if !errorlevel! equ 0 (
    echo   [OK] Test case file renamed
) else (
    echo   [ERR] Failed to rename test case file
)

REM Rename script folder if exists
if exist "Scripts\Authentication\%folder%\%oldName%" (
    move /Y "Scripts\Authentication\%folder%\%oldName%" "Scripts\Authentication\%folder%\%newName%" >nul 2>&1
    if !errorlevel! equ 0 (
        echo   [OK] Script folder renamed
    ) else (
        echo   [ERR] Failed to rename script folder
    )
)

REM Update content of .tc file
powershell -Command "(Get-Content 'Test Cases\Authentication\%folder%\%newName%.tc') -replace '%oldName%', '%newName%' | Set-Content 'Test Cases\Authentication\%folder%\%newName%.tc'" >nul 2>&1

goto :eof
