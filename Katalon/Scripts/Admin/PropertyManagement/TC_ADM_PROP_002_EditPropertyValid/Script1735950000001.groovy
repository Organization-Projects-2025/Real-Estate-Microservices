import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import com.kms.katalon.core.model.FailureHandling
import authentication.Login_Keywords as LoginKeywords
import admin.Property_Keywords as PropertyKeywords

/**
 * Test Case: TC_ADM_PROP_002 - Edit Property with Valid Data
 * Module: Admin Service - Property Management
 * Priority: High
 * 
 * Description: Verify that admin can edit an existing property with valid data
 * Expected: Success toast appears, modal closes
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
    
    // Open edit modal for test property
    WebUI.click(findTestObject('Object Repository/Admin/PropertiesPage/btn_EditProperty', [('propertyTitle'): testPropertyTitle]))
    WebUI.delay(1)
    propertyHelper.verifyPropertyModalDisplayed()
    
    // Update fields
    WebUI.clearText(findTestObject('Object Repository/Admin/PropertiesPage/Modal/input_Price'))
    WebUI.setText(findTestObject('Object Repository/Admin/PropertiesPage/Modal/input_Price'), '999999')
    WebUI.clearText(findTestObject('Object Repository/Admin/PropertiesPage/Modal/textarea_Description'))
    WebUI.setText(findTestObject('Object Repository/Admin/PropertiesPage/Modal/textarea_Description'), 'Updated by test')
    
    // Save
    WebUI.scrollToElement(findTestObject('Object Repository/Admin/PropertiesPage/Modal/btn_SaveChanges'), 5)
    WebUI.click(findTestObject('Object Repository/Admin/PropertiesPage/Modal/btn_SaveChanges'))
    WebUI.delay(3)
    
    // Assert: Success toast should appear
    propertyHelper.assertSuccessToast("Edit failed: Expected success toast after saving valid property data")
    
    // Assert: No error toast
    propertyHelper.assertNoErrorToast("Edit failed: Error toast appeared when saving valid data")
    
    // Assert: Modal should close
    propertyHelper.verifyModalClosed()
    
    WebUI.comment('✅ TC_ADM_PROP_002 PASSED')
    
} catch (Exception e) {
    WebUI.comment('❌ TC_ADM_PROP_002 FAILED: ' + e.getMessage())
    throw e
} finally {
    if (testPropertyId) {
        try { propertyHelper.deletePropertyViaAPI(testPropertyId) } catch (Exception ex) {}
    }
    WebUI.closeBrowser()
}
