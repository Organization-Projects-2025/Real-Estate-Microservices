import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import com.kms.katalon.core.model.FailureHandling
import authentication.Login_Keywords as LoginKeywords
import admin.User_Keywords as UserKeywords

/**
 * Test Case: TC_ADM_USER_002 - Edit User with Valid Data
 */

WebUI.openBrowser('')
LoginKeywords loginHelper = new LoginKeywords()
UserKeywords userHelper = new UserKeywords()

String testUserEmail = userHelper.generateUniqueEmail('edituser')
String testPassword = 'Password123!'
String testUserId = null

try {
    // Create test user via API
    def createResult = userHelper.createTestUserViaAPI('EditTest', 'User', testUserEmail, testPassword, 'user')
    testUserId = createResult.userId
    WebUI.comment("Test user created: ${testUserEmail} (ID: ${testUserId})")
    
    // Login as admin
    loginHelper.loginAsAdmin()
    userHelper.navigateToUsers()
    userHelper.waitForLoadingComplete()
    
    // Verify test user exists
    userHelper.verifyUserExistsInTable(testUserEmail)
    
    // Edit user
    userHelper.clickEditUser(testUserEmail)
    userHelper.verifyUserModalDisplayed()
    
    userHelper.fillUserForm('UpdatedFirst', 'UpdatedLast', testUserEmail, 'user', '+1234567890', '', '')
    userHelper.clickSaveUserButton()
    
    // Verify
    userHelper.verifyModalClosed()
    userHelper.waitForLoadingComplete()
    userHelper.verifySuccessToast('updated')
    userHelper.verifyUserExistsInTable(testUserEmail)
    
    WebUI.comment('✅ TC_ADM_USER_002 PASSED')
    
} catch (Exception e) {
    WebUI.comment('❌ TC_ADM_USER_002 FAILED: ' + e.getMessage())
    throw e
} finally {
    if (testUserId) {
        try { userHelper.deleteUserViaAPI(testUserId) } catch (Exception ex) {}
    }
    WebUI.closeBrowser()
}
