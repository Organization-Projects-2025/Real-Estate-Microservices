import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import propertyservice.Properties_Keywords as PropertiesKeywords
import propertyservice.PropertyDetail_Keywords as DetailKeywords

PropertiesKeywords propsHelper = new PropertiesKeywords()
DetailKeywords detailHelper = new DetailKeywords()

try {
    WebUI.openBrowser('')
    propsHelper.navigateToRentPage()
    propsHelper.waitForPropertiesToLoad()
    propsHelper.clickFirstViewDetails()
    detailHelper.verifyPropertyDetailPageLoaded()
    WebUI.comment('✅ TC_PROP_015 PASSED: View Details from Rent page works')
} catch (Exception e) {
    WebUI.comment('❌ TC_PROP_015 FAILED: ' + e.getMessage())
    throw e
} finally {
    WebUI.closeBrowser()
}
