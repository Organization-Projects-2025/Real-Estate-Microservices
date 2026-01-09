import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import propertyservice.Sell_Keywords as SellKeywords

SellKeywords sellHelper = new SellKeywords()

try {
    WebUI.openBrowser('')
    sellHelper.navigateToSellPage()
    
    // When not logged in, Sell page shows "Please Log In" message
    WebUI.verifyTextPresent('Please Log In', false)
    WebUI.verifyTextPresent('You must be logged in to list a property', false)
    
    WebUI.comment('✅ TC_PROP_016 PASSED: Sell page requires login')
} catch (Exception e) {
    WebUI.comment('❌ TC_PROP_016 FAILED: ' + e.getMessage())
    throw e
} finally {
    WebUI.closeBrowser()
}
