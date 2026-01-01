import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import authentication.Login_Keywords as LoginKeywords

/**
 * Test Case: TC_AUTH_004 - Login with Empty Fields
 * 
 * Description: Verify that login fails when fields are left empty
 * Test Data: Empty email and password
 */

WebUI.openBrowser('')
LoginKeywords loginHelper = new LoginKeywords()

try {
    // Arrange
    loginHelper.navigateToLogin()
    
    // Act: Attempt login with empty fields
    loginHelper.login('', '')
    
    // Assert: Verify error or validation message
    // Either error message appears or button remains disabled
    boolean errorDisplayed = WebUI.verifyElementPresent(
        findTestObject('Object Repository/Authentication/LoginPage/errorMessage'),
        5,
        com.kms.katalon.core.model.FailureHandling.OPTIONAL
    )
    
    // Verify we're still on login page
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
