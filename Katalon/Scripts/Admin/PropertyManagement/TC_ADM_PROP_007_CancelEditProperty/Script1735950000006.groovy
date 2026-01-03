import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import com.kms.katalon.core.model.FailureHandling
import authentication.Login_Keywords as LoginKeywords
import admin.Property_Keywords as PropertyKeywords

/**
 * Test Case: TC_ADM_PROP_007 - Cancel Edit Property
 * Module: Admin Service - Property Management
 * Priority: Medium
 * 
 * Description: Verify that admin can cancel property edit using Cancel button
 * Expected: No success toast, no error toast, modal closes, data unchanged
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
    
    // Modify title (but don't save)
    WebUI.clearText(findTestObject('Object Repository/Admin/PropertiesPage/Modal/input_Title'))
    WebUI.setText(findTestObject('Object Repository/Admin/PropertiesPage/Modal/input_Title'), 'MODIFIED_SHOULD_NOT_SAVE')
    
    // Click Cancel
    WebUI.click(findTestObject('Object Repository/Admin/PropertiesPage/Modal/btn_Cancel'))
    WebUI.delay(2)
    
    // Assert: No success toast (nothing was saved)
    propertyHelper.assertNoSuccessToast("Cancel edit bug: Success toast appeared after canceling")
    
    // Assert: No error toast
    propertyHelper.assertNoErrorToast("Cancel edit bug: Error toast appeared after canceling")
    
    // Assert: Modal closed
    propertyHelper.verifyModalClosed()
    
    // Assert: Original title still exists in table
    WebUI.verifyElementPresent(
        findTestObject('Object Repository/Admin/PropertiesPage/td_PropertyTitle', [('propertyTitle'): testPropertyTitle]),
        10, FailureHandling.STOP_ON_FAILURE
    )
    
    WebUI.comment('✅ TC_ADM_PROP_007 PASSED')
    
} catch (Exception e) {
    WebUI.comment('❌ TC_ADM_PROP_007 FAILED: ' + e.getMessage())
    throw e
} finally {
    if (testPropertyId) {
        try { propertyHelper.deletePropertyViaAPI(testPropertyId) } catch (Exception ex) {}
    }
    WebUI.closeBrowser()
}
