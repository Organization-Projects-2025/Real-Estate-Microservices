import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import propertyservice.Properties_Keywords as PropertiesKeywords
import propertyservice.PropertyDetail_Keywords as DetailKeywords

PropertiesKeywords propsHelper = new PropertiesKeywords()
DetailKeywords detailHelper = new DetailKeywords()

try {
    WebUI.openBrowser('')
    propsHelper.navigateToBuyPage()
    propsHelper.waitForPropertiesToLoad()
    propsHelper.clickFirstViewDetails()
    detailHelper.verifyPropertyDetailPageLoaded()
    detailHelper.verifyPropertyAddressDisplayed()
    WebUI.comment('✅ TC_PROP_029 PASSED: Property address displayed')
} catch (Exception e) {
    WebUI.comment('❌ TC_PROP_029 FAILED: ' + e.getMessage())
    throw e
} finally {
    WebUI.closeBrowser()
}
