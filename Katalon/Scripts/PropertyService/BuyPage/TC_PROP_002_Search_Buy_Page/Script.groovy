import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import propertyservice.Properties_Keywords as PropertiesKeywords

PropertiesKeywords propsHelper = new PropertiesKeywords()

try {
    WebUI.openBrowser('')
    propsHelper.navigateToBuyPage()
    propsHelper.waitForPropertiesToLoad()
    propsHelper.searchProperties('house')
    WebUI.delay(2)
    propsHelper.verifyPropertyCardsDisplayed()
    WebUI.comment('✅ TC_PROP_002 PASSED: Search works on Buy page')
} catch (Exception e) {
    WebUI.comment('❌ TC_PROP_002 FAILED: ' + e.getMessage())
    throw e
} finally {
    WebUI.closeBrowser()
}
