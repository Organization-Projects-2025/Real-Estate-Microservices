import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import com.kms.katalon.core.model.FailureHandling
import notification.NotificationHelper as NotifHelper
import review.Review_Keywords as ReviewKeywords

// Initialize helpers
NotifHelper notif = new NotifHelper()
ReviewKeywords reviewKW = new ReviewKeywords()

// Step 1: Login and create review (without closing browser)
reviewKW.loginAsUser()
reviewKW.navigateToWriteReview()
reviewKW.fillReviewForm('Test Reviewer Notif Delete', '694b6474061ba8a480628253', 1, 'Test review for delete notification')
reviewKW.submitReview()
WebUI.delay(2)

// Step 2: Navigate to notifications
notif.navigateToNotifications()

// Step 3: Get initial count
int initialCount = notif.getNotificationCount()
WebUI.comment("Initial count: ${initialCount}")

// Step 4: Delete first notification
if (initialCount > 0) {
    notif.deleteFirst()
    
    int newCount = notif.getNotificationCount()
    WebUI.comment("After deletion: ${newCount}")
    
    WebUI.verifyEqual(newCount, initialCount - 1)
    WebUI.comment("Test PASSED")
} else {
    WebUI.comment("ERROR: No notifications found")
}

// Step 5: Close browser
WebUI.closeBrowser()
