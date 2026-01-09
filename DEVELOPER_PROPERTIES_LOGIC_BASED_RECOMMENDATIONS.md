# Developer Properties & Projects - Test Case Analysis & 12 New Recommendations

## Current Architecture Understanding

### Backend Data Models

**Project Model**
```
- developerId (Required) - ObjectId ref to User
- name (Required)
- description
- location
- images[] 
- status (Default: 'active')
- startDate
- expectedCompletionDate
- timestamps (createdAt, updatedAt)
```

**DeveloperProperty Model**
```
- developerId (Required) - ObjectId ref to User
- projectId (Required) - ObjectId ref to Project
- title (Required)
- description
- price (Required) - number
- listingType (Required) - enum: ['sale', 'rent']
- propertyType (Required)
- address {} - street, city, state, country, zipCode
- area {} - sqft, sqm
- features {} - bedrooms, bathrooms, garage, pool, yard, pets, furnished
- images[]
- status (Default: 'active')
- timestamps (createdAt, updatedAt)
```

### Key Business Logic

1. **Projects are tied to developers** - each project has a developerId
2. **Properties are linked to both projects AND developers** - must have both projectId and developerId
3. **Hierarchical relationship** - Project contains Properties
4. **Permission-based operations** - updateProjectForUser, deleteProjectForUser, etc. verify developer ownership
5. **Full hierarchy endpoints** - getProjectsWithPropertiesByDeveloper, getFullHierarchy
6. **Multiple query patterns**:
   - By ID
   - By Project
   - By User/Developer
   - Full hierarchy with nested data

---

## Current Test Coverage (9 Total)

### Projects Tests (6 tests)
✅ **TC_DEVPROP_001** - Create Project (Valid Data) - UI
✅ **TC_DEVPROP_003** - Get All Projects (List View) - UI
✅ **TC_DEVPROP_004** - Get Project by Valid ID
✅ **TC_DEVPROP_005** - Get Project by Invalid ID (Negative)
✅ **TC_DEVPROP_006** - Update Project (Valid Data)
✅ **TC_DEVPROP_007** - Delete Project (with property workflow)

### Properties Tests (3 tests)
✅ **TC_DEVPROP_008** - Open Project & Property from New Projects page - UI
✅ **TC_DEVPROP_012** - Get Properties by Project
✅ (Script exists: TC_Create_Property_Valid_Data, TC_DEVPROP_008_Create_Property_Valid_Data)

---

## 12 New Recommended Test Cases (Based on Backend Logic)

### **GROUP A: Developer-Scoped Operations (3 tests)**

#### 1. **TC_DEVPROP_013 - Create Project with Developer ID**
- **Description**: Verify project is created with correct developerId association
- **Focus**: Developer ownership, multi-tenant isolation
- **Business Logic Tested**:
  - `createProject({ developerId, name, description, location })`
  - Project must belong to specific developer
  - Cannot be accessed by other developers
- **Steps**:
  1. Login as Developer1
  2. Create Project A
  3. Logout, Login as Developer2
  4. Verify Developer2 cannot see Project A
  5. Create Project B
  6. Verify Projects are developer-scoped
- **Expected**:
  - Project has developerId attached
  - getProjectsByUser returns only that dev's projects
- **API Calls**: createProject, getProjectsByUser (dev1), getProjectsByUser (dev2)

#### 2. **TC_DEVPROP_014 - Update Project with Developer Permission Check**
- **Description**: Verify updateProjectForUser checks ownership before allowing update
- **Focus**: Authorization/permission verification
- **Business Logic Tested**:
  - `updateProjectForUser(userId, projectId, updateData)` 
  - Fails if userId != project.developerId
  - HTTP 404: "Project not found or you do not have permission to edit it"
- **Steps**:
  1. Dev1 creates Project A
  2. Dev2 attempts to update Project A
  3. Should fail with permission error
  4. Dev1 updates Project A
  5. Should succeed
- **Expected**:
  - Dev2 gets 404/403 error
  - Dev1 update succeeds
  - Only Dev1's version is updated

#### 3. **TC_DEVPROP_015 - Get Projects with Properties Hierarchy**
- **Description**: Verify getProjectsWithPropertiesByDeveloper returns complete hierarchy
- **Focus**: Nested data structure, relationship integrity
- **Business Logic Tested**:
  - `getProjectsWithPropertiesByDeveloper(developerId)`
  - Returns projects nested with their properties
  - Properties correctly filtered by projectId
- **Steps**:
  1. Dev1 creates Project A with 3 properties
  2. Dev1 creates Project B with 2 properties
  3. Call getProjectsWithPropertiesByDeveloper(Dev1)
  4. Verify A has 3 properties, B has 2
  5. Verify structure matches expected hierarchy
- **Expected**:
  - Correct property grouping
  - All properties belong to correct project
  - No cross-pollution between projects

---

### **GROUP B: Property-Project Relationship Tests (3 tests)**

