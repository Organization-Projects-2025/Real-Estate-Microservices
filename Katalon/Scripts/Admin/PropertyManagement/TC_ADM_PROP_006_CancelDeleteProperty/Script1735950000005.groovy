import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import com.kms.katalon.core.model.FailureHandling
import authentication.Login_Keywords as LoginKeywords
import admin.Property_Keywords as PropertyKeywords

/**
 * Test Case: TC_ADM_PROP_006 - Cancel Delete Property
 * Module: Admin Service - Property Management
 * Priority: Medium
 * 
 * Description: Verify that admin can cancel property deletion when prompted
 * Expected: No success toast, no error toast, property count unchanged
 */

WebUI.openBrowser('')
LoginKeywords loginHelper = new LoginKeywords()
PropertyKeywords propertyHelper = new PropertyKeywords()

String testPropertyId = null

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
    
    // Get count before
    int countBefore = propertyHelper.getPropertyCount()
    
    // Click delete for test property
    WebUI.click(findTestObject('Object Repository/Admin/PropertiesPage/btn_DeleteProperty', [('propertyTitle'): testPropertyTitle]))
    WebUI.delay(1)
    
    // CANCEL deletion (dismiss alert)
    WebUI.waitForAlert(5)
    WebUI.dismissAlert()
    WebUI.delay(2)
    
    // Assert: No success toast (nothing was deleted)
    propertyHelper.assertNoSuccessToast("Cancel delete bug: Success toast appeared after canceling")
    
    // Assert: No error toast
    propertyHelper.assertNoErrorToast("Cancel delete bug: Error toast appeared after canceling")
    
    // Assert: Property count unchanged
    int countAfter = propertyHelper.getPropertyCount()
    assert countAfter == countBefore, "Cancel delete bug: Property count changed after canceling"
    
    WebUI.comment('✅ TC_ADM_PROP_006 PASSED')
    
} catch (Exception e) {
    WebUI.comment('❌ TC_ADM_PROP_006 FAILED: ' + e.getMessage())
    throw e
} finally {
    if (testPropertyId) {
        try { propertyHelper.deletePropertyViaAPI(testPropertyId) } catch (Exception ex) {}
    }
    WebUI.closeBrowser()
}
