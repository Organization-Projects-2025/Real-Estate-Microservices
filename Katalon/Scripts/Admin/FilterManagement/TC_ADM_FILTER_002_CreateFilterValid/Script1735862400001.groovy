import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import com.kms.katalon.core.model.FailureHandling
import authentication.Login_Keywords as LoginKeywords
import admin.Filter_Keywords as FilterKeywords

/**
 * Test Case: TC_ADM_FILTER_002 - Create Filter with Valid Data
 */

WebUI.openBrowser('')
LoginKeywords loginHelper = new LoginKeywords()
FilterKeywords filterHelper = new FilterKeywords()

String uniqueFilterName = filterHelper.generateUniqueFilterName('ValidFilter')
String createdFilterId = null

try {
    // Login and navigate
    loginHelper.loginAsAdmin()
    filterHelper.navigateToFilters()
    filterHelper.waitForLoadingComplete()
    
    int initialCount = filterHelper.getFilterCount()
    
    // Create filter via UI
    filterHelper.clickAddFilterButton()
    filterHelper.verifyFilterModalDisplayed()
    filterHelper.fillFilterForm(uniqueFilterName, 'property-type', 'Test filter', 1, true)
    filterHelper.clickSaveFilterButton()
    
    // Verify
    filterHelper.verifyModalClosed()
    filterHelper.waitForLoadingComplete()
    filterHelper.verifySuccessToast('created')
    filterHelper.verifyFilterExistsInTable(uniqueFilterName)
    
    int finalCount = filterHelper.getFilterCount()
    assert finalCount == initialCount + 1, "Filter count should increase by 1"
    
    // Get filter ID for cleanup (create via API to get ID, then we'll delete)
    // Since we created via UI, we need to find another way or just leave it
    // For now, mark that we created a filter
    WebUI.comment("Filter created: ${uniqueFilterName}")
    
    WebUI.comment('✅ TC_ADM_FILTER_002 PASSED')
    
} catch (Exception e) {
    WebUI.comment('❌ TC_ADM_FILTER_002 FAILED: ' + e.getMessage())
    throw e
} finally {
    // Note: Filter created via UI - manual cleanup may be needed
    // To properly cleanup, we'd need to get the filter ID from the table or API
    WebUI.closeBrowser()
}
