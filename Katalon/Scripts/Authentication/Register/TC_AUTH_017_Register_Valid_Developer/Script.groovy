import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import authentication.Register_Keywords as RegisterKeywords

WebUI.openBrowser('')
RegisterKeywords registerHelper = new RegisterKeywords()

try {
    registerHelper.register(
        'Test',
        'User',
        'admin@realestate.com',  // Already exists in database
        'Password123!',
        'user'
    )
    
    // Assert: Verify error message about duplicate email
    registerHelper.verifyRegistrationError('already exists')
    
    WebUI.comment('✅ TC_AUTH_008 PASSED: Registration correctly prevented duplicate email')
    
} catch (Exception e) {
    WebUI.comment('❌ TC_AUTH_008 FAILED: ' + e.getMessage())
    throw e
    
} finally {
    WebUI.closeBrowser()
}
