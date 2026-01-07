import static com.kms.katalon.core.testcase.TestCaseFactory.findTestCase
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import profile.Profile_Keywords as ProfileKeywords

// Initialize Profile Keywords
ProfileKeywords profileKW = new ProfileKeywords()

// Step 1: Login as test user (user1@realestate.com) and navigate to profile
profileKW.loginAndNavigateToProfile()

// Step 2: Get original values
String originalFirstName = profileKW.getFirstNameValue()
String originalLastName = profileKW.getLastNameValue()

// Step 3: Make changes (but don't save)
profileKW.fillFirstName('TempFirstName')
profileKW.fillLastName('TempLastName')

// Step 4: Click Cancel (should not save)
profileKW.clickCancel()

// Step 5: Verify changes were not saved by navigating back to profile
profileKW.navigateToProfile()

String currentFirstName = profileKW.getFirstNameValue()
String currentLastName = profileKW.getLastNameValue()

// Step 6: Verify original values are still there
WebUI.verifyMatch(currentFirstName, originalFirstName, false)
WebUI.verifyMatch(currentLastName, originalLastName, false)

// No need to restore - cancel already prevented changes

// Step 7: Close browser
WebUI.closeBrowser()
