import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
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
    WebUI.verifyElementPresent(findTestObject('Object Repository/PropertyService/PropertyDetailPage/propertyPrice'), 10)
    String price = detailHelper.getPropertyPrice()
    WebUI.comment('Property price: ' + price)
    WebUI.comment('✅ TC_PROP_030 PASSED: Property price displayed')
} catch (Exception e) {
    WebUI.comment('❌ TC_PROP_030 FAILED: ' + e.getMessage())
    throw e
} finally {
    WebUI.closeBrowser()
}
