import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import com.kms.katalon.core.model.FailureHandling
import developerproperties.DeveloperProperties_Keywords as DevPropKeywords
import authentication.Login_Keywords as LoginKeywords
import authentication.Register_Keywords as RegisterKeywords

/**
 * Test Case: TC_DEVPROP_010 - Check Developer Count After Signup
 * 
 * Description: Verify that developer count increases after a new developer signs up
 * Prerequisites: System must have developer management functionality
 * Flow: get initial dev count -> signup new developer -> verify count increased
 */

WebUI.openBrowser('')
DevPropKeywords devPropHelper = new DevPropKeywords()
LoginKeywords loginHelper = new LoginKeywords()
RegisterKeywords registerHelper = new RegisterKeywords()

try {
	// Arrange: Login as admin or get initial developer count
	loginHelper.navigateToLogin()
	loginHelper.loginAsDeveloper(2) // Login as existing developer first
	loginHelper.verifyLoginSuccess()

	// Navigate to developers list/page if available
	devPropHelper.navigateToDevelopers()
	WebUI.delay(1)

	// Get initial developer count
	def initialDeveloperCount = devPropHelper.getDevelopersCount()
	WebUI.comment("ℹ️ Initial developer count: ${initialDeveloperCount}")

	// Logout current developer
	loginHelper.logout()

	// Act: Register a new developer account
	def newDeveloperEmail = "developer_" + System.currentTimeMillis() + "@realestate.com"
	def newDeveloperPassword = "TestPassword123!"
	
	registerHelper.navigateToRegister()
	registerHelper.registerAsNewDeveloper(newDeveloperEmail, newDeveloperPassword)
	registerHelper.verifyRegistrationSuccess()
	WebUI.delay(2)

	// Assert: Login as existing developer again to check count
	loginHelper.navigateToLogin()
	loginHelper.loginAsDeveloper(1)
	loginHelper.verifyLoginSuccess()

	// Navigate to developers page
	devPropHelper.navigateToDevelopers()
	WebUI.delay(1)

	// Get final developer count
	def finalDeveloperCount = devPropHelper.getDevelopersCount()
	WebUI.comment("ℹ️ Final developer count: ${finalDeveloperCount}")

	// Verify count increased
	assert finalDeveloperCount == initialDeveloperCount + 1, "Developer count should increase by 1. Expected: ${initialDeveloperCount + 1}, Got: ${finalDeveloperCount}"

	WebUI.comment("✅ TC_DEVPROP_041 PASSED: Developer count increased from ${initialDeveloperCount} to ${finalDeveloperCount}")

} catch (Exception e) {
	WebUI.comment("❌ TC_DEVPROP_041 FAILED: " + e.getMessage())
	throw e
} finally {
	WebUI.closeBrowser()
}
