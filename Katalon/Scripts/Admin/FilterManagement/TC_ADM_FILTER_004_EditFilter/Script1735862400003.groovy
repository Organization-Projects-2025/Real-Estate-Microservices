import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import com.kms.katalon.core.model.FailureHandling
import authentication.Login_Keywords as LoginKeywords
import admin.Filter_Keywords as FilterKeywords

/**
 * Test Case: TC_ADM_FILTER_004 - Edit Existing Filter
 */

WebUI.openBrowser('')
LoginKeywords loginHelper = new LoginKeywords()
FilterKeywords filterHelper = new FilterKeywords()

String testFilterId = null
String originalName = null
String updatedName = filterHelper.generateUniqueFilterName('EditedFilter')

try {
    // Create test filter via API
    def createResult = filterHelper.createTestFilterViaAPI()
    originalName = createResult.name
    testFilterId = createResult.filterId
    WebUI.comment("Test filter created: ${originalName} (ID: ${testFilterId})")
    
    // Login and navigate
    loginHelper.loginAsAdmin()
    filterHelper.navigateToFilters()
    filterHelper.waitForLoadingComplete()
    
    // Verify filter exists
    filterHelper.verifyFilterExistsInTable(originalName)
    
    // Edit filter
    filterHelper.clickEditFilter(originalName)
    filterHelper.verifyFilterModalDisplayed()
    
    // Update data
    filterHelper.fillFilterForm(updatedName, 'amenities', 'Updated description', 10, true)
    filterHelper.clickSaveFilterButton()
    
    // Verify
    filterHelper.verifyModalClosed()
    filterHelper.waitForLoadingComplete()
    filterHelper.verifySuccessToast('updated')
    filterHelper.verifyFilterExistsInTable(updatedName)
    filterHelper.verifyFilterNotInTable(originalName)
    
    WebUI.comment('✅ TC_ADM_FILTER_004 PASSED')
    
} catch (Exception e) {
    WebUI.comment('❌ TC_ADM_FILTER_004 FAILED: ' + e.getMessage())
    throw e
} finally {
    if (testFilterId) {
        try { filterHelper.deleteFilterViaAPI(testFilterId) } catch (Exception ex) {}
    }
    WebUI.closeBrowser()
}
