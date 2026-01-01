import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import authentication.ForgotPassword_Keywords as ForgotPasswordKeywords

/**
 * Test Case: TC_AUTH_011 - Forgot Password with Valid Email
 * 
 * Description: Verify password reset email is sent for valid registered email
 * Test Data: admin@realestate.com (seeded user)
 */

WebUI.openBrowser('')
ForgotPasswordKeywords forgotPasswordHelper = new ForgotPasswordKeywords()

try {
    // Arrange
    forgotPasswordHelper.navigateToForgotPassword()
    
    // Act: Submit forgot password with valid email
    forgotPasswordHelper.submitForgotPassword('admin@realestate.com')
    
    // Assert: Verify success message
    forgotPasswordHelper.verifyResetLinkSent()
    
    WebUI.comment('✅ TC_AUTH_011 PASSED: Reset link sent successfully for valid email')
    
} catch (Exception e) {
    WebUI.comment('❌ TC_AUTH_011 FAILED: ' + e.getMessage())
    throw e
    
} finally {
    WebUI.closeBrowser()
}
