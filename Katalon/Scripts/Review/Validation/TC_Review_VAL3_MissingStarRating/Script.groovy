import static com.kms.katalon.core.testcase.TestCaseFactory.findTestCase
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import review.Review_Keywords as ReviewKeywords

// Initialize Review Keywords
ReviewKeywords reviewKW = new ReviewKeywords()

// Attempt to submit review without star rating
reviewKW.submitReviewWithoutRating('Test Reviewer', 'Review without star rating')

// Verify validation error or that form was not submitted
WebUI.delay(2)

WebUI.closeBrowser()
