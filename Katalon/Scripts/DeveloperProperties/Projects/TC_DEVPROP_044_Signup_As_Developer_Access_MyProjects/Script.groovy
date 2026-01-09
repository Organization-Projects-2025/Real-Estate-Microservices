import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import com.kms.katalon.core.model.FailureHandling
import authentication.Register_Keywords as RegisterKeywords
import developerproperties.DeveloperProperties_Keywords as DevPropKeywords

/**
 * Test Case: TC_DEVPROP_044 - Signup As Developer and Access My Projects
 * 
 * Description: Verify new developer can successfully signup with valid data and access My Projects page
 * Prerequisites: None - This is a signup test
 * Flow: signup as developer -> verify registration success -> navigate to my-projects -> verify page loads
 */

WebUI.openBrowser('')
RegisterKeywords registerHelper = new RegisterKeywords()
DevPropKeywords devPropHelper = new DevPropKeywords()

try {
	// Arrange: Generate unique developer data
	String uniqueEmail = registerHelper.generateUniqueEmail('newdev')
	String firstName = 'Test'
	String lastName = 'Developer'
	String password = 'SecurePass123!'
	
	// Act: Register as developer
	registerHelper.registerAsDeveloper(firstName, lastName, uniqueEmail, password)
	registerHelper.verifyRegistrationSuccess()
	
	WebUI.comment("✅ Developer registered successfully: ${uniqueEmail}")
	WebUI.delay(2)
	
	// Act: Navigate to My Projects page
	devPropHelper.navigateToProjects()
	WebUI.waitForPageLoad(10)
	WebUI.delay(2)
	
	// Assert: Verify My Projects page loaded successfully
	String currentUrl = WebUI.getUrl()
	assert currentUrl.contains('/my-projects'), 
		"Failed to navigate to My Projects. Current URL: ${currentUrl}"
	
	WebUI.comment("✅ My Projects page loaded successfully at: ${currentUrl}")
	
	WebUI.comment("✅ TC_DEVPROP_044 PASSED: Developer signup successful and My Projects page accessible")

} catch (Exception e) {
	WebUI.comment("❌ TC_DEVPROP_044 FAILED: " + e.getMessage())
	throw e
} finally {
	WebUI.closeBrowser()
}
