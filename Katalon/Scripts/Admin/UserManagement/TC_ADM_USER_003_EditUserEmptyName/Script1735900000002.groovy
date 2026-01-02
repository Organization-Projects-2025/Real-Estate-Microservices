import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import com.kms.katalon.core.model.FailureHandling
import authentication.Login_Keywords as LoginKeywords
import admin.User_Keywords as UserKeywords

/**
 * Test Case: TC_ADM_USER_003 - Edit User with Empty Name (Negative)
 * Module: Admin Service - User Management
 * Priority: Medium
 * 
 * Description: Verify that form validation prevents updating user with empty first name
 * Flow: 1. Create test user via API (fast setup)
 *       2. Login as admin via UI
 *       3. Try to edit user with empty first name
 *       4. Verify validation prevents submission
 */

// Initialize
WebUI.openBrowser('')
LoginKeywords loginHelper = new LoginKeywords()
UserKeywords userHelper = new UserKeywords()

// Generate unique test user data
String testUserEmail = userHelper.generateUniqueEmail('emptyname')
String testPassword = 'Password123!'

try {
    // Step 1: Create test user via API (fast, reliable)
    WebUI.comment("Step 1: Creating test user via API: ${testUserEmail}")
    userHelper.createTestUserViaAPI('EmptyTest', 'User', testUserEmail, testPassword, 'user')
    WebUI.comment("Test user created successfully via API")
    
    // Step 2: Login as admin via UI
    WebUI.comment("Step 2: Logging in as admin")
    loginHelper.loginAsAdmin()
    
    // Step 3: Navigate to Users Management page
    userHelper.navigateToUsers()
    userHelper.waitForLoadingComplete()
    
    // Step 4: Click Edit button
    userHelper.clickEditUser(testUserEmail)
    userHelper.verifyUserModalDisplayed()
    
    // Step 5: Clear first name field (leave it empty)
    WebUI.clearText(findTestObject('Object Repository/Admin/UsersPage/Modal/input_FirstName'))
    
    // Step 6: Try to submit form
    userHelper.clickSaveUserButton()
    
    // Assert: Verify modal is still displayed (form validation prevented submission)
    WebUI.verifyElementPresent(
        findTestObject('Object Repository/Admin/UsersPage/Modal/div_UserModal'),
        5,
        FailureHandling.STOP_ON_FAILURE
    )
    
    WebUI.comment('Form validation correctly prevented submission with empty first name')
    
    // Cleanup: Cancel the modal
    WebUI.click(findTestObject('Object Repository/Admin/UsersPage/Modal/btn_Cancel'))
    userHelper.verifyModalClosed()
    
    WebUI.comment('✅ TC_ADM_USER_003 PASSED: Validation correctly prevents empty first name')
    
} catch (Exception e) {
    WebUI.comment('❌ TC_ADM_USER_003 FAILED: ' + e.getMessage())
    throw e
    
} finally {
    // Cleanup
    WebUI.closeBrowser()
}
