# Profile Personal Information Edit Tests - Implementation Summary

## ✅ What Was Created

### Test Case Folders
- `Katalon/Test Cases/Profile/Edit/` - Positive test cases for editing profile
- `Katalon/Test Cases/Profile/Validation/` - Negative validation test cases

### Test Cases (8 Total)

#### Edit Tests (5 Positive Tests)
Located in: `Katalon/Test Cases/Profile/Edit/`

1. **TC_PROF_001_UpdateAllFields** - Update all personal information fields
2. **TC_PROF_002_UpdateFirstName** - Update only first name
3. **TC_PROF_003_UpdateLastName** - Update only last name
4. **TC_PROF_004_UpdatePhoneNumber** - Update phone number with valid format
5. **TC_PROF_005_CancelEdit** - Cancel editing without saving changes

#### Validation Tests (3 Negative Tests)
Located in: `Katalon/Test Cases/Profile/Validation/`

1. **TC_PROF_VAL1_EmptyFirstName** - Attempt to save with empty first name
2. **TC_PROF_VAL2_EmptyLastName** - Attempt to save with empty last name
3. **TC_PROF_VAL3_InvalidPhoneNumber** - Attempt to save with invalid phone format

---

## 📦 Keywords Created

### Profile_Keywords.groovy
File: `Katalon/Keywords/profile/Profile_Keywords.groovy`

**Navigation Functions:**
- `navigateToProfile()` - Navigate to profile page
- `loginAndNavigateToProfile()` - Login as admin and go to profile

**Form Fill Functions:**
- `fillFirstName(String firstName)` - Fill first name field
- `fillLastName(String lastName)` - Fill last name field
- `fillEmail(String email)` - Fill email field (read-only)
- `fillPhoneNumber(String phoneNumber)` - Fill phone number
- `fillWhatsApp(String whatsapp)` - Fill WhatsApp field
- `fillContactEmail(String contactEmail)` - Fill contact email
- `fillAllPersonalInfo(...)` - Fill all fields at once

**Action Functions:**
- `clickSaveChanges()` - Click Save Changes button
- `clickCancel()` - Click Cancel button
- `clearAllFields()` - Clear all form fields

**Verification Functions:**
- `verifySuccessMessage()` - Verify success message appears
- `verifyErrorMessage()` - Verify error message appears
- `getFirstNameValue()` - Get current first name value
- `getLastNameValue()` - Get current last name value
- `getEmailValue()` - Get current email value
- `getPhoneNumberValue()` - Get current phone number value

**Complete Flow Functions:**
- `updatePersonalInfo(...)` - Complete update flow
- `updateName(firstName, lastName)` - Update only name
- `updatePhoneNumber(phoneNumber)` - Update only phone
- `saveWithEmptyFirstName()` - Validation test helper
- `saveWithEmptyLastName()` - Validation test helper
- `saveWithInvalidPhone(invalidPhone)` - Validation test helper

---

## 🗂️ Object Repository (10 Objects)

Located in: `Katalon/Object Repository/Profile/`

1. **firstNameInput.rs** - First Name input field
2. **lastNameInput.rs** - Last Name input field
3. **emailInput.rs** - Email input field (read-only)
4. **phoneNumberInput.rs** - Phone Number input field
5. **whatsappInput.rs** - WhatsApp input field
6. **contactEmailInput.rs** - Contact Email input field
7. **saveChangesButton.rs** - Save Changes button
8. **cancelButton.rs** - Cancel button
9. **successMessage.rs** - Success message element
10. **errorMessage.rs** - Error message element

---

## 📋 Test Suites (2 Suites)

### 1. TS_Profile_Smoke (3 Critical Tests)
File: `Katalon/Test Suites/TS_Profile_Smoke.ts`

**Includes:**
- TC_PROF_001_UpdateAllFields
- TC_PROF_002_UpdateFirstName
- TC_PROF_004_UpdatePhoneNumber

**Purpose:** Quick validation of core profile edit functionality (~2-3 minutes)

### 2. TS_Profile_Complete (8 All Tests)
File: `Katalon/Test Suites/TS_Profile_Complete.ts`

**Includes:**
- All 5 Edit tests
- All 3 Validation tests

**Purpose:** Complete regression testing of profile functionality (~5-8 minutes)

---

## 📊 Test Coverage Summary

| Category | Test Count | Description |
|----------|------------|-------------|
| **Edit Tests** | 5 | Positive scenarios for updating profile |
| **Validation Tests** | 3 | Negative scenarios for field validation |
| **Total Tests** | 8 | Complete profile edit coverage |

### Test Coverage Details

**Fields Covered:**
- ✅ First Name (edit + validation)
- ✅ Last Name (edit + validation)
- ✅ Email (read-only, no edit)
- ✅ Phone Number (edit + validation)
- ✅ WhatsApp (edit)
- ✅ Contact Email (edit)

**Actions Covered:**
- ✅ Update all fields
- ✅ Update individual fields
- ✅ Save changes
- ✅ Cancel changes
- ✅ Empty field validation
- ✅ Invalid format validation

---

## 🎯 Folder Structure

