import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import propertyservice.Properties_Keywords as PropertiesKeywords

PropertiesKeywords propsHelper = new PropertiesKeywords()

try {
    WebUI.openBrowser('')
    propsHelper.navigateToBuyPage()
    propsHelper.waitForPropertiesToLoad()
    propsHelper.openFilterPanel()
    propsHelper.selectPropertyType('house')
    WebUI.delay(2)
    WebUI.comment('✅ TC_PROP_010 PASSED: Filter by property type works')
} catch (Exception e) {
    WebUI.comment('❌ TC_PROP_010 FAILED: ' + e.getMessage())
    throw e
} finally {
    WebUI.closeBrowser()
}
