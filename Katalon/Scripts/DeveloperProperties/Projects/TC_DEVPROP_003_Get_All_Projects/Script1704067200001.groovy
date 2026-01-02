import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import developerproperties.DeveloperProperties_Keywords as DevPropKeywords
import authentication.Login_Keywords as LoginKeywords

/**
 * Test Case: TC_DEVPROP_003 - Get All Projects (UI)
 *
 * Description: Verify that the developer projects page loads and shows project cards
 */

WebUI.openBrowser('')
DevPropKeywords devPropHelper = new DevPropKeywords()
LoginKeywords loginHelper = new LoginKeywords()

try {
    loginHelper.navigateToLogin()
    loginHelper.loginAsDeveloper(2)
    loginHelper.verifyLoginSuccess()

    devPropHelper.navigateToProjects()
    def projectCount = devPropHelper.getProjectsCount()

    WebUI.comment("✅ TC_DEVPROP_003 PASSED: UI shows ${projectCount} project cards")
} catch (Exception e) {
    WebUI.comment("❌ TC_DEVPROP_003 FAILED: " + e.getMessage())
    throw e
} finally {
    WebUI.closeBrowser()
}