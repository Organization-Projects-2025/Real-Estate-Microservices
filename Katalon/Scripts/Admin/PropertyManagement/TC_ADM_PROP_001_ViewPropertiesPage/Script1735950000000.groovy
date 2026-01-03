import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import com.kms.katalon.core.model.FailureHandling
import authentication.Login_Keywords as LoginKeywords
import admin.Property_Keywords as PropertyKeywords

/**
 * Test Case: TC_ADM_PROP_001 - View Properties Management Page
 * Module: Admin Service - Property Management
 * Priority: High
 * 
 * Description: Verify that admin can access and view the Properties Management page
 * Prerequisites: Admin user is logged in, Application is running on localhost:5173
 */

// Initialize
WebUI.openBrowser('')
LoginKeywords loginHelper = new LoginKeywords()
PropertyKeywords propertyHelper = new PropertyKeywords()

try {
    // Arrange: Login as admin
    loginHelper.loginAsAdmin()
    
    // Act: Navigate to Properties Management page
    propertyHelper.navigateToProperties()
    
    // Assert: Verify page title is displayed
    WebUI.verifyElementPresent(
        findTestObject('Object Repository/Admin/PropertiesPage/h1_PropertyManagement'),
        10,
        FailureHandling.STOP_ON_FAILURE
    )
    
    // Wait for loading to complete
    propertyHelper.waitForLoadingComplete()
    
    // Assert: Verify table is displayed
    WebUI.verifyElementPresent(
        findTestObject('Object Repository/Admin/PropertiesPage/table_Properties'),
        10,
        FailureHandling.STOP_ON_FAILURE
    )
    
    // Get property count
    int propertyCount = propertyHelper.getPropertyCount()
    WebUI.comment("Properties found in table: ${propertyCount}")
    
    WebUI.comment('✅ TC_ADM_PROP_001 PASSED: Properties Management page loaded successfully')
    
} catch (Exception e) {
    WebUI.comment('❌ TC_ADM_PROP_001 FAILED: ' + e.getMessage())
    throw e
    
} finally {
    // Cleanup
    WebUI.closeBrowser()
}
