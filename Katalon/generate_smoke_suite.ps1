# Generate Smoke Test Suite - Critical tests only

$smokeTests = @(
    # Critical Login
    "Authentication/Login/TC_AUTH_001_Login_Valid_Credentials",
    "Authentication/Login/TC_AUTH_002_Login_Invalid_Email",
    "Authentication/Login/TC_AUTH_003_Login_Incorrect_Password",
    "Authentication/Login/TC_AUTH_009_Login_Page_Elements",
    "Authentication/Login/TC_AUTH_015_Logout_Functionality",
    # Critical Register
    "Authentication/Register/TC_AUTH_017_Register_Valid_User",
    "Authentication/Register/TC_AUTH_018_Register_Valid_Developer",
    "Authentication/Register/TC_AUTH_019_Register_Duplicate_Email",
    "Authentication/Register/TC_AUTH_025_Register_Page_Elements",
    # Critical ForgotPassword
    "Authentication/ForgotPassword/TC_AUTH_029_ForgotPassword_Valid_Email",
    "Authentication/ForgotPassword/TC_AUTH_032_ForgotPassword_Page_Elements",
    # Critical ResetPassword
    "Authentication/ResetPassword/TC_AUTH_035_ResetPassword_Invalid_Token",
    "Authentication/ResetPassword/TC_AUTH_036_ResetPassword_Page_Elements"
)

Write-Host "Smoke test suite: $($smokeTests.Count) critical tests" -ForegroundColor Cyan

$xml = @"
<?xml version="1.0" encoding="UTF-8"?>
<TestSuiteEntity>
   <description>Smoke Test Suite - 13 Critical Authentication Tests (Happy Paths + Key Validations)</description>
   <name>TS_Authentication_Smoke</name>
   <tag>smoke,authentication</tag>
   <isRerun>false</isRerun>
   <mailRecipient></mailRecipient>
   <numberOfRerun>0</numberOfRerun>
   <pageLoadTimeout>30</pageLoadTimeout>
   <pageLoadTimeoutDefault>true</pageLoadTimeoutDefault>
   <rerunFailedTestCasesOnly>false</rerunFailedTestCasesOnly>
   <rerunImmediately>false</rerunImmediately>
   <testSuiteGuid>ts-auth-smoke-001</testSuiteGuid>
"@

$counter = 1
foreach ($tc in $smokeTests) {
    $xml += @"
   <testCaseLink>
      <guid>smoke-$($counter.ToString('000'))</guid>
      <isReuseDriver>false</isReuseDriver>
      <isRun>true</isRun>
      <testCaseId>Test Cases/$tc</testCaseId>
      <usingDataBindingAtTestSuiteLevel>true</usingDataBindingAtTestSuiteLevel>
   </testCaseLink>
"@
    $counter++
}

$xml += @"
</TestSuiteEntity>
"@

$outputPath = "Test Suites\TS_Authentication_Smoke.ts"
Set-Content -Path $outputPath -Value $xml -NoNewline
Write-Host "Created $outputPath with" $smokeTests.Count "test cases"
