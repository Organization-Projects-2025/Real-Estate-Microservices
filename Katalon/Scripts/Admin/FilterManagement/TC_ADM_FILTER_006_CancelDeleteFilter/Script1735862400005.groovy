import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import com.kms.katalon.core.model.FailureHandling
import authentication.Login_Keywords as LoginKeywords
import admin.Filter_Keywords as FilterKeywords

/**
 * Test Case: TC_ADM_FILTER_006 - Cancel Delete Filter
 */

WebUI.openBrowser('')
LoginKeywords loginHelper = new LoginKeywords()
FilterKeywords filterHelper = new FilterKeywords()

String testFilterId = null
String filterName = null

try {
    // Create test filter via API
    def createResult = filterHelper.createTestFilterViaAPI()
    filterName = createResult.name
    testFilterId = createResult.filterId
    WebUI.comment("Test filter created: ${filterName} (ID: ${testFilterId})")
    
    // Login and navigate
    loginHelper.loginAsAdmin()
    filterHelper.navigateToFilters()
    filterHelper.waitForLoadingComplete()
    
    int countBefore = filterHelper.getFilterCount()
    
    // Click delete then cancel
    WebUI.click(findTestObject('Object Repository/Admin/FiltersPage/btn_DeleteFilter', [('filterName'): filterName]))
    WebUI.delay(1)
    WebUI.waitForAlert(5)
    WebUI.dismissAlert()
    WebUI.delay(1)
    
    // Verify filter still exists
    int countAfter = filterHelper.getFilterCount()
    assert countAfter == countBefore, "Filter count should remain unchanged"
    filterHelper.verifyFilterExistsInTable(filterName)
    
    WebUI.comment('✅ TC_ADM_FILTER_006 PASSED')
    
} catch (Exception e) {
    WebUI.comment('❌ TC_ADM_FILTER_006 FAILED: ' + e.getMessage())
    throw e
} finally {
    if (testFilterId) {
        try { filterHelper.deleteFilterViaAPI(testFilterId) } catch (Exception ex) {}
    }
    WebUI.closeBrowser()
}
