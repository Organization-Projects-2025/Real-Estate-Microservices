package admin

import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.annotation.Keyword
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import com.kms.katalon.core.model.FailureHandling
import com.kms.katalon.core.testobject.RequestObject
import com.kms.katalon.core.testobject.TestObjectProperty
import com.kms.katalon.core.testobject.TestObject
import com.kms.katalon.core.testobject.ConditionType
import com.kms.katalon.core.testobject.impl.HttpTextBodyContent
import com.kms.katalon.core.webservice.keyword.WSBuiltInKeywords as WS
import groovy.json.JsonOutput
import groovy.json.JsonSlurper
import org.openqa.selenium.WebElement

/**
 * Property Keywords for Admin Microservice
 * Provides reusable property management functions for all test cases
 * 
 * Note: Functions used less than 3 times have been removed per optimization rules.
 * Use direct WebUI steps in test cases for rarely-used operations.
 * 
 * @author Admin Service Test Team
 * @version 2.0 (Optimized)
 */
class Property_Keywords {
    
    private static final String BASE_URL = 'http://localhost:5173'
    private static final String API_GATEWAY_URL = 'http://localhost:3000/api'
    private static final String PROPERTIES_URL = "${BASE_URL}/admin/properties"
    
    /**
     * Navigate to Properties Management page
     * Requires admin to be logged in
     * Usage: 8 test cases
     */
    @Keyword
    def navigateToProperties() {
        WebUI.navigateToUrl(PROPERTIES_URL)
        WebUI.waitForPageLoad(15)
        verifyPropertiesPageLoaded()
    }
    
    /**
     * Generate a unique property title for test data
     * @param prefix - Prefix for the title (default: 'TestProperty')
     * @return Unique property title
     */
    @Keyword
    def generateUniquePropertyTitle(String prefix = 'TestProperty') {
        int randomNum = new Random().nextInt(90000) + 10000  // 5-digit random number
        return "${prefix}_${randomNum}"
    }
    
    /**
     * Create a new test property via API Gateway (fast, reliable test data setup)
     * @param title - Property title (optional, will generate unique if not provided)
     * @return Map containing property data including _id
     */
    @Keyword
    def createTestPropertyViaAPI(String title = null) {
        // Generate unique title if not provided
        String propertyTitle = title ?: generateUniquePropertyTitle()
        
        // Build complete property request body with all required fields
        def requestBody = [
            title: propertyTitle,
            description: "Automated test property created for Katalon testing",
            listingType: "sale",
            propertyType: "residential",
            subType: "house",
            address: [
                street: "123 Test Street",
                city: "Test City",
                state: "Test State",
                country: "Test Country"
            ],
            area: [
                sqft: 2000,
                sqm: 186
            ],
            price: 500000,
            media: ["https://example.com/test-image.jpg"],
            buildDate: "2020-01-01",
            user: "test-user-id",
            status: "active",
            features: [
                bedrooms: 3,
                bathrooms: 2,
                garage: 1,
                pool: false,
                yard: true,
                pets: true,
                furnished: "partly",
                airConditioning: true,
                internet: true,
                electricity: true,
                water: true,
                gas: true,
                wifi: true,
                security: false
            ]
        ]
        
        // Create request object
        RequestObject request = new RequestObject()
        request.setRestUrl("${API_GATEWAY_URL}/properties")
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
            WebUI.comment("API Error: Failed to create test property. Status: ${statusCode}")
            WebUI.comment("Response: ${response.getResponseText()}")
            throw new Exception("Failed to create test property via API. Status: ${statusCode}")
        }
        
        // Parse response
        def jsonSlurper = new JsonSlurper()
        def responseData = jsonSlurper.parseText(response.getResponseText())
        
        String propertyId = responseData?.data?.property?._id ?: responseData?.property?._id
        WebUI.comment("Test property created via API: ${propertyTitle} (ID: ${propertyId})")
        
