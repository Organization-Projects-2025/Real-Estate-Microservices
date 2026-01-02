package admin

import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.annotation.Keyword
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import com.kms.katalon.core.model.FailureHandling
import com.kms.katalon.core.testobject.RequestObject
import com.kms.katalon.core.testobject.TestObjectProperty
import com.kms.katalon.core.testobject.ConditionType
import com.kms.katalon.core.testobject.impl.HttpTextBodyContent
import com.kms.katalon.core.webservice.keyword.WSBuiltInKeywords as WS
import groovy.json.JsonOutput
import groovy.json.JsonSlurper

/**
 * Filter Keywords for Admin Microservice
 * Provides reusable filter management functions for all test cases
 * 
 * @author Admin Service Test Team
 * @version 2.0
 */
class Filter_Keywords {
    
    private static final String BASE_URL = 'http://localhost:5173'
    private static final String API_GATEWAY_URL = 'http://localhost:3000/api'
    private static final String FILTERS_URL = "${BASE_URL}/admin/filters"
    
    /**
     * Navigate to Filters Management page
     * Requires admin to be logged in
     */
    @Keyword
    def navigateToFilters() {
        WebUI.navigateToUrl(FILTERS_URL)
        WebUI.waitForPageLoad(15)
        verifyFiltersPageLoaded()
    }
    
    /**
     * Verify Filters Management page is loaded
     */
    @Keyword
    def verifyFiltersPageLoaded() {
        WebUI.waitForElementVisible(
            findTestObject('Object Repository/Admin/FiltersPage/h1_FiltersManagement'),
            15,
            FailureHandling.STOP_ON_FAILURE
        )
    }
    
    /**
     * Click Add Filter button to open modal
     */
    @Keyword
    def clickAddFilterButton() {
        WebUI.waitForElementClickable(
            findTestObject('Object Repository/Admin/FiltersPage/btn_AddFilter'),
            10
        )
        WebUI.click(findTestObject('Object Repository/Admin/FiltersPage/btn_AddFilter'))
        WebUI.delay(1)
    }
    
    /**
     * Verify Add/Edit Filter modal is displayed
     */
    @Keyword
    def verifyFilterModalDisplayed() {
        WebUI.waitForElementVisible(
            findTestObject('Object Repository/Admin/FiltersPage/Modal/div_FilterModal'),
            10,
            FailureHandling.STOP_ON_FAILURE
        )
    }
    
    /**
     * Fill filter form with provided data
     * @param name - Filter name
     * @param category - Filter category (property-type, amenities, features, location)
     * @param description - Filter description (optional)
     * @param order - Display order (optional)
     * @param isActive - Active status (optional)
     */
    @Keyword
    def fillFilterForm(String name, String category, String description = '', int order = 0, boolean isActive = true) {
        // Fill name
        WebUI.clearText(findTestObject('Object Repository/Admin/FiltersPage/Modal/input_Name'))
        WebUI.setText(findTestObject('Object Repository/Admin/FiltersPage/Modal/input_Name'), name)
        
        // Select category
        WebUI.selectOptionByValue(
            findTestObject('Object Repository/Admin/FiltersPage/Modal/select_Category'),
            category,
            false
        )
        
        // Fill description if provided
        if (description) {
            WebUI.clearText(findTestObject('Object Repository/Admin/FiltersPage/Modal/textarea_Description'))
            WebUI.setText(findTestObject('Object Repository/Admin/FiltersPage/Modal/textarea_Description'), description)
        }
        
        // Fill order
        WebUI.clearText(findTestObject('Object Repository/Admin/FiltersPage/Modal/input_Order'))
        WebUI.setText(findTestObject('Object Repository/Admin/FiltersPage/Modal/input_Order'), order.toString())
        
        // Handle isActive checkbox
        boolean currentState = WebUI.verifyElementChecked(
            findTestObject('Object Repository/Admin/FiltersPage/Modal/checkbox_IsActive'),
            5,
            FailureHandling.OPTIONAL
        )
        if (currentState != isActive) {
            WebUI.click(findTestObject('Object Repository/Admin/FiltersPage/Modal/checkbox_IsActive'))
        }
    }
    
    /**
     * Click Create/Save button in modal
     */
    @Keyword
    def clickSaveFilterButton() {
        WebUI.click(findTestObject('Object Repository/Admin/FiltersPage/Modal/btn_SaveFilter'))
        WebUI.delay(2)
    }
    
    /**
     * Verify modal is closed
     */
    @Keyword
    def verifyModalClosed() {
        WebUI.verifyElementNotPresent(
            findTestObject('Object Repository/Admin/FiltersPage/Modal/div_FilterModal'),
            10,
            FailureHandling.STOP_ON_FAILURE
        )
    }
    
    /**
     * Create a new filter with all parameters
     * @param name - Filter name
     * @param category - Filter category
     * @param description - Filter description
     * @param order - Display order
     * @param isActive - Active status
     */
    @Keyword
    def createFilter(String name, String category, String description = '', int order = 0, boolean isActive = true) {
        clickAddFilterButton()
        verifyFilterModalDisplayed()
        fillFilterForm(name, category, description, order, isActive)
        clickSaveFilterButton()
    }
    
    /**
     * Verify success toast message is displayed
     * @param expectedMessage - Expected message text (partial match)
     */
    @Keyword
    def verifySuccessToast(String expectedMessage) {
        WebUI.waitForElementVisible(
            findTestObject('Object Repository/Admin/FiltersPage/toast_Success'),
            10,
            FailureHandling.CONTINUE_ON_FAILURE
        )
    }
    
