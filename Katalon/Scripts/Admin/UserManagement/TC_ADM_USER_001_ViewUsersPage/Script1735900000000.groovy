import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import com.kms.katalon.core.model.FailureHandling
import authentication.Login_Keywords as LoginKeywords
import admin.User_Keywords as UserKeywords

/**
 * Test Case: TC_ADM_USER_001 - View Users Management Page
 * Module: Admin Service - User Management
 * Priority: High
 * 
 * Description: Verify that admin can access and view the Users Management page
 * Prerequisites: Admin user is logged in, Application is running on localhost:5173
 * Test Data: admin@realestate.com / Password123!
 */

// Initialize
WebUI.openBrowser('')
LoginKeywords loginHelper = new LoginKeywords()
UserKeywords userHelper = new UserKeywords()

try {
    // Arrange: Login as admin
    loginHelper.loginAsAdmin()
    
    // Act: Navigate to Users Management page
    userHelper.navigateToUsers()
    
    // Assert: Verify page title is displayed
    WebUI.verifyElementPresent(
        findTestObject('Object Repository/Admin/UsersPage/h1_UserManagement'),
        10,
        FailureHandling.STOP_ON_FAILURE
    )
    
    // Wait for loading to complete
    userHelper.waitForLoadingComplete()
    
    // Assert: Verify either table or empty state is displayed
    boolean hasUsers = WebUI.verifyElementPresent(
        findTestObject('Object Repository/Admin/UsersPage/table_Users'),
        5,
        FailureHandling.OPTIONAL
    )
    
    if (!hasUsers) {
        WebUI.verifyElementPresent(
            findTestObject('Object Repository/Admin/UsersPage/div_EmptyState'),
            5,
            FailureHandling.STOP_ON_FAILURE
        )
        WebUI.comment('Empty state displayed - no users exist')
    } else {
        WebUI.comment('Users table displayed with existing users')
    }
    
    // Assert: Verify Active and Inactive tabs are present
    WebUI.verifyElementPresent(
        findTestObject('Object Repository/Admin/UsersPage/btn_ActiveTab'),
        5,
        FailureHandling.STOP_ON_FAILURE
    )
    
    WebUI.verifyElementPresent(
        findTestObject('Object Repository/Admin/UsersPage/btn_InactiveTab'),
        5,
        FailureHandling.STOP_ON_FAILURE
    )
    
    WebUI.comment('✅ TC_ADM_USER_001 PASSED: Users Management page loaded successfully')
    
} catch (Exception e) {
    WebUI.comment('❌ TC_ADM_USER_001 FAILED: ' + e.getMessage())
    throw e
    
} finally {
    // Cleanup
    WebUI.closeBrowser()
}
