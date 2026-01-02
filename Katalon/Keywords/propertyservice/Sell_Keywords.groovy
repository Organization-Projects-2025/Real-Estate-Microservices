package propertyservice

import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.annotation.Keyword
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import com.kms.katalon.core.model.FailureHandling

/**
 * Sell Page Keywords for Property Service
 * Provides reusable functions for creating/listing properties
 */
class Sell_Keywords {
    
    private static final String BASE_URL = 'http://localhost:5173'
    private static final String SELL_URL = "${BASE_URL}/sell"
    
    @Keyword
    def navigateToSellPage() {
        WebUI.navigateToUrl(SELL_URL)
        WebUI.waitForPageLoad(10)
    }
    
    @Keyword
    def verifySellPageLoaded() {
        WebUI.verifyElementPresent(
            findTestObject('Object Repository/PropertyService/SellPage/titleInput'),
            10, FailureHandling.STOP_ON_FAILURE
        )
    }
    
    @Keyword
    def verifyLoginRequired() {
        WebUI.verifyElementPresent(
            findTestObject('Object Repository/PropertyService/SellPage/loginRequiredMessage'),
            10, FailureHandling.STOP_ON_FAILURE
        )
    }
    
    @Keyword
    def fillBasicInfo(String title, String description, String listingType, String propertyType, String subType) {
        WebUI.setText(findTestObject('Object Repository/PropertyService/SellPage/titleInput'), title)
        WebUI.setText(findTestObject('Object Repository/PropertyService/SellPage/descriptionInput'), description)
        WebUI.selectOptionByValue(findTestObject('Object Repository/PropertyService/SellPage/listingTypeSelect'), listingType, false)
        WebUI.selectOptionByValue(findTestObject('Object Repository/PropertyService/SellPage/propertyTypeSelect'), propertyType, false)
        WebUI.selectOptionByValue(findTestObject('Object Repository/PropertyService/SellPage/subTypeSelect'), subType, false)
    }

    @Keyword
    def fillAddressInfo(String street, String city, String state, String country, String sqft, String sqm) {
        WebUI.setText(findTestObject('Object Repository/PropertyService/SellPage/streetInput'), street)
        WebUI.setText(findTestObject('Object Repository/PropertyService/SellPage/cityInput'), city)
        WebUI.setText(findTestObject('Object Repository/PropertyService/SellPage/stateInput'), state)
        WebUI.setText(findTestObject('Object Repository/PropertyService/SellPage/countryInput'), country)
        WebUI.setText(findTestObject('Object Repository/PropertyService/SellPage/areaSqftInput'), sqft)
        WebUI.setText(findTestObject('Object Repository/PropertyService/SellPage/areaSqmInput'), sqm)
    }
    
    @Keyword
    def fillPriceInfo(String price, String buildDate, String status) {
        WebUI.setText(findTestObject('Object Repository/PropertyService/SellPage/priceInput'), price)
        WebUI.setText(findTestObject('Object Repository/PropertyService/SellPage/buildDateInput'), buildDate)
        WebUI.selectOptionByValue(findTestObject('Object Repository/PropertyService/SellPage/statusSelect'), status, false)
    }
    
    @Keyword
    def uploadMedia(String filePath) {
        WebUI.uploadFile(findTestObject('Object Repository/PropertyService/SellPage/mediaFileInput'), filePath)
        WebUI.delay(2)
    }
    
    @Keyword
    def fillMediaAndPrice(String filePath, String price, String buildDate, String status) {
        // Upload media file
        if (filePath != null && filePath.length() > 0) {
            WebUI.uploadFile(findTestObject('Object Repository/PropertyService/SellPage/mediaFileInput'), filePath)
            WebUI.delay(2)
        }
        // Fill price info
        WebUI.setText(findTestObject('Object Repository/PropertyService/SellPage/priceInput'), price)
        WebUI.setText(findTestObject('Object Repository/PropertyService/SellPage/buildDateInput'), buildDate)
        WebUI.selectOptionByValue(findTestObject('Object Repository/PropertyService/SellPage/statusSelect'), status, false)
    }
    
    @Keyword
    def fillFeatures(String bedrooms, String bathrooms, String garage, String furnished, boolean pool) {
        WebUI.setText(findTestObject('Object Repository/PropertyService/SellPage/bedroomsInput'), bedrooms)
        WebUI.setText(findTestObject('Object Repository/PropertyService/SellPage/bathroomsInput'), bathrooms)
        WebUI.setText(findTestObject('Object Repository/PropertyService/SellPage/garageInput'), garage)
        WebUI.selectOptionByValue(findTestObject('Object Repository/PropertyService/SellPage/furnishedSelect'), furnished, false)
        if (pool) {
            WebUI.check(findTestObject('Object Repository/PropertyService/SellPage/poolCheckbox'))
        }
    }
    
    @Keyword
    def fillAllFeatures(String bedrooms, String bathrooms, String garage, String furnished, 
                        boolean pool, boolean yard, boolean pets) {
        WebUI.setText(findTestObject('Object Repository/PropertyService/SellPage/bedroomsInput'), bedrooms)
        WebUI.setText(findTestObject('Object Repository/PropertyService/SellPage/bathroomsInput'), bathrooms)
        WebUI.setText(findTestObject('Object Repository/PropertyService/SellPage/garageInput'), garage)
        WebUI.selectOptionByValue(findTestObject('Object Repository/PropertyService/SellPage/furnishedSelect'), furnished, false)
        if (pool) {
            WebUI.check(findTestObject('Object Repository/PropertyService/SellPage/poolCheckbox'))
        }
        if (yard) {
            WebUI.check(findTestObject('Object Repository/PropertyService/SellPage/yardCheckbox'))
        }
        if (pets) {
            WebUI.check(findTestObject('Object Repository/PropertyService/SellPage/petsCheckbox'))
        }
    }
    
    @Keyword
    def clickNextButton() {
        WebUI.click(findTestObject('Object Repository/PropertyService/SellPage/nextButton'))
        WebUI.delay(1)
    }
    
    @Keyword
    def clickBackButton() {
        WebUI.click(findTestObject('Object Repository/PropertyService/SellPage/backButton'))
        WebUI.delay(1)
    }
    
    @Keyword
    def clickSubmitButton() {
        WebUI.click(findTestObject('Object Repository/PropertyService/SellPage/submitButton'))
        WebUI.delay(3)
    }
    
    @Keyword
    def verifySuccessMessage() {
        WebUI.verifyElementPresent(
            findTestObject('Object Repository/PropertyService/SellPage/successMessage'),
            15, FailureHandling.STOP_ON_FAILURE
        )
    }
    
    @Keyword
    def verifyErrorMessage() {
        WebUI.verifyElementPresent(
            findTestObject('Object Repository/PropertyService/SellPage/errorMessage'),
            10, FailureHandling.STOP_ON_FAILURE
        )
    }
}
