import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable as GlobalVariable

WebUI.openBrowser('')
WebUI.navigateToUrl(GlobalVariable.BASE_URL + '/register')
WebUI.maximizeWindow()

// Generate unique email for first registration
String timestamp = String.valueOf(System.currentTimeMillis())
String uniqueEmail = "duplicate_${timestamp}@test.com"

// First registration - should succeed
WebUI.setText(findTestObject('Authentication/Register/input_FirstName'), 'John')
WebUI.setText(findTestObject('Authentication/Register/input_LastName'), 'Doe')
WebUI.setText(findTestObject('Authentication/Register/input_Email'), uniqueEmail)
WebUI.setText(findTestObject('Authentication/Register/input_Password'), 'ValidPass123!')
WebUI.setText(findTestObject('Authentication/Register/input_ConfirmPassword'), 'ValidPass123!')
WebUI.click(findTestObject('Authentication/Register/button_Register'))

// Wait for registration success
WebUI.delay(2)

// Navigate back to register page
WebUI.navigateToUrl(GlobalVariable.BASE_URL + '/register')

// Try to register with SAME email - should fail
WebUI.setText(findTestObject('Authentication/Register/input_FirstName'), 'Jane')
WebUI.setText(findTestObject('Authentication/Register/input_LastName'), 'Smith')
WebUI.setText(findTestObject('Authentication/Register/input_Email'), uniqueEmail)
WebUI.setText(findTestObject('Authentication/Register/input_Password'), 'ValidPass123!')
WebUI.setText(findTestObject('Authentication/Register/input_ConfirmPassword'), 'ValidPass123!')
WebUI.click(findTestObject('Authentication/Register/button_Register'))

// Verify duplicate email error message
WebUI.verifyElementPresent(findTestObject('Authentication/Register/error_DuplicateEmail'), 5)
WebUI.verifyElementText(findTestObject('Authentication/Register/error_DuplicateEmail'), 'Email already exists')

WebUI.closeBrowser()
