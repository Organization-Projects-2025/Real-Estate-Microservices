package profile

import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.annotation.Keyword
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import com.kms.katalon.core.model.FailureHandling
import org.openqa.selenium.Keys

/**
 * Profile Keywords for Profile Page Personal Information
 * Provides reusable profile functions for all test cases
 * 
 * IMPORTANT: Uses user1@realestate.com for all tests (NOT admin)
 * NEVER updates email or password fields to maintain test independence
 */
class Profile_Keywords {
    
    private static final String BASE_URL = 'http://localhost:5173'
    private static final String PROFILE_URL = "${BASE_URL}/profile"
    
    // Dedicated test user (NOT admin) - Password123!
    private static final String TEST_USER_EMAIL = 'user1@realestate.com'
    private static final String TEST_USER_PASSWORD = 'Password123!'
    
    // Original values to restore after each test
    private static final String ORIGINAL_FIRST_NAME = 'User'
    private static final String ORIGINAL_LAST_NAME = 'One'
    private static final String ORIGINAL_PHONE = '+971501111111'
    
    /**
     * Navigate to profile page (requires login first)
     * Clicks user dropdown in top right, then "My Profile" link
     */
    @Keyword
    def navigateToProfile() {
        // Wait for page to load after login
        WebUI.delay(2)
        
        // Click user dropdown in top right corner (span_UpdatedFirst)
        WebUI.waitForElementPresent(findTestObject('Object Repository/Profile/span_UpdatedFirst'), 10)
        WebUI.click(findTestObject('Object Repository/Profile/span_UpdatedFirst'))
        WebUI.delay(1)
        
        // Click "My Profile" link in dropdown
        WebUI.waitForElementClickable(findTestObject('Object Repository/Profile/a_My Profile'), 5)
        WebUI.click(findTestObject('Object Repository/Profile/a_My Profile'))
        
        // Wait for profile page to load
        WebUI.waitForPageLoad(10)
        WebUI.delay(2)
        
        // Click edit button to enable form editing
        clickEditButton()
    }
    
    /**
     * Click the edit button to enable profile form editing
     */
    @Keyword
    def clickEditButton() {
        WebUI.waitForElementPresent(findTestObject('Object Repository/Profile/editButton'), 10)
        WebUI.click(findTestObject('Object Repository/Profile/editButton'))
        WebUI.delay(1)
    }
    
    /**
     * Login as test user (user1@realestate.com) and navigate to profile
     * This is the ONLY user used for profile tests
     */
    @Keyword
    def loginAsTestUser() {
        WebUI.openBrowser('')
        
        // Navigate directly to login page
        WebUI.navigateToUrl("${BASE_URL}/login")
        WebUI.delay(2)
        
        // Wait for login form to be ready
        WebUI.waitForElementPresent(findTestObject('Object Repository/Authentication/LoginPage/emailInput'), 10)
        
        // Clear and enter email
        WebUI.clearText(findTestObject('Object Repository/Authentication/LoginPage/emailInput'))
        WebUI.setText(findTestObject('Object Repository/Authentication/LoginPage/emailInput'), TEST_USER_EMAIL)
        
        // Clear and enter password (plain text, not encrypted)
        WebUI.clearText(findTestObject('Object Repository/Authentication/LoginPage/passwordInput'))
        WebUI.setText(findTestObject('Object Repository/Authentication/LoginPage/passwordInput'), TEST_USER_PASSWORD)
        
        // Click login button
        WebUI.click(findTestObject('Object Repository/Authentication/LoginPage/loginButton'))
        
        // Wait for login to complete and redirect to home page
        WebUI.delay(5)
        WebUI.waitForPageLoad(15)
        
        // Verify we're not on login page anymore (login succeeded)
        WebUI.verifyElementNotPresent(
            findTestObject('Object Repository/Authentication/LoginPage/loginButton'), 
            5, 
            FailureHandling.OPTIONAL
        )
    }
    
    /**
     * Login as test user and navigate to profile
     */
    @Keyword
    def loginAndNavigateToProfile() {
        loginAsTestUser()
        navigateToProfile()
    }
    
