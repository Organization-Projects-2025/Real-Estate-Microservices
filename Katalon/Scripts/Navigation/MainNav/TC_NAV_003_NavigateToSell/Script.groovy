import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import navigation.Navigation_Keywords as NavigationKeywords

// Initialize Navigation Keywords
NavigationKeywords navKW = new NavigationKeywords()

// Step 1: Open home page
navKW.openHomePage()

// Step 2: Click Sell link in main navigation
navKW.clickMainNavLink('Sell')

// Step 3: Verify navigation to Sell page
navKW.verifyCurrentUrl('/sell')

// Step 4: Close browser
WebUI.closeBrowser()
