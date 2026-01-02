import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import com.kms.katalon.core.model.FailureHandling
import authentication.Login_Keywords as LoginKeywords
import admin.Property_Keywords as PropertyKeywords

/**
 * Test Case: TC_ADM_PROP_008 - Close Modal With X Button
 * Module: Admin Service - Property Management
 * Priority: Low
 * 
 * Description: Verify that admin can close property edit modal using X button
 * Prerequisites: Admin user is logged in
 * Note: Creates test property via API, opens edit modal then closes with X
 */

// Initialize
WebUI.openBrowser('')
LoginKeywords loginHelper = new LoginKeywords()
PropertyKeywords propertyHelper = new PropertyKeywords()

String testPropertyId = null

try {
    // Arrange: Create test property via API
    def createResult = propertyHelper.createTestPropertyViaAPI()
    String testPropertyTitle = createResult.title
    testPropertyId = createResult.propertyId
    WebUI.comment("Test property created: ${testPropertyTitle} (ID: ${testPropertyId})")
    
    // Login as admin
    loginHelper.loginAsAdmin()
    
    // Navigate to Properties Management page
    propertyHelper.navigateToProperties()
    propertyHelper.waitForLoadingComplete()
    
    // Act: Click Edit button for the test property
    WebUI.click(
        findTestObject('Object Repository/Admin/PropertiesPage/btn_EditProperty', [('propertyTitle'): testPropertyTitle])
    )
    WebUI.delay(1)
    
    // Verify modal is displayed
    propertyHelper.verifyPropertyModalDisplayed()
    
    // Act: Click X button to close modal
    WebUI.click(findTestObject('Object Repository/Admin/PropertiesPage/Modal/btn_CloseModal'))
    WebUI.delay(1)
    
    // Assert: Verify modal is closed
    propertyHelper.verifyModalClosed()
    
    WebUI.comment('✅ TC_ADM_PROP_008 PASSED: Close modal with X button works correctly')
    
} catch (Exception e) {
    WebUI.comment('❌ TC_ADM_PROP_008 FAILED: ' + e.getMessage())
    throw e
    
} finally {
    // Cleanup: Delete test property via API
    if (testPropertyId) {
        try {
            propertyHelper.deletePropertyViaAPI(testPropertyId)
            WebUI.comment("Cleanup: Test property deleted")
        } catch (Exception cleanupError) {
            WebUI.comment("Cleanup warning: Could not delete test property - ${cleanupError.getMessage()}")
        }
    }
    WebUI.closeBrowser()
}