#### 4. **TC_DEVPROP_016 - Create Property Without Valid ProjectId**
- **Description**: Verify property creation fails if projectId doesn't exist or doesn't belong to developer
- **Focus**: Referential integrity, data consistency
- **Business Logic Tested**:
  - `createPropertyForProject(userId, projectId, propertyData)`
  - Verifies: `project = await projectModel.findOne({ _id: projectId, developerId: userId })`
  - HTTP 404 if project not found OR project belongs to different developer
- **Steps**:
  1. Dev1 creates Project A
  2. Dev1 attempts to create property with:
     a) Non-existent projectId (BSON invalid)
     b) Valid but non-owned projectId (Dev2's project)
  3. Verify both fail appropriately
- **Expected**:
  - Invalid projectId: bad request or 404
  - Non-owned projectId: 404 with "you do not have permission"

#### 5. **TC_DEVPROP_017 - Update Property with Developer Permission Check**
- **Description**: Verify updatePropertyForUser enforces developer ownership
- **Focus**: Property-level authorization
- **Business Logic Tested**:
  - `updatePropertyForUser(userId, propertyId, updateData)`
  - Checks: `property = await devPropertyModel.findOne({ _id: propertyId, developerId: userId })`
  - Fails if property not owned by user
- **Steps**:
  1. Dev1 creates Project A, Property 1
  2. Dev2 attempts to update Property 1
  3. Dev1 successfully updates Property 1
  4. Dev2 creates Project C, Property 2
  5. Dev1 attempts to update Dev2's Property 2 (fails)
- **Expected**:
  - Unauthorized users get 404 with permission message
  - Authorized user update succeeds
  - Property changes persist

#### 6. **TC_DEVPROP_018 - Delete Property with Developer Verification**
- **Description**: Verify deletePropertyForUser validates ownership before deletion
- **Focus**: Safe deletion, permission checking
- **Business Logic Tested**:
  - `deletePropertyForUser(userId, propertyId)`
  - Verifies ownership before executing delete
- **Steps**:
  1. Dev1 creates Property 1
  2. Dev2 attempts to delete Property 1 (fails)
  3. Dev1 deletes Property 1 (succeeds)
  4. Verify Property 1 is gone
  5. Dev2 attempts to delete already-deleted property (fails)
- **Expected**:
  - Unauthorized deletes return 404
  - Authorized delete succeeds
  - Property count decreases
  - Re-delete fails (not found)

---

### **GROUP C: Data Validation & Required Fields (3 tests)**

#### 7. **TC_DEVPROP_019 - Create Property with Missing Required Fields**
- **Description**: Verify property creation fails when required fields missing
- **Focus**: Schema validation, data integrity
- **Required Property Fields**: title, price, listingType, propertyType, developerId, projectId
- **Steps**:
  1. Create property without title → fails
  2. Create property without price → fails
  3. Create property without listingType → fails
  4. Create property without propertyType → fails
  5. Create valid property → succeeds
- **Expected**:
  - Proper error messages for each missing field
  - No properties created without required fields
  - Valid property succeeds

#### 8. **TC_DEVPROP_020 - Create Property with Invalid ListingType Enum**
- **Description**: Verify listingType only accepts 'sale' or 'rent'
- **Focus**: Enum validation
- **Business Logic Tested**:
  - `listingType: { required: true, enum: ['sale', 'rent'] }`
- **Steps**:
  1. Create property with listingType = 'lease' (invalid)
  2. Create property with listingType = 'buy' (invalid)
  3. Create property with listingType = 'sale' (valid)
  4. Create property with listingType = 'rent' (valid)
- **Expected**:
  - Invalid enums rejected with validation error
  - Valid enums accepted
  - Proper error messaging

#### 9. **TC_DEVPROP_021 - Update Project with Partial Data (Partial Update)**
- **Description**: Verify updateProject allows partial updates without losing other fields
- **Focus**: Partial update behavior, field preservation
- **Business Logic**: `findByIdAndUpdate(id, data, { new: true, runValidators: true })`
- **Steps**:
  1. Create Project with name="A", description="B", location="C"
  2. Update only name to "X"
  3. Verify description and location unchanged
  4. Update only location to "Z"
  5. Verify name and description unchanged
- **Expected**:
  - Only specified fields updated
  - Other fields preserved
  - No null overwrites
  - Timestamps updated

---

### **GROUP D: Query & Filtering Tests (3 tests)**

#### 10. **TC_DEVPROP_022 - Get All Projects (Empty Database)**
- **Description**: Verify getAllProjects handles empty database gracefully
- **Focus**: Edge case handling, empty state
- **Business Logic Tested**:
  - `getAllProjects()` returns { status: 'success', results: 0, data: { projects: [] } }`
- **Steps**:
  1. Delete all projects from DB (setup)
  2. Call getAllProjects()
  3. Verify empty list, zero count
  4. Create 1 project
  5. Call getAllProjects()
  6. Verify count = 1
- **Expected**:
  - Empty array on empty DB
  - Results count accurate
  - Status always 'success'

#### 11. **TC_DEVPROP_023 - Get Properties by Project with Multiple Properties**
- **Description**: Verify getPropertiesByProject returns all properties for a project and correctly filters
- **Focus**: Filtering logic, population/relationships
- **Business Logic Tested**:
  - `getPropertiesByProject(projectId)` with .populate('projectId')
  - Returns only properties where property.projectId matches
- **Steps**:
  1. Create Project A, B
  2. Add 3 properties to A, 2 to B
  3. Call getPropertiesByProject(A)
  4. Verify exactly 3 returned
  5. Call getPropertiesByProject(B)
  6. Verify exactly 2 returned
  7. Call getPropertiesByProject(invalid)
  8. Verify empty or error handling
- **Expected**:
  - Correct count per project
  - No cross-project pollution
  - Proper error handling for invalid ID

#### 12. **TC_DEVPROP_024 - Get Full Hierarchy (Complete Data Dump)**
- **Description**: Verify getFullHierarchy returns all projects with nested properties for entire system
- **Focus**: Bulk operations, data structure integrity, performance awareness
- **Business Logic Tested**:
  - `getFullHierarchy()` fetches all projects and properties, maps/filters in-memory
  - Returns: `{ status: 'success', data: { projects: [...] } }`
  - Each project has `properties: []` array
- **Steps**:
  1. Create 2 developers with different projects/properties
  2. Dev1: 2 projects with 2+3 properties
  3. Dev2: 1 project with 1 property
  4. Call getFullHierarchy()
  5. Verify all 3 projects returned
  6. Verify correct property nesting
  7. Verify no data loss or duplication
  8. Compare with individual getProjectsWithPropertiesByDeveloper calls
- **Expected**:
  - All projects included
  - Correct property grouping across developers
  - Structure consistent with per-developer queries
  - No missing or duplicate records

---

## Implementation Gaps Identified

### Missing Tests for Existing Endpoints

| Endpoint | Covered | Needed Test Case |
|----------|---------|------------------|
| createProject | ✅ TC_001 | - |
| getAllProjects | ✅ TC_003 | TC_022 (empty state) |
| getProjectById | ✅ TC_004 | - |
| getProjectById (invalid) | ✅ TC_005 | - |
| getProjectsByUser | ❌ | **TC_013** |
| updateProject | ✅ TC_006 | TC_021 (partial update) |
| deleteProject | ✅ TC_007 | - |
| updateProjectForUser | ❌ | **TC_014** |
| deleteProjectForUser | ❌ | Part of TC_007 (partial) |
| createDeveloperProperty | ✅ TC_008 | - |
| getAllProperties | ❌ | - |
| getPropertyById | ❌ | - |
| updateProperty | ❌ | - |
| deleteProperty | ❌ | - |
| getPropertiesByProject | ✅ TC_012 | TC_023 (multiple) |
| createPropertyForProject | ❌ | **TC_016** |
| createPropertyForUser | ❌ | - |
| updatePropertyForUser | ❌ | **TC_017** |
| deletePropertyForUser | ❌ | **TC_018** |
| getPropertiesByUser | ❌ | - |
| getProjectsWithPropertiesByDeveloper | ❌ | **TC_015** |
| getFullHierarchy | ❌ | **TC_024** |

---

## Priority & Effort Estimation

| Priority | Test IDs | Reason |
|----------|----------|--------|
| **P0 - Critical** | 013, 014, 015 | Multi-tenant isolation & permission checks |
| **P0 - Critical** | 016, 017, 018 | Data consistency & authorization |
| **P0 - Critical** | 019, 020 | Required field & enum validation |
| **P1 - Important** | 021, 022, 023, 024 | Edge cases, filtering, hierarchy |

---

## Test Implementation Strategy

### Recommended Flow:
1. **Setup Keywords** in DeveloperProperties_Keywords.groovy:
   - getProjectsByUser(userId)
   - getPropertyByUser(userId) 
   - getProjectsWithPropertiesByDeveloper(developerId)
   - getFullHierarchy()
   - verifyPropertyBelongsToProject(propertyId, projectId)
   - verifyDeveloperOwnership(entityId, developerId, entityType)

2. **Create Test Data**:
   - Seed multiple developers with projects and properties
   - Use timestamped names to ensure uniqueness

3. **Test Execution**:
   - Login as different developers
   - Verify isolation and permission boundaries
   - Check data consistency across operations

---

## Summary Table

```
Current State: 9 test cases
- Projects: 6 tests (CRUD + list)
- Properties: 3 tests (create + view in hierarchy)

Proposed Addition: 12 test cases
- Developer-scoped ops: 3 tests
- Property-project relations: 3 tests
- Validation & required fields: 3 tests
- Query & filtering: 3 tests

Final State: 21 test cases
- Complete CRUD for Projects & Properties
- Authorization & permission checks
- Multi-tenant isolation
- Data validation & edge cases
- Complex queries & hierarchies
```

