# Generate Complete Test Suite - Auto-discover all test cases

# Get all test cases from directories
$loginTests = Get-ChildItem "Test Cases\Authentication\Login" -Filter "*.tc" | Sort-Object Name | ForEach-Object { "Authentication/Login/" + $_.BaseName }
$registerTests = Get-ChildItem "Test Cases\Authentication\Register" -Filter "*.tc" | Sort-Object Name | ForEach-Object { "Authentication/Register/" + $_.BaseName }
$forgotPasswordTests = Get-ChildItem "Test Cases\Authentication\ForgotPassword" -Filter "*.tc" | Sort-Object Name | ForEach-Object { "Authentication/ForgotPassword/" + $_.BaseName }
$resetPasswordTests = Get-ChildItem "Test Cases\Authentication\ResetPassword" -Filter "*.tc" | Sort-Object Name | ForEach-Object { "Authentication/ResetPassword/" + $_.BaseName }

$testCases = @()
$testCases += $loginTests
$testCases += $registerTests
$testCases += $forgotPasswordTests
$testCases += $resetPasswordTests

Write-Host "Total test cases found: $($testCases.Count)" -ForegroundColor Cyan
Write-Host "  Login: $($loginTests.Count)" -ForegroundColor Yellow
Write-Host "  Register: $($registerTests.Count)" -ForegroundColor Yellow
Write-Host "  ForgotPassword: $($forgotPasswordTests.Count)" -ForegroundColor Yellow
Write-Host "  ResetPassword: $($resetPasswordTests.Count)" -ForegroundColor Yellow

$xml = @"
<?xml version="1.0" encoding="UTF-8"?>
<TestSuiteEntity>
   <description>Complete Authentication Test Suite - All $($testCases.Count) Tests (Login, Register, ForgotPassword, ResetPassword)</description>
   <name>TS_Authentication_Complete</name>
   <tag>regression,authentication</tag>
   <isRerun>false</isRerun>
   <mailRecipient></mailRecipient>
   <numberOfRerun>0</numberOfRerun>
   <pageLoadTimeout>30</pageLoadTimeout>
   <pageLoadTimeoutDefault>true</pageLoadTimeoutDefault>
   <rerunFailedTestCasesOnly>false</rerunFailedTestCasesOnly>
   <rerunImmediately>false</rerunImmediately>
   <testSuiteGuid>ts-auth-complete-001</testSuiteGuid>
"@

$counter = 1
foreach ($tc in $testCases) {
    $isRun = "true"
    # Disable tests that require valid tokens (033 and 034)
    if ($tc -match "033|034") {
        $isRun = "false"
    }
    
    $xml += @"
   <testCaseLink>
      <guid>ts-link-$($counter.ToString('000'))</guid>
      <isReuseDriver>false</isReuseDriver>
      <isRun>$isRun</isRun>
      <testCaseId>Test Cases/$tc</testCaseId>
      <usingDataBindingAtTestSuiteLevel>true</usingDataBindingAtTestSuiteLevel>
   </testCaseLink>
"@
    $counter++
}

$xml += @"
</TestSuiteEntity>
"@

$outputPath = "Test Suites\TS_Authentication_Complete.ts"
Set-Content -Path $outputPath -Value $xml -NoNewline
Write-Host "Created $outputPath with" $testCases.Count "test cases"
