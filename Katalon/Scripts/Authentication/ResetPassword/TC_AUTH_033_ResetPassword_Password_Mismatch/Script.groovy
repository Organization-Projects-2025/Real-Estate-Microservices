import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import authentication.ResetPassword_Keywords as ResetPasswordKeywords

WebUI.openBrowser('')
WebUI.maximizeWindow()
ResetPasswordKeywords resetPasswordHelper = new ResetPasswordKeywords()

try {
    String validToken = 'valid-test-token-abc123def456'
    String password = 'Password123!@#'
    String confirmPassword = 'DifferentPass456!@#'
    
    resetPasswordHelper.resetPassword(validToken, password, confirmPassword)
    
    resetPasswordHelper.verifyResetPasswordError('password')
    
    println('✓ TC_AUTH_034 PASSED: Password mismatch error displayed correctly')
    
} catch (Exception e) {
    println('✗ TC_AUTH_034 FAILED: ' + e.getMessage())
    throw e
} finally {
    WebUI.closeBrowser()
}
