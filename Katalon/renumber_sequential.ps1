# COMPLETE SEQUENTIAL RENUMBERING - NO GAPS
# Renames TC_AUTH_012-036 to TC_AUTH_011-035 (removes gap at 011)

Write-Host "`n=== RENUMBERING TO SEQUENTIAL (NO GAPS) ===" -ForegroundColor Cyan

# Process in REVERSE order to avoid conflicts
$renames = @(
    @("036","035","ResetPassword","ResetPassword_Page_Elements"),
    @("035","034","ResetPassword","ResetPassword_Invalid_Token"),
    @("034","033","ResetPassword","ResetPassword_Password_Mismatch"),
    @("033","032","ResetPassword","ResetPassword_Valid_Token"),
    @("032","031","ForgotPassword","ForgotPassword_Page_Elements"),
    @("031","030","ForgotPassword","ForgotPassword_Empty_Email"),
    @("030","029","ForgotPassword","ForgotPassword_Invalid_Email"),
    @("029","028","ForgotPassword","ForgotPassword_Valid_Email"),
    @("028","027","Register","Register_Role_Persistence"),
    @("027","026","Register","Register_Auto_Login"),
    @("026","025","Register","Register_Password_Masking"),
    @("025","024","Register","Register_Page_Elements"),
    @("024","023","Register","Register_Maximum_Password_Length"),
    @("023","022","Register","Register_Minimum_Password_Length"),
    @("022","021","Register","Register_Long_Input_Handling"),
    @("021","020","Register","Register_Missing_Fields"),
    @("020","019","Register","Register_Weak_Password"),
    @("019","018","Register","Register_Duplicate_Email"),
    @("018","017","Register","Register_Valid_Developer"),
    @("017","016","Register","Register_Valid_User"),
    @("016","015","Login","Login_Back_Button_After_Login"),
    @("015","014","Login","Logout_Functionality"),
    @("014","013","Login","Login_Session_Persistence"),
    @("013","012","Login","Login_Password_Not_In_URL"),
    @("012","011","Login","Login_XSS_Prevention")
)

foreach ($r in $renames) {
    $old = $r[0]
    $new = $r[1]
    $cat = $r[2]
    $name = $r[3]
    
    Write-Host "`nTC_AUTH_$old -> TC_AUTH_$new ($name)" -ForegroundColor Yellow
    
    # Rename Test Case
    $tcOld = "Test Cases\Authentication\$cat\TC_AUTH_${old}_$name.tc"
    $tcNew = "TC_AUTH_${new}_$name.tc"
    if (Test-Path $tcOld) {
        Rename-Item $tcOld -NewName $tcNew
        Write-Host "  ✓ Test Case renamed" -ForegroundColor Green
    }
    
    # Rename Script folder
    $scOld = "Scripts\Authentication\$cat\TC_AUTH_${old}_$name"
    $scNew = "TC_AUTH_${new}_$name"
    if (Test-Path $scOld) {
        Rename-Item $scOld -NewName $scNew
        Write-Host "  ✓ Script folder renamed" -ForegroundColor Green
    }
}

Write-Host "`n=== RENUMBERING COMPLETE ===" -ForegroundColor Green
Write-Host "Tests now numbered TC_AUTH_001-034 (NO GAPS)" -ForegroundColor Green
