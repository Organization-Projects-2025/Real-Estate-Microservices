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
 * Test Case: TC_DEVPROP_007 - View Project Details Page
 * 
 * Description: Verify that project details page can be viewed by opening a project
 * Prerequisites: Projects must exist in developer-properties
 * Flow: login -> navigate to developer projects -> open specific project -> verify project details visible
 */

WebUI.openBrowser('')
DevPropKeywords devPropHelper = new DevPropKeywords()
LoginKeywords loginHelper = new LoginKeywords()

try {
	// Arrange: Login as developer
	loginHelper.navigateToLogin()
	loginHelper.loginAsDeveloper(2)
	loginHelper.verifyLoginSuccess()

	// Navigate to developer projects (New Projects page)
	devPropHelper.navigateToDeveloperProjects()

	// Act: Open a project by name (using existing project)
	devPropHelper.openProjectCardByName('Jocelyn Fisher')
	WebUI.waitForPageLoad(10)
	WebUI.delay(2)

	// Assert: Verify project details are displayed on the page
	WebUI.verifyTextPresent('Jocelyn Fisher', false, FailureHandling.STOP_ON_FAILURE)

	WebUI.comment("✅ TC_DEVPROP_007 PASSED: Project details page opened and project information displayed")

} catch (Exception e) {
	WebUI.comment("❌ TC_DEVPROP_007 FAILED: " + e.getMessage())
	throw e
} finally {
	WebUI.closeBrowser()
}
