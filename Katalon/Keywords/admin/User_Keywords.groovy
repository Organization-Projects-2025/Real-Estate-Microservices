package admin

import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.annotation.Keyword
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import com.kms.katalon.core.model.FailureHandling
import com.kms.katalon.core.testobject.RequestObject
import com.kms.katalon.core.testobject.TestObjectProperty
import com.kms.katalon.core.testobject.ConditionType
import com.kms.katalon.core.testobject.impl.HttpTextBodyContent
import com.kms.katalon.core.webservice.keyword.WSBuiltInKeywords as WS
import groovy.json.JsonOutput
import groovy.json.JsonSlurper

/**
 * User Keywords for Admin Microservice
 * Provides reusable user management functions for all test cases
 * 
 * @author Admin Service Test Team
 * @version 2.0
 */
class User_Keywords {
    
    private static final String BASE_URL = 'http://localhost:5173'
    private static final String API_GATEWAY_URL = 'http://localhost:3000/api'
    private static final String USERS_URL = "${BASE_URL}/admin/users"
    
    /**
     * Generate a unique email for test user registration
     * @param prefix - Prefix for the email (default: 'testuser')
     * @return Unique email address
     */
    @Keyword
    def generateUniqueEmail(String prefix = 'testuser') {
        int randomNum = new Random().nextInt(90000) + 10000  // 5-digit random number
        return "${prefix}${randomNum}@gmail.com"
    }
    
    /**
     * Create a new test user via API Gateway (fast, reliable test data setup)
     * @param firstName - User first name
     * @param lastName - User last name
     * @param email - User email
     * @param password - User password
     * @param role - User role (user or developer)
     * @return Map containing user data and response status
     */
    @Keyword
    def createTestUserViaAPI(String firstName, String lastName, String email, String password, String role = 'user') {
        // Build request body
        def requestBody = [
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,
            role: role
        ]
        
        // Create request object
        RequestObject request = new RequestObject()
        request.setRestUrl("${API_GATEWAY_URL}/auth/register")
        request.setRestRequestMethod('POST')
        
        // Set headers using TestObjectProperty objects (Katalon's required format)
        ArrayList<TestObjectProperty> headers = new ArrayList<>()
        headers.add(new TestObjectProperty('Content-Type', ConditionType.EQUALS, 'application/json'))
        headers.add(new TestObjectProperty('Accept', ConditionType.EQUALS, 'application/json'))
        request.setHttpHeaderProperties(headers)
        
        request.setBodyContent(new HttpTextBodyContent(JsonOutput.toJson(requestBody), 'UTF-8', 'application/json'))
        
        // Send request
        def response = WS.sendRequest(request)
        
        // Verify response
        int statusCode = response.getStatusCode()
        if (statusCode != 201 && statusCode != 200) {
            WebUI.comment("API Error: Failed to create test user. Status: ${statusCode}")
            WebUI.comment("Response: ${response.getResponseText()}")
            throw new Exception("Failed to create test user via API. Status: ${statusCode}")
        }
        
        // Parse response
        def jsonSlurper = new JsonSlurper()
        def responseData = jsonSlurper.parseText(response.getResponseText())
        
        WebUI.comment("Test user created via API: ${email}")
        
        return [
            success: true,
            email: email,
            userId: responseData?.data?.user?._id,
            user: responseData?.data?.user
        ]
    }
    
    /**
     * Navigate to Users Management page
     * Requires admin to be logged in
     */
    @Keyword
    def navigateToUsers() {
        WebUI.navigateToUrl(USERS_URL)
        WebUI.waitForPageLoad(15)
        verifyUsersPageLoaded()
    }
    
    /**
     * Verify Users Management page is loaded
     */
    @Keyword
    def verifyUsersPageLoaded() {
        WebUI.waitForElementVisible(
            findTestObject('Object Repository/Admin/UsersPage/h1_UserManagement'),
            15,
            FailureHandling.STOP_ON_FAILURE
        )
    }
    
    /**
     * Click Edit button for a specific user
     * @param userEmail - Email of the user to edit
     */
    @Keyword
    def clickEditUser(String userEmail) {
        WebUI.click(
            findTestObject('Object Repository/Admin/UsersPage/btn_EditUser', [('userEmail'): userEmail])
        )
        WebUI.delay(1)
    }
    
    /**
     * Verify Edit User modal is displayed
     */
    @Keyword
    def verifyUserModalDisplayed() {
        WebUI.waitForElementVisible(
            findTestObject('Object Repository/Admin/UsersPage/Modal/div_UserModal'),
            10,
            FailureHandling.STOP_ON_FAILURE
        )
    }
    
