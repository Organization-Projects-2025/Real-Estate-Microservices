import com.kms.katalon.core.testobject.ConditionType
import com.kms.katalon.core.testobject.TestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import authentication.Login_Keywords as LoginKeywords

/**
 * Test Case: TC_DEVPROP_015 - Get Developer By Valid ID (UI)
 *
 * Description: Verify the Manage Developer Properties UI lists the expected developer option.
 */

WebUI.openBrowser('')
LoginKeywords loginHelper = new LoginKeywords()

try {
    loginHelper.navigateToLogin()
    loginHelper.loginAsAdmin()
    loginHelper.verifyLoginSuccess()

    WebUI.navigateToUrl('http://localhost:5173/manage-developer-properties')
    WebUI.waitForPageLoad(10)
    WebUI.verifyTextPresent('Manage Developer Properties', false)

    TestObject developerOption = new TestObject('developerOption')
    developerOption.addProperty('xpath', ConditionType.EQUALS, "//option[@value='${developer_id}']")
    WebUI.verifyElementPresent(developerOption, 10)

    WebUI.comment("✅ TC_DEVPROP_015 PASSED: Developer option for ID ${developer_id} is visible in UI")
} catch (Exception e) {
    WebUI.comment("❌ TC_DEVPROP_015 FAILED: " + e.getMessage())
    throw e
} finally {
    WebUI.closeBrowser()
}