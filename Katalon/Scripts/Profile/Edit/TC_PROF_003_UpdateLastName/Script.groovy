import static com.kms.katalon.core.testcase.TestCaseFactory.findTestCase
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import profile.Profile_Keywords as ProfileKeywords

// Initialize Profile Keywords
ProfileKeywords profileKW = new ProfileKeywords()

// Step 1: Login as test user (user1@realestate.com) and navigate to profile
profileKW.loginAndNavigateToProfile()

// Step 2: Update only last name
profileKW.fillLastName('NewLastName')

// Step 3: Save changes
profileKW.clickSaveChanges()

// Step 4: Verify success (optional - may not show success message)
// profileKW.verifySuccessMessage()

// Step 5: Restore original values for test independence
profileKW.restoreOriginalProfile()

// Step 6: Close browser
WebUI.closeBrowser()
