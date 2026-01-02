# Property Service Test Suite - Quick Start Guide

## What's Been Created

A professional, production-ready test suite for the Property Microservice with:
- **15 Independent Test Cases** organized in 3 categories
- **20+ Reusable Keywords** for common operations
- **9 API Endpoints** fully defined in Object Repository
- **Comprehensive Documentation** for maintenance and extension

## File Structure

```
Katalon/
├── Keywords/
│   └── PropertyServiceCommon.groovy          ← Reusable functions
├── Object Repository/PropertyService/        ← API endpoints (9 files)
├── Test Cases/PropertyService/
│   ├── CRUD_Operations/                      ← 8 test cases
│   ├── Filtering_Search/                     ← 4 test cases
│   ├── Data_Validation/                      ← 3 test cases
│   └── README.md                             ← Full documentation
├── PROPERTY_SERVICE_TEST_SUITE.md            ← Implementation summary
└── QUICK_START.md                            ← This file
```

## Test Cases Overview

### CRUD Operations (8 tests)
| # | Test Case | Purpose |
|---|-----------|---------|
| 1 | Create with Valid Data | Verify successful property creation |
| 2 | Create Missing Fields | Validate required field enforcement |
| 3 | Create Invalid Enum | Validate enum value constraints |
| 4 | Get All Properties | Retrieve all properties |
| 5 | Get by ID | Retrieve specific property |
| 6 | Get by ID Not Found | Verify 404 handling |
| 7 | Update Property | Verify update functionality |
| 8 | Delete Property | Verify deletion and 404 after delete |

### Filtering & Search (4 tests)
| # | Test Case | Purpose |
|---|-----------|---------|
| 9 | By User ID | Filter properties by user |
| 10 | By Listing Type | Filter by sale/rent |
| 11 | Search with Filters | Multi-criteria search |
| 12 | Featured Properties | Get featured with limit |

### Data Validation (3 tests)
| # | Test Case | Purpose |
|---|-----------|---------|
| 13 | Numeric Fields | Validate price, bedrooms, etc. |
| 14 | Address Fields | Validate address components |
| 15 | Features Fields | Validate features and enums |

## Key Reusable Keywords

### API Operations
```groovy
createProperty(Map propertyData)
getAllProperties()
getPropertyById(String propertyId)
updateProperty(String propertyId, Map updateData)
deleteProperty(String propertyId)
getPropertiesByUser(String userId)
getPropertiesByListingType(String listingType)
searchProperties(Map filters)
getFeaturedProperties(int limit)
```

### Verification
```groovy
verifyResponseStatus(def response, int expectedStatus)
verifyResponseSuccess(def response)
verifyRequiredFields(Map propertyData, List<String> requiredFields)
```

### Data Extraction
```groovy
extractPropertyId(def response)
extractErrorMessage(def response)
```

### Test Data
```groovy
createValidPropertyData()
createPropertyDataWithMissingField(String missingField)
createPropertyDataWithInvalidEnum(String fieldName, String invalidValue)
```

## Running Tests

### Run All Tests
1. Open Katalon Studio
2. Right-click: `Test Cases > PropertyService`
3. Select: `Run > Run with default configuration`

### Run Specific Category
1. Right-click: `Test Cases > PropertyService > CRUD_Operations`
2. Select: `Run > Run with default configuration`

### Run Single Test
1. Right-click: `Test Cases > PropertyService > CRUD_Operations > TC_001_...`
2. Select: `Run > Run with default configuration`

## Prerequisites

### System
- Katalon Studio 9.0.0+
- Java Runtime Environment (JRE) 8+

### Services
- API Gateway: `http://localhost:3000`
- Property Service: Port 3002
- MongoDB: Accessible and initialized

### Startup Commands
```bash
# Terminal 1: Start API Gateway
cd Real-Estate-Microservices/microservices/api-gateway
npm start

# Terminal 2: Start Property Service
cd Real-Estate-Microservices/microservices/property-service
npm start
```

## Test Data

