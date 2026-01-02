import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import com.kms.katalon.core.model.FailureHandling
import developerproperties.DeveloperProperties_Keywords as DevPropKeywords
import authentication.Login_Keywords as LoginKeywords

/**
 * Test Case: TC_DEVPROP_001 - Create Project with Valid Data
 * 
 * Description: Verify that a developer can successfully create a new project through the UI
 * Prerequisites: User must be logged in as a developer
 * Test Data: Test project with valid data
 */

// Initialize
WebUI.openBrowser('')
DevPropKeywords devPropHelper = new DevPropKeywords()
LoginKeywords loginHelper = new LoginKeywords()

try {
    // Arrange: Login as developer first
    loginHelper.navigateToLogin()
    loginHelper.loginAsDeveloper(2) // Login as developer1@realestate.com
    loginHelper.verifyLoginSuccess()
    
    // Navigate to projects page
    devPropHelper.navigateToProjects()

    // Open create project form via keyword (handles CTA/Add)
    devPropHelper.clickCreateProject()
    
    // Get initial project count
    def initialCount = devPropHelper.getProjectsCount()
    
    // Act: Create a new project
    def projectName = "Test Project " + System.currentTimeMillis()
    devPropHelper.createProject(projectName, "Automated test project", "Test Location")
    
    // Assert: Verify project creation was successful
    devPropHelper.verifyProjectCreationSuccess(projectName)
    WebUI.verifyTextPresent(projectName, false, FailureHandling.OPTIONAL)
    
    // Verify project count increased
    def finalCount = devPropHelper.getProjectsCount()
    assert finalCount == initialCount + 1, "Project count should increase by 1"
    
    WebUI.comment("✅ TC_DEVPROP_001 PASSED: Project '${projectName}' created successfully")
    
} catch (Exception e) {
    WebUI.comment("❌ TC_DEVPROP_001 FAILED: " + e.getMessage())
    throw e
    
} finally {
    // Cleanup
    WebUI.closeBrowser()
}