import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import com.kms.katalon.core.model.FailureHandling
import authentication.Login_Keywords as LoginKeywords
import admin.User_Keywords as UserKeywords

/**
 * Test Case: TC_ADM_USER_007 - Reactivate User
 */

WebUI.openBrowser('')
LoginKeywords loginHelper = new LoginKeywords()
UserKeywords userHelper = new UserKeywords()

String testUserEmail = userHelper.generateUniqueEmail('reactivate')
String testPassword = 'Password123!'
String testUserId = null

try {
    // Create test user via API
    def createResult = userHelper.createTestUserViaAPI('ReactivateTest', 'User', testUserEmail, testPassword, 'user')
    testUserId = createResult.userId
    WebUI.comment("Test user created: ${testUserEmail} (ID: ${testUserId})")
    
    // Login as admin
    loginHelper.loginAsAdmin()
    userHelper.navigateToUsers()
    userHelper.waitForLoadingComplete()
    
    // First deactivate the user
    WebUI.click(findTestObject('Object Repository/Admin/UsersPage/btn_DeactivateUser', [('userEmail'): testUserEmail]))
    WebUI.delay(1)
    WebUI.waitForAlert(5)
    WebUI.acceptAlert()
    WebUI.delay(2)
    userHelper.waitForLoadingComplete()
    
    // Go to inactive tab
    userHelper.clickInactiveTab()
    userHelper.waitForLoadingComplete()
    
    // Reactivate the user
    WebUI.click(findTestObject('Object Repository/Admin/UsersPage/btn_ReactivateUser', [('userEmail'): testUserEmail]))
    WebUI.delay(1)
    WebUI.waitForAlert(5)
    WebUI.acceptAlert()
    WebUI.delay(2)
    userHelper.waitForLoadingComplete()
    
    // Verify user back in active tab
    userHelper.clickActiveTab()
    userHelper.waitForLoadingComplete()
    userHelper.verifyUserExistsInTable(testUserEmail)
    
    WebUI.comment('✅ TC_ADM_USER_007 PASSED')
    
} catch (Exception e) {
    WebUI.comment('❌ TC_ADM_USER_007 FAILED: ' + e.getMessage())
    throw e
} finally {
    if (testUserId) {
        try { userHelper.deleteUserViaAPI(testUserId) } catch (Exception ex) {}
    }
    WebUI.closeBrowser()
}
