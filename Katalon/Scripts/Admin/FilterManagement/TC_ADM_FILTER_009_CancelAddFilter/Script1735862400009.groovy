import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import com.kms.katalon.core.model.FailureHandling
import authentication.Login_Keywords as LoginKeywords
import admin.Filter_Keywords as FilterKeywords

/**
 * Test Case: TC_ADM_FILTER_010 - Cancel Add Filter Modal
 * Module: Admin Service - Filter Management
 * Priority: Low
 * 
 * Description: Verify that canceling the add modal doesn't create a filter
 * Prerequisites: Admin user is logged in, Application is running on localhost:5173
 * Expected: Modal closes when Cancel is clicked, no filter is created
 */

// Initialize
WebUI.openBrowser('')
LoginKeywords loginHelper = new LoginKeywords()
FilterKeywords filterHelper = new FilterKeywords()

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
    
    // Assert: Verify modal is displayed
    filterHelper.verifyFilterModalDisplayed()
    
    // Act: Fill form with data (but don't submit)
    String testFilterName = filterHelper.generateUniqueFilterName('CancelTest')
    filterHelper.fillFilterForm(
        testFilterName,
        'amenities',
        'This filter should not be created',
        1,
        true
    )
    
    // Act: Click Cancel button
    WebUI.click(findTestObject('Object Repository/Admin/FiltersPage/Modal/btn_Cancel'))
    WebUI.delay(1)
    
    // Assert: Verify modal is closed
    filterHelper.verifyModalClosed()
    
    // Assert: Verify filter count hasn't changed
    int finalCount = filterHelper.getFilterCount()
    assert finalCount == initialCount, "Filter count should remain ${initialCount}, but got ${finalCount}"
    
    // Assert: Verify the test filter was NOT created
    filterHelper.verifyFilterNotInTable(testFilterName)
    
    WebUI.comment('✅ TC_ADM_FILTER_010 PASSED: Cancel button works correctly - no filter was created')
    
} catch (Exception e) {
    WebUI.comment('❌ TC_ADM_FILTER_010 FAILED: ' + e.getMessage())
    throw e
    
} finally {
    // Cleanup
    WebUI.closeBrowser()
}
