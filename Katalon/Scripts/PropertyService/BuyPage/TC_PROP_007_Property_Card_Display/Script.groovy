import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import propertyservice.Properties_Keywords as PropertiesKeywords

PropertiesKeywords propsHelper = new PropertiesKeywords()

try {
    WebUI.openBrowser('')
    propsHelper.navigateToBuyPage()
    propsHelper.waitForPropertiesToLoad()
    propsHelper.verifyPropertyCardsDisplayed()
    WebUI.verifyElementPresent(findTestObject('Object Repository/PropertyService/BuyRentPage/propertyCardImage'), 10)
    WebUI.comment('✅ TC_PROP_007 PASSED: Property cards display correctly')
} catch (Exception e) {
    WebUI.comment('❌ TC_PROP_007 FAILED: ' + e.getMessage())
    throw e
} finally {
    WebUI.closeBrowser()
}
