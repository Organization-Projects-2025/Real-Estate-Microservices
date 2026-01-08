package notification

import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.annotation.Keyword
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import com.kms.katalon.core.model.FailureHandling

/**
 * Notification Helper for Notification Page Testing
 * Provides reusable notification functions for all test cases
 */
class NotificationHelper {
    
    private static final String BASE_URL = 'http://localhost:5173'
    
    // Use review user credentials (same as Review_Keywords)
    private static final String USER_EMAIL = 'a7med3li@gmail.com'
    private static final String USER_PASSWORD_ENCRYPTED = 't8wp1gy9IWfOCKxwWlfTFQ=='
    
    /**
     * Login as review user (a7med3li@gmail.com)
     */
    @Keyword
    def loginAsReviewUser() {
        WebUI.openBrowser('')
        WebUI.navigateToUrl("${BASE_URL}/login")
        WebUI.delay(2)
        
        WebUI.waitForElementPresent(findTestObject('Object Repository/Authentication/LoginPage/emailInput'), 10)
        WebUI.setText(findTestObject('Object Repository/Authentication/LoginPage/emailInput'), USER_EMAIL)
        WebUI.setEncryptedText(findTestObject('Object Repository/Authentication/LoginPage/passwordInput'), USER_PASSWORD_ENCRYPTED)
        WebUI.click(findTestObject('Object Repository/Authentication/LoginPage/loginButton'))
        
        WebUI.delay(3)
        WebUI.waitForPageLoad(10)
    }
    
    /**
     * Navigate to notifications page via bell icon
     */
    @Keyword
    def navigateToNotifications() {
        WebUI.waitForElementClickable(findTestObject('Object Repository/Notification/notificationBellIcon'), 10)
        WebUI.click(findTestObject('Object Repository/Notification/notificationBellIcon'))
        WebUI.delay(2)
        WebUI.waitForPageLoad(10)
    }
    
    /**
     * Get count of all notifications
     */
    @Keyword
    def getNotificationCount() {
        def notifications = WebUI.findWebElements(findTestObject('Object Repository/Notification/notificationItem'), 10)
        return notifications.size()
    }
    
    /**
     * Get count of unread notifications
     */
    @Keyword
    def getUnreadCount() {
        def unread = WebUI.findWebElements(findTestObject('Object Repository/Notification/unreadNotificationItem'), 10)
        return unread.size()
    }
    
    /**
     * Mark first unread notification as read
     */
    @Keyword
    def markFirstAsRead() {
        WebUI.waitForElementPresent(findTestObject('Object Repository/Notification/firstUnreadNotification'), 10)
        WebUI.mouseOver(findTestObject('Object Repository/Notification/firstUnreadNotification'))
        WebUI.delay(1)
        WebUI.click(findTestObject('Object Repository/Notification/markAsReadButton'))
        WebUI.delay(2)
    }
    
    /**
     * Delete first notification
     */
    @Keyword
    def deleteFirst() {
        WebUI.waitForElementPresent(findTestObject('Object Repository/Notification/firstNotification'), 10)
        WebUI.mouseOver(findTestObject('Object Repository/Notification/firstNotification'))
        WebUI.delay(1)
        WebUI.click(findTestObject('Object Repository/Notification/deleteButton'))
        WebUI.delay(2)
    }
}
