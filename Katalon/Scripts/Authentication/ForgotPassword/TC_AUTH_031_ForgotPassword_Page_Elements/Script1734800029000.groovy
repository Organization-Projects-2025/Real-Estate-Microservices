import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import authentication.ForgotPassword_Keywords as ForgotPasswordKeywords

WebUI.openBrowser('')
WebUI.maximizeWindow()
ForgotPasswordKeywords forgotPasswordHelper = new ForgotPasswordKeywords()

try {
    forgotPasswordHelper.navigateToForgotPassword()
    
    WebUI.verifyElementPresent(findTestObject('Authentication/ForgotPasswordPage/pageTitle'), 10)
    
    WebUI.verifyElementPresent(findTestObject('Authentication/ForgotPasswordPage/emailLabel'), 10)
    WebUI.verifyElementPresent(findTestObject('Authentication/ForgotPasswordPage/emailInput'), 10)
    
    WebUI.verifyElementPresent(findTestObject('Authentication/ForgotPasswordPage/sendResetLinkButton'), 10)
    
    WebUI.verifyElementPresent(findTestObject('Authentication/ForgotPasswordPage/returnToLoginLink'), 10)
    
    println('✓ TC_AUTH_029 PASSED: All Forgot Password page elements present')
    
} catch (Exception e) {
    println('✗ TC_AUTH_029 FAILED: ' + e.getMessage())
    throw e
} finally {
    WebUI.closeBrowser()
}
