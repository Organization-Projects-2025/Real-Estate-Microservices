import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import navigation.Navigation_Keywords as NavigationKeywords

// Initialize Navigation Keywords
NavigationKeywords navKW = new NavigationKeywords()

// Step 1: Open home page
navKW.openHomePage()

// Step 2: Login as test user
navKW.loginAsTestUser()

// Step 3: Navigate to profile via user menu
navKW.clickUserMenuItem('My Profile')

// Step 4: Verify navigation to profile page
navKW.verifyCurrentUrl('/profile')

// Step 5: Close browser
WebUI.closeBrowser()
