import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import com.kms.katalon.core.model.FailureHandling
import authentication.Login_Keywords as LoginKeywords
import admin.Filter_Keywords as FilterKeywords

/**
 * Test Case: TC_ADM_FILTER_006 - Cancel Delete Filter
 * Module: Admin Service - Filter Management
 * Priority: Medium
 * 
 * Description: Verify that canceling deletion keeps the filter in the table
 * Prerequisites: Admin user is logged in, Application is running on localhost:5173
 * Test Data: Creates a test filter, attempts to delete but cancels
 */

// Initialize
WebUI.openBrowser('')
LoginKeywords loginHelper = new LoginKeywords()
FilterKeywords filterHelper = new FilterKeywords()

// Generate unique filter name
String filterName = filterHelper.generateUniqueFilterName('CancelDeleteTest')

try {
    // Arrange: Login as admin and navigate to Filters page
    loginHelper.loginAsAdmin()
    filterHelper.navigateToFilters()
    filterHelper.waitForLoadingComplete()
    
    // Arrange: Create a test filter
    filterHelper.createFilter(
        filterName,
        'amenities',
        'Filter for cancel delete test',
        50,
        true
    )
    filterHelper.waitForLoadingComplete()
    
    // Assert: Verify filter was created
    filterHelper.verifyFilterExistsInTable(filterName)
    
    // Get filter count before attempting deletion
    int countBefore = filterHelper.getFilterCount()
    
    // Act: Click Delete button for the filter
    WebUI.click(findTestObject('Object Repository/Admin/FiltersPage/btn_DeleteFilter', [('filterName'): filterName]))
    WebUI.delay(1)
    
    // Act: Cancel deletion in alert
    WebUI.waitForAlert(5)
    WebUI.dismissAlert()
    WebUI.delay(1)
    
    // Wait a moment
    WebUI.delay(1)
    
    // Assert: Verify filter still exists in table
    filterHelper.verifyFilterExistsInTable(filterName)
    
    // Assert: Verify filter count hasn't changed
    int countAfter = filterHelper.getFilterCount()
    assert countAfter == countBefore, "Filter count should remain the same after canceling deletion"
    
    WebUI.comment('✅ TC_ADM_FILTER_006 PASSED: Cancel deletion keeps filter in table')
    
} catch (Exception e) {
    WebUI.comment('❌ TC_ADM_FILTER_006 FAILED: ' + e.getMessage())
    throw e
    
} finally {
    // Cleanup
    WebUI.closeBrowser()
}
