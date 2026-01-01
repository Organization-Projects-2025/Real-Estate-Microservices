import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import authentication.Login_Keywords as LoginKeywords

/**
 * Test Case: TC_AUTH_005 - Forgot Password Link Navigation
 * 
 * Description: Verify that clicking "Forgot Password" link navigates to reset page
 */

WebUI.openBrowser('')
LoginKeywords loginHelper = new LoginKeywords()

try {
    // Arrange
    loginHelper.navigateToLogin()
    
    // Act: Click forgot password link
    loginHelper.clickForgotPassword()
    
    // Assert: Verify navigation to forgot password page
    String currentUrl = WebUI.getUrl()
    assert currentUrl.contains('/forget-password') || currentUrl.contains('/forgot-password'),
        "Should navigate to forgot password page. Current URL: ${currentUrl}"
    
    WebUI.comment('✅ TC_AUTH_005 PASSED: Forgot Password link works correctly')
    
} catch (Exception e) {
    WebUI.comment('❌ TC_AUTH_005 FAILED: ' + e.getMessage())
    throw e
    
} finally {
    WebUI.closeBrowser()
}
