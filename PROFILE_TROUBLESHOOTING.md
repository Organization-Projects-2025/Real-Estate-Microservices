# Profile Tests - Troubleshooting Guide

## ❌ Common Error: "Object is null"

### Error Message
```
com.kms.katalon.core.exception.IllegalTestObjectException: Object is null
```

### What It Means
Katalon cannot find an object in the Object Repository. This usually means:
1. The object doesn't exist
2. The object path is wrong
3. The object name is misspelled

---

## 🔍 Troubleshooting Steps

### Step 1: Verify Object Repository Files Exist

Check that these files exist:

**Authentication Objects (Required for Login):**
```
Katalon/Object Repository/Authentication/LoginPage/
├── signInLink.rs ✅ (newly created)
├── emailInput.rs
├── passwordInput.rs
└── loginButton.rs
```

**Profile Objects (Required for Profile Tests):**
```
Katalon/Object Repository/Profile/
├── firstNameInput.rs
├── lastNameInput.rs
├── emailInput.rs
├── phoneNumberInput.rs
├── whatsappInput.rs
├── contactEmailInput.rs
├── saveChangesButton.rs
├── cancelButton.rs
├── successMessage.rs
└── errorMessage.rs
```

### Step 2: Check Object Paths in Keywords

Open: `Katalon/Keywords/profile/Profile_Keywords.groovy`

Verify these paths are correct:
```groovy
// Login objects
findTestObject('Object Repository/Authentication/LoginPage/signInLink')
findTestObject('Object Repository/Authentication/LoginPage/emailInput')
findTestObject('Object Repository/Authentication/LoginPage/passwordInput')
findTestObject('Object Repository/Authentication/LoginPage/loginButton')

// Profile objects
findTestObject('Object Repository/Profile/firstNameInput')
findTestObject('Object Repository/Profile/lastNameInput')
// etc...
```

### Step 3: Refresh Katalon Studio

1. Press **F5** to refresh the project
2. Close and reopen Katalon Studio
3. Try running the test again

---

## 🔧 Quick Fixes

### Fix 1: Missing signInLink Object

**Problem:** `signInLink` object doesn't exist

**Solution:** The object has been created at:
```
Katalon/Object Repository/Authentication/LoginPage/signInLink.rs
```

**Verify:** Check the file exists and refresh Katalon (F5)

### Fix 2: Wrong Object Path

**Problem:** Object path doesn't match file location

**Check:** Object paths in code should match file structure:
```
File: Katalon/Object Repository/Profile/firstNameInput.rs
Code: findTestObject('Object Repository/Profile/firstNameInput')
```

### Fix 3: Application Not Running

**Problem:** Test tries to login but app isn't running

**Solution:**
```bash
# Start backend
cd microservices
npm run dev

# Start frontend (in new terminal)
cd client
npm run dev
```

**Verify:** Open http://localhost:5173 in browser

---

## 🎯 Specific Error Solutions

### Error at loginAsTestUser()

**Error Location:**
```
profileKW.loginAndNavigateToProfile()
  └── loginAsTestUser()
      └── Object is null
```

**Possible Causes:**
1. ❌ signInLink object missing
2. ❌ emailInput object missing
3. ❌ passwordInput object missing
4. ❌ loginButton object missing

**Solution:**
1. Verify all Authentication/LoginPage objects exist
2. Refresh Katalon Studio (F5)
3. Check application is running on http://localhost:5173

### Error at fillFirstName()

**Error Location:**
```
profileKW.fillFirstName('NewName')
  └── Object is null
```

**Possible Causes:**
1. ❌ firstNameInput object missing
2. ❌ Wrong object path

**Solution:**
1. Verify `Katalon/Object Repository/Profile/firstNameInput.rs` exists
2. Check the XPath in the object file matches your HTML
3. Refresh Katalon Studio (F5)

### Error at clickSaveChanges()

**Error Location:**
```
profileKW.clickSaveChanges()
  └── Object is null
```

**Possible Causes:**
1. ❌ saveChangesButton object missing
2. ❌ Button not visible on page

