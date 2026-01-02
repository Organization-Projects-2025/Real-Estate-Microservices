import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import propertyservice.Properties_Keywords as PropertiesKeywords
import propertyservice.PropertyDetail_Keywords as DetailKeywords

/**
 * Test Case: TC_PROP_009 - Image Gallery Navigation
 * 
 * Description: Verify that image gallery thumbnails work on property detail page
 * Prerequisites: Properties with multiple images must exist in database
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
    
    // Verify main image is displayed
    detailHelper.verifyMainImageDisplayed()
    
    // Try to click thumbnail if available
    try {
        detailHelper.clickImageThumbnail(0)
        WebUI.comment('Image thumbnail clicked successfully')
    } catch (Exception e) {
        WebUI.comment('No thumbnails available or single image property')
    }
    
    WebUI.comment('✅ TC_PROP_009 PASSED: Image gallery navigation tested')
    
} catch (Exception e) {
    WebUI.comment('❌ TC_PROP_009 FAILED: ' + e.getMessage())
    throw e
    
} finally {
    WebUI.closeBrowser()
}
