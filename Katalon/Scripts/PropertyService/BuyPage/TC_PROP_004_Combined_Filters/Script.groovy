import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import propertyservice.Properties_Keywords as PropertiesKeywords

PropertiesKeywords propsHelper = new PropertiesKeywords()

try {
    WebUI.openBrowser('')
    propsHelper.navigateToBuyPage()
    propsHelper.waitForPropertiesToLoad()
    propsHelper.openFilterPanel()
    propsHelper.verifyFilterPanelOpen()
    propsHelper.selectBedrooms('2+')
    WebUI.delay(1)
    propsHelper.togglePoolFilter()
    WebUI.delay(2)
    WebUI.comment('✅ TC_PROP_004 PASSED: Combined filters applied')
} catch (Exception e) {
    WebUI.comment('❌ TC_PROP_004 FAILED: ' + e.getMessage())
    throw e
} finally {
    WebUI.closeBrowser()
}
