import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import authentication.Login_Keywords as LoginKeywords

WebUI.openBrowser('')
LoginKeywords loginHelper = new LoginKeywords()

try {
    loginHelper.navigateToLogin()
    
    loginHelper.login('admin@realestate.com', 'Password123!')
    
    loginHelper.verifyLoginSuccess()
    
    WebUI.comment('✅ TC_AUTH_001 PASSED: User successfully logged in with valid credentials')
    
} catch (Exception e) {
    WebUI.comment('❌ TC_AUTH_001 FAILED: ' + e.getMessage())
    throw e
    
} finally {
    // Cleanup
    WebUI.closeBrowser()
}
