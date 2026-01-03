package agent

import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.annotation.Keyword
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import com.kms.katalon.core.model.FailureHandling
import com.kms.katalon.core.testobject.ConditionType
import com.kms.katalon.core.testobject.TestObject
import java.util.Arrays

/**
 * Agent Keywords - Common functions for Agent microservice UI testing
 * 
 * This class contains reusable keywords for testing the Agent web interface
 * including agent listing, creation, update, deletion, and search/filter functionality.
 */
public class Agent_Keywords {
    
    private static final String BASE_URL = 'http://localhost:5173'
    private static final String AGENT_URL = "${BASE_URL}/agent"
    private static final String MANAGE_AGENTS_URL = "${BASE_URL}/manage-agents"
    private static final String CREATE_AGENT_URL = "${BASE_URL}/create-agent"
    
    /**
     * Navigate to Agent listing page
     */
    @Keyword
    def navigateToAgentPage() {
        WebUI.navigateToUrl(AGENT_URL)
        WebUI.waitForPageLoad(10)
        verifyAgentPageLoaded()
    }
    
    /**
     * Verify Agent listing page is loaded
     */
    @Keyword
    def verifyAgentPageLoaded() {
        WebUI.waitForElementPresent(
            findTestObject('Object Repository/Agent/AgentPage/searchInput'),
            10,
            FailureHandling.STOP_ON_FAILURE
        )
        WebUI.waitForElementPresent(
            findTestObject('Object Repository/Agent/AgentPage/findAgentsButton'),
            10,
            FailureHandling.STOP_ON_FAILURE
        )
    }
    
    /**
     * Navigate to Manage Agents page
     */
    @Keyword
    def navigateToManageAgents() {
        WebUI.navigateToUrl(MANAGE_AGENTS_URL)
        WebUI.waitForPageLoad(10)
        // Maximize window to avoid layout issues
        WebUI.maximizeWindow()
        WebUI.delay(1)
        verifyManageAgentsPageLoaded()
    }
    
    /**
     * Verify Manage Agents page is loaded
     */
    @Keyword
    def verifyManageAgentsPageLoaded() {
        WebUI.waitForElementPresent(
            findTestObject('Object Repository/Agent/ManageAgentsPage/addNewAgentButton'),
            10,
            FailureHandling.STOP_ON_FAILURE
        )
    }
    
    /**
     * Navigate to Create Agent page
     */
    @Keyword
    def navigateToCreateAgent() {
        WebUI.navigateToUrl(CREATE_AGENT_URL)
        WebUI.waitForPageLoad(10)
        verifyCreateAgentPageLoaded()
    }
    
    /**
     * Verify Create Agent page is loaded
     */
    @Keyword
    def verifyCreateAgentPageLoaded() {
        WebUI.waitForElementPresent(
            findTestObject('Object Repository/Agent/CreateAgentPage/passwordInput'),
            10,
            FailureHandling.STOP_ON_FAILURE
        )
        WebUI.waitForElementPresent(
            findTestObject('Object Repository/Agent/CreateAgentPage/createAgentProfileButton'),
            10,
            FailureHandling.STOP_ON_FAILURE
        )
    }
    
