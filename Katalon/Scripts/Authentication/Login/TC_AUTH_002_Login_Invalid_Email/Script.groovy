import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import authentication.Login_Keywords as LoginKeywords

WebUI.openBrowser('')
LoginKeywords loginHelper = new LoginKeywords()

try {
    loginHelper.navigateToLogin()
    
    loginHelper.login('nonexistent@test.com', 'Password123!')
    
    loginHelper.verifyLoginError('Invalid email or password')
    
    WebUI.comment('✅ TC_AUTH_002 PASSED: Login correctly failed with invalid email')
    
} catch (Exception e) {
    WebUI.comment('❌ TC_AUTH_002 FAILED: ' + e.getMessage())
    throw e
    
} finally {
    WebUI.closeBrowser()
}
