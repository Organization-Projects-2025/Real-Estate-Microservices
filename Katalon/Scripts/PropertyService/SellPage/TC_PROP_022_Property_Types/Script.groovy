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
    
    // Verify property type dropdown exists
    WebUI.verifyElementPresent(findTestObject('Object Repository/PropertyService/SellPage/propertyTypeSelect'), 10)
    
    // Select Residential
    WebUI.selectOptionByValue(findTestObject('Object Repository/PropertyService/SellPage/propertyTypeSelect'), 'residential', false)
    WebUI.delay(1)
    
    // Select Commercial
    WebUI.selectOptionByValue(findTestObject('Object Repository/PropertyService/SellPage/propertyTypeSelect'), 'commercial', false)
    WebUI.delay(1)
    
    WebUI.comment('✅ TC_PROP_022 PASSED: Property type selection available')
} catch (Exception e) {
    WebUI.comment('❌ TC_PROP_022 FAILED: ' + e.getMessage())
    throw e
} finally {
    WebUI.closeBrowser()
}
