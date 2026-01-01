import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import authentication.ForgotPassword_Keywords as ForgotPasswordKeywords

/**
 * Test Case: TC_AUTH_013 - Forgot Password with Empty Email
 * 
 * Description: Verify validation prevents submission with empty email
 * Test Data: Empty string
 */

WebUI.openBrowser('')
ForgotPasswordKeywords forgotPasswordHelper = new ForgotPasswordKeywords()

try {
    // Arrange
    forgotPasswordHelper.navigateToForgotPassword()
    
    // Act: Submit with empty email
    forgotPasswordHelper.submitForgotPassword('')
    
    // Assert: Verify we're still on forgot password page
    String currentUrl = WebUI.getUrl()
    assert currentUrl.contains('/forget-password') || currentUrl.contains('/forgot-password'),
        "Should remain on forgot password page with empty email. Current URL: ${currentUrl}"
    
    WebUI.comment('✅ TC_AUTH_013 PASSED: Submission prevented with empty email')
    
} catch (Exception e) {
    WebUI.comment('❌ TC_AUTH_013 FAILED: ' + e.getMessage())
    throw e
    
} finally {
    WebUI.closeBrowser()
}
