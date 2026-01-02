import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import com.kms.katalon.core.model.FailureHandling
import authentication.Login_Keywords as LoginKeywords
import admin.Filter_Keywords as FilterKeywords

/**
 * Test Case: TC_ADM_FILTER_008 - Create Inactive Filter
 * Module: Admin Service - Filter Management
 * Priority: Medium
 * 
 * Description: Verify that a filter can be created with inactive status
 * Prerequisites: Admin user is logged in, Application is running on localhost:5173
 * Test Data: Creates a filter with isActive = false
 */

// Initialize
WebUI.openBrowser('')
LoginKeywords loginHelper = new LoginKeywords()
FilterKeywords filterHelper = new FilterKeywords()

// Generate unique filter name
String filterName = filterHelper.generateUniqueFilterName('InactiveFilter')

try {
    // Arrange: Login as admin and navigate to Filters page
    loginHelper.loginAsAdmin()
    filterHelper.navigateToFilters()
    filterHelper.waitForLoadingComplete()
    
    // Act: Click Add Filter button
    filterHelper.clickAddFilterButton()
    
    // Assert: Verify modal is displayed
    filterHelper.verifyFilterModalDisplayed()
    
    // Act: Fill form with isActive = false
    filterHelper.fillFilterForm(
        filterName,
        'features',
        'This is an inactive filter',
        0,
        false  // isActive = false
    )
    
    // Act: Click Create Filter button
    filterHelper.clickSaveFilterButton()
    
    // Wait for table to refresh
    filterHelper.waitForLoadingComplete()
    
    // Assert: Verify filter exists in table
    filterHelper.verifyFilterExistsInTable(filterName)
    
    // Assert: Verify filter status is Inactive
    filterHelper.verifyFilterStatus(filterName, 'Inactive')
    
    WebUI.comment("✅ TC_ADM_FILTER_008 PASSED: Successfully created inactive filter: ${filterName}")
    
} catch (Exception e) {
    WebUI.comment('❌ TC_ADM_FILTER_008 FAILED: ' + e.getMessage())
    throw e
    
} finally {
    // Cleanup
    WebUI.closeBrowser()
}
