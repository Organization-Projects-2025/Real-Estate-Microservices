import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import com.kms.katalon.core.model.FailureHandling
import authentication.Login_Keywords as LoginKeywords
import admin.Filter_Keywords as FilterKeywords

/**
 * Test Case: TC_ADM_FILTER_004 - Edit Existing Filter
 * Module: Admin Service - Filter Management
 * Priority: High
 * 
 * Description: Verify that admin can edit an existing filter and changes are saved
 * Prerequisites: Admin user is logged in, Application is running on localhost:5173
 * Test Data: Creates a test filter, then edits it
 */

// Initialize
WebUI.openBrowser('')
LoginKeywords loginHelper = new LoginKeywords()
FilterKeywords filterHelper = new FilterKeywords()

// Generate unique filter names
String originalName = filterHelper.generateUniqueFilterName('EditTest')
String updatedName = filterHelper.generateUniqueFilterName('EditedFilter')

try {
    // Arrange: Login as admin and navigate to Filters page
    loginHelper.loginAsAdmin()
    filterHelper.navigateToFilters()
    filterHelper.waitForLoadingComplete()
    
    // Arrange: Create a test filter first
    filterHelper.createFilter(
        originalName,
        'features',
        'Original description',
        5,
        true
    )
    filterHelper.waitForLoadingComplete()
    
    // Assert: Verify filter was created
    filterHelper.verifyFilterExistsInTable(originalName)
    
    // Act: Click Edit button for the filter
    filterHelper.clickEditFilter(originalName)
    
    // Assert: Verify edit modal is displayed with correct title
    filterHelper.verifyFilterModalDisplayed()
    String actualTitle = WebUI.getText(findTestObject('Object Repository/Admin/FiltersPage/Modal/h2_ModalTitle'))
    assert actualTitle.contains('Edit Filter'), "Expected modal title 'Edit Filter', but got '${actualTitle}'"
    
    // Assert: Verify form is pre-filled with original data
    String actualName = WebUI.getAttribute(findTestObject('Object Repository/Admin/FiltersPage/Modal/input_Name'), 'value')
    assert actualName == originalName, "Expected name to be '${originalName}', but got '${actualName}'"
    
    // Act: Update filter data
    filterHelper.fillFilterForm(
        updatedName,
        'amenities',
        'Updated description by test',
        10,
        true
    )
    
    // Act: Click Save Changes
    filterHelper.clickSaveFilterButton()
    
    // Assert: Verify modal is closed
    filterHelper.verifyModalClosed()
    
    // Wait for table to refresh
    filterHelper.waitForLoadingComplete()
    
    // Assert: Verify success toast
    filterHelper.verifySuccessToast('updated')
    
    // Assert: Verify updated filter appears in table
    filterHelper.verifyFilterExistsInTable(updatedName)
    
    // Assert: Verify original name no longer exists
    filterHelper.verifyFilterNotInTable(originalName)
    
    WebUI.comment('✅ TC_ADM_FILTER_004 PASSED: Filter edited successfully')
    
} catch (Exception e) {
    WebUI.comment('❌ TC_ADM_FILTER_004 FAILED: ' + e.getMessage())
    throw e
    
} finally {
    // Cleanup
    WebUI.closeBrowser()
}
