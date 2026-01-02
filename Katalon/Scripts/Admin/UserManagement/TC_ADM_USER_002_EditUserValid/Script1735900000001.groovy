import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import com.kms.katalon.core.model.FailureHandling
import authentication.Login_Keywords as LoginKeywords
import admin.User_Keywords as UserKeywords

/**
 * Test Case: TC_ADM_USER_002 - Edit User with Valid Data
 * Module: Admin Service - User Management
 * Priority: High
 * 
 * Description: Verify that admin can edit an existing user with valid data
 * Flow: 1. Create test user via API (fast setup)
 *       2. Login as admin via UI
 *       3. Edit the test user
 *       4. Verify changes saved
 */

// Initialize
WebUI.openBrowser('')
LoginKeywords loginHelper = new LoginKeywords()
UserKeywords userHelper = new UserKeywords()

// Generate unique test user data
String testUserEmail = userHelper.generateUniqueEmail('edituser')
String testPassword = 'Password123!'
String newFirstName = 'UpdatedFirst'
String newLastName = 'UpdatedLast'
String newPhoneNumber = '+1234567890'

try {
    // Step 1: Create test user via API (fast, reliable)
    WebUI.comment("Step 1: Creating test user via API: ${testUserEmail}")
    def createResult = userHelper.createTestUserViaAPI('EditTest', 'User', testUserEmail, testPassword, 'user')
    WebUI.comment("Test user created successfully via API")
    
    // Step 2: Login as admin via UI
    WebUI.comment("Step 2: Logging in as admin")
    loginHelper.loginAsAdmin()
    
    // Step 3: Navigate to Users Management page
    userHelper.navigateToUsers()
    userHelper.waitForLoadingComplete()
    
    // Assert: Verify test user exists in table
    userHelper.verifyUserExistsInTable(testUserEmail)
    WebUI.comment("Test user found in users table")
    
    // Step 4: Click Edit button for the test user
    userHelper.clickEditUser(testUserEmail)
    
    // Assert: Verify modal is displayed with correct title
    userHelper.verifyUserModalDisplayed()
    String actualTitle = WebUI.getText(findTestObject('Object Repository/Admin/UsersPage/Modal/h2_ModalTitle'))
    assert actualTitle.contains('Edit User'), "Expected modal title 'Edit User', but got '${actualTitle}'"
    
    // Step 5: Fill form with updated data
    userHelper.fillUserForm(
        newFirstName,
        newLastName,
        testUserEmail,  // Keep same email
        'user',         // Keep same role
        newPhoneNumber,
        '',
        ''
    )
    
    // Step 6: Click Save Changes button
    userHelper.clickSaveUserButton()
    
    // Assert: Verify modal is closed
    userHelper.verifyModalClosed()
    
    // Wait for table to refresh
    userHelper.waitForLoadingComplete()
    
    // Assert: Verify success toast
    userHelper.verifySuccessToast('updated')
    
    // Assert: Verify user still exists in table
    userHelper.verifyUserExistsInTable(testUserEmail)
    
    WebUI.comment('✅ TC_ADM_USER_002 PASSED: User updated successfully with valid data')
    
} catch (Exception e) {
    WebUI.comment('❌ TC_ADM_USER_002 FAILED: ' + e.getMessage())
    throw e
    
} finally {
    // Cleanup
    WebUI.closeBrowser()
}
