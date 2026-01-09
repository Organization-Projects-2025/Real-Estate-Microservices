package authentication

import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.annotation.Keyword
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import com.kms.katalon.core.model.FailureHandling

/**
 * Login Keywords for Authentication Microservice
 * Provides reusable login functions for all test cases
 */
class Login_Keywords {
    
    private static final String BASE_URL = 'http://localhost:5173'
    private static final String LOGIN_URL = "${BASE_URL}/login"
    
    /**
     * Navigate to login page
     */
    @Keyword
    def navigateToLogin() {
        WebUI.navigateToUrl(LOGIN_URL)
        WebUI.waitForPageLoad(10)
        verifyLoginPageLoaded()
    }
    
    /**
     * Verify login page is loaded
     */
    @Keyword
    def verifyLoginPageLoaded() {
        WebUI.verifyElementPresent(
            findTestObject('Object Repository/Authentication/LoginPage/emailInput'),
            10,
            FailureHandling.STOP_ON_FAILURE
        )
        WebUI.verifyElementPresent(
            findTestObject('Object Repository/Authentication/LoginPage/passwordInput'),
            10,
            FailureHandling.STOP_ON_FAILURE
        )
    }
    
    /**
     * Perform login with email and password
     * @param email - User email
     * @param password - User password
     */
    @Keyword
    def login(String email, String password) {
        // Navigate if not already on login page
        if (!WebUI.getUrl().contains('/login')) {
            navigateToLogin()
        }
        
        // Clear and enter email
        WebUI.clearText(findTestObject('Object Repository/Authentication/LoginPage/emailInput'))
        WebUI.setText(findTestObject('Object Repository/Authentication/LoginPage/emailInput'), email)
        
        // Clear and enter password
        WebUI.clearText(findTestObject('Object Repository/Authentication/LoginPage/passwordInput'))
        WebUI.setText(findTestObject('Object Repository/Authentication/LoginPage/passwordInput'), password)
        
        // Click login button
        WebUI.click(findTestObject('Object Repository/Authentication/LoginPage/loginButton'))
        
        // Wait for navigation or error
        WebUI.delay(3)
        WebUI.waitForPageLoad(15)
    }
    
    /**
     * Quick login as Admin user (from seeded data)
     */
    @Keyword
    def loginAsAdmin() {
        login('admin@realestate.com', 'Password123!')
        WebUI.delay(2)
    }
    
    /**
     * Quick login as Developer user
     * @param number - Developer number (1-2)
     */
    @Keyword
    def loginAsDeveloper(int number = 1) {
        login("developer${number}@realestate.com", 'Password123!')
        WebUI.delay(2)
    }
    
    /**
     * Quick login as Agent user
     * @param number - Agent number (1-5)
     */
    @Keyword
    def loginAsAgent(int number = 1) {
        login("agent${number}@realestate.com", 'Password123!')
        WebUI.delay(2)
    }
    
    /**
     * Quick login as Regular User
     * @param number - User number (1-12)
     */
    @Keyword
    def loginAsUser(int number = 1) {
        login("user${number}@realestate.com", 'Password123!')
        WebUI.delay(2)
    }
    
    /**
     * Verify login was successful (redirected away from login page)
     */
    @Keyword
    def verifyLoginSuccess() {
        // Wait for page to change with longer timeout
        WebUI.waitForPageLoad(20)
        
        // Give extra time for redirect to complete
        WebUI.delay(2)
        
        String currentUrl = WebUI.getUrl()
        
        // Verify we're NOT on login page anymore
        assert !currentUrl.contains('/login'), 
            "Login failed: Still on login page. Current URL: ${currentUrl}"
        
        // Verify we're on home page (with or without trailing slash)
        assert currentUrl == BASE_URL || currentUrl == "${BASE_URL}/",
            "Login failed: Not redirected to home page. Current URL: ${currentUrl}"
    }
    
    /**
     * Verify login error message is displayed
     * @param expectedErrorText - Expected error message (partial match)
     */
    @Keyword
    def verifyLoginError(String expectedErrorText) {
        // Wait for error message to appear
        WebUI.waitForElementPresent(
            findTestObject('Object Repository/Authentication/LoginPage/errorMessage'),
            10,
            FailureHandling.STOP_ON_FAILURE
        )
        
        // Get error text
        String actualError = WebUI.getText(
            findTestObject('Object Repository/Authentication/LoginPage/errorMessage')
        )
        
        // Verify error contains expected text
        assert actualError.toLowerCase().contains(expectedErrorText.toLowerCase()),
            "Expected error to contain '${expectedErrorText}', but got: '${actualError}'"
    }
    
    /**
     * Verify login button is disabled during loading
     */
    @Keyword
    def verifyLoginLoading() {
        // Check if login button is disabled
        WebUI.verifyElementAttributeValue(
            findTestObject('Object Repository/Authentication/LoginPage/loginButton'),
            'disabled',
            'true',
            5,
            FailureHandling.OPTIONAL
        )
        
        // Or check for loading spinner
        WebUI.verifyElementPresent(
            findTestObject('Object Repository/Authentication/LoginPage/loadingSpinner'),
            5,
            FailureHandling.OPTIONAL
        )
    }
    
    /**
     * Click Forgot Password link
     */
    @Keyword
    def clickForgotPassword() {
        WebUI.click(findTestObject('Object Repository/Authentication/LoginPage/forgotPasswordLink'))
        WebUI.waitForPageLoad(10)
    }
    
    /**
     * Click Sign Up link
     */
    @Keyword
    def clickSignUp() {
        WebUI.click(findTestObject('Object Repository/Authentication/LoginPage/signUpLink'))
        WebUI.waitForPageLoad(10)
    }
    
    /**
     * Perform logout by clicking Sign Out button in user menu
     */
    @Keyword
    def logout() {
        // Click user menu to open dropdown
        WebUI.click(findTestObject('Object Repository/Common/Navbar/userMenuButton'))
        WebUI.delay(1)
        
        // Click Sign Out button
        WebUI.click(findTestObject('Object Repository/Common/Navbar/signOutButton'))
        WebUI.delay(2)
        WebUI.waitForPageLoad(10)
        
        // Verify redirected to login page
        String currentUrl = WebUI.getUrl()
        assert currentUrl.contains('/login'),
            "Logout failed: Not redirected to login page. Current URL: ${currentUrl}"
    }
    
    /**
     * Verify HTML5 validation message appears on email input
     * @param expectedMessage - Expected validation message (partial match)
     */
    @Keyword
    def verifyEmailValidationMessage(String expectedMessage) {
        String validationMessage = WebUI.executeJavaScript(
            "return document.querySelector('input[type=\"email\"]').validationMessage;",
            null
        )
        
        assert validationMessage != null && validationMessage != '',
            "No HTML5 validation message found on email input"
        
        assert validationMessage.toLowerCase().contains(expectedMessage.toLowerCase()),
            "Expected validation message to contain '${expectedMessage}', but got: '${validationMessage}'"
    }
}
