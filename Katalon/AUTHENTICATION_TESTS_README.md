# Authentication Microservice - Katalon Test Suite

## 📋 Overview

Complete automated test suite for the Authentication microservice, covering Login, Register, Forgot Password, and Reset Password functionality.

## ✅ What's Been Created

### Keywords (Reusable Functions)

Located in: `Keywords/authentication/`

1. **Login_Keywords.groovy**

   - `navigateToLogin()` - Go to login page
   - `login(email, password)` - Perform login
   - `loginAsAdmin()` - Quick login as admin
   - `loginAsDeveloper(number)` - Quick login as developer1-2
   - `loginAsAgent(number)` - Quick login as agent1-5
   - `loginAsUser(number)` - Quick login as user1-12
   - `verifyLoginSuccess()` - Verify successful login
   - `verifyLoginError(text)` - Verify error message
   - `clickForgotPassword()` - Click forgot password link
   - `clickSignUp()` - Click sign up link

2. **Register_Keywords.groovy**

   - `navigateToRegister()` - Go to register page
   - `register(firstName, lastName, email, password, role)` - Full registration
   - `registerAsUser(...)` - Register as user
   - `registerAsDeveloper(...)` - Register as developer
   - `generateUniqueEmail(prefix)` - Generate unique test email
   - `verifyRegistrationSuccess()` - Verify successful registration
   - `verifyRegistrationError(text)` - Verify error message
   - `verifyPasswordRequirementsDisplayed()` - Check password rules shown
   - `clickLoginLink()` - Navigate to login

3. **ForgotPassword_Keywords.groovy**

   - `navigateToForgotPassword()` - Go to forgot password page
   - `submitForgotPassword(email)` - Submit reset request
   - `verifyResetLinkSent()` - Verify success message
   - `verifyForgotPasswordError(text)` - Verify error
   - `clickBackToLogin()` - Return to login

4. **ResetPassword_Keywords.groovy**
   - `navigateToResetPassword(token)` - Go to reset page with token
   - `submitResetPassword(password, confirmPassword)` - Submit new password
   - `verifyResetPasswordSuccess()` - Verify success
   - `verifyResetPasswordError(text)` - Verify error

### Test Cases

Located in: `Test Cases/Authentication/`

#### Login Tests (5 tests)

- **TC_AUTH_001** - Login with Valid Credentials ✅
- **TC_AUTH_002** - Login with Invalid Email ❌
- **TC_AUTH_003** - Login with Incorrect Password ❌
- **TC_AUTH_004** - Login with Empty Fields ❌
- **TC_AUTH_005** - Forgot Password Link Navigation ✅

#### Register Tests (5 tests)

- **TC_AUTH_006** - Register Valid User ✅
- **TC_AUTH_007** - Register Valid Developer ✅
- **TC_AUTH_008** - Register with Duplicate Email ❌
- **TC_AUTH_009** - Register with Weak Password ❌
- **TC_AUTH_010** - Register with Missing Fields ❌

#### Forgot Password Tests (3 tests)

- **TC_AUTH_011** - Forgot Password with Valid Email ✅
- **TC_AUTH_012** - Forgot Password with Invalid Email ❌
- **TC_AUTH_013** - Forgot Password with Empty Email ❌

#### Reset Password Tests (3 tests)

- **TC_AUTH_014** - Reset Password with Valid Token ✅ (requires manual token)
- **TC_AUTH_015** - Reset Password with Mismatch ❌ (requires manual token)
- **TC_AUTH_016** - Reset Password with Invalid Token ❌

### Test Suites

1. **TS_Authentication_Complete.ts**

   - All 16 authentication tests
   - Full regression testing
   - TC_AUTH_014 and TC_AUTH_015 disabled by default (require manual tokens)

2. **TS_Authentication_Smoke.ts**
   - 3 critical tests only (TC_AUTH_001, TC_AUTH_006, TC_AUTH_011)
   - Quick smoke testing
   - Run before deployments

