import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import authentication.ResetPassword_Keywords as ResetPasswordKeywords

/**
 * Test Case: TC_AUTH_014 - Reset Password with Valid Token and Matching Passwords
 * 
 * Description: Verify password reset succeeds with valid token and matching passwords
 * 
 * IMPORTANT: This test requires a VALID reset token
 * You must manually obtain a reset token by:
 * 1. Running TC_AUTH_011 first to trigger reset email
 * 2. Checking email service/logs for the token
 * 3. Updating the token variable below before running this test
 */

WebUI.openBrowser('')
ResetPasswordKeywords resetPasswordHelper = new ResetPasswordKeywords()

try {
    // CONFIGURE THIS: Replace with actual valid token
    String validToken = 'REPLACE_WITH_VALID_TOKEN_FROM_EMAIL'
    
    // Arrange: Navigate to reset password page with token
    resetPasswordHelper.navigateToResetPassword(validToken)
    resetPasswordHelper.verifyResetPasswordPageLoaded()
    
    // Act: Submit new password
    resetPasswordHelper.submitResetPassword('NewPassword123!', 'NewPassword123!')
    
    // Assert: Verify success
    resetPasswordHelper.verifyResetPasswordSuccess()
    
    WebUI.comment('✅ TC_AUTH_014 PASSED: Password reset successfully with valid token')
    
} catch (Exception e) {
    WebUI.comment('❌ TC_AUTH_014 FAILED: ' + e.getMessage())
    WebUI.comment('NOTE: Ensure you have a valid reset token before running this test')
    throw e
    
} finally {
    WebUI.closeBrowser()
}
