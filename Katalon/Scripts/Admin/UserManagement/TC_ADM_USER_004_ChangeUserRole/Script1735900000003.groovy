import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import com.kms.katalon.core.model.FailureHandling
import authentication.Login_Keywords as LoginKeywords
import admin.User_Keywords as UserKeywords

/**
 * Test Case: TC_ADM_USER_004 - Change User Role
 * Module: Admin Service - User Management
 * Priority: High
 * 
 * Description: Verify that admin can change a user's role from user to agent
 * Flow: 1. Create test user via API with 'user' role
 *       2. Login as admin via UI
 *       3. Change user role to 'agent'
 *       4. Verify role change
 */

// Initialize
WebUI.openBrowser('')
LoginKeywords loginHelper = new LoginKeywords()
UserKeywords userHelper = new UserKeywords()

// Generate unique test user data
String testUserEmail = userHelper.generateUniqueEmail('rolechange')
String testPassword = 'Password123!'
String newRole = 'agent'

try {
    // Step 1: Create test user via API with 'user' role
    WebUI.comment("Step 1: Creating test user via API: ${testUserEmail}")
    userHelper.createTestUserViaAPI('RoleTest', 'User', testUserEmail, testPassword, 'user')
    WebUI.comment("Test user created successfully via API with 'user' role")
    
    // Step 2: Login as admin via UI
    WebUI.comment("Step 2: Logging in as admin")
    loginHelper.loginAsAdmin()
    
    // Step 3: Navigate to Users Management page
    userHelper.navigateToUsers()
    userHelper.waitForLoadingComplete()
    
    // Assert: Verify user exists
    userHelper.verifyUserExistsInTable(testUserEmail)
    
    // Step 4: Edit user and change role
    userHelper.clickEditUser(testUserEmail)
    userHelper.verifyUserModalDisplayed()
    
    // Step 5: Change role to agent
    WebUI.selectOptionByValue(
        findTestObject('Object Repository/Admin/UsersPage/Modal/select_Role'),
        newRole,
        false
    )
    
    // Step 6: Save changes
    userHelper.clickSaveUserButton()
    userHelper.waitForLoadingComplete()
    
    // Assert: Verify success toast
    userHelper.verifySuccessToast('updated')
    
    // Assert: Verify role badge updated in table
    userHelper.verifyUserRole(testUserEmail, newRole)
    
    WebUI.comment("✅ TC_ADM_USER_004 PASSED: User role changed successfully to ${newRole}")
    
} catch (Exception e) {
    WebUI.comment('❌ TC_ADM_USER_004 FAILED: ' + e.getMessage())
    throw e
    
} finally {
    // Cleanup
    WebUI.closeBrowser()
}
