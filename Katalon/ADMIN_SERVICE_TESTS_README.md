# Admin Service (Filter Management) - Katalon Test Cases

## Overview

This document describes the automated test cases for the **Admin Service** microservice, which handles **Filter Management** functionality in the Real Estate Microservices application.

## Microservice Details

- **Service Name:** admin-service
- **Main Functionality:** Filter Management (CRUD operations for property filters)
- **Categories Supported:** property-type, amenities, features, location
- **Base URL:** `http://localhost:5173/admin/filters`

## Test Structure

### Folder Organization

```
Katalon/
├── Keywords/
│   └── admin/
│       └── Filter_Keywords.groovy          # Reusable filter management keywords
├── Object Repository/
│   └── Admin/
│       └── FiltersPage/
│           ├── h1_FiltersManagement.rs     # Page title
│           ├── btn_AddFilter.rs            # Add Filter button
│           ├── table_Filters.rs            # Filters table
│           ├── tr_FilterRows.rs            # Table rows
│           ├── td_FilterName.rs            # Filter name cell (parameterized)
│           ├── btn_EditFilter.rs           # Edit button (parameterized)
│           ├── btn_DeleteFilter.rs         # Delete button (parameterized)
│           ├── span_StatusActive.rs        # Active status badge
│           ├── span_StatusInactive.rs      # Inactive status badge
│           ├── div_EmptyState.rs           # Empty state message
│           ├── div_LoadingSpinner.rs       # Loading indicator
│           ├── toast_Success.rs            # Success notification
│           ├── toast_Error.rs              # Error notification
│           └── Modal/
│               ├── div_FilterModal.rs      # Modal container
│               ├── h2_ModalTitle.rs        # Modal title
│               ├── input_Name.rs           # Name input
│               ├── select_Category.rs      # Category dropdown
│               ├── textarea_Description.rs # Description textarea
│               ├── input_Order.rs          # Order input
│               ├── checkbox_IsActive.rs    # Active checkbox
│               ├── btn_SaveFilter.rs       # Save/Create button
│               ├── btn_Cancel.rs           # Cancel button
│               └── btn_CloseModal.rs       # X close button
├── Test Cases/
│   └── Admin/
│       └── FilterManagement/
│           ├── TC_ADM_FILTER_001_ViewFiltersPage
│           ├── TC_ADM_FILTER_002_CreateFilterValid
│           ├── TC_ADM_FILTER_003_CreateFilterEmptyName
│           ├── TC_ADM_FILTER_004_EditFilter
│           ├── TC_ADM_FILTER_005_DeleteFilter
│           ├── TC_ADM_FILTER_006_CancelDeleteFilter
│           ├── TC_ADM_FILTER_007_CreateFilterAllCategories
│           ├── TC_ADM_FILTER_008_CreateInactiveFilter
│           ├── TC_ADM_FILTER_009_ToggleFilterStatus
│           ├── TC_ADM_FILTER_010_CancelAddFilter
│           ├── TC_ADM_FILTER_011_CloseModalWithXButton
│           └── TC_ADM_FILTER_012_AdminAccessRequired
└── Test Suites/
    ├── TS_Admin_Filter_Smoke_Tests.ts      # Quick smoke tests (4 tests)
    └── TS_Admin_Filter_Full_Suite.ts       # Complete regression (12 tests)
```

## Test Cases Summary

| Test Case ID | Name | Priority | Type | Description |
|--------------|------|----------|------|-------------|
| TC_ADM_FILTER_001 | View Filters Page | High | Smoke | Verify Filters Management page loads correctly |
| TC_ADM_FILTER_002 | Create Filter Valid | High | Positive | Create filter with valid data |
| TC_ADM_FILTER_003 | Create Filter Empty Name | High | Negative | Verify validation for empty name |
| TC_ADM_FILTER_004 | Edit Filter | High | Positive | Edit existing filter |
| TC_ADM_FILTER_005 | Delete Filter | High | Positive | Delete filter with confirmation |
| TC_ADM_FILTER_006 | Cancel Delete Filter | Medium | Negative | Cancel deletion keeps filter |
| TC_ADM_FILTER_007 | Create All Categories | Medium | Positive | Create filters for all categories |
| TC_ADM_FILTER_008 | Create Inactive Filter | Medium | Positive | Create filter with inactive status |
| TC_ADM_FILTER_009 | Toggle Filter Status | Medium | Positive | Toggle Active/Inactive status |
| TC_ADM_FILTER_010 | Cancel Add Filter | Low | UI | Cancel button closes modal |
| TC_ADM_FILTER_011 | Close Modal X Button | Low | UI | X button closes modal |
| TC_ADM_FILTER_012 | Admin Access Required | High | Security | Verify admin-only access |