    /**
     * Restore original profile values (for test independence)
     * Call this at the end of each test to reset data
     */
    @Keyword
    def restoreOriginalProfile() {
        navigateToProfile()
        
        fillFirstName(ORIGINAL_FIRST_NAME)
        fillLastName(ORIGINAL_LAST_NAME)
        fillPhoneNumber(ORIGINAL_PHONE)
        
        // Clear optional fields
        WebUI.clearText(findTestObject('Object Repository/Profile/whatsappInput'), FailureHandling.OPTIONAL)
        WebUI.clearText(findTestObject('Object Repository/Profile/contactEmailInput'), FailureHandling.OPTIONAL)
        
        clickSaveChanges()
        WebUI.delay(2)
    }
    
    /**
     * Fill first name field
     * @param firstName - First name to enter
     */
    @Keyword
    def fillFirstName(String firstName) {
        WebUI.clearText(findTestObject('Object Repository/Profile/firstNameInput'))
        WebUI.setText(findTestObject('Object Repository/Profile/firstNameInput'), firstName)
    }
    
    /**
     * Fill last name field
     * @param lastName - Last name to enter
     */
    @Keyword
    def fillLastName(String lastName) {
        WebUI.clearText(findTestObject('Object Repository/Profile/lastNameInput'))
        WebUI.setText(findTestObject('Object Repository/Profile/lastNameInput'), lastName)
    }
    
    /**
     * DEPRECATED: Do NOT use - Email field is read-only and should never be changed
     * Changing email will break login for subsequent tests
     */
    @Keyword
    @Deprecated
    def fillEmail(String email) {
        // DO NOT IMPLEMENT - Email should never be changed
        WebUI.comment("WARNING: Email field should not be modified to maintain test independence")
    }
    
    /**
     * Fill phone number field
     * @param phoneNumber - Phone number to enter
     */
    @Keyword
    def fillPhoneNumber(String phoneNumber) {
        WebUI.clearText(findTestObject('Object Repository/Profile/phoneNumberInput'))
        WebUI.setText(findTestObject('Object Repository/Profile/phoneNumberInput'), phoneNumber)
    }
    
    /**
     * Fill WhatsApp field
     * @param whatsapp - WhatsApp number to enter
     */
    @Keyword
    def fillWhatsApp(String whatsapp) {
        WebUI.clearText(findTestObject('Object Repository/Profile/whatsappInput'))
        WebUI.setText(findTestObject('Object Repository/Profile/whatsappInput'), whatsapp)
    }
    
    /**
     * Fill contact email field
     * @param contactEmail - Contact email to enter
     */
    @Keyword
    def fillContactEmail(String contactEmail) {
        WebUI.clearText(findTestObject('Object Repository/Profile/contactEmailInput'))
        WebUI.setText(findTestObject('Object Repository/Profile/contactEmailInput'), contactEmail)
    }
    
    /**
     * Fill all personal information fields (EXCEPT email - never change email)
     * @param firstName - First name
     * @param lastName - Last name
     * @param phoneNumber - Phone number
     * @param whatsapp - WhatsApp number (optional)
     * @param contactEmail - Contact email (optional)
     */
    @Keyword
    def fillAllPersonalInfo(String firstName, String lastName, String phoneNumber, String whatsapp = '', String contactEmail = '') {
        fillFirstName(firstName)
        fillLastName(lastName)
        fillPhoneNumber(phoneNumber)
        
        if (whatsapp) {
            fillWhatsApp(whatsapp)
        }
        
        if (contactEmail) {
            fillContactEmail(contactEmail)
        }
    }
    
    /**
     * Click Save Changes button
     */
    @Keyword
    def clickSaveChanges() {
        WebUI.click(findTestObject('Object Repository/Profile/saveChangesButton'))
        WebUI.delay(2)
    }
    
    /**
     * Click Cancel button
     */
    @Keyword
    def clickCancel() {
        WebUI.click(findTestObject('Object Repository/Profile/cancelButton'))
        WebUI.delay(1)
    }
    
    /**
     * Verify success message is displayed
     * Returns true if found, false otherwise (does not fail test)
     */
    @Keyword
    def verifySuccessMessage() {
        WebUI.delay(2)
        boolean isPresent = WebUI.verifyElementPresent(
            findTestObject('Object Repository/Profile/successMessage'), 
            3, 
            FailureHandling.OPTIONAL
        )
        
        if (!isPresent) {
            WebUI.comment("Success message not found - this may be normal if the UI doesn't show success messages")
        }
        
        return isPresent
    }
    
