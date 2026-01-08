import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import authentication.Register_Keywords as RegisterKeywords

WebUI.openBrowser('')
WebUI.maximizeWindow()
RegisterKeywords registerHelper = new RegisterKeywords()

try {
    // Arrange - Navigate to register page
    registerHelper.navigateToRegister()
    
    // Arrange - Generate unique email
    String uniqueEmail = registerHelper.generateUniqueEmail()
    
    // Act - Register new user using Keywords
    registerHelper.register('Auto', 'Login', uniqueEmail, 'Password123!', 'user')
    
    // Assert - Verify auto-login (redirected to home, not login page)
    String currentUrl = WebUI.getUrl()
    assert !currentUrl.contains('/login'),
        "User not auto-logged in: On login page. URL: ${currentUrl}"
    assert !currentUrl.contains('/register'),
        "User not auto-logged in: Still on register page. URL: ${currentUrl}"
    
    // Should be on home page
    assert currentUrl == 'http://localhost:5173/' || currentUrl == 'http://localhost:5173',
        "User not redirected to home page. URL: ${currentUrl}"
    
    println('✓ TC_AUTH_036 PASSED: Registration auto-logs in user')
    
} catch (Exception e) {
    println('✗ TC_AUTH_036 FAILED: ' + e.getMessage())
    throw e
} finally {
    WebUI.closeBrowser()
}
