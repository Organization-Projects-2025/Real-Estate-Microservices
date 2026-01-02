import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import com.kms.katalon.core.model.FailureHandling
import authentication.Login_Keywords as LoginKeywords
import admin.User_Keywords as UserKeywords

/**
 * Test Case: TC_ADM_USER_006 - Cancel Deactivate User
 * Module: Admin Service - User Management
 * Priority: Medium
 * 
 * Description: Verify that canceling deactivation keeps the user active
 * Flow: 1. Create test user via API
 *       2. Login as admin via UI
 *       3. Click deactivate but cancel
 *       4. Verify user remains active
 */

// Initialize
WebUI.openBrowser('')
LoginKeywords loginHelper = new LoginKeywords()
UserKeywords userHelper = new UserKeywords()

// Generate unique test user data
String testUserEmail = userHelper.generateUniqueEmail('canceldeact')
String testPassword = 'Password123!'

try {
    // Step 1: Create test user via API
    WebUI.comment("Step 1: Creating test user via API: ${testUserEmail}")
    userHelper.createTestUserViaAPI('CancelDeact', 'User', testUserEmail, testPassword, 'user')
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
    
    // Get user count before attempting deactivation
    int countBefore = userHelper.getUserCount()
    WebUI.comment("Active user count before cancel: ${countBefore}")
    
    // Step 4: Click Deactivate button
    WebUI.click(findTestObject('Object Repository/Admin/UsersPage/btn_DeactivateUser', [('userEmail'): testUserEmail]))
    WebUI.delay(1)
    
    // Step 5: Cancel deactivation in alert
    WebUI.waitForAlert(5)
    WebUI.dismissAlert()
    WebUI.delay(1)
    
    // Assert: Verify user still exists in active table
    userHelper.verifyUserExistsInTable(testUserEmail)
    
    // Assert: Verify user count unchanged
    int countAfter = userHelper.getUserCount()
    WebUI.comment("Active user count after cancel: ${countAfter}")
    assert countAfter == countBefore, "User count should remain unchanged"
    
    WebUI.comment('✅ TC_ADM_USER_006 PASSED: Deactivation canceled successfully, user remains active')
    
} catch (Exception e) {
    WebUI.comment('❌ TC_ADM_USER_006 FAILED: ' + e.getMessage())
    throw e
    
} finally {
    // Cleanup
    WebUI.closeBrowser()
}
