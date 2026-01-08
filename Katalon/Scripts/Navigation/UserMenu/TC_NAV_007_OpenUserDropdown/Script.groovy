import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import navigation.Navigation_Keywords as NavigationKeywords
import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject

// Initialize Navigation Keywords
NavigationKeywords navKW = new NavigationKeywords()

// Step 1: Open home page
navKW.openHomePage()

// Step 2: Login as test user
navKW.loginAsTestUser()

// Step 3: Open user dropdown
navKW.openUserDropdown()

// Step 4: Verify dropdown menu is visible by checking "My Profile" link
WebUI.waitForElementVisible(findTestObject('Object Repository/Profile/a_My Profile'), 5)
boolean isVisible = WebUI.verifyElementVisible(findTestObject('Object Repository/Profile/a_My Profile'))

WebUI.comment("User dropdown opened successfully: ${isVisible}")

// Step 5: Close browser
WebUI.closeBrowser()
