import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import authentication.Login_Keywords as LoginKeywords
import propertyservice.Sell_Keywords as SellKeywords

LoginKeywords loginHelper = new LoginKeywords()
SellKeywords sellHelper = new SellKeywords()

try {
    WebUI.openBrowser('')
    loginHelper.navigateToLogin()
    loginHelper.login('user1@realestate.com', 'Password123!')
    WebUI.delay(2)
    sellHelper.navigateToSellPage()
    WebUI.delay(2)
    
    // Verify the sell form is displayed (user is authenticated)
    sellHelper.verifySellPageLoaded()
    
    // Step 1: Basic Info - fill all required fields
    WebUI.setText(findTestObject('Object Repository/PropertyService/SellPage/titleInput'), 'Test Property Listing')
    WebUI.setText(findTestObject('Object Repository/PropertyService/SellPage/descriptionInput'), 'Beautiful test property with great features')
    WebUI.selectOptionByValue(findTestObject('Object Repository/PropertyService/SellPage/listingTypeSelect'), 'sale', false)
    WebUI.selectOptionByValue(findTestObject('Object Repository/PropertyService/SellPage/propertyTypeSelect'), 'residential', false)
    WebUI.selectOptionByValue(findTestObject('Object Repository/PropertyService/SellPage/subTypeSelect'), 'apartment', false)
    WebUI.delay(1)
    
    // Click Next to go to Step 2
    sellHelper.clickNextButton()
    WebUI.delay(1)
    
    // Step 2: Address & Area
    WebUI.setText(findTestObject('Object Repository/PropertyService/SellPage/streetInput'), '123 Test Street')
    WebUI.setText(findTestObject('Object Repository/PropertyService/SellPage/cityInput'), 'Cairo')
    WebUI.setText(findTestObject('Object Repository/PropertyService/SellPage/stateInput'), 'Cairo')
    WebUI.setText(findTestObject('Object Repository/PropertyService/SellPage/countryInput'), 'Egypt')
    WebUI.setText(findTestObject('Object Repository/PropertyService/SellPage/areaSqftInput'), '1500')
    WebUI.setText(findTestObject('Object Repository/PropertyService/SellPage/areaSqmInput'), '140')
    WebUI.delay(1)
    
    // Click Next to go to Step 3
    sellHelper.clickNextButton()
    WebUI.delay(1)
    
    // Step 3: Media & Price - Skip media upload, just fill price
    WebUI.setText(findTestObject('Object Repository/PropertyService/SellPage/priceInput'), '500000')
    WebUI.setText(findTestObject('Object Repository/PropertyService/SellPage/buildDateInput'), '2020-01-15')
    WebUI.selectOptionByValue(findTestObject('Object Repository/PropertyService/SellPage/statusSelect'), 'active', false)
    WebUI.delay(1)
    
    // Click Next to go to Step 4
    sellHelper.clickNextButton()
    WebUI.delay(1)
    
    // Step 4: Features - verify we reached the final step
    WebUI.verifyElementPresent(findTestObject('Object Repository/PropertyService/SellPage/bedroomsInput'), 10)
    WebUI.setText(findTestObject('Object Repository/PropertyService/SellPage/bedroomsInput'), '3')
    WebUI.setText(findTestObject('Object Repository/PropertyService/SellPage/bathroomsInput'), '2')
    WebUI.setText(findTestObject('Object Repository/PropertyService/SellPage/garageInput'), '1')
    WebUI.selectOptionByValue(findTestObject('Object Repository/PropertyService/SellPage/furnishedSelect'), 'fully', false)
    WebUI.delay(1)
    
    // Verify submit button is present (we completed all form steps)
    WebUI.verifyElementPresent(findTestObject('Object Repository/PropertyService/SellPage/submitButton'), 10)
    
    WebUI.comment('✅ TC_PROP_017 PASSED: Property listing form completed all steps successfully')
} catch (Exception e) {
    WebUI.comment('❌ TC_PROP_017 FAILED: ' + e.getMessage())
    throw e
} finally {
    WebUI.closeBrowser()
}
