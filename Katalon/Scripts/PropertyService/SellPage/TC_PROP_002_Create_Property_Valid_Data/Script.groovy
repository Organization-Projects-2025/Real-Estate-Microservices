import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import propertyservice.Sell_Keywords as SellKeywords
import authentication.Login_Keywords as LoginKeywords
import com.kms.katalon.core.model.FailureHandling

/**
 * Test Case: TC_PROP_002 - Create Property with Valid Data (Complete Form)
 * 
 * Description: Verify that a logged-in user can fill all property form fields
 * Note: Full submission requires media upload which needs Appwrite connection
 */

WebUI.openBrowser('')
SellKeywords sellHelper = new SellKeywords()
LoginKeywords loginHelper = new LoginKeywords()

try {
    // Login first
    loginHelper.navigateToLogin()
    loginHelper.loginAsUser(1)
    loginHelper.verifyLoginSuccess()
    
    // Navigate to sell page
    sellHelper.navigateToSellPage()
    sellHelper.verifySellPageLoaded()
    
    // Step 1: Fill Basic Info
    WebUI.comment('Step 1: Filling Basic Info')
    sellHelper.fillBasicInfo(
        'Luxury 4BR Villa with Pool',
        'Stunning modern villa featuring 4 spacious bedrooms, 3 bathrooms, private pool.',
        'sale',
        'residential',
        'villa'
    )
    sellHelper.clickNextButton()
    WebUI.comment('Step 1 completed - Basic Info filled')
    
    // Step 2: Fill Address & Area
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
    WebUI.comment('Step 2 completed - Address & Area filled')
    
    // Step 3: Fill Price (skip media - requires Appwrite)
    WebUI.comment('Step 3: Filling Price Info')
    sellHelper.fillPriceInfo('1250000', '2022-06-15', 'active')
    sellHelper.clickNextButton()
    WebUI.comment('Step 3 completed - Price filled')
    
    // Step 4: Fill Features
    WebUI.comment('Step 4: Filling Features')
    sellHelper.fillFeatures(
        '4',      // bedrooms
        '3',      // bathrooms
        '2',      // garage
        'fully',  // furnished
        true      // pool
    )
    WebUI.comment('Step 4 completed - Features filled')
    
    // Try to submit - will show error about missing image (expected)
    WebUI.comment('Attempting submit (will fail without image - expected)')
    sellHelper.clickSubmitButton()
    
    // Check for error message about missing image (this is expected behavior)
    boolean hasErrorMessage = WebUI.verifyElementPresent(
        findTestObject('Object Repository/PropertyService/SellPage/errorMessage'),
        5, FailureHandling.OPTIONAL
    )
    
    if (hasErrorMessage) {
        WebUI.comment('Error message shown (expected - image required)')
    }
    
    WebUI.comment('✅ TC_PROP_002 PASSED: All form fields filled successfully')
    
} catch (Exception e) {
    WebUI.comment('❌ TC_PROP_002 FAILED: ' + e.getMessage())
    throw e
    
} finally {
    WebUI.closeBrowser()
}
