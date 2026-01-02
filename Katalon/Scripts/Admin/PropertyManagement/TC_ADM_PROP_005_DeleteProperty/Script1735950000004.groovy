import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import com.kms.katalon.core.model.FailureHandling
import authentication.Login_Keywords as LoginKeywords
import admin.Property_Keywords as PropertyKeywords

/**
 * Test Case: TC_ADM_PROP_005 - Delete Property
 * Module: Admin Service - Property Management
 * Priority: High
 * 
 * Description: Verify that admin can delete a property with confirmation
 * Expected: Success toast appears, property removed from table
 */

WebUI.openBrowser('')
LoginKeywords loginHelper = new LoginKeywords()
PropertyKeywords propertyHelper = new PropertyKeywords()

String testPropertyId = null
boolean deletedViaUI = false

try {
    // Arrange: Create test property via API
    def createResult = propertyHelper.createTestPropertyViaAPI()
    String testPropertyTitle = createResult.title
    testPropertyId = createResult.propertyId
    WebUI.comment("Test property created: ${testPropertyTitle}")
    
    // Login and navigate
    loginHelper.loginAsAdmin()
    propertyHelper.navigateToProperties()
    propertyHelper.waitForLoadingComplete()
    
    // Get count before delete
    int countBefore = propertyHelper.getPropertyCount()
    
    // Click delete for test property
    WebUI.click(findTestObject('Object Repository/Admin/PropertiesPage/btn_DeleteProperty', [('propertyTitle'): testPropertyTitle]))
    WebUI.delay(1)
    
    // Confirm deletion
    WebUI.waitForAlert(5)
    WebUI.acceptAlert()
    WebUI.delay(3)
    
    // Assert: Success toast should appear
    propertyHelper.assertSuccessToast("Delete failed: Expected success toast after deleting property")
    
    // Assert: No error toast
    propertyHelper.assertNoErrorToast("Delete failed: Error toast appeared")
    
    // Mark as deleted via UI
    deletedViaUI = true
    
    // Assert: Property count decreased
    propertyHelper.waitForLoadingComplete()
    int countAfter = propertyHelper.getPropertyCount()
    assert countAfter == countBefore - 1, "Delete failed: Property count should decrease by 1"
    
    WebUI.comment('✅ TC_ADM_PROP_005 PASSED')
    
} catch (Exception e) {
    WebUI.comment('❌ TC_ADM_PROP_005 FAILED: ' + e.getMessage())
    throw e
} finally {
    if (testPropertyId && !deletedViaUI) {
        try { propertyHelper.deletePropertyViaAPI(testPropertyId) } catch (Exception ex) {}
    }
    WebUI.closeBrowser()
}
