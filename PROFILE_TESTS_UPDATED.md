# Profile Tests - UPDATED for Test Independence

## ✅ Key Changes Made

### 1. Dedicated Test User (NOT Admin)
**User Account:** `user1@realestate.com`  
**Password:** `Password123!`  
**Original Values:**
- First Name: `User`
- Last Name: `One`
- Phone: `+971501111111`

### 2. Email & Password Protection
- ✅ Email field is **NEVER** modified (read-only)
- ✅ Password is **NEVER** changed
- ✅ Login credentials remain valid for all tests

### 3. Test Independence
- ✅ Each test restores original values after execution
- ✅ Tests can run in any order
- ✅ Tests can be run multiple times without conflicts
- ✅ No test depends on another test's data

---

## 🔄 How Test Independence Works

### Before Each Test
1. Login as `user1@realestate.com`
2. Navigate to profile page
3. Perform test actions

### After Each Test
1. Restore original values:
   - First Name → `User`
   - Last Name → `One`
   - Phone → `+971501111111`
   - Clear WhatsApp and Contact Email
2. Save restored values
3. Close browser

### Result
✅ Profile data is reset to original state  
✅ Next test starts with clean data  
✅ No interference between tests

---

## 📋 Updated Test Cases

### Edit Tests (5 Tests)

| Test | What It Does | Restores Data |
|------|--------------|---------------|
| TC_PROF_001_UpdateAllFields | Updates all fields, then restores | ✅ Yes |
| TC_PROF_002_UpdateFirstName | Updates first name, then restores | ✅ Yes |
| TC_PROF_003_UpdateLastName | Updates last name, then restores | ✅ Yes |
| TC_PROF_004_UpdatePhoneNumber | Updates phone, then restores | ✅ Yes |
| TC_PROF_005_CancelEdit | Tests cancel (no save, no restore needed) | ✅ N/A |

### Validation Tests (3 Tests)

| Test | What It Does | Restores Data |
|------|--------------|---------------|
| TC_PROF_VAL1_EmptyFirstName | Tests empty first name validation, then restores | ✅ Yes |
| TC_PROF_VAL2_EmptyLastName | Tests empty last name validation, then restores | ✅ Yes |
| TC_PROF_VAL3_InvalidPhoneNumber | Tests invalid phone validation, then restores | ✅ Yes |

---

## 🔑 Updated Keywords

### Login Function
```groovy
loginAsTestUser()
// Logs in as user1@realestate.com (NOT admin)
```

### Restore Function
```groovy
restoreOriginalProfile()
// Resets all fields to original values
// Called automatically after each test
```

### Protected Functions
```groovy
fillEmail(String email)
// DEPRECATED - Do not use
// Email should never be changed
```

---

## 💡 Usage Examples

### Example 1: Independent Test
```groovy
// Test updates first name
profileKW.loginAndNavigateToProfile()
profileKW.fillFirstName('NewName')
profileKW.clickSaveChanges()

// Automatically restore original values
profileKW.restoreOriginalProfile()

// Next test will find original data
```

### Example 2: Complete Flow
```groovy
// updatePersonalInfo handles everything
profileKW.updatePersonalInfo(
    'John',
    'Doe',
    '+971501234567',
    '+971509876543',
    'john@example.com'
)
// Automatically logs in, updates, saves, and restores
```

---

## ⚠️ Important Rules

### DO ✅
- ✅ Use `user1@realestate.com` for all profile tests
- ✅ Always restore original values after test
- ✅ Test can modify: firstName, lastName, phoneNumber, whatsapp, contactEmail
- ✅ Run tests in any order
- ✅ Run tests multiple times

### DON'T ❌
- ❌ Never use admin account for profile tests
- ❌ Never modify email field
- ❌ Never modify password
- ❌ Never skip restore step
- ❌ Never assume data from previous test

---

## 🚀 Running Tests

### Run All Tests (Independent)
```
Test Suites/TS_Profile_Complete
```
All 8 tests run independently with automatic data restoration.

### Run Smoke Tests
```
Test Suites/TS_Profile_Smoke
```
3 critical tests with automatic data restoration.

### Run Individual Test
Any test can be run individually - data is always restored.

---

## 🔍 Verification

### Check Test Independence
1. Run TC_PROF_001_UpdateAllFields
2. Verify profile shows original values (User, One, +971501111111)
3. Run TC_PROF_002_UpdateFirstName
4. Verify profile still shows original values
5. ✅ Tests are independent!

### Check Login Still Works
1. Run any profile test
2. Test completes successfully
3. Run another profile test
4. Login still works (credentials unchanged)
5. ✅ Login credentials protected!

---

## 📊 Test Flow Diagram

```
Test Start
    ↓
Login as user1@realestate.com
    ↓
Navigate to Profile
    ↓
Perform Test Actions
    ↓
Save Changes (if applicable)
    ↓
Restore Original Values
    ├── First Name → User
    ├── Last Name → One
    ├── Phone → +971501111111
    ├── Clear WhatsApp
    └── Clear Contact Email
    ↓
Save Restored Values
    ↓
Close Browser
    ↓
Test End (Ready for next test)
```

---

## ✅ Benefits

1. **True Independence** - Tests don't affect each other
2. **Repeatable** - Run tests multiple times safely
3. **Parallel Ready** - Tests can run in parallel (future)
4. **No Cleanup Needed** - Each test cleans up after itself
5. **Login Protected** - Email/password never change
6. **Predictable** - Always starts with known data state

---

## 🎉 Summary

**All Profile tests now:**
- ✅ Use dedicated non-admin user (`user1@realestate.com`)
- ✅ Never modify email or password
- ✅ Restore original data after each test
- ✅ Run independently in any order
- ✅ Can be executed multiple times safely

**Test Account Protected:**
- Email: `user1@realestate.com` (never changes)
- Password: `Password123!` (never changes)
- Profile data: Automatically restored after each test

Ready to run! 🚀
