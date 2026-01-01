import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import authentication.Login_Keywords as LoginKeywords

/**
 * Test Case: TC_AUTH_002 - Login with Invalid Email
 * 
 * Description: Verify that login fails with invalid/non-existent email
 * Test Data: Invalid email that doesn't exist in database
 */

WebUI.openBrowser('')
LoginKeywords loginHelper = new LoginKeywords()

try {
    // Arrange
    loginHelper.navigateToLogin()
    
    // Act: Attempt login with invalid email
    loginHelper.login('nonexistent@test.com', 'Password123!')
    
    // Assert: Verify error message is displayed
    loginHelper.verifyLoginError('Invalid email or password')
    
    WebUI.comment('✅ TC_AUTH_002 PASSED: Login correctly failed with invalid email')
    
} catch (Exception e) {
    WebUI.comment('❌ TC_AUTH_002 FAILED: ' + e.getMessage())
    throw e
    
} finally {
    WebUI.closeBrowser()
}
