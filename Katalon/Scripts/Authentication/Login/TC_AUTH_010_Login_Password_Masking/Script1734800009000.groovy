import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import authentication.Login_Keywords as LoginKeywords

WebUI.openBrowser('')
WebUI.maximizeWindow()
LoginKeywords loginHelper = new LoginKeywords()

try {
    loginHelper.navigateToLogin()
    
    // Assert - Verify password field is masked
    String passwordType = WebUI.getAttribute(
        findTestObject('Authentication/LoginPage/passwordInput'),
        'type'
    )
    assert passwordType == 'password', 
        "Login password field should be type='password', but was: ${passwordType}"
    
    println('✓ TC_AUTH_026 PASSED: Login password field is properly masked')
    
} catch (Exception e) {
    println('✗ TC_AUTH_026 FAILED: ' + e.getMessage())
    throw e
} finally {
    WebUI.closeBrowser()
}
