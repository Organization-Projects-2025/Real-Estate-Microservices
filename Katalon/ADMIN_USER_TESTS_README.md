# Admin Service - User Management Test Cases

## Overview
This document describes the automated test cases for the **User Management** module of the Admin Service microservice. These tests verify that administrators can manage users, including editing user details, changing roles, and activating/deactivating user accounts.

## Test Structure

### Keywords File
- **Location**: `Katalon/Keywords/admin/User_Keywords.groovy`
- **Purpose**: Provides reusable functions for user management operations
- **Functions**: 16 optimized functions (following <3 usage rule)

### Object Repository
- **Main Page Objects**: `Katalon/Object Repository/Admin/UsersPage/` (13 files)
- **Modal Objects**: `Katalon/Object Repository/Admin/UsersPage/Modal/` (12 files)
- **Total**: 25 object repository files

### Test Cases
**Location**: `Katalon/Test Cases/Admin/UserManagement/`

| Test Case ID | Name | Priority | Type | Description |
|--------------|------|----------|------|-------------|
| TC_ADM_USER_001 | ViewUsersPage | High | Positive | Verify admin can access Users Management page |
| TC_ADM_USER_002 | EditUserValid | High | Positive | Verify admin can edit user with valid data |
| TC_ADM_USER_003 | EditUserEmptyName | Medium | Negative | Verify validation prevents empty first name |
| TC_ADM_USER_004 | ChangeUserRole | High | Positive | Verify admin can change user role |
| TC_ADM_USER_005 | DeactivateUser | High | Positive | Verify admin can deactivate user with confirmation |
| TC_ADM_USER_006 | CancelDeactivateUser | Medium | Negative | Verify canceling deactivation keeps user active |
| TC_ADM_USER_007 | ReactivateUser | High | Positive | Verify admin can reactivate inactive user |
| TC_ADM_USER_008 | SwitchBetweenTabs | Medium | UI | Verify switching between Active/Inactive tabs |
| TC_ADM_USER_009 | CancelEditUser | Medium | Negative | Verify canceling edit doesn't save changes |
| TC_ADM_USER_010 | CloseModalWithXButton | Low | UI | Verify X button closes modal without saving |
| TC_ADM_USER_011 | AdminAccessRequired | High | Security | Verify only admins can access Users page |

**Total**: 11 independent test cases

### Test Suites

#### 1. Smoke Test Suite
- **File**: `Katalon/Test Suites/TS_Admin_User_Smoke_Tests.ts`
- **Purpose**: Quick validation of critical user management functionality
- **Test Cases**: 6 (TC_001, TC_002, TC_004, TC_005, TC_007, TC_011)
- **Execution Time**: ~5-7 minutes

#### 2. Full Regression Suite
- **File**: `Katalon/Test Suites/TS_Admin_User_Full_Suite.ts`
- **Purpose**: Complete validation of all user management features
- **Test Cases**: All 11 test cases
- **Execution Time**: ~10-15 minutes

## Test Coverage

### Functional Coverage
- ✅ View Users Management page
- ✅ Edit user details (name, email, contact info)
- ✅ Change user roles (user, agent, admin)
- ✅ Deactivate active users
- ✅ Reactivate inactive users
- ✅ Cancel deactivation
- ✅ Tab switching (Active/Inactive)
- ✅ Form validation
- ✅ Modal operations (cancel, close)
- ✅ Access control (admin-only)

### UI Elements Tested
- User Management page title
- Active/Inactive tabs
- Users table with user data
- Edit User modal
- Form fields (firstName, lastName, email, role, phoneNumber, whatsapp, contactEmail)
- Action buttons (Edit, Deactivate, Reactivate)
- Modal buttons (Save Changes, Cancel, X)
- Toast notifications
- Loading spinner
- Empty state

## Test Data Setup - API-Based Approach (Industry Best Practice)

Test cases that manipulate users now use **API calls for test data setup** instead of UI-based registration. This follows the industry standard "API for Setup, UI for Testing" pattern.

### Why API-Based Setup?
| Aspect | UI Setup | API Setup (Current) |
|--------|----------|---------------------|
| **Speed** | 5-10 seconds | 100-200ms |
| **Reliability** | Flaky (UI timing issues) | Stable (API contracts) |
| **Test Focus** | Tests registration + admin | Tests only admin features |
| **Maintenance** | Breaks if UI changes | Only breaks if API changes |

### API Endpoint Used
- **URL**: `POST http://localhost:3000/api/auth/register`
- **Gateway**: API Gateway on port 3000
- **Prefix**: `/api`

### Test Flow
```
┌─────────────────────────────────────────────────────────┐
│  TEST SETUP (API Layer - Fast & Reliable)               │
│  • POST /api/auth/register → Create test user           │
│  • ~100-200ms execution time                            │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│  ACTUAL TEST (UI Layer - What We're Testing)            │
│  • Login as admin                                       │
│  • Navigate to Users page                               │
│  • Edit/Deactivate the test user                        │
│  • Verify UI behavior                                   │
└─────────────────────────────────────────────────────────┘
```

## Execution Instructions

### Run Smoke Tests
```bash
# From Katalon Studio
1. Open Test Suite: TS_Admin_User_Smoke_Tests
2. Click "Run" button
3. Review results in Reports folder
```

