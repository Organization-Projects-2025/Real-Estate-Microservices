import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import com.kms.katalon.core.model.FailureHandling
import authentication.Login_Keywords as LoginKeywords
import admin.Review_Keywords as ReviewKeywords

/**
 * Test Case: TC_ADM_REV_002 - Delete Review
 * 
 * Expected: Success toast appears, review removed from table
 */

WebUI.openBrowser('')
LoginKeywords loginHelper = new LoginKeywords()
ReviewKeywords reviewHelper = new ReviewKeywords()

String testReviewId = null
boolean deletedViaUI = false

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
    
    // Get count before delete
    int countBefore = reviewHelper.getReviewCount()
    
    // Click delete for test review
    WebUI.click(findTestObject('Object Repository/Admin/ReviewsPage/btn_DeleteReview', [('reviewerName'): testReviewerName]))
    WebUI.delay(1)
    
    // Confirm deletion
    WebUI.waitForAlert(5)
    WebUI.acceptAlert()
    WebUI.delay(3)
    
    // Assert: Success toast
    reviewHelper.assertSuccessToast("Delete failed: Expected success toast")
    
    // Assert: No error toast
    reviewHelper.assertNoErrorToast("Delete failed: Error toast appeared")
    
    deletedViaUI = true
    
    // Assert: Count decreased
    reviewHelper.waitForLoadingComplete()
    int countAfter = reviewHelper.getReviewCount()
    assert countAfter == countBefore - 1, "Delete failed: Review count should decrease by 1"
    
    WebUI.comment('✅ TC_ADM_REV_002 PASSED')
    
} catch (Exception e) {
    WebUI.comment('❌ TC_ADM_REV_002 FAILED: ' + e.getMessage())
    throw e
} finally {
    if (testReviewId && !deletedViaUI) {
        try { reviewHelper.deleteReviewViaAPI(testReviewId) } catch (Exception ex) {}
    }
    WebUI.closeBrowser()
}
