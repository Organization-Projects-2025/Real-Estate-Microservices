import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import propertyservice.Properties_Keywords as PropertiesKeywords

/**
 * Test Case: TC_PROP_012 - Clear All Filters
 * 
 * Description: Verify that clearing all filters resets the property list
 */

WebUI.openBrowser('')
PropertiesKeywords propsHelper = new PropertiesKeywords()

try {
    // Navigate to Buy page
    propsHelper.navigateToBuyPage()
    propsHelper.waitForPropertiesToLoad()
    
    // Verify properties are displayed initially
    propsHelper.verifyPropertyCardsDisplayed()
    WebUI.comment('Initial properties loaded')
    
    // Open filter panel
    propsHelper.openFilterPanel()
    propsHelper.verifyFilterPanelOpen()
    
    // Apply filters
    propsHelper.selectBedrooms('3+')
    WebUI.delay(1)
    propsHelper.togglePoolFilter()
    WebUI.delay(1)
    
    WebUI.comment('Filters applied: 3+ bedrooms, Pool')
    
    // Clear all filters
    propsHelper.clearAllFilters()
    WebUI.delay(1)
    
    WebUI.comment('Filters cleared')
    
    // Verify properties are still displayed after clearing
    propsHelper.verifyPropertyCardsDisplayed()
    
    WebUI.comment('✅ TC_PROP_012 PASSED: Clear filters works correctly')
    
} catch (Exception e) {
    WebUI.comment('❌ TC_PROP_012 FAILED: ' + e.getMessage())
    throw e
    
} finally {
    WebUI.closeBrowser()
}
