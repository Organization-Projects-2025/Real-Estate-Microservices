# Real Estate Microservices - Automation Testing Strategy with Katalon Studio

## 1. TEST STRATEGY OVERVIEW

### 1.1 Testing Objectives

- **Functional Testing**: V, Developer, Agent, User) can perform intended operationserify all user roles (Admin
- **Authorization Testing**: Ensure role-based access control is properly enforced
- **Workflow Testing**: Test end-to-end user journeys (login → browse → save → review)
- **Data Integrity**: Verify CRUD operations across microservices
- **Cross-browser Compatibility**: Test on Chrome, Firefox, Edge
- **Performance Testing**: Validate response times and concurrent user handling

### 1.2 Scope

**In Scope:**

- ✅ Frontend UI (React application on port 5173)
- ✅ User authentication workflows
- ✅ Property browsing and filtering
- ✅ Role-based dashboards (Admin, Developer, Agent, User)
- ✅ CRUD operations for properties and projects
- ✅ Review and rating system
- ✅ Developer properties management
- ✅ Agent listing management

**Out of Scope:**

- ❌ Microservices unit tests (handled by backend team)
- ❌ API integration tests (separate service testing)
- ❌ Database layer testing

### 1.3 Tools & Environment

| Component           | Tool                            | Details                         |
| ------------------- | ------------------------------- | ------------------------------- |
| **Test Automation** | Katalon Studio                  | Web UI automation               |
| **Test Management** | Katalon TestCloud               | Test execution & reporting      |
| **Browser**         | Chrome, Firefox, Edge           | Cross-browser testing           |
| **Frontend URL**    | http://localhost:5173           | Local environment               |
| **Test Data**       | Seeded users in ACCESS_GUIDE.md | Pre-configured test credentials |
| **Reporting**       | Katalon Reports                 | HTML reports with screenshots   |

### 1.4 Test Environment Setup

```
Frontend: http://localhost:5173
API Gateway: http://localhost:3000
Browser: Chrome (primary), Firefox, Edge
Database: MongoDB (localhost:27017)
Test Users: Provided in ACCESS_GUIDE.md
```

---

## 2. TEST PLAN & SCHEDULE

### 2.1 Testing Phases

| Phase                                 | Duration | Activities                                          | Responsible                   |
| ------------------------------------- | -------- | --------------------------------------------------- | ----------------------------- |
| **Phase 1: Setup & Framework**        | Week 1   | Katalon project setup, Object repo, Test data setup | Tech Lead                     |
| **Phase 2: Core Workflows**           | Week 2-3 | Login, Navigation, Property CRUD                    | QA Lead + Team Member 1       |
| **Phase 3: Role-Based Features**      | Week 3-4 | Admin dashboard, Developer panel, Agent portal      | QA Lead + Team Member 2       |
| **Phase 4: Advanced Features**        | Week 4-5 | Reviews, Filters, Search, Notifications             | Team Member 1 + Team Member 2 |
| **Phase 5: Integration & Regression** | Week 5-6 | Cross-browser, End-to-end workflows, Regression     | All team members              |
| **Phase 6: Bug Fix Verification**     | Week 6-7 | Retest defects, Final execution                     | QA Lead                       |

### 2.2 Testing Schedule

```
Total Testing Duration: 6-7 weeks
Test Case Development: 2 weeks (parallel with Phase 1)
Test Execution: 4-5 weeks
Buffer: 1 week for regression and defect retesting
```

### 2.3 Success Criteria

- ✅ 90% test pass rate minimum
- ✅ 0 critical/blocker defects in production
- ✅ All user workflows tested (login → action → logout)
- ✅ All 4 user roles tested independently
- ✅ Cross-browser compatibility verified
- ✅ Response time < 3 seconds for page loads
- ✅ All test cases documented with evidence

---

## 3. TEST SCENARIOS & CASE DISTRIBUTION

### 3.1 Core Test Scenarios (43 Test Cases)

#### **Scenario Group A: Authentication & Authorization (8 cases)**

| TC ID   | Test Case                              | Type       | Owner         |
| ------- | -------------------------------------- | ---------- | ------------- |
| TC_A001 | Admin login with valid credentials     | Functional | Tech Lead     |
| TC_A002 | Developer login with valid credentials | Functional | Tech Lead     |
| TC_A003 | Agent login with valid credentials     | Functional | Team Member 1 |
| TC_A004 | User login with valid credentials      | Functional | Team Member 1 |
| TC_A005 | Login with invalid password            | Negative   | Tech Lead     |
| TC_A006 | Login with non-existent email          | Negative   | Tech Lead     |
| TC_A007 | User registration with valid data      | Functional | Team Member 2 |
| TC_A008 | Forgot password workflow               | Functional | Team Member 2 |

#### **Scenario Group B: Navigation & UI (7 cases)**

| TC ID   | Test Case                                | Type        | Owner         |
| ------- | ---------------------------------------- | ----------- | ------------- |
| TC_B001 | Navigation bar renders correctly         | Functional  | Team Member 1 |
| TC_B002 | Home page loads with featured properties | Functional  | Team Member 1 |
| TC_B003 | Properties page displays all listings    | Functional  | Team Member 2 |
| TC_B004 | Sidebar functionality for filters        | Functional  | Team Member 2 |
| TC_B005 | Responsive design (mobile view)          | Functional  | Team Member 1 |
| TC_B006 | Page transitions are smooth              | Performance | Team Member 2 |
| TC_B007 | Broken links detection                   | Functional  | Tech Lead     |

#### **Scenario Group C: Property Management (10 cases)**

| TC ID   | Test Case                                      | Type       | Owner         |
| ------- | ---------------------------------------------- | ---------- | ------------- |
| TC_C001 | View all properties (user role)                | Functional | Team Member 1 |
| TC_C002 | Search properties by location                  | Functional | Team Member 1 |
| TC_C003 | Filter properties by price range               | Functional | Team Member 2 |
| TC_C004 | Filter properties by type (Rent/Buy/Sell)      | Functional | Team Member 2 |
| TC_C005 | View property details page                     | Functional | Team Member 1 |
| TC_C006 | Save property to favorites                     | Functional | Team Member 2 |
| TC_C007 | Sort properties by price/date                  | Functional | Team Member 1 |
| TC_C008 | Pagination on properties list                  | Functional | Team Member 2 |
| TC_C009 | Developer: Create new property project         | Functional | Tech Lead     |
| TC_C010 | Developer: Edit own property (ownership check) | Functional | Tech Lead     |

#### **Scenario Group D: Developer Features (8 cases)**

| TC ID   | Test Case                               | Type       | Owner         |
| ------- | --------------------------------------- | ---------- | ------------- |
| TC_D001 | Access Developer Dashboard              | Functional | Team Member 1 |
| TC_D002 | Create new project                      | Functional | Team Member 1 |
| TC_D003 | View all developer projects             | Functional | Team Member 2 |
| TC_D004 | Edit own project (success)              | Functional | Team Member 2 |
| TC_D005 | Cannot edit other developer's project   | Negative   | Tech Lead     |
| TC_D006 | Delete own project (success)            | Functional | Team Member 1 |
| TC_D007 | Cannot delete other developer's project | Negative   | Tech Lead     |
| TC_D008 | View project properties details         | Functional | Team Member 2 |

#### **Scenario Group E: Admin Dashboard (6 cases)**

| TC ID   | Test Case                               | Type          | Owner         |
| ------- | --------------------------------------- | ------------- | ------------- |
| TC_E001 | Admin dashboard access (admin only)     | Authorization | Tech Lead     |
| TC_E002 | Non-admin cannot access admin dashboard | Negative      | Tech Lead     |
| TC_E003 | View and manage users                   | Functional    | Team Member 1 |
| TC_E004 | View and manage properties              | Functional    | Team Member 1 |
| TC_E005 | View and manage reviews                 | Functional    | Team Member 2 |
| TC_E006 | View dashboard analytics                | Functional    | Team Member 2 |

#### **Scenario Group F: Reviews & Ratings (4 cases)**

| TC ID   | Test Case                            | Type       | Owner         |
| ------- | ------------------------------------ | ---------- | ------------- |
| TC_F001 | User can write review for property   | Functional | Team Member 1 |
| TC_F002 | User can rate property (1-5 stars)   | Functional | Team Member 1 |
| TC_F003 | View reviews on property detail page | Functional | Team Member 2 |
| TC_F004 | Admin can manage/delete reviews      | Functional | Team Member 2 |

---

## 4. TASK DISTRIBUTION AMONG TEAM MEMBERS

### 4.1 Team Composition (Suggested: 3-4 members)

#### **Role 1: QA Lead / Tech Lead** (1 person)

- **Responsibilities**:

  - Setup Katalon project and Object Repository
  - Create reusable test utilities and custom keywords
  - Develop test data framework
  - Review test cases and code quality
  - Manage defect triage and prioritization
  - Generate final reports

- **Assigned Test Cases**: TC_A001, TC_A002, TC_A005, TC_A006, TC_B007, TC_C009, TC_C010, TC_D005, TC_D007, TC_E001, TC_E002
- **Timeline**: Week 1 setup + execution support
- **Deliverables**: Test framework, Object Repository, Test utilities

---

#### **Role 2: QA Engineer 1 (Mid-level)** (1 person)

- **Responsibilities**:

  - Create test cases for authentication and basic workflows
  - Execute Property Management test cases
  - Cross-browser testing (Chrome & Firefox)
  - Document test execution results
  - Participate in defect verification

- **Assigned Test Cases**: TC_A003, TC_A007, TC_B001, TC_B002, TC_B005, TC_B006, TC_C001, TC_C002, TC_C005, TC_C007, TC_D001, TC_D002, TC_F001, TC_F002
- **Timeline**: Week 2-6
- **Deliverables**: Test scripts, execution reports, bug reports

---

#### **Role 3: QA Engineer 2 (Mid-level)** (1 person)

- **Responsibilities**:

  - Create test cases for filtering and navigation
  - Execute Developer and Admin feature test cases
  - Mobile responsiveness testing
  - Data validation testing
  - Support regression testing

- **Assigned Test Cases**: TC_A004, TC_A008, TC_B003, TC_B004, TC_C003, TC_C004, TC_C006, TC_C008, TC_D003, TC_D004, TC_D006, TC_D008, TC_E003, TC_E004, TC_F003, TC_F004
- **Timeline**: Week 2-6
- **Deliverables**: Test scripts, execution reports, automation results

---

#### **Role 4: Test Automation Support (Optional)** (1 person - if available)

- **Responsibilities**:
  - Maintain test data and seeded accounts
  - CI/CD pipeline integration setup
  - Test execution scheduling
  - Performance baseline measurements
  - Documentation review

---

### 4.2 Weekly Task Allocation

#### **Week 1: Setup & Framework**

```
QA Lead:
  - Setup Katalon project structure
  - Create Object Repository for all pages
  - Develop custom keywords for common actions
  - Create test data management functions
  - Setup test execution framework

QA Engineer 1:
  - Assist with Object Repository creation
  - Create reusable test libraries
  - Setup test environment configuration

QA Engineer 2:
  - Prepare test data (user accounts, test properties)
  - Create test case templates
  - Setup reporting structure
```

#### **Week 2-3: Core Test Case Development & Execution**

```
QA Lead:
  - Review test case specifications
  - Mentor team on Katalon best practices
  - Execute authorization test cases (TC_A*, TC_E001, TC_E002)
  - Support complex test case creation

QA Engineer 1:
  - Develop TC_A001-A004 test scripts
  - Execute TC_B001-B002 tests
  - Develop TC_C001-C002 test scripts
  - Execute property view test cases

QA Engineer 2:
  - Develop TC_A007-A008 test scripts
  - Develop TC_B003-B004 test scripts
  - Support TC_C003-C004 development
  - Execute filter/search tests
```

#### **Week 4-5: Advanced Features & Role-Based Testing**

```
QA Lead:
  - Execute Developer authorization tests (TC_D005, TC_D007)
  - Execute Admin tests (TC_E001-E006)
  - Refactor test cases based on findings
  - Start defect analysis

QA Engineer 1:
  - Execute Developer feature tests (TC_D001-D002)
  - Develop Review test cases (TC_F001-F002)
  - Execute review tests
  - Performance testing for loaded pages

QA Engineer 2:
  - Execute Developer ownership tests (TC_D003-D008)
  - Develop Admin test cases (TC_E003-E006)
  - Execute admin panel tests
  - Mobile responsiveness testing
```

#### **Week 6-7: Regression & Final Execution**

```
QA Lead:
  - Review and triage all defects
  - Create defect summary report
  - Execute final regression test suite
  - Prepare test summary report

QA Engineer 1:
  - Regression testing (selected critical cases)
  - Verify bug fixes
  - Cross-browser final pass

QA Engineer 2:
  - Regression testing (selected critical cases)
  - Mobile final verification
  - Data cleanup and test evidence collection
```

---

## 5. KATALON STUDIO PROJECT STRUCTURE

### 5.1 Recommended Directory Structure

```
Real-Estate-Automation/
├── Object Repository/
│   ├── Authentication/
│   │   ├── LoginPage.rs
│   │   ├── RegisterPage.rs
│   │   └── ForgotPasswordPage.rs
│   ├── HomePage/
│   │   ├── Navbar.rs
│   │   ├── FeaturedProperties.rs
│   │   └── Sidebar.rs
│   ├── Properties/
│   │   ├── PropertiesPage.rs
│   │   ├── PropertyCard.rs
│   │   ├── PropertyDetail.rs
│   │   └── PropertyFilters.rs
│   ├── Dashboard/
│   │   ├── AdminDashboard.rs
│   │   ├── DeveloperDashboard.rs
│   │   ├── AgentDashboard.rs
│   │   └── UserProfile.rs
│   ├── Reviews/
│   │   ├── ReviewForm.rs
│   │   └── ReviewsList.rs
│   └── Common/
│       ├── Navigation.rs
│       └── GlobalElements.rs
│
├── Test Cases/
│   ├── Authentication/
          Login/
            Positive/
              ValidLogin
            Negative/
              LoginWithoutPassword
              LoginWithInvalidEmail

          Signup/
│   │   ├── TC_A001_AdminLogin
│   │   ├── TC_A002_DeveloperLogin
│   │   ├── TC_A005_InvalidPassword
│   │   └── TC_A007_RegisterNewUser
│   ├── PropertyManagement/
│   │   ├── TC_C001_ViewAllProperties
│   │   ├── TC_C002_SearchProperties
│   │   └── ...
│   ├── DeveloperFeatures/
│   │   ├── TC_D001_AccessDeveloperDashboard
│   │   ├── TC_D002_CreateNewProject
│   │   └── ...
│   └── AdminDashboard/
│       ├── TC_E001_AccessAdminDashboard
│       ├── TC_E003_ManageUsers
│       └── ...
│
├── Test Suites/
│   ├── Smoke_Test_Suite.ts
│   ├── Authentication_Test_Suite.ts
│   ├── PropertyManagement_Test_Suite.ts
│   ├── RoleBasedFeatures_Test_Suite.ts
│   └── Regression_Test_Suite.ts
│
├── Keywords/
│   ├── Common/
│   │   ├── Login_Keywords.groovy
│   │   ├── Navigation_Keywords.groovy
│   │   └── Verification_Keywords.groovy
│   ├── Property/
│   │   ├── Property_Keywords.groovy
│   │   └── Filter_Keywords.groovy
│   └── Admin/
│       └── AdminDashboard_Keywords.groovy
│
├── Test Data/
│   ├── UserCredentials.xlsx
│   ├── PropertyTestData.xlsx
│   ├── TestConfig.properties
│   └── GlobalVariables.groovy
│
└── Reports/
    ├── Execution_Report_Week1.html
    ├── Defect_Report.html
    └── Summary_Report.html
```

### 5.2 Test Data (UserCredentials.xlsx)

```
Role          | Email                    | Password       | Expected Access
Admin         | admin@realestate.com     | Password123!   | Admin Dashboard
Developer 1   | developer1@realestate.com| Password123!   | Dev Dashboard
Developer 2   | developer2@realestate.com| Password123!   | Dev Dashboard
Agent 1       | agent1@realestate.com    | Password123!   | Agent Portal
Agent 2       | agent2@realestate.com    | Password123!   | Agent Portal
User 1        | user1@realestate.com     | Password123!   | Browse Properties
User 2        | user2@realestate.com     | Password123!   | Browse Properties
```

---

## 6. KATALON STUDIO BEST PRACTICES

### 6.1 Object Identification Strategy

```groovy
// Use Xpath selectors with readable naming
// Example for Login Button
<button class="btn-primary" data-testid="login-submit">Login</button>

// Katalon Object Repository entry:
<Locator Strategy="XPATH">
  <Value>//button[@data-testid='login-submit']</Value>
</Locator>
```

### 6.2 Custom Keyword Example

```groovy
// Keywords/Common/Login_Keywords.groovy

@Keyword
def loginUser(String email, String password) {
    WebUI.openBrowser('')
    WebUI.navigateToUrl('http://localhost:5173')
    WebUI.setText(findTestObject('Object Repository/Authentication/LoginPage', 'emailInput'), email)
    WebUI.setText(findTestObject('Object Repository/Authentication/LoginPage', 'passwordInput'), password)
    WebUI.click(findTestObject('Object Repository/Authentication/LoginPage', 'loginButton'))
    WebUI.waitForPageLoad(30)
}

@Keyword
def verifyUserLoggedIn(String userName) {
    WebUI.waitForElementPresent(findTestObject('Object Repository/Common', 'userProfileMenu'), 10)
    String displayedName = WebUI.getText(findTestObject('Object Repository/Common', 'userNameLabel'))
    assert displayedName.contains(userName), "User not logged in correctly"
}
```

### 6.3 Test Case Template

```groovy
// Test Cases/Authentication/TC_A001_AdminLogin

import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI

/**
 * Test Case: Admin Login with Valid Credentials
 * Purpose: Verify admin user can successfully login
 * Precondition: Admin account exists with email admin@realestate.com
 * Expected Result: Admin is redirected to home page with navbar showing admin menu
 */

// Setup
WebUI.openBrowser('')

// Login
CustomKeywords.'Login_Keywords.loginUser'('admin@realestate.com', 'Password123!')

// Verify
WebUI.verifyElementVisible(findTestObject('Object Repository/AdminDashboard/adminMenuButton'))
WebUI.verifyTextPresent('Dashboard', false)

// Teardown
WebUI.closeBrowser()
```

---

## 7. DEFECT MANAGEMENT

### 7.1 Defect Triage Matrix

| Severity     | Priority | Impact                            | Response Time |
| ------------ | -------- | --------------------------------- | ------------- |
| **Critical** | P0       | Feature completely non-functional | 24 hours      |
| **High**     | P1       | Feature partially broken          | 48 hours      |
| **Medium**   | P2       | Feature works with workaround     | 1 week        |
| **Low**      | P3       | Cosmetic/minor issues             | 2 weeks       |

### 7.2 Sample Bug Report Template

```markdown
### BUG REPORT

**Bug ID**: BUG_001
**Title**: Admin cannot access Admin Dashboard
**Severity**: Critical
**Priority**: P0
**Status**: Open

**Test Case**: TC_E001_AccessAdminDashboard
**Environment**: Windows 10, Chrome 120, http://localhost:5173
**Date Found**: [Date]

**Steps to Reproduce:**

1. Login with admin@realestate.com / Password123!
2. Click "Admin Dashboard" button in navbar
3. Expected: Redirect to /admin
4. Actual: Error 403 Forbidden displayed

**Expected Result:**
Admin Dashboard page loads with analytics and user management options

**Actual Result:**
Error message: "Access Denied - You do not have permission to access this resource"

**Screenshots:**
[Attach screenshot of error]

**Root Cause**:
AdminGuard not properly checking user role in protected route

**Assigned To**: Backend Developer
**Deadline**: [Date]
**Resolution**: [Will be filled after fix]
```

---

## 8. TEST EXECUTION & REPORTING

### 8.1 Test Execution Reports

```html
<!-- Generated by Katalon -->
Test Suite: Authentication_Test_Suite Execution Date: [Date] Execution Time: 2
hours 15 minutes Total Test Cases: 8 Passed: 7 (87.5%) Failed: 1 (12.5%)
Skipped: 0 Failed Case: TC_A005_InvalidPassword Error: Exception occurred in
step 'Click login button' Screenshot: [Attached]
```

### 8.2 Weekly Status Report Template

```markdown
## TESTING STATUS REPORT - Week 2

### Executive Summary

- Total Test Cases Planned: 43
- Test Cases Executed: 18 (42%)
- Pass Rate: 89%
- Critical Issues: 1
- High Priority Issues: 2

### Completed Tasks

✅ Setup Katalon project structure
✅ Created Object Repository (Authentication & Navigation)
✅ Developed 8 custom keywords
✅ Executed Authentication test suite (8 cases, 7 passed)

### Upcoming Tasks

- [ ] Develop Property Management test cases (Week 3)
- [ ] Execute Developer Features tests
- [ ] Regression testing for Week 2 fixes

### Issues Found

- 1 Critical: Login redirect issue (assigned to Backend)
- 2 High: Filter dropdown not working on Safari
- 3 Medium: Text alignment issues on mobile

### Resource Utilization

- QA Lead: 40 hours (on track)
- QA Engineer 1: 38 hours (on track)
- QA Engineer 2: 35 hours (on track)

### Next Steps

- Daily standup meetings at 9:00 AM
- Weekly review meeting on Friday 3:00 PM
```

### 8.3 Test Summary Report Template

```markdown
# TEST SUMMARY REPORT

## Project: Real Estate Microservices Automation Testing

## Period: Week 1-7

## Prepared By: QA Lead

### Test Execution Summary

| Metric           | Value      |
| ---------------- | ---------- |
| Total Test Cases | 43         |
| Executed         | 43 (100%)  |
| Passed           | 39 (90.7%) |
| Failed           | 4 (9.3%)   |
| Pass Rate        | 90.7% ✅   |

### Test Coverage by Module

| Module         | Test Cases | Pass | Fail | Coverage |
| -------------- | ---------- | ---- | ---- | -------- |
| Authentication | 8          | 8    | 0    | 100% ✅  |
| Navigation     | 7          | 6    | 1    | 85.7%    |
| Properties     | 10         | 9    | 1    | 90%      |
| Developer      | 8          | 7    | 1    | 87.5%    |
| Admin          | 6          | 6    | 0    | 100% ✅  |
| Reviews        | 4          | 3    | 1    | 75%      |

### Defects Summary

- **Critical**: 0
- **High**: 2 (In Progress)
- **Medium**: 3 (Open)
- **Low**: 2 (Open)

### Browser Compatibility

| Browser     | Status    | Issues    |
| ----------- | --------- | --------- |
| Chrome 120  | ✅ Passed | None      |
| Firefox 121 | ✅ Passed | Minor CSS |
| Edge 121    | ✅ Passed | None      |

### Recommendations

1. Implement more explicit waits for dynamic content loading
2. Enhance object locators for better stability
3. Increase test data variety for negative scenarios
4. Setup automated regression suite to run daily

### Sign-Off

- QA Lead: [Signature] Date: [Date]
- Project Manager: [Signature] Date: [Date]
```

---

## 9. DOCUMENTATION REQUIREMENTS

### 9.1 Test Case Documentation Template

```markdown
## Test Case: TC_C002_SearchProperties

**ID**: TC_C002
**Title**: Search properties by location
**Type**: Functional Testing
**Priority**: High
**Status**: Ready for Execution

### Preconditions

- User is logged in
- At least 10 properties exist in database
- User is on Properties page

### Test Steps

| Step | Action                   | Input                     | Expected Result                   |
| ---- | ------------------------ | ------------------------- | --------------------------------- |
| 1    | Launch application       | N/A                       | Home page loads                   |
| 2    | Navigate to Properties   | Click "Browse Properties" | Properties listing page displayed |
| 3    | Enter location in search | "New York"                | Search field populated            |
| 4    | Click search button      | N/A                       | Results filtered by location      |
| 5    | Verify results           | N/A                       | Only NY properties displayed      |

### Expected Result

- Properties filtered to show only items in "New York"
- Result count updated
- Pagination adjusted accordingly

### Actual Result

[To be filled during execution]

### Status

Pass / Fail / Blocked

### Test Evidence

- Screenshot: [file name]
- Video: [file name]
- Execution Time: [duration]

### Notes

[Any additional observations]
```

### 9.2 Katalon User Manual

````markdown
## How to Run Tests in Katalon Studio

### 1. Project Setup

- Install Katalon Studio (v9.0+)
- Open project: Real-Estate-Automation.prj
- All object repositories and scripts included

### 2. Configure Environment

- Update baseUrl in GlobalVariables.groovy
  ```groovy
  baseUrl = 'http://localhost:5173'
  adminEmail = 'admin@realestate.com'
  adminPassword = 'Password123!'
  ```
````

### 3. Run Individual Test Case

1. Right-click on test case → Run → Run with Katalon Studio
2. View execution in Execution Console
3. Check results in Reports folder

### 4. Run Test Suite

1. Double-click Test Suite file (e.g., Smoke_Test_Suite.ts)
2. Click Play button
3. Monitor progress in real-time
4. Results auto-saved to Reports

### 5. Run via Command Line

```bash
katalon -noSplash -runMode=console \
  -projectPath=".\Real-Estate-Automation.prj" \
  -testSuitePath="Test Suites/Authentication_Test_Suite" \
  -browserType=Chrome
```

### 6. View Reports

- Navigate to: Reports folder
- Open latest .html file in browser
- Export as PDF for stakeholders

### 7. Troubleshooting

- Object not found: Update Object Repository
- Timeout errors: Increase wait times in GlobalVariables
- Login fails: Verify test account credentials

```

---

## 10. IMPLEMENTATION TIMELINE

### Week 1: Foundations
- ✅ Team kickoff and role assignments
- ✅ Katalon project structure setup
- ✅ Object Repository creation (30% complete)
- ✅ Custom keywords framework (50% complete)
- ✅ Test data preparation (80% complete)

### Week 2-3: Development & Initial Execution
- ✅ Complete Object Repository (100%)
- ✅ Develop test cases: Auth, Navigation, Basic Properties
- ✅ Execute Smoke Test Suite
- ✅ Begin defect logging

### Week 4-5: Advanced Testing
- ✅ Develop role-based feature tests
- ✅ Execute Developer & Admin tests
- ✅ Cross-browser testing starts
- ✅ Defect triage and prioritization

### Week 6-7: Regression & Finalization
- ✅ Regression testing
- ✅ Bug fix verification
- ✅ Final execution passes
- ✅ Report generation and sign-off

---

## 11. SUCCESS METRICS

### Target Metrics
| Metric | Target | Status |
|--------|--------|--------|
| Test Coverage | > 90% | TBD |
| Pass Rate | > 90% | TBD |
| Critical Bugs | 0 | TBD |
| Test Automation Efficiency | 80% | TBD |
| Defect Detection Rate | > 85% | TBD |

### Quality Gates
- ✅ All critical test cases must pass
- ✅ No unresolved critical defects
- ✅ 90%+ pass rate achieved
- ✅ All deliverables completed and documented
- ✅ Team sign-off obtained

---

## QUICK REFERENCE - TEAM RESPONSIBILITIES

### 🎯 QA Lead / Tech Lead
```

Week 1: Framework setup, mentoring
Week 2-7: Oversee execution, defect triage, final reports
Focus: Quality, consistency, deliverables

```

### 👨‍💻 QA Engineer 1
```

Week 2-3: Auth & property tests
Week 4-5: Developer features, reviews
Week 6-7: Regression testing
Focus: Core workflows, cross-browser

```

### 👨‍💻 QA Engineer 2
```

Week 2-3: Navigation & filters
Week 4-5: Admin dashboard, advanced features
Week 6-7: Mobile testing, regression
Focus: Edge cases, negative scenarios

```

---

## CONTACT & ESCALATION

- **QA Lead** (Framework issues, escalations): [Name]
- **Team Member 1** (Execution support): [Name]
- **Team Member 2** (Test data, environment): [Name]
- **Daily Standup**: 9:00 AM
- **Weekly Review**: Friday 3:00 PM

---

**Document Version**: 1.0
**Last Updated**: [Current Date]
**Next Review**: End of Week 1
```
