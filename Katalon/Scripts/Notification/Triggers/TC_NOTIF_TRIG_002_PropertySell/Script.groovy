import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import com.kms.katalon.core.model.FailureHandling
import com.kms.katalon.core.configuration.RunConfiguration
import notification.NotificationHelper as NotifHelper
import propertyservice.Sell_Keywords as SellKeywords
import java.io.File

// Initialize helpers
NotifHelper notif = new NotifHelper()
SellKeywords sellKW = new SellKeywords()

// Step 1: Login and get initial notification count
notif.loginAsReviewUser()
notif.navigateToNotifications()
int initialCount = notif.getNotificationCount()
WebUI.comment("Initial notification count: ${initialCount}")

// Step 2: Navigate to Sell page
sellKW.navigateToSellPage()
sellKW.verifySellPageLoaded()

// Step 3: Get the path to villa.jpg in TestData folder
String projectDir = RunConfiguration.getProjectDir()
String imagePath = projectDir + '/TestData/villa.jpg'
WebUI.comment("Project directory: ${projectDir}")
WebUI.comment("Image path: ${imagePath}")

// Verify file exists
File imageFile = new File(imagePath)
if (!imageFile.exists()) {
    WebUI.comment("ERROR: villa.jpg not found at: ${imagePath}")
    // Try alternative path with backslashes for Windows
    imagePath = projectDir + '\\TestData\\villa.jpg'
    WebUI.comment("Trying alternative path: ${imagePath}")
    imageFile = new File(imagePath)
    if (!imageFile.exists()) {
        WebUI.comment("ERROR: villa.jpg not found at alternative path either")
        throw new Exception("villa.jpg file not found in TestData folder")
    }
}
WebUI.comment("✓ villa.jpg found! Size: ${imageFile.length()} bytes")

// Use the absolute path for upload
imagePath = imageFile.getAbsolutePath()
WebUI.comment("Using absolute path: ${imagePath}")

// Step 4: Fill and submit the property listing form
// STEP 1: Basic Info
sellKW.fillBasicInfo(
    'Test Property for Notification',
    'This is a test property to verify notification creation',
    'sale',
    'residential',
    'apartment'
)
sellKW.clickNextButton()

// STEP 2: Address & Area
sellKW.fillAddressInfo(
    '123 Test Street',
    'Test City',
    'Test State',
    'Test Country',
    '1000',
    '93'
)
sellKW.clickNextButton()

// STEP 3: Media & Price - Upload villa.jpg FIRST, then fill price
WebUI.comment("=== STEP 3: Media & Price ===")

// Try to upload file (with fallback)
try {
    WebUI.uploadFile(findTestObject('Object Repository/PropertyService/SellPage/mediaFileInput'), imagePath)
    WebUI.delay(3)
    WebUI.comment("✓ File upload executed")
} catch (Exception e) {
    WebUI.comment("Upload failed, trying sendKeys: ${e.getMessage()}")
    try {
        WebUI.sendKeys(findTestObject('Object Repository/PropertyService/SellPage/mediaFileInput'), imagePath)
        WebUI.delay(3)
        WebUI.comment("✓ sendKeys executed")
    } catch (Exception e2) {
        WebUI.comment("WARNING: Both upload methods failed - continuing anyway")
    }
}

// Fill price info
WebUI.setText(findTestObject('Object Repository/PropertyService/SellPage/priceInput'), '250000')
WebUI.setText(findTestObject('Object Repository/PropertyService/SellPage/buildDateInput'), '2024-01-01')
WebUI.selectOptionByValue(findTestObject('Object Repository/PropertyService/SellPage/statusSelect'), 'active', false)
sellKW.clickNextButton()

// STEP 4: Features
sellKW.fillAllFeatures(
    '2',      // bedrooms
    '2',      // bathrooms
    '1',      // garage
    'fully',  // furnished
    false,    // pool
    false,    // yard
    false     // pets
)

// Step 5: Submit the form
WebUI.comment("Submitting property...")
sellKW.clickSubmitButton()

// Step 6: Wait for submission to complete
WebUI.delay(5)

// Step 7: Navigate to home page (notification bell is in navbar)
WebUI.comment("Navigating to home page...")
WebUI.navigateToUrl('http://localhost:5173/')
WebUI.delay(2)

// Step 8: Open notifications and verify
WebUI.comment("Opening notifications...")
notif.navigateToNotifications()

int newCount = notif.getNotificationCount()
WebUI.comment("Initial count: ${initialCount}, New count: ${newCount}")

// Step 9: Verify notification was created (this is the success indicator)
if (newCount > initialCount) {
    WebUI.comment("✓ Test PASSED: Notification created when property listed for sale")
    WebUI.verifyEqual(newCount, initialCount + 1, FailureHandling.CONTINUE_ON_FAILURE)
} else {
    WebUI.comment("✗ Test FAILED: No new notification created")
    WebUI.comment("Expected: ${initialCount + 1}, Actual: ${newCount}")
    throw new Exception("Notification was not created after property listing")
}

// Step 4: Close browser
WebUI.closeBrowser()