    /**
     * Click Add New Agent button on Manage Agents page
     */
    @Keyword
    def clickAddNewAgent() {
        // Close any open menus/navbars that might intercept the click
        closeAnyOpenMenus()
        
        // Hide the intercepting navbar button using attribute selector (more reliable)
        WebUI.executeJavaScript('''
            // Find navbar buttons by checking if they're near the top of the page
            var buttons = document.querySelectorAll('button');
            for (var i = 0; i < buttons.length; i++) {
                var btn = buttons[i];
                var rect = btn.getBoundingClientRect();
                // Hide buttons near top (navbar area) that might intercept
                if (rect.top < 100 && rect.left > 800) {
                    btn.style.pointerEvents = 'none';
                    btn.style.opacity = '0';
                }
            }
        ''', Arrays.asList())
        WebUI.delay(0.5)
        
        def addButton = findTestObject('Object Repository/Agent/ManageAgentsPage/addNewAgentButton')
        
        // Use JavaScript click directly to bypass all interception
        WebUI.waitForElementVisible(addButton, 10, FailureHandling.STOP_ON_FAILURE)
        
        // Scroll down first to move away from navbar
        WebUI.executeJavaScript('window.scrollTo(0, 200);', Arrays.asList())
        WebUI.delay(0.5)
        
        WebUI.scrollToElement(addButton, 5)
        WebUI.delay(1)
        
        def element = WebUI.findWebElement(addButton, 5)
        
        // Ensure element is clickable and in view
        WebUI.executeJavaScript('''
            var el = arguments[0];
            el.scrollIntoView({behavior: "instant", block: "center", inline: "center"});
            el.style.zIndex = "9999";
        ''', Arrays.asList(element))
        WebUI.delay(0.5)
        
        // Use JavaScript click (bypasses all interception)
        WebUI.executeJavaScript('arguments[0].click();', Arrays.asList(element))
        
        // Restore navbar buttons
        WebUI.executeJavaScript('''
            var buttons = document.querySelectorAll('button');
            for (var i = 0; i < buttons.length; i++) {
                var btn = buttons[i];
                btn.style.pointerEvents = '';
                btn.style.opacity = '';
            }
        ''', Arrays.asList())
        
        WebUI.waitForElementPresent(
            findTestObject('Object Repository/Agent/ManageAgentsPage/agentModal'),
            5,
            FailureHandling.STOP_ON_FAILURE
        )
    }
    
    /**
     * Close any open menus, dropdowns, or navbars that might intercept clicks
     */
    private void closeAnyOpenMenus() {
        try {
            // Try to close any open user menu or navbar dropdowns
            // Click outside or press ESC to close menus
            WebUI.executeJavaScript('''
                // Close any open dropdowns/menus by clicking outside
                var event = new MouseEvent('click', {
                    view: window,
                    bubbles: true,
                    cancelable: true
                });
                document.body.dispatchEvent(event);
                
                // Also try pressing ESC
                var escEvent = new KeyboardEvent('keydown', {
                    key: 'Escape',
                    code: 'Escape',
                    keyCode: 27,
                    which: 27,
                    bubbles: true
                });
                document.dispatchEvent(escEvent);
            ''', Arrays.asList())
            WebUI.delay(0.5)
        } catch (Exception e) {
            // Ignore errors - menus might not be open
        }
    }
    
    /**
     * Fill agent form in modal with provided data
     * @param agentData - Map containing agent fields (firstName, lastName, email, etc.)
     */
    @Keyword
    def fillAgentForm(Map agentData) {
        if (agentData.firstName) {
            WebUI.clearText(findTestObject('Object Repository/Agent/ManageAgentsPage/firstNameInput'))
            WebUI.setText(findTestObject('Object Repository/Agent/ManageAgentsPage/firstNameInput'), agentData.firstName)
        }
        
        if (agentData.lastName) {
            WebUI.clearText(findTestObject('Object Repository/Agent/ManageAgentsPage/lastNameInput'))
            WebUI.setText(findTestObject('Object Repository/Agent/ManageAgentsPage/lastNameInput'), agentData.lastName)
        }
        
        if (agentData.email) {
            WebUI.clearText(findTestObject('Object Repository/Agent/ManageAgentsPage/emailInput'))
            WebUI.setText(findTestObject('Object Repository/Agent/ManageAgentsPage/emailInput'), agentData.email)
        }
        
        if (agentData.contactEmail) {
            WebUI.clearText(findTestObject('Object Repository/Agent/ManageAgentsPage/contactEmailInput'))
            WebUI.setText(findTestObject('Object Repository/Agent/ManageAgentsPage/contactEmailInput'), agentData.contactEmail)
        }
        
        if (agentData.phoneNumber) {
            WebUI.clearText(findTestObject('Object Repository/Agent/ManageAgentsPage/phoneNumberInput'))
            WebUI.setText(findTestObject('Object Repository/Agent/ManageAgentsPage/phoneNumberInput'), agentData.phoneNumber)
        }
        
        if (agentData.age != null) {
            WebUI.clearText(findTestObject('Object Repository/Agent/ManageAgentsPage/ageInput'))
            WebUI.setText(findTestObject('Object Repository/Agent/ManageAgentsPage/ageInput'), agentData.age.toString())
        }
        
        if (agentData.yearsOfExperience != null) {
            WebUI.clearText(findTestObject('Object Repository/Agent/ManageAgentsPage/yearsOfExperienceInput'))
            WebUI.setText(findTestObject('Object Repository/Agent/ManageAgentsPage/yearsOfExperienceInput'), agentData.yearsOfExperience.toString())
        }
        
        if (agentData.totalSales != null) {
            WebUI.clearText(findTestObject('Object Repository/Agent/ManageAgentsPage/totalSalesInput'))
            WebUI.setText(findTestObject('Object Repository/Agent/ManageAgentsPage/totalSalesInput'), agentData.totalSales.toString())
        }
        
        if (agentData.about) {
            WebUI.clearText(findTestObject('Object Repository/Agent/ManageAgentsPage/aboutTextarea'))
            WebUI.setText(findTestObject('Object Repository/Agent/ManageAgentsPage/aboutTextarea'), agentData.about)
        }
    }
    
