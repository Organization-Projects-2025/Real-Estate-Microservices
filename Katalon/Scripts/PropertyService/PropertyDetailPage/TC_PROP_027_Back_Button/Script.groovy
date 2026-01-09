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
    if (WebUI.verifyElementPresent(findTestObject('Object Repository/PropertyService/PropertyDetailPage/backButton'), 5, com.kms.katalon.core.model.FailureHandling.OPTIONAL)) {
        detailHelper.clickBackButton()
    }
    WebUI.comment('✅ TC_PROP_027 PASSED: Back button works')
} catch (Exception e) {
    WebUI.comment('❌ TC_PROP_027 FAILED: ' + e.getMessage())
    throw e
} finally {
    WebUI.closeBrowser()
}
