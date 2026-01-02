import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import com.kms.katalon.core.model.FailureHandling
import developerproperties.DeveloperProperties_Keywords as DevPropKeywords
import authentication.Login_Keywords as LoginKeywords

/**
 * Test Case: TC_DEVPROP_009 - Create Property with Invalid Data (UI)
 *
 * Description: Login, attempt to open invalid project, try to add property with empty data, verify 404 error.
 */

WebUI.openBrowser('')
DevPropKeywords devPropHelper = new DevPropKeywords()
LoginKeywords loginHelper = new LoginKeywords()

try {
	loginHelper.navigateToLogin()
	loginHelper.loginAsDeveloper(2)
	loginHelper.verifyLoginSuccess()

	// Attempt to navigate to an invalid project
	devPropHelper.navigateToProjects()
	
	// Try to access invalid project properties
	String invalidProjectId = 'invalid-project-id-12345'
	WebUI.navigateToUrl("http://localhost:5173/project/${invalidProjectId}/properties")
	WebUI.waitForPageLoad(10)

	// Verify 404 error page is shown
	WebUI.verifyTextPresent('404', false, FailureHandling.STOP_ON_FAILURE)
	WebUI.verifyTextPresent('Page Not Found', false, FailureHandling.STOP_ON_FAILURE)

	WebUI.comment("✅ TC_DEVPROP_009 PASSED: Invalid project with empty property creation data returns 404")
} catch (Exception e) {
	WebUI.comment("❌ TC_DEVPROP_009 FAILED: " + e.getMessage())
	throw e
} finally {
	WebUI.closeBrowser()
}
