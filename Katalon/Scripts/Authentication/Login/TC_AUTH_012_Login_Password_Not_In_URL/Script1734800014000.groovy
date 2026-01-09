import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import authentication.Login_Keywords as LoginKeywords

WebUI.openBrowser('')
WebUI.maximizeWindow()
LoginKeywords loginHelper = new LoginKeywords()

try {
    loginHelper.navigateToLogin()
    
    String testPassword = 'Password123!'
    
    loginHelper.login('user1@realestate.com', testPassword)
    
    // Assert - Check URL during login process
    String urlDuringLogin = WebUI.getUrl()
    assert !urlDuringLogin.contains(testPassword),
        "SECURITY VULNERABILITY: Password found in URL during login: ${urlDuringLogin}"
    assert !urlDuringLogin.toLowerCase().contains('password='),
        "SECURITY VULNERABILITY: Password parameter in URL: ${urlDuringLogin}"
    
    WebUI.waitForPageLoad(20)
    
    // Assert - Check URL after navigation
    String urlAfterLogin = WebUI.getUrl()
    assert !urlAfterLogin.contains(testPassword),
        "SECURITY VULNERABILITY: Password found in URL after login: ${urlAfterLogin}"
    assert !urlAfterLogin.toLowerCase().contains('password='),
        "SECURITY VULNERABILITY: Password parameter in URL: ${urlAfterLogin}"
    
    // Navigate back to check history
    WebUI.back()
    WebUI.delay(1)
    String urlAfterBack = WebUI.getUrl()
    assert !urlAfterBack.contains(testPassword),
        "SECURITY VULNERABILITY: Password in browser history: ${urlAfterBack}"
    
    println('✓ TC_AUTH_032 PASSED: Password not exposed in URL or history')
    
} catch (Exception e) {
    println('✗ TC_AUTH_032 FAILED: ' + e.getMessage())
    throw e
} finally {
    WebUI.closeBrowser()
}
