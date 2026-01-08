import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import navigation.Navigation_Keywords as NavigationKeywords

// Initialize Navigation Keywords
NavigationKeywords navKW = new NavigationKeywords()

// Step 1: Open home page
navKW.openHomePage()

// Step 2: Navigate to another page first
navKW.clickMainNavLink('Buy')

// Step 3: Click logo to return home
navKW.clickLogo()

// Step 4: Verify navigation back to home page
navKW.verifyCurrentUrl('/')

// Step 5: Close browser
WebUI.closeBrowser()
