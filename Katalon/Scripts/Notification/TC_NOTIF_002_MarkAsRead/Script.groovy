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
reviewKW.fillReviewForm('Test Reviewer Notif', '694b6474061ba8a480628253', 1, 'Test review for notification')
reviewKW.submitReview()
WebUI.delay(2)

// Step 2: Navigate to notifications
notif.navigateToNotifications()

// Step 3: Get initial unread count
int initialUnread = notif.getUnreadCount()
WebUI.comment("Initial unread: ${initialUnread}")

// Step 4: Mark first as read
if (initialUnread > 0) {
    notif.markFirstAsRead()
    
    int newUnread = notif.getUnreadCount()
    WebUI.comment("After marking as read: ${newUnread}")
    
    WebUI.verifyEqual(newUnread, initialUnread - 1)
    WebUI.comment("Test PASSED")
} else {
    WebUI.comment("ERROR: No unread notifications")
}

// Step 5: Close browser
WebUI.closeBrowser()
