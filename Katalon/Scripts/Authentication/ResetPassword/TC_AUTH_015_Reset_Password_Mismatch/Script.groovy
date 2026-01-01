import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import authentication.ResetPassword_Keywords as ResetPasswordKeywords

/**
 * Test Case: TC_AUTH_015 - Reset Password with Mismatched Passwords
 * 
 * Description: Verify password reset fails when passwords don't match
 * Test Data: Valid token but mismatched passwords
 * 
 * IMPORTANT: Replace token with valid one before running
 */

WebUI.openBrowser('')
ResetPasswordKeywords resetPasswordHelper = new ResetPasswordKeywords()

try {
    // CONFIGURE THIS: Replace with actual valid token
    String validToken = 'REPLACE_WITH_VALID_TOKEN_FROM_EMAIL'
    
    // Arrange
    resetPasswordHelper.navigateToResetPassword(validToken)
    resetPasswordHelper.verifyResetPasswordPageLoaded()
    
    // Act: Submit with mismatched passwords
    resetPasswordHelper.submitResetPassword('NewPassword123!', 'DifferentPassword123!')
    
    // Assert: Verify error about password mismatch
    resetPasswordHelper.verifyResetPasswordError('match')
    
    WebUI.comment('✅ TC_AUTH_015 PASSED: Password mismatch correctly detected')
    
} catch (Exception e) {
    WebUI.comment('❌ TC_AUTH_015 FAILED: ' + e.getMessage())
    WebUI.comment('NOTE: Ensure you have a valid reset token before running this test')
    throw e
    
} finally {
    WebUI.closeBrowser()
}
