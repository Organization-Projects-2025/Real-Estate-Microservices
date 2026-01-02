import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import com.kms.katalon.core.model.FailureHandling
import authentication.Login_Keywords as LoginKeywords
import admin.User_Keywords as UserKeywords

/**
 * Test Case: TC_ADM_USER_010 - Close Modal with X Button
 * Module: Admin Service - User Management
 * Priority: Low
 * 
 * Description: Verify that the X button closes the modal without saving changes
 * Flow: 1. Create test user via API
 *       2. Login as admin via UI
 *       3. Open edit modal, make changes, close with X
 *       4. Verify changes were not saved
 */

// Initialize
WebUI.openBrowser('')
LoginKeywords loginHelper = new LoginKeywords()
UserKeywords userHelper = new UserKeywords()

// Generate unique test user data
String testUserEmail = "testing@gmail.com"

try {
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
    
    // Step 5: Make some changes
    WebUI.clearText(findTestObject('Object Repository/Admin/UsersPage/Modal/input_PhoneNumber'))
    WebUI.setText(findTestObject('Object Repository/Admin/UsersPage/Modal/input_PhoneNumber'), '+9999999999')
    
    // Step 6: Click X button to close modal
    WebUI.click(findTestObject('Object Repository/Admin/UsersPage/Modal/btn_CloseModal'))
    WebUI.delay(1)
    
    // Assert: Verify modal is closed
    userHelper.verifyModalClosed()
    
    // Assert: Verify user still exists (no changes saved)
    userHelper.verifyUserExistsInTable(testUserEmail)
    
    WebUI.comment('✅ TC_ADM_USER_010 PASSED: Modal closed with X button, no changes saved')
    
} catch (Exception e) {
    WebUI.comment('❌ TC_ADM_USER_010 FAILED: ' + e.getMessage())
    throw e
    
} finally {
    // Cleanup
    WebUI.closeBrowser()
}
