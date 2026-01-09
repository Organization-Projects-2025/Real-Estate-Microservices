# Developer Properties & Projects - Page-Based Test Cases (12 New)

## Frontend Pages Being Tested
- **`/developer-properties`** - Public listing of all developer properties
- **`/developer-properties/[propertyId]`** - Individual property detail page
- **`/my-projects`** - User's own projects dashboard
- **`/projects/[projectId]`** - Individual project detail page
- **`/project/[projectId]/properties`** - Properties within a specific project
- **`/notifications`** - Notifications related to properties/projects

---

## Current Test Coverage (9 Existing)

✅ TC_001: Create Project (Valid Data)
✅ TC_003: Get All Projects (UI)
✅ TC_004: Get Project by Valid ID
✅ TC_005: Get Project by Invalid ID
✅ TC_006: Update Project (Valid Data)
✅ TC_007: Delete Project
✅ TC_008: Navigate to Dev Projects & Open Property
✅ TC_012: Get Properties by Project

---

## 12 New Page-Specific Test Cases

### **GROUP A: /developer-properties Page Tests (3 tests)**

#### **TC_DEVPROP_025 - Load /developer-properties Page with All Properties Listed**
- **Page**: `/developer-properties`
- **Description**: Verify developer properties listing page loads and displays all published properties
- **Prerequisites**: Properties created by at least 2 developers
- **Steps**:
  1. Navigate to `/developer-properties`
  2. Verify page loads without error
  3. Count visible property cards
  4. Verify each card displays: title, price, location, listing type (sale/rent)
  5. Verify property cards are clickable
  6. Click on a property card
  7. Verify navigation to `/developer-properties/[propertyId]`
- **Assertions**:
  - Page loads with 200 status
  - Property count > 0
  - All cards have required fields visible
  - Navigation works correctly
- **Keywords Needed**:
  - navigateToDeveloperPropertiesPage()
  - verifyPropertyCardDisplayed(propertyTitle)
  - getVisiblePropertyCount()
  - clickPropertyCard(propertyId)

#### **TC_DEVPROP_026 - Filter Properties by Listing Type on /developer-properties**
- **Page**: `/developer-properties`
- **Description**: Verify ability to filter properties by listing type (sale/rent)
- **Prerequisites**: Properties with both 'sale' and 'rent' listing types exist
- **Steps**:
  1. Navigate to `/developer-properties`
  2. Verify filter button/dropdown present
  3. Click "Sale" filter
  4. Verify only properties with listingType='sale' displayed
  5. Click "Rent" filter
  6. Verify only properties with listingType='rent' displayed
  7. Clear filters
  8. Verify all properties shown again
- **Assertions**:
  - Filter changes result set correctly
  - No wrong listing type shown
  - Filter state persists when visible
  - Clear/reset works
- **Keywords Needed**:
  - filterByListingType(type)
  - verifyAllPropertiesHaveListingType(type)
  - clearPropertyFilters()

#### **TC_DEVPROP_027 - Search Properties on /developer-properties**
- **Page**: `/developer-properties`
- **Description**: Verify search functionality filters properties by title/location
- **Prerequisites**: Properties with distinct titles and locations
- **Steps**:
  1. Navigate to `/developer-properties`
  2. Enter search term in search box (e.g., "Luxury")
  3. Verify results filtered to matching properties
  4. Verify non-matching properties hidden
  5. Clear search
  6. Verify all properties shown again
  7. Search by location
  8. Verify location-based filtering works
- **Assertions**:
  - Search updates results in real-time or after submit
  - Only matching properties shown
  - Clear search restores full list
  - Case-insensitive matching
- **Keywords Needed**:
  - searchProperties(searchTerm)
  - verifyPropertyTitleContains(searchTerm)
  - clearSearch()

---

### **GROUP B: /my-projects Page Tests (3 tests)**

