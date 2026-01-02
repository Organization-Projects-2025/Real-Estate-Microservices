import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import com.kms.katalon.core.model.FailureHandling
import developerproperties.DeveloperProperties_Keywords as DevPropKeywords
import authentication.Login_Keywords as LoginKeywords

/**
 * Test Case: TC_DEVPROP_008 - Create Property with Valid Data (UI)
 *
 * Description: Login, open existing project "Test Project 1767315782170", add a new property, and verify it is visible.
 */

WebUI.openBrowser('')
DevPropKeywords devPropHelper = new DevPropKeywords()
LoginKeywords loginHelper = new LoginKeywords()

try {
    loginHelper.navigateToLogin()
    loginHelper.loginAsDeveloper(2)
    loginHelper.verifyLoginSuccess()

    // Navigate to My Projects and open the target project
    devPropHelper.navigateToProjects()
    devPropHelper.openPropertiesForProject('Test Project 1767315782170')

    // Add a property inside that project
    devPropHelper.clickAddProperty()
    def propertyData = [
        title      : "UI Property ${System.currentTimeMillis()}",
        description: 'Created via TC_DEVPROP_008',
        price      : '450000',
        city       : 'Austin',
        state      : 'TX',
        bedrooms   : '3'
    ]
    devPropHelper.fillAndSubmitPropertyForm(propertyData)
    devPropHelper.verifyPropertyVisible(propertyData.title)

    WebUI.comment("✅ TC_DEVPROP_008 PASSED: Added property '${propertyData.title}' to project 'Test Project 1767315782170'")
} catch (Exception e) {
    WebUI.comment("❌ TC_DEVPROP_008 FAILED: " + e.getMessage())
    throw e
} finally {
    WebUI.closeBrowser()
}