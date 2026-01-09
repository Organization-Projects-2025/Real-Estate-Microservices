import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import propertyservice.Properties_Keywords as PropertiesKeywords

PropertiesKeywords propsHelper = new PropertiesKeywords()

try {
    WebUI.openBrowser('')
    propsHelper.navigateToBuyPage()
    propsHelper.waitForPropertiesToLoad()
    propsHelper.searchProperties('Cairo')
    WebUI.delay(2)
    WebUI.comment('✅ TC_PROP_008 PASSED: Search by city works')
} catch (Exception e) {
    WebUI.comment('❌ TC_PROP_008 FAILED: ' + e.getMessage())
    throw e
} finally {
    WebUI.closeBrowser()
}
