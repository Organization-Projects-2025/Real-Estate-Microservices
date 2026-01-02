import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import com.kms.katalon.core.model.FailureHandling
import authentication.Login_Keywords as LoginKeywords
import admin.Filter_Keywords as FilterKeywords

/**
 * Test Case: TC_ADM_FILTER_001 - View Filters Management Page
 * Module: Admin Service - Filter Management
 * Priority: High
 * 
 * Description: Verify that admin can access and view the Filters Management page
 * Prerequisites: Admin user is logged in, Application is running on localhost:5173
 * Test Data: admin@realestate.com / Password123!
 */

// Initialize
WebUI.openBrowser('')
LoginKeywords loginHelper = new LoginKeywords()
FilterKeywords filterHelper = new FilterKeywords()

try {
    // Arrange: Login as admin
    loginHelper.loginAsAdmin()
    
    // Act: Navigate to Filters Management page
    filterHelper.navigateToFilters()
    
    // Assert: Verify page title is displayed
    WebUI.verifyElementPresent(
        findTestObject('Object Repository/Admin/FiltersPage/h1_FiltersManagement'),
        10,
        FailureHandling.STOP_ON_FAILURE
    )
    
    // Assert: Verify Add Filter button is present and clickable
    WebUI.verifyElementClickable(
        findTestObject('Object Repository/Admin/FiltersPage/btn_AddFilter'),
        FailureHandling.STOP_ON_FAILURE
    )
    
    // Wait for loading to complete
    filterHelper.waitForLoadingComplete()
    
    // Assert: Verify either table or empty state is displayed
    boolean hasFilters = WebUI.verifyElementPresent(
        findTestObject('Object Repository/Admin/FiltersPage/table_Filters'),
        5,
        FailureHandling.OPTIONAL
    )
    
    if (!hasFilters) {
        WebUI.verifyElementPresent(
            findTestObject('Object Repository/Admin/FiltersPage/div_EmptyState'),
            5,
            FailureHandling.STOP_ON_FAILURE
        )
        WebUI.comment('Empty state displayed - no filters exist')
    } else {
        WebUI.comment('Filters table displayed with existing filters')
    }
    
    WebUI.comment('✅ TC_ADM_FILTER_001 PASSED: Filters Management page loaded successfully')
    
} catch (Exception e) {
    WebUI.comment('❌ TC_ADM_FILTER_001 FAILED: ' + e.getMessage())
    throw e
    
} finally {
    // Cleanup
    WebUI.closeBrowser()
}
