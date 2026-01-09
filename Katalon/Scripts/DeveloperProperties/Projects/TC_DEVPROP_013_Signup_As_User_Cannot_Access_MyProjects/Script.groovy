import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import com.kms.katalon.core.model.FailureHandling
import authentication.Register_Keywords as RegisterKeywords
import developerproperties.DeveloperProperties_Keywords as DevPropHelper

/**
 * Test Case: TC_DEVPROP_013 - Signup As User and Try to Access My Projects
 * 
 * Description: Verify regular user signup cannot access My Projects page (developer-only feature)
 * This is a NEGATIVE test case - it SHOULD FAIL when trying to access /my-projects as a regular user
 * Prerequisites: None - This is a signup test
 * Flow: signup as user -> verify registration success -> try to navigate to my-projects -> should fail or redirect
 */

WebUI.openBrowser('')
RegisterKeywords registerHelper = new RegisterKeywords()
DevPropHelper devPropHelper = new DevPropHelper()

try {
	// Arrange: Generate unique user data
	String uniqueEmail = registerHelper.generateUniqueEmail('newuser')
	String firstName = 'Test'
	String lastName = 'User'
	String password = 'SecurePass123!'
	
	// Act: Register as USER (not developer)
	registerHelper.registerAsUser(firstName, lastName, uniqueEmail, password)
	registerHelper.verifyRegistrationSuccess()
	
	WebUI.comment("✅ User registered successfully: ${uniqueEmail}")
	WebUI.delay(2)
	
	// Act: Try to navigate to My Projects page (developer-only feature)
	devPropHelper.navigateToProjects()
	WebUI.waitForPageLoad(10)
	WebUI.delay(2)
	
	String currentUrl = WebUI.getUrl()
	WebUI.comment("Current URL after navigation attempt: ${currentUrl}")
	
	// Assert: Verify user is NOT on /my-projects page (should be redirected or access denied)
	if (currentUrl.contains('/my-projects')) {
		// If we got to my-projects, that's a SECURITY FAILURE - users shouldn't have access
		WebUI.comment("❌ SECURITY ISSUE: Regular user can access My Projects page!")
		WebUI.comment("❌ Current URL: ${currentUrl}")
		throw new AssertionError("FAILED: Regular user should NOT be able to access /my-projects page. This is a security issue!")
	} else {
		// If we're redirected elsewhere, that's expected behavior
		WebUI.comment("✅ User correctly redirected away from My Projects")
		WebUI.comment("Redirected to: ${currentUrl}")
	}
	
	WebUI.comment("✅ TC_DEVPROP_013 PASSED: User signup successful but cannot access developer-only My Projects feature")

} catch (Exception e) {
	WebUI.comment("❌ TC_DEVPROP_013 FAILED: " + e.getMessage())
	throw e
} finally {
	WebUI.closeBrowser()
}
