package propertyservice

import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.annotation.Keyword
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import com.kms.katalon.core.model.FailureHandling

/**
 * Buy/Rent Page Keywords for Property Service
 * Provides reusable functions for browsing/searching properties
 */
class Properties_Keywords {
    
    private static final String BASE_URL = 'http://localhost:5173'
    private static final String BUY_URL = "${BASE_URL}/buy"
    private static final String RENT_URL = "${BASE_URL}/rent"
    
    @Keyword
    def navigateToBuyPage() {
        WebUI.navigateToUrl(BUY_URL)
        WebUI.waitForPageLoad(10)
    }
    
    @Keyword
    def navigateToRentPage() {
        WebUI.navigateToUrl(RENT_URL)
        WebUI.waitForPageLoad(10)
    }
    
    @Keyword
    def verifyBuyPageLoaded() {
        WebUI.verifyElementPresent(
            findTestObject('Object Repository/PropertyService/BuyRentPage/browsePropertiesHeading'),
            10, FailureHandling.STOP_ON_FAILURE
        )
    }
    
    @Keyword
    def verifyRentPageLoaded() {
        WebUI.verifyElementPresent(
            findTestObject('Object Repository/PropertyService/BuyRentPage/browsePropertiesHeading'),
            10, FailureHandling.STOP_ON_FAILURE
        )
    }
    
    @Keyword
    def waitForPropertiesToLoad() {
        WebUI.waitForElementNotPresent(
            findTestObject('Object Repository/PropertyService/BuyRentPage/loadingSpinner'),
            15, FailureHandling.OPTIONAL
        )
        WebUI.delay(2)
    }
    
    @Keyword
    def searchProperties(String searchTerm) {
        WebUI.setText(findTestObject('Object Repository/PropertyService/BuyRentPage/searchInput'), searchTerm)
        WebUI.delay(2)
    }
    
    @Keyword
    def verifyPropertyCardsDisplayed() {
        WebUI.verifyElementPresent(
            findTestObject('Object Repository/PropertyService/BuyRentPage/propertyCard'),
            10, FailureHandling.STOP_ON_FAILURE
        )
    }
    
    @Keyword
    def verifyNoPropertiesMessage() {
        WebUI.verifyElementPresent(
            findTestObject('Object Repository/PropertyService/BuyRentPage/noPropertiesMessage'),
            10, FailureHandling.STOP_ON_FAILURE
        )
    }
    
    @Keyword
    def clickFirstViewDetails() {
        WebUI.click(findTestObject('Object Repository/PropertyService/BuyRentPage/viewDetailsButton'))
        WebUI.waitForPageLoad(10)
    }
    
    @Keyword
    def getPropertyTitle() {
        return WebUI.getText(findTestObject('Object Repository/PropertyService/BuyRentPage/propertyTitle'))
    }
    
    @Keyword
    def getPropertyPrice() {
        return WebUI.getText(findTestObject('Object Repository/PropertyService/BuyRentPage/propertyPrice'))
    }
    
    // ==================== FILTER METHODS ====================
    
    @Keyword
    def openFilterPanel() {
        WebUI.click(findTestObject('Object Repository/PropertyService/BuyRentPage/filterButton'))
        WebUI.delay(1)
    }
    
    @Keyword
    def verifyFilterPanelOpen() {
        WebUI.verifyElementPresent(
            findTestObject('Object Repository/PropertyService/BuyRentPage/filterPanel'),
            10, FailureHandling.STOP_ON_FAILURE
        )
    }
    
    @Keyword
    def selectPriceRange(String priceRange) {
        WebUI.selectOptionByValue(
            findTestObject('Object Repository/PropertyService/BuyRentPage/priceRangeSelect'),
            priceRange, false
        )
        WebUI.delay(1)
    }
    
    @Keyword
    def selectPropertyType(String propertyType) {
        WebUI.selectOptionByValue(
            findTestObject('Object Repository/PropertyService/BuyRentPage/propertyTypeSelect'),
            propertyType, false
        )
        WebUI.delay(1)
    }
    
    @Keyword
    def selectBedrooms(String bedrooms) {
        switch(bedrooms) {
            case 'Any':
                WebUI.click(findTestObject('Object Repository/PropertyService/BuyRentPage/bedroomsAnyButton'))
                break
            case '2+':
                WebUI.click(findTestObject('Object Repository/PropertyService/BuyRentPage/bedrooms2PlusButton'))
                break
            case '3+':
                WebUI.click(findTestObject('Object Repository/PropertyService/BuyRentPage/bedrooms3PlusButton'))
                break
            default:
                WebUI.click(findTestObject('Object Repository/PropertyService/BuyRentPage/bedroomsAnyButton'))
        }
        WebUI.delay(1)
    }
    
    @Keyword
    def selectBathrooms(String bathrooms) {
        switch(bathrooms) {
            case 'Any':
                WebUI.click(findTestObject('Object Repository/PropertyService/BuyRentPage/bathroomsAnyButton'))
                break
            case '2+':
                WebUI.click(findTestObject('Object Repository/PropertyService/BuyRentPage/bathrooms2PlusButton'))
                break
            default:
                WebUI.click(findTestObject('Object Repository/PropertyService/BuyRentPage/bathroomsAnyButton'))
        }
        WebUI.delay(1)
    }
    
    @Keyword
    def togglePoolFilter() {
        WebUI.click(findTestObject('Object Repository/PropertyService/BuyRentPage/poolButton'))
        WebUI.delay(1)
    }
    
    @Keyword
    def togglePetsFilter() {
        WebUI.click(findTestObject('Object Repository/PropertyService/BuyRentPage/petsButton'))
        WebUI.delay(1)
    }
    
    @Keyword
    def toggleParkingFilter() {
        WebUI.click(findTestObject('Object Repository/PropertyService/BuyRentPage/parkingButton'))
        WebUI.delay(1)
    }
    
    @Keyword
    def selectFurnished(String furnished) {
        WebUI.selectOptionByValue(
            findTestObject('Object Repository/PropertyService/BuyRentPage/furnishedSelect'),
            furnished, false
        )
        WebUI.delay(1)
    }
    
    @Keyword
    def clearAllFilters() {
        WebUI.click(findTestObject('Object Repository/PropertyService/BuyRentPage/clearFiltersButton'))
        WebUI.delay(1)
    }
    
    @Keyword
    def verifyResultsIndicator() {
        WebUI.verifyElementPresent(
            findTestObject('Object Repository/PropertyService/BuyRentPage/resultsIndicator'),
            10, FailureHandling.STOP_ON_FAILURE
        )
    }
    
    @Keyword
    def getResultsText() {
        return WebUI.getText(findTestObject('Object Repository/PropertyService/BuyRentPage/resultsIndicator'))
    }
}
