import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import com.kms.katalon.core.model.FailureHandling
import agent.Agent_Keywords as AgentKeywords

/**
 * Test Case: TC_AGENT_007 - View Agent Details
 * 
 * Description: Verify that clicking on an agent button navigates to agent details page
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
    
    // Assert: Verify agent cards are present
    def agentsCount = agentHelper.getAgentsCount()
    assert agentsCount > 0, "At least one agent should be displayed"
    
    // Get current URL before clicking
    String urlBeforeClick = WebUI.getUrl()
    WebUI.comment("URL before click: ${urlBeforeClick}")
    
    // Click on first agent's "View Details" or "Contact Agent" button
    WebUI.waitForElementClickable(
        findTestObject('Object Repository/Agent/AgentPage/contactAgentButton'),
        10
    )
    WebUI.click(findTestObject('Object Repository/Agent/AgentPage/contactAgentButton'))
    
    // Wait for page to change
    WebUI.delay(2)
    
    // Get URL after clicking
    String urlAfterClick = WebUI.getUrl()
    WebUI.comment("URL after click: ${urlAfterClick}")
    
    // Verify URL changed (navigated to agent details or contact page)
    assert urlBeforeClick != urlAfterClick, "URL should change after clicking agent button"
    
    // Verify we're on a different page (agent detail page or modal appeared)
    boolean pageChanged = (urlBeforeClick != urlAfterClick) || 
                         WebUI.verifyElementPresent(
                             findTestObject('Object Repository/Agent/AgentPage/agentDetailModal'),
                             5,
                             FailureHandling.OPTIONAL
                         )
    
    assert pageChanged, "Page should change or modal should appear after clicking agent button"
    
    WebUI.comment("✅ TC_AGENT_007 PASSED: Agent button click navigates correctly")
    
} catch (Exception e) {
    WebUI.comment("❌ TC_AGENT_007 FAILED: " + e.getMessage())
    throw e
    
} finally {
    // Cleanup
    WebUI.closeBrowser()
}