## Usage Pattern

All test cases follow the object instantiation pattern for calling keywords:

```groovy
import authentication.Login_Keywords as LoginKeywords
import admin.Filter_Keywords as FilterKeywords

// Initialize keyword helpers
LoginKeywords loginHelper = new LoginKeywords()
FilterKeywords filterHelper = new FilterKeywords()

// Use methods directly on the objects
loginHelper.loginAsAdmin()
filterHelper.navigateToFilters()
filterHelper.createFilter('FilterName', 'property-type', 'Description', 1, true)
```

## Keywords Reference

### Filter_Keywords.groovy

| Keyword | Parameters | Description |
|---------|------------|-------------|
| `navigateToFilters()` | - | Navigate to Filters Management page |
| `verifyFiltersPageLoaded()` | - | Verify page title is displayed (internal) |
| `clickAddFilterButton()` | - | Click Add Filter button |
| `verifyFilterModalDisplayed()` | - | Verify modal is visible |
| `fillFilterForm()` | name, category, description, order, isActive | Fill filter form fields |
| `clickSaveFilterButton()` | - | Click Create/Save button |
| `verifyModalClosed()` | - | Verify modal is not visible |
| `createFilter()` | name, category, description, order, isActive | Complete filter creation flow |
| `verifySuccessToast()` | expectedMessage | Verify success notification |
| `getFilterCount()` | - | Get number of filters in table |
| `verifyFilterExistsInTable()` | filterName | Verify filter is in table |
| `clickEditFilter()` | filterName | Click Edit for specific filter |
| `verifyFilterNotInTable()` | filterName | Verify filter is not in table |
| `verifyFilterStatus()` | filterName, expectedStatus | Verify Active/Inactive status |
| `generateUniqueFilterName()` | prefix | Generate unique name with timestamp |
| `waitForLoadingComplete()` | - | Wait for loading spinner to disappear |

## Running Tests

### Via Katalon Studio UI
1. Open Katalon Studio
2. Open the project from `Katalon/` folder
3. Navigate to Test Suites
4. Right-click on desired test suite
5. Select "Run" with preferred browser

### Via Command Line
```bash
# Run smoke tests
katalonc -noSplash -runMode=console -projectPath="path/to/Katalon" -testSuitePath="Test Suites/TS_Admin_Filter_Smoke_Tests" -browserType="Chrome"

# Run full regression
katalonc -noSplash -runMode=console -projectPath="path/to/Katalon" -testSuitePath="Test Suites/TS_Admin_Filter_Full_Suite" -browserType="Chrome" -reportFolder="Reports"
```

## Prerequisites

1. **Application Running:**
   - Client: `http://localhost:5173` (Vite dev server)
   - API Gateway: `http://localhost:3000`
   - Admin Service: Running on configured port

2. **Test Data:**
   - Admin user credentials: `admin@realestate.com` / `Password123!`
   - Regular user credentials: `user1@realestate.com` / `Password123!`

3. **Browser:**
   - Chrome (primary)
   - Firefox (secondary)

## Dependencies

This test module uses keywords from:
- `authentication.Login_Keywords` - For admin login functionality

## Notes

- All test cases are independent and can run in any order
- Each test case opens and closes its own browser session
- Unique filter names are generated using timestamps to avoid conflicts
- Tests clean up after themselves where possible

## Author

Admin Service Test Team

## Version

1.0 - Initial implementation
