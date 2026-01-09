import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import propertyservice.Properties_Keywords as PropertiesKeywords

PropertiesKeywords propsHelper = new PropertiesKeywords()

try {
    WebUI.openBrowser('')
    propsHelper.navigateToBuyPage()
    propsHelper.waitForPropertiesToLoad()
    propsHelper.searchProperties('xyznonexistent12345')
    WebUI.delay(2)
    propsHelper.verifyNoPropertiesMessage()
    WebUI.comment('✅ TC_PROP_003 PASSED: No results message displayed')
} catch (Exception e) {
    WebUI.comment('❌ TC_PROP_003 FAILED: ' + e.getMessage())
    throw e
} finally {
    WebUI.closeBrowser()
}
