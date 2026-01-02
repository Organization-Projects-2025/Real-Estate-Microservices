import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import developerproperties.DeveloperProperties_Keywords as DevPropKeywords
import authentication.Login_Keywords as LoginKeywords

/**
 * Test Case: TC_DEVPROP_007 - Delete Project with Valid Id (UI)
 * Flow: login as developer -> go to My Projects -> create project -> open its properties -> add a property -> return -> delete the project -> verify removed.
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

	// Ensure form is open via keyword
	devPropHelper.clickCreateProject()

	// Create project
	def projectName = "Delete Flow Project " + System.currentTimeMillis()
	devPropHelper.createProject(projectName, "Project created for delete test", "Delete City")
	devPropHelper.verifyProjectCreationSuccess(projectName)

	// Open properties for this project and add a property
	devPropHelper.openPropertiesForProject(projectName)
	devPropHelper.clickAddProperty()
	def propertyData = [
		title      : "DeleteFlow Property ${System.currentTimeMillis()}",
		description: "Property created before delete",
		price      : '123456',
		city       : 'Delete City',
		state      : 'Delete State',
		bedrooms   : '2'
	]
	devPropHelper.fillAndSubmitPropertyForm(propertyData)
	devPropHelper.verifyPropertyVisible(propertyData.title)

	// Return to My Projects
	devPropHelper.navigateToProjects()

	// Delete the project
	devPropHelper.deleteProject(projectName)
	WebUI.comment("✅ TC_DEVPROP_007 PASSED: Project '${projectName}' created, property added, and project deleted")
} catch (Exception e) {
	WebUI.comment("❌ TC_DEVPROP_007 FAILED: " + e.getMessage())
	throw e
} finally {
	WebUI.closeBrowser()
}

