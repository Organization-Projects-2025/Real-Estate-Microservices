import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import navigation.Navigation_Keywords as NavigationKeywords

// Initialize Navigation Keywords
NavigationKeywords navKW = new NavigationKeywords()

// Step 1: Open home page
navKW.openHomePage()

// Step 2: Click Rent link in main navigation
navKW.clickMainNavLink('Rent')

// Step 3: Verify navigation to Rent page
navKW.verifyCurrentUrl('/rent')

// Step 4: Close browser
WebUI.closeBrowser()
