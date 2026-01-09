import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import authentication.Login_Keywords as LoginKeywords

WebUI.openBrowser('')
WebUI.maximizeWindow()
LoginKeywords loginHelper = new LoginKeywords()

try {
    // Arrange - Navigate to login page
    loginHelper.navigateToLogin()
    
    // Act - Attempt login with email containing special characters
    loginHelper.login('test+label@example.com', 'Password123!')
    
    // Assert - Verify error is shown (user doesn't exist, not email format error)
    loginHelper.verifyLoginError('Invalid email or password')
    
    println('✓ TC_AUTH_018 PASSED: Email with special characters handled correctly')
    
} catch (Exception e) {
    println('✗ TC_AUTH_018 FAILED: ' + e.getMessage())
    throw e
} finally {
    WebUI.closeBrowser()
}