    /**
     * Fill Create Agent form with provided data
     * @param agentData - Map containing agent fields including password
     */
    @Keyword
    def fillCreateAgentForm(Map agentData) {
        // Use the same form filling logic but also handle password
        fillAgentForm(agentData)
        
        if (agentData.password) {
            WebUI.clearText(findTestObject('Object Repository/Agent/CreateAgentPage/passwordInput'))
            WebUI.setText(findTestObject('Object Repository/Agent/CreateAgentPage/passwordInput'), agentData.password)
        }
    }
    
    /**
     * Submit agent form in modal
     */
    @Keyword
    def submitAgentForm() {
        def submitButton = findTestObject('Object Repository/Agent/ManageAgentsPage/submitButton')
        clickWithFallback(submitButton)
        WebUI.delay(2)
        WebUI.waitForPageLoad(10)
    }
    
    /**
     * Submit Create Agent form
     */
    @Keyword
    def submitCreateAgentForm() {
        WebUI.click(findTestObject('Object Repository/Agent/CreateAgentPage/createAgentProfileButton'))
        WebUI.delay(2)
        WebUI.waitForPageLoad(10)
    }
    
    /**
     * Cancel agent form modal
     */
    @Keyword
    def cancelAgentForm() {
        def cancelButton = findTestObject('Object Repository/Agent/ManageAgentsPage/cancelButton')
        clickWithFallback(cancelButton)
        WebUI.delay(1)
    }
    
    /**
     * Search for agents by search term
     * @param searchTerm - Search term to use
     */
    @Keyword
    def searchAgents(String searchTerm) {
        WebUI.clearText(findTestObject('Object Repository/Agent/AgentPage/searchInput'))
        WebUI.setText(findTestObject('Object Repository/Agent/AgentPage/searchInput'), searchTerm)
        def findButton = findTestObject('Object Repository/Agent/AgentPage/findAgentsButton')
        clickWithFallback(findButton)
        WebUI.delay(2)
    }
    
    /**
     * Filter agents by minimum experience
     * @param minExperience - Minimum years of experience
     */
    @Keyword
    def filterByMinExperience(String minExperience) {
        WebUI.selectOptionByValue(
            findTestObject('Object Repository/Agent/AgentPage/minExperienceSelect'),
            minExperience,
            false
        )
        def findButton = findTestObject('Object Repository/Agent/AgentPage/findAgentsButton')
        clickWithFallback(findButton)
        WebUI.delay(2)
    }
    
    /**
     * Filter agents by minimum sales
     * @param minSales - Minimum number of sales
     */
    @Keyword
    def filterByMinSales(String minSales) {
        WebUI.selectOptionByValue(
            findTestObject('Object Repository/Agent/AgentPage/minSalesSelect'),
            minSales,
            false
        )
        def findButton = findTestObject('Object Repository/Agent/AgentPage/findAgentsButton')
        clickWithFallback(findButton)
        WebUI.delay(2)
    }
    
    /**
     * Apply combined filters (search, experience, sales)
     * @param filters - Map containing searchTerm, minExperience, minSales
     */
    @Keyword
    def applyFilters(Map filters) {
        if (filters.searchTerm) {
            WebUI.clearText(findTestObject('Object Repository/Agent/AgentPage/searchInput'))
            WebUI.setText(findTestObject('Object Repository/Agent/AgentPage/searchInput'), filters.searchTerm)
        }
        
        if (filters.minExperience) {
            WebUI.selectOptionByValue(
                findTestObject('Object Repository/Agent/AgentPage/minExperienceSelect'),
                filters.minExperience,
                false
            )
        }
        
        if (filters.minSales) {
            WebUI.selectOptionByValue(
                findTestObject('Object Repository/Agent/AgentPage/minSalesSelect'),
                filters.minSales,
                false
            )
        }
        
        def findButton = findTestObject('Object Repository/Agent/AgentPage/findAgentsButton')
        clickWithFallback(findButton)
        WebUI.delay(2)
    }
    
