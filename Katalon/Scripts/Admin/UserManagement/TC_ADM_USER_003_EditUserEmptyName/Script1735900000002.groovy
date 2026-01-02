import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import com.kms.katalon.core.model.FailureHandling
import authentication.Login_Keywords as LoginKeywords
import admin.User_Keywords as UserKeywords

/**
 * Test Case: TC_ADM_USER_003 - Edit User with Empty Name (Negative)
 */

WebUI.openBrowser('')
LoginKeywords loginHelper = new LoginKeywords()
UserKeywords userHelper = new UserKeywords()

String testUserEmail = userHelper.generateUniqueEmail('emptyname')
String testPassword = 'Password123!'
String testUserId = null

try {
    // Create test user via API
    def createResult = userHelper.createTestUserViaAPI('EmptyTest', 'User', testUserEmail, testPassword, 'user')
    testUserId = createResult.userId
    WebUI.comment("Test user created: ${testUserEmail} (ID: ${testUserId})")
    
    // Login as admin
    loginHelper.loginAsAdmin()
    userHelper.navigateToUsers()
    userHelper.waitForLoadingComplete()
    
    // Edit user
    userHelper.clickEditUser(testUserEmail)
    userHelper.verifyUserModalDisplayed()
    
    // Clear first name (invalid)
    WebUI.clearText(findTestObject('Object Repository/Admin/UsersPage/Modal/input_FirstName'))
    userHelper.clickSaveUserButton()
    
    // Verify modal stays open (validation failed)
    WebUI.verifyElementPresent(
        findTestObject('Object Repository/Admin/UsersPage/Modal/div_UserModal'),
        5, FailureHandling.STOP_ON_FAILURE
    )
    
    // Close modal
    WebUI.click(findTestObject('Object Repository/Admin/UsersPage/Modal/btn_CloseModal'))
    
    WebUI.comment('✅ TC_ADM_USER_003 PASSED')
    
} catch (Exception e) {
    WebUI.comment('❌ TC_ADM_USER_003 FAILED: ' + e.getMessage())
    throw e
} finally {
    if (testUserId) {
        try { userHelper.deleteUserViaAPI(testUserId) } catch (Exception ex) {}
    }
    WebUI.closeBrowser()
}
