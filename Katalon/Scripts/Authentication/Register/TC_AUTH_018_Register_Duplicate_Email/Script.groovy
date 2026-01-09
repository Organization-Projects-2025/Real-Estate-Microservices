import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import authentication.Register_Keywords as RegisterKeywords

WebUI.openBrowser('')
RegisterKeywords registerHelper = new RegisterKeywords()

try {
    String uniqueEmail = registerHelper.generateUniqueEmail('duplicate')
    
    registerHelper.registerAsUser(
        'John',
        'Doe',
        uniqueEmail,
        'Password123!'
    )
    
    registerHelper.verifyRegistrationSuccess()
    
    registerHelper.navigateToRegister()
    
    registerHelper.registerAsUser(
        'Jane',
        'Smith',
        uniqueEmail,
        'Password123!'
    )
    
    registerHelper.verifyRegistrationError('already exists')
    
    WebUI.comment("✅ TC_AUTH_018 PASSED: Duplicate email correctly prevented")
    
} catch (Exception e) {
    WebUI.comment('❌ TC_AUTH_018 FAILED: ' + e.getMessage())
    throw e
    
} finally {
    WebUI.closeBrowser()
}
