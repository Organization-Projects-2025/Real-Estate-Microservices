import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import com.kms.katalon.core.model.FailureHandling
import developerproperties.DeveloperProperties_Keywords as DevPropKeywords
import authentication.Login_Keywords as LoginKeywords

/**
 * Test Case: TC_DEVPROP_015 - Navigate to developer projects and open a specific property
 *
 * Description: From navbar -> New Projects, open project "Jocelyn Fisher" then open property "Doloribus et minima".
 */

WebUI.openBrowser('')
DevPropKeywords devPropHelper = new DevPropKeywords()
LoginKeywords loginHelper = new LoginKeywords()

try {
    loginHelper.navigateToLogin()
    loginHelper.loginAsDeveloper(2)
    loginHelper.verifyLoginSuccess()

    // Navigate via keyword to New Projects
    devPropHelper.navigateToDeveloperProjects()

    // Open project by name
    devPropHelper.openProjectCardByName('Jocelyn Fisher')

    // Open property by name inside that project
    devPropHelper.openPropertyCardByTitle('Doloribus et minima')

    WebUI.verifyTextPresent('Doloribus et minima', false, FailureHandling.OPTIONAL)
    WebUI.comment("✅ TC_DEVPROP_015 PASSED: Opened project 'Jocelyn Fisher' and property 'Doloribus et minima'")
} catch (Exception e) {
    WebUI.comment("❌ TC_DEVPROP_015 FAILED: " + e.getMessage())
    throw e
} finally {
    WebUI.closeBrowser()
}