import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import com.kms.katalon.core.model.FailureHandling
import agent.Agent_Keywords as AgentKeywords
import authentication.Login_Keywords as LoginKeywords

/**
 * Test Case: TC_AGENT_008 - Update Agent with Valid Data
 * 
 * Description: Verify that an agent can be updated successfully with valid data
 * Prerequisites: User must be logged in as admin, an agent must exist
 * Test Data: Valid updated agent data
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
    
    // 1. Create a unique agent to update
    def timestamp = System.currentTimeMillis()
    def uniqueName = "UpdateTest${timestamp}"
    def agentData = [
        firstName: uniqueName,
        lastName: "Agent",
        email: "update${timestamp}@test.com",
        contactEmail: "update_contact${timestamp}@test.com",
        phoneNumber: "1234567890",
        age: 30,
        yearsOfExperience: 5,
        totalSales: 10,
        about: "Original about text"
    ]
    
    agentHelper.clickAddNewAgent()
    agentHelper.fillAgentForm(agentData)
    agentHelper.submitAgentForm()
    WebUI.delay(2)
    
    // 2. Act: Edit agent
    agentHelper.clickEditAgent("${uniqueName} Agent")
    
    // Update agent data
    def updatedAbout = "Updated about section - ${timestamp}"
    def updateData = [
        about: updatedAbout,
        totalSales: 25
    ]
    
    agentHelper.fillAgentForm(updateData)
    agentHelper.submitAgentForm()
    
    // 3. Assert: Verify update was successful
    WebUI.delay(2)
    // Verify the text is present on the card or in the list
    // Use retry logic as update might take a moment to reflect in UI
    boolean textFound = false
    for(int i=0; i<3; i++) {
        if(WebUI.verifyTextPresent(updatedAbout, false, FailureHandling.OPTIONAL)) {
            textFound = true
            break
        }
        WebUI.delay(1)
        WebUI.refresh() 
        agentHelper.verifyManageAgentsPageLoaded()
    }
    
    assert textFound, "Updated text '${updatedAbout}' should be present"
    
    WebUI.comment("✅ TC_AGENT_008 PASSED: Agent updated successfully")
    
    // 4. Cleanup
    try {
        agentHelper.clickDeleteAgent("${uniqueName} Agent")
        agentHelper.confirmDeleteAgent()
    } catch (Exception e) {
        WebUI.comment("Cleanup warning: " + e.getMessage())
    }
    

    
} catch (Exception e) {
    WebUI.comment("❌ TC_AGENT_008 FAILED: " + e.getMessage())
    throw e
    
} finally {
    // Cleanup
    WebUI.closeBrowser()
}

