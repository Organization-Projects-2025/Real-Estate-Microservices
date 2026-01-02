package propertyservice

import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.annotation.Keyword
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import com.kms.katalon.core.model.FailureHandling

/**
 * Property Detail Page Keywords for Property Service
 * Provides reusable functions for viewing property details
 */
class PropertyDetail_Keywords {
    
    private static final String BASE_URL = 'http://localhost:5173'
    
    @Keyword
    def navigateToPropertyDetail(String propertyId) {
        WebUI.navigateToUrl("${BASE_URL}/property/${propertyId}")
        WebUI.waitForPageLoad(10)
    }
    
    @Keyword
    def verifyPropertyDetailPageLoaded() {
        WebUI.verifyElementPresent(
            findTestObject('Object Repository/PropertyService/PropertyDetailPage/propertyTitle'),
            10, FailureHandling.STOP_ON_FAILURE
        )
    }
    
    @Keyword
    def getPropertyTitle() {
        return WebUI.getText(findTestObject('Object Repository/PropertyService/PropertyDetailPage/propertyTitle'))
    }
    
    @Keyword
    def getPropertyPrice() {
        return WebUI.getText(findTestObject('Object Repository/PropertyService/PropertyDetailPage/propertyPrice'))
    }
    
    @Keyword
    def getPropertyLocation() {
        return WebUI.getText(findTestObject('Object Repository/PropertyService/PropertyDetailPage/propertyLocation'))
    }
    
    @Keyword
    def verifyMainImageDisplayed() {
        WebUI.verifyElementPresent(
            findTestObject('Object Repository/PropertyService/PropertyDetailPage/mainImage'),
            10, FailureHandling.STOP_ON_FAILURE
        )
    }
    
    @Keyword
    def clickContactAgent() {
        WebUI.click(findTestObject('Object Repository/PropertyService/PropertyDetailPage/contactAgentButton'))
        WebUI.delay(1)
    }
    
    @Keyword
    def clickBackButton() {
        WebUI.click(findTestObject('Object Repository/PropertyService/PropertyDetailPage/backButton'))
        WebUI.waitForPageLoad(10)
    }
    
    @Keyword
    def clickImageThumbnail(int index) {
        WebUI.click(findTestObject('Object Repository/PropertyService/PropertyDetailPage/imageThumbnail'))
        WebUI.delay(1)
    }
    
    @Keyword
    def verifyBedroomsDisplayed() {
        WebUI.verifyElementPresent(
            findTestObject('Object Repository/PropertyService/PropertyDetailPage/bedroomsCount'),
            10, FailureHandling.STOP_ON_FAILURE
        )
    }
    
    @Keyword
    def verifyBathroomsDisplayed() {
        WebUI.verifyElementPresent(
            findTestObject('Object Repository/PropertyService/PropertyDetailPage/bathroomsCount'),
            10, FailureHandling.STOP_ON_FAILURE
        )
    }
    
    @Keyword
    def fillContactForm(String name, String email, String message) {
        WebUI.setText(findTestObject('Object Repository/PropertyService/PropertyDetailPage/contactNameInput'), name)
        WebUI.setText(findTestObject('Object Repository/PropertyService/PropertyDetailPage/contactEmailInput'), email)
        WebUI.setText(findTestObject('Object Repository/PropertyService/PropertyDetailPage/contactMessageInput'), message)
    }
    
    @Keyword
    def clickSendMessage() {
        WebUI.click(findTestObject('Object Repository/PropertyService/PropertyDetailPage/sendMessageButton'))
        WebUI.delay(2)
    }
    
    @Keyword
    def verifyContactFormVisible() {
        WebUI.verifyElementPresent(
            findTestObject('Object Repository/PropertyService/PropertyDetailPage/contactNameInput'),
            10, FailureHandling.STOP_ON_FAILURE
        )
    }
}
