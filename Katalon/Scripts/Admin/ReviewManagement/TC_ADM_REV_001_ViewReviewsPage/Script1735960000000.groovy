import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import com.kms.katalon.core.model.FailureHandling
import authentication.Login_Keywords as LoginKeywords
import admin.Review_Keywords as ReviewKeywords

/**
 * Test Case: TC_ADM_REV_001 - View Reviews Management Page
 * 
 * Expected: Page loads, table displays, search input visible. 
 */

WebUI.openBrowser('')
LoginKeywords loginHelper = new LoginKeywords()
ReviewKeywords reviewHelper = new ReviewKeywords()

try {
    // Login and navigate
    loginHelper.loginAsAdmin()
    reviewHelper.navigateToReviews()
    reviewHelper.waitForLoadingComplete()
    
    // Assert: Page title visible
    WebUI.verifyElementPresent(
        findTestObject('Object Repository/Admin/ReviewsPage/h1_ReviewManagement'),
        10, FailureHandling.STOP_ON_FAILURE
    )
    
    // Assert: Table visible
    WebUI.verifyElementPresent(
        findTestObject('Object Repository/Admin/ReviewsPage/table_Reviews'),
        10, FailureHandling.STOP_ON_FAILURE
    )
    
    // Assert: Search input visible
    WebUI.verifyElementPresent(
        findTestObject('Object Repository/Admin/ReviewsPage/input_Search'),
        10, FailureHandling.STOP_ON_FAILURE
    )
    
    // Log review count
    int reviewCount = reviewHelper.getReviewCount()
    WebUI.comment("Reviews found in table: ${reviewCount}")
    
    WebUI.comment('✅ TC_ADM_REV_001 PASSED')
    
} catch (Exception e) {
    WebUI.comment('❌ TC_ADM_REV_001 FAILED: ' + e.getMessage())
    throw e
} finally {
    WebUI.closeBrowser()
}
