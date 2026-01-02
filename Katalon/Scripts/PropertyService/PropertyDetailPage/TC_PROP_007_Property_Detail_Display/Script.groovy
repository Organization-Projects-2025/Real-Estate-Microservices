import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import propertyservice.Properties_Keywords as PropertiesKeywords
import propertyservice.PropertyDetail_Keywords as DetailKeywords

/**
 * Test Case: TC_PROP_007 - Property Detail Display
 * 
 * Description: Verify that property detail page displays all property information
 * Prerequisites: Properties must exist in database
 */

WebUI.openBrowser('')
PropertiesKeywords propsHelper = new PropertiesKeywords()
DetailKeywords detailHelper = new DetailKeywords()

try {
    // Navigate to Buy page and click first property
    propsHelper.navigateToBuyPage()
    propsHelper.waitForPropertiesToLoad()
    propsHelper.clickFirstViewDetails()
    
    // Verify property detail page loaded
    detailHelper.verifyPropertyDetailPageLoaded()
    
    // Verify main elements are displayed
    detailHelper.verifyMainImageDisplayed()
    detailHelper.verifyBedroomsDisplayed()
    detailHelper.verifyBathroomsDisplayed()
    
    // Get and log property info
    String title = detailHelper.getPropertyTitle()
    String price = detailHelper.getPropertyPrice()
    WebUI.comment("Property Title: ${title}")
    WebUI.comment("Property Price: ${price}")
    
    WebUI.comment('✅ TC_PROP_007 PASSED: Property detail page displays all information')
    
} catch (Exception e) {
    WebUI.comment('❌ TC_PROP_007 FAILED: ' + e.getMessage())
    throw e
    
} finally {
    WebUI.closeBrowser()
}
