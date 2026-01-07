# Profile Test Flow Diagram

## 🔄 Complete Test Execution Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    PROFILE TEST EXECUTION                    │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ STEP 1: SETUP (One-Time)                                    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  cd microservices/auth-service                              │
│  npm run seed:users                                         │
│                                                              │
│  ✅ Creates user1@realestate.com in database                │
│  ✅ Password: Password123! (bcrypt hashed)                  │
│  ✅ Role: user                                              │
│  ✅ Original data: User, One, +971501111111                 │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 2: TEST STARTS                                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ProfileKeywords profileKW = new ProfileKeywords()         │
│  profileKW.loginAndNavigateToProfile()                     │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 3: LOGIN                                               │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. Open browser                                            │
│  2. Navigate to http://localhost:5173/login                │
│  3. Wait for page load (2 seconds)                         │
│  4. Enter email: user1@realestate.com                      │
│  5. Enter password: Password123!                           │
│  6. Click "Login" button                                   │
│  7. Wait for redirect (5 seconds)                          │
│  8. Verify not on login page anymore ✅                    │
│                                                              │
│  Result: Logged in, on home page                           │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 4: NAVIGATE TO PROFILE                                 │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. Wait for page load (2 seconds)                         │
│  2. Find user dropdown button (round button, top right)    │
│     XPath: //button[contains(@class, 'rounded-full')]      │
│  3. Click user dropdown                                     │
│  4. Wait for dropdown to open (1 second)                   │
│  5. Find "My Profile" link                                 │
│     XPath: //a[@href='/profile']                           │
│  6. Click "My Profile" link                                │
│  7. Wait for profile page to load (2 seconds)              │
│                                                              │
│  Result: On profile page (/profile)                        │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 5: PERFORM TEST ACTIONS                                │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Example: TC_PROF_001_UpdateAllFields                      │
│                                                              │
│  1. Fill first name: "UpdatedFirstName"                    │
│  2. Fill last name: "UpdatedLastName"                      │
│  3. Fill phone: "+971599584375"                            │
│  4. Fill WhatsApp: "+971501234567"                         │
│  5. Fill contact email: "contact@example.com"              │
│  6. Click "Save Changes"                                   │
│  7. Wait for save (2 seconds)                              │
│  8. Verify success message appears ✅                      │
│                                                              │
│  Result: Profile updated successfully                       │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 6: RESTORE ORIGINAL DATA                               │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  profileKW.restoreOriginalProfile()                        │
│                                                              │
│  1. Navigate to profile page (if not already there)        │
│  2. Fill first name: "User"                                │
│  3. Fill last name: "One"                                  │
│  4. Fill phone: "+971501111111"                            │
│  5. Clear WhatsApp field                                   │
│  6. Clear contact email field                              │
│  7. Click "Save Changes"                                   │
│  8. Wait for save (2 seconds)                              │
│                                                              │
│  Result: Profile restored to original state ✅             │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 7: CLEANUP                                             │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  WebUI.closeBrowser()                                       │
│                                                              │
│  Result: Test complete, browser closed ✅                  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ RESULT: TEST PASSED ✅                                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ✅ Login succeeded                                         │
│  ✅ Navigation to profile worked                            │
│  ✅ Profile updated successfully                            │
│  ✅ Original data restored                                  │
│  ✅ Test is independent (can run again)                     │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔍 Key Points

### Login Flow
```
Browser → /login → Enter credentials → Click Login → Wait 5s → Home page ✅
```

### Navigation Flow
```
Home page → Click user dropdown → Dropdown opens → Click "My Profile" → Profile page ✅
```

### Test Independence Flow
```
Test 1: Login → Edit → Restore → Close
Test 2: Login → Edit → Restore → Close  ← Uses same account, same original data ✅
Test 3: Login → Edit → Restore → Close  ← Still works! ✅
```

---

## 🎯 Why This Works

### Before Fix ❌
```
Test → Try login → User doesn't exist → Login fails → Stay on login page → Test fails
```

### After Fix ✅
```
Seed users → Test → Try login → User exists → Login succeeds → Navigate to profile → Test passes
```

---

## 📊 Test Data Flow

### Original Data (Always Restored)
```
First Name: User
Last Name: One
Phone: +971501111111
WhatsApp: (empty)
Contact Email: (empty)
```

### During Test (Temporary)
```
First Name: UpdatedFirstName
Last Name: UpdatedLastName
Phone: +971599584375
WhatsApp: +971501234567
Contact Email: contact@example.com
```

### After Test (Restored)
```
First Name: User          ← Restored ✅
Last Name: One            ← Restored ✅
Phone: +971501111111      ← Restored ✅
WhatsApp: (empty)         ← Restored ✅
Contact Email: (empty)    ← Restored ✅
```

---

## 🔐 Protected Fields (NEVER Changed)

```
Email: user1@realestate.com     ← NEVER modified ✅
Password: Password123!           ← NEVER modified ✅
Role: user                       ← NEVER modified ✅
```

**Why?** Changing these would break login for subsequent tests!

---

## 🚀 Multiple Test Execution

### Sequential Execution
```
TC_PROF_001 → Login → Edit → Restore → Close ✅
TC_PROF_002 → Login → Edit → Restore → Close ✅
TC_PROF_003 → Login → Edit → Restore → Close ✅
```

Each test starts with clean data!

### Parallel Execution (Not Recommended)
```
TC_PROF_001 → Login → Edit → Restore → Close
TC_PROF_002 → Login → Edit → Restore → Close  ← May conflict!
```

**Note:** Tests use same account, so parallel execution may cause conflicts.

---

## 📋 Object Repository Usage

### Login Objects
```
Authentication/LoginPage/emailInput       → Enter email
Authentication/LoginPage/passwordInput    → Enter password
Authentication/LoginPage/loginButton      → Click login
```

### Navigation Objects
```
Profile/userDropdown     → Click user dropdown (round button)
Profile/myProfileLink    → Click "My Profile" link
```

### Profile Form Objects
```
Profile/firstNameInput       → Edit first name
Profile/lastNameInput        → Edit last name
Profile/phoneNumberInput     → Edit phone
Profile/whatsappInput        → Edit WhatsApp
Profile/contactEmailInput    → Edit contact email
Profile/saveChangesButton    → Save changes
Profile/cancelButton         → Cancel edit
Profile/successMessage       → Verify success
Profile/errorMessage         → Verify error
```

---

## ✅ Success Criteria

A test passes when:
1. ✅ Login succeeds (not on login page after login)
2. ✅ Navigation to profile works (on /profile page)
3. ✅ Test actions complete (fields updated/validated)
4. ✅ Original data restored (ready for next test)
5. ✅ Browser closes cleanly

---

## 🔧 Debugging Points

### If login fails:
- Check: User exists in database?
- Check: Backend running?
- Check: Correct credentials?

### If navigation fails:
- Check: User dropdown visible?
- Check: XPath matches HTML?
- Check: Dropdown opens on click?

### If profile update fails:
- Check: On profile page?
- Check: Form fields visible?
- Check: Save button clickable?

---

**Last Updated:** January 7, 2026  
**Status:** ✅ Complete Flow Documented
