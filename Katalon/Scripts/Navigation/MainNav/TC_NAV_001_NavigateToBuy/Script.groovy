import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import navigation.Navigation_Keywords as NavigationKeywords

// Initialize Navigation Keywords
NavigationKeywords navKW = new NavigationKeywords()

// Step 1: Open home page
navKW.openHomePage()

// Step 2: Click Buy link in main navigation
navKW.clickMainNavLink('Buy')

// Step 3: Verify navigation to Buy page
navKW.verifyCurrentUrl('/buy')

// Step 4: Close browser
WebUI.closeBrowser()
