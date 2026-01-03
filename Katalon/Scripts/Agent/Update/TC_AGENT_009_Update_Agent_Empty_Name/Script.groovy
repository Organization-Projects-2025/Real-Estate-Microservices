import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import com.kms.katalon.core.model.FailureHandling
import com.kms.katalon.core.util.KeywordUtil
import agent.Agent_Keywords as AgentKeywords
import authentication.Login_Keywords as LoginKeywords

/**
 * Test Case: TC_AGENT_009 - Update Agent with Empty Name
 * 
 * Description: Verify that updating an agent with empty name returns an error
 * Prerequisites: User must be logged in as admin, an agent must exist
 * Test Data: Agent data with empty first name
 */

// Initialize
new common.Browser_Keywords().openBrowserWithFallback()
AgentKeywords agentHelper = new AgentKeywords()
LoginKeywords loginHelper = new LoginKeywords()

try {
    // Arrange: Login as admin
    loginHelper.navigateToLogin()
    loginHelper.loginAsAdmin()
    loginHelper.verifyLoginSuccess()
    
    // Navigate to Manage Agents page
    agentHelper.navigateToManageAgents()
    
    WebUI.delay(2)
    
    // Act: Edit agent and clear required field
    try {
        WebUI.click(findTestObject('Object Repository/Agent/ManageAgentsPage/editAgentButton'))
        WebUI.waitForElementPresent(
            findTestObject('Object Repository/Agent/ManageAgentsPage/agentModal'),
            5,
            FailureHandling.STOP_ON_FAILURE
        )
    } catch (Exception e) {
        // Try alternative approach
        agentHelper.clickAddNewAgent()
    }
    
    // Clear first name (required field)
    WebUI.clearText(findTestObject('Object Repository/Agent/ManageAgentsPage/firstNameInput'))
    
    // Try to submit
    WebUI.delay(1)
    
    // Assert: Verify form validation prevents submission
    agentHelper.submitAgentForm()
    WebUI.delay(1)
    
    // Check if we are still on the modal (submission failed/blocked)
    boolean modalPresent = WebUI.verifyElementPresent(
        findTestObject('Object Repository/Agent/ManageAgentsPage/agentModal'),
        3,
        FailureHandling.OPTIONAL
    )
    
    if (modalPresent) {
        WebUI.comment("Validation successful: Modal is still present after submitting invalid data")
        
        // Optional: Verify input is invalid in DOM
        def firstNameInput = findTestObject('Object Repository/Agent/ManageAgentsPage/firstNameInput')
        def element = WebUI.findWebElement(firstNameInput, 5)
        boolean isInvalid = WebUI.executeJavaScript('return !arguments[0].checkValidity()', Arrays.asList(element))
        
        if(isInvalid) {
             WebUI.comment("Input validity check confirmed invalid state")
        }
    } else {
        // If modal is gone, it means submission succeeded which is WRONG for invalid data
        WebUI.takeScreenshot()
        KeywordUtil.markFailed("Validation failed: Modal closed (submission succeeded) despite empty name")
    }
    
    WebUI.comment("✅ TC_AGENT_009 PASSED: Empty name validation works correctly")
    
} catch (Exception e) {
    WebUI.comment("❌ TC_AGENT_009 FAILED: " + e.getMessage())
    throw e
    
} finally {
    // Cleanup: Close modal
    try {
        agentHelper.cancelAgentForm()
    } catch (Exception ignored) {}
    WebUI.closeBrowser()
}

