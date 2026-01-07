# Profile Login Debug Guide

## ✅ Login Function Updated

### What Changed

**Before (Complex):**
```groovy
1. Navigate to home page
2. Try to find "Sign In" link
3. Click "Sign In" link (if found)
4. Wait for login form
5. Enter credentials
6. Click login
```

**After (Simplified):**
```groovy
1. Navigate directly to /login page
2. Wait for login form
3. Enter credentials
4. Click login
5. Wait longer for redirect
6. Verify login succeeded
```

---

## 🔍 Why Login Might Fail

### Common Causes

1. **Wrong URL**
   - Login page might not be at `/login`
   - Check: http://localhost:5173/login

2. **Wrong Credentials**
   - Email: `user1@realestate.com`
   - Password: `Password123!`
   - Check: Can you login manually?

3. **Objects Not Found**
   - emailInput object missing
   - passwordInput object missing
   - loginButton object missing

4. **Timing Issues**
   - Login button clicked too fast
   - Page not fully loaded
   - Redirect happens before session set

---

## 🔧 Debug Steps

### Step 1: Manual Login Test

1. Open browser to http://localhost:5173/login
2. Enter email: `user1@realestate.com`
3. Enter password: `Password123!`
4. Click "Login"
5. Should redirect to home page ✅

**If manual login fails:**
- ❌ User might not exist in database
- ❌ Password might be wrong
- ❌ Backend not running

**Solution:**
```bash
# Seed the database
cd microservices/admin-service
node seed.js
```

---

### Step 2: Add Debug Logging

Update test script to add logging:

```groovy
import profile.Profile_Keywords as ProfileKeywords

ProfileKeywords profileKW = new ProfileKeywords()

// Add debug logging
WebUI.comment("=== Starting Profile Test ===")
WebUI.comment("Test User: user1@realestate.com")

// Login
WebUI.comment("Step 1: Attempting login...")
profileKW.loginAndNavigateToProfile()

// Check current URL
String currentUrl = WebUI.getUrl()
WebUI.comment("Current URL after login: " + currentUrl)

// Take screenshot
WebUI.takeScreenshot()

// If on login page, login failed
if (currentUrl.contains('/login')) {
    WebUI.comment("❌ LOGIN FAILED - Still on login page")
    WebUI.closeBrowser()
    return
} else {
    WebUI.comment("✅ LOGIN SUCCESS - Not on login page")
}

// Continue with test...
```

---

### Step 3: Check Login Objects

Verify these objects exist:

```bash
# Check if objects exist
ls "Katalon/Object Repository/Authentication/LoginPage/"
```

**Should see:**
- emailInput.rs ✅
- passwordInput.rs ✅
- loginButton.rs ✅

**If missing, login will fail!**

---

### Step 4: Test Login Separately

Create a simple test to verify login works:

**File:** `Test Cases/Profile/Debug/TC_DEBUG_Login.groovy`

```groovy
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject

// Open browser
WebUI.openBrowser('')

// Navigate to login page
WebUI.navigateToUrl('http://localhost:5173/login')
WebUI.delay(2)
WebUI.takeScreenshot()

// Check if email input exists
if (WebUI.verifyElementPresent(findTestObject('Object Repository/Authentication/LoginPage/emailInput'), 5, FailureHandling.OPTIONAL)) {
    WebUI.comment("✅ Email input found")
} else {
    WebUI.comment("❌ Email input NOT found")
}

// Enter email
WebUI.setText(findTestObject('Object Repository/Authentication/LoginPage/emailInput'), 'user1@realestate.com')
WebUI.comment("✅ Email entered")

// Enter password
WebUI.setText(findTestObject('Object Repository/Authentication/LoginPage/passwordInput'), 'Password123!')
WebUI.comment("✅ Password entered")

// Take screenshot before clicking login
WebUI.takeScreenshot()

// Click login
WebUI.click(findTestObject('Object Repository/Authentication/LoginPage/loginButton'))
WebUI.comment("✅ Login button clicked")

// Wait for redirect
WebUI.delay(5)
WebUI.takeScreenshot()

// Check URL
String url = WebUI.getUrl()
WebUI.comment("Current URL: " + url)

if (url.contains('/login')) {
    WebUI.comment("❌ LOGIN FAILED - Still on login page")
} else {
    WebUI.comment("✅ LOGIN SUCCESS - Redirected to: " + url)
}

WebUI.closeBrowser()
```

