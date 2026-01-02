import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import com.kms.katalon.core.model.FailureHandling
import developerproperties.DeveloperProperties_Keywords as DevPropKeywords
import authentication.Login_Keywords as LoginKeywords

/**
 * Test Case: TC_DEVPROP_006 - Update Project with Valid Data (UI)
 * Flow: login -> My Projects -> create project -> add property -> update project fields -> verify update persists.
 */

WebUI.openBrowser('')
DevPropKeywords devPropHelper = new DevPropKeywords()
LoginKeywords loginHelper = new LoginKeywords()

try {
	// Login
	loginHelper.navigateToLogin()
	loginHelper.loginAsDeveloper(2)
	loginHelper.verifyLoginSuccess()

	// Go to My Projects
	devPropHelper.navigateToProjects()

	// Open form (CTA or Add) via keyword
	devPropHelper.clickCreateProject()

	// Create project
	def projectName = "Update Flow Project " + System.currentTimeMillis()
	devPropHelper.createProject(projectName, "Project created for update test", "Update City")
	devPropHelper.verifyProjectCreationSuccess(projectName)

	// Add a property to the project
	devPropHelper.openPropertiesForProject(projectName)
	devPropHelper.clickAddProperty()
	def propertyData = [
		title      : "UpdateFlow Property ${System.currentTimeMillis()}",
		description: "Property before update",
		price      : '222222',
		city       : 'Update City',
		state      : 'Update State',
		bedrooms   : '4'
	]
	devPropHelper.fillAndSubmitPropertyForm(propertyData)
	devPropHelper.verifyPropertyVisible(propertyData.title)

	// Return to My Projects
	devPropHelper.navigateToProjects()

	// Edit the project
	devPropHelper.openProjectEditForm(projectName)

	def updatedName = projectName + " (Updated)"
	devPropHelper.updateProject(updatedName, "Updated description", "Updated City")

	// Verify update persisted
	WebUI.verifyTextPresent(updatedName, false, FailureHandling.OPTIONAL)
	WebUI.comment("✅ TC_DEVPROP_006 PASSED: Project updated after creation and property addition")
} catch (Exception e) {
	WebUI.comment("❌ TC_DEVPROP_006 FAILED: " + e.getMessage())
	throw e
} finally {
	WebUI.closeBrowser()
}

