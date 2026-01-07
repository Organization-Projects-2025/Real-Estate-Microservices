import static com.kms.katalon.core.testcase.TestCaseFactory.findTestCase
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import review.Review_Keywords as ReviewKeywords

// Initialize Review Keywords
ReviewKeywords reviewKW = new ReviewKeywords()

// Attempt to submit review with empty reviewer name
reviewKW.submitReviewWithEmptyName(5, 'This review has no reviewer name')

// Verify validation error or that form was not submitted
// Note: Adjust verification based on your actual UI behavior
WebUI.delay(2)

WebUI.closeBrowser()
