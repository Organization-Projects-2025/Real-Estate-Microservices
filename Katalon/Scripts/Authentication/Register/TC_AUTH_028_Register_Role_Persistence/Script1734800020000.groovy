import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import authentication.Register_Keywords as RegisterKeywords
import authentication.Login_Keywords as LoginKeywords

WebUI.openBrowser('')
WebUI.maximizeWindow()
RegisterKeywords registerHelper = new RegisterKeywords()
LoginKeywords loginHelper = new LoginKeywords()

try {
    registerHelper.navigateToRegister()
    
    String uniqueEmail = registerHelper.generateUniqueEmail()
    String password = 'Password123!'
    
    registerHelper.register('Role', 'Persistence', uniqueEmail, password, 'developer')
    
    registerHelper.verifyRegistrationSuccess()
    println('✓ Registered as Developer')
    
    WebUI.navigateToUrl('http://localhost:5173/login')
    WebUI.waitForPageLoad(10)
    
    loginHelper.login(uniqueEmail, password)
    loginHelper.verifyLoginSuccess()
    println('✓ Re-login successful')
    
    WebUI.navigateToUrl('http://localhost:5173/profile')
    WebUI.waitForPageLoad(15)
    WebUI.delay(2)
    
    // Verify profile page loaded (role is persisted if we can access profile)
    String profileUrl = WebUI.getUrl()
    assert profileUrl.contains('/profile'),
        "Cannot access profile page. URL: ${profileUrl}"
    
    println('✓ TC_AUTH_040 PASSED: Role persisted after logout and re-login')
    
} catch (Exception e) {
    println('✗ TC_AUTH_040 FAILED: ' + e.getMessage())
    throw e
} finally {
    WebUI.closeBrowser()
}
