import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import authentication.Login_Keywords as LoginKeywords

WebUI.openBrowser('')
LoginKeywords loginHelper = new LoginKeywords()

try {
    loginHelper.navigateToLogin()
    
    loginHelper.login('admin@realestate.com', 'WrongPassword123!')
    
    loginHelper.verifyLoginError('Invalid email or password')
    
    WebUI.comment('✅ TC_AUTH_003 PASSED: Login correctly failed with incorrect password')
    
} catch (Exception e) {
    WebUI.comment('❌ TC_AUTH_003 FAILED: ' + e.getMessage())
    throw e
    
} finally {
    WebUI.closeBrowser()
}
