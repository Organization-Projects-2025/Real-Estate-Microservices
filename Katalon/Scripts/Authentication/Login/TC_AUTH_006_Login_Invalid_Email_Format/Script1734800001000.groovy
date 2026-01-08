import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import authentication.Login_Keywords as LoginKeywords

/**
 * TC_AUTH_006: Verify invalid email format is rejected during login
 * 
 * Test Steps:
 * 1. Navigate to login page
 * 2. Enter email without @ symbol
 * 3. Enter valid password
 * 4. Attempt to click login button
 * 5. Verify HTML5 validation error message appears
 */

// Arrange - Initialize test
WebUI.openBrowser('')
WebUI.maximizeWindow()
LoginKeywords loginHelper = new LoginKeywords()

try {
    loginHelper.navigateToLogin()
    
    loginHelper.login('notanemail', 'Password123!')
    
    // Assert - Verify HTML5 validation message appears
    loginHelper.verifyEmailValidationMessage("include an '@'")
    
    println('✓ TC_AUTH_006 PASSED: Invalid email format rejected by HTML5 validation')
    
} catch (Exception e) {
    println('✗ TC_AUTH_006 FAILED: ' + e.getMessage())
    throw e
} finally {
    WebUI.closeBrowser()
}
