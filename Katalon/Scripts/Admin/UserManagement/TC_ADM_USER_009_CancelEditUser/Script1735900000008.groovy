import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import com.kms.katalon.core.model.FailureHandling
import authentication.Login_Keywords as LoginKeywords
import admin.User_Keywords as UserKeywords

/**
 * Test Case: TC_ADM_USER_009 - Cancel Edit User
 */

WebUI.openBrowser('')
LoginKeywords loginHelper = new LoginKeywords()
UserKeywords userHelper = new UserKeywords()

String testUserEmail = userHelper.generateUniqueEmail('canceledit')
String testPassword = 'Password123!'
String testUserId = null

try {
    // Create test user via API
    def createResult = userHelper.createTestUserViaAPI('CancelEdit', 'User', testUserEmail, testPassword, 'user')
    testUserId = createResult.userId
    WebUI.comment("Test user created: ${testUserEmail} (ID: ${testUserId})")
    
    // Login as admin
    loginHelper.loginAsAdmin()
    userHelper.navigateToUsers()
    userHelper.waitForLoadingComplete()
    
    // Open edit modal
    userHelper.clickEditUser(testUserEmail)
    userHelper.verifyUserModalDisplayed()
    
    // Modify name (but don't save)
    WebUI.clearText(findTestObject('Object Repository/Admin/UsersPage/Modal/input_FirstName'))
    WebUI.setText(findTestObject('Object Repository/Admin/UsersPage/Modal/input_FirstName'), 'MODIFIED_SHOULD_NOT_SAVE')
    
    // Click Cancel
    WebUI.click(findTestObject('Object Repository/Admin/UsersPage/Modal/btn_Cancel'))
    WebUI.delay(1)
    
    // Verify modal closed
    userHelper.verifyModalClosed()
    
    // Verify user still exists
    userHelper.verifyUserExistsInTable(testUserEmail)
    
    WebUI.comment('✅ TC_ADM_USER_009 PASSED')
    
} catch (Exception e) {
    WebUI.comment('❌ TC_ADM_USER_009 FAILED: ' + e.getMessage())
    throw e
} finally {
    if (testUserId) {
        try { userHelper.deleteUserViaAPI(testUserId) } catch (Exception ex) {}
    }
    WebUI.closeBrowser()
}
