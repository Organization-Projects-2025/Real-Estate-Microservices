import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import com.kms.katalon.core.model.FailureHandling
import authentication.Login_Keywords as LoginKeywords

/**
 * Test Case: TC_DEVPROP_005 - Get Project By Invalid Id (UI)
 * Description: Navigate to an invalid project URL and verify 404 page is shown.
 */

WebUI.openBrowser('')
LoginKeywords loginHelper = new LoginKeywords()

try {
	loginHelper.navigateToLogin()
	loginHelper.loginAsDeveloper(2)
	loginHelper.verifyLoginSuccess()

	// Navigate to invalid project URL
	String invalidId = 'invalid-id-404'
	WebUI.navigateToUrl("http://localhost:5173/project/${invalidId}/properties")
	WebUI.waitForPageLoad(10)

	// Verify 404 page content
	WebUI.verifyTextPresent('404', false, FailureHandling.STOP_ON_FAILURE)
	WebUI.verifyTextPresent('Page Not Found', false, FailureHandling.STOP_ON_FAILURE)
	WebUI.comment('✅ TC_DEVPROP_005 PASSED: Invalid project redirects to 404 page')
} catch (Exception e) {
	WebUI.comment('❌ TC_DEVPROP_005 FAILED: ' + e.message)
	throw e
} finally {
	WebUI.closeBrowser()
}

