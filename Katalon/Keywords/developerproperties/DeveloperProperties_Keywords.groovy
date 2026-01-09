package developerproperties

import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject

import com.kms.katalon.core.annotation.Keyword
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import com.kms.katalon.core.model.FailureHandling
import com.kms.katalon.core.testobject.ConditionType
import com.kms.katalon.core.testobject.TestObject

import java.util.Date
import java.util.Map
import java.util.Arrays

/**
 * Developer Properties Keywords - Common functions for Developer Properties UI testing
 * 
 * This class contains reusable keywords for testing the Developer Properties web interface
 * including projects, properties, and developers management through the UI.
 */
public class DeveloperProperties_Keywords {
    
    private static final String BASE_URL = 'http://localhost:5173'
    private static final String PROJECTS_URL = "${BASE_URL}/my-projects"
    private static final String DEVELOPER_PROPERTIES_URL = "${BASE_URL}/developer-properties"
    private static final String DEVELOPERS_URL = "${BASE_URL}/manage-developer-properties"

    /**
     * Navigate to projects page
     */
    @Keyword
    def navigateToProjects() {
        // Try direct navigation first
        WebUI.navigateToUrl(PROJECTS_URL)
        WebUI.waitForPageLoad(10)
        if (WebUI.getUrl().contains('/my-projects')) {
            verifyProjectsPageLoaded()
            return
        }

        // Fallback: open user dropdown then click My Projects
        TestObject userMenuToggle = xpath('User menu toggle', "//button[.//div[contains(@class,'rounded-full')]]")
        if (WebUI.waitForElementPresent(userMenuToggle, 5, FailureHandling.OPTIONAL)) {
            WebUI.click(userMenuToggle)
            TestObject myProjectsLink = xpath('My Projects link', "//a[normalize-space(.)='My Projects']")
            if (WebUI.waitForElementClickable(myProjectsLink, 5, FailureHandling.OPTIONAL)) {
                WebUI.click(myProjectsLink)
                WebUI.waitForPageLoad(10)
            }
        }

        verifyProjectsPageLoaded()
    }
    
    /**
     * Verify projects page is loaded
     */
    @Keyword
    def verifyProjectsPageLoaded() {
        WebUI.waitForPageLoad(10)
        WebUI.waitForElementPresent(
            xpath('Add Project button', "//button[contains(normalize-space(.), 'Add Project') or contains(normalize-space(.), 'Create Project')]") ,
            10,
            FailureHandling.STOP_ON_FAILURE
        )
        WebUI.verifyMatch(WebUI.getUrl(), '.*?/my-projects/?$', true, FailureHandling.OPTIONAL)
    }
    
    /**
     * Click create project button
     */
    @Keyword
    def clickCreateProject() {
        // Handle empty-state CTA first
        TestObject firstProjectCta = xpath('First project CTA', "//button[contains(normalize-space(.), 'Create Your First Project')]")
        if (WebUI.waitForElementPresent(firstProjectCta, 3, FailureHandling.OPTIONAL)) {
            WebUI.click(firstProjectCta)
            WebUI.waitForPageLoad(5)
            verifyCreateProjectFormLoaded()
            return
        }

        // Standard add/create button
        TestObject addBtn = xpath('Add Project button', "//button[contains(normalize-space(.), 'Add Project') or contains(normalize-space(.), 'Create Project')]")
        WebUI.click(addBtn)
        WebUI.waitForPageLoad(5)
        verifyCreateProjectFormLoaded()
    }

    /**
     * Open edit form for the given project card
     */
    @Keyword
    def openProjectEditForm(String projectName) {
        waitForProjectsList()
        TestObject editBtn = xpath(
            'Edit project button',
            "//div[contains(@class,'rounded-lg') and .//h3[normalize-space()='${projectName}']]//button[contains(normalize-space(.), 'Edit')]"
        )
        clickWithFallback(editBtn)
        WebUI.waitForElementVisible(xpath('Project name input', "//input[@placeholder='Project Name' or @name='name']"), 10)
    }

