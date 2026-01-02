# Developer Properties Microservice - Test Implementation Guide

## Overview
This document provides a comprehensive guide for the test implementation of the Developer Properties microservice in Katalon Studio. The test suite covers all CRUD operations for Projects, Developer Properties, and Developers, along with integration scenarios.

## Naming Convention
Following the same naming convention as the Authentication module:
- **Test Cases**: `TC_DEVPROP_XXX_Description_With_Underscores`
- **Sequential numbering**: 001, 002, 003, etc.
- **Clear descriptive names** with underscores
- **Consistent tagging** with module, component, and test type

## Test Structure

### 1. Object Repository Structure
```
Object Repository/
└── DeveloperProperties/
    ├── API_Endpoints.rs (Base API configuration)
    ├── Projects/
    │   ├── Create_Project.rs
    │   ├── Get_All_Projects.rs
    │   ├── Get_Project_By_Id.rs
    │   ├── Update_Project.rs
    │   └── Delete_Project.rs
    ├── Properties/
    │   ├── Create_Developer_Property.rs
    │   ├── Get_All_Developer_Properties.rs
    │   ├── Get_Developer_Property_By_Id.rs
    │   └── (Additional property endpoints)
    └── Developers/
        ├── Get_All_Developers.rs
        └── Get_Developer_By_Valid_Id.rs
```

### 2. Keywords Structure
```
Keywords/
└── developerproperties/
    └── DeveloperProperties_Keywords.groovy
```

**Key Functions Available:**
- `generateProjectTestData()` - Creates test data for projects
- `generatePropertyTestData()` - Creates test data for properties
- `generateDeveloperTestData()` - Creates test data for developers
- `validateApiResponse()` - Validates API response structure
- `extractIdFromResponse()` - Extracts entity IDs from responses
- `validatePropertyData()` - Validates property data structure
- `validateProjectData()` - Validates project data structure
- `generateBulkTestData()` - Creates bulk test data
- `cleanupTestData()` - Cleanup utility for test data

### 3. Test Cases Structure (Following Authentication Naming Convention)
```
Test Cases/
└── DeveloperProperties/
    ├── Projects/
    │   ├── TC_DEVPROP_001_Create_Project_Valid_Data.tc
    │   ├── TC_DEVPROP_002_Create_Project_Invalid_Data.tc
    │   ├── TC_DEVPROP_003_Get_All_Projects.tc
    │   ├── TC_DEVPROP_004_Get_Project_By_Valid_Id.tc
    │   ├── TC_DEVPROP_005_Get_Project_By_Invalid_Id.tc
    │   ├── TC_DEVPROP_006_Update_Project_Valid_Data.tc
    │   └── TC_DEVPROP_007_Delete_Project_Valid_Id.tc
    ├── Properties/
    │   ├── TC_DEVPROP_008_Create_Property_Valid_Data.tc
    │   ├── TC_DEVPROP_009_Create_Property_Invalid_Data.tc
    │   ├── TC_DEVPROP_010_Get_All_Properties.tc
    │   ├── TC_DEVPROP_011_Get_Property_By_Valid_Id.tc
    │   ├── TC_DEVPROP_012_Get_Properties_By_Project.tc
    │   └── TC_DEVPROP_013_Get_Properties_By_User.tc
    ├── Developers/
    │   ├── TC_DEVPROP_014_Get_All_Developers.tc
    │   └── TC_DEVPROP_015_Get_Developer_By_Valid_Id.tc
    └── Integration/
        ├── TC_DEVPROP_016_Full_Hierarchy_Retrieval.tc
        ├── TC_DEVPROP_017_Projects_With_Properties_By_Developer.tc
        └── TC_DEVPROP_018_Create_Project_And_Property_Workflow.tc
```

## Test Case Numbering System

### Projects (TC_DEVPROP_001 - TC_DEVPROP_007)
- **TC_DEVPROP_001** - Create Project Valid Data
- **TC_DEVPROP_002** - Create Project Invalid Data  
- **TC_DEVPROP_003** - Get All Projects
- **TC_DEVPROP_004** - Get Project By Valid Id
- **TC_DEVPROP_005** - Get Project By Invalid Id
- **TC_DEVPROP_006** - Update Project Valid Data
- **TC_DEVPROP_007** - Delete Project Valid Id

