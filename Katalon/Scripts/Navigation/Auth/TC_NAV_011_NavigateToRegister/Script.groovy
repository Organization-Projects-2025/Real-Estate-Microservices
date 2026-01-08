import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import navigation.Navigation_Keywords as NavigationKeywords

// Initialize Navigation Keywords
NavigationKeywords navKW = new NavigationKeywords()

// Step 1: Open home page (not authenticated)
navKW.openHomePage()

// Step 2: Click Get Started button
navKW.clickGetStarted()

// Step 3: Verify navigation to register page
navKW.verifyCurrentUrl('/register')

// Step 4: Close browser
WebUI.closeBrowser()
