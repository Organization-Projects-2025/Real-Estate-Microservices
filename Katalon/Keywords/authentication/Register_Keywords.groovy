package authentication

import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.annotation.Keyword
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import com.kms.katalon.core.model.FailureHandling

/**
 * Register Keywords for Authentication Microservice
 * Provides reusable registration functions
 */
class Register_Keywords {
    
    private static final String BASE_URL = 'http://localhost:5173'
    private static final String REGISTER_URL = "${BASE_URL}/register"
    
    /**
     * Navigate to register page
     */
    @Keyword
    def navigateToRegister() {
        WebUI.navigateToUrl(REGISTER_URL)
        WebUI.waitForPageLoad(10)
        verifyRegisterPageLoaded()
    }
    
    /**
     * Verify register page is loaded
     */
    @Keyword
    def verifyRegisterPageLoaded() {
        WebUI.verifyElementPresent(
            findTestObject('Object Repository/Authentication/RegisterPage/firstNameInput'),
            10,
            FailureHandling.STOP_ON_FAILURE
        )
        WebUI.verifyElementPresent(
            findTestObject('Object Repository/Authentication/RegisterPage/registerButton'),
            10,
            FailureHandling.STOP_ON_FAILURE
        )
    }
    
    /**
     * Register a new user with all fields
     * @param firstName - First name
     * @param lastName - Last name
     * @param email - Email address
     * @param password - Password
     * @param role - Role (user or developer)
     */
    @Keyword
    def register(String firstName, String lastName, String email, String password, String role = 'user') {
        // Navigate if not already on register page
        if (!WebUI.getUrl().contains('/register')) {
            navigateToRegister()
        }
        
        // Fill first name
        WebUI.clearText(findTestObject('Object Repository/Authentication/RegisterPage/firstNameInput'))
        WebUI.setText(findTestObject('Object Repository/Authentication/RegisterPage/firstNameInput'), firstName)
        
        // Fill last name
        WebUI.clearText(findTestObject('Object Repository/Authentication/RegisterPage/lastNameInput'))
        WebUI.setText(findTestObject('Object Repository/Authentication/RegisterPage/lastNameInput'), lastName)
        
        // Fill email
        WebUI.clearText(findTestObject('Object Repository/Authentication/RegisterPage/emailInput'))
        WebUI.setText(findTestObject('Object Repository/Authentication/RegisterPage/emailInput'), email)
        
        // Fill password
        WebUI.clearText(findTestObject('Object Repository/Authentication/RegisterPage/passwordInput'))
        WebUI.setText(findTestObject('Object Repository/Authentication/RegisterPage/passwordInput'), password)
        
        // Select role
        WebUI.selectOptionByValue(
            findTestObject('Object Repository/Authentication/RegisterPage/roleSelect'),
            role,
            false
        )
        
        // Click register button
        WebUI.click(findTestObject('Object Repository/Authentication/RegisterPage/registerButton'))
        
        // Wait for response
        WebUI.delay(3)
    }
    
    /**
     * Register as User (default role)
     */
    @Keyword
    def registerAsUser(String firstName, String lastName, String email, String password) {
        register(firstName, lastName, email, password, 'user')
    }
    
    /**
     * Register as Developer
     */
    @Keyword
    def registerAsDeveloper(String firstName, String lastName, String email, String password) {
        register(firstName, lastName, email, password, 'developer')
    }
    
    /**
     * Generate unique email for testing
     * @param prefix - Email prefix
     * @return Unique email address
     */
    @Keyword
    def generateUniqueEmail(String prefix = 'testuser') {
        long timestamp = System.currentTimeMillis()
        return "${prefix}${timestamp}@test.com"
    }
    
    /**
     * Verify registration was successful (redirected to home)
     */
    @Keyword
    def verifyRegistrationSuccess() {
        WebUI.waitForPageLoad(10)
        String currentUrl = WebUI.getUrl()
        
        // Verify we're NOT on register page anymore
        assert !currentUrl.contains('/register'),
            "Registration failed: Still on register page. Current URL: ${currentUrl}"
        
        // Verify we're on home page (with or without trailing slash)
        assert currentUrl == BASE_URL || currentUrl == "${BASE_URL}/",
            "Registration failed: Not redirected to home page. Current URL: ${currentUrl}"
    }
    
    /**
     * Verify registration error message
     * @param expectedErrorText - Expected error message
     */
    @Keyword
    def verifyRegistrationError(String expectedErrorText) {
        WebUI.waitForElementPresent(
            findTestObject('Object Repository/Authentication/RegisterPage/errorMessage'),
            10,
            FailureHandling.STOP_ON_FAILURE
        )
        
        String actualError = WebUI.getText(
            findTestObject('Object Repository/Authentication/RegisterPage/errorMessage')
        )
        
        assert actualError.toLowerCase().contains(expectedErrorText.toLowerCase()),
            "Expected error to contain '${expectedErrorText}', but got: '${actualError}'"
    }
    
    /**
     * Verify password requirements are displayed
     */
    @Keyword
    def verifyPasswordRequirementsDisplayed() {
        WebUI.verifyElementPresent(
            findTestObject('Object Repository/Authentication/RegisterPage/passwordRequirements'),
            10,
            FailureHandling.STOP_ON_FAILURE
        )
    }
    
    /**
     * Click login link to go to login page
     */
    @Keyword
    def clickLoginLink() {
        WebUI.click(findTestObject('Object Repository/Authentication/RegisterPage/loginLink'))
        WebUI.waitForPageLoad(10)
    }
}
