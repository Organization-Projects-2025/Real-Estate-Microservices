import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import authentication.Login_Keywords as LoginKeywords

WebUI.openBrowser('')
WebUI.maximizeWindow()
LoginKeywords loginHelper = new LoginKeywords()

try {
    loginHelper.navigateToLogin()
    
    String xssEmail = '<script>alert("XSS")</script>@test.com'
    String xssPassword = '<img src=x onerror=alert("XSS")>'
    
    loginHelper.login(xssEmail, xssPassword)
    
    // Assert - Verify no alert popup
    boolean alertPresent = WebUI.verifyAlertPresent(2, com.kms.katalon.core.model.FailureHandling.OPTIONAL)
    assert !alertPresent, "XSS VULNERABILITY: Alert popup was triggered!"
    
    println('✓ TC_AUTH_030 PASSED: XSS attack prevented')
    
} catch (Exception e) {
    println('✗ TC_AUTH_030 FAILED: ' + e.getMessage())
    throw e
} finally {
    WebUI.closeBrowser()
}
