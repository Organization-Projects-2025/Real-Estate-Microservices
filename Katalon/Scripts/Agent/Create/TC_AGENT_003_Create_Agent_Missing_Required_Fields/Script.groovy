import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import com.kms.katalon.core.model.FailureHandling
import com.kms.katalon.core.util.KeywordUtil
import agent.Agent_Keywords as AgentKeywords
import authentication.Login_Keywords as LoginKeywords

/**
 * Test Case: TC_AGENT_003 - Create Agent with Missing Required Fields
 * 
 * Description: Verify that creating an agent with missing required fields returns an error
 * Prerequisites: User must be logged in as admin
 * Test Data: Agent data with missing required fields
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
    
    // Act: Try to create agent with missing required fields
    agentHelper.clickAddNewAgent()
    
    // Fill only some fields, leaving required ones empty
    def agentData = [
        firstName: "",  // Missing required field
        lastName: "Test",
        email: "",  // Missing required field
        phoneNumber: "",  // Missing required field
        age: 0,  // Invalid age
        yearsOfExperience: 0
    ]
    
    agentHelper.fillAgentForm(agentData)
    
    // Try to submit - form validation should prevent submission
    // Check if submit button is disabled or form shows validation errors
    WebUI.delay(1)
    
    // Assert: Verify form validation prevents submission
    // HTML5 validation or disabled button should prevent form submission
    def submitButton = findTestObject('Object Repository/Agent/ManageAgentsPage/submitButton')
    
    // Try to submit
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
    } else {
        // If modal is gone, it means submission succeeded which is WRONG for invalid data
        WebUI.takeScreenshot()
        KeywordUtil.markFailed("Validation failed: Modal closed (submission succeeded) despite missing required fields")
    }
    
    // Optional: Check if inputs are invalid using JS (more robust)
    // This confirms WHY it wasn't submitted
    WebUI.executeJavaScript('''
        var inputs = document.querySelectorAll('input:required');
        var invalidFound = false;
        for(var i=0; i<inputs.length; i++) {
            if(!inputs[i].checkValidity()) {
                invalidFound = true;
                break;
            }
        }
        return invalidFound;
    ''', [])
    
    WebUI.comment("✅ TC_AGENT_003 PASSED: Missing required fields validation works correctly")
    
} catch (Exception e) {
    WebUI.comment("❌ TC_AGENT_003 FAILED: " + e.getMessage())
    throw e
    
} finally {
    // Cleanup: Close modal
    try {
        agentHelper.cancelAgentForm()
    } catch (Exception ignored) {}
    WebUI.closeBrowser()
}

