import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import navigation.Navigation_Keywords as NavigationKeywords

// Initialize Navigation Keywords
NavigationKeywords navKW = new NavigationKeywords()

// Step 1: Open home page
navKW.openHomePage()

// Step 2: Click Agents link in main navigation
navKW.clickMainNavLink('Agents')

// Step 3: Verify navigation to Agents page
navKW.verifyCurrentUrl('/agent')

// Step 4: Close browser
WebUI.closeBrowser()
