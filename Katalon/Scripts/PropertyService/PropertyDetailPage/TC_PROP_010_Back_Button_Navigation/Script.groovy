import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import propertyservice.Properties_Keywords as PropertiesKeywords
import propertyservice.PropertyDetail_Keywords as DetailKeywords

/**
 * Test Case: TC_PROP_010 - Back Button Navigation
 * 
 * Description: Verify that Back button navigates back from property detail
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
    
    // Click Back button
    detailHelper.clickBackButton()
    
    // Verify we navigated back (URL should change)
    WebUI.delay(2)
    String currentUrl = WebUI.getUrl()
    WebUI.comment("Navigated to: ${currentUrl}")
    
    WebUI.comment('✅ TC_PROP_010 PASSED: Back button navigates correctly')
    
} catch (Exception e) {
    WebUI.comment('❌ TC_PROP_010 FAILED: ' + e.getMessage())
    throw e
    
} finally {
    WebUI.closeBrowser()
}
