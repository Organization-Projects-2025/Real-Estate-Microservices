@echo off
cd /d "%~dp0"
rmdir /s /q "Scripts\Authentication\Login\TC_AUTH_017_Invalid_Email_Format"
if exist "Scripts\Authentication\Login\TC_AUTH_017_Invalid_Email_Format" (
    echo FAILED to delete
) else (
    echo SUCCESS - Deleted TC_AUTH_017_Invalid_Email_Format
)
pause
