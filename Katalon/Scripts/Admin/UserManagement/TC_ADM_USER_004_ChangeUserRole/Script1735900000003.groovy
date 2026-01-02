import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import com.kms.katalon.core.model.FailureHandling
import authentication.Login_Keywords as LoginKeywords
import admin.User_Keywords as UserKeywords

/**
 * Test Case: TC_ADM_USER_004 - Change User Role
 */

WebUI.openBrowser('')
LoginKeywords loginHelper = new LoginKeywords()
UserKeywords userHelper = new UserKeywords()

String testUserEmail = userHelper.generateUniqueEmail('rolechange')
String testPassword = 'Password123!'
String testUserId = null

try {
    // Create test user via API with 'user' role
    def createResult = userHelper.createTestUserViaAPI('RoleTest', 'User', testUserEmail, testPassword, 'user')
    testUserId = createResult.userId
    WebUI.comment("Test user created: ${testUserEmail} (ID: ${testUserId})")
    
    // Login as admin
    loginHelper.loginAsAdmin()
    userHelper.navigateToUsers()
    userHelper.waitForLoadingComplete()
    
    // Edit user and change role
    userHelper.clickEditUser(testUserEmail)
    userHelper.verifyUserModalDisplayed()
    
    // Change role to 'agent'
    WebUI.selectOptionByValue(
        findTestObject('Object Repository/Admin/UsersPage/Modal/select_Role'),
        'agent', false
    )
    userHelper.clickSaveUserButton()
    
    // Verify
    userHelper.verifyModalClosed()
    userHelper.waitForLoadingComplete()
    userHelper.verifySuccessToast('updated')
    
    WebUI.comment('✅ TC_ADM_USER_004 PASSED')
    
} catch (Exception e) {
    WebUI.comment('❌ TC_ADM_USER_004 FAILED: ' + e.getMessage())
    throw e
} finally {
    if (testUserId) {
        try { userHelper.deleteUserViaAPI(testUserId) } catch (Exception ex) {}
    }
    WebUI.closeBrowser()
}
