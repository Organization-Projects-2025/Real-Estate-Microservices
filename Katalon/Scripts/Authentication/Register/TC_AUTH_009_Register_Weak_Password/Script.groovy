import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import authentication.Register_Keywords as RegisterKeywords

/**
 * Test Case: TC_AUTH_009 - Register with Weak Password
 * 
 * Description: Verify registration fails with password not meeting requirements
 * Requirements: 8+ chars, uppercase, lowercase, number, special char
 * Test Data: Weak password "pass"
 */

WebUI.openBrowser('')
RegisterKeywords registerHelper = new RegisterKeywords()

try {
    // Arrange
    String uniqueEmail = registerHelper.generateUniqueEmail('weakpass')
    
    // Act: Attempt registration with weak password
    registerHelper.register(
        'Weak',
        'Password',
        uniqueEmail,
        'pass',  // Weak password
        'user'
    )
    
    // Assert: Verify error about password requirements
    registerHelper.verifyRegistrationError('password')
    
    // Verify password requirements are shown
    registerHelper.verifyPasswordRequirementsDisplayed()
    
    WebUI.comment('✅ TC_AUTH_009 PASSED: Registration correctly rejected weak password')
    
} catch (Exception e) {
    WebUI.comment('❌ TC_AUTH_009 FAILED: ' + e.getMessage())
    throw e
    
} finally {
    WebUI.closeBrowser()
}