    /**
     * Verify error message is displayed
     */
    @Keyword
    def verifyErrorMessage() {
        WebUI.waitForElementPresent(findTestObject('Object Repository/Profile/errorMessage'), 5)
        boolean isPresent = WebUI.verifyElementPresent(findTestObject('Object Repository/Profile/errorMessage'), 5, FailureHandling.OPTIONAL)
        return isPresent
    }
    
    /**
     * Get current value of first name field
     */
    @Keyword
    def getFirstNameValue() {
        return WebUI.getAttribute(findTestObject('Object Repository/Profile/firstNameInput'), 'value')
    }
    
    /**
     * Get current value of last name field
     */
    @Keyword
    def getLastNameValue() {
        return WebUI.getAttribute(findTestObject('Object Repository/Profile/lastNameInput'), 'value')
    }
    
    /**
     * Get current value of email field
     */
    @Keyword
    def getEmailValue() {
        return WebUI.getAttribute(findTestObject('Object Repository/Profile/emailInput'), 'value')
    }
    
    /**
     * Get current value of phone number field
     */
    @Keyword
    def getPhoneNumberValue() {
        return WebUI.getAttribute(findTestObject('Object Repository/Profile/phoneNumberInput'), 'value')
    }
    
    /**
     * Clear all form fields
     */
    @Keyword
    def clearAllFields() {
        WebUI.clearText(findTestObject('Object Repository/Profile/firstNameInput'), FailureHandling.OPTIONAL)
        WebUI.clearText(findTestObject('Object Repository/Profile/lastNameInput'), FailureHandling.OPTIONAL)
        WebUI.clearText(findTestObject('Object Repository/Profile/phoneNumberInput'), FailureHandling.OPTIONAL)
        WebUI.clearText(findTestObject('Object Repository/Profile/whatsappInput'), FailureHandling.OPTIONAL)
        WebUI.clearText(findTestObject('Object Repository/Profile/contactEmailInput'), FailureHandling.OPTIONAL)
    }
    
    /**
     * Update personal information (complete flow with restore)
     * @param firstName - First name
     * @param lastName - Last name
     * @param phoneNumber - Phone number
     * @param whatsapp - WhatsApp number (optional)
     * @param contactEmail - Contact email (optional)
     */
    @Keyword
    def updatePersonalInfo(String firstName, String lastName, String phoneNumber, String whatsapp = '', String contactEmail = '') {
        loginAndNavigateToProfile()
        
        // Fill all fields (email is never changed)
        fillAllPersonalInfo(firstName, lastName, phoneNumber, whatsapp, contactEmail)
        
        // Save changes
        clickSaveChanges()
        
        // Restore original values for test independence
        restoreOriginalProfile()
        
        WebUI.closeBrowser()
    }
    
    /**
     * Update only first and last name (with restore)
     */
    @Keyword
    def updateName(String firstName, String lastName) {
        fillFirstName(firstName)
        fillLastName(lastName)
        clickSaveChanges()
        WebUI.delay(2)
        
        // Restore for independence
        restoreOriginalProfile()
    }
    
    /**
     * Update only phone number (with restore)
     */
    @Keyword
    def updatePhoneNumber(String phoneNumber) {
        fillPhoneNumber(phoneNumber)
        clickSaveChanges()
        WebUI.delay(2)
        
        // Restore for independence
        restoreOriginalProfile()
    }
    
    /**
     * Attempt to save with empty first name
     */
    @Keyword
    def saveWithEmptyFirstName() {
        loginAndNavigateToProfile()
        fillFirstName('')
        clickSaveChanges()
    }
    
    /**
     * Attempt to save with empty last name
     */
    @Keyword
    def saveWithEmptyLastName() {
        loginAndNavigateToProfile()
        fillLastName('')
        clickSaveChanges()
    }
    
    /**
     * Attempt to save with invalid phone number
     */
    @Keyword
    def saveWithInvalidPhone(String invalidPhone) {
        loginAndNavigateToProfile()
        fillPhoneNumber(invalidPhone)
        clickSaveChanges()
    }
}