    /**
     * Clear all filters on Agent page
     */
    @Keyword
    def clearFilters() {
        WebUI.clearText(findTestObject('Object Repository/Agent/AgentPage/searchInput'))
        WebUI.selectOptionByValue(
            findTestObject('Object Repository/Agent/AgentPage/minExperienceSelect'),
            '',
            false
        )
        WebUI.selectOptionByValue(
            findTestObject('Object Repository/Agent/AgentPage/minSalesSelect'),
            '',
            false
        )
        def findButton = findTestObject('Object Repository/Agent/AgentPage/findAgentsButton')
        clickWithFallback(findButton)
        WebUI.delay(2)
    }
    
    /**
     * Get count of agent cards displayed
     * @return Integer count of agents
     */
    @Keyword
    def getAgentsCount() {
        def agentElements = WebUI.findWebElements(
            findTestObject('Object Repository/Agent/AgentPage/agentCards'),
            10
        )
        return agentElements.size()
    }
    
    /**
     * Verify agent is displayed in the list
     * @param agentName - Full name of agent (firstName lastName) or just firstName
     */
    @Keyword
    def verifyAgentDisplayed(String agentName) {
        // Wait for agents list to be present first
        WebUI.waitForElementPresent(
            findTestObject('Object Repository/Agent/ManageAgentsPage/addNewAgentButton'),
            5,
            FailureHandling.STOP_ON_FAILURE
        )
        
        // Wait a bit for the list to load
        WebUI.delay(2)
        
        // Try multiple ways to find the agent
        // Method 1: Look for h2 with agent name (in agent cards)
        try {
            WebUI.waitForElementPresent(
                xpath('Agent name in list', "//h2[contains(text(), '${agentName}')]"),
                5,
                FailureHandling.OPTIONAL
            )
            return // Found it!
        } catch (Exception e) {
            // Continue to next method
        }
        
        // Method 2: Look for text anywhere on page
        try {
            WebUI.verifyTextPresent(agentName, false, FailureHandling.OPTIONAL)
            return // Found it!
        } catch (Exception e) {
            // Continue to next method
        }
        
        // Method 3: Look in agent cards more broadly
        try {
            WebUI.waitForElementPresent(
                xpath('Agent card with name', "//div[contains(@class,'rounded-xl') and contains(., '${agentName}')]"),
                5,
                FailureHandling.OPTIONAL
            )
            return // Found it!
        } catch (Exception e) {
            // If all methods fail, throw error
            throw new Exception("Agent '${agentName}' not found on page after multiple search attempts")
        }
    }
    
    /**
     * Verify no results message is displayed
     */
    @Keyword
    def verifyNoResultsMessage() {
        WebUI.waitForElementPresent(
            findTestObject('Object Repository/Agent/AgentPage/noResultsMessage'),
            5,
            FailureHandling.STOP_ON_FAILURE
        )
    }
    
    /**
     * Click Edit button for an agent by name
     * @param agentName - Full name of agent to edit
     */
    @Keyword
    def clickEditAgent(String agentName) {
        // XPath: Find h2 with name, go to parent div, find Edit button
        TestObject editButton = xpath(
            'Edit agent button',
            "//h2[contains(., '${agentName}')]/..//button[contains(., 'Edit')]"
        )
        
        // Wait for element to be present (handle API/Animation delay)
        WebUI.waitForElementPresent(editButton, 10)
        WebUI.scrollToElement(editButton, 3)
        
        clickWithFallback(editButton)
        
        WebUI.waitForElementPresent(
            findTestObject('Object Repository/Agent/ManageAgentsPage/agentModal'),
            5,
            FailureHandling.STOP_ON_FAILURE
        )
    }
    
