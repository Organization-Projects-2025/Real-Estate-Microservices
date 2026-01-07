# Quick Fix: Profile Tests Not Working

## 🚨 Problem
Profile tests fail with "Object is null" error because login doesn't work.

## ✅ Solution (3 Steps)

### Step 1: Seed Test Users
```bash
cd microservices/auth-service
node seed-users.js
# OR
npm run seed:users
```

**This creates user1@realestate.com in the database.**

### Step 2: Verify Manual Login
1. Open http://localhost:5173/login
2. Login with:
   - Email: `user1@realestate.com`
   - Password: `Password123!`
3. Should redirect to home page ✅

### Step 3: Run Tests
1. Open Katalon Studio
2. Press F5 to refresh
3. Run: `Test Cases/Profile/Edit/TC_PROF_001_UpdateAllFields`
4. Should pass! ✅

---

## 📋 What Was Wrong

**Before:** user1@realestate.com didn't exist in database → login failed

**After:** Seed script creates user1@realestate.com → login works ✅

---

## 🔧 If Still Not Working

### Check Prerequisites
```bash
# MongoDB running?
mongosh

# Backend running?
curl http://localhost:3000

# Frontend running?
curl http://localhost:5173
```

### Verify User Exists
```bash
mongosh
use real-estate-auth
db.users.findOne({ email: "user1@realestate.com" })
```

Should return user document. If null, run seed script again.

---

## 📚 Detailed Documentation

- **Complete solution:** [PROFILE_LOGIN_FIX_COMPLETE.md](PROFILE_LOGIN_FIX_COMPLETE.md)
- **Seed guide:** [SEED_USERS_GUIDE.md](SEED_USERS_GUIDE.md)
- **Access guide:** [ACCESS_GUIDE.md](ACCESS_GUIDE.md)

---

**TL;DR:** Run `cd microservices/auth-service && node seed-users.js` then test again! 🚀
