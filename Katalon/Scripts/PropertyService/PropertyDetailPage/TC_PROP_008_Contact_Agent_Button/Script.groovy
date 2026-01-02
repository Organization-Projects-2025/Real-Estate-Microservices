import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import propertyservice.Properties_Keywords as PropertiesKeywords
import propertyservice.PropertyDetail_Keywords as DetailKeywords

/**
 * Test Case: TC_PROP_008 - Contact Agent Form
 * 
 * Description: Verify that Contact Agent form can be filled and submitted
 * Prerequisites: Properties must exist in database
 */

WebUI.openBrowser('')
PropertiesKeywords propsHelper = new PropertiesKeywords()
DetailKeywords detailHelper = new DetailKeywords()

try {
    // Navigate to Buy page and click first property
    propsHelper.navigateToBuyPage()
    propsHelper.waitForPropertiesToLoad()
    propsHelper.clickFirstViewDetails()
    
    // Verify property detail page loaded
    detailHelper.verifyPropertyDetailPageLoaded()
    
    // Click Contact Agent button to show form
    detailHelper.clickContactAgent()
    
    // Verify contact form is visible
    detailHelper.verifyContactFormVisible()
    
    // Fill the contact form
    detailHelper.fillContactForm('John Doe', 'john.doe@example.com', 'I am interested in this property. Please contact me.')
    
    // Click Send Message
    detailHelper.clickSendMessage()
    
    WebUI.comment('✅ TC_PROP_008 PASSED: Contact Agent form filled and submitted')
    
} catch (Exception e) {
    WebUI.comment('❌ TC_PROP_008 FAILED: ' + e.getMessage())
    throw e
    
} finally {
    WebUI.closeBrowser()
}
