# Reorganize Authentication test cases to feature-based structure

$baseTC = "C:\Personal Files\Eduction 4th year\Service\Project\Real-Estate-Microservices\Katalon\Test Cases\Authentication"
$baseSC = "C:\Personal Files\Eduction 4th year\Service\Project\Real-Estate-Microservices\Katalon\Scripts\Authentication"

Write-Host "Moving UI Validation tests to feature folders..."

# Move Login UI tests
Move-Item "$baseTC\UIValidation\TC_AUTH_024_Login_Page_Elements.tc" "$baseTC\Login\" -Force
Move-Item "$baseSC\UIValidation\TC_AUTH_024_Login_Page_Elements" "$baseSC\Login\" -Force

Move-Item "$baseTC\UIValidation\TC_AUTH_026_Password_Masking.tc" "$baseTC\Login\" -Force
Move-Item "$baseSC\UIValidation\TC_AUTH_026_Password_Masking" "$baseSC\Login\" -Force

Move-Item "$baseTC\UIValidation\TC_AUTH_027_Loading_Indicator.tc" "$baseTC\Login\" -Force
Move-Item "$baseSC\UIValidation\TC_AUTH_027_Loading_Indicator" "$baseSC\Login\" -Force

# Move Register UI tests
Move-Item "$baseTC\UIValidation\TC_AUTH_025_Register_Page_Elements.tc" "$baseTC\Register\" -Force
Move-Item "$baseSC\UIValidation\TC_AUTH_025_Register_Page_Elements" "$baseSC\Register\" -Force

Move-Item "$baseTC\UIValidation\TC_AUTH_028_Register_Loading_Indicator.tc" "$baseTC\Register\" -Force
Move-Item "$baseSC\UIValidation\TC_AUTH_028_Register_Loading_Indicator" "$baseSC\Register\" -Force

Write-Host "Moving Security tests to feature folders..."

# Move Login Security tests
Move-Item "$baseTC\Security\TC_AUTH_030_XSS_Prevention.tc" "$baseTC\Login\" -Force
Move-Item "$baseSC\Security\TC_AUTH_030_XSS_Prevention" "$baseSC\Login\" -Force

Move-Item "$baseTC\Security\TC_AUTH_031_SQL_Injection_Prevention.tc" "$baseTC\Login\" -Force
Move-Item "$baseSC\Security\TC_AUTH_031_SQL_Injection_Prevention" "$baseSC\Login\" -Force

Move-Item "$baseTC\Security\TC_AUTH_032_Password_Not_In_URL.tc" "$baseTC\Login\" -Force
Move-Item "$baseSC\Security\TC_AUTH_032_Password_Not_In_URL" "$baseSC\Login\" -Force

Move-Item "$baseTC\Security\TC_AUTH_033_Email_Case_Sensitivity.tc" "$baseTC\Login\" -Force
Move-Item "$baseSC\Security\TC_AUTH_033_Email_Case_Sensitivity" "$baseSC\Login\" -Force

Move-Item "$baseTC\Security\TC_AUTH_034_Session_Persistence.tc" "$baseTC\Login\" -Force
Move-Item "$baseSC\Security\TC_AUTH_034_Session_Persistence" "$baseSC\Login\" -Force

Write-Host "Moving Workflow tests to feature folders..."

# Move Login Workflow tests
Move-Item "$baseTC\Workflow\TC_AUTH_035_Login_Logout_Login.tc" "$baseTC\Login\" -Force
Move-Item "$baseSC\Workflow\TC_AUTH_035_Login_Logout_Login" "$baseSC\Login\" -Force

Move-Item "$baseTC\Workflow\TC_AUTH_037_Back_Button_After_Login.tc" "$baseTC\Login\" -Force
Move-Item "$baseSC\Workflow\TC_AUTH_037_Back_Button_After_Login" "$baseSC\Login\" -Force

# Move Register Workflow tests
Move-Item "$baseTC\Workflow\TC_AUTH_036_Register_Auto_Login.tc" "$baseTC\Register\" -Force
Move-Item "$baseSC\Workflow\TC_AUTH_036_Register_Auto_Login" "$baseSC\Register\" -Force

Move-Item "$baseTC\Workflow\TC_AUTH_040_Role_Persistence.tc" "$baseTC\Register\" -Force
Move-Item "$baseSC\Workflow\TC_AUTH_040_Role_Persistence" "$baseSC\Register\" -Force

Write-Host "Removing empty folders..."

# Remove empty folders
Remove-Item "$baseTC\InputValidation" -Force -ErrorAction SilentlyContinue
Remove-Item "$baseTC\UIValidation" -Force -ErrorAction SilentlyContinue
Remove-Item "$baseTC\Security" -Force -ErrorAction SilentlyContinue
Remove-Item "$baseTC\Workflow" -Force -ErrorAction SilentlyContinue

Remove-Item "$baseSC\InputValidation" -Force -ErrorAction SilentlyContinue
Remove-Item "$baseSC\UIValidation" -Force -ErrorAction SilentlyContinue
Remove-Item "$baseSC\Security" -Force -ErrorAction SilentlyContinue
Remove-Item "$baseSC\Workflow" -Force -ErrorAction SilentlyContinue

Write-Host "Reorganization complete!"
Write-Host "New structure:"
Write-Host "  Login: 17 tests"
Write-Host "  Register: 11 tests"
Write-Host "  ForgotPassword: 3 tests"
Write-Host "  ResetPassword: 3 tests"
