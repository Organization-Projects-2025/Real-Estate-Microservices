import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import authentication.Register_Keywords as RegisterKeywords

/**
 * Test Case: TC_AUTH_006 - Register New User with Valid Data
 * 
 * Description: Verify successful registration as a regular user
 * Test Data: New unique user data
 */

WebUI.openBrowser('')
RegisterKeywords registerHelper = new RegisterKeywords()

try {
    // Arrange
    String uniqueEmail = registerHelper.generateUniqueEmail('newuser')
    
    // Act: Register with valid data
    registerHelper.registerAsUser(
        'John',
        'Doe',
        uniqueEmail,
        'Password123!'
    )
    
    // Assert: Verify successful registration
    registerHelper.verifyRegistrationSuccess()
    
    WebUI.comment("✅ TC_AUTH_006 PASSED: User registered successfully with email: ${uniqueEmail}")
    
} catch (Exception e) {
    WebUI.comment('❌ TC_AUTH_006 FAILED: ' + e.getMessage())
    throw e
    
} finally {
    WebUI.closeBrowser()
}
