# Profile Tests - Quick Reference Card

## 🔑 Test Account
```
Email: user1@realestate.com
Password: Password123!
Role: User (NOT admin)
```

## 📊 Test Suites
```
TS_Profile_Smoke      → 3 tests (~2-3 min)
TS_Profile_Complete   → 8 tests (~5-8 min)
```

## ✅ What's Protected
```
✅ Email: NEVER changed
✅ Password: NEVER changed
✅ Login: Always works
```

## 🔄 What's Restored
```
✅ First Name → User
✅ Last Name → One
✅ Phone → +971501111111
✅ WhatsApp → (cleared)
✅ Contact Email → (cleared)
```

## 📋 Test Cases

### Edit Tests
```
TC_PROF_001 → Update all fields
TC_PROF_002 → Update first name
TC_PROF_003 → Update last name
TC_PROF_004 → Update phone
TC_PROF_005 → Cancel edit
```

### Validation Tests
```
TC_PROF_VAL1 → Empty first name
TC_PROF_VAL2 → Empty last name
TC_PROF_VAL3 → Invalid phone
```

## 🚀 Quick Run
```
1. Open Katalon Studio
2. Go to: Test Suites/TS_Profile_Smoke
3. Click Run ▶️
4. Done! ✅
```

## ✅ Independence Check
```
Run test twice → Same result? → ✅ Independent!
```

## 📁 Key Files
```
Keywords: Keywords/profile/Profile_Keywords.groovy
Tests: Test Cases/Profile/Edit/ & Validation/
Suites: Test Suites/TS_Profile_*.ts
```

## 🎯 Remember
```
✅ Each test restores data
✅ Tests run in any order
✅ Login always works
✅ No manual cleanup needed
```

---
**Status:** ✅ Ready to Run
