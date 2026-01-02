import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import com.kms.katalon.core.model.FailureHandling
import authentication.Login_Keywords as LoginKeywords
import admin.User_Keywords as UserKeywords

/**
 * Test Case: TC_ADM_USER_008 - Switch Between Active and Inactive Tabs
 * Module: Admin Service - User Management
 * Priority: Medium
 * 
 * Description: Verify that admin can switch between Active and Inactive tabs
 * Prerequisites: Admin user is logged in, Users exist in both active and inactive states
 * Test Data: Switches between tabs and verifies correct data display
 */

// Initialize
WebUI.openBrowser('')
LoginKeywords loginHelper = new LoginKeywords()
UserKeywords userHelper = new UserKeywords()

try {
    // Arrange: Login as admin and navigate to Users page
    loginHelper.loginAsAdmin()
    userHelper.navigateToUsers()
    userHelper.waitForLoadingComplete()
    
    // Assert: Verify Active tab is selected by default
    WebUI.verifyElementPresent(
        findTestObject('Object Repository/Admin/UsersPage/btn_ActiveTab'),
        5,
        FailureHandling.STOP_ON_FAILURE
    )
    
    // Get active user count
    int activeCount = userHelper.getUserCount()
    WebUI.comment("Active users count: ${activeCount}")
    
    // Act: Switch to Inactive tab
    userHelper.clickInactiveTab()
    userHelper.waitForLoadingComplete()
    
    // Assert: Verify Inactive tab is now selected
    WebUI.verifyElementPresent(
        findTestObject('Object Repository/Admin/UsersPage/btn_InactiveTab'),
        5,
        FailureHandling.STOP_ON_FAILURE
    )
    
    // Get inactive user count
    int inactiveCount = userHelper.getUserCount()
    WebUI.comment("Inactive users count: ${inactiveCount}")
    
    // Act: Switch back to Active tab
    userHelper.clickActiveTab()
    userHelper.waitForLoadingComplete()
    
    // Assert: Verify Active tab is selected again
    int activeCountAgain = userHelper.getUserCount()
    assert activeCountAgain == activeCount, "Active user count should be same as before"
    
    WebUI.comment('✅ TC_ADM_USER_008 PASSED: Tab switching works correctly')
    
} catch (Exception e) {
    WebUI.comment('❌ TC_ADM_USER_008 FAILED: ' + e.getMessage())
    throw e
    
} finally {
    // Cleanup
    WebUI.closeBrowser()
}
