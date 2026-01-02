import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import propertyservice.Properties_Keywords as PropertiesKeywords

/**
 * Test Case: TC_PROP_006 - Search with No Results
 * 
 * Description: Verify that searching with non-matching term shows no results message
 * Prerequisites: None
 */

WebUI.openBrowser('')
PropertiesKeywords propsHelper = new PropertiesKeywords()

try {
    // Navigate to Buy page
    propsHelper.navigateToBuyPage()
    propsHelper.waitForPropertiesToLoad()
    
    // Search with a term that won't match any property
    propsHelper.searchProperties('xyznonexistent12345')
    
    // Verify no results message is displayed
    propsHelper.verifyNoPropertiesMessage()
    
    WebUI.comment('✅ TC_PROP_006 PASSED: No results message shown for non-matching search')
    
} catch (Exception e) {
    WebUI.comment('❌ TC_PROP_006 FAILED: ' + e.getMessage())
    throw e
    
} finally {
    WebUI.closeBrowser()
}
