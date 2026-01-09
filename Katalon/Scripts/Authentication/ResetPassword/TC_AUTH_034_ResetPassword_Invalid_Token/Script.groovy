import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import authentication.ResetPassword_Keywords as ResetPasswordKeywords

WebUI.openBrowser('')
WebUI.maximizeWindow()
ResetPasswordKeywords resetPasswordHelper = new ResetPasswordKeywords()

try {
    String invalidToken = 'invalid-fake-token-123456'
    resetPasswordHelper.navigateToResetPassword(invalidToken)
    WebUI.delay(2)
    
    boolean errorPresent = WebUI.verifyElementPresent(
        findTestObject('Authentication/ResetPasswordPage/invalidTokenMessage'),
        10,
        com.kms.katalon.core.model.FailureHandling.OPTIONAL
    )
    
    assert errorPresent, "Error message should be visible for invalid token"
    
    // Verify "Request a new reset link" button is present
    WebUI.verifyElementPresent(findTestObject('Authentication/ResetPasswordPage/requestNewLinkButton'), 10)
    
    // Verify password form elements are NOT present
    boolean passwordInputPresent = WebUI.verifyElementPresent(
        findTestObject('Authentication/ResetPasswordPage/passwordInput'),
        5,
        com.kms.katalon.core.model.FailureHandling.OPTIONAL
    )
    
    assert !passwordInputPresent, "Password input should NOT be visible with invalid token"
    
    println('✓ TC_AUTH_016 PASSED: Invalid token shows error and hides form')
    
} catch (Exception e) {
    WebUI.comment('❌ TC_AUTH_016 FAILED: ' + e.getMessage())
    throw e
    
} finally {
    WebUI.closeBrowser()
}