#### **TC_DEVPROP_028 - Load /my-projects Dashboard with User's Projects**
- **Page**: `/my-projects`
- **Description**: Verify user sees only their own projects on My Projects page
- **Prerequisites**: Logged in as developer with 2+ projects created
- **Steps**:
  1. Login as Developer1
  2. Navigate to `/my-projects`
  3. Verify page loads
  4. Count visible project cards
  5. Verify each project card shows: name, description, properties count
  6. Verify no other developer's projects shown
  7. Click on project card
  8. Navigate to `/projects/[projectId]`
- **Assertions**:
  - Only logged-in developer's projects shown
  - Project count accurate
  - Cards display correct data
  - Navigation to detail page works
- **Keywords Needed**:
  - navigateToMyProjects()
  - getMyProjectsCount()
  - verifyProjectCard(projectName)
  - clickProjectCard(projectId)

#### **TC_DEVPROP_029 - Sort Projects on /my-projects by Name/Date**
- **Page**: `/my-projects`
- **Description**: Verify ability to sort projects by name or creation date
- **Prerequisites**: Multiple projects with different names/dates
- **Steps**:
  1. Navigate to `/my-projects`
  2. Click "Sort by Name" button
  3. Verify projects in alphabetical order (A-Z)
  4. Click "Sort by Date (Newest)"
  5. Verify newest projects appear first
  6. Click "Sort by Date (Oldest)"
  7. Verify oldest projects appear first
- **Assertions**:
  - Sort order changes correctly
  - No data loss during sorting
  - Sort persists until changed
- **Keywords Needed**:
  - sortProjectsByName(direction)
  - sortProjectsByDate(direction)
  - verifyProjectOrder(expectedOrder)

#### **TC_DEVPROP_030 - Delete Project from /my-projects Dashboard**
- **Page**: `/my-projects`
- **Description**: Verify project deletion from My Projects page with confirmation
- **Prerequisites**: User has 2+ projects
- **Steps**:
  1. Navigate to `/my-projects`
  2. Count initial projects (count1)
  3. Hover over project card
  4. Click delete/trash icon
  5. Verify confirmation dialog appears
  6. Confirm deletion
  7. Verify project removed from list
  8. Verify count = count1 - 1
  9. Refresh page
  10. Verify project still gone (persisted)
- **Assertions**:
  - Confirmation dialog shown before delete
  - Project immediately removed from UI
  - Project count decreases
  - Delete persists after refresh
- **Keywords Needed**:
  - deleteProjectFromCard(projectId)
  - confirmDeletion()
  - verifyProjectRemovedFromList(projectId)

---

### **GROUP C: /projects/[projectId] & /project/[projectId]/properties Tests (3 tests)**

#### **TC_DEVPROP_031 - View Project Details on /projects/[projectId]**
- **Page**: `/projects/[projectId]`
- **Description**: Verify project detail page displays all project information
- **Prerequisites**: Navigate to specific project ID
- **Steps**:
  1. Navigate directly to `/projects/694bd10bcfedb70dc9874085`
  2. Verify page loads without error
  3. Verify displays: name, description, location, status
  4. Verify displays: start date, expected completion date (if set)
  5. Verify displays: project image (if any)
  6. Verify displays: properties count
  7. Click "View Properties" or properties link
  8. Navigate to `/project/[projectId]/properties`
- **Assertions**:
  - All fields display correctly
  - Dates formatted properly
  - Images load without errors
  - Navigation to properties works
- **Keywords Needed**:
  - navigateToProjectDetail(projectId)
  - verifyProjectDetailField(fieldName, expectedValue)
  - verifyProjectImage()
  - navigateToProjectProperties(projectId)

#### **TC_DEVPROP_032 - View and List Properties for Project on /project/[projectId]/properties**
- **Page**: `/project/[projectId]/properties`
- **Description**: Verify properties listing within a specific project
- **Prerequisites**: Project with 2+ properties
- **Steps**:
  1. Navigate to `/project/69603ba22f8bfe8feab80156/properties`
  2. Verify page loads
  3. Verify page title shows project name
  4. Count visible property cards
  5. Verify each card shows: title, price, listing type, property type
  6. Verify "Add Property" button present
  7. Verify no properties from other projects shown
  8. Click property card
  9. Navigate to property detail
- **Assertions**:
  - Correct project properties displayed
  - No cross-project pollution
  - Add button visible and functional
  - Property count matches backend
