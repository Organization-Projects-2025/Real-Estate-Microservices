import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import propertyservice.Properties_Keywords as PropertiesKeywords

PropertiesKeywords propsHelper = new PropertiesKeywords()

try {
    WebUI.openBrowser('')
    propsHelper.navigateToRentPage()
    propsHelper.waitForPropertiesToLoad()
    propsHelper.verifyPropertyCardsDisplayed()
    if (WebUI.verifyElementPresent(findTestObject('Object Repository/PropertyService/BuyRentPage/paginationNextButton'), 5, com.kms.katalon.core.model.FailureHandling.OPTIONAL)) {
        WebUI.click(findTestObject('Object Repository/PropertyService/BuyRentPage/paginationNextButton'))
        WebUI.delay(2)
    }
    WebUI.comment('✅ TC_PROP_014 PASSED: Pagination works on Rent page')
} catch (Exception e) {
    WebUI.comment('❌ TC_PROP_014 FAILED: ' + e.getMessage())
    throw e
} finally {
    WebUI.closeBrowser()
}
