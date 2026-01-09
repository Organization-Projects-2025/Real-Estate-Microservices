import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import com.kms.katalon.core.model.FailureHandling
import developerproperties.DeveloperProperties_Keywords as DevPropKeywords
import authentication.Login_Keywords as LoginKeywords

/**
 * Test Case: TC_DEVPROP_016 - Delete Developer Property with Valid ID
 * 
 * Description: Verify that a developer can successfully delete a property from a project
 * Prerequisites: User must be logged in as a developer with existing properties
 * Flow: login -> navigate to projects -> open project properties -> delete property -> verify removed
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

	// Create a test project to hold property
	def projectName = "Delete Property Test Project " + System.currentTimeMillis()
	devPropHelper.clickCreateProject()
	devPropHelper.createProject(projectName, "Project for property deletion test", "Test Location")
	devPropHelper.verifyProjectCreationSuccess(projectName)

	// Open properties for this project
	devPropHelper.openPropertiesForProject(projectName)

	// Add a property to delete
	devPropHelper.clickAddProperty()
	def propertyData = [
		title      : "Property To Delete ${System.currentTimeMillis()}",
		description: "This property will be deleted",
		price      : '500000',
		city       : 'Test City',
		state      : 'Test State',
		bedrooms   : '3'
	]
	devPropHelper.fillAndSubmitPropertyForm(propertyData)
	devPropHelper.verifyPropertyVisible(propertyData.title)

	// Get initial property count
	def initialPropertyCount = devPropHelper.getPropertyCount()

	// Act: Delete the property
	devPropHelper.deleteProperty(propertyData.title)
	WebUI.delay(2)

	// Assert: Verify property was deleted
	def finalPropertyCount = devPropHelper.getPropertyCount()
	assert finalPropertyCount == initialPropertyCount - 1, "Property count should decrease by 1"
	WebUI.verifyTextNotPresent(propertyData.title, false, FailureHandling.OPTIONAL)

	WebUI.comment("✅ TC_DEVPROP_037 PASSED: Property '${propertyData.title}' deleted successfully")

} catch (Exception e) {
	WebUI.comment("❌ TC_DEVPROP_016 FAILED: " + e.getMessage())
	throw e
} finally {
	WebUI.closeBrowser()
}