    /**
     * Update project fields and submit the form
     */
    @Keyword
    def updateProject(String name, String description, String location) {
        TestObject nameInput = xpath('Project name input', "//input[@placeholder='Project Name' or @name='name']")
        TestObject descInput = xpath('Project description', "//textarea[@placeholder='Project Description' or @name='description']")
        TestObject locationInput = xpath('Project location', "//input[@placeholder='Location' or @name='location']")

        if (name != null) {
            WebUI.clearText(nameInput)
            WebUI.setText(nameInput, name)
        }
        if (description != null) {
            WebUI.clearText(descInput)
            WebUI.setText(descInput, description)
        }
        if (location != null) {
            WebUI.clearText(locationInput)
            WebUI.setText(locationInput, location)
        }

        WebUI.click(xpath('Project save button', "//button[@type='submit' or contains(normalize-space(.), 'Save') or contains(normalize-space(.), 'Update')]") )
        WebUI.delay(2)
    }

    /**
     * Delete a project card by name
     */
    @Keyword
    def deleteProject(String projectName) {
        waitForProjectsList()
        TestObject deleteBtn = xpath(
            'Delete project button',
            "//div[contains(@class,'rounded-lg') and .//h3[normalize-space()='${projectName}']]//button[contains(normalize-space(.), 'Delete')]"
        )
        clickWithFallback(deleteBtn)

        if (WebUI.waitForAlert(3, FailureHandling.OPTIONAL)) {
            WebUI.acceptAlert()
        }

        WebUI.delay(2)
        WebUI.verifyTextNotPresent(projectName, false, FailureHandling.OPTIONAL)
    }
    
    /**
     * Verify create project form is loaded
     */
    @Keyword
    def verifyCreateProjectFormLoaded() {
        WebUI.verifyElementPresent(xpath('Project name input', "//input[@placeholder='Project Name' or @name='name']"), 10, FailureHandling.STOP_ON_FAILURE)
        WebUI.verifyElementPresent(xpath('Project save button', "//button[@type='submit' or contains(normalize-space(.), 'Save Project')]") , 10, FailureHandling.STOP_ON_FAILURE)
    }
    
    /**
     * Fill and submit create project form
     * @param projectName - Name of the project
     * @param description - Project description
     * @param location - Project location
     */
    @Keyword
    def createProject(String projectName, String description = "Test project description", String location = "Test Location") {
        // Fill project name
        def nameInput = xpath('Project name input', "//input[@placeholder='Project Name' or @name='name']")
        WebUI.clearText(nameInput)
        WebUI.setText(nameInput, projectName)
        
        // Fill description
        def descriptionInput = xpath('Project description', "//textarea[@placeholder='Project Description' or @name='description']")
        WebUI.clearText(descriptionInput)
        WebUI.setText(descriptionInput, description)
        
        // Fill location
        def locationInput = xpath('Project location', "//input[@placeholder='Location' or @name='location']")
        WebUI.clearText(locationInput)
        WebUI.setText(locationInput, location)
        
        // Submit form
        WebUI.click(xpath('Project save button', "//button[@type='submit' or contains(normalize-space(.), 'Save Project')]") )
        WebUI.delay(2)
    }
    
    /**
     * Verify project creation was successful
     * @param projectName - Expected project name to verify
     */
    @Keyword
    def verifyProjectCreationSuccess(String projectName) {
        // Verify success message or redirect
        WebUI.verifyTextPresent(projectName, false, FailureHandling.OPTIONAL)
    }
    