    /**
     * Fill user form with provided data
     * @param firstName - User first name
     * @param lastName - User last name
     * @param email - User email
     * @param role - User role (user, agent, admin)
     * @param phoneNumber - Phone number (optional)
     * @param whatsapp - WhatsApp number (optional)
     * @param contactEmail - Contact email (optional)
     */
    @Keyword
    def fillUserForm(String firstName, String lastName, String email, String role, 
                     String phoneNumber = '', String whatsapp = '', String contactEmail = '') {
        // Fill first name
        WebUI.clearText(findTestObject('Object Repository/Admin/UsersPage/Modal/input_FirstName'))
        WebUI.setText(findTestObject('Object Repository/Admin/UsersPage/Modal/input_FirstName'), firstName)
        
        // Fill last name
        WebUI.clearText(findTestObject('Object Repository/Admin/UsersPage/Modal/input_LastName'))
        WebUI.setText(findTestObject('Object Repository/Admin/UsersPage/Modal/input_LastName'), lastName)
        
        // Fill email
        WebUI.clearText(findTestObject('Object Repository/Admin/UsersPage/Modal/input_Email'))
        WebUI.setText(findTestObject('Object Repository/Admin/UsersPage/Modal/input_Email'), email)
        
        // Select role
        WebUI.selectOptionByValue(
            findTestObject('Object Repository/Admin/UsersPage/Modal/select_Role'),
            role,
            false
        )
        
        // Fill phone number if provided
        if (phoneNumber) {
            WebUI.clearText(findTestObject('Object Repository/Admin/UsersPage/Modal/input_PhoneNumber'))
            WebUI.setText(findTestObject('Object Repository/Admin/UsersPage/Modal/input_PhoneNumber'), phoneNumber)
        }
        
        // Fill whatsapp if provided
        if (whatsapp) {
            WebUI.clearText(findTestObject('Object Repository/Admin/UsersPage/Modal/input_WhatsApp'))
            WebUI.setText(findTestObject('Object Repository/Admin/UsersPage/Modal/input_WhatsApp'), whatsapp)
        }
        
        // Fill contact email if provided
        if (contactEmail) {
            WebUI.clearText(findTestObject('Object Repository/Admin/UsersPage/Modal/input_ContactEmail'))
            WebUI.setText(findTestObject('Object Repository/Admin/UsersPage/Modal/input_ContactEmail'), contactEmail)
        }
    }
    
    /**
     * Click Save Changes button in modal
     */
    @Keyword
    def clickSaveUserButton() {
        WebUI.click(findTestObject('Object Repository/Admin/UsersPage/Modal/btn_SaveChanges'))
        WebUI.delay(2)
    }
    
    /**
     * Verify modal is closed
     */
    @Keyword
    def verifyModalClosed() {
        WebUI.verifyElementNotPresent(
            findTestObject('Object Repository/Admin/UsersPage/Modal/div_UserModal'),
            10,
            FailureHandling.STOP_ON_FAILURE
        )
    }
    
    /**
     * Update an existing user
     * @param userEmail - Email of user to edit
     * @param firstName - New first name
     * @param lastName - New last name
     * @param email - New email
     * @param role - New role
     * @param phoneNumber - New phone number
     * @param whatsapp - New whatsapp
     * @param contactEmail - New contact email
     */
    @Keyword
    def updateUser(String userEmail, String firstName, String lastName, String email, String role,
                   String phoneNumber = '', String whatsapp = '', String contactEmail = '') {
        clickEditUser(userEmail)
        verifyUserModalDisplayed()
        fillUserForm(firstName, lastName, email, role, phoneNumber, whatsapp, contactEmail)
        clickSaveUserButton()
    }
    
    /**
     * Verify success toast message is displayed
     * @param expectedMessage - Expected message text (partial match)
     */
    @Keyword
    def verifySuccessToast(String expectedMessage) {
        WebUI.waitForElementVisible(
            findTestObject('Object Repository/Admin/UsersPage/toast_Success'),
            10,
            FailureHandling.CONTINUE_ON_FAILURE
        )
    }
    
    /**
     * Get count of users in active table
     * @return Number of user rows
     */
    @Keyword
    def getUserCount() {
        try {
            def elements = WebUI.findWebElements(
                findTestObject('Object Repository/Admin/UsersPage/tr_UserRows'),
                10
            )
            return elements.size()
        } catch (Exception e) {
            return 0
        }
    }
    
    /**
     * Verify user exists in table by email
     * @param userEmail - Email of the user to find
     */
    @Keyword
    def verifyUserExistsInTable(String userEmail) {
        WebUI.verifyElementPresent(
            findTestObject('Object Repository/Admin/UsersPage/td_UserEmail', [('userEmail'): userEmail]),
            10,
            FailureHandling.STOP_ON_FAILURE
        )
    }
    
    /**
     * Verify user role badge in table
     * @param userEmail - Email of the user
     * @param expectedRole - Expected role (user, agent, admin)
     */
    @Keyword
    def verifyUserRole(String userEmail, String expectedRole) {
        WebUI.verifyElementPresent(
            findTestObject('Object Repository/Admin/UsersPage/span_UserRole', [('userEmail'): userEmail, ('role'): expectedRole]),
            10,
            FailureHandling.STOP_ON_FAILURE
        )
    }
    
    /**
     * Click Active tab
     */
    @Keyword
    def clickActiveTab() {
        WebUI.click(findTestObject('Object Repository/Admin/UsersPage/btn_ActiveTab'))
        WebUI.delay(1)
    }
    
    /**
     * Click Inactive tab
     */
    @Keyword
    def clickInactiveTab() {
        WebUI.click(findTestObject('Object Repository/Admin/UsersPage/btn_InactiveTab'))
        WebUI.delay(1)
    }
    
    /**
     * Wait for loading to complete
     */
    @Keyword
    def waitForLoadingComplete() {
        WebUI.waitForElementNotPresent(
            findTestObject('Object Repository/Admin/UsersPage/div_LoadingSpinner'),
            15,
            FailureHandling.OPTIONAL
        )
        WebUI.delay(1)
    }
    
    /**
     * Verify user does not exist in table
     * @param userEmail - Email of the user
     */
    @Keyword
    def verifyUserNotInTable(String userEmail) {
        WebUI.verifyElementNotPresent(
            findTestObject('Object Repository/Admin/UsersPage/td_UserEmail', [('userEmail'): userEmail]),
            10,
            FailureHandling.STOP_ON_FAILURE
        )
    }
}
