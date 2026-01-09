import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import propertyservice.Properties_Keywords as PropertiesKeywords

PropertiesKeywords propsHelper = new PropertiesKeywords()

try {
    WebUI.openBrowser('')
    propsHelper.navigateToBuyPage()
    propsHelper.waitForPropertiesToLoad()
    propsHelper.openFilterPanel()
    propsHelper.selectBedrooms('3+')
    WebUI.delay(1)
    propsHelper.clearAllFilters()
    WebUI.delay(1)
    propsHelper.verifyPropertyCardsDisplayed()
    WebUI.comment('✅ TC_PROP_005 PASSED: Clear filters works')
} catch (Exception e) {
    WebUI.comment('❌ TC_PROP_005 FAILED: ' + e.getMessage())
    throw e
} finally {
    WebUI.closeBrowser()
}
