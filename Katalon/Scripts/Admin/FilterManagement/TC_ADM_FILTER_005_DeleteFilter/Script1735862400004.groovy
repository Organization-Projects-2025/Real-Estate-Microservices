import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import com.kms.katalon.core.model.FailureHandling
import authentication.Login_Keywords as LoginKeywords
import admin.Filter_Keywords as FilterKeywords

/**
 * Test Case: TC_ADM_FILTER_005 - Delete Filter
 * Module: Admin Service - Filter Management
 * Priority: High
 * 
 * Description: Verify that admin can delete a filter with confirmation
 * Prerequisites: Admin user is logged in, Application is running on localhost:5173
 * Test Data: Creates a test filter, then deletes it
 */

// Initialize
WebUI.openBrowser('')
LoginKeywords loginHelper = new LoginKeywords()
FilterKeywords filterHelper = new FilterKeywords()

// Generate unique filter name
String filterToDelete = filterHelper.generateUniqueFilterName('DeleteTest')

try {
    // Arrange: Login as admin and navigate to Filters page
    loginHelper.loginAsAdmin()
    filterHelper.navigateToFilters()
    filterHelper.waitForLoadingComplete()
    
    // Arrange: Create a test filter to delete
    filterHelper.createFilter(
        filterToDelete,
        'location',
        'Filter to be deleted',
        99,
        true
    )
    filterHelper.waitForLoadingComplete()
    
    // Assert: Verify filter was created
    filterHelper.verifyFilterExistsInTable(filterToDelete)
    
    // Get filter count before deletion
    int countBeforeDelete = filterHelper.getFilterCount()
    WebUI.comment("Filter count before deletion: ${countBeforeDelete}")
    
    // Act: Click Delete button for the filter
    WebUI.click(findTestObject('Object Repository/Admin/FiltersPage/btn_DeleteFilter', [('filterName'): filterToDelete]))
    WebUI.delay(1)
    
    // Act: Confirm deletion in alert
    WebUI.waitForAlert(5)
    WebUI.acceptAlert()
    WebUI.delay(2)
    
    // Wait for table to refresh
    filterHelper.waitForLoadingComplete()
    
    // Assert: Verify success toast
    filterHelper.verifySuccessToast('deleted')
    
    // Assert: Verify filter is removed from table
    filterHelper.verifyFilterNotInTable(filterToDelete)
    
    // Assert: Verify filter count decreased
    int countAfterDelete = filterHelper.getFilterCount()
    WebUI.comment("Filter count after deletion: ${countAfterDelete}")
    assert countAfterDelete == countBeforeDelete - 1, "Filter count should decrease by 1"
    
    WebUI.comment('✅ TC_ADM_FILTER_005 PASSED: Filter deleted successfully')
    
} catch (Exception e) {
    WebUI.comment('❌ TC_ADM_FILTER_005 FAILED: ' + e.getMessage())
    throw e
    
} finally {
    // Cleanup
    WebUI.closeBrowser()
}
