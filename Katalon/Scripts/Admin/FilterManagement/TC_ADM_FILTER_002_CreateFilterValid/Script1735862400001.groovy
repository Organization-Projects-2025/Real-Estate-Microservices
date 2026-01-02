import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import com.kms.katalon.core.model.FailureHandling
import authentication.Login_Keywords as LoginKeywords
import admin.Filter_Keywords as FilterKeywords

/**
 * Test Case: TC_ADM_FILTER_002 - Create Filter with Valid Data
 * Module: Admin Service - Filter Management
 * Priority: High
 * 
 * Description: Verify that admin can create a new filter with valid data
 * Prerequisites: Admin user is logged in, Application is running on localhost:5173
 * Test Data: Unique filter name generated with timestamp
 */

// Initialize
WebUI.openBrowser('')
LoginKeywords loginHelper = new LoginKeywords()
FilterKeywords filterHelper = new FilterKeywords()

// Generate unique filter name for this test
String uniqueFilterName = filterHelper.generateUniqueFilterName('ValidFilter')
String filterCategory = 'property-type'
String filterDescription = 'Test filter created by automated test'
int filterOrder = 1

try {
    // Arrange: Login as admin and navigate to Filters page
    loginHelper.loginAsAdmin()
    filterHelper.navigateToFilters()
    filterHelper.waitForLoadingComplete()
    
    // Get initial filter count
    int initialCount = filterHelper.getFilterCount()
    WebUI.comment("Initial filter count: ${initialCount}")
    
    // Act: Click Add Filter button
    filterHelper.clickAddFilterButton()
    
    // Assert: Verify modal is displayed with correct title
    filterHelper.verifyFilterModalDisplayed()
    String actualTitle = WebUI.getText(findTestObject('Object Repository/Admin/FiltersPage/Modal/h2_ModalTitle'))
    assert actualTitle.contains('Add New Filter'), "Expected modal title 'Add New Filter', but got '${actualTitle}'"
    
    // Act: Fill form with valid data
    filterHelper.fillFilterForm(
        uniqueFilterName,
        filterCategory,
        filterDescription,
        filterOrder,
        true
    )
    
    // Act: Click Create Filter button
    filterHelper.clickSaveFilterButton()
    
    // Assert: Verify modal is closed
    filterHelper.verifyModalClosed()
    
    // Wait for table to refresh
    filterHelper.waitForLoadingComplete()
    
    // Assert: Verify success toast
    filterHelper.verifySuccessToast('created')
    
    // Assert: Verify new filter appears in table
    filterHelper.verifyFilterExistsInTable(uniqueFilterName)
    
    // Assert: Verify filter count increased
    int finalCount = filterHelper.getFilterCount()
    WebUI.comment("Final filter count: ${finalCount}")
    assert finalCount == initialCount + 1, "Filter count should increase by 1"
    
    // Assert: Verify filter status is Active
    filterHelper.verifyFilterStatus(uniqueFilterName, 'Active')
    
    WebUI.comment('✅ TC_ADM_FILTER_002 PASSED: Filter created successfully with valid data')
    
} catch (Exception e) {
    WebUI.comment('❌ TC_ADM_FILTER_002 FAILED: ' + e.getMessage())
    throw e
    
} finally {
    // Cleanup
    WebUI.closeBrowser()
}
