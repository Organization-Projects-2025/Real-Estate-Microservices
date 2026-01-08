package navigation

import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.annotation.Keyword
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import com.kms.katalon.core.model.FailureHandling

/**
 * Navigation Keywords for testing website navigation
 * Provides reusable navigation functions for all test cases
 */
class Navigation_Keywords {
    
    private static final String BASE_URL = 'http://localhost:5173'
    
    // Test user credentials
    private static final String TEST_USER_EMAIL = 'user1@realestate.com'
    private static final String TEST_USER_PASSWORD = 'Password123!'
    
    /**
     * Open browser and navigate to home page
     */
    @Keyword
    def openHomePage() {
        WebUI.openBrowser('')
        WebUI.navigateToUrl(BASE_URL)
        WebUI.maximizeWindow()
        WebUI.waitForPageLoad(10)
        WebUI.delay(2)
    }
    
    /**
     * Login as test user
     */
    @Keyword
    def loginAsTestUser() {
        WebUI.navigateToUrl("${BASE_URL}/login")
        WebUI.delay(2)
        
        WebUI.waitForElementPresent(findTestObject('Object Repository/Authentication/LoginPage/emailInput'), 10)
        WebUI.setText(findTestObject('Object Repository/Authentication/LoginPage/emailInput'), TEST_USER_EMAIL)
        WebUI.setText(findTestObject('Object Repository/Authentication/LoginPage/passwordInput'), TEST_USER_PASSWORD)
        WebUI.click(findTestObject('Object Repository/Authentication/LoginPage/loginButton'))
        
        WebUI.delay(3)
        WebUI.waitForPageLoad(10)
    }
    
    /**
     * Click main navigation link by name
     * @param linkName - Name of the link (Buy, Rent, Sell, Agents, New Projects)
     */
    @Keyword
    def clickMainNavLink(String linkName) {
        def objectPath = "Object Repository/Navigation/MainNav/link_${linkName}"
        WebUI.waitForElementClickable(findTestObject(objectPath), 10)
        WebUI.click(findTestObject(objectPath))
        WebUI.delay(2)
        WebUI.waitForPageLoad(10)
    }
    
    /**
     * Click logo to navigate home
     */
    @Keyword
    def clickLogo() {
        WebUI.waitForElementClickable(findTestObject('Object Repository/Navigation/MainNav/link_Logo'), 10)
        WebUI.click(findTestObject('Object Repository/Navigation/MainNav/link_Logo'))
        WebUI.delay(2)
        WebUI.waitForPageLoad(10)
    }
    
    /**
     * Click user dropdown to open menu
     */
    @Keyword
    def openUserDropdown() {
        WebUI.waitForElementClickable(findTestObject('Object Repository/Navigation/UserMenu/button_UserDropdown'), 10)
        WebUI.click(findTestObject('Object Repository/Navigation/UserMenu/button_UserDropdown'))
        WebUI.delay(1)
    }
    
    /**
     * Click menu item in user dropdown
     * @param menuItem - Name of menu item (My Profile, Become an Agent, etc.)
     */
    @Keyword
    def clickUserMenuItem(String menuItem) {
        openUserDropdown()
        def objectPath = "Object Repository/Navigation/UserMenu/link_${menuItem.replaceAll(' ', '')}"
        WebUI.waitForElementClickable(findTestObject(objectPath), 5)
        WebUI.click(findTestObject(objectPath))
        WebUI.delay(2)
        WebUI.waitForPageLoad(10)
    }
    
    /**
     * Click Sign In button (when not authenticated)
     */
    @Keyword
    def clickSignIn() {
        WebUI.waitForElementClickable(findTestObject('Object Repository/Navigation/Auth/link_SignIn'), 10)
        WebUI.click(findTestObject('Object Repository/Navigation/Auth/link_SignIn'))
        WebUI.delay(2)
        WebUI.waitForPageLoad(10)
    }
    
    /**
     * Click Get Started button (when not authenticated)
     */
    @Keyword
    def clickGetStarted() {
        WebUI.waitForElementClickable(findTestObject('Object Repository/Navigation/Auth/link_GetStarted'), 10)
        WebUI.click(findTestObject('Object Repository/Navigation/Auth/link_GetStarted'))
        WebUI.delay(2)
        WebUI.waitForPageLoad(10)
    }
    
    /**
     * Verify current URL matches expected path
     * @param expectedPath - Expected URL path (e.g., '/buy', '/profile')
     */
    @Keyword
    def verifyCurrentUrl(String expectedPath) {
        String currentUrl = WebUI.getUrl()
        String expectedUrl = "${BASE_URL}${expectedPath}"
        WebUI.verifyMatch(currentUrl, expectedUrl, false, FailureHandling.STOP_ON_FAILURE)
    }
    
    /**
     * Verify page title contains expected text
     * @param expectedText - Expected text in page title
     */
    @Keyword
    def verifyPageTitle(String expectedText) {
        WebUI.verifyElementPresent(
            findTestObject('Object Repository/Navigation/Common/pageTitle', [('titleText'): expectedText]), 
            5, 
            FailureHandling.OPTIONAL
        )
    }
    
    /**
     * Verify user dropdown is visible (user is logged in)
     */
    @Keyword
    def verifyUserDropdownVisible() {
        boolean isVisible = WebUI.verifyElementPresent(
            findTestObject('Object Repository/Navigation/UserMenu/button_UserDropdown'), 
            5, 
            FailureHandling.OPTIONAL
        )
        return isVisible
    }
    
    /**
     * Verify auth buttons are visible (user is not logged in)
     */
    @Keyword
    def verifyAuthButtonsVisible() {
        boolean signInVisible = WebUI.verifyElementPresent(
            findTestObject('Object Repository/Navigation/Auth/link_SignIn'), 
            5, 
            FailureHandling.OPTIONAL
        )
        boolean getStartedVisible = WebUI.verifyElementPresent(
            findTestObject('Object Repository/Navigation/Auth/link_GetStarted'), 
            5, 
            FailureHandling.OPTIONAL
        )
        return signInVisible && getStartedVisible
    }
    
    /**
     * Navigate to specific page directly
     * @param path - URL path (e.g., '/buy', '/profile')
     */
    @Keyword
    def navigateToPage(String path) {
        WebUI.navigateToUrl("${BASE_URL}${path}")
        WebUI.delay(2)
        WebUI.waitForPageLoad(10)
    }
}
