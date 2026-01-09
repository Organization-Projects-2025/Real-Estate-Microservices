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
 * Test Case: TC_DEVPROP_009 - Create Project and Check Active Count
 * 
 * Description: Verify that project active count increases after creating a new project
 * Prerequisites: User must be logged in as a developer
 * Flow: login -> get initial count -> create project -> verify count increased
 */

WebUI.openBrowser('')
DevPropKeywords devPropHelper = new DevPropKeywords()
LoginKeywords loginHelper = new LoginKeywords()

try {
	// Arrange: Login as developer
	loginHelper.navigateToLogin()
	loginHelper.loginAsDeveloper(2)
	loginHelper.verifyLoginSuccess()

	// Navigate to projects page
	devPropHelper.navigateToProjects()
	WebUI.delay(1)

	// Get initial project count
	def initialCount = devPropHelper.getProjectsCount()
	WebUI.comment("ℹ️ Initial project count: ${initialCount}")

	// Act: Create a new project
	devPropHelper.clickCreateProject()
	def projectName = "Active Count Test Project " + System.currentTimeMillis()
	def projectDescription = "Project to test active count"
	def projectLocation = "Count Test Location"
	
	devPropHelper.createProject(projectName, projectDescription, projectLocation)
	devPropHelper.verifyProjectCreationSuccess(projectName)
	WebUI.delay(2)

	// Refresh page to ensure new count is loaded
	WebUI.refresh()
	devPropHelper.waitForProjectsList()
	WebUI.delay(1)

	// Assert: Get final project count and verify it increased
	def finalCount = devPropHelper.getProjectsCount()
	WebUI.comment("ℹ️ Final project count: ${finalCount}")
	
	assert finalCount == initialCount + 1, "Project count should increase by 1. Expected: ${initialCount + 1}, Got: ${finalCount}"
	WebUI.verifyTextPresent(projectName, false, FailureHandling.OPTIONAL)

	WebUI.comment("✅ TC_DEVPROP_040 PASSED: Active project count increased from ${initialCount} to ${finalCount}")

} catch (Exception e) {
	WebUI.comment("❌ TC_DEVPROP_040 FAILED: " + e.getMessage())
	throw e
} finally {
	WebUI.closeBrowser()
}