    /**
     * Get count of projects displayed on the page
     * @return Integer count of projects
     */
    @Keyword
    def getProjectsCount() {
        WebUI.delay(1)
        
        // Try multiple strategies to count projects
        def strategies = [
            // Strategy 1: Find by h3 title elements (most reliable)
            "//div[contains(@class,'rounded-lg')]//h3",
            // Strategy 2: Find cards with Properties button
            "//div[contains(@class,'rounded-lg') and .//button[contains(normalize-space(.), 'Properties')]]",
            // Strategy 3: Find any card-like div with project content
            "//div[contains(@class,'card') or contains(@class,'project-card')]//h3",
            // Strategy 4: Count Properties buttons
            "//button[contains(normalize-space(.), 'Properties')]"
        ]
        
        for (xpathStr in strategies) {
            try {
                def elements = WebUI.findWebElements(xpath('Project cards', xpathStr), 3)
                if (elements != null && elements.size() > 0) {
                    return elements.size()
                }
            } catch (Exception e) {
                // Try next strategy
                continue
            }
        }
        
        // If all strategies fail, return 0
        WebUI.comment("⚠️ Warning: Could not count projects using any strategy")
        return 0
    }

    /**
     * Navigate directly to a project's properties page by ID
     */
    @Keyword
    def navigateToProjectProperties(String projectId) {
        String targetUrl = "${BASE_URL}/project/${projectId}/properties"

        // First attempt: direct URL
        WebUI.navigateToUrl(targetUrl)
        WebUI.waitForPageLoad(10)
        if (WebUI.getUrl().contains('/project/' + projectId + '/properties')) {
            WebUI.verifyTextPresent('Properties', false, FailureHandling.OPTIONAL)
            return
        }

        // Fallback: go via My Projects then retry the direct URL
        navigateToProjects()
        WebUI.navigateToUrl(targetUrl)
        WebUI.waitForPageLoad(10)
        WebUI.verifyTextPresent('Properties', false, FailureHandling.STOP_ON_FAILURE)
    }

    /**
     * Open the properties page for a project by clicking its card button
     */
    @Keyword
    def openPropertiesForProject(String projectName) {
        waitForProjectsList()
        def propertiesButton = xpath(
            'Project properties button',
            "//div[contains(@class,'rounded-lg') and .//h3[normalize-space()='${projectName}']]//button[contains(normalize-space(.), 'Properties')]"
        )
        clickWithFallback(propertiesButton)
        WebUI.waitForPageLoad(10)
    }

    /**
     * Open properties for the first visible project card (use when name is unknown)
     */
    @Keyword
    def openFirstProjectProperties() {
        waitForProjectsList()
        def firstPropertiesButton = xpath(
            'First project properties button',
            "(//div[contains(@class,'rounded-lg')]//button[contains(normalize-space(.), 'Properties')])[1]"
        )
        clickWithFallback(firstPropertiesButton)
        WebUI.waitForPageLoad(10)
    }

    /**
     * Wait for projects list/cards to load
     */
    @Keyword
    def waitForProjectsList() {
        WebUI.waitForElementPresent(xpath('Project card', "//div[contains(@class,'rounded-lg')]//h3"), 10)
    }

    /**
     * Navigate to the shared developer projects listing (New Projects)
     */
    @Keyword
    def navigateToDeveloperProjects() {
        WebUI.navigateToUrl(DEVELOPER_PROPERTIES_URL)
        WebUI.waitForPageLoad(10)
        WebUI.verifyMatch(WebUI.getUrl(), '.*?/developer-properties/?$', true, FailureHandling.OPTIONAL)
    }

    /**
     * Open a project card by its title on the developer projects page
     */
    @Keyword
    def openProjectCardByName(String projectName) {
        TestObject projectCard = xpath('Project card by name', "//h3[normalize-space()='${projectName}']")
        clickWithFallback(projectCard)
        WebUI.waitForPageLoad(10)
    }

    /**
     * Open a property card by title inside a project
     */
    @Keyword
    def openPropertyCardByTitle(String title) {
        TestObject propertyCard = xpath('Property card by title', "//h3[normalize-space()='${title}']")
        clickWithFallback(propertyCard)
        WebUI.waitForPageLoad(10)
    }

    /**
     * Verify properties list is loaded
     */
    @Keyword
    def verifyPropertiesListLoaded() {
        WebUI.waitForElementPresent(xpath('Property card title', "//h3"), 10)
    }

