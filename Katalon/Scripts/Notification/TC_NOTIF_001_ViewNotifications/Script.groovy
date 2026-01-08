import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import notification.NotificationHelper as NotifHelper

// Initialize Notification Helper
NotifHelper notif = new NotifHelper()

// Step 1: Login and navigate to notifications
notif.loginAsReviewUser()
notif.navigateToNotifications()

// Step 2: Verify page loaded
WebUI.waitForElementPresent(findTestObject('Object Repository/Notification/pageTitle'), 10)

// Step 3: Get notification count
int count = notif.getNotificationCount()
WebUI.comment("Total notifications: ${count}")

// Step 4: Verify notifications exist
WebUI.verifyGreaterThan(count, 0)

// Step 5: Close browser
WebUI.closeBrowser()
