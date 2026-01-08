import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import com.kms.katalon.core.model.FailureHandling
import notification.NotificationHelper as NotifHelper
import review.Review_Keywords as ReviewKeywords

// Initialize helpers
NotifHelper notif = new NotifHelper()
ReviewKeywords reviewKW = new ReviewKeywords()

// Step 1: Login and get initial notification count
notif.loginAsReviewUser()
notif.navigateToNotifications()
int initialCount = notif.getNotificationCount()
WebUI.comment("Initial notification count: ${initialCount}")

// Step 2: Navigate to write review page directly
WebUI.navigateToUrl('http://localhost:5173/write-review')
WebUI.delay(2)

// Step 3: Fill and submit review
reviewKW.fillReviewForm('Test Reviewer Trigger', '694b6474061ba8a480628253', 5, 'Testing notification trigger on review post')
reviewKW.submitReview()
WebUI.delay(3)

// Step 4: Navigate back to notifications and verify new notification
notif.navigateToNotifications()
int newCount = notif.getNotificationCount()
WebUI.comment("After review post: ${newCount}")

// Step 5: Verify notification was created
WebUI.verifyEqual(newCount, initialCount + 1, FailureHandling.STOP_ON_FAILURE)

WebUI.comment("Test PASSED: Notification created when review posted")

// Cleanup: Delete the test notification (optional - don't fail test if cleanup fails)
try {
    if (newCount > initialCount) {
        notif.deleteFirst()
        WebUI.comment("Cleanup: Test notification deleted")
    }
} catch (Exception e) {
    WebUI.comment("Cleanup failed (non-critical): " + e.getMessage())
}

// Step 6: Close browser
WebUI.closeBrowser()


