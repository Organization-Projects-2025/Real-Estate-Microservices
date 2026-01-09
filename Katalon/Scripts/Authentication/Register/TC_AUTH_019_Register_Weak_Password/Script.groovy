import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import authentication.Register_Keywords as RegisterKeywords

WebUI.openBrowser('')
RegisterKeywords registerHelper = new RegisterKeywords()

try {
    String uniqueEmail = registerHelper.generateUniqueEmail('weakpass')
    
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
