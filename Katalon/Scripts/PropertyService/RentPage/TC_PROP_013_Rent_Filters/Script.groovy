import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import propertyservice.Properties_Keywords as PropertiesKeywords

PropertiesKeywords propsHelper = new PropertiesKeywords()

try {
    WebUI.openBrowser('')
    propsHelper.navigateToRentPage()
    propsHelper.waitForPropertiesToLoad()
    propsHelper.openFilterPanel()
    propsHelper.verifyFilterPanelOpen()
    propsHelper.selectBedrooms('2+')
    WebUI.delay(2)
    WebUI.comment('✅ TC_PROP_013 PASSED: Filters work on Rent page')
} catch (Exception e) {
    WebUI.comment('❌ TC_PROP_013 FAILED: ' + e.getMessage())
    throw e
} finally {
    WebUI.closeBrowser()
}
