# Seed Users Guide

## 🎯 Purpose

This guide explains how to seed test users into the database for Katalon testing.

## 📝 What Gets Created

The seed script creates **21 test users** with the following accounts:

### Admin (1 user)
- `admin@realestate.com` - Admin User

### Developers (2 users)
- `developer1@realestate.com` - Developer One
- `developer2@realestate.com` - Developer Two

### Agents (5 users)
- `agent1@realestate.com` through `agent5@realestate.com`

### Regular Users (12 users)
- `user1@realestate.com` through `user12@realestate.com`

**All users have the same password:** `Password123!`

---

## 🚀 How to Run

### Step 1: Navigate to auth-service
```bash
cd microservices/auth-service
```

### Step 2: Run the seed script
```bash
node seed-users.js
```

### Expected Output:
```
Connecting to MongoDB at mongodb://localhost:27017/real-estate-auth...
✓ Connected to MongoDB
Hashing password...
✓ Password hashed
✓ Cleared 0 existing users
✓ Inserted 21 users into database

📋 Users by Role:

ADMINS (1):
  • admin@realestate.com - Admin User

DEVELOPERS (2):
  • developer1@realestate.com - Developer One
  • developer2@realestate.com - Developer Two

AGENTS (5):
  • agent1@realestate.com - Agent One
  • agent2@realestate.com - Agent Two
  • agent3@realestate.com - Agent Three
  • agent4@realestate.com - Agent Four
  • agent5@realestate.com - Agent Five

USERS (12):
  • user1@realestate.com - User One
  • user2@realestate.com - User Two
  • user3@realestate.com - User Three
  • user4@realestate.com - User Four
  • user5@realestate.com - User Five
  • user6@realestate.com - User Six
  • user7@realestate.com - User Seven
  • user8@realestate.com - User Eight
  • user9@realestate.com - User Nine
  • user10@realestate.com - User Ten
  • user11@realestate.com - User Eleven
  • user12@realestate.com - User Twelve

🔑 All users have the same password: Password123!

✅ User seeding completed successfully!
```

---

## ✅ Verify Users Were Created

### Option 1: Manual Login Test
1. Open http://localhost:5173/login
2. Try logging in with:
   - Email: `user1@realestate.com`
   - Password: `Password123!`
3. Should successfully login ✅

### Option 2: Check MongoDB
```bash
# Connect to MongoDB
mongosh

# Switch to auth database
use real-estate-auth

# Count users
db.users.countDocuments()
# Should return: 21

# Find user1
db.users.findOne({ email: "user1@realestate.com" })
# Should return user document
```

---

## 🔧 Troubleshooting

### Error: "Cannot find module 'bcrypt'"
```bash
# Install bcrypt
npm install bcrypt
```

### Error: "Cannot connect to MongoDB"
```bash
# Make sure MongoDB is running
# Check if auth-service is running
cd microservices/auth-service
npm run start:dev
```

### Error: "Duplicate key error"
Users already exist. Options:
1. **Keep existing users** - Comment out the `deleteMany` line in seed script
2. **Replace all users** - The script will clear and recreate all users

---

## 📋 User Details for Testing

### Profile Tests
**Account:** `user1@realestate.com`  
**Password:** `Password123!`  
**Original Data:**
- First Name: User
- Last Name: One
- Phone: +971501111111

### Review Tests
**Account:** `a7med3li@gmail.com` (manually created, not seeded)  
**Password:** (encrypted in test)

### Authentication Tests
**Various accounts** - All seeded users can be used

---

## 🔄 Re-running the Seed Script

You can run the seed script multiple times:
- **First run:** Creates 21 users
- **Subsequent runs:** Clears existing users and recreates them

This is useful if:
- Tests modified user data
- Need to reset all users to original state
- Database got corrupted

---

## 🎯 Next Steps After Seeding

1. **Verify user1 exists:**
   ```bash
   # Manual login test
   Open http://localhost:5173/login
   Login with user1@realestate.com / Password123!
   ```

2. **Run Profile tests:**
   ```
   Test Cases/Profile/Edit/TC_PROF_001_UpdateAllFields
   ```

3. **Should now work because:**
   - ✅ user1@realestate.com exists in database
   - ✅ Password is correctly hashed
   - ✅ User has correct role and permissions
   - ✅ Login will succeed

---

## 📊 Database Structure

**Database:** `real-estate-auth`  
**Collection:** `users`  
**Documents:** 21 user documents

Each user document contains:
```json
{
  "_id": "...",
  "firstName": "User",
  "lastName": "One",
  "email": "user1@realestate.com",
  "password": "$2b$12$...", // bcrypt hashed
  "authType": "local",
  "role": "user",
  "phoneNumber": "+971501111111",
  "active": true,
  "savedProperties": [],
  "isEmailVerified": true,
  "createdAt": "...",
  "updatedAt": "..."
}
```

---

## ✅ Summary

**Created:** `microservices/auth-service/seed-users.js`

**Run command:**
```bash
cd microservices/auth-service
node seed-users.js
```

**Result:** 21 test users created with password `Password123!`

**Profile test user:** `user1@realestate.com` ✅

---

**Last Updated:** January 7, 2026  
**Status:** ✅ Seed Script Created and Ready to Use
