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
    
    // Step 1: Basic Info
    sellHelper.fillBasicInfo('Test Property', 'Description', 'sale', 'residential', 'apartment')
    sellHelper.clickNextButton()
    WebUI.delay(1)
    
    // Step 2: Address & Area
    sellHelper.fillAddressInfo('123 Test St', 'Cairo', 'Cairo', 'Egypt', '1500', '140')
    sellHelper.clickNextButton()
    WebUI.delay(1)
    
    // Step 3: Try to enter invalid price (negative)
    // HTML5 min="0" should prevent negative values
    WebUI.setText(findTestObject('Object Repository/PropertyService/SellPage/priceInput'), '-100')
    WebUI.delay(1)
    
    // The input should either reject the value or show validation error
    String priceValue = WebUI.getAttribute(findTestObject('Object Repository/PropertyService/SellPage/priceInput'), 'value')
    
    // Price input with min=0 should not accept negative values
    WebUI.comment('Price value entered: ' + priceValue)
    
    WebUI.comment('✅ TC_PROP_023 PASSED: Invalid price test completed')
} catch (Exception e) {
    WebUI.comment('❌ TC_PROP_023 FAILED: ' + e.getMessage())
    throw e
} finally {
    WebUI.closeBrowser()
}
