import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import authentication.Login_Keywords as LoginKeywords

WebUI.openBrowser('')
WebUI.maximizeWindow()
LoginKeywords loginHelper = new LoginKeywords()

try {
    // Arrange - Navigate to login page
    loginHelper.navigateToLogin()
    
    WebUI.verifyElementPresent(findTestObject('Authentication/LoginPage/pageTitle'), 10)
    
    WebUI.verifyElementPresent(findTestObject('Authentication/LoginPage/emailLabel'), 10)
    WebUI.verifyElementPresent(findTestObject('Authentication/LoginPage/passwordLabel'), 10)
    
    WebUI.verifyElementPresent(findTestObject('Authentication/LoginPage/emailInput'), 10)
    WebUI.verifyElementPresent(findTestObject('Authentication/LoginPage/passwordInput'), 10)
    
    WebUI.verifyElementPresent(findTestObject('Authentication/LoginPage/loginButton'), 10)
    WebUI.verifyElementPresent(findTestObject('Authentication/LoginPage/forgotPasswordLink'), 10)
    WebUI.verifyElementPresent(findTestObject('Authentication/LoginPage/signUpLink'), 10)
    
    println('✓ TC_AUTH_024 PASSED: All Login page elements present')
    
} catch (Exception e) {
    println('✗ TC_AUTH_024 FAILED: ' + e.getMessage())
    throw e
} finally {
    WebUI.closeBrowser()
}
