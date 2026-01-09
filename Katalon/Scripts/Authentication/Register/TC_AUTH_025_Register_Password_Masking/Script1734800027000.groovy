import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import authentication.Register_Keywords as RegisterKeywords

WebUI.openBrowser('')
WebUI.maximizeWindow()
RegisterKeywords registerHelper = new RegisterKeywords()

try {
    registerHelper.navigateToRegister()
    
    // Assert - Verify password field is masked
    String passwordType = WebUI.getAttribute(
        findTestObject('Authentication/RegisterPage/passwordInput'),
        'type'
    )
    assert passwordType == 'password',
        "Register password field should be type='password', but was: ${passwordType}"
    
    println('✓ TC_AUTH_027 PASSED: Register password field is properly masked')
    
} catch (Exception e) {
    println('✗ TC_AUTH_027 FAILED: ' + e.getMessage())
    throw e
} finally {
    WebUI.closeBrowser()
}
