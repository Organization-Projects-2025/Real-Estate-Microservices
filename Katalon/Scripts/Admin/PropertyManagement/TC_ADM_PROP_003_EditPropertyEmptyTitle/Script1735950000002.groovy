import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import com.kms.katalon.core.model.FailureHandling
import authentication.Login_Keywords as LoginKeywords
import admin.Property_Keywords as PropertyKeywords

/**
 * Test Case: TC_ADM_PROP_003 - Edit Property with Empty Title (Negative)
 * 
 * Expected: User-friendly error toast (e.g., "Title is required"), NOT technical API error
 */

WebUI.openBrowser('')
LoginKeywords loginHelper = new LoginKeywords()
PropertyKeywords propertyHelper = new PropertyKeywords()

String testPropertyId = null

try {
    // Arrange
    def createResult = propertyHelper.createTestPropertyViaAPI()
    String testPropertyTitle = createResult.title
    testPropertyId = createResult.propertyId
    
    loginHelper.loginAsAdmin()
    propertyHelper.navigateToProperties()
    propertyHelper.waitForLoadingComplete()
    
    // Open edit modal
    WebUI.click(findTestObject('Object Repository/Admin/PropertiesPage/btn_EditProperty', [('propertyTitle'): testPropertyTitle]))
    WebUI.delay(1)
    propertyHelper.verifyPropertyModalDisplayed()
    
    // Clear title (invalid)
    WebUI.clearText(findTestObject('Object Repository/Admin/PropertiesPage/Modal/input_Title'))
    
    // Try to save
    WebUI.scrollToElement(findTestObject('Object Repository/Admin/PropertiesPage/Modal/btn_SaveChanges'), 5)
    WebUI.click(findTestObject('Object Repository/Admin/PropertiesPage/Modal/btn_SaveChanges'))
    WebUI.delay(3)
    
    // Assert: No success toast
    propertyHelper.assertNoSuccessToast("BUG: Success toast appeared with empty required field")
    
    // Assert: User-friendly error toast must appear (NOT technical API error)
    propertyHelper.assertErrorToast("BUG: Expected user-friendly error message (e.g., 'Title is required') but got technical API error or no error")
    
    // Cleanup
    WebUI.delay(3)
    WebUI.click(findTestObject('Object Repository/Admin/PropertiesPage/Modal/btn_Cancel'))
    
    WebUI.comment('✅ TC_ADM_PROP_003 PASSED')
    
} catch (Exception e) {
    WebUI.comment('❌ TC_ADM_PROP_003 FAILED: ' + e.getMessage())
    throw e
} finally {
    if (testPropertyId) {
        try { propertyHelper.deletePropertyViaAPI(testPropertyId) } catch (Exception ex) {}
    }
    WebUI.closeBrowser()
}
