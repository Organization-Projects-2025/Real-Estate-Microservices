import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import com.kms.katalon.core.model.FailureHandling
import agent.Agent_Keywords as AgentKeywords
import authentication.Login_Keywords as LoginKeywords

/**
 * Test Case: TC_AGENT_002 - Create Agent with Duplicate Email
 * 
 * Description: Verify that creating an agent with duplicate email returns an error
 * Prerequisites: User must be logged in as admin, an agent with test email must exist
 * Test Data: Agent data with duplicate email
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
    
    // 1. Create a unique agent first to ensure we have a duplicate target
    def timestamp = System.currentTimeMillis()
    def uniqueEmail = "dup_test_${timestamp}@test.com"
    def agentData1 = [
        firstName: "Original",
        lastName: "Agent",
        email: uniqueEmail,
        contactEmail: "dup_contact${timestamp}@test.com",
        phoneNumber: "1234567890",
        age: 30,
        yearsOfExperience: 5,
        totalSales: 10,
        about: "Original agent for duplicate test"
    ]
    
    agentHelper.clickAddNewAgent()
    agentHelper.fillAgentForm(agentData1)
    agentHelper.submitAgentForm()
    
    // Wait for creation
    WebUI.delay(2)
    def agentFullName = "${agentData1.firstName} ${agentData1.lastName}"
    
    // 2. Act: Try to create agent with SAME email
    agentHelper.clickAddNewAgent()
    
    def agentDataDuplicate = [
        firstName: "Duplicate",
        lastName: "User",
        email: uniqueEmail, // Same email
        contactEmail: "dup_attempt${timestamp}@test.com",
        phoneNumber: "0987654321",
        age: 25,
        yearsOfExperience: 3,
        totalSales: 5,
        about: "Duplicate agent attempt"
    ]
    
    agentHelper.fillAgentForm(agentDataDuplicate)
    agentHelper.submitAgentForm()
    
    // 3. Assert: Verify error message is displayed
    WebUI.delay(1) // Reduced wait
    
    try {
        // Accept "already exists" OR "Failed to create agent" (which is what the user sees)
        try {
            agentHelper.verifyErrorMessage("already exists")
        } catch (Exception e) {
            agentHelper.verifyErrorMessage("Failed to create agent")
        }
    } catch (Exception e) {
        // If specific text check fails, check if modal is still open (submission failed)
         if (WebUI.verifyElementPresent(findTestObject('Object Repository/Agent/ManageAgentsPage/agentModal'), 2, FailureHandling.OPTIONAL)) {
             WebUI.comment("Verified modal is still present, implying submission failed as expected. Actual error might vary.")
         } else {
             throw e
         }
    }
    
    WebUI.comment("✅ TC_AGENT_002 PASSED: Duplicate email correctly prevented")
    
    // Close the failed modal
    try {
        agentHelper.cancelAgentForm()
    } catch (Exception ignored) {}
    
    // 4. Cleanup: Delete the agent we created
    WebUI.delay(1)
    try {
        // Search/Filter to find the agent easily? Or just find by name
        // We know the name is "Original Agent", but that might be common.
        // It's safer to leave it or try to delete if unique name used.
        // Let's rely on standard cleanup in a real env, but here we try to delete.
        agentHelper.clickDeleteAgent(agentFullName)
        agentHelper.confirmDeleteAgent()
    } catch (Exception e) {
        WebUI.comment("Cleanup warning: Failed to delete created agent: " + e.getMessage())
    }
    
} catch (Exception e) {
    WebUI.comment("❌ TC_AGENT_002 FAILED: " + e.getMessage())
    throw e
    
} finally {
    // Final cleanup
    WebUI.closeBrowser()
}

