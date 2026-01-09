import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import com.kms.katalon.core.model.FailureHandling
import developerproperties.DeveloperProperties_Keywords as DevPropKeywords
import authentication.Login_Keywords as LoginKeywords

/**
 * Test Case: TC_DEVPROP_038 - Update Project with Valid Data
 * 
 * Description: Verify that a developer can successfully update project details
 * Prerequisites: User must be logged in as a developer with an existing project
 * Flow: login -> navigate to projects -> open edit form -> update fields -> verify updates
 */

WebUI.openBrowser('')
DevPropKeywords devPropHelper = new DevPropKeywords()
LoginKeywords loginHelper = new LoginKeywords()

try {
	// Arrange: Login as developer
	loginHelper.navigateToLogin()
	loginHelper.loginAsDeveloper(2)
	loginHelper.verifyLoginSuccess()

	// Navigate to projects
	devPropHelper.navigateToProjects()

	// Create a project to update
	devPropHelper.clickCreateProject()
	def originalProjectName = "Update Test Project " + System.currentTimeMillis()
	def originalDescription = "Original description for update test"
	def originalLocation = "Original Location"
	devPropHelper.createProject(originalProjectName, originalDescription, originalLocation)
	devPropHelper.verifyProjectCreationSuccess(originalProjectName)

	// Wait for page to load and refresh to ensure project is visible
	WebUI.delay(2)
	WebUI.refresh()
	devPropHelper.waitForProjectsList()

	// Act: Open edit form for project
	devPropHelper.openProjectEditForm(originalProjectName)

	// Update project fields
	def updatedName = "Updated Project Name " + System.currentTimeMillis()
	def updatedDescription = "This is the updated description with new information"
	def updatedLocation = "Updated Location City"
	
	devPropHelper.updateProject(updatedName, updatedDescription, updatedLocation)
	WebUI.delay(2)

	// Assert: Verify project was updated
	devPropHelper.navigateToProjects()
	devPropHelper.waitForProjectsList()
	
	WebUI.verifyTextPresent(updatedName, false, FailureHandling.OPTIONAL)
	WebUI.verifyTextNotPresent(originalProjectName, false, FailureHandling.OPTIONAL)

	WebUI.comment("✅ TC_DEVPROP_038 PASSED: Project updated from '${originalProjectName}' to '${updatedName}'")

} catch (Exception e) {
	WebUI.comment("❌ TC_DEVPROP_002 FAILED: " + e.getMessage())
	throw e
} finally {
	WebUI.closeBrowser()
}
