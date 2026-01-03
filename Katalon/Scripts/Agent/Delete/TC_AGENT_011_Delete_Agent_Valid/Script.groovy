import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import com.kms.katalon.core.model.FailureHandling
import agent.Agent_Keywords as AgentKeywords
import authentication.Login_Keywords as LoginKeywords

/**
 * Test Case: TC_AGENT_011 - Delete Agent Valid
 * 
 * Description: Verify that an agent can be deleted successfully
 * Prerequisites: User must be logged in as admin, an agent must exist
 * Test Data: None
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
    
    // 1. Create a unique agent to delete
    def timestamp = System.currentTimeMillis()
    def uniqueName = "DeleteTest${timestamp}"
    def agentData = [
        firstName: uniqueName,
        lastName: "Agent",
        email: "delete${timestamp}@test.com",
        contactEmail: "delete_contact${timestamp}@test.com",
        phoneNumber: "1234567890",
        age: 30,
        yearsOfExperience: 5,
        totalSales: 10,
        about: "Agent to be deleted"
    ]
    
    agentHelper.clickAddNewAgent()
    agentHelper.fillAgentForm(agentData)
    agentHelper.submitAgentForm()
    WebUI.delay(2)
    
    // Get count before delete
    def countBeforeDelete = agentHelper.getAgentsCount()
    
    // 2. Act: Delete the agent
    agentHelper.clickDeleteAgent("${uniqueName} Agent")
    agentHelper.confirmDeleteAgent()
    
    // 3. Assert: Verify agent was deleted
    WebUI.delay(2)
    def countAfterDelete = agentHelper.getAgentsCount()
    
    // Verify count decreased
    assert countAfterDelete == countBeforeDelete - 1, "Agent count should decrease by 1. Before: ${countBeforeDelete}, After: ${countAfterDelete}"
    
    // Verify agent is not displayed
    agentHelper.verifyAgentNotDisplayed(uniqueName)
    
    WebUI.comment("✅ TC_AGENT_011 PASSED: Agent deleted successfully")
    
} catch (Exception e) {
    WebUI.comment("❌ TC_AGENT_011 FAILED: " + e.getMessage())
    throw e
    
} finally {
    // Cleanup
    WebUI.closeBrowser()
}