    /**
     * Click element with scroll and JS fallback if normal click fails
     */
    private void clickWithFallback(TestObject to) {
        WebUI.waitForElementVisible(to, 10, FailureHandling.STOP_ON_FAILURE)
        WebUI.scrollToElement(to, 5)
        try {
            WebUI.click(to)
        } catch (Exception ignored) {
            WebUI.executeJavaScript('arguments[0].click();', Arrays.asList(WebUI.findWebElement(to, 5)))
        }
    }

    /**
     * Click Add Property on the project properties page
     */
    @Keyword
    def clickAddProperty() {
        WebUI.click(xpath('Add Property button', "//button[contains(normalize-space(.), 'Add Property')]"))
        WebUI.waitForElementVisible(xpath('Property title input', "//input[@placeholder='Property Title']"), 10)
    }

    /**
     * Fill and submit the property form using UI controls
     */
    @Keyword
    def fillAndSubmitPropertyForm(Map propertyData) {
        WebUI.setText(xpath('Property title input', "//input[@placeholder='Property Title']"), propertyData.title)
        WebUI.setText(xpath('Property description', "//textarea[@placeholder='Description']"), propertyData.description)
        WebUI.setText(xpath('Property price', "//input[@placeholder='Price']"), propertyData.price)

        // Optional fields if provided
        if (propertyData.city) {
            WebUI.setText(xpath('City input', "//input[@placeholder='City']"), propertyData.city)
        }
        if (propertyData.state) {
            WebUI.setText(xpath('State input', "//input[@placeholder='State']"), propertyData.state)
        }
        if (propertyData.bedrooms) {
            WebUI.setText(xpath('Bedrooms input', "//input[@placeholder='Bedrooms']"), propertyData.bedrooms)
        }

        WebUI.click(xpath('Save property button', "//button[@type='submit' and (contains(normalize-space(.), 'Save') or contains(normalize-space(.), 'Create'))]"))
        WebUI.delay(2)
    }

