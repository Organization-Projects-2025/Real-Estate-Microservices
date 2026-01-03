import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import com.kms.katalon.core.model.FailureHandling
import authentication.Login_Keywords as LoginKeywords
import admin.Filter_Keywords as FilterKeywords

/**
 * Test Case: TC_ADM_FILTER_008 - Toggle Filter Status
 */

WebUI.openBrowser('')
LoginKeywords loginHelper = new LoginKeywords()
FilterKeywords filterHelper = new FilterKeywords()

String testFilterId = null
String filterName = null

try {
    // Create test filter via API (active by default)
    def createResult = filterHelper.createTestFilterViaAPI()
    filterName = createResult.name
    testFilterId = createResult.filterId
    WebUI.comment("Test filter created: ${filterName} (ID: ${testFilterId})")
    
    // Login and navigate
    loginHelper.loginAsAdmin()
    filterHelper.navigateToFilters()
    filterHelper.waitForLoadingComplete()
    
    // Verify initial status is Active
    filterHelper.verifyFilterStatus(filterName, 'Active')
    
    // Edit and toggle to Inactive
    filterHelper.clickEditFilter(filterName)
    filterHelper.verifyFilterModalDisplayed()
    
    // Uncheck isActive
    WebUI.click(findTestObject('Object Repository/Admin/FiltersPage/Modal/checkbox_IsActive'))
    filterHelper.clickSaveFilterButton()
    
    // Verify
    filterHelper.waitForLoadingComplete()
    filterHelper.verifyFilterStatus(filterName, 'Inactive')
    
    WebUI.comment('✅ TC_ADM_FILTER_008 PASSED')
    
} catch (Exception e) {
    WebUI.comment('❌ TC_ADM_FILTER_008 FAILED: ' + e.getMessage())
    throw e
} finally {
    if (testFilterId) {
        try { filterHelper.deleteFilterViaAPI(testFilterId) } catch (Exception ex) {}
    }
    WebUI.closeBrowser()
}
