import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import authentication.Register_Keywords as RegisterKeywords

WebUI.openBrowser('')
RegisterKeywords registerHelper = new RegisterKeywords()

try {
    String uniqueEmail = registerHelper.generateUniqueEmail('missing')
    
    registerHelper.register(
        '',  // Empty first name
        '',  // Empty last name
        uniqueEmail,
        'Password123!',
        'user'
    )
    
    // Assert: Verify we're still on registration page
    String currentUrl = WebUI.getUrl()
    assert currentUrl.contains('/register'),
        "Should remain on register page with missing fields. Current URL: ${currentUrl}"
    
    WebUI.comment('✅ TC_AUTH_010 PASSED: Registration correctly prevented with missing fields')
    
} catch (Exception e) {
    WebUI.comment('❌ TC_AUTH_010 FAILED: ' + e.getMessage())
    throw e
    
} finally {
    WebUI.closeBrowser()
}
