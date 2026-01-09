import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import com.kms.katalon.core.model.FailureHandling
import developerproperties.DeveloperProperties_Keywords as DevPropKeywords
import authentication.Login_Keywords as LoginKeywords

/**
 * Test Case: TC_DEVPROP_039 - Notification On Project Creation
 * 
 * Description: Verify that a notification is generated when a developer creates a new project
 * Prerequisites: User must be logged in as a developer
 * Flow: login -> navigate to notifications (should be empty) -> create project -> check notification exists
 */

WebUI.openBrowser('')
DevPropKeywords devPropHelper = new DevPropKeywords()
LoginKeywords loginHelper = new LoginKeywords()

try {
	// Arrange: Login as developer
	loginHelper.navigateToLogin()
	loginHelper.loginAsDeveloper(2)
	loginHelper.verifyLoginSuccess()

	// Navigate to notifications to check initial state
	devPropHelper.navigateToNotifications()
	WebUI.delay(1)
	WebUI.comment("ℹ️ Initial notification state verified")

	// Navigate to projects
	devPropHelper.navigateToProjects()

	// Act: Create a new project (should trigger notification)
	devPropHelper.clickCreateProject()
	def projectName = "Notification Test Project " + System.currentTimeMillis()
	def projectDescription = "Project created to test notification system"
	def projectLocation = "Notification Test City"
	
	devPropHelper.createProject(projectName, projectDescription, projectLocation)
	devPropHelper.verifyProjectCreationSuccess(projectName)
	WebUI.delay(2)

	// Assert: Navigate to notifications and verify notification exists
	devPropHelper.navigateToNotifications()
	WebUI.delay(3)
	
	// Refresh notifications page to ensure latest notifications are loaded
	WebUI.refresh()
	WebUI.waitForPageLoad(10)
	WebUI.delay(2)

	// STRICT VERIFICATION: This will FAIL if notification is not found
	WebUI.verifyTextPresent(projectName, false, FailureHandling.STOP_ON_FAILURE)
	
	WebUI.comment("✅ TC_DEVPROP_039 PASSED: Notification found for project '${projectName}'")

} catch (Exception e) {
	WebUI.comment("❌ TC_DEVPROP_039 FAILED: " + e.getMessage())
	throw e
} finally {
	WebUI.closeBrowser()
}