    /**
     * Verify that a property with the given title is visible in the list
     */
    @Keyword
    def verifyPropertyVisible(String title) {
        WebUI.verifyTextPresent(title, false, FailureHandling.STOP_ON_FAILURE)
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
     * Navigate to properties page
     */
    @Keyword
    def navigateToProperties() {
        WebUI.navigateToUrl(DEVELOPER_PROPERTIES_URL)
        WebUI.waitForPageLoad(10)
        verifyPropertiesPageLoaded()
    }
    
    /**
     * Verify properties page is loaded
     */
    @Keyword
    def verifyPropertiesPageLoaded() {
        WebUI.verifyElementPresent(
            findTestObject('Object Repository/DeveloperProperties/PropertiesPage/createPropertyButton'),
            10,
            FailureHandling.STOP_ON_FAILURE
        )
        WebUI.verifyElementPresent(
            findTestObject('Object Repository/DeveloperProperties/PropertiesPage/propertiesList'),
            10,
            FailureHandling.STOP_ON_FAILURE
        )
    }
    
    /**
     * Navigate to developers page (admin only)
     */
    @Keyword
    def navigateToDevelopers() {
        WebUI.navigateToUrl(DEVELOPERS_URL)
        WebUI.waitForPageLoad(10)
        verifyDevelopersPageLoaded()
    }
    
    /**
     * Verify developers page is loaded
     */
    @Keyword
    def verifyDevelopersPageLoaded() {
        WebUI.verifyElementPresent(
            findTestObject('Object Repository/DeveloperProperties/DevelopersPage/developersList'),
            10,
            FailureHandling.STOP_ON_FAILURE
        )
    }
    
    /**
     * Get count of developers displayed on the page
     * @return Integer count of developers
     */
    @Keyword
    def getDevelopersCount() {
        def developerElements = WebUI.findWebElements(
            findTestObject('Object Repository/DeveloperProperties/DevelopersPage/developerItems'),
            10
        )
        return developerElements.size()
    }

    /**
     * Navigate to notifications page
     */
    @Keyword
    def navigateToNotifications() {
        WebUI.navigateToUrl("${BASE_URL}/notifications")
        WebUI.waitForPageLoad(10)
    }

    /**
     * Delete property by title
     * @param propertyTitle - Title of the property to delete
     */
    @Keyword
    def deleteProperty(String propertyTitle) {
        // Try multiple XPath strategies to locate the delete button
        def xpaths = [
            // Strategy 1: Find h3 title, go up to card, find delete button
            "//h3[normalize-space()='${propertyTitle}']//ancestor::*[contains(@class,'card') or contains(@class,'property')]//button[contains(normalize-space(.), 'Delete')]",
            // Strategy 2: Find any element with the title text, go up to card, find delete button
            "//*[normalize-space()='${propertyTitle}']//ancestor::*[contains(@class,'card') or contains(@class,'property')]//button[contains(normalize-space(.), 'Delete')]",
            // Strategy 3: Find title, go up to parent div, find delete button
            "//*[contains(text(),'${propertyTitle}')]//ancestor::div[contains(@class,'card') or contains(@class,'property') or contains(@class,'item')]//button[contains(., 'Delete') or contains(@class,'delete')]",
            // Strategy 4: Simple approach - find any delete button near the title
            "//*[contains(text(),'${propertyTitle}')]/following::button[contains(., 'Delete')][1]"
        ]
        
        def deleteBtn = null
        for (xpath in xpaths) {
            try {
                deleteBtn = xpath('Delete property button', xpath)
                if (WebUI.verifyElementPresent(deleteBtn, 2, FailureHandling.OPTIONAL)) {
                    break
                }
            } catch (Exception e) {
                // Try next strategy
                continue
            }
        }
        
        if (deleteBtn == null) {
            throw new Exception("Could not locate delete button for property: ${propertyTitle}")
        }
        
        clickWithFallback(deleteBtn)

        if (WebUI.waitForAlert(3, FailureHandling.OPTIONAL)) {
            WebUI.acceptAlert()
        }

        WebUI.delay(2)
    }

    /**
     * Get count of properties currently visible on the page
     * @return Integer count of properties
     */
    @Keyword
    def getPropertyCount() {
        WebUI.delay(1)
        
        // Try multiple strategies to count properties
        def strategies = [
            // Strategy 1: Count all h3 elements (property titles)
            "//h3",
            // Strategy 2: Count h3 with specific classes
            "//h3[contains(@class,'title') or contains(@class,'property-title') or contains(@class,'text')]",
            // Strategy 3: Count property cards by structure
            "//div[contains(@class,'card') or contains(@class,'property')]//h3",
            // Strategy 4: Count delete buttons (each property should have one)
            "//button[contains(normalize-space(.), 'Delete')]"
        ]
        
        for (xpathStr in strategies) {
            try {
                def elements = WebUI.findWebElements(xpath('Property cards', xpathStr), 3)
                if (elements != null && elements.size() > 0) {
                    return elements.size()
                }
            } catch (Exception e) {
                // Try next strategy
                continue
            }
        }
        
        // If all strategies fail, return 0
        WebUI.comment("⚠️ Warning: Could not count properties using any strategy")
        return 0
    }

    /**
     * Logout current user
     */
    @Keyword
    def logout() {
        // Try to click user menu
        TestObject userMenuToggle = xpath('User menu toggle', "//button[.//div[contains(@class,'rounded-full')]]")
        if (WebUI.waitForElementPresent(userMenuToggle, 5, FailureHandling.OPTIONAL)) {
            WebUI.click(userMenuToggle)
            TestObject logoutLink = xpath('Logout link', "//button[normalize-space(.)='Logout'] | //a[normalize-space(.)='Logout']")
            if (WebUI.waitForElementClickable(logoutLink, 5, FailureHandling.OPTIONAL)) {
                WebUI.click(logoutLink)
                WebUI.delay(2)
            }
        }
    }
}