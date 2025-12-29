# Real Estate Automation Testing - Team Guide

## 📋 Quick Start Checklist

- [ ] Install Katalon Studio (v9.0+)
- [ ] Open the Katalon project: `Real-Estate-Automation.prj`
- [ ] Join Discord channel for keyword sharing
- [ ] Read this entire guide before writing tests
- [ ] Watch the custom keywords tutorial video

---

## 🎯 Project Structure Overview

```
Real-Estate-Automation/
├── Object Repository/        ← Store all page elements (buttons, inputs, etc.) (We will currently use Selenium, for more info ask Obama)
├── Test Cases/              ← Your test scripts go here
├── Test Suites/             ← Collections of tests to run together
├── Keywords/                ← Reusable functions (TEAM SHARED)
├── Test Data/               ← Excel files with test data (At first there will be no excel sheet for the test data and they will be written hardcoded in the test cases, later on if there is time we will move all data here)
└── Reports/                 ← Auto-generated test results
```

---

## 📁 Test Cases Folder Structure (FOLLOW THIS! --> Each "Service" will have its folder and inside it there will be more folders organized appropriately, positive and negative cases will be in the same folders)

```
Test Cases/
├── Authentication/
│   ├── Login/
│   │   ├── TC_A001_AdminLogin.groovy          (positive test)
│   │   ├── TC_A002_DeveloperLogin.groovy      (positive test)
│   │   ├── TC_A005_InvalidPassword.groovy     (negative test)
│   │   └── TC_A006_InvalidEmail.groovy        (negative test)
│   ├── Register/
│   │   ├── TC_A007_RegisterValidData.groovy   (positive test)
│   │   └── TC_A008_RegisterErrors.groovy      (negative test - all validations grouped)
│   └── ForgotPassword/
│       └── TC_A009_ForgotPasswordFlow.groovy
│
├── Properties/
│   ├── Browsing/
│   │   ├── TC_C001_ViewAllProperties.groovy
│   │   └── TC_C005_ViewPropertyDetails.groovy
│   ├── Search/
│   │   └── TC_C002_SearchByLocation.groovy
│   └── Filtering/
│       ├── TC_C003_FilterByPrice.groovy
│       └── TC_C004_FilterByType.groovy
│
├── Developer/
│   ├── Dashboard/
│   ├── Projects/
│   └── Properties/
│
├── Admin/
│   ├── Dashboard/
│   ├── UserManagement/
│   └── Reviews/
│
└── Reviews/
    ├── TC_F001_WriteReview.groovy
    └── TC_F002_RateProperty.groovy
```

### ✅ DO's for Test Case Organization:

- ✅ Use feature-based folders (Login, Register, Search, etc.)
- ✅ Name files with TC_ID format: `TC_A001_AdminLogin.groovy` (TC_A001 --> Means TestCase_Authentication001_AdminLogin.groovy, follow this format)
- ✅ Keep positive and negative tests in same folder
- ✅ Group related functionality together

### ❌ DON'Ts:

- ❌ Don't separate positive/negative into different folders
- ❌ Don't use random file names like `test1.groovy` or `mytest.groovy`

---

## 🔑 Keywords (Reusable Functions) - IMPORTANT!

### What are Keywords?

Keywords are **shared functions** that multiple test cases use (like `login()`, `register()`, `searchProperty()`).

### Keywords Folder Structure:

```
Keywords/                    ← Functions used by EVERYONE
│   ├── Authentication_Keywords.groovy --> File where all functions that are related to authentication like login(username, password), register(), forgetPassword() exists
│   ├── Navigation_Keywords.groovy --> File where all navigation function like navigateToPage('homepage') exists
```

---

## 🎬 How to Create Custom Keywords:

### 1. Video Tutorial (WATCH THIS FIRST): https://www.youtube.com/watch?v=EhOWqEsv9S0

### 2. Share with Team on Discord

```
Post in Discord:
"✅ NEW KEYWORD AVAILABLE: register()

📦 File: Keywords/authentication.groovy
📝 Package: authentication

```

### 3. Team Members Use It

```groovy
// In your test case file
import authentication.Register_Keywords as RegisterKW

// Use the function
RegisterKW.register("John", "Doe", "john@test.com", "Password123!")
RegisterKW.verifyRegistrationError("Email already exists")
```

---

## ✅ DO's and ❌ DON'Ts for Keywords

### ✅ DO:

- ✅ Create a keyword if the function is used by **3+ test cases**
- ✅ Use descriptive names: `login()`, `searchProperty()`, not `func1()`
- ✅ Add `@Keyword` annotation before each function
- ✅ Post to Discord when you create a new keyword
- ✅ Import keywords at the top of your test case

### ❌ DON'T:

- ❌ Don't hardcode data in keywords (pass as parameters)
- ❌ Don't create keywords for one-time use functions
- ❌ Don't forget to post in Discord when creating keywords
- ❌ Don't use vague names like `test()`, `check()`, `doSomething()`

## 🎯 Test Case Granularity (How Many Tests to Write?)

### ✅ RIGHT Approach: Group Related Validations

**For a Register Form, write ONLY 3 tests:**

```
✅ TC_A007_RegisterValidData        → Success path (all fields valid)
✅ TC_A008_RegisterValidationErrors → All validation errors grouped
✅ TC_A009_RegisterEdgeCases        → Special characters, long names, etc.
```

