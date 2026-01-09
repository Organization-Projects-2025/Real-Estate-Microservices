import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import propertyservice.Properties_Keywords as PropertiesKeywords

PropertiesKeywords propsHelper = new PropertiesKeywords()

try {
    WebUI.openBrowser('')
    propsHelper.navigateToRentPage()
    propsHelper.waitForPropertiesToLoad()
    propsHelper.verifyRentPageLoaded()
    propsHelper.verifyPropertyCardsDisplayed()
    WebUI.comment('✅ TC_PROP_011 PASSED: Rent page loads and displays properties')
} catch (Exception e) {
    WebUI.comment('❌ TC_PROP_011 FAILED: ' + e.getMessage())
    throw e
} finally {
    WebUI.closeBrowser()
}
