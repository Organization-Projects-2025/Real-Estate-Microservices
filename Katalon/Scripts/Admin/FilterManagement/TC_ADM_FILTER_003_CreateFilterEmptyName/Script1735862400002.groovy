import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import com.kms.katalon.core.model.FailureHandling
import authentication.Login_Keywords as LoginKeywords
import admin.Filter_Keywords as FilterKeywords

/**
 * Test Case: TC_ADM_FILTER_003 - Create Filter with Empty Name (Negative Test)
 * Module: Admin Service - Filter Management
 * Priority: High
 * 
 * Description: Verify that form validation prevents creating filter without name
 * Prerequisites: Admin user is logged in, Application is running on localhost:5173
 * Expected: Form should not submit with empty name, HTML5 validation should trigger
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
    
    // Act: Leave name empty, fill other fields
    WebUI.clearText(findTestObject('Object Repository/Admin/FiltersPage/Modal/input_Name'))
    WebUI.selectOptionByValue(
        findTestObject('Object Repository/Admin/FiltersPage/Modal/select_Category'),
        'amenities',
        false
    )
    
    // Act: Try to click Create Filter button
    WebUI.click(findTestObject('Object Repository/Admin/FiltersPage/Modal/btn_SaveFilter'))
    
    // Wait a moment for validation
    WebUI.delay(2)
    
    // Assert: Verify modal is still open (form didn't submit due to validation)
    filterHelper.verifyFilterModalDisplayed()
    
    // Assert: Verify filter count hasn't changed
    int finalCount = filterHelper.getFilterCount()
    assert finalCount == initialCount, "Filter count should not change when validation fails"
    
    // Cleanup: Close modal
    WebUI.click(findTestObject('Object Repository/Admin/FiltersPage/Modal/btn_Cancel'))
    WebUI.delay(1)
    
    WebUI.comment('✅ TC_ADM_FILTER_003 PASSED: Form validation correctly prevented empty name submission')
    
} catch (Exception e) {
    WebUI.comment('❌ TC_ADM_FILTER_003 FAILED: ' + e.getMessage())
    throw e
    
} finally {
    // Cleanup
    WebUI.closeBrowser()
}
