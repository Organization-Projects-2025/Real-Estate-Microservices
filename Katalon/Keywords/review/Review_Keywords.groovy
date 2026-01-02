package review

import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.annotation.Keyword
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import com.kms.katalon.core.model.FailureHandling
import org.openqa.selenium.Keys
import authentication.Login_Keywords as LoginKeywords

/**
 * Review Keywords for Review Microservice
 * Provides reusable review functions for all test cases
 */
class Review_Keywords {
    
    private static final String BASE_URL = 'http://localhost:5173'
    private static final String WRITE_REVIEW_URL = "${BASE_URL}/write-review"
    
    // Test user credentials
    private static final String USER_EMAIL = 'a7med3li@gmail.com'
    private static final String USER_PASSWORD_ENCRYPTED = 't8wp1gy9IWfOCKxwWlfTFQ=='
    
    // Default agent ID
    private static final String DEFAULT_AGENT_ID = '694b6474061ba8a480628253'
    
    // Initialize Login Keywords
    private LoginKeywords loginKW = new LoginKeywords()
    
    /**
     * Navigate to home page and login as regular user
     */
    @Keyword
    def loginAsUser() {
        WebUI.openBrowser('')
        WebUI.navigateToUrl(BASE_URL)
        
        WebUI.click(findTestObject('Object Repository/Review/signInLink'))
        WebUI.setText(findTestObject('Object Repository/Review/emailInput'), USER_EMAIL)
        WebUI.click(findTestObject('Object Repository/Review/loginFormDiv'))
        WebUI.setEncryptedText(findTestObject('Object Repository/Review/passwordInput'), USER_PASSWORD_ENCRYPTED)
        WebUI.sendKeys(findTestObject('Object Repository/Review/passwordInput'), Keys.chord(Keys.ENTER))
        
        WebUI.delay(2)
    }
    
    /**
     * Navigate to home page and login as admin (uses Authentication Keywords)
     */
    @Keyword
    def loginAsAdmin() {
        WebUI.openBrowser('')
        WebUI.navigateToUrl(BASE_URL)
        
        // Wait for page to load
        WebUI.delay(2)
        
        // Use Authentication Login Keywords for admin login
        loginKW.loginAsAdmin()
    }
    
    /**
     * Navigate to Write Review page
     */
    @Keyword
    def navigateToWriteReview() {
        WebUI.click(findTestObject('Object Repository/Review/viewAllReviewsLink'))
        WebUI.click(findTestObject('Object Repository/Review/writeReviewLink'))
        WebUI.delay(1)
    }
    
    /**
     * Fill review form with given details
     * @param reviewerName - Name of the reviewer
     * @param agentId - Agent ID to select (default: DEFAULT_AGENT_ID)
     * @param starRating - Star rating (1-5)
     * @param reviewText - Review text content
     */
    @Keyword
    def fillReviewForm(String reviewerName, String agentId, int starRating, String reviewText) {
        // Wait for form to be ready (reduced timeout)
        WebUI.waitForElementPresent(findTestObject('Object Repository/Review/reviewerNameInput'), 5)
        
        // Enter reviewer name using sendKeys (faster than setText)
        def nameInput = findTestObject('Object Repository/Review/reviewerNameInput')
        WebUI.clearText(nameInput, FailureHandling.OPTIONAL)
        WebUI.sendKeys(nameInput, reviewerName)
        
        // Select agent immediately
        WebUI.selectOptionByValue(findTestObject('Object Repository/Review/agentSelect'), agentId, false)
        
        // Click appropriate star based on rating
        clickStarRating(starRating)
        
        // Enter review text
        WebUI.sendKeys(findTestObject('Object Repository/Review/reviewTextarea'), reviewText)
    }
    
    /**
     * Click star rating based on number (1-5)
     * @param rating - Star rating (1-5)
     */
    @Keyword
    def clickStarRating(int rating) {
        String starObject = ''
        
        switch(rating) {
            case 1:
                starObject = 'Object Repository/Review/star_1'
                break
            case 2:
                starObject = 'Object Repository/Review/star_2'
                break
            case 3:
                starObject = 'Object Repository/Review/star_3'
                break
            case 4:
                starObject = 'Object Repository/Review/star_4'
                break
            case 5:
                starObject = 'Object Repository/Review/star_5'
                break
            default:
                throw new IllegalArgumentException("Invalid star rating: ${rating}. Must be 1-5")
        }
        
        WebUI.click(findTestObject(starObject))
    }
    
    /**
     * Submit the review form
     */
    @Keyword
    def submitReview() {
        WebUI.click(findTestObject('Object Repository/Review/submitReviewButton'))
        WebUI.delay(2)
    }
    
    /**
     * Create a complete review (login, navigate, fill, submit)
     * @param reviewerName - Name of the reviewer
     * @param starRating - Star rating (1-5)
     * @param reviewText - Review text content
     * @param agentId - Agent ID (optional, uses default if not provided)
     */
    @Keyword
    def createReview(String reviewerName, int starRating, String reviewText, String agentId = DEFAULT_AGENT_ID) {
        loginAsUser()
        navigateToWriteReview()
        fillReviewForm(reviewerName, agentId, starRating, reviewText)
        submitReview()
        WebUI.closeBrowser()
    }
    
    /**
     * Navigate to Admin Dashboard Reviews page
     */
    @Keyword
    def navigateToAdminReviews() {
        // Wait for admin menu to be available
        WebUI.waitForElementPresent(findTestObject('Object Repository/Review/adminSpan'), 10)
        
        // Click admin dropdown
        WebUI.click(findTestObject('Object Repository/Review/adminSpan'))
        WebUI.delay(1)
        
        // Click admin dashboard link
        WebUI.waitForElementClickable(findTestObject('Object Repository/Review/adminDashboardLink'), 5)
        WebUI.click(findTestObject('Object Repository/Review/adminDashboardLink'))
        WebUI.delay(1)
        
        // Click reviews menu
        WebUI.waitForElementClickable(findTestObject('Object Repository/Review/reviewsMenuLink'), 5)
        WebUI.click(findTestObject('Object Repository/Review/reviewsMenuLink'))
        WebUI.waitForPageLoad(10)
    }
    
    /**
     * Delete the last review in the admin panel
     */
    @Keyword
    def deleteLastReview() {
        // Scroll to last delete button
        WebUI.scrollToElement(findTestObject('Object Repository/Review/deleteLastReviewButton'), 5)
        
        // Wait for element to be clickable
        WebUI.waitForElementClickable(findTestObject('Object Repository/Review/deleteLastReviewButton'), 10)
        
        // Click delete button
        WebUI.click(findTestObject('Object Repository/Review/deleteLastReviewButton'))
        
        // Handle confirmation alert
        WebUI.waitForAlert(5)
        WebUI.acceptAlert()
        
        // Allow UI to update
        WebUI.delay(2)
    }
    
    /**
     * Admin deletes last review (complete flow)
     */
    @Keyword
    def adminDeleteLastReview() {
        loginAsAdmin()
        navigateToAdminReviews()
        deleteLastReview()
        WebUI.closeBrowser()
    }
}