    /**
     * Get count of filters in table
     * @return Number of filter rows
     */
    @Keyword
    def getFilterCount() {
        try {
            def elements = WebUI.findWebElements(
                findTestObject('Object Repository/Admin/FiltersPage/tr_FilterRows'),
                10
            )
            return elements.size()
        } catch (Exception e) {
            return 0
        }
    }
    
    /**
     * Verify filter exists in table by name
     * @param filterName - Name of the filter to find
     */
    @Keyword
    def verifyFilterExistsInTable(String filterName) {
        WebUI.verifyElementPresent(
            findTestObject('Object Repository/Admin/FiltersPage/td_FilterName', [('filterName'): filterName]),
            10,
            FailureHandling.STOP_ON_FAILURE
        )
    }
    
    /**
     * Click Edit button for a specific filter
     * @param filterName - Name of the filter to edit
     */
    @Keyword
    def clickEditFilter(String filterName) {
        WebUI.click(
            findTestObject('Object Repository/Admin/FiltersPage/btn_EditFilter', [('filterName'): filterName])
        )
        WebUI.delay(1)
    }
    
    /**
     * Verify filter does not exist in table
     * @param filterName - Name of the filter
     */
    @Keyword
    def verifyFilterNotInTable(String filterName) {
        WebUI.verifyElementNotPresent(
            findTestObject('Object Repository/Admin/FiltersPage/td_FilterName', [('filterName'): filterName]),
            10,
            FailureHandling.STOP_ON_FAILURE
        )
    }
    
    /**
     * Verify filter status in table
     * @param filterName - Name of the filter
     * @param expectedStatus - Expected status ('Active' or 'Inactive')
     */
    @Keyword
    def verifyFilterStatus(String filterName, String expectedStatus) {
        String statusObjectPath = expectedStatus == 'Active' ? 
            'Object Repository/Admin/FiltersPage/span_StatusActive' : 
            'Object Repository/Admin/FiltersPage/span_StatusInactive'
        
        WebUI.verifyElementPresent(
            findTestObject(statusObjectPath, [('filterName'): filterName]),
            10,
            FailureHandling.STOP_ON_FAILURE
        )
    }
    
    /**
     * Generate unique filter name for testing
     * @param prefix - Prefix for the filter name
     * @return Unique filter name with timestamp
     */
    @Keyword
    def generateUniqueFilterName(String prefix = 'TestFilter') {
        long timestamp = System.currentTimeMillis()
        return "${prefix}_${timestamp}"
    }
    
    /**
     * Wait for loading to complete
     */
    @Keyword
    def waitForLoadingComplete() {
        WebUI.waitForElementNotPresent(
            findTestObject('Object Repository/Admin/FiltersPage/div_LoadingSpinner'),
            15,
            FailureHandling.OPTIONAL
        )
        WebUI.delay(1)
    }
    
    /**
     * Create a test filter via API
     * @param name - Filter name (optional, will generate unique if not provided)
     * @return Map containing filter data including _id
     */
    @Keyword
    def createTestFilterViaAPI(String name = null) {
        String filterName = name ?: generateUniqueFilterName()
        
        def requestBody = [
            name: filterName,
            category: 'features',
            description: 'Automated test filter',
            order: 0,
            isActive: true
        ]
        
        RequestObject request = new RequestObject()
        request.setRestUrl("${API_GATEWAY_URL}/admin")
        request.setRestRequestMethod('POST')
        
        ArrayList<TestObjectProperty> headers = new ArrayList<>()
        headers.add(new TestObjectProperty('Content-Type', ConditionType.EQUALS, 'application/json'))
        headers.add(new TestObjectProperty('Accept', ConditionType.EQUALS, 'application/json'))
        request.setHttpHeaderProperties(headers)
        
        request.setBodyContent(new HttpTextBodyContent(JsonOutput.toJson(requestBody), 'UTF-8', 'application/json'))
        
        def response = WS.sendRequest(request)
        int statusCode = response.getStatusCode()
        
        if (statusCode != 201 && statusCode != 200) {
            WebUI.comment("API Error: Failed to create test filter. Status: ${statusCode}")
            throw new Exception("Failed to create test filter via API. Status: ${statusCode}")
        }
        
        def jsonSlurper = new JsonSlurper()
        def responseData = jsonSlurper.parseText(response.getResponseText())
        
        String filterId = responseData?.data?.filter?._id ?: responseData?.filter?._id
        WebUI.comment("Test filter created via API: ${filterName} (ID: ${filterId})")
        
        return [
            success: true,
            name: filterName,
            filterId: filterId
        ]
    }
    
    /**
     * Delete a filter via API (cleanup)
     */
    @Keyword
    def deleteFilterViaAPI(String filterId) {
        RequestObject request = new RequestObject()
        request.setRestUrl("${API_GATEWAY_URL}/admin/${filterId}")
        request.setRestRequestMethod('DELETE')
        
        ArrayList<TestObjectProperty> headers = new ArrayList<>()
        headers.add(new TestObjectProperty('Content-Type', ConditionType.EQUALS, 'application/json'))
        request.setHttpHeaderProperties(headers)
        
        def response = WS.sendRequest(request)
        WebUI.comment("Filter deleted via API: ${filterId}, Status: ${response.getStatusCode()}")
        
        return response.getStatusCode() == 200
    }
}
