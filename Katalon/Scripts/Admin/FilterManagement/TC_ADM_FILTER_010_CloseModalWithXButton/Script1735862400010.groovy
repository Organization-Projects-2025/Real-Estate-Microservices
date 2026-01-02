import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import com.kms.katalon.core.model.FailureHandling
import authentication.Login_Keywords as LoginKeywords
import admin.Filter_Keywords as FilterKeywords

/**
 * Test Case: TC_ADM_FILTER_011 - Close Modal with X Button
 * Module: Admin Service - Filter Management
 * Priority: Low
 * 
 * Description: Verify that the X button closes the modal without creating a filter
 * Prerequisites: Admin user is logged in, Application is running on localhost:5173
 * Expected: Modal closes when X button is clicked, no filter is created
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
    
    // Act: Click Add Filter button
    filterHelper.clickAddFilterButton()
    
    // Assert: Verify modal is displayed
    filterHelper.verifyFilterModalDisplayed()
    
    // Act: Click X button to close modal
    WebUI.click(findTestObject('Object Repository/Admin/FiltersPage/Modal/btn_CloseModal'))
    WebUI.delay(1)
    
    // Assert: Verify modal is closed
    filterHelper.verifyModalClosed()
    
    // Assert: Verify filter count hasn't changed
    int finalCount = filterHelper.getFilterCount()
    assert finalCount == initialCount, "Filter count should remain unchanged"
    
    WebUI.comment('✅ TC_ADM_FILTER_011 PASSED: X button closes modal correctly')
    
} catch (Exception e) {
    WebUI.comment('❌ TC_ADM_FILTER_011 FAILED: ' + e.getMessage())
    throw e
    
} finally {
    // Cleanup
    WebUI.closeBrowser()
}
