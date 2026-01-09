# Authentication Test Cases - Naming Convention & Order Analysis

## Current Test Case Inventory (36 tests)

### Login Tests (16 tests)

- ✅ TC_AUTH_001_Login_Valid_Credentials
- ✅ TC_AUTH_002_Login_Invalid_Email
- ✅ TC_AUTH_003_Login_Incorrect_Password
- ✅ TC_AUTH_004_Login_Empty_Fields
- ✅ TC_AUTH_005_Forgot_Password_Link
- ✅ TC_AUTH_017_Invalid_Email_Format
- ✅ TC_AUTH_018_Email_Special_Characters
- ✅ TC_AUTH_020_Email_Trimming
- ✅ TC_AUTH_024_Login_Page_Elements
- ✅ TC_AUTH_026_Password_Masking
- ✅ TC_AUTH_027_Loading_Indicator
- ✅ TC_AUTH_030_XSS_Prevention
- ✅ TC_AUTH_032_Password_Not_In_URL
- ✅ TC_AUTH_034_Session_Persistence
- ✅ TC_AUTH_035_Logout_Functionality
- ✅ TC_AUTH_037_Back_Button_After_Login

### Register Tests (8 tests)

- ✅ TC_AUTH_006_Register_Valid_User
- ✅ TC_AUTH_007_Register_Valid_Developer
- ✅ TC_AUTH_008_Register_Duplicate_Email
- ✅ TC_AUTH_009_Register_Weak_Password
- ✅ TC_AUTH_010_Register_Missing_Fields
- ✅ TC_AUTH_019_Long_Input_Handling
- ✅ TC_AUTH_022_Minimum_Password_Length
- ✅ TC_AUTH_023_Maximum_Password_Length
- ✅ TC_AUTH_025_Register_Page_Elements
- ✅ TC_AUTH_027_Register_Password_Masking (Note: Duplicate number with Login TC_AUTH_027)
- ✅ TC_AUTH_036_Register_Auto_Login
- ✅ TC_AUTH_040_Role_Persistence

### Forgot Password Tests (4 tests)

- ✅ TC_AUTH_011_Forgot_Password_Valid_Email
- ✅ TC_AUTH_012_Forgot_Password_Invalid_Email
- ✅ TC_AUTH_013_Forgot_Password_Empty_Email
- ✅ TC_AUTH_029_ForgotPassword_Page_Elements

### Reset Password Tests (4 tests)

- ✅ TC_AUTH_014_Reset_Password_Valid_Token
- ✅ TC_AUTH_015_Reset_Password_Mismatch (JUST FIXED - was empty)
- ✅ TC_AUTH_016_Reset_Password_Invalid_Token
- ✅ TC_AUTH_030_ResetPassword_Page_Elements (Note: Duplicate number with Login TC_AUTH_030)

## Issues Identified

### 1. ❌ Duplicate Test Numbers

- **TC_AUTH_027**: Used by both Login (Loading_Indicator) and Register (Register_Password_Masking)
- **TC_AUTH_030**: Used by both Login (XSS_Prevention) and ResetPassword (Page_Elements)

### 2. ⚠️ Inconsistent Naming Pattern

- Most use underscore_case: `TC_AUTH_XXX_Feature_Description`
- Some use PascalCase for compound words: `ForgotPassword`, `ResetPassword`
- Some use separate words: `Forgot_Password`, `Reset_Password`

### 3. ⚠️ Non-Sequential Numbering

- Gaps in sequence: Missing TC_AUTH_021, TC_AUTH_028, TC_AUTH_031, TC_AUTH_033, TC_AUTH_038, TC_AUTH_039
- Numbers scattered across categories instead of grouped

## Recommended Reorganization

### Option A: Sequential by Feature Flow

```
LOGIN (TC_AUTH_001-020)
├── TC_AUTH_001_Login_Valid_Credentials
├── TC_AUTH_002_Login_Invalid_Email
├── TC_AUTH_003_Login_Incorrect_Password
├── TC_AUTH_004_Login_Empty_Fields
├── TC_AUTH_005_Forgot_Password_Link
├── TC_AUTH_006_Invalid_Email_Format
├── TC_AUTH_007_Email_Special_Characters
├── TC_AUTH_008_Email_Trimming
├── TC_AUTH_009_Login_Page_Elements
├── TC_AUTH_010_Password_Masking
├── TC_AUTH_011_Loading_Indicator
├── TC_AUTH_012_XSS_Prevention
├── TC_AUTH_013_Password_Not_In_URL
├── TC_AUTH_014_Session_Persistence
├── TC_AUTH_015_Logout_Functionality
└── TC_AUTH_016_Back_Button_After_Login

REGISTER (TC_AUTH_021-040)
├── TC_AUTH_021_Register_Valid_User
├── TC_AUTH_022_Register_Valid_Developer
├── TC_AUTH_023_Register_Duplicate_Email
├── TC_AUTH_024_Register_Weak_Password
├── TC_AUTH_025_Register_Missing_Fields
├── TC_AUTH_026_Register_Page_Elements
├── TC_AUTH_027_Register_Password_Masking
├── TC_AUTH_028_Long_Input_Handling
├── TC_AUTH_029_Minimum_Password_Length
├── TC_AUTH_030_Maximum_Password_Length
├── TC_AUTH_031_Register_Auto_Login
└── TC_AUTH_032_Role_Persistence

FORGOT PASSWORD (TC_AUTH_041-050)
├── TC_AUTH_041_ForgotPassword_Valid_Email
├── TC_AUTH_042_ForgotPassword_Invalid_Email
├── TC_AUTH_043_ForgotPassword_Empty_Email
└── TC_AUTH_044_ForgotPassword_Page_Elements

RESET PASSWORD (TC_AUTH_051-060)
├── TC_AUTH_051_ResetPassword_Valid_Token
├── TC_AUTH_052_ResetPassword_Mismatch
├── TC_AUTH_053_ResetPassword_Invalid_Token
└── TC_AUTH_054_ResetPassword_Page_Elements
```

### Option B: Keep Current Numbers, Fix Duplicates Only

- Rename TC_AUTH_027_Register_Password_Masking → TC_AUTH_028
- Rename TC_AUTH_030_ResetPassword_Page_Elements → TC_AUTH_031
- Keep all other numbers as-is

## Naming Convention Recommendation

**Standardize to**: `TC_AUTH_XXX_Feature_Description`

- Use **PascalCase** for compound feature names: `ForgotPassword`, `ResetPassword`
- Use **underscores** to separate number, feature, and description
- Examples:
  - ✅ `TC_AUTH_044_ForgotPassword_Page_Elements`
  - ✅ `TC_AUTH_015_ResetPassword_Mismatch`
  - ✅ `TC_AUTH_001_Login_Valid_Credentials`
