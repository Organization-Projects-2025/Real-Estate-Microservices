import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import authentication.ResetPassword_Keywords as ResetPasswordKeywords
import authentication.Login_Keywords as LoginKeywords

WebUI.openBrowser('')
WebUI.maximizeWindow()
ResetPasswordKeywords resetPasswordHelper = new ResetPasswordKeywords()
LoginKeywords loginHelper = new LoginKeywords()

try {
    String testEmail = 'testing@gmail.com'
    String validToken = '2df929b7cdcd84a0df074f20124f5a660f9b7ea41067c7a523a1db7015295baa'
    String newPassword = 'NewSecurePass123!@#'
    String confirmPassword = 'NewSecurePass123!@#'
    
    resetPasswordHelper.resetPassword(validToken, newPassword, confirmPassword)
    
    boolean successMessagePresent = WebUI.verifyElementPresent(
        findTestObject('Authentication/ResetPasswordPage/successMessage'),
        10,
        com.kms.katalon.core.model.FailureHandling.OPTIONAL
    )
    
    if (successMessagePresent) {
        String successText = WebUI.getText(findTestObject('Authentication/ResetPasswordPage/successMessage'))
        assert successText.contains('Password has been successfully reset!'),
               "Expected 'Password has been successfully reset!', got: ${successText}"
        
        println("✓ Success message displayed: ${successText}")
    }
    
    String currentUrl = WebUI.getUrl()
    assert currentUrl.contains('/login'), "Should redirect to login page, but current URL is: ${currentUrl}"
    println('✓ Redirected to login page')
    
    loginHelper.login(testEmail, newPassword)
    String finalUrl = WebUI.getUrl()
    assert !finalUrl.contains('/login') && !finalUrl.contains('/register'),
           "Should be logged in and redirected away from auth pages, but URL is: ${finalUrl}"
    
    println("✓ Successfully logged in with new password")
    println('✓ TC_AUTH_033 PASSED: Password reset successful and login with new password verified')
    
} catch (Exception e) {
    println('✗ TC_AUTH_033 FAILED: ' + e.getMessage())
    throw e
} finally {
    WebUI.closeBrowser()
}
