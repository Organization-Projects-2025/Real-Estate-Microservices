import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import navigation.Navigation_Keywords as NavigationKeywords
import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject

// Initialize Navigation Keywords
NavigationKeywords navKW = new NavigationKeywords()

// Step 1: Open home page
navKW.openHomePage()

// Step 2: Login as test user
navKW.loginAsTestUser()

// Step 3: Click notification bell icon
WebUI.waitForElementClickable(findTestObject('Object Repository/Notification/notificationBellIcon'), 10)
WebUI.click(findTestObject('Object Repository/Notification/notificationBellIcon'))
WebUI.delay(2)
WebUI.waitForPageLoad(10)

// Step 4: Verify navigation to notifications page
navKW.verifyCurrentUrl('/notifications')

// Step 5: Close browser
WebUI.closeBrowser()
