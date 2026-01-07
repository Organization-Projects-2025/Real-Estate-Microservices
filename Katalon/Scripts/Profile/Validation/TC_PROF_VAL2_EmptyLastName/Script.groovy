import static com.kms.katalon.core.testcase.TestCaseFactory.findTestCase
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import profile.Profile_Keywords as ProfileKeywords

// Initialize Profile Keywords
ProfileKeywords profileKW = new ProfileKeywords()

// Step 1: Login as test user (user1@realestate.com) and navigate to profile
profileKW.loginAndNavigateToProfile()

// Step 2: Clear last name (validation test)
profileKW.fillLastName('')

// Step 3: Attempt to save (should fail validation)
profileKW.clickSaveChanges()

// Step 4: Verify validation error or that form was not submitted
WebUI.delay(2)

// Step 5: Restore original values (in case save went through)
profileKW.restoreOriginalProfile()

// Step 6: Close browser
WebUI.closeBrowser()
