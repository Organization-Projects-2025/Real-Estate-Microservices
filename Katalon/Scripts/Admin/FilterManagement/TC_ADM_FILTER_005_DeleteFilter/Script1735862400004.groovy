import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import com.kms.katalon.core.model.FailureHandling
import authentication.Login_Keywords as LoginKeywords
import admin.Filter_Keywords as FilterKeywords

/**
 * Test Case: TC_ADM_FILTER_005 - Delete Filter
 */

WebUI.openBrowser('')
LoginKeywords loginHelper = new LoginKeywords()
FilterKeywords filterHelper = new FilterKeywords()

String testFilterId = null
String filterName = null
boolean deletedViaUI = false

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
    
    // Delete filter via UI
    WebUI.click(findTestObject('Object Repository/Admin/FiltersPage/btn_DeleteFilter', [('filterName'): filterName]))
    WebUI.delay(1)
    WebUI.waitForAlert(5)
    WebUI.acceptAlert()
    WebUI.delay(2)
    
    deletedViaUI = true
    
    // Verify
    filterHelper.waitForLoadingComplete()
    filterHelper.verifySuccessToast('deleted')
    filterHelper.verifyFilterNotInTable(filterName)
    
    int countAfter = filterHelper.getFilterCount()
    assert countAfter == countBefore - 1, "Filter count should decrease by 1"
    
    WebUI.comment('✅ TC_ADM_FILTER_005 PASSED')
    
} catch (Exception e) {
    WebUI.comment('❌ TC_ADM_FILTER_005 FAILED: ' + e.getMessage())
    throw e
} finally {
    if (testFilterId && !deletedViaUI) {
        try { filterHelper.deleteFilterViaAPI(testFilterId) } catch (Exception ex) {}
    }
    WebUI.closeBrowser()
}
