import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import developerproperties.DeveloperProperties_Keywords as DevPropKeywords
import authentication.Login_Keywords as LoginKeywords

/**
 * Test Case: TC_DEVPROP_004 - Get Project By Valid Id (UI)
 *
 * Description: Navigate to a project's properties page using its ID and verify it loads.
 */

WebUI.openBrowser('')
DevPropKeywords devPropHelper = new DevPropKeywords()
LoginKeywords loginHelper = new LoginKeywords()

try {
	loginHelper.navigateToLogin()
	loginHelper.loginAsDeveloper(2)
	loginHelper.verifyLoginSuccess()

	devPropHelper.navigateToProjectProperties(project_id)
	WebUI.comment("✅ TC_DEVPROP_004 PASSED: Properties page loaded for project ${project_id}")
} catch (Exception e) {
	WebUI.comment("❌ TC_DEVPROP_004 FAILED: " + e.getMessage())
	throw e
} finally {
	WebUI.closeBrowser()
}

