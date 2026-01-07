import static com.kms.katalon.core.testcase.TestCaseFactory.findTestCase
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import review.Review_Keywords as ReviewKeywords

// Initialize Review Keywords
ReviewKeywords reviewKW = new ReviewKeywords()

// Create 1-star review
reviewKW.createReview('Test User 1Star', 1, 'Review with 1 star rating')
