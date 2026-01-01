import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import authentication.ResetPassword_Keywords as ResetPasswordKeywords

/**
 * Test Case: TC_AUTH_016 - Reset Password with Invalid Token
 * 
 * Description: Verify password reset fails with invalid/expired token
 * Test Data: Invalid/fake token
 */

WebUI.openBrowser('')
ResetPasswordKeywords resetPasswordHelper = new ResetPasswordKeywords()

try {
    // Arrange: Use an invalid token
    String invalidToken = 'invalid-fake-token-123456'
    
    // Act: Navigate with invalid token
    resetPasswordHelper.navigateToResetPassword(invalidToken)
    
    // Wait for page load
    WebUI.delay(3)
    
    // Assert: Verify error about invalid token
    // This could be displayed as error message or redirect to error page
    boolean hasError = WebUI.verifyElementPresent(
        findTestObject('Object Repository/Authentication/ResetPasswordPage/errorMessage'),
        10,
        com.kms.katalon.core.model.FailureHandling.OPTIONAL
    )
    
    String currentUrl = WebUI.getUrl()
    
    // Either shows error or redirects away from reset page
    assert hasError || !currentUrl.contains('/reset-password'),
        "Invalid token should show error or redirect. Current URL: ${currentUrl}"
    
    WebUI.comment('✅ TC_AUTH_016 PASSED: Invalid token correctly rejected')
    
} catch (Exception e) {
    WebUI.comment('❌ TC_AUTH_016 FAILED: ' + e.getMessage())
    throw e
    
} finally {
    WebUI.closeBrowser()
}
