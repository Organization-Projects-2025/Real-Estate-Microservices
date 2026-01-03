import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import com.kms.katalon.core.model.FailureHandling
import authentication.Login_Keywords as LoginKeywords
import admin.User_Keywords as UserKeywords

/**
 * Test Case: TC_ADM_USER_006 - Cancel Deactivate User
 */

WebUI.openBrowser('')
LoginKeywords loginHelper = new LoginKeywords()
UserKeywords userHelper = new UserKeywords()

String testUserEmail = userHelper.generateUniqueEmail('canceldeact')
String testPassword = 'Password123!'
String testUserId = null

try {
    // Create test user via API
    def createResult = userHelper.createTestUserViaAPI('CancelDeact', 'User', testUserEmail, testPassword, 'user')
    testUserId = createResult.userId
    WebUI.comment("Test user created: ${testUserEmail} (ID: ${testUserId})")
    
    // Login as admin
    loginHelper.loginAsAdmin()
    userHelper.navigateToUsers()
    userHelper.waitForLoadingComplete()
    
    // Get count before
    int countBefore = userHelper.getUserCount()
    
    // Click deactivate button
    WebUI.click(findTestObject('Object Repository/Admin/UsersPage/btn_DeactivateUser', [('userEmail'): testUserEmail]))
    WebUI.delay(1)
    
    // CANCEL deactivation
    WebUI.waitForAlert(5)
    WebUI.dismissAlert()
    WebUI.delay(1)
    
    // Verify user still in active tab
    int countAfter = userHelper.getUserCount()
    assert countAfter == countBefore, "User count should remain unchanged"
    userHelper.verifyUserExistsInTable(testUserEmail)
    
    WebUI.comment('✅ TC_ADM_USER_006 PASSED')
    
} catch (Exception e) {
    WebUI.comment('❌ TC_ADM_USER_006 FAILED: ' + e.getMessage())
    throw e
} finally {
    if (testUserId) {
        try { userHelper.deleteUserViaAPI(testUserId) } catch (Exception ex) {}
    }
    WebUI.closeBrowser()
}
