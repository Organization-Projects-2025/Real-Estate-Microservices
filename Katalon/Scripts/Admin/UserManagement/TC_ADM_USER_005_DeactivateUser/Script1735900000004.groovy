import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import com.kms.katalon.core.model.FailureHandling
import authentication.Login_Keywords as LoginKeywords
import admin.User_Keywords as UserKeywords

/**
 * Test Case: TC_ADM_USER_005 - Deactivate User
 * Module: Admin Service - User Management
 * Priority: High
 * 
 * Description: Verify that admin can deactivate a user with confirmation
 * Flow: 1. Create test user via API
 *       2. Login as admin via UI
 *       3. Deactivate the test user
 *       4. Verify user moved to Inactive tab
 */

// Initialize
WebUI.openBrowser('')
LoginKeywords loginHelper = new LoginKeywords()
UserKeywords userHelper = new UserKeywords()

// Generate unique test user data
String testUserEmail = userHelper.generateUniqueEmail('deactivate')
String testPassword = 'Password123!'

try {
    // Step 1: Create test user via API
    WebUI.comment("Step 1: Creating test user via API: ${testUserEmail}")
    userHelper.createTestUserViaAPI('DeactivateTest', 'User', testUserEmail, testPassword, 'user')
    WebUI.comment("Test user created successfully via API")
    
    // Step 2: Login as admin via UI
    WebUI.comment("Step 2: Logging in as admin")
    loginHelper.loginAsAdmin()
    
    // Step 3: Navigate to Users Management page
    userHelper.navigateToUsers()
    userHelper.waitForLoadingComplete()
    
    // Ensure we're on Active tab
    userHelper.clickActiveTab()
    
    // Assert: Verify user exists in active table
    userHelper.verifyUserExistsInTable(testUserEmail)
    
    // Get user count before deactivation
    int countBeforeDeactivate = userHelper.getUserCount()
    WebUI.comment("Active user count before deactivation: ${countBeforeDeactivate}")
    
    // Step 4: Click Deactivate button for the user
    WebUI.click(findTestObject('Object Repository/Admin/UsersPage/btn_DeactivateUser', [('userEmail'): testUserEmail]))
    WebUI.delay(1)
    
    // Step 5: Confirm deactivation in alert
    WebUI.waitForAlert(5)
    WebUI.acceptAlert()
    WebUI.delay(2)
    
    // Wait for table to refresh
    userHelper.waitForLoadingComplete()
    
    // Assert: Verify success toast
    userHelper.verifySuccessToast('deactivated')
    
    // Assert: Verify user is removed from active table
    userHelper.verifyUserNotInTable(testUserEmail)
    
    // Assert: Verify active user count decreased
    int countAfterDeactivate = userHelper.getUserCount()
    WebUI.comment("Active user count after deactivation: ${countAfterDeactivate}")
    assert countAfterDeactivate == countBeforeDeactivate - 1, "Active user count should decrease by 1"
    
    // Assert: Verify user appears in Inactive tab
    userHelper.clickInactiveTab()
    userHelper.verifyUserExistsInTable(testUserEmail)
    
    WebUI.comment('✅ TC_ADM_USER_005 PASSED: User deactivated successfully')
    
} catch (Exception e) {
    WebUI.comment('❌ TC_ADM_USER_005 FAILED: ' + e.getMessage())
    throw e
    
} finally {
    // Cleanup
    WebUI.closeBrowser()
}