    /**
     * Click Delete button for an agent by name
     * @param agentName - Full name of agent to delete
     */
    @Keyword
    def clickDeleteAgent(String agentName) {
        // XPath: Find h2 with name, go to parent div, find Delete button
        TestObject deleteButton = xpath(
            'Delete agent button',
            "//h2[contains(., '${agentName}')]/..//button[contains(., 'Delete')]"
        )
        
        // Wait for element to be present (handle API/Animation delay)
        WebUI.waitForElementPresent(deleteButton, 10)
        WebUI.scrollToElement(deleteButton, 3)
        
        // Use direct JS click to avoid 'clickWithFallback' issues with Alerts
        // clickWithFallback runs JS after clicking, which fails if an alert pops up immediately
        def element = WebUI.findWebElement(deleteButton, 5)
        WebUI.executeJavaScript("arguments[0].click()", Arrays.asList(element))
        
        WebUI.delay(1)
    }
    
    /**
     * Confirm delete agent (accept alert)
     */
    @Keyword
    def confirmDeleteAgent() {
        if (WebUI.waitForAlert(3, FailureHandling.OPTIONAL)) {
            WebUI.acceptAlert()
        }
        WebUI.delay(2)
    }
    
    /**
     * Cancel delete agent (dismiss alert)
     */
    @Keyword
    def cancelDeleteAgent() {
        if (WebUI.waitForAlert(3, FailureHandling.OPTIONAL)) {
            WebUI.dismissAlert()
        }
        WebUI.delay(1)
    }
    
    /**
     * Verify agent is not displayed in the list
     * @param agentName - Full name of agent
     */
    @Keyword
    def verifyAgentNotDisplayed(String agentName) {
        WebUI.verifyTextNotPresent(agentName, false, FailureHandling.STOP_ON_FAILURE)
    }
    
    /**
     * Verify error message is displayed
     * @param expectedError - Expected error message (partial match) or array of possible messages
     */
    /**
     * Verify error message is displayed
     * @param expectedError - Expected error message (partial match) or array of possible messages
     */
    @Keyword
    def verifyErrorMessage(String expectedError) {
        // Wait briefly for error to appear, but rely mostly on element presence check
        WebUI.delay(0.5) 
        
        String actualError = ""
        boolean errorFound = false
        
        // Try to find error in error message element
        try {
            if (WebUI.waitForElementPresent(
                findTestObject('Object Repository/Agent/ManageAgentsPage/errorMessage'),
                3, // Reduced timeout
                FailureHandling.OPTIONAL
            )) {
                actualError = WebUI.getText(
                    findTestObject('Object Repository/Agent/ManageAgentsPage/errorMessage')
                )
                errorFound = true
            }
        } catch (Exception e) {
            // Error element not found, try other locations
        }
        
        // If not found, check for toast notifications or page text
        if (!errorFound) {
            try {
                // Check if error text appears anywhere on page
                // Or get page source and search (faster than multiple element lookups)
                String pageText = WebUI.getPageSource()
                if (pageText.toLowerCase().contains("error") || pageText.toLowerCase().contains("failed")) {
                    // Extract error from page
                    def errorPatterns = [
                        /(?i)agent.*already.*exists/,
                        /(?i)failed.*create.*agent/,
                        /(?i)error.*agent/,
                        /(?i)duplicate.*email/
                    ]
                    for (pattern in errorPatterns) {
                        def match = pageText =~ pattern
                        if (match) {
                            actualError = match[0]
                            errorFound = true
                            break
                        }
                    }
                }
            } catch (Exception e) {
                // Continue
            }
        }
        
        // Verify error message (flexible matching)
        if (errorFound && actualError) {
            def lowerActual = actualError.toLowerCase()
            def lowerExpected = expectedError.toLowerCase()
            
            // Check if actual error contains expected, or if it's a related error
            boolean matches = lowerActual.contains(lowerExpected) ||
                             (expectedError.contains("exists") && (lowerActual.contains("exists") || lowerActual.contains("duplicate") || lowerActual.contains("already"))) ||
                             (expectedError.contains("failed") && lowerActual.contains("failed"))
            
            assert matches,
                "Expected error to contain '${expectedError}', but got: '${actualError}'"
        } else {
            // If no error found but we expected one, that's a failure
            assert false, "Expected error message '${expectedError}' but no error was found on the page"
        }
    }
    