### Run Full Regression
```bash
# From Katalon Studio
1. Open Test Suite: TS_Admin_User_Full_Suite
2. Click "Run" button
3. Review results in Reports folder
```

### Run Individual Test Case
```bash
# From Katalon Studio
1. Navigate to Test Cases/Admin/UserManagement/
2. Open desired test case
3. Click "Run" button
```

## Keywords Optimization

Following the **<3 usage rule**, the Keywords file contains only functions used 3 or more times across all test cases. Functions used less than 3 times are implemented directly in test case scripts using Katalon WebUI steps.

### Keyword Functions (17 total)
1. `navigateToUsers()` - Navigate to Users Management page
2. `verifyUsersPageLoaded()` - Verify page loaded successfully
3. `clickEditUser(userEmail)` - Click Edit button for specific user
4. `verifyUserModalDisplayed()` - Verify Edit User modal is displayed
5. `fillUserForm(...)` - Fill user form with data
6. `clickSaveUserButton()` - Click Save Changes button
7. `verifyModalClosed()` - Verify modal is closed
8. `updateUser(...)` - Complete user update workflow
9. `verifySuccessToast(message)` - Verify success toast message
10. `getUserCount()` - Get count of users in table
11. `verifyUserExistsInTable(userEmail)` - Verify user exists in table
12. `verifyUserRole(userEmail, role)` - Verify user role badge
13. `clickActiveTab()` - Click Active tab
14. `clickInactiveTab()` - Click Inactive tab
15. `waitForLoadingComplete()` - Wait for loading spinner to disappear
16. `verifyUserNotInTable(userEmail)` - Verify user does not exist in table
17. `generateUniqueEmail(prefix)` - Generate unique email for test user
18. `createTestUserViaAPI(...)` - **Create test user via API Gateway** (fast setup)

### Direct WebUI Steps in Test Cases
Functions used <3 times are implemented directly in test scripts:
- Get modal title text
- Click Cancel button
- Click Close (X) button
- Click Deactivate/Reactivate buttons
- Handle confirmation alerts
- Select role dropdown
- Clear and set form fields

## Test Case Pattern

All test cases that manipulate users follow this pattern:

```groovy
import authentication.Login_Keywords as LoginKeywords
import admin.User_Keywords as UserKeywords

// Initialize with object instantiation
LoginKeywords loginHelper = new LoginKeywords()
UserKeywords userHelper = new UserKeywords()

// Generate unique test user
String testUserEmail = userHelper.generateUniqueEmail('testprefix')
String testPassword = 'Password123!'

try {
    // Step 1: Create test user via API (fast, ~100ms)
    userHelper.createTestUserViaAPI('FirstName', 'LastName', testUserEmail, testPassword, 'user')
    
    // Step 2: Login as admin via UI
    loginHelper.loginAsAdmin()
    
    // Step 3: Navigate to Users page
    userHelper.navigateToUsers()
    
    // Step 4: Perform actual test actions (UI testing)
    userHelper.clickEditUser(testUserEmail)
    
    // Step 5: Assert expected results
    userHelper.verifySuccessToast('updated')
    
} catch (Exception e) {
    WebUI.comment('❌ TEST FAILED: ' + e.getMessage())
    throw e
} finally {
    // Cleanup
    WebUI.closeBrowser()
}
```

This pattern ensures:
- **Fast Setup**: API call takes ~100-200ms vs 5-10 seconds for UI
- **Test Independence**: Each test creates its own test data
- **Focused Testing**: Tests only the admin functionality, not registration
- **Reliability**: API calls are more stable than UI interactions
- **Unique Emails**: Random 5-digit suffix prevents conflicts

## Manual View Support

All test cases include Manual view steps for visual test case representation in Katalon Studio. Direct WebUI steps are defined in both:
- **Script files** (.groovy) - Actual executable code
- **Test Case files** (.tc) - Visual Manual view representation

## Maintenance Notes

### Adding New Test Cases
1. Create test case in `Test Cases/Admin/UserManagement/`
2. Create corresponding script in `Scripts/Admin/UserManagement/`
3. Use existing Keywords where possible
4. Add direct WebUI steps for unique operations
5. Update test suites if needed
6. Follow object instantiation pattern

### Updating Keywords
1. Only add functions used ≥3 times
2. Update `User_Keywords.groovy`
3. Update affected test cases
4. Maintain consistent naming conventions

### Object Repository Updates
1. Update `.rs` files if UI changes
2. Test XPath/CSS selectors in browser
3. Update parameterized objects carefully
4. Maintain consistent naming: `elementType_ElementName`

## Known Issues / Limitations
- Tests create new users which remain in the database after test execution
- Consider implementing cleanup mechanism for test users
- Alert handling may vary by browser
- Registration requires valid password format (8+ chars, uppercase, lowercase, number, special char)

## Success Criteria
- All test cases pass independently
- No false positives/negatives
- Execution time within acceptable limits
- Clear pass/fail reporting
- Proper cleanup after each test

## Contact
For questions or issues with these tests, contact the Admin Service Test Team.

---
**Last Updated**: January 2, 2026
**Version**: 1.0
**Author**: Admin Service Test Team
