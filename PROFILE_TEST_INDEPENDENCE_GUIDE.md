# Profile Test Independence - Visual Guide

## 🎯 Test Account

```
User: user1@realestate.com
Password: Password123! (NEVER CHANGED)
Email: user1@realestate.com (NEVER CHANGED)

Original Profile Data:
├── First Name: User
├── Last Name: One
├── Phone: +971501111111
├── WhatsApp: (empty)
└── Contact Email: (empty)
```

---

## 🔄 Test Independence Flow

### Test 1: TC_PROF_001_UpdateAllFields

```
START
  ↓
Login: user1@realestate.com ✅
  ↓
Profile Data: User, One, +971501111111
  ↓
UPDATE TO: UpdatedFirstName, UpdatedLastName, +971599584375
  ↓
Save Changes ✅
  ↓
RESTORE TO: User, One, +971501111111 ✅
  ↓
END
```

**Result:** Profile is back to original state ✅

---

### Test 2: TC_PROF_002_UpdateFirstName

```
START
  ↓
Login: user1@realestate.com ✅ (still works!)
  ↓
Profile Data: User, One, +971501111111 ✅ (original values!)
  ↓
UPDATE TO: NewFirstName, One, +971501111111
  ↓
Save Changes ✅
  ↓
RESTORE TO: User, One, +971501111111 ✅
  ↓
END
```

**Result:** Profile is back to original state ✅

---

### Test 3: TC_PROF_VAL1_EmptyFirstName

```
START
  ↓
Login: user1@realestate.com ✅ (still works!)
  ↓
Profile Data: User, One, +971501111111 ✅ (original values!)
  ↓
UPDATE TO: (empty), One, +971501111111
  ↓
Try Save Changes ❌ (validation error expected)
  ↓
RESTORE TO: User, One, +971501111111 ✅ (just in case)
  ↓
END
```

**Result:** Profile is back to original state ✅

---

## 🔒 What's Protected

### NEVER Changed ✅
```
✅ Email: user1@realestate.com
✅ Password: Password123!
```

### Always Restored ✅
```
✅ First Name → User
✅ Last Name → One
✅ Phone → +971501111111
✅ WhatsApp → (cleared)
✅ Contact Email → (cleared)
```

---

## 📊 Test Execution Matrix

| Test Order | Test Name | Login Works? | Data State | Restores? |
|------------|-----------|--------------|------------|-----------|
| 1st | TC_PROF_001 | ✅ Yes | Original | ✅ Yes |
| 2nd | TC_PROF_002 | ✅ Yes | Original | ✅ Yes |
| 3rd | TC_PROF_003 | ✅ Yes | Original | ✅ Yes |
| 4th | TC_PROF_004 | ✅ Yes | Original | ✅ Yes |
| 5th | TC_PROF_005 | ✅ Yes | Original | ✅ N/A (cancel) |
| 6th | TC_PROF_VAL1 | ✅ Yes | Original | ✅ Yes |
| 7th | TC_PROF_VAL2 | ✅ Yes | Original | ✅ Yes |
| 8th | TC_PROF_VAL3 | ✅ Yes | Original | ✅ Yes |

**After All Tests:** Profile data = Original ✅

---

## 🔄 Run Tests Multiple Times

### First Run
```
TC_PROF_001 → Updates → Restores → ✅ Pass
TC_PROF_002 → Updates → Restores → ✅ Pass
TC_PROF_003 → Updates → Restores → ✅ Pass
```

### Second Run (Immediately After)
```
TC_PROF_001 → Updates → Restores → ✅ Pass (same result!)
TC_PROF_002 → Updates → Restores → ✅ Pass (same result!)
TC_PROF_003 → Updates → Restores → ✅ Pass (same result!)
```

**Why?** Each test restores data, so tests are repeatable! ✅

---

## 🎯 Test in Any Order

### Scenario 1: Normal Order
```
1. TC_PROF_001 ✅
2. TC_PROF_002 ✅
3. TC_PROF_003 ✅
```

### Scenario 2: Reverse Order
```
1. TC_PROF_003 ✅
2. TC_PROF_002 ✅
3. TC_PROF_001 ✅
```

### Scenario 3: Random Order
```
1. TC_PROF_VAL1 ✅
2. TC_PROF_004 ✅
3. TC_PROF_001 ✅
```

**All scenarios work!** Order doesn't matter ✅

---

## ⚠️ What Would Happen WITHOUT Restore?

### Bad Example (Without Restore)
```
Test 1: Update First Name to "John"
  ↓
Test 2: Expects "User" but finds "John" ❌ FAIL
  ↓
Test 3: Expects "User" but finds "Jane" ❌ FAIL
  ↓
Login fails because email was changed ❌ FAIL
```

### Good Example (With Restore) ✅
```
Test 1: Update First Name to "John" → Restore to "User"
  ↓
Test 2: Expects "User" and finds "User" ✅ PASS
  ↓
Test 3: Expects "User" and finds "User" ✅ PASS
  ↓
Login works because email never changed ✅ PASS
```

---

## 🔍 How to Verify Independence

### Manual Verification Steps

1. **Run TC_PROF_001_UpdateAllFields**
   ```
   Expected: Updates all fields, then restores
   Verify: Check profile shows User, One, +971501111111
   ```

2. **Run TC_PROF_002_UpdateFirstName**
   ```
   Expected: Login works, finds original data
   Verify: Test passes without errors
   ```

3. **Run TC_PROF_001 Again**
   ```
   Expected: Same result as first run
   Verify: Test passes identically
   ```

4. **Check Login**
   ```
   Expected: user1@realestate.com still works
   Verify: Can login manually with Password123!
   ```

✅ If all steps pass, tests are independent!

---

## 📝 Code Example

### Test Script Pattern
```groovy
// 1. Login as test user
profileKW.loginAndNavigateToProfile()

// 2. Perform test actions
profileKW.fillFirstName('TestName')
profileKW.clickSaveChanges()

// 3. Verify results
profileKW.verifySuccessMessage()

// 4. RESTORE ORIGINAL VALUES (Critical!)
profileKW.restoreOriginalProfile()

// 5. Close browser
WebUI.closeBrowser()
```

### Restore Function
```groovy
def restoreOriginalProfile() {
    navigateToProfile()
    
    fillFirstName('User')
    fillLastName('One')
    fillPhoneNumber('+971501111111')
    
    // Clear optional fields
    WebUI.clearText(whatsappInput)
    WebUI.clearText(contactEmailInput)
    
    clickSaveChanges()
}
```

---

## ✅ Checklist for Test Independence

- [x] Uses dedicated test user (user1@realestate.com)
- [x] Never modifies email field
- [x] Never modifies password
- [x] Restores data after each test
- [x] Tests can run in any order
- [x] Tests can run multiple times
- [x] Login credentials always work
- [x] No dependencies between tests

---

## 🎉 Summary

**Every Profile test:**
1. Logs in as `user1@realestate.com`
2. Performs its specific test actions
3. Restores original profile data
4. Closes browser

**Result:**
- ✅ Tests are completely independent
- ✅ Can run in any order
- ✅ Can run multiple times
- ✅ Login always works
- ✅ No cleanup scripts needed

**Test Account Status:**
- Email: `user1@realestate.com` ✅ Protected
- Password: `Password123!` ✅ Protected
- Profile: Automatically restored ✅ Protected

Ready for production testing! 🚀
