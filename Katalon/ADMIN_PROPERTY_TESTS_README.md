# Admin Property Management Test Suite

## Overview
Automated test cases for the Admin Property Management module. These tests verify CRUD operations, validation, and security for property management functionality.

## Test Cases

| ID | Name | Priority | Description |
|----|------|----------|-------------|
| TC_ADM_PROP_001 | ViewPropertiesPage | High | Verify admin can access and view Properties Management page |
| TC_ADM_PROP_002 | EditPropertyValid | High | Verify admin can edit property with valid data |
| TC_ADM_PROP_003 | EditPropertyEmptyTitle | Medium | Verify validation prevents empty title submission |
| TC_ADM_PROP_004 | ChangePropertyStatus | High | Verify admin can change property status (active/sold) |
| TC_ADM_PROP_005 | DeleteProperty | High | Verify admin can delete a property (destructive) |
| TC_ADM_PROP_006 | CancelDeleteProperty | Medium | Verify cancel delete keeps property intact |
| TC_ADM_PROP_007 | CancelEditProperty | Medium | Verify cancel edit discards changes |
| TC_ADM_PROP_008 | CloseModalWithXButton | Low | Verify X button closes edit modal |
| TC_ADM_PROP_009 | AdminAccessRequired | Critical | Verify non-admin users cannot access page |

## Test Suites

- **TS_Admin_Property_Smoke_Tests**: Quick validation (TC 001, 002, 009)
- **TS_Admin_Property_Full_Suite**: Complete regression (all 9 test cases)

## Keywords (Optimized)

Functions used 3+ times are in `Property_Keywords.groovy`:
- `navigateToProperties()` - Navigate to Properties page
- `verifyPropertiesPageLoaded()` - Verify page loaded
- `verifyPropertyModalDisplayed()` - Verify edit modal visible
- `clickSavePropertyButton()` - Click Save Changes
- `verifyModalClosed()` - Verify modal closed
- `verifySuccessToast()` - Verify success message
- `getPropertyCount()` - Get property row count
- `waitForLoadingComplete()` - Wait for loading spinner
- `createTestPropertyViaAPI()` - Create test property via API
- `deletePropertyViaAPI()` - Delete property via API (cleanup)
- `generateUniquePropertyTitle()` - Generate unique title

## Test Data Approach

Property Management tests use API-based test data setup:
1. Test cases that modify/delete properties (TC 002-008) create a test property via API first
2. `createTestPropertyViaAPI()` creates a complete property with all required fields
3. `deletePropertyViaAPI()` cleans up test data in the finally block
4. TC_ADM_PROP_001 (View) and TC_ADM_PROP_009 (Access) don't need test properties
5. TC_ADM_PROP_009 creates test user via API for access control testing

API Endpoint: `POST http://localhost:3000/api/properties`

## Prerequisites

1. Application running on `http://localhost:5173`
2. API Gateway running on `http://localhost:3000`
3. Admin account: `admin@realestate.com` / `admin123`
4. At least one property in the database

## Execution Order

Tests can run in any order since each test creates and cleans up its own test data via API.
