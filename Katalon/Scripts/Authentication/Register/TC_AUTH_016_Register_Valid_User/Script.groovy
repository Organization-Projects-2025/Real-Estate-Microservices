import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import authentication.Register_Keywords as RegisterKeywords

WebUI.openBrowser('')
RegisterKeywords registerHelper = new RegisterKeywords()

try {
    String uniqueEmail = registerHelper.generateUniqueEmail('newuser')
    
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
