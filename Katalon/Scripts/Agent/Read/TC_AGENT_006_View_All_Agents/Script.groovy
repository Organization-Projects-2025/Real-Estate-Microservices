import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import com.kms.katalon.core.model.FailureHandling
import agent.Agent_Keywords as AgentKeywords

/**
 * Test Case: TC_AGENT_006 - View All Agents
 * 
 * Description: Verify that all agents are displayed on the Agent listing page
 * Prerequisites: Agents must exist in the system
 * Test Data: None
 */

// Initialize
new common.Browser_Keywords().openBrowserWithFallback()
AgentKeywords agentHelper = new AgentKeywords()

try {
    // Arrange & Act: Navigate to Agent page
    agentHelper.navigateToAgentPage()
    
    // Wait for agents list to load
    agentHelper.waitForAgentsList()
    
    // Assert: Verify agents are displayed
    def agentsCount = agentHelper.getAgentsCount()
    assert agentsCount > 0, "At least one agent should be displayed"
    
    // Verify results indicator is present
    // Verify results indicator is present
    agentHelper.verifyResultsIndicator()
    
    WebUI.comment("✅ TC_AGENT_006 PASSED: ${agentsCount} agents displayed successfully")
    
} catch (Exception e) {
    WebUI.comment("❌ TC_AGENT_006 FAILED: " + e.getMessage())
    throw e
    
} finally {
    // Cleanup
    WebUI.closeBrowser()
}

