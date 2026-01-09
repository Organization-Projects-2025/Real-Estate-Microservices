import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import authentication.Login_Keywords as LoginKeywords

WebUI.openBrowser('')
LoginKeywords loginHelper = new LoginKeywords()

try {
    loginHelper.navigateToLogin()
    
    loginHelper.login('', '')
    
    boolean errorDisplayed = WebUI.verifyElementPresent(
        findTestObject('Object Repository/Authentication/LoginPage/errorMessage'),
        5,
        com.kms.katalon.core.model.FailureHandling.OPTIONAL
    )
    
    String currentUrl = WebUI.getUrl()
    assert currentUrl.contains('/login'), 
        "Should remain on login page with empty fields. Current URL: ${currentUrl}"
    
    WebUI.comment('✅ TC_AUTH_004 PASSED: Login correctly prevented with empty fields')
    
} catch (Exception e) {
    WebUI.comment('❌ TC_AUTH_004 FAILED: ' + e.getMessage())
    throw e
    
} finally {
    WebUI.closeBrowser()
}
