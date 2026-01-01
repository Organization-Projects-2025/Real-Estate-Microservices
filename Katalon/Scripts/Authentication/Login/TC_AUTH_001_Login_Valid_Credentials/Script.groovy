import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import authentication.Login_Keywords as LoginKeywords

/**
 * Test Case: TC_AUTH_001 - Login with Valid Credentials
 * 
 * Description: Verify that a user can successfully login with valid credentials
 * Prerequisites: User must be seeded in database
 * Test Data: admin@realestate.com / Password123!
 */

// Initialize
WebUI.openBrowser('')
LoginKeywords loginHelper = new LoginKeywords()

try {
    // Arrange: Navigate to login page
    loginHelper.navigateToLogin()
    
    // Act: Login with valid credentials
    loginHelper.login('admin@realestate.com', 'Password123!')
    
    // Assert: Verify successful login
    loginHelper.verifyLoginSuccess()
    
    WebUI.comment('✅ TC_AUTH_001 PASSED: User successfully logged in with valid credentials')
    
} catch (Exception e) {
    WebUI.comment('❌ TC_AUTH_001 FAILED: ' + e.getMessage())
    throw e
    
} finally {
    // Cleanup
    WebUI.closeBrowser()
}
