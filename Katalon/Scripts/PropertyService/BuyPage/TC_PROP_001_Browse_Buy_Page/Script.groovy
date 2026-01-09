import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import propertyservice.Properties_Keywords as PropertiesKeywords

PropertiesKeywords propsHelper = new PropertiesKeywords()

try {
    WebUI.openBrowser('')
    propsHelper.navigateToBuyPage()
    propsHelper.waitForPropertiesToLoad()
    propsHelper.verifyBuyPageLoaded()
    propsHelper.verifyPropertyCardsDisplayed()
    WebUI.comment('✅ TC_PROP_001 PASSED: Buy page loads and displays properties')
} catch (Exception e) {
    WebUI.comment('❌ TC_PROP_001 FAILED: ' + e.getMessage())
    throw e
} finally {
    WebUI.closeBrowser()
}
