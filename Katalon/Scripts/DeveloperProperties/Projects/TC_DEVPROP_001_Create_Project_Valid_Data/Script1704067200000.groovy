import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import developerproperties.DeveloperProperties_Keywords as DevPropKeywords
import authentication.Login_Keywords as LoginKeywords

/**
 * Test Case: TC_DEVPROP_001 - Create Project with Valid Data
 * Flow: login as developer -> go to My Projects -> create project -> verify created.
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
    def projectName = "Create Flow Project " + System.currentTimeMillis()
    devPropHelper.createProject(projectName, "Project created for create test", "Create City")
    devPropHelper.verifyProjectCreationSuccess(projectName)

    WebUI.comment("✅ TC_DEVPROP_001 PASSED: Project '${projectName}' created successfully")
} catch (Exception e) {
    WebUI.comment("❌ TC_DEVPROP_001 FAILED: " + e.getMessage())
    throw e
} finally {
    WebUI.closeBrowser()
}