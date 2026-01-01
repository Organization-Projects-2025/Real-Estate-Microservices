import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import authentication.Login_Keywords as LoginKeywords

/**
 * Test Case: TC_AUTH_003 - Login with Incorrect Password
 * 
 * Description: Verify that login fails when correct email but wrong password
 * Test Data: Valid email with incorrect password
 */

WebUI.openBrowser('')
LoginKeywords loginHelper = new LoginKeywords()

try {
    // Arrange
    loginHelper.navigateToLogin()
    
    // Act: Login with valid email but wrong password
    loginHelper.login('admin@realestate.com', 'WrongPassword123!')
    
    // Assert: Verify error message
    loginHelper.verifyLoginError('Invalid email or password')
    
    WebUI.comment('✅ TC_AUTH_003 PASSED: Login correctly failed with incorrect password')
    
} catch (Exception e) {
    WebUI.comment('❌ TC_AUTH_003 FAILED: ' + e.getMessage())
    throw e
    
} finally {
    WebUI.closeBrowser()
}
