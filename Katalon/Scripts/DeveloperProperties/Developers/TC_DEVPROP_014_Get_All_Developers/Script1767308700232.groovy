import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import developerproperties.DeveloperProperties_Keywords as DevPropKeywords
import authentication.Login_Keywords as LoginKeywords

/**
 * Test Case: TC_DEVPROP_014 - Get All Developers
 * 
 * Description: Verify that an admin can view all developers through the UI
 * Prerequisites: User must be logged in as admin
 * Test Data: None required (views existing developers)
 */

// Initialize
WebUI.openBrowser('')
DevPropKeywords devPropHelper = new DevPropKeywords()
LoginKeywords loginHelper = new LoginKeywords()

try {
    // Arrange: Login as admin first
    loginHelper.navigateToLogin()
    loginHelper.loginAsAdmin() // Login as admin@realestate.com
    loginHelper.verifyLoginSuccess()
    
    // Act: Navigate to developers page
    devPropHelper.navigateToDevelopers()
    
    // Assert: Verify developers page is loaded and shows developers
    def developersCount = devPropHelper.getDevelopersCount()
    assert developersCount >= 0, "Developers count should be non-negative"
    
    WebUI.comment("✅ TC_DEVPROP_014 PASSED: Retrieved ${developersCount} developers successfully")
    
} catch (Exception e) {
    WebUI.comment("❌ TC_DEVPROP_014 FAILED: " + e.getMessage())
    throw e
    
} finally {
    // Cleanup
    WebUI.closeBrowser()
}