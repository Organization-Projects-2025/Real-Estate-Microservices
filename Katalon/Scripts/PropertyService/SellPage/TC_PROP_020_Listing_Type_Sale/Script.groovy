import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import authentication.Login_Keywords as LoginKeywords
import propertyservice.Sell_Keywords as SellKeywords

LoginKeywords loginHelper = new LoginKeywords()
SellKeywords sellHelper = new SellKeywords()

try {
    WebUI.openBrowser('')
    loginHelper.navigateToLogin()
    loginHelper.login('user1@realestate.com', 'Password123!')
    WebUI.delay(2)
    sellHelper.navigateToSellPage()
    WebUI.delay(2)
    
    // Verify listing type dropdown exists and select Sale
    WebUI.verifyElementPresent(findTestObject('Object Repository/PropertyService/SellPage/listingTypeSelect'), 10)
    WebUI.selectOptionByValue(findTestObject('Object Repository/PropertyService/SellPage/listingTypeSelect'), 'sale', false)
    WebUI.delay(1)
    
    WebUI.comment('✅ TC_PROP_020 PASSED: Sale listing type selected')
} catch (Exception e) {
    WebUI.comment('❌ TC_PROP_020 FAILED: ' + e.getMessage())
    throw e
} finally {
    WebUI.closeBrowser()
}
