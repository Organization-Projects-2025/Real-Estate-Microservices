import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import authentication.Login_Keywords as LoginKeywords

WebUI.openBrowser('')
WebUI.maximizeWindow()
LoginKeywords loginHelper = new LoginKeywords()

try {
    loginHelper.navigateToLogin()
    loginHelper.login('user3@realestate.com', 'Password123!')
    loginHelper.verifyLoginSuccess()
    
    println('✓ Login successful')
    
    loginHelper.navigateToLogin()
    WebUI.delay(2)
    
    // Verify login button is NOT present
    boolean loginButtonPresent = WebUI.verifyElementPresent(
        findTestObject('Authentication/LoginPage/loginButton'),
        5,
        com.kms.katalon.core.model.FailureHandling.OPTIONAL
    )
    
    assert !loginButtonPresent,
        "FAIL: Logged-in user can access login page - login button is visible"
    
    println('✓ TC_AUTH_037 PASSED: Authenticated users cannot access login page')
    
} catch (Exception e) {
    println('✗ TC_AUTH_037 FAILED: ' + e.getMessage())
    throw e
} finally {
    WebUI.closeBrowser()
}
