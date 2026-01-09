package authentication

import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.annotation.Keyword
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import com.kms.katalon.core.model.FailureHandling

/**
 * Reset Password Keywords for Authentication Microservice
 */
class ResetPassword_Keywords {
    
    private static final String BASE_URL = 'http://localhost:5173'
    
    /**
     * Navigate to reset password page with token
     * @param token - Reset token
     */
    @Keyword
    def navigateToResetPassword(String token) {
        String resetUrl = "${BASE_URL}/reset-password/${token}"
        WebUI.navigateToUrl(resetUrl)
        WebUI.waitForPageLoad(10)
    }
    
    /**
     * Verify reset password page is loaded
     */
    @Keyword
    def verifyResetPasswordPageLoaded() {
        WebUI.verifyElementPresent(
            findTestObject('Object Repository/Authentication/ResetPasswordPage/passwordInput'),
            10,
            FailureHandling.STOP_ON_FAILURE
        )
        WebUI.verifyElementPresent(
            findTestObject('Object Repository/Authentication/ResetPasswordPage/confirmPasswordInput'),
            10,
            FailureHandling.STOP_ON_FAILURE
        )
    }
    
    /**
     * Submit new password
     * @param password - New password
     * @param confirmPassword - Confirm password
     */
    @Keyword
    def submitResetPassword(String password, String confirmPassword) {
        // Enter new password
        WebUI.clearText(findTestObject('Object Repository/Authentication/ResetPasswordPage/passwordInput'))
        WebUI.setText(findTestObject('Object Repository/Authentication/ResetPasswordPage/passwordInput'), password)
        
        // Enter confirm password
        WebUI.clearText(findTestObject('Object Repository/Authentication/ResetPasswordPage/confirmPasswordInput'))
        WebUI.setText(findTestObject('Object Repository/Authentication/ResetPasswordPage/confirmPasswordInput'), confirmPassword)
        
        // Click submit
        WebUI.click(findTestObject('Object Repository/Authentication/ResetPasswordPage/resetButton'))
        
        // Wait for response
        WebUI.delay(3)
    }
    
    /**
     * Complete reset password process with token
     * @param token - Reset token
     * @param password - New password
     * @param confirmPassword - Confirm password
     */
    @Keyword
    def resetPassword(String token, String password, String confirmPassword) {
        navigateToResetPassword(token)
        WebUI.delay(2)
        submitResetPassword(password, confirmPassword)
    }
    
    /**
     * Verify password reset was successful
     */
    @Keyword
    def verifyResetPasswordSuccess() {
        WebUI.waitForElementPresent(
            findTestObject('Object Repository/Authentication/ResetPasswordPage/successMessage'),
            10,
            FailureHandling.STOP_ON_FAILURE
        )
        
        String successText = WebUI.getText(
            findTestObject('Object Repository/Authentication/ResetPasswordPage/successMessage')
        )
        
        assert successText.toLowerCase().contains('success'),
            "Success message should contain 'success', but got: '${successText}'"
    }
    
    /**
     * Verify reset password error
     * @param expectedErrorText - Expected error message
     */
    @Keyword
    def verifyResetPasswordError(String expectedErrorText) {
        WebUI.waitForElementPresent(
            findTestObject('Object Repository/Authentication/ResetPasswordPage/errorMessage'),
            10,
            FailureHandling.STOP_ON_FAILURE
        )
        
        String actualError = WebUI.getText(
            findTestObject('Object Repository/Authentication/ResetPasswordPage/errorMessage')
        )
        
        assert actualError.toLowerCase().contains(expectedErrorText.toLowerCase()),
            "Expected error to contain '${expectedErrorText}', but got: '${actualError}'"
    }
}