- **Keywords Needed**:
  - navigateToProjectProperties(projectId)
  - getProjectPropertiesCount()
  - verifyPropertyBelongsToProject(propertyId, projectId)
  - verifyAddPropertyButtonVisible()

#### **TC_DEVPROP_033 - Edit Project from /projects/[projectId] Detail Page**
- **Page**: `/projects/[projectId]`
- **Description**: Verify ability to edit project details from detail page
- **Prerequisites**: Own the project being edited
- **Steps**:
  1. Navigate to own project detail `/projects/[projectId]`
  2. Click "Edit" button
  3. Verify edit form appears/modal opens
  4. Update project name to "Updated Name"
  5. Update description to "Updated Description"
  6. Click save
  7. Verify success message
  8. Verify project name updated on page
  9. Refresh page
  10. Verify changes persisted
- **Assertions**:
  - Edit form opens correctly
  - Changes save successfully
  - UI reflects updates immediately
  - Changes persist after refresh
  - Correct developer can edit own projects
- **Keywords Needed**:
  - clickEditProjectButton()
  - fillProjectEditForm(projectData)
  - saveProjectChanges()
  - verifyProjectFieldUpdated(fieldName, newValue)

---

### **GROUP D: /developer-properties/[propertyId] Detail & /notifications Tests (3 tests)**

#### **TC_DEVPROP_034 - View Property Details on /developer-properties/[propertyId]**
- **Page**: `/developer-properties/694bd060d2e9bdd6bc395a6b`
- **Description**: Verify property detail page shows complete property information
- **Prerequisites**: Property ID exists
- **Steps**:
  1. Navigate to `/developer-properties/694bd060d2e9bdd6bc395a6b`
  2. Verify page loads
  3. Verify displays: title, price, description
  4. Verify displays: listing type (sale/rent), property type
  5. Verify displays: address (street, city, state, zip)
  6. Verify displays: features (bedrooms, bathrooms, garage, etc.)
  7. Verify displays: area (sqft/sqm)
  8. Verify displays: images gallery (if present)
  9. Verify displays: developer/owner contact info
  10. Verify "Back" or "Browse Similar" navigation
- **Assertions**:
  - All property fields display
  - Images render without errors
  - Address formatted correctly
  - Features clearly listed
  - Contact info accessible
- **Keywords Needed**:
  - navigateToPropertyDetail(propertyId)
  - verifyPropertyDetailComplete()
  - verifyPropertyImages()
  - verifyFeaturesList(expectedFeatures)
  - verifyDeveloperContactInfo()

#### **TC_DEVPROP_035 - Edit Property from /developer-properties/[propertyId] (Own Property)**
- **Page**: `/developer-properties/[propertyId]` (if owner)
- **Description**: Verify property owner can edit property from detail page
- **Prerequisites**: Logged in as property owner
- **Steps**:
  1. Navigate to own property detail page
  2. Verify "Edit" button visible
  3. Click "Edit"
  4. Verify edit form appears with current values
  5. Update price from current to new amount
  6. Update description
  7. Update listing type (if allowed)
  8. Upload new image (optional)
  9. Click save
  10. Verify success message
  11. Verify property detail updated
- **Assertions**:
  - Edit button visible to owner only
  - Form pre-fills with current data
  - Changes save successfully
  - Updated data displays immediately
  - Images update if changed
- **Keywords Needed**:
  - clickEditPropertyButton()
  - fillPropertyEditForm(propertyData)
  - savePropertyChanges()
  - verifyPropertyDetailUpdated(fieldName)

#### **TC_DEVPROP_036 - View Project/Property Notifications on /notifications Page**
- **Page**: `/notifications`
- **Description**: Verify notification center displays property/project related notifications
- **Prerequisites**: Property/project activity exists (created, updated, etc.)
- **Steps**:
  1. Create a new property (triggers notification)
  2. Create a new project (triggers notification)
  3. Update a property (triggers notification)
  4. Navigate to `/notifications`
  5. Verify page loads
  6. Verify notification feed/list visible
  7. Verify property-related notifications appear
  8. Verify project-related notifications appear
  9. Click on notification
  10. Verify navigation to related property/project
  11. Mark notification as read
  12. Verify state change