**Example: TC_A008_RegisterValidationErrors**

```groovy
import authentication.Register_Keywords as RegisterKW

// Test 1: Empty first name
RegisterKW.register("", "Doe", "john@email.com", "Pass123!")
RegisterKW.verifyRegistrationError("First name required")

// Test 2: Empty last name
RegisterKW.register("John", "", "john@email.com", "Pass123!")
RegisterKW.verifyRegistrationError("Last name required")

// Test 3: Invalid email
RegisterKW.register("John", "Doe", "invalid-email", "Pass123!")
RegisterKW.verifyRegistrationError("Invalid email format")

// Test 4: Weak password
RegisterKW.register("John", "Doe", "john@email.com", "weak")
RegisterKW.verifyRegistrationError("Password too weak")
```

### ❌ WRONG Approach: One Test Per Field

```
❌ TestRegisterFirstNameEmpty
❌ TestRegisterFirstNameTooLong
❌ TestRegisterFirstNameSpecialChars
❌ TestRegisterLastNameEmpty
❌ TestRegisterLastNameTooLong
... (TOO MANY TESTS!)
```

### Rule of Thumb:

| Form Complexity      | Number of Tests | What to Test                            |
| -------------------- | --------------- | --------------------------------------- |
| Simple (3-5 fields)  | 3-4 tests       | Valid + Required errors + Format errors |
| Medium (6-10 fields) | 4-6 tests       | Same as above + Edge cases              |
| Complex (10+ fields) | 5-8 tests       | Group by sections                       |

---

## 🔄 How to Use Shared Keywords (Team Workflow)

### When You USE a Keyword (Created by Someone Else):

#### Step 1: Copy from Discord

- Find the keyword code in Discord channel
- Copy the entire code block

#### Step 2: Create the File Locally

```
1. Right-click Keywords folder → New → Keyword
2. Use EXACT same package name (e.g., authentication)
3. Use EXACT same class name (e.g., Register_Keywords)
4. Paste the code
```

#### Step 3: Import and Use in Your Test

```groovy
import authentication.Register_Keywords as RegisterKW

RegisterKW.register("John", "Doe", "test@email.com", "Pass123!")
```

---

## 🧪 Test Suites (Collections of Tests)

### What are Test Suites?

Test Suites = **Collections of test cases to run together** --> For now each test case folder will be equivalent to a test suite.
Example: if you have this folder structure for test cases:
Test Cases/
├── Authentication/
│ ├── Login/
│ │ ├── TC_A001_AdminLogin.groovy (positive test)
│ │ ├── TC_A002_DeveloperLogin.groovy (positive test)
│ │ ├── TC_A005_InvalidPassword.groovy (negative test)
│ │ └── TC_A006_InvalidEmail.groovy (negative test)
│ ├── Register/
│ │ ├── TC_A007_RegisterValidData.groovy (positive test)
│ │ └── TC_A008_RegisterErrors.groovy (negative test - all validations grouped)
│ └── ForgotPassword/
│ └── TC_A009_ForgotPasswordFlow.groovy
│
├── Properties/
│ ├── Browsing/
│ │ ├── TC_C001_ViewAllProperties.groovy
│ │ └── TC_C005_ViewPropertyDetails.groovy
│ ├── Search/
│ │ └── TC_C002_SearchByLocation.groovy
│ └── Filtering/
│ ├── TC_C003_FilterByPrice.groovy
│ └── TC_C004_FilterByType.groovy

the test suites will be like this:

### Test Suites Structure:

```
Test Suites/
├── 01_Smoke_Test_Suite.ts              ← 5-10 critical tests (run daily) --> This will be created at the very end of the project by all of us collectively
├── 02_Authentication_Suite.ts          ← This will execute all test cases in Test Cases/Authentication/
├── 03_Properties_Suite.ts      ←  This will execute all test cases in Test Cases/Properties/
└── 04_Full_Regression_Suite.ts         ← ALL 43 tests (run weekly) --> This will be created at the very end of the project by all of us collectively
```

### ❌ DON'T:

- ❌ Don't create one suite per folder (NO "Login_Suite", "Register_Suite")
- ❌ Don't create suites with 1-2 test cases

---

## 📝 Test Case Naming Convention

### Format:

```
TC_[GROUP]_[NUMBER]_[DESCRIPTION].groovy
```

### Examples:

```
✅ TC_AUTH_001_AdminLogin.groovy
✅ TC_AUTH_007_RegisterValidData.groovy
✅ TC_PROP_001_ViewProperty.groovy
```

---

## 📋 Daily Workflow Checklist

### Before Starting Work:

- [ ] Check Discord for new keywords
- [ ] Copy/paste any new keyword files to your project
- [ ] Review assigned test cases for the day

### During Work:

- [ ] Follow folder structure exactly as shown
- [ ] If creating a reusable function → Make it a keyword
- [ ] Group related validations in one test case

### After Creating a Keyword:

- [ ] Test the keyword locally first
- [ ] Post full code to Discord with usage example
- [ ] Tag team members if it's urgent/important

### End of Day:

- [ ] Run your test cases to ensure they pass
- [ ] Share any issues in Discord
- [ ] Update your assigned test cases status

---
