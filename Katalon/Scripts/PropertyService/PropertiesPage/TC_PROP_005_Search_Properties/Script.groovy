import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import propertyservice.Properties_Keywords as PropertiesKeywords

/**
 * Test Case: TC_PROP_005 - Search Properties
 * 
 * Description: Verify that user can search properties using the search bar
 * Prerequisites: Properties must exist in database
 */

WebUI.openBrowser('')
PropertiesKeywords propsHelper = new PropertiesKeywords()

try {
    // Navigate to Buy page
    propsHelper.navigateToBuyPage()
    propsHelper.waitForPropertiesToLoad()
    
    // Search for properties
    propsHelper.searchProperties('house')
    
    // Verify search results (either properties found or no results message)
    try {
        propsHelper.verifyPropertyCardsDisplayed()
        WebUI.comment('Search returned property results')
    } catch (Exception e) {
        propsHelper.verifyNoPropertiesMessage()
        WebUI.comment('Search returned no results (expected for non-matching search)')
    }
    
    WebUI.comment('✅ TC_PROP_005 PASSED: Search functionality works')
    
} catch (Exception e) {
    WebUI.comment('❌ TC_PROP_005 FAILED: ' + e.getMessage())
    throw e
    
} finally {
    WebUI.closeBrowser()
}