**Solution:**
1. Verify `Katalon/Object Repository/Profile/saveChangesButton.rs` exists
2. Check if you're on the profile page
3. Verify button is visible in browser

---

## 🔍 Debug Mode

### Enable Detailed Logging

Add this to your test script:
```groovy
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI

// Enable detailed logging
WebUI.comment("Starting test...")
WebUI.comment("Logging in as: ${TEST_USER_EMAIL}")

// Before each action
WebUI.comment("Clicking Sign In link...")
WebUI.click(findTestObject('...'))

WebUI.comment("Entering email...")
WebUI.setText(findTestObject('...'), email)
```

### Check Which Object Fails

Run test and check the log to see exactly which object is null:
```
✅ Clicking Sign In link... (Success)
✅ Entering email... (Success)
❌ Entering password... (FAILED - Object is null)
```

This tells you `passwordInput` object is the problem.

---

## 📋 Verification Checklist

Before running tests, verify:

- [ ] Katalon Studio is open
- [ ] Project is refreshed (F5)
- [ ] All Object Repository files exist
- [ ] Backend is running (http://localhost:3000)
- [ ] Frontend is running (http://localhost:5173)
- [ ] Can login manually with user1@realestate.com
- [ ] Profile page loads at http://localhost:5173/profile

---

## 🔄 Object Repository File Format

### Correct Format Example

File: `Katalon/Object Repository/Profile/firstNameInput.rs`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<WebElementEntity>
   <description>First Name input field on Profile page</description>
   <name>firstNameInput</name>
   <tag></tag>
   <elementGuidId>profile-firstname-input</elementGuidId>
   <selectorCollection>
      <entry>
         <key>XPATH</key>
         <value>//input[@name='firstName']</value>
      </entry>
   </selectorCollection>
   <selectorMethod>XPATH</selectorMethod>
   <useRalativeImagePath>false</useRalativeImagePath>
</WebElementEntity>
```

### Check Your XPath

If object exists but still fails, the XPath might be wrong:

1. Open browser to http://localhost:5173/profile
2. Right-click the element → Inspect
3. Copy the correct XPath
4. Update the `.rs` file with correct XPath

---

## 🚀 Quick Test

### Test Object Exists

Create a simple test to verify objects:
```groovy
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject

WebUI.openBrowser('http://localhost:5173')

// Test if signInLink exists
try {
    WebUI.click(findTestObject('Object Repository/Authentication/LoginPage/signInLink'))
    WebUI.comment("✅ signInLink found!")
} catch (Exception e) {
    WebUI.comment("❌ signInLink NOT found: " + e.message)
}

WebUI.closeBrowser()
```

---

## 📞 Still Having Issues?

### Check These Files

1. **Profile_Keywords.groovy**
   - Location: `Katalon/Keywords/profile/Profile_Keywords.groovy`
   - Check: All `findTestObject()` paths are correct

2. **Object Repository Files**
   - Location: `Katalon/Object Repository/Profile/`
   - Check: All 10 files exist

3. **Test Scripts**
   - Location: `Katalon/Scripts/Profile/Edit/`
   - Check: All call `loginAndNavigateToProfile()` first

### Common Mistakes

❌ Wrong: `findTestObject('Profile/firstNameInput')`  
✅ Correct: `findTestObject('Object Repository/Profile/firstNameInput')`

❌ Wrong: `findTestObject('Object Repository/Profile/firstName')`  
✅ Correct: `findTestObject('Object Repository/Profile/firstNameInput')`

---

## ✅ Solution Summary

**If you get "Object is null" error:**

1. ✅ Refresh Katalon Studio (F5)
2. ✅ Verify all Object Repository files exist
3. ✅ Check application is running
4. ✅ Verify object paths in code match file structure
5. ✅ Check XPath in object files match your HTML

**Most common fix:** Refresh Katalon Studio (F5) after creating new objects!

---

**Last Updated:** January 7, 2026  
**Status:** Troubleshooting Guide Complete
