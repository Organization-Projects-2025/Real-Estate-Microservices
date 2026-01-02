import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import com.kms.katalon.core.model.FailureHandling
import authentication.Login_Keywords as LoginKeywords
import admin.Filter_Keywords as FilterKeywords

/**
 * Test Case: TC_ADM_FILTER_009 - Toggle Filter Status (Active to Inactive)
 * Module: Admin Service - Filter Management
 * Priority: Medium
 * 
 * Description: Verify that filter status can be toggled between Active and Inactive
 * Prerequisites: Admin user is logged in, Application is running on localhost:5173
 * Test Data: Creates an active filter, toggles to inactive, then back to active
 */

// Initialize
WebUI.openBrowser('')
LoginKeywords loginHelper = new LoginKeywords()
FilterKeywords filterHelper = new FilterKeywords()

// Generate unique filter name
String filterName = filterHelper.generateUniqueFilterName('ToggleStatus')

try {
    // Arrange: Login as admin and navigate to Filters page
    loginHelper.loginAsAdmin()
    filterHelper.navigateToFilters()
    filterHelper.waitForLoadingComplete()
    
    // Arrange: Create an active filter
    filterHelper.createFilter(
        filterName,
        'property-type',
        'Filter for status toggle test',
        1,
        true  // Start as active
    )
    filterHelper.waitForLoadingComplete()
    
    // Assert: Verify filter is Active
    filterHelper.verifyFilterStatus(filterName, 'Active')
    WebUI.comment("Filter created with Active status")
    
    // Act: Edit filter and toggle to Inactive
    filterHelper.clickEditFilter(filterName)
    filterHelper.verifyFilterModalDisplayed()
    
    // Toggle isActive checkbox (should be checked, click to uncheck)
    WebUI.click(findTestObject('Object Repository/Admin/FiltersPage/Modal/checkbox_IsActive'))
    
    // Save changes
    filterHelper.clickSaveFilterButton()
    filterHelper.waitForLoadingComplete()
    
    // Assert: Verify status changed to Inactive
    filterHelper.verifyFilterStatus(filterName, 'Inactive')
    WebUI.comment("Filter status changed to Inactive")
    
    // Act: Edit again and toggle back to Active
    filterHelper.clickEditFilter(filterName)
    filterHelper.verifyFilterModalDisplayed()
    
    // Toggle isActive checkbox (should be unchecked, click to check)
    WebUI.click(findTestObject('Object Repository/Admin/FiltersPage/Modal/checkbox_IsActive'))
    
    // Save changes
    filterHelper.clickSaveFilterButton()
    filterHelper.waitForLoadingComplete()
    
    // Assert: Verify status changed back to Active
    filterHelper.verifyFilterStatus(filterName, 'Active')
    WebUI.comment("Filter status changed back to Active")
    
    WebUI.comment('✅ TC_ADM_FILTER_009 PASSED: Filter status toggled successfully')
    
} catch (Exception e) {
    WebUI.comment('❌ TC_ADM_FILTER_009 FAILED: ' + e.getMessage())
    throw e
    
} finally {
    // Cleanup
    WebUI.closeBrowser()
}
