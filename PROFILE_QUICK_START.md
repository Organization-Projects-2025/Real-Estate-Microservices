# Profile Tests - Quick Start Guide

## 🎯 Target Page
**URL:** http://localhost:5173/profile  
**Feature:** Personal Information Edit

---

## ⚡ Quick Run

### Option 1: Smoke Tests (Fast - 3 tests, ~2-3 min)
```
Test Suites/TS_Profile_Smoke
```
**Tests:**
- Update all fields
- Update first name
- Update phone number

### Option 2: Complete Tests (All - 8 tests, ~5-8 min)
```
Test Suites/TS_Profile_Complete
```
**Tests:**
- All 5 Edit tests
- All 3 Validation tests

---

## 📋 Test Cases Overview

### Edit Tests (5 Positive)
| # | Test Case | What It Tests |
|---|-----------|---------------|
| 1 | TC_PROF_001_UpdateAllFields | Updates all personal info fields |
| 2 | TC_PROF_002_UpdateFirstName | Updates only first name |
| 3 | TC_PROF_003_UpdateLastName | Updates only last name |
| 4 | TC_PROF_004_UpdatePhoneNumber | Updates phone with valid format |
| 5 | TC_PROF_005_CancelEdit | Cancels edit without saving |

### Validation Tests (3 Negative)
| # | Test Case | What It Tests |
|---|-----------|---------------|
| 1 | TC_PROF_VAL1_EmptyFirstName | Empty first name validation |
| 2 | TC_PROF_VAL2_EmptyLastName | Empty last name validation |
| 3 | TC_PROF_VAL3_InvalidPhoneNumber | Invalid phone format validation |

---

## 🔑 Keywords Available

### Quick Usage
```groovy
import profile.Profile_Keywords as ProfileKeywords

ProfileKeywords profileKW = new ProfileKeywords()

// Login and go to profile
profileKW.loginAndNavigateToProfile()

// Update fields
profileKW.fillFirstName('John')
profileKW.fillLastName('Doe')
profileKW.fillPhoneNumber('+971501234567')

// Save
profileKW.clickSaveChanges()

// Verify
profileKW.verifySuccessMessage()

WebUI.closeBrowser()
```

### One-Line Update
```groovy
profileKW.updatePersonalInfo('John', 'Doe', '+971501234567', '+971509876543', 'john@example.com')
```

---

## 📁 File Locations

**Test Cases:**
- `Test Cases/Profile/Edit/` - Positive tests
- `Test Cases/Profile/Validation/` - Negative tests

**Keywords:**
- `Keywords/profile/Profile_Keywords.groovy`

**Objects:**
- `Object Repository/Profile/` - All form elements

**Test Suites:**
- `Test Suites/TS_Profile_Smoke.ts`
- `Test Suites/TS_Profile_Complete.ts`

---

## 🛠️ Troubleshooting

### Element Not Found
Update XPath in: `Object Repository/Profile/*.rs`

### Test Fails
1. Verify app is running: http://localhost:5173
2. Check admin credentials are correct
3. Verify profile page loads properly

### Need to Add More Tests
Use existing keywords from `Profile_Keywords.groovy`

---

## ✅ What's Covered

**Fields:**
- ✅ First Name
- ✅ Last Name
- ✅ Email (read-only)
- ✅ Phone Number
- ✅ WhatsApp
- ✅ Contact Email

**Actions:**
- ✅ Update all fields
- ✅ Update individual fields
- ✅ Save changes
- ✅ Cancel changes
- ✅ Field validation

---

## 🎉 Ready to Test!

1. **Refresh Katalon Studio** (F5)
2. **Run:** `Test Suites/TS_Profile_Smoke`
3. **Watch:** Tests execute automatically

For full details, see: `PROFILE_TESTS_SUMMARY.md`