### Valid Property Example
```json
{
  "title": "Beautiful 3BR House",
  "description": "Spacious family home",
  "listingType": "sale",
  "propertyType": "residential",
  "subType": "house",
  "address": {
    "street": "123 Main Street",
    "city": "New York",
    "state": "NY",
    "country": "USA"
  },
  "area": { "sqft": 2500, "sqm": 232 },
  "price": 450000,
  "media": ["https://example.com/image1.jpg"],
  "buildDate": "2020-01-15",
  "user": "user123",
  "status": "active",
  "features": {
    "bedrooms": 3,
    "bathrooms": 2,
    "garage": 2,
    "pool": true,
    "yard": true,
    "pets": true,
    "furnished": "fully",
    "airConditioning": true,
    "internet": true,
    "electricity": true,
    "water": true,
    "gas": true,
    "wifi": true,
    "security": true
  }
}
```

## API Endpoints Tested

| Method | Endpoint | Test Case |
|--------|----------|-----------|
| POST | /properties | TC_001, TC_002, TC_003 |
| GET | /properties | TC_004 |
| GET | /properties/:id | TC_005, TC_006 |
| PUT | /properties/:id | TC_007 |
| DELETE | /properties/:id | TC_008 |
| GET | /properties/user/:userId | TC_009 |
| GET | /properties/type/:listingType | TC_010 |
| GET | /properties/search | TC_011 |
| GET | /properties/featured | TC_012 |

## Validation Rules

### Required Fields
- title, description, listingType, propertyType, subType
- address (street, city, state, country)
- area (sqft, sqm)
- price, media, user, status, features

### Enum Values
- **listingType**: 'sale' | 'rent'
- **propertyType**: 'residential' | 'commercial'
- **status**: 'active' | 'sold'
- **furnished**: 'fully' | 'partly' | 'none'

### Numeric Constraints
- price: positive number
- bedrooms, bathrooms, garage: non-negative integers
- sqft, sqm: positive numbers

## Common Issues & Solutions

### Connection Failed
**Problem**: Cannot connect to API Gateway
**Solution**: 
- Verify API Gateway is running on http://localhost:3000
- Check firewall settings
- Verify network connectivity

### Property Service Error
**Problem**: 500 error from Property Service
**Solution**:
- Verify Property Service is running on port 3002
- Check MongoDB connection
- Review service logs

### Test Failures
**Problem**: Tests fail with validation errors
**Solution**:
- Verify test data matches schema
- Check for duplicate data conflicts
- Review test case logs for details

## Extending the Test Suite

### Add New Test Case
1. Create file: `Test Cases/PropertyService/[Category]/TC_XXX_Description.tc`
2. Use PropertyServiceCommon keywords
3. Follow existing test structure
4. Update README.md

### Add New Keyword
1. Edit: `Keywords/PropertyServiceCommon.groovy`
2. Add function with @Keyword annotation
3. Include documentation
4. All tests automatically use new keyword

### Add New Endpoint
1. Create file: `Object Repository/PropertyService/[METHOD]_[Name].rs`
2. Define endpoint URL and parameters
3. Add verification script
4. Update keywords to use new endpoint

## Documentation Files

- **PROPERTY_SERVICE_TEST_SUITE.md** - Full implementation details
- **Test Cases/PropertyService/README.md** - Comprehensive test documentation
- **Keywords/PropertyServiceCommon.groovy** - Inline keyword documentation
- **Object Repository/PropertyService/*.rs** - Endpoint descriptions

## Test Execution Checklist

- [ ] API Gateway running on http://localhost:3000
- [ ] Property Service running on port 3002
- [ ] MongoDB accessible
- [ ] Katalon Studio open
- [ ] Test Cases/PropertyService folder visible
- [ ] Keywords/PropertyServiceCommon.groovy loaded
- [ ] Object Repository/PropertyService endpoints visible
- [ ] Ready to run tests

## Performance Expectations

- **Single Test**: 2-5 seconds
- **Category (4-8 tests)**: 10-30 seconds
- **Full Suite (15 tests)**: 30-60 seconds

## Support

For detailed information, refer to:
- Full documentation: `PROPERTY_SERVICE_TEST_SUITE.md`
- Test details: `Test Cases/PropertyService/README.md`
- Keyword reference: `Keywords/PropertyServiceCommon.groovy`

---

**Ready to test!** Start with TC_001 to verify your setup is correct.
