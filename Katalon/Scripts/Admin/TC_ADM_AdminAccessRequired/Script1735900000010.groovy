import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import com.kms.katalon.core.model.FailureHandling
import authentication.Login_Keywords as LoginKeywords
import admin.User_Keywords as UserKeywords

/**
 * Test Case: TC_ADM_USER_011 - Admin Access Required for Users Page
 * Module: Admin Service - User Management
 * Priority: High
 * 
 * Description: Verify that only admin users can access the Users Management page
 * Prerequisites: Application is running on localhost:5173
 * Expected: Unauthenticated users redirected to login, non-admin users denied access
 */

// Initialize
WebUI.openBrowser('')
LoginKeywords loginHelper = new LoginKeywords()
UserKeywords userHelper = new UserKeywords()

String usersUrl = 'http://localhost:5173/admin/users'
String loginUrl = 'http://localhost:5173/login'
String homeUrl = 'http://localhost:5173'

try {
    // Test 1: Try to access Users page without login
    WebUI.navigateToUrl(usersUrl)
    WebUI.waitForPageLoad(10)
    WebUI.delay(3)
    
    // Assert: Verify redirect to login page
    String currentUrl = WebUI.getUrl()
    WebUI.comment("Current URL after unauthenticated access: ${currentUrl}")
    
    // Should be redirected to login or home
    assert currentUrl.contains('/login') || currentUrl == homeUrl || currentUrl == "${homeUrl}/",
        "Unauthenticated user should be redirected. Current URL: ${currentUrl}"
    
    WebUI.comment("Unauthenticated access correctly blocked")
    
    // Test 2: Login as regular user (not admin)
    loginHelper.loginAsUser(1)
    
    // Try to access Users page as regular user
    WebUI.navigateToUrl(usersUrl)
    WebUI.waitForPageLoad(10)
    WebUI.delay(3)  // Wait for any JavaScript redirects to complete
    
    // Assert: Verify access is denied (should redirect to home or show error)
    currentUrl = WebUI.getUrl()
    WebUI.comment("Current URL after regular user access: ${currentUrl}")
    
    // Regular user should NOT be able to access admin users page
    // They should be redirected to home page (with or without trailing slash)
    boolean accessDenied = !currentUrl.contains('/admin')
    assert accessDenied, "Regular user should not have access to admin users page. Current URL: ${currentUrl}"
    
    WebUI.comment('✅ TC_ADM_USER_011 PASSED: Non-admin user correctly denied access to Users page')
    
} catch (Exception e) {
    WebUI.comment('❌ TC_ADM_USER_011 FAILED: ' + e.getMessage())
    throw e
    
} finally {
    // Cleanup
    WebUI.closeBrowser()
}
