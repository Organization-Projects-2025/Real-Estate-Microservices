import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import com.kms.katalon.core.model.FailureHandling
import authentication.Login_Keywords as LoginKeywords
import admin.Review_Keywords as ReviewKeywords

/**
 * Test Case: TC_ADM_REV_003 - Cancel Delete Review
 * 
 * Expected: No toast, review count unchanged
 */

WebUI.openBrowser('')
LoginKeywords loginHelper = new LoginKeywords()
ReviewKeywords reviewHelper = new ReviewKeywords()

String testReviewId = null

try {
    // Arrange: Create test review via API
    def createResult = reviewHelper.createTestReviewViaAPI()
    String testReviewerName = createResult.reviewerName
    testReviewId = createResult.reviewId
    WebUI.comment("Test review created: ${testReviewerName}")
    
    // Login and navigate
    loginHelper.loginAsAdmin()
    reviewHelper.navigateToReviews()
    reviewHelper.waitForLoadingComplete()
    
    // Get count before
    int countBefore = reviewHelper.getReviewCount()
    
    // Click delete for test review
    WebUI.click(findTestObject('Object Repository/Admin/ReviewsPage/btn_DeleteReview', [('reviewerName'): testReviewerName]))
    WebUI.delay(1)
    
    // CANCEL deletion
    WebUI.waitForAlert(5)
    WebUI.dismissAlert()
    WebUI.delay(2)
    
    // Assert: No success toast
    reviewHelper.assertNoSuccessToast("Cancel delete bug: Success toast appeared")
    
    // Assert: No error toast
    reviewHelper.assertNoErrorToast("Cancel delete bug: Error toast appeared")
    
    // Assert: Count unchanged
    int countAfter = reviewHelper.getReviewCount()
    assert countAfter == countBefore, "Cancel delete bug: Review count changed"
    
    WebUI.comment('✅ TC_ADM_REV_003 PASSED')
    
} catch (Exception e) {
    WebUI.comment('❌ TC_ADM_REV_003 FAILED: ' + e.getMessage())
    throw e
} finally {
    if (testReviewId) {
        try { reviewHelper.deleteReviewViaAPI(testReviewId) } catch (Exception ex) {}
    }
    WebUI.closeBrowser()
}
