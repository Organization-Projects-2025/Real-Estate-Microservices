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
    
    // Fill step 1 and go to step 2
    sellHelper.fillBasicInfo('Test Property', 'Description', 'sale', 'residential', 'apartment')
    sellHelper.clickNextButton()
    WebUI.delay(1)
    
    // Go back to step 1
    sellHelper.clickBackButton()
    WebUI.delay(1)
    
    // Verify we're back on step 1 (title field should be visible)
    sellHelper.verifySellPageLoaded()
    
    WebUI.comment('✅ TC_PROP_019 PASSED: Form navigation works')
} catch (Exception e) {
    WebUI.comment('❌ TC_PROP_019 FAILED: ' + e.getMessage())
    throw e
} finally {
    WebUI.closeBrowser()
}
