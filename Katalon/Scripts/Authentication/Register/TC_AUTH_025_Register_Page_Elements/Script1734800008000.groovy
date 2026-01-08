import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import authentication.Register_Keywords as RegisterKeywords

WebUI.openBrowser('')
WebUI.maximizeWindow()
RegisterKeywords registerHelper = new RegisterKeywords()

try {
    registerHelper.navigateToRegister()
    
    WebUI.verifyElementPresent(findTestObject('Authentication/RegisterPage/pageTitle'), 10)
    
    WebUI.verifyElementPresent(findTestObject('Authentication/RegisterPage/firstNameInput'), 10)
    WebUI.verifyElementPresent(findTestObject('Authentication/RegisterPage/lastNameInput'), 10)
    WebUI.verifyElementPresent(findTestObject('Authentication/RegisterPage/emailInput'), 10)
    WebUI.verifyElementPresent(findTestObject('Authentication/RegisterPage/passwordInput'), 10)
    
    WebUI.verifyElementPresent(findTestObject('Authentication/RegisterPage/roleLabel'), 10)
    WebUI.verifyElementPresent(findTestObject('Authentication/RegisterPage/roleSelect'), 10)
    
    WebUI.verifyElementPresent(findTestObject('Authentication/RegisterPage/passwordRequirements'), 10)
    
    WebUI.verifyElementPresent(findTestObject('Authentication/RegisterPage/registerButton'), 10)
    WebUI.verifyElementPresent(findTestObject('Authentication/RegisterPage/loginLink'), 10)
    
    println('✓ TC_AUTH_025 PASSED: All Register page elements present')
    
} catch (Exception e) {
    println('✗ TC_AUTH_025 FAILED: ' + e.getMessage())
    throw e
} finally {
    WebUI.closeBrowser()
}
