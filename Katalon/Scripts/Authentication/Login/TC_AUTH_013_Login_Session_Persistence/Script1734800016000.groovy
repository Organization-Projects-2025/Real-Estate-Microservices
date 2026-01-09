import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import authentication.Login_Keywords as LoginKeywords

WebUI.openBrowser('')
WebUI.maximizeWindow()
LoginKeywords loginHelper = new LoginKeywords()

try {
    // Arrange & Act - Login
    loginHelper.navigateToLogin()
    loginHelper.login('user1@realestate.com', 'Password123!')
    loginHelper.verifyLoginSuccess()
    
    println('✓ Initial login successful')
    
    // Test 1: Refresh page
    WebUI.refresh()
    WebUI.waitForPageLoad(15)
    WebUI.delay(2)
    
    String urlAfterRefresh = WebUI.getUrl()
    assert !urlAfterRefresh.contains('/login'),
        "Session not persisted: Redirected to login after refresh"
    
    println('✓ Session persisted after page refresh')
    
    WebUI.navigateToUrl('http://localhost:5173/profile')
    WebUI.waitForPageLoad(15)
    WebUI.delay(2)
    
    String urlAfterNavigation = WebUI.getUrl()
    assert !urlAfterNavigation.contains('/login'),
        "Session not persisted: Redirected to login after navigation"
    
    println('✓ TC_AUTH_034 PASSED: Session persists across page refresh and navigation')
    
} catch (Exception e) {
    println('✗ TC_AUTH_034 FAILED: ' + e.getMessage())
    throw e
} finally {
    WebUI.closeBrowser()
}