### Properties (TC_DEVPROP_008 - TC_DEVPROP_013)
- **TC_DEVPROP_008** - Create Property Valid Data
- **TC_DEVPROP_009** - Create Property Invalid Data
- **TC_DEVPROP_010** - Get All Properties
- **TC_DEVPROP_011** - Get Property By Valid Id
- **TC_DEVPROP_012** - Get Properties By Project
- **TC_DEVPROP_013** - Get Properties By User

### Developers (TC_DEVPROP_014 - TC_DEVPROP_015)
- **TC_DEVPROP_014** - Get All Developers
- **TC_DEVPROP_015** - Get Developer By Valid Id

### Integration (TC_DEVPROP_016 - TC_DEVPROP_018)
- **TC_DEVPROP_016** - Full Hierarchy Retrieval
- **TC_DEVPROP_017** - Projects With Properties By Developer
- **TC_DEVPROP_018** - Create Project And Property Workflow

## API Endpoints Covered

### Project Endpoints
- **POST** `/api/developer-properties/projects` - Create project
- **GET** `/api/developer-properties/projects` - Get all projects
- **GET** `/api/developer-properties/projects/{id}` - Get project by ID
- **PUT** `/api/developer-properties/projects/{id}` - Update project
- **DELETE** `/api/developer-properties/projects/{id}` - Delete project
- **GET** `/api/developer-properties/projects/user/{userId}` - Get projects by user

### Developer Property Endpoints
- **POST** `/api/developer-properties/properties` - Create property
- **GET** `/api/developer-properties/properties` - Get all properties
- **GET** `/api/developer-properties/properties/{id}` - Get property by ID
- **PUT** `/api/developer-properties/properties/{id}` - Update property
- **DELETE** `/api/developer-properties/properties/{id}` - Delete property
- **GET** `/api/developer-properties/properties/project/{projectId}` - Get properties by project
- **GET** `/api/developer-properties/properties/user/{userId}` - Get properties by user

### Developer Endpoints
- **GET** `/api/developer-properties/developers` - Get all developers
- **GET** `/api/developer-properties/developers/{id}` - Get developer by ID
- **PUT** `/api/developer-properties/developers/{id}` - Update developer
- **DELETE** `/api/developer-properties/developers/{id}` - Delete developer

### Integration Endpoints
- **GET** `/api/developer-properties/hierarchy` - Get full hierarchy
- **GET** `/api/developer-properties/developer/{id}/projects-with-properties` - Get projects with properties by developer

## Test Data Models

### Project Model
```json
{
  "name": "string (required)",
  "description": "string",
  "location": "string",
  "developerId": "ObjectId (required)",
  "status": "string (default: active)",
  "startDate": "Date",
  "expectedCompletionDate": "Date"
}
```

### Developer Property Model
```json
{
  "developerId": "ObjectId (required)",
  "projectId": "ObjectId (required)",
  "title": "string (required)",
  "description": "string",
  "price": "number (required)",
  "listingType": "string (required: sale|rent)",
  "propertyType": "string (required)",
  "address": {
    "street": "string",
    "city": "string",
    "state": "string",
    "country": "string",
    "zipCode": "string"
  },
  "area": {
    "sqft": "number",
    "sqm": "number"
  },
  "features": {
    "bedrooms": "number",
    "bathrooms": "number",
    "garage": "number",
    "pool": "boolean",
    "yard": "boolean",
    "pets": "boolean",
    "furnished": "string"
  },
  "images": ["string"],
  "status": "string (default: active)"
}
```

### Developer Model
```json
{
  "name": "string (required)",
  "description": "string",
  "contact": {
    "email": "string",
    "phone": "string",
    "website": "string"
  }
}
```

## Test Suites

### 1. TS_DeveloperProperties_Smoke
**Purpose:** Quick smoke tests covering basic functionality
**Test Cases:**
- Get all projects
- Get all properties
- Get all developers
- Create project with valid data
- Create property with valid data