- **Assertions**:
  - Notifications load and display
  - Correct icons/types shown
  - Timestamps accurate
  - Click navigates to correct resource
  - Read/unread state toggles
  - Old notifications can be cleared
- **Keywords Needed**:
  - navigateToNotifications()
  - verifyNotificationExists(type, resourceId)
  - clickNotification(notificationId)
  - markNotificationAsRead(notificationId)
  - clearNotifications()
  - getUnreadNotificationCount()

---

## Test Implementation Priority

| Priority | Test IDs | Focus Area |
|----------|----------|-----------|
| **P0 - MVP** | 025, 028, 031 | Core page loads and displays |
| **P0 - MVP** | 032, 034 | Property/project detail views |
| **P1 - Important** | 026, 027, 029 | Filtering & sorting |
| **P1 - Important** | 030, 033, 035 | Edit/delete operations |
| **P2 - Nice-to-Have** | 036 | Notifications integration |

---

## Keywords to Add/Extend

```groovy
// Page Navigation
@Keyword
def navigateToDeveloperPropertiesPage()

@Keyword
def navigateToMyProjects()

@Keyword
def navigateToProjectDetail(String projectId)

@Keyword
def navigateToProjectProperties(String projectId)

@Keyword
def navigateToPropertyDetail(String propertyId)

@Keyword
def navigateToNotifications()

// Property Listing Page
@Keyword
def getVisiblePropertyCount()

@Keyword
def filterByListingType(String type) // 'sale' or 'rent'

@Keyword
def searchProperties(String searchTerm)

@Keyword
def verifyPropertyCardDisplayed(String propertyTitle)

@Keyword
def clickPropertyCard(String propertyId)

// Project Listing Page
@Keyword
def getMyProjectsCount()

@Keyword
def sortProjectsByName(String direction) // 'asc', 'desc'

@Keyword
def sortProjectsByDate(String direction)

@Keyword
def verifyProjectCard(String projectName)

@Keyword
def clickProjectCard(String projectId)

@Keyword
def deleteProjectFromCard(String projectId)

@Keyword
def confirmDeletion()

// Project Detail Page
@Keyword
def verifyProjectDetailField(String fieldName, String expectedValue)

@Keyword
def verifyProjectImage()

@Keyword
def clickEditProjectButton()

@Keyword
def fillProjectEditForm(Map projectData)

@Keyword
def saveProjectChanges()

@Keyword
def verifyProjectFieldUpdated(String fieldName, String newValue)

// Property Detail Page
@Keyword
def verifyPropertyDetailComplete()

@Keyword
def verifyPropertyImages()

@Keyword
def verifyFeaturesList(List<String> expectedFeatures)

@Keyword
def verifyDeveloperContactInfo()

@Keyword
def clickEditPropertyButton()

@Keyword
def fillPropertyEditForm(Map propertyData)

@Keyword
def savePropertyChanges()

@Keyword
def verifyPropertyDetailUpdated(String fieldName)

// Notifications
@Keyword
def verifyNotificationExists(String type, String resourceId)

@Keyword
def clickNotification(String notificationId)

@Keyword
def markNotificationAsRead(String notificationId)

@Keyword
def clearNotifications()

@Keyword
def getUnreadNotificationCount()
```

---

## Summary

```
Total Test Cases: 21 (9 existing + 12 new)

Breakdown by Feature:
- /developer-properties listing: 3 tests (025-027)
- /my-projects dashboard: 3 tests (028-030)
- /projects/[id] detail: 3 tests (031, 033)
- /project/[id]/properties: 1 test (032)
- /developer-properties/[id] detail: 2 tests (034-035)
- /notifications page: 1 test (036)

Focus Areas:
✅ Page Load & Display
✅ Navigation Between Pages
✅ Filtering & Sorting
✅ CRUD Operations (Create, Read, Update, Delete)
✅ User Isolation (own projects/properties only)
✅ Notifications Integration
✅ Form Validation & Submission
✅ Data Persistence
```