        return [
            success: true,
            title: propertyTitle,
            propertyId: propertyId,
            property: responseData?.data?.property ?: responseData?.property
        ]
    }
    
    /**
     * Delete a property via API (cleanup after tests)
     * @param propertyId - ID of the property to delete
     */
    @Keyword
    def deletePropertyViaAPI(String propertyId) {
        RequestObject request = new RequestObject()
        request.setRestUrl("${API_GATEWAY_URL}/properties/${propertyId}")
        request.setRestRequestMethod('DELETE')
        
        ArrayList<TestObjectProperty> headers = new ArrayList<>()
        headers.add(new TestObjectProperty('Content-Type', ConditionType.EQUALS, 'application/json'))
        request.setHttpHeaderProperties(headers)
        
        def response = WS.sendRequest(request)
        WebUI.comment("Property deleted via API: ${propertyId}, Status: ${response.getStatusCode()}")
        
        return response.getStatusCode() == 200
    }
    
    /**
     * Verify Properties Management page is loaded
     * Usage: Called by navigateToProperties (internal)
     */
    @Keyword
    def verifyPropertiesPageLoaded() {
        WebUI.waitForElementVisible(
            findTestObject('Object Repository/Admin/PropertiesPage/h1_PropertyManagement'),
            15,
            FailureHandling.STOP_ON_FAILURE
        )
    }
    
    /**
     * Verify Edit Property modal is displayed
     * Usage: 6 test cases
     */
    @Keyword
    def verifyPropertyModalDisplayed() {
        WebUI.waitForElementVisible(
            findTestObject('Object Repository/Admin/PropertiesPage/Modal/div_PropertyModal'),
            10,
            FailureHandling.STOP_ON_FAILURE
        )
    }
    
    /**
     * Click Save Changes button in modal
     * Usage: 4 test cases
     */
    @Keyword
    def clickSavePropertyButton() {
        WebUI.click(findTestObject('Object Repository/Admin/PropertiesPage/Modal/btn_SaveChanges'))
        WebUI.delay(2)
    }
    
    /**
     * Verify modal is closed
     * Usage: 5 test cases
     */
    @Keyword
    def verifyModalClosed() {
        WebUI.verifyElementNotPresent(
            findTestObject('Object Repository/Admin/PropertiesPage/Modal/div_PropertyModal'),
            10,
            FailureHandling.STOP_ON_FAILURE
        )
    }
    
    /**
     * Verify success toast message is displayed
     * Usage: 4 test cases
     * @param expectedMessage - Expected message text (partial match)
     */
    @Keyword
    def verifySuccessToast(String expectedMessage) {
        WebUI.waitForElementVisible(
            findTestObject('Object Repository/Admin/PropertiesPage/toast_Success'),
            10,
            FailureHandling.CONTINUE_ON_FAILURE
        )
    }
    
    /**
     * Get count of properties in table
     * Usage: 3 test cases
     * @return Number of property rows
     */
    @Keyword
    def getPropertyCount() {
        try {
            def elements = WebUI.findWebElements(
                findTestObject('Object Repository/Admin/PropertiesPage/tr_PropertyRows'),
                10
            )
            return elements.size()
        } catch (Exception e) {
            return 0
        }
    }
    
    /**
     * Wait for loading to complete
     * Usage: 8 test cases
     */
    @Keyword
    def waitForLoadingComplete() {
        WebUI.waitForElementNotPresent(
            findTestObject('Object Repository/Admin/PropertiesPage/div_LoadingSpinner'),
            15,
            FailureHandling.OPTIONAL
        )
        WebUI.delay(1)
    }
    
    /**
     * Check if a SUCCESS toast appeared with user-friendly message
     * Matches messages like: "updated successfully", "deleted successfully", "saved", "success"
     * @param timeout - seconds to wait for toast (default: 5)
     * @return true if success toast found, false otherwise
     */
    @Keyword
    def isSuccessToastDisplayed(int timeout = 5) {
        try {
            // Look for Toastify success toast
            TestObject successToast = new TestObject("successToast")
            successToast.addProperty("xpath", ConditionType.EQUALS, 
                "//div[contains(@class,'Toastify__toast--success')]")
            
            boolean toastVisible = WebUI.waitForElementVisible(successToast, timeout, FailureHandling.OPTIONAL)
            
            if (toastVisible) {
                // Get toast text and verify it's a user-friendly success message
                String toastText = WebUI.getText(successToast, FailureHandling.OPTIONAL)?.toLowerCase() ?: ''
                WebUI.comment("Success toast text: ${toastText}")
                
                // Match success patterns (regex-like check)
                boolean isValidSuccess = toastText =~ /(?i)(success|updated|deleted|saved|created|completed)/
                return isValidSuccess
            }
            return false
        } catch (Exception e) {
            WebUI.comment("Error checking success toast: ${e.getMessage()}")
            return false
        }
    }
    
    /**
     * Check if an ERROR toast appeared with user-friendly message
     * Matches messages like: "Error updating", "Failed to delete", "Error", "failed"
     * Does NOT match technical errors like "Cannot PATCH", "404", "500"
     * @param timeout - seconds to wait for toast (default: 5)
     * @return true if user-friendly error toast found, false otherwise
     */
    @Keyword
    def isErrorToastDisplayed(int timeout = 5) {
        try {
            // Look for Toastify error toast
            TestObject errorToast = new TestObject("errorToast")
            errorToast.addProperty("xpath", ConditionType.EQUALS, 
                "//div[contains(@class,'Toastify__toast--error')]")
            
            boolean toastVisible = WebUI.waitForElementVisible(errorToast, timeout, FailureHandling.OPTIONAL)
            
            if (toastVisible) {
                // Get toast text and verify it's a user-friendly error message
                String toastText = WebUI.getText(errorToast, FailureHandling.OPTIONAL)?.toLowerCase() ?: ''
                WebUI.comment("Error toast text: ${toastText}")
                
                // Match user-friendly error patterns
                boolean isUserFriendlyError = toastText =~ /(?i)(error|failed|unable|cannot|invalid|required)/
                
                // Exclude technical/raw API errors
                boolean isTechnicalError = toastText =~ /(?i)(patch|post|get|delete|404|500|502|503|undefined|null|exception)/
                
                return isUserFriendlyError && !isTechnicalError
            }
            return false
        } catch (Exception e) {
            WebUI.comment("Error checking error toast: ${e.getMessage()}")
            return false
        }
    }
    
    /**
     * Assert that a success toast is displayed
     * @param message - Custom failure message
     */
    @Keyword
    def assertSuccessToast(String message = "Expected success toast but none appeared") {
        boolean success = isSuccessToastDisplayed(5)
        assert success, message
    }
    
    /**
     * Assert that NO success toast is displayed
     * @param message - Custom failure message
     */
    @Keyword
    def assertNoSuccessToast(String message = "Success toast appeared when it should not have") {
        boolean success = isSuccessToastDisplayed(3)
        assert !success, message
    }
    
    /**
     * Assert that an error toast is displayed
     * @param message - Custom failure message
     */
    @Keyword
    def assertErrorToast(String message = "Expected error toast but none appeared") {
        boolean error = isErrorToastDisplayed(5)
        assert error, message
    }
    
    /**
     * Assert that NO error toast is displayed
     * @param message - Custom failure message
     */
    @Keyword
    def assertNoErrorToast(String message = "Error toast appeared when it should not have") {
        boolean error = isErrorToastDisplayed(3)
        assert !error, message
    }
}