**Execution Time:** ~2-3 minutes

### 2. TS_DeveloperProperties_Complete
**Purpose:** Comprehensive testing including positive and negative scenarios
**Test Cases:** All test cases including edge cases and error scenarios
**Execution Time:** ~10-15 minutes

## Configuration Requirements

### Global Variables
Set the following global variables in Katalon Studio:
- `BASE_URL` - API Gateway base URL (default: http://localhost:3000)
- `AUTH_TOKEN` - Authentication token for API requests
- `CREATED_PROJECT_ID` - Stores created project ID for cleanup
- `CREATED_PROPERTY_ID` - Stores created property ID for cleanup
- `INTEGRATION_TEST_PROJECT_ID` - Stores integration test project ID
- `INTEGRATION_TEST_PROPERTY_ID` - Stores integration test property ID

### Environment Setup
1. Ensure the Developer Properties microservice is running
2. Ensure the API Gateway is running and routing requests correctly
3. Set up authentication if required
4. Configure database with test data if needed

## Test Execution Guidelines

### Pre-Execution Checklist
1. ✅ Microservice is running and accessible
2. ✅ Database is accessible and has test data
3. ✅ Authentication tokens are valid
4. ✅ Global variables are configured
5. ✅ Network connectivity is stable

### Execution Order
1. **Smoke Tests First** - Run `TS_DeveloperProperties_Smoke` to verify basic functionality
2. **Complete Tests** - Run `TS_DeveloperProperties_Complete` for comprehensive coverage
3. **Individual Tests** - Run specific test cases for debugging

### Post-Execution
1. Review test results and logs
2. Clean up any test data created during execution
3. Document any failures or issues found
4. Update test cases if API changes are detected

## Validation Points

### Response Validation
- HTTP status codes (200, 201, 400, 404, 500)
- Response structure (status, data, message fields)
- Data integrity (created data matches sent data)
- Error messages for invalid requests

### Data Validation
- Required fields are validated
- Data types are correct
- Business rules are enforced (e.g., positive prices)
- Relationships between entities are maintained

### Performance Validation
- Response times are within acceptable limits (<5 seconds)
- Bulk operations handle multiple records efficiently
- Database queries are optimized

## Troubleshooting

### Common Issues
1. **Connection Refused** - Check if microservice is running
2. **Authentication Errors** - Verify AUTH_TOKEN is valid
3. **Data Validation Errors** - Check test data format
4. **Timeout Errors** - Increase timeout values or check network

### Debug Tips
1. Enable detailed logging in Katalon Studio
2. Use browser developer tools to inspect API calls
3. Check microservice logs for error details
4. Validate test data before sending requests

## Maintenance

### Regular Updates
1. Update test data when API changes
2. Add new test cases for new endpoints
3. Update validation rules for schema changes
4. Review and update global variables

### Best Practices
1. Keep test data realistic but not sensitive
2. Use meaningful test case names
3. Add proper assertions and validations
4. Maintain clean test data (setup/teardown)
5. Document any test dependencies

## Integration with CI/CD

### Jenkins Integration
```groovy
pipeline {
    agent any
    stages {
        stage('Run Developer Properties Tests') {
            steps {
                script {
                    // Run Katalon tests
                    bat "katalon -noSplash -runMode=console -projectPath='${WORKSPACE}/Katalon' -retry=0 -testSuitePath='Test Suites/TS_DeveloperProperties_Smoke' -executionProfile='default'"
                }
            }
        }
    }
    post {
        always {
            // Publish test results
            publishHTML([
                allowMissing: false,
                alwaysLinkToLastBuild: true,
                keepAll: true,
                reportDir: 'Reports',
                reportFiles: 'index.html',
                reportName: 'Developer Properties Test Report'
            ])
        }
    }
}
```

## Contact and Support
For questions or issues with the test implementation:
1. Check this documentation first
2. Review Katalon Studio logs
3. Consult the microservice API documentation
4. Contact the development team for API-related issues

---

**Last Updated:** January 2, 2026
**Version:** 1.0
**Author:** Automated Test Implementation