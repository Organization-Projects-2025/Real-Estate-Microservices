import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import navigation.Navigation_Keywords as NavigationKeywords

// Initialize Navigation Keywords
NavigationKeywords navKW = new NavigationKeywords()

// Step 1: Open home page
navKW.openHomePage()

// Step 2: Click New Projects link in main navigation
navKW.clickMainNavLink('NewProjects')

// Step 3: Verify navigation to Developer Properties page
navKW.verifyCurrentUrl('/developer-properties')

// Step 4: Close browser
WebUI.closeBrowser()
