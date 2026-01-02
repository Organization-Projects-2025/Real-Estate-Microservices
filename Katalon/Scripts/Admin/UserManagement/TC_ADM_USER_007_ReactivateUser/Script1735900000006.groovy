import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import com.kms.katalon.core.model.FailureHandling
import authentication.Login_Keywords as LoginKeywords
import admin.User_Keywords as UserKeywords

/**
 * Test Case: TC_ADM_USER_007 - Reactivate User
 * Module: Admin Service - User Management
 * Priority: High
 * 
 * Description: Verify that admin can reactivate an inactive user
 * Flow: 1. Create test user via API
 *       2. Login as admin via UI
 *       3. Deactivate the test user first
 *       4. Reactivate the test user
 *       5. Verify user moved back to Active tab
 */

// Initialize
WebUI.openBrowser('')
LoginKeywords loginHelper = new LoginKeywords()
UserKeywords userHelper = new UserKeywords()

// Generate unique test user data
String testUserEmail = userHelper.generateUniqueEmail('reactivate')
String testPassword = 'Password123!'

try {
    // Step 1: Create test user via API
    WebUI.comment("Step 1: Creating test user via API: ${testUserEmail}")
    userHelper.createTestUserViaAPI('ReactivateTest', 'User', testUserEmail, testPassword, 'user')
    WebUI.comment("Test user created successfully via API")
    
    // Step 2: Login as admin via UI
    WebUI.comment("Step 2: Logging in as admin")
    loginHelper.loginAsAdmin()
    
    // Step 3: Navigate to Users Management page
    userHelper.navigateToUsers()
    userHelper.waitForLoadingComplete()
    
    // Step 4: First deactivate the user (to set up for reactivation test)
    WebUI.comment("Step 4: Deactivating user first to set up reactivation test")
    userHelper.clickActiveTab()
    userHelper.verifyUserExistsInTable(testUserEmail)
    
    WebUI.click(findTestObject('Object Repository/Admin/UsersPage/btn_DeactivateUser', [('userEmail'): testUserEmail]))
    WebUI.delay(1)
    WebUI.waitForAlert(5)
    WebUI.acceptAlert()
    WebUI.delay(2)
    userHelper.waitForLoadingComplete()
    
    WebUI.comment("User deactivated successfully, now testing reactivation")
    
    // Step 5: Navigate to Inactive tab
    userHelper.clickInactiveTab()
    
    // Assert: Verify user exists in inactive table
    userHelper.verifyUserExistsInTable(testUserEmail)
    
    // Get inactive user count before reactivation
    int inactiveCountBefore = userHelper.getUserCount()
    WebUI.comment("Inactive user count before reactivation: ${inactiveCountBefore}")
    
    // Step 6: Click Reactivate button for the user
    WebUI.click(findTestObject('Object Repository/Admin/UsersPage/btn_ReactivateUser', [('userEmail'): testUserEmail]))
    WebUI.delay(1)
    
    // Step 7: Confirm reactivation in alert
    WebUI.waitForAlert(5)
    WebUI.acceptAlert()
    WebUI.delay(2)
    
    // Wait for table to refresh
    userHelper.waitForLoadingComplete()
    
    // Assert: Verify success toast
    userHelper.verifySuccessToast('reactivated')
    
    // Assert: Verify user is removed from inactive table
    userHelper.verifyUserNotInTable(testUserEmail)
    
    // Assert: Verify inactive user count decreased
    int inactiveCountAfter = userHelper.getUserCount()
    WebUI.comment("Inactive user count after reactivation: ${inactiveCountAfter}")
    assert inactiveCountAfter == inactiveCountBefore - 1, "Inactive user count should decrease by 1"
    
    // Assert: Verify user appears in Active tab
    userHelper.clickActiveTab()
    userHelper.verifyUserExistsInTable(testUserEmail)
    
    WebUI.comment('✅ TC_ADM_USER_007 PASSED: User reactivated successfully')
    
} catch (Exception e) {
    WebUI.comment('❌ TC_ADM_USER_007 FAILED: ' + e.getMessage())
    throw e
    
} finally {
    // Cleanup
    WebUI.closeBrowser()
}
