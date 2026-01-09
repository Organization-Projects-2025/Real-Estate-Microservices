import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import com.kms.katalon.core.model.FailureHandling
import developerproperties.DeveloperProperties_Keywords as DevPropKeywords
import authentication.Login_Keywords as LoginKeywords

/**
 * Test Case: TC_DEVPROP_043 - View Project Details Page
 * 
 * Description: Verify that project details page can be viewed by opening a project
 * Prerequisites: Projects must exist in developer-properties
 * Flow: login -> navigate to developer projects -> open specific project -> verify project details visible
 */

WebUI.openBrowser('')
DevPropKeywords devPropHelper = new DevPropKeywords()
LoginKeywords loginHelper = new LoginKeywords()

try {
	// Arrange: Login as developer
	loginHelper.navigateToLogin()
	loginHelper.loginAsDeveloper(2)
	loginHelper.verifyLoginSuccess()

	// Navigate to developer projects (New Projects page)
	devPropHelper.navigateToDeveloperProjects()

	// Act: Open a project by name (using existing project)
	devPropHelper.openProjectCardByName('Jocelyn Fisher')
	WebUI.waitForPageLoad(10)
	WebUI.delay(2)

	// Assert: Verify project details are displayed on the page
	WebUI.verifyTextPresent('Jocelyn Fisher', false, FailureHandling.STOP_ON_FAILURE)

	WebUI.comment("✅ TC_DEVPROP_043 PASSED: Project details page opened and project information displayed")

} catch (Exception e) {
	WebUI.comment("❌ TC_DEVPROP_043 FAILED: " + e.getMessage())
	throw e
} finally {
	WebUI.closeBrowser()
}
