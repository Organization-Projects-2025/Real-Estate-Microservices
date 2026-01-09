import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import authentication.Login_Keywords as LoginKeywords

WebUI.openBrowser('')
WebUI.maximizeWindow()
LoginKeywords loginHelper = new LoginKeywords()

try {
    loginHelper.navigateToLogin()
    
    String longEmail = 'a' * 300 + '@example.com'
    String longPassword = 'P' * 200 + '123!'
    
    loginHelper.login(longEmail, longPassword)
    
    // Assert - Verify application doesn't crash and shows error
    WebUI.verifyElementPresent(findTestObject('Authentication/LoginPage/errorMessage'), 10)
    
    println('✓ TC_AUTH_019 PASSED: Long input handled gracefully without crash')
    
} catch (Exception e) {
    println('✗ TC_AUTH_019 FAILED: ' + e.getMessage())
    throw e
} finally {
    WebUI.closeBrowser()
}