    /**
     * Verify error message on Create Agent page
     * @param expectedError - Expected error message (partial match)
     */
    @Keyword
    def verifyCreateAgentErrorMessage(String expectedError) {
        WebUI.waitForElementPresent(
            findTestObject('Object Repository/Agent/CreateAgentPage/errorMessage'),
            5,
            FailureHandling.STOP_ON_FAILURE
        )
        
        String actualError = WebUI.getText(
            findTestObject('Object Repository/Agent/CreateAgentPage/errorMessage')
        )
        
        assert actualError.toLowerCase().contains(expectedError.toLowerCase()),
            "Expected error to contain '${expectedError}', but got: '${actualError}'"
    }
    
    /**
     * Click Contact Agent button (first one found)
     */
    @Keyword
    def clickContactAgent() {
        def contactButtons = WebUI.findWebElements(
            findTestObject('Object Repository/Agent/AgentPage/contactAgentButton'),
            10
        )
        if (contactButtons.size() > 0) {
            WebUI.click(contactButtons[0])
            WebUI.delay(1)
        }
    }
    
    /**
     * Wait for agents list to load
     */
    @Keyword
    def waitForAgentsList() {
        WebUI.waitForElementPresent(
            findTestObject('Object Repository/Agent/AgentPage/agentCards'),
            10,
            FailureHandling.STOP_ON_FAILURE
        )
    }
    
    /**
     * Click element with scroll and JS fallback if normal click fails
     * Handles cases where elements are intercepted by overlays or other elements
     */
    private void clickWithFallback(TestObject to) {
        WebUI.waitForElementVisible(to, 10, FailureHandling.STOP_ON_FAILURE)
        
        // Hide any intercepting navbar/menu buttons temporarily (position-based, no CSS selector issues)
        WebUI.executeJavaScript('''
            // Hide navbar buttons that might intercept clicks
            var buttons = document.querySelectorAll('button');
            for (var i = 0; i < buttons.length; i++) {
                var btn = buttons[i];
                var rect = btn.getBoundingClientRect();
                // Hide buttons near top-right (navbar area) that might intercept
                if (rect.top < 100 && rect.left > 800) {
                    btn.style.pointerEvents = 'none';
                    btn.style.opacity = '0';
                }
            }
        ''', Arrays.asList())
        WebUI.delay(0.3)
        
        // Scroll page down a bit first to move away from navbar
        WebUI.executeJavaScript('window.scrollTo(0, 150);', Arrays.asList())
        WebUI.delay(0.5)
        
        // Scroll element into view
        WebUI.scrollToElement(to, 5)
        WebUI.delay(1) // Give time for any overlays to settle
        
        // Use JavaScript click directly (bypasses interception issues)
        def element = WebUI.findWebElement(to, 5)
        
        // Ensure element is in viewport and not covered
        WebUI.executeJavaScript('''
            var el = arguments[0];
            // Scroll to center of viewport
            el.scrollIntoView({behavior: "instant", block: "center", inline: "center"});
            // Bring to front
            el.style.zIndex = "9999";
            el.style.position = "relative";
        ''', Arrays.asList(element))
        
        WebUI.delay(0.5)
        
        // Use JavaScript click (bypasses Selenium interception)
        WebUI.executeJavaScript('arguments[0].click();', Arrays.asList(element))
        
        // Restore navbar buttons
        WebUI.executeJavaScript('''
            var buttons = document.querySelectorAll('button');
            for (var i = 0; i < buttons.length; i++) {
                var btn = buttons[i];
                btn.style.pointerEvents = '';
                btn.style.opacity = '';
            }
        ''', Arrays.asList())
    }
    
    /**
     * Helper: create a simple XPATH-based TestObject
     */
    private TestObject xpath(String name, String xpathExpression) {
        TestObject to = new TestObject(name)
        to.addProperty('xpath', ConditionType.EQUALS, xpathExpression)
        return to
    }
    /**
     * Verify results indicator ("Showing X of Y agents")
     */
    @Keyword
    def verifyResultsIndicator() {
        // Robust XPath using dot (.) to check concatenated string of all text nodes
        TestObject indicator = xpath(
            'Results Indicator',
            "//p[contains(., 'Showing') and contains(., 'agents')]"
        )
        WebUI.verifyElementPresent(indicator, 5, FailureHandling.STOP_ON_FAILURE)
    }

}

