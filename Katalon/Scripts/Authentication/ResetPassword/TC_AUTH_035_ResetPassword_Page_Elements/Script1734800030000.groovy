import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import authentication.ResetPassword_Keywords as ResetPasswordKeywords

WebUI.openBrowser('')
WebUI.maximizeWindow()
ResetPasswordKeywords resetPasswordHelper = new ResetPasswordKeywords()

try {
    String validTokenFormat = 'abc123def456ghi789jkl012mno345pqr678stu901'
    resetPasswordHelper.navigateToResetPassword(validTokenFormat)
    WebUI.delay(2)
    
    WebUI.verifyElementPresent(findTestObject('Authentication/ResetPasswordPage/pageTitle'), 10)
    
    WebUI.verifyElementPresent(findTestObject('Authentication/ResetPasswordPage/passwordLabel'), 10)
    WebUI.verifyElementPresent(findTestObject('Authentication/ResetPasswordPage/passwordInput'), 10)
    
    WebUI.verifyElementPresent(findTestObject('Authentication/ResetPasswordPage/confirmPasswordLabel'), 10)
    WebUI.verifyElementPresent(findTestObject('Authentication/ResetPasswordPage/confirmPasswordInput'), 10)
    
    WebUI.verifyElementPresent(findTestObject('Authentication/ResetPasswordPage/passwordRequirements'), 10)
    
    WebUI.verifyElementPresent(findTestObject('Authentication/ResetPasswordPage/resetButton'), 10)
    WebUI.verifyElementPresent(findTestObject('Authentication/ResetPasswordPage/returnToLoginLink'), 10)
    
    println('✓ TC_AUTH_030 PASSED: All Reset Password page elements present')
    
} catch (Exception e) {
    println('✗ TC_AUTH_030 FAILED: ' + e.getMessage())
    throw e
} finally {
    WebUI.closeBrowser()
}
