import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import authentication.Login_Keywords as LoginKeywords

WebUI.openBrowser('')
WebUI.maximizeWindow()
LoginKeywords loginHelper = new LoginKeywords()

try {
    // Arrange - Navigate to login page
    loginHelper.navigateToLogin()
    
    // Act - Attempt login with email containing leading/trailing spaces
    loginHelper.login('  user1@realestate.com  ', 'Password123!')
    
    // Assert - Verify login succeeds (spaces were trimmed)
    loginHelper.verifyLoginSuccess()
    
    println('✓ TC_AUTH_020 PASSED: Spaces trimmed from email successfully')
    
} catch (Exception e) {
    println('✗ TC_AUTH_020 FAILED: ' + e.getMessage())
    throw e
} finally {
    WebUI.closeBrowser()
}
