import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import authentication.ForgotPassword_Keywords as ForgotPasswordKeywords

/**
 * Test Case: TC_AUTH_012 - Forgot Password with Non-Existent Email
 * 
 * Description: Verify appropriate message for non-existent email
 * Test Data: nonexistent@test.com
 */

WebUI.openBrowser('')
ForgotPasswordKeywords forgotPasswordHelper = new ForgotPasswordKeywords()

try {
    // Arrange
    forgotPasswordHelper.navigateToForgotPassword()
    
    // Act: Submit with non-existent email
    forgotPasswordHelper.submitForgotPassword('nonexistent@test.com')
    
    // Assert: Verify error
    boolean hasError = WebUI.verifyElementPresent(
        findTestObject('Object Repository/Authentication/ForgotPasswordPage/errorMessage'),
        5,
        com.kms.katalon.core.model.FailureHandling.OPTIONAL
    )
    
    assert hasError,
        "Should display either error or generic success message"
    
    WebUI.comment('✅ TC_AUTH_012 PASSED: Appropriate message shown for non-existent email')
    
} catch (Exception e) {
    WebUI.comment('❌ TC_AUTH_012 FAILED: ' + e.getMessage())
    throw e
    
} finally {
    WebUI.closeBrowser()
}
