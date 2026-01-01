package authentication

import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.annotation.Keyword
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import com.kms.katalon.core.model.FailureHandling

/**
 * Forgot Password Keywords for Authentication Microservice
 */
class ForgotPassword_Keywords {
    
    private static final String BASE_URL = 'http://localhost:5173'
    private static final String FORGOT_PASSWORD_URL = "${BASE_URL}/forget-password"
    
    /**
     * Navigate to forgot password page
     */
    @Keyword
    def navigateToForgotPassword() {
        WebUI.navigateToUrl(FORGOT_PASSWORD_URL)
        WebUI.waitForPageLoad(10)
        verifyForgotPasswordPageLoaded()
    }
    
    /**
     * Verify forgot password page is loaded
     */
    @Keyword
    def verifyForgotPasswordPageLoaded() {
        WebUI.verifyElementPresent(
            findTestObject('Object Repository/Authentication/ForgotPasswordPage/emailInput'),
            10,
            FailureHandling.STOP_ON_FAILURE
        )
        WebUI.verifyElementPresent(
            findTestObject('Object Repository/Authentication/ForgotPasswordPage/submitButton'),
            10,
            FailureHandling.STOP_ON_FAILURE
        )
    }
    
    /**
     * Submit forgot password request
     * @param email - Email address
     */
    @Keyword
    def submitForgotPassword(String email) {
        // Navigate if not already on page
        if (!WebUI.getUrl().contains('/forget-password')) {
            navigateToForgotPassword()
        }
        
        // Enter email
        WebUI.clearText(findTestObject('Object Repository/Authentication/ForgotPasswordPage/emailInput'))
        WebUI.setText(findTestObject('Object Repository/Authentication/ForgotPasswordPage/emailInput'), email)
        
        // Click submit button
        WebUI.click(findTestObject('Object Repository/Authentication/ForgotPasswordPage/submitButton'))
        
        // Wait for response
        WebUI.delay(3)
    }
    
    /**
     * Verify success message after sending reset link
     */
    @Keyword
    def verifyResetLinkSent() {
        WebUI.waitForElementPresent(
            findTestObject('Object Repository/Authentication/ForgotPasswordPage/successMessage'),
            10,
            FailureHandling.STOP_ON_FAILURE
        )
        
        String successText = WebUI.getText(
            findTestObject('Object Repository/Authentication/ForgotPasswordPage/successMessage')
        )
        
        assert successText.toLowerCase().contains('sent'),
            "Success message should contain 'sent', but got: '${successText}'"
    }
    
    /**
     * Verify error message
     * @param expectedErrorText - Expected error message
     */
    @Keyword
    def verifyForgotPasswordError(String expectedErrorText) {
        WebUI.waitForElementPresent(
            findTestObject('Object Repository/Authentication/ForgotPasswordPage/errorMessage'),
            10,
            FailureHandling.STOP_ON_FAILURE
        )
        
        String actualError = WebUI.getText(
            findTestObject('Object Repository/Authentication/ForgotPasswordPage/errorMessage')
        )
        
        assert actualError.toLowerCase().contains(expectedErrorText.toLowerCase()),
            "Expected error to contain '${expectedErrorText}', but got: '${actualError}'"
    }
    
    /**
     * Click back to login button
     */
    @Keyword
    def clickBackToLogin() {
        WebUI.click(findTestObject('Object Repository/Authentication/ForgotPasswordPage/backToLoginButton'))
        WebUI.waitForPageLoad(10)
    }
}
