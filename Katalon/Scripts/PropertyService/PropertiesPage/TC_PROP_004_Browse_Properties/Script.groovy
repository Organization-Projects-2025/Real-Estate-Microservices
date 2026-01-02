import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import propertyservice.Properties_Keywords as PropertiesKeywords

/**
 * Test Case: TC_PROP_004 - Browse Properties (Buy Page)
 * 
 * Description: Verify that Buy page loads and displays property cards
 * Prerequisites: Properties for sale must exist in database
 */

WebUI.openBrowser('')
PropertiesKeywords propsHelper = new PropertiesKeywords()

try {
    // Navigate to Buy page
    propsHelper.navigateToBuyPage()
    
    // Wait for properties to load
    propsHelper.waitForPropertiesToLoad()
    
    // Verify page loaded
    propsHelper.verifyBuyPageLoaded()
    
    // Verify property cards are displayed
    propsHelper.verifyPropertyCardsDisplayed()
    
    WebUI.comment('✅ TC_PROP_004 PASSED: Buy page loads and displays property cards')
    
} catch (Exception e) {
    WebUI.comment('❌ TC_PROP_004 FAILED: ' + e.getMessage())
    throw e
    
} finally {
    WebUI.closeBrowser()
}