### Object Repository

Located in: `Object Repository/Authentication/`

**LoginPage/** (7 elements)

- emailInput, passwordInput, loginButton
- errorMessage, loadingSpinner
- forgotPasswordLink, signUpLink

**RegisterPage/** (9 elements)

- firstNameInput, lastNameInput, emailInput, passwordInput
- roleSelect, registerButton, errorMessage
- passwordRequirements, loginLink

**ForgotPasswordPage/** (5 elements)

- emailInput, submitButton
- successMessage, errorMessage, backToLoginButton

**ResetPasswordPage/** (5 elements)

- passwordInput, confirmPasswordInput, submitButton
- successMessage, errorMessage

## 🚀 Quick Start

### Prerequisites

1. **Start your application:**

   ```bash
   # Terminal 1: Start backend microservices
   cd microservices
   npm run dev

   # Terminal 2: Start frontend
   cd client
   npm run dev
   ```

2. **Verify URLs:**

   - Frontend: http://localhost:5173
   - API Gateway: http://localhost:3000

3. **Seed database:**
   ```bash
   cd microservices/admin-service
   node seed.js
   ```

### Running Tests in Katalon Studio

#### Method 1: Run Individual Test

1. Open Katalon Studio
2. Navigate to `Test Cases/Authentication/Login/TC_AUTH_001_Login_Valid_Credentials`
3. Click **Run** button (green play icon)
4. Watch test execution in browser

#### Method 2: Run Test Suite

1. Navigate to `Test Suites/TS_Authentication_Smoke`
2. Click **Run** button
3. All 3 smoke tests will execute sequentially

#### Method 3: Run Complete Suite

1. Navigate to `Test Suites/TS_Authentication_Complete`
2. Click **Run**
3. All 16 tests execute (14 enabled by default)

### Running Tests from Command Line

```bash
cd "c:\Personal Files\Eduction 4th year\Service\Project\Real-Estate-Microservices\Katalon"

# Run smoke tests
katalon -noSplash -runMode=console -projectPath="Katalon.prj" -retry=0 -testSuitePath="Test Suites/TS_Authentication_Smoke" -browserType="Chrome"

# Run all tests
katalon -noSplash -runMode=console -projectPath="Katalon.prj" -retry=0 -testSuitePath="Test Suites/TS_Authentication_Complete" -browserType="Chrome"
```

## 📝 Test Data

### Seeded Users (from ACCESS_GUIDE.md)

All passwords: `Password123!`

**Admin:**

- admin@realestate.com

**Developers:**

- developer1@realestate.com
- developer2@realestate.com

**Agents:**

- agent1@realestate.com through agent5@realestate.com

**Users:**

- user1@realestate.com through user12@realestate.com

## ⚠️ Important Notes

### Reset Password Tests (TC_AUTH_014, TC_AUTH_015)

These tests require **manual token retrieval**:

1. Run TC_AUTH_011 to trigger reset email
2. Check email service logs or database for reset token
3. Open test file: `Test Cases/Authentication/ResetPassword/TC_AUTH_014_Reset_Password_Valid_Token/Script.groovy`
4. Replace `REPLACE_WITH_VALID_TOKEN_FROM_EMAIL` with actual token
5. Enable test in Test Suite (set `isRun` to `true`)
6. Run test

### XPath Locators

Object Repository files use flexible XPaths. If your HTML structure differs:

1. Open Object Repository file (e.g., `LoginPage/emailInput.rs`)
2. Update XPATH to match your actual HTML
3. Save and re-run test

## 🎯 Usage Examples

### Example 1: Test Login as Different Roles

```groovy
import authentication.Login_Keywords as LoginKeywords

LoginKeywords loginHelper = new LoginKeywords()

// Login as admin
loginHelper.loginAsAdmin()
loginHelper.verifyLoginSuccess()

// Login as developer
loginHelper.loginAsDeveloper(1)
loginHelper.verifyLoginSuccess()

// Login as agent
loginHelper.loginAsAgent(3)
loginHelper.verifyLoginSuccess()
```

### Example 2: Register New User

```groovy
import authentication.Register_Keywords as RegisterKeywords

RegisterKeywords registerHelper = new RegisterKeywords()

String uniqueEmail = registerHelper.generateUniqueEmail('testuser')

registerHelper.registerAsUser(
    'John',
    'Doe',
    uniqueEmail,
    'SecurePassword123!'
)

registerHelper.verifyRegistrationSuccess()
```

### Example 3: Password Reset Flow

```groovy
import authentication.ForgotPassword_Keywords as ForgotPasswordKeywords
import authentication.ResetPassword_Keywords as ResetPasswordKeywords

// Step 1: Request reset
ForgotPasswordKeywords forgotHelper = new ForgotPasswordKeywords()
forgotHelper.submitForgotPassword('admin@realestate.com')
forgotHelper.verifyResetLinkSent()

// Step 2: Reset password (with valid token)
ResetPasswordKeywords resetHelper = new ResetPasswordKeywords()
resetHelper.navigateToResetPassword('VALID_TOKEN_HERE')
resetHelper.submitResetPassword('NewPassword123!', 'NewPassword123!')
resetHelper.verifyResetPasswordSuccess()
```

## 👥 Team Collaboration

### For Your 5 Team Members

**Everyone can use the Keywords!** No need to duplicate code:

```groovy
// In any new test case, just import and use:
import authentication.Login_Keywords as LoginKeywords
import authentication.Register_Keywords as RegisterKeywords

LoginKeywords loginHelper = new LoginKeywords()
loginHelper.loginAsAdmin()
```

### Creating New Tests

1. Create new test case: `Test Cases/Authentication/YourFeature/TC_NEW_001`
2. Import needed Keywords
3. Use AAA pattern (Arrange, Act, Assert)
4. Add to appropriate Test Suite

### Updating XPath Selectors

If UI changes:

1. Navigate to `Object Repository/Authentication/PageName/element.rs`
2. Update XPATH value
3. All tests using that element auto-update!

## 📊 Expected Results

### Passing Tests

- Login with valid credentials → Redirects to home
- Register new user → Account created, redirects to home
- Forgot password valid email → "Reset link sent" message

### Failing Tests (Negative Cases)

- Login invalid email → "Invalid credentials" error
- Register duplicate email → "Email already exists" error
- Weak password → Password requirements shown

## 🐛 Troubleshooting

### Test fails immediately

**Issue:** Application not running
**Fix:** Start frontend (port 5173) and backend (port 3000)

### "Element not found" error

**Issue:** XPath doesn't match your HTML
**Fix:**

1. Run test in Katalon with Spy Object
2. Capture actual element
3. Update Object Repository file with correct XPATH

### Login test passes but others fail

**Issue:** Database not seeded
**Fix:**

```bash
cd microservices/admin-service
node seed.js
```

### Tests run but browser doesn't open

**Issue:** Browser driver not configured
**Fix:** Katalon Studio → Project → Settings → Execution → Default WebDriver

## 📈 Next Steps

1. **Run Smoke Suite** first to verify setup
2. **Run Complete Suite** to test all scenarios
3. **Update XPaths** if any elements not found
4. **Add new tests** using existing Keywords as reference
5. **Create Test Suites** for specific features

## 📞 Support

Review these files for more info:

- `TEAM_AUTOMATION_GUIDE.md` - Collaboration guide
- `AUTOMATION_TESTING_STRATEGY.md` - Overall strategy
- `AUTHENTICATION_TEST_IMPLEMENTATION.md` - Detailed blueprint

---

**Ready to test!** 🎉

Start with: `Test Suites/TS_Authentication_Smoke` (3 tests, ~2 minutes)
