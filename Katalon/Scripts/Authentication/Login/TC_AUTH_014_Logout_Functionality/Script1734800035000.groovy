import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import authentication.Login_Keywords as LoginKeywords

WebUI.openBrowser('')
WebUI.maximizeWindow()
LoginKeywords loginHelper = new LoginKeywords()

try {
    loginHelper.navigateToLogin()
    loginHelper.login('user1@realestate.com', 'Password123!')
    loginHelper.verifyLoginSuccess()
    
    println('✓ Login successful')
    
    loginHelper.logout()
    
    println('✓ Logout successful - redirected to login page')
    
    // Verify session is cleared - try to access profile page
    WebUI.navigateToUrl('http://localhost:5173/profile')
    WebUI.waitForPageLoad(10)
    WebUI.delay(2)
    
    String currentUrl = WebUI.getUrl()
    assert currentUrl.contains('/login'),
        "Session not cleared: Can still access home page after logout. URL: ${currentUrl}"
    
    println('✓ TC_AUTH_035 PASSED: Logout cleared session successfully')
    
} catch (Exception e) {
    println('✗ TC_AUTH_035 FAILED: ' + e.getMessage())
    throw e
} finally {
    WebUI.closeBrowser()
}
