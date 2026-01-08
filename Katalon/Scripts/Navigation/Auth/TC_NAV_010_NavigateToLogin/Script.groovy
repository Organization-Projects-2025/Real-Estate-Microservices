import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import navigation.Navigation_Keywords as NavigationKeywords

// Initialize Navigation Keywords
NavigationKeywords navKW = new NavigationKeywords()

// Step 1: Open home page (not authenticated)
navKW.openHomePage()

// Step 2: Click Sign In button
navKW.clickSignIn()

// Step 3: Verify navigation to login page
navKW.verifyCurrentUrl('/login')

// Step 4: Close browser
WebUI.closeBrowser()
