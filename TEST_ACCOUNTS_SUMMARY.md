# Test Accounts Summary

## 📋 Test Account Usage by Module

### Profile Tests
**Account:** `user1@realestate.com`  
**Password:** `Password123!`  
**Type:** Seeded user from ACCESS_GUIDE.md  
**Location:** `Katalon/Keywords/profile/Profile_Keywords.groovy`

```groovy
private static final String TEST_USER_EMAIL = 'user1@realestate.com'
private static final String TEST_USER_PASSWORD = 'Password123!'
```

**Used by:**
- All Profile Edit tests (TC_PROF_001 through TC_PROF_005)
- All Profile Validation tests (TC_PROF_VAL1 through TC_PROF_VAL3)

---

### Review Tests
**Account:** `a7med3li@gmail.com`  
**Password:** `(encrypted: t8wp1gy9IWfOCKxwWlfTFQ==)`  
**Type:** Custom test account  
**Location:** `Katalon/Keywords/review/Review_Keywords.groovy`

```groovy
private static final String USER_EMAIL = 'a7med3li@gmail.com'
private static final String USER_PASSWORD_ENCRYPTED = 't8wp1gy9IWfOCKxwWlfTFQ=='
```

**Used by:**
- All Review Create tests (TC_Review_CR1 through TC_Review_CR5)
- All Review Validation tests (TC_Review_VAL1 through TC_Review_VAL5)

---

### Authentication Tests
**Accounts:** Various seeded accounts  
**Password:** `Password123!` (for all)  
**Type:** Seeded users from ACCESS_GUIDE.md  
**Location:** `Katalon/Keywords/authentication/Login_Keywords.groovy`

**Available accounts:**
- `admin@realestate.com` - Admin user
- `developer1@realestate.com`, `developer2@realestate.com` - Developers
- `agent1@realestate.com` through `agent5@realestate.com` - Agents
- `user1@realestate.com` through `user12@realestate.com` - Regular users

---

### Admin Tests
**Account:** `admin@realestate.com`  
**Password:** `Password123!`  
**Type:** Seeded admin from ACCESS_GUIDE.md  
**Location:** Uses `authentication.Login_Keywords.loginAsAdmin()`

---

## 🔑 Account Separation

### Why Different Accounts?

1. **Profile Tests → user1@realestate.com**
   - Tests profile editing functionality
   - Needs a dedicated account to avoid conflicts
   - Uses seeded user from ACCESS_GUIDE.md

2. **Review Tests → a7med3li@gmail.com**
   - Tests review creation functionality
   - Uses custom account (already configured)
   - Separate from profile tests

3. **Authentication Tests → Various**
   - Tests login/register functionality
   - Uses multiple seeded accounts
   - Tests different user roles

4. **Admin Tests → admin@realestate.com**
   - Tests admin dashboard functionality
   - Requires admin privileges
   - Uses seeded admin account

---

## ✅ No Conflicts

Each test module uses its own account:
- ✅ Profile tests won't interfere with Review tests
- ✅ Review tests won't interfere with Profile tests
- ✅ Each module is independent
- ✅ Tests can run in parallel (future)

---

## 📊 Account Matrix

| Module | Account | Password | Type | Seeded? |
|--------|---------|----------|------|---------|
| Profile | user1@realestate.com | Password123! | User | ✅ Yes |
| Review | a7med3li@gmail.com | (encrypted) | User | ❌ No |
| Authentication | Various | Password123! | Various | ✅ Yes |
| Admin | admin@realestate.com | Password123! | Admin | ✅ Yes |
| Agent | agent1-5@realestate.com | Password123! | Agent | ✅ Yes |
| Developer | developer1-2@realestate.com | Password123! | Developer | ✅ Yes |

---

## 🔍 How to Verify

### Profile Tests Use user1@realestate.com
```bash
# Check Profile_Keywords.groovy
grep "TEST_USER_EMAIL" Katalon/Keywords/profile/Profile_Keywords.groovy
# Should show: user1@realestate.com
```

### Review Tests Use a7med3li@gmail.com
```bash
# Check Review_Keywords.groovy
grep "USER_EMAIL" Katalon/Keywords/review/Review_Keywords.groovy
# Should show: a7med3li@gmail.com
```

---

## 📝 Summary

**Profile Tests:**
- Account: `user1@realestate.com` ✅
- Password: `Password123!` ✅
- Status: Uses seeded account ✅

**Review Tests:**
- Account: `a7med3li@gmail.com` ✅
- Password: (encrypted) ✅
- Status: Uses custom account ✅

**No conflicts between modules!** ✅

---

**Last Updated:** January 7, 2026  
**Status:** ✅ Accounts Verified and Separated
