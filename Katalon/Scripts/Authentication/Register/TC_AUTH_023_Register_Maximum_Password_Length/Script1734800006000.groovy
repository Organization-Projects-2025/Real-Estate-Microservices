import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import authentication.Register_Keywords as RegisterKeywords

WebUI.openBrowser('')
WebUI.maximizeWindow()
RegisterKeywords registerHelper = new RegisterKeywords()

try {
    registerHelper.navigateToRegister()
    
    // Generate unique email
    String uniqueEmail = registerHelper.generateUniqueEmail()
    
    String maxPassword = 'P' * 120 + 'assw0rd!' 
    
    registerHelper.register('Max', 'Password', uniqueEmail, maxPassword, 'user')
    
    WebUI.verifyElementPresent(findTestObject('Authentication/RegisterPage/errorMessage'), 10)
    println('✓ TC_AUTH_023 PASSED: Maximum password length rejected with proper error')
    
} catch (Exception e) {
    println('✗ TC_AUTH_023 FAILED: ' + e.getMessage())
    throw e
} finally {
    WebUI.closeBrowser()
}
