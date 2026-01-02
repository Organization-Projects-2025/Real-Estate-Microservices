import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import propertyservice.Sell_Keywords as SellKeywords

/**
 * Test Case: TC_PROP_001 - Sell Page Requires Login
 * 
 * Description: Verify that Sell page requires user to be logged in
 * Prerequisites: User must NOT be logged in
 */

WebUI.openBrowser('')
SellKeywords sellHelper = new SellKeywords()

try {
    // Navigate to sell page without logging in
    sellHelper.navigateToSellPage()
    
    // Verify login required message is displayed
    sellHelper.verifyLoginRequired()
    
    // Verify Go to Login button is present
    WebUI.verifyElementPresent(
        findTestObject('Object Repository/PropertyService/SellPage/goToLoginButton'),
        10
    )
    
    WebUI.comment('✅ TC_PROP_001 PASSED: Sell page correctly requires login')
    
} catch (Exception e) {
    WebUI.comment('❌ TC_PROP_001 FAILED: ' + e.getMessage())
    throw e
    
} finally {
    WebUI.closeBrowser()
}
