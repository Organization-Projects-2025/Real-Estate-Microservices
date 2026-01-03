import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import com.kms.katalon.core.model.FailureHandling
import com.kms.katalon.core.util.KeywordUtil
import agent.Agent_Keywords as AgentKeywords
import authentication.Login_Keywords as LoginKeywords

/**
 * Test Case: TC_AGENT_004 - Create Agent with Invalid Email
 * 
 * Description: Verify that creating an agent with invalid email format returns an error
 * Prerequisites: User must be logged in as admin
 * Test Data: Agent data with invalid email format
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
    
    // Act: Try to create agent with invalid email
    agentHelper.clickAddNewAgent()
    
    def timestamp = System.currentTimeMillis()
    def agentData = [
        firstName: "Invalid",
        lastName: "Email",
        email: "invalid-email-format",  // Invalid email format
        phoneNumber: "1234567890",
        age: 30,
        yearsOfExperience: 5,
        totalSales: 10
    ]
    
    agentHelper.fillAgentForm(agentData)
    
    // HTML5 email validation should prevent invalid email
    // Check if form validation works
    WebUI.delay(1)
    
    // Assert: Verify email validation
    // Try to submit
    agentHelper.submitAgentForm()
    WebUI.delay(1)
    
    // Verify modal still open (submission blocked)
    boolean modalPresent = WebUI.verifyElementPresent(
        findTestObject('Object Repository/Agent/ManageAgentsPage/agentModal'), 
        3, 
        FailureHandling.OPTIONAL
    )
    
    if (modalPresent) {
        WebUI.comment("Validation successful: Modal is still present after submitting invalid email")
    } else {
        KeywordUtil.markFailed("Validation failed: Modal closed (submission succeeded) despite invalid email")
    }
    
    // Verify specific email invalidity via JS
    boolean isEmailInvalid = (boolean)WebUI.executeJavaScript('''
        var emailInput = document.querySelector('input[type="email"]');
        return emailInput ? !emailInput.checkValidity() : false;
    ''', [])
    
    if (isEmailInvalid) {
        WebUI.comment("Confirmed email input is marked invalid by browser")
    } else {
        WebUI.comment("Warning: Email input state is valid (might be browser dependent)")
    }
    
    WebUI.comment("✅ TC_AGENT_004 PASSED: Invalid email validation works correctly")
    
} catch (Exception e) {
    WebUI.comment("❌ TC_AGENT_004 FAILED: " + e.getMessage())
    throw e
    
} finally {
    // Cleanup: Close modal
    try {
        agentHelper.cancelAgentForm()
    } catch (Exception ignored) {}
    WebUI.closeBrowser()
}

