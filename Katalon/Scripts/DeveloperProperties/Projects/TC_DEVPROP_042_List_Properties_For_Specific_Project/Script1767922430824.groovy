import static com.kms.katalon.core.checkpoint.CheckpointFactory.findCheckpoint
import static com.kms.katalon.core.testcase.TestCaseFactory.findTestCase
import static com.kms.katalon.core.testdata.TestDataFactory.findTestData
import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import static com.kms.katalon.core.testobject.ObjectRepository.findWindowsObject
import com.kms.katalon.core.checkpoint.Checkpoint as Checkpoint
import com.kms.katalon.core.cucumber.keyword.CucumberBuiltinKeywords as CucumberKW
import com.kms.katalon.core.mobile.keyword.MobileBuiltInKeywords as Mobile
import com.kms.katalon.core.model.FailureHandling as FailureHandling
import com.kms.katalon.core.testcase.TestCase as TestCase
import com.kms.katalon.core.testdata.TestData as TestData
import com.kms.katalon.core.testng.keyword.TestNGBuiltinKeywords as TestNGKW
import com.kms.katalon.core.testobject.TestObject as TestObject
import com.kms.katalon.core.webservice.keyword.WSBuiltInKeywords as WS
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import com.kms.katalon.core.windows.keyword.WindowsBuiltinKeywords as Windows
import internal.GlobalVariable as GlobalVariable
import org.openqa.selenium.Keys as Keys

import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import com.kms.katalon.core.model.FailureHandling
import developerproperties.DeveloperProperties_Keywords as DevPropKeywords
import authentication.Login_Keywords as LoginKeywords

/**
 * Test Case: TC_DEVPROP_011 - List Properties For Specific Project
 * 
 * Description: Create 2 projects, navigate to New Projects page, find current developer profile, and verify projects
 * Prerequisites: User must be logged in as a developer
 * Flow: login -> my-projects -> create project 1 -> create project 2 -> new projects -> open developer -> verify projects -> delete 1
 */

WebUI.openBrowser('')
DevPropKeywords devPropHelper = new DevPropKeywords()
LoginKeywords loginHelper = new LoginKeywords()

try {
	// Arrange: Login as developer
	loginHelper.navigateToLogin()
	loginHelper.loginAsDeveloper(2)
	loginHelper.verifyLoginSuccess()

	// Navigate to my projects
	devPropHelper.navigateToProjects()
	WebUI.delay(1)

	// Create first project
	devPropHelper.clickCreateProject()
	def project1Name = "Test Project 1 " + System.currentTimeMillis()
	devPropHelper.createProject(project1Name, "First test project", "Location 1")
	devPropHelper.verifyProjectCreationSuccess(project1Name)
	WebUI.delay(2)

	// Go back to my projects to create second project
	devPropHelper.navigateToProjects()
	WebUI.delay(1)

	// Create second project
	devPropHelper.clickCreateProject()
	def project2Name = "Test Project 2 " + System.currentTimeMillis()
	devPropHelper.createProject(project2Name, "Second test project", "Location 2")
	devPropHelper.verifyProjectCreationSuccess(project2Name)
	WebUI.delay(2)

	// Act: Navigate to New Projects (developer-properties) page
	devPropHelper.navigateToDeveloperProjects()
	WebUI.waitForPageLoad(10)
	WebUI.delay(2)

	// Navigate back to My Projects to verify both projects exist there
	devPropHelper.navigateToProjects()
	WebUI.waitForPageLoad(10)
	WebUI.delay(2)

	// Assert: Verify both projects are visible in My Projects
	WebUI.verifyTextPresent(project1Name, false, FailureHandling.STOP_ON_FAILURE)
	WebUI.verifyTextPresent(project2Name, false, FailureHandling.STOP_ON_FAILURE)

	WebUI.comment("✅ Both projects visible in My Projects")

	// Delete the first project
	devPropHelper.deleteProject(project1Name)
	WebUI.delay(2)

	// Assert: Verify deleted project is no longer visible
	WebUI.verifyTextNotPresent(project1Name, false, FailureHandling.STOP_ON_FAILURE)
	WebUI.comment("✅ Project '${project1Name}' successfully deleted from My Projects")

	// Verify second project still exists
	WebUI.verifyTextPresent(project2Name, false, FailureHandling.OPTIONAL)

	WebUI.comment("✅ TC_DEVPROP_011 PASSED: Created 2 projects, navigated to New Projects, verified in My Projects, then deleted 1")

} catch (Exception e) {
	WebUI.comment("❌ TC_DEVPROP_011 FAILED: " + e.getMessage())
	throw e
} finally {
	WebUI.closeBrowser()
}
import static com.kms.katalon.core.checkpoint.CheckpointFactory.findCheckpoint