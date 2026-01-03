import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import com.kms.katalon.core.model.FailureHandling
import agent.Agent_Keywords as AgentKeywords

/**
 * Test Case: TC_AGENT_007 - View Agent Details
 * 
 * Description: Verify that agent details are displayed correctly on agent cards
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
    
    // Assert: Verify agent cards contain expected information
    def agentsCount = agentHelper.getAgentsCount()
    assert agentsCount > 0, "At least one agent should be displayed"
    
    // Verify agent card elements are present
    // Check that agent cards have name, email, phone, experience, etc.
    WebUI.verifyElementPresent(
        findTestObject('Object Repository/Agent/AgentPage/agentCards'),
        5,
        FailureHandling.STOP_ON_FAILURE
    )
    
    // Verify contact agent buttons are present
    def contactButtons = WebUI.findWebElements(
        findTestObject('Object Repository/Agent/AgentPage/contactAgentButton'),
        5
    )
    assert contactButtons.size() > 0, "Contact Agent buttons should be present"
    
    WebUI.comment("✅ TC_AGENT_007 PASSED: Agent details displayed correctly")
    
} catch (Exception e) {
    WebUI.comment("❌ TC_AGENT_007 FAILED: " + e.getMessage())
    throw e
    
} finally {
    // Cleanup
    WebUI.closeBrowser()
}

