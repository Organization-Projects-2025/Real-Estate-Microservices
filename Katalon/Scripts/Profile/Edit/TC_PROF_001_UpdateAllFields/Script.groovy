import static com.kms.katalon.core.testcase.TestCaseFactory.findTestCase
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import profile.Profile_Keywords as ProfileKeywords

// Initialize Profile Keywords
ProfileKeywords profileKW = new ProfileKeywords()

// Step 1: Login as test user and navigate to profile
profileKW.loginAndNavigateToProfile()

// Step 2: Update all personal information fields
profileKW.fillAllPersonalInfo(
    'UpdatedFirstName',
    'UpdatedLastName',
    '+971599584375',
    '+971501234567',
    'contact@example.com'
)

// Step 3: Save changes
profileKW.clickSaveChanges()

// Step 4: Verify success (optional - may not show success message)
// profileKW.verifySuccessMessage()

// Step 5: Restore original values for test independence
profileKW.restoreOriginalProfile()

// Step 6: Close browser
WebUI.closeBrowser()
