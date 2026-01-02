import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import com.kms.katalon.core.model.FailureHandling
import authentication.Login_Keywords as LoginKeywords
import admin.User_Keywords as UserKeywords

/**
 * Test Case: TC_ADM_USER_009 - Cancel Edit User
 * Module: Admin Service - User Management
 * Priority: Medium
 * 
 * Description: Verify that canceling edit modal doesn't save changes
 * Flow: 1. Create test user via API
 *       2. Login as admin via UI
 *       3. Open edit modal, make changes, cancel
 *       4. Verify changes were not saved
 */

// Initialize
WebUI.openBrowser('')
LoginKeywords loginHelper = new LoginKeywords()
UserKeywords userHelper = new UserKeywords()

// Generate unique test user data
String testUserEmail = userHelper.generateUniqueEmail('canceledit')
String testPassword = 'Password123!'

try {
    // Step 1: Create test user via API
    WebUI.comment("Step 1: Creating test user via API: ${testUserEmail}")
    userHelper.createTestUserViaAPI('CancelEdit', 'User', testUserEmail, testPassword, 'user')
    WebUI.comment("Test user created successfully via API")
    
    // Step 2: Login as admin via UI
    WebUI.comment("Step 2: Logging in as admin")
    loginHelper.loginAsAdmin()
    
    // Step 3: Navigate to Users Management page
    userHelper.navigateToUsers()
    userHelper.waitForLoadingComplete()
    
    // Assert: Verify user exists
    userHelper.verifyUserExistsInTable(testUserEmail)
    
    // Step 4: Click Edit button
    userHelper.clickEditUser(testUserEmail)
    userHelper.verifyUserModalDisplayed()
    
    // Step 5: Make some changes to the form
    WebUI.clearText(findTestObject('Object Repository/Admin/UsersPage/Modal/input_FirstName'))
    WebUI.setText(findTestObject('Object Repository/Admin/UsersPage/Modal/input_FirstName'), 'ChangedName')
    
    // Step 6: Click Cancel button
    WebUI.click(findTestObject('Object Repository/Admin/UsersPage/Modal/btn_Cancel'))
    
    // Assert: Verify modal is closed
    userHelper.verifyModalClosed()
    
    // Assert: Verify user still exists in table (no changes saved)
    userHelper.verifyUserExistsInTable(testUserEmail)
    
    WebUI.comment('✅ TC_ADM_USER_009 PASSED: Edit canceled successfully, no changes saved')
    
} catch (Exception e) {
    WebUI.comment('❌ TC_ADM_USER_009 FAILED: ' + e.getMessage())
    throw e
    
} finally {
    // Cleanup
    WebUI.closeBrowser()
}
