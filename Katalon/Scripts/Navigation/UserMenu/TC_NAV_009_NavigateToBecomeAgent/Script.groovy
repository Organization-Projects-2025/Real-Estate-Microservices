import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import navigation.Navigation_Keywords as NavigationKeywords

// Initialize Navigation Keywords
NavigationKeywords navKW = new NavigationKeywords()

// Step 1: Open home page
navKW.openHomePage()

// Step 2: Login as test user (regular user, not agent)
navKW.loginAsTestUser()

// Step 3: Navigate to Become Agent page via user menu
navKW.clickUserMenuItem('Become an Agent')

// Step 4: Verify navigation to Become Agent page
navKW.verifyCurrentUrl('/become-agent')

// Step 5: Close browser
WebUI.closeBrowser()
