import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import propertyservice.Properties_Keywords as PropertiesKeywords

PropertiesKeywords propsHelper = new PropertiesKeywords()

try {
    WebUI.openBrowser('')
    propsHelper.navigateToRentPage()
    propsHelper.waitForPropertiesToLoad()
    propsHelper.searchProperties('apartment')
    WebUI.delay(2)
    WebUI.comment('✅ TC_PROP_012 PASSED: Search works on Rent page')
} catch (Exception e) {
    WebUI.comment('❌ TC_PROP_012 FAILED: ' + e.getMessage())
    throw e
} finally {
    WebUI.closeBrowser()
}
