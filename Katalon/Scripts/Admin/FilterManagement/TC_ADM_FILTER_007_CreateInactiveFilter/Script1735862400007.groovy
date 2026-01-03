import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import com.kms.katalon.core.model.FailureHandling
import authentication.Login_Keywords as LoginKeywords
import admin.Filter_Keywords as FilterKeywords

/**
 * Test Case: TC_ADM_FILTER_007 - Create Inactive Filter
 */

WebUI.openBrowser('')
LoginKeywords loginHelper = new LoginKeywords()
FilterKeywords filterHelper = new FilterKeywords()

String filterName = filterHelper.generateUniqueFilterName('InactiveFilter')

try {
    // Login and navigate
    loginHelper.loginAsAdmin()
    filterHelper.navigateToFilters()
    filterHelper.waitForLoadingComplete()
    
    // Create inactive filter via UI
    filterHelper.clickAddFilterButton()
    filterHelper.verifyFilterModalDisplayed()
    filterHelper.fillFilterForm(filterName, 'features', 'Inactive filter', 0, false)
    filterHelper.clickSaveFilterButton()
    
    // Verify
    filterHelper.waitForLoadingComplete()
    filterHelper.verifyFilterExistsInTable(filterName)
    filterHelper.verifyFilterStatus(filterName, 'Inactive')
    
    WebUI.comment('✅ TC_ADM_FILTER_007 PASSED')
    
} catch (Exception e) {
    WebUI.comment('❌ TC_ADM_FILTER_007 FAILED: ' + e.getMessage())
    throw e
} finally {
    // Note: Filter created via UI - would need filter ID for API cleanup
    WebUI.closeBrowser()
}