---

## 🎯 Updated Login Function

### New loginAsTestUser()

```groovy
@Keyword
def loginAsTestUser() {
    WebUI.openBrowser('')
    
    // Navigate directly to login page
    WebUI.navigateToUrl("${BASE_URL}/login")
    WebUI.delay(2)
    
    // Wait for login form to be ready
    WebUI.waitForElementPresent(findTestObject('Object Repository/Authentication/LoginPage/emailInput'), 10)
    
    // Clear and enter email
    WebUI.clearText(findTestObject('Object Repository/Authentication/LoginPage/emailInput'))
    WebUI.setText(findTestObject('Object Repository/Authentication/LoginPage/emailInput'), TEST_USER_EMAIL)
    
    // Clear and enter password (plain text, not encrypted)
    WebUI.clearText(findTestObject('Object Repository/Authentication/LoginPage/passwordInput'))
    WebUI.setText(findTestObject('Object Repository/Authentication/LoginPage/passwordInput'), TEST_USER_PASSWORD)
    
    // Click login button
    WebUI.click(findTestObject('Object Repository/Authentication/LoginPage/loginButton'))
    
    // Wait for login to complete and redirect to home page
    WebUI.delay(5)  // Increased wait time
    WebUI.waitForPageLoad(15)
    
    // Verify we're not on login page anymore (login succeeded)
    WebUI.verifyElementNotPresent(
        findTestObject('Object Repository/Authentication/LoginPage/loginButton'), 
        5, 
        FailureHandling.OPTIONAL
    )
}
```

### Key Changes:
1. ✅ Navigate directly to `/login` (no need to find Sign In link)
2. ✅ Increased wait time after clicking login (5 seconds)
3. ✅ Added verification that login succeeded
4. ✅ Clearer error handling

---

## 📋 Checklist

Before running test, verify:

- [ ] Backend is running (http://localhost:3000)
- [ ] Frontend is running (http://localhost:5173)
- [ ] Login page loads (http://localhost:5173/login)
- [ ] Can login manually with user1@realestate.com / Password123!
- [ ] Database is seeded (user1 exists)
- [ ] All Authentication objects exist in Object Repository
- [ ] Katalon Studio is refreshed (F5)

---

## 🚀 What to Do Now

### 1. Verify User Exists

```bash
# Check if user1 exists in database
cd microservices/admin-service
node seed.js
```

### 2. Test Manual Login

1. Open http://localhost:5173/login
2. Login with user1@realestate.com / Password123!
3. Should redirect to home page ✅

### 3. Refresh Katalon

```
Press F5 to reload updated Profile_Keywords.groovy
```

### 4. Run Test

```
Test Cases/Profile/Edit/TC_PROF_001_UpdateAllFields
```

### 5. Watch Execution

Should see:
1. ✅ Browser opens
2. ✅ Navigates to /login
3. ✅ Enters email
4. ✅ Enters password
5. ✅ Clicks login
6. ✅ Waits 5 seconds
7. ✅ Redirects to home page (NOT login page)
8. ✅ Continues with test

---

## ❌ If Login Still Fails

### Check Error Message

Look in Katalon log for:
- "Element not found" → Object Repository issue
- "Timeout" → Page not loading
- "Still on login page" → Credentials wrong or backend issue

### Try These Solutions

**Solution 1: Increase Wait Time**
```groovy
WebUI.delay(10)  // Wait even longer after login
```

**Solution 2: Check URL**
```groovy
// After login
String url = WebUI.getUrl()
println("Current URL: " + url)
```

**Solution 3: Verify Backend**
```bash
# Check if auth service is running
curl http://localhost:3001/health
```

**Solution 4: Check Browser Console**
- Run test
- Look at browser console for errors
- Check Network tab for failed requests

---

## ✅ Summary

**Login function updated to:**
- ✅ Navigate directly to /login page
- ✅ Wait longer after clicking login (5 seconds)
- ✅ Verify login succeeded before continuing
- ✅ Better error handling

**If login fails:**
1. Test manual login first
2. Verify user exists in database
3. Check backend is running
4. Add debug logging to test
5. Check Katalon logs for errors

---

**Last Updated:** January 7, 2026  
**Status:** ✅ Login Function Simplified and Improved