```
Katalon/
├── Test Cases/Profile/                    ← NEW
│   ├── Edit/
│   │   ├── TC_PROF_001_UpdateAllFields.tc
│   │   ├── TC_PROF_002_UpdateFirstName.tc
│   │   ├── TC_PROF_003_UpdateLastName.tc
│   │   ├── TC_PROF_004_UpdatePhoneNumber.tc
│   │   └── TC_PROF_005_CancelEdit.tc
│   └── Validation/
│       ├── TC_PROF_VAL1_EmptyFirstName.tc
│       ├── TC_PROF_VAL2_EmptyLastName.tc
│       └── TC_PROF_VAL3_InvalidPhoneNumber.tc
│
├── Scripts/Profile/                       ← NEW
│   ├── Edit/
│   │   ├── TC_PROF_001_UpdateAllFields/Script.groovy
│   │   ├── TC_PROF_002_UpdateFirstName/Script.groovy
│   │   ├── TC_PROF_003_UpdateLastName/Script.groovy
│   │   ├── TC_PROF_004_UpdatePhoneNumber/Script.groovy
│   │   └── TC_PROF_005_CancelEdit/Script.groovy
│   └── Validation/
│       ├── TC_PROF_VAL1_EmptyFirstName/Script.groovy
│       ├── TC_PROF_VAL2_EmptyLastName/Script.groovy
│       └── TC_PROF_VAL3_InvalidPhoneNumber/Script.groovy
│
├── Keywords/profile/                      ← NEW
│   └── Profile_Keywords.groovy
│
├── Object Repository/Profile/             ← NEW
│   ├── firstNameInput.rs
│   ├── lastNameInput.rs
│   ├── emailInput.rs
│   ├── phoneNumberInput.rs
│   ├── whatsappInput.rs
│   ├── contactEmailInput.rs
│   ├── saveChangesButton.rs
│   ├── cancelButton.rs
│   ├── successMessage.rs
│   └── errorMessage.rs
│
└── Test Suites/
    ├── TS_Profile_Smoke.ts                ← NEW
    └── TS_Profile_Complete.ts             ← NEW
```

---

## 🚀 How to Run

### Run Smoke Test Suite (3 Critical Tests)
1. Open Katalon Studio
2. Navigate to: `Test Suites/TS_Profile_Smoke`
3. Click **Run** button ▶️
4. Tests execute sequentially (~2-3 minutes)

### Run Complete Test Suite (All 8 Tests)
1. Open Katalon Studio
2. Navigate to: `Test Suites/TS_Profile_Complete`
3. Click **Run** button ▶️
4. All tests execute sequentially (~5-8 minutes)

### Run Individual Test
1. Navigate to: `Test Cases/Profile/Edit/` or `Test Cases/Profile/Validation/`
2. Select any test case
3. Click **Run** button ▶️

---

## 💡 Usage Examples

### Example 1: Update All Fields
```groovy
import profile.Profile_Keywords as ProfileKeywords

ProfileKeywords profileKW = new ProfileKeywords()

// Update all personal information
profileKW.updatePersonalInfo(
    'John',
    'Doe',
    '+971501234567',
    '+971509876543',
    'john.doe@example.com'
)
```

### Example 2: Update Only Name
```groovy
import profile.Profile_Keywords as ProfileKeywords

ProfileKeywords profileKW = new ProfileKeywords()

// Login and navigate
profileKW.loginAndNavigateToProfile()

// Update name
profileKW.updateName('NewFirst', 'NewLast')

WebUI.closeBrowser()
```

### Example 3: Test Validation
```groovy
import profile.Profile_Keywords as ProfileKeywords

ProfileKeywords profileKW = new ProfileKeywords()

// Test empty first name validation
profileKW.saveWithEmptyFirstName()

// Verify error appears
profileKW.verifyErrorMessage()

WebUI.closeBrowser()
```

---

## 🔧 Customization Notes

### Update XPath Selectors
If your UI structure is different, update the Object Repository files:
- `Katalon/Object Repository/Profile/*.rs`

### Adjust Test Data
Modify the test data in Script files:
- Phone numbers: `+971501234567`
- Names: `UpdatedFirstName`, `UpdatedLastName`
- Emails: `contact@example.com`

### Add More Validation Tests
Use existing keywords to create additional validation tests:
```groovy
// Example: Test invalid email format
profileKW.loginAndNavigateToProfile()
profileKW.fillContactEmail('invalid-email')
profileKW.clickSaveChanges()
profileKW.verifyErrorMessage()
```

---

## ✅ Key Features

1. **Keyword-Driven** - All tests use reusable Profile_Keywords
2. **Object Repository** - Centralized element management
3. **Two Test Suites** - Smoke (quick) and Complete (comprehensive)
4. **Positive & Negative** - Tests both valid and invalid scenarios
5. **Professional Structure** - Follows team conventions
6. **Easy to Maintain** - Update keywords once, affects all tests
7. **Consistent Pattern** - Matches Authentication and Review tests

---

## 📝 Test Execution Order

### Smoke Suite (Recommended Order)
1. TC_PROF_001_UpdateAllFields - Verify all fields work
2. TC_PROF_002_UpdateFirstName - Test individual field update
3. TC_PROF_004_UpdatePhoneNumber - Test phone validation

### Complete Suite (Recommended Order)
1. All Edit tests (TC_PROF_001 through TC_PROF_005)
2. All Validation tests (TC_PROF_VAL1 through TC_PROF_VAL3)

---

## 🎉 Summary

**Profile Test Suite Created:**
- ✅ 8 test cases (5 positive + 3 negative)
- ✅ 2 test suites (Smoke + Complete)
- ✅ 1 keyword library with 25+ functions
- ✅ 10 object repository elements
- ✅ Complete coverage of Personal Information edit functionality

**Target Page:** http://localhost:5173/profile

All tests follow the keyword-driven approach and are ready to execute in Katalon Studio!
