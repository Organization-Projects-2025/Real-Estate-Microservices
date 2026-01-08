import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import com.kms.katalon.core.model.FailureHandling
import notification.NotificationHelper as NotifHelper

// Initialize helper
NotifHelper notif = new NotifHelper()

// Step 1: Login and get initial notification count
notif.loginAsReviewUser()
notif.navigateToNotifications()
int initialCount = notif.getNotificationCount()
WebUI.comment("Initial notification count: ${initialCount}")

// Step 2: Navigate to Rent page to find a rental property
WebUI.navigateToUrl('http://localhost:5173/rent')
WebUI.delay(3)

// Step 3: Wait for and click on first rental property
WebUI.waitForElementPresent(findTestObject('Object Repository/Property/propertyCard'), 10)

if (!WebUI.verifyElementPresent(findTestObject('Object Repository/Property/propertyCard'), 5, FailureHandling.OPTIONAL)) {
    throw new Exception("No rental properties found on page - cannot test notification trigger")
}

WebUI.click(findTestObject('Object Repository/Property/propertyCard'))
WebUI.delay(2)

// Step 4: Click Contact Agent button
WebUI.waitForElementClickable(findTestObject('Object Repository/Property/contactAgentButton'), 10)
WebUI.click(findTestObject('Object Repository/Property/contactAgentButton'))
WebUI.delay(1)

// Step 5: Fill contact form
WebUI.setText(findTestObject('Object Repository/Property/contactNameInput'), 'Test User Rent')
WebUI.setText(findTestObject('Object Repository/Property/contactEmailInput'), 'testrent@example.com')
WebUI.setText(findTestObject('Object Repository/Property/contactMessageInput'), 'Interested in renting this property')

// Step 6: Click Send Message button
WebUI.click(findTestObject('Object Repository/Property/sendMessageButton'))
WebUI.delay(3)

// Step 7: Navigate to home page first (notification bell is in navbar)
WebUI.comment("Navigating to home page...")
WebUI.navigateToUrl('http://localhost:5173/')
WebUI.delay(2)

// Step 8: Open notifications and verify
WebUI.comment("Opening notifications...")
notif.navigateToNotifications()

int newCount = notif.getNotificationCount()
WebUI.comment("Initial count: ${initialCount}, New count: ${newCount}")

// Step 9: Verify notification was created
if (newCount > initialCount) {
    WebUI.comment("✓ Test PASSED: Notification created when contacting seller about rental property")
    WebUI.verifyEqual(newCount, initialCount + 1, FailureHandling.CONTINUE_ON_FAILURE)
} else {
    WebUI.comment("✗ Test FAILED: No new notification created")
    WebUI.comment("Expected: ${initialCount + 1}, Actual: ${newCount}")
    throw new Exception("Notification was not created after contacting seller")
}

// Step 9: Close browser
WebUI.closeBrowser()

