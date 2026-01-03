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

/**
 * Review Keywords for Admin Microservice
 * Provides reusable review management functions
 */
class Review_Keywords {
    
    private static final String BASE_URL = 'http://localhost:5173'
    private static final String API_GATEWAY_URL = 'http://localhost:3000/api'
    private static final String REVIEWS_URL = "${BASE_URL}/admin/reviews"
    
    /**
     * Navigate to Reviews Management page
     */
    @Keyword
    def navigateToReviews() {
        WebUI.navigateToUrl(REVIEWS_URL)
        WebUI.waitForPageLoad(15)
        verifyReviewsPageLoaded()
    }
    
    /**
     * Verify Reviews Management page is loaded
     */
    @Keyword
    def verifyReviewsPageLoaded() {
        WebUI.waitForElementVisible(
            findTestObject('Object Repository/Admin/ReviewsPage/h1_ReviewManagement'),
            15,
            FailureHandling.STOP_ON_FAILURE
        )
    }
    
    /**
     * Create a test review via API
     * @param agentId - Agent ID to associate review with (use a valid agent ID)
     * @return Map containing review data including _id
     */
    @Keyword
    def createTestReviewViaAPI(String agentId = '507f1f77bcf86cd799439011') {
        String reviewerName = "TestReviewer_${new Random().nextInt(90000) + 10000}"
        
        def requestBody = [
            agent: agentId,
            reviewerName: reviewerName,
            rating: 4,
            reviewText: "Automated test review created by Katalon - ${System.currentTimeMillis()}",
            status: "active"
        ]
        
        RequestObject request = new RequestObject()
        request.setRestUrl("${API_GATEWAY_URL}/reviews")
        request.setRestRequestMethod('POST')
        
        ArrayList<TestObjectProperty> headers = new ArrayList<>()
        headers.add(new TestObjectProperty('Content-Type', ConditionType.EQUALS, 'application/json'))
        headers.add(new TestObjectProperty('Accept', ConditionType.EQUALS, 'application/json'))
        request.setHttpHeaderProperties(headers)
        
        request.setBodyContent(new HttpTextBodyContent(JsonOutput.toJson(requestBody), 'UTF-8', 'application/json'))
        
        def response = WS.sendRequest(request)
        int statusCode = response.getStatusCode()
        
        if (statusCode != 201 && statusCode != 200) {
            WebUI.comment("API Error: Failed to create test review. Status: ${statusCode}")
            WebUI.comment("Response: ${response.getResponseText()}")
            throw new Exception("Failed to create test review via API. Status: ${statusCode}")
        }
        
        def jsonSlurper = new JsonSlurper()
        def responseData = jsonSlurper.parseText(response.getResponseText())
        
        String reviewId = responseData?.data?.review?._id ?: responseData?.review?._id
        WebUI.comment("Test review created via API: ${reviewerName} (ID: ${reviewId})")
        
        return [
            success: true,
            reviewerName: reviewerName,
            reviewId: reviewId,
            review: responseData?.data?.review ?: responseData?.review
        ]
    }
    
    /**
     * Delete a review via API (cleanup)
     */
    @Keyword
    def deleteReviewViaAPI(String reviewId) {
        RequestObject request = new RequestObject()
        request.setRestUrl("${API_GATEWAY_URL}/reviews/${reviewId}")
        request.setRestRequestMethod('DELETE')
        
        ArrayList<TestObjectProperty> headers = new ArrayList<>()
        headers.add(new TestObjectProperty('Content-Type', ConditionType.EQUALS, 'application/json'))
        request.setHttpHeaderProperties(headers)
        
        def response = WS.sendRequest(request)
        WebUI.comment("Review deleted via API: ${reviewId}, Status: ${response.getStatusCode()}")
        
        return response.getStatusCode() == 200
    }
    
    /**
     * Get count of reviews in table
     */
    @Keyword
    def getReviewCount() {
        try {
            def elements = WebUI.findWebElements(
                findTestObject('Object Repository/Admin/ReviewsPage/tr_ReviewRows'),
                10
            )
            return elements.size()
        } catch (Exception e) {
            return 0
        }
    }
    
    /**
     * Wait for loading to complete
     */
    @Keyword
    def waitForLoadingComplete() {
        WebUI.waitForElementNotPresent(
            findTestObject('Object Repository/Admin/ReviewsPage/div_LoadingSpinner'),
            15,
            FailureHandling.OPTIONAL
        )
        WebUI.delay(1)
    }
    
    /**
     * Check if a SUCCESS toast appeared
     */
    @Keyword
    def isSuccessToastDisplayed(int timeout = 5) {
        try {
            TestObject successToast = new TestObject("successToast")
            successToast.addProperty("xpath", ConditionType.EQUALS, 
                "//div[contains(@class,'Toastify__toast--success')]")
            
            boolean toastVisible = WebUI.waitForElementVisible(successToast, timeout, FailureHandling.OPTIONAL)
            
            if (toastVisible) {
                String toastText = WebUI.getText(successToast, FailureHandling.OPTIONAL)?.toLowerCase() ?: ''
                WebUI.comment("Success toast text: ${toastText}")
                return toastText =~ /(?i)(success|deleted|removed|completed)/
            }
            return false
        } catch (Exception e) {
            return false
        }
    }
    
    /**
     * Check if an ERROR toast appeared with user-friendly message
     */
    @Keyword
    def isErrorToastDisplayed(int timeout = 5) {
        try {
            TestObject errorToast = new TestObject("errorToast")
            errorToast.addProperty("xpath", ConditionType.EQUALS, 
                "//div[contains(@class,'Toastify__toast--error')]")
            
            boolean toastVisible = WebUI.waitForElementVisible(errorToast, timeout, FailureHandling.OPTIONAL)
            
            if (toastVisible) {
                String toastText = WebUI.getText(errorToast, FailureHandling.OPTIONAL)?.toLowerCase() ?: ''
                WebUI.comment("Error toast text: ${toastText}")
                
                boolean isUserFriendlyError = toastText =~ /(?i)(error|failed|unable|cannot|invalid)/
                boolean isTechnicalError = toastText =~ /(?i)(patch|post|get|delete|404|500|502|503|undefined|null|exception)/
                
                return isUserFriendlyError && !isTechnicalError
            }
            return false
        } catch (Exception e) {
            return false
        }
    }
    
    @Keyword
    def assertSuccessToast(String message = "Expected success toast but none appeared") {
        assert isSuccessToastDisplayed(5), message
    }
    
    @Keyword
    def assertNoSuccessToast(String message = "Success toast appeared when it should not have") {
        assert !isSuccessToastDisplayed(3), message
    }
    
    @Keyword
    def assertErrorToast(String message = "Expected error toast but none appeared") {
        assert isErrorToastDisplayed(5), message
    }
    
    @Keyword
    def assertNoErrorToast(String message = "Error toast appeared when it should not have") {
        assert !isErrorToastDisplayed(3), message
    }
}
