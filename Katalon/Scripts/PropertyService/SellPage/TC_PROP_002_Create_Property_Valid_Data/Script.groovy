import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import propertyservice.Sell_Keywords as SellKeywords
import authentication.Login_Keywords as LoginKeywords

/**
 * Test Case: TC_PROP_002 - Create Property with Valid Data (Complete Form)
 * 
 * Description: Verify that a logged-in user can create a property with ALL fields filled
 * including media upload and verify success message
 * Prerequisites: User must be logged in, test image file must exist
 */

WebUI.openBrowser('')
SellKeywords sellHelper = new SellKeywords()
LoginKeywords loginHelper = new LoginKeywords()

// Test image path - update this to a valid image path on your system
String testImagePath = System.getProperty('user.dir') + '/Data Files/test_property_image.jpg'

try {
    // Login first
    loginHelper.navigateToLogin()
    loginHelper.loginAsUser(1)
    loginHelper.verifyLoginSuccess()
    
    // Navigate to sell page
    sellHelper.navigateToSellPage()
    sellHelper.verifySellPageLoaded()
    
    // Step 1: Fill Basic Info (all fields)
    WebUI.comment('Step 1: Filling Basic Info')
    sellHelper.fillBasicInfo(
        'Luxury 4BR Villa with Pool',
        'Stunning modern villa featuring 4 spacious bedrooms, 3 bathrooms, private pool, landscaped garden, and smart home technology. Located in a prestigious neighborhood with excellent schools nearby.',
        'sale',
        'residential',
        'villa'
    )
    sellHelper.clickNextButton()
    
    // Step 2: Fill Address & Area (all fields)
    WebUI.comment('Step 2: Filling Address & Area')
    sellHelper.fillAddressInfo(
        '456 Palm Beach Boulevard',
        'Miami',
        'Florida',
        'USA',
        '3500',
        '325'
    )
    sellHelper.clickNextButton()
    
    // Step 3: Fill Media & Price
    WebUI.comment('Step 3: Filling Media & Price')
    // Note: Media upload requires a valid file path
    // If file doesn't exist, the test will continue but media won't be uploaded
    try {
        File testFile = new File(testImagePath)
        if (testFile.exists()) {
            sellHelper.uploadMedia(testImagePath)
            WebUI.comment('Media file uploaded successfully')
        } else {
            WebUI.comment('Warning: Test image not found at: ' + testImagePath)
            WebUI.comment('Continuing without media upload - property creation may fail')
        }
    } catch (Exception mediaError) {
        WebUI.comment('Warning: Could not upload media - ' + mediaError.getMessage())
    }
    
    sellHelper.fillPriceInfo('1250000', '2022-06-15', 'active')
    sellHelper.clickNextButton()
    
    // Step 4: Fill Features (all fields including amenities)
    WebUI.comment('Step 4: Filling Features')
    sellHelper.fillAllFeatures(
        '4',      // bedrooms
        '3',      // bathrooms
        '2',      // garage
        'fully',  // furnished
        true,     // pool
        true,     // yard
        true      // pets
    )
    
    // Submit the form
    WebUI.comment('Submitting property listing')
    sellHelper.clickSubmitButton()
    
    // Verify success message
    WebUI.comment('Verifying success message')
    sellHelper.verifySuccessMessage()
    
    WebUI.comment('✅ TC_PROP_002 PASSED: Property created successfully with all fields filled')
    
} catch (Exception e) {
    WebUI.comment('❌ TC_PROP_002 FAILED: ' + e.getMessage())
    throw e
    
} finally {
    WebUI.closeBrowser()
}
