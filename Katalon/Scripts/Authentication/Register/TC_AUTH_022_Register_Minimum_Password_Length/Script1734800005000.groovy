import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import authentication.Register_Keywords as RegisterKeywords

WebUI.openBrowser('')
WebUI.maximizeWindow()
RegisterKeywords registerHelper = new RegisterKeywords()

try {
    registerHelper.navigateToRegister()
    
    String uniqueEmail = registerHelper.generateUniqueEmail()
    
    registerHelper.register('Min', 'Password', uniqueEmail, 'Pass123!', 'user')
    
    // Verify registration succeeds
    registerHelper.verifyRegistrationSuccess()
    
    println('✓ TC_AUTH_022 PASSED: Minimum password length (8 chars) accepted')
    
} catch (Exception e) {
    println('✗ TC_AUTH_022 FAILED: ' + e.getMessage())
    throw e
} finally {
    WebUI.closeBrowser()
}
