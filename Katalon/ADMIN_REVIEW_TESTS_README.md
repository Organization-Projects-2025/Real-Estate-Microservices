# Admin Review Management Test Suite

## Overview
Automated test cases for the Admin Review Management module.

## Test Cases

| ID | Name | Priority | Description |
|----|------|----------|-------------|
| TC_ADM_REV_001 | ViewReviewsPage | High | Verify admin can access Reviews Management page |
| TC_ADM_REV_002 | DeleteReview | High | Verify admin can delete a review |
| TC_ADM_REV_003 | CancelDeleteReview | Medium | Verify cancel delete keeps review intact |

## Test Suite

- **TS_Admin_Review_Full_Suite**: All 3 test cases

## Keywords

`Review_Keywords.groovy`:
- `navigateToReviews()` - Navigate to Reviews page
- `verifyReviewsPageLoaded()` - Verify page loaded
- `createTestReviewViaAPI()` - Create test review via API
- `deleteReviewViaAPI()` - Delete review via API (cleanup)
- `getReviewCount()` - Get review row count
- `waitForLoadingComplete()` - Wait for loading spinner
- `isSuccessToastDisplayed()` / `assertSuccessToast()`
- `isErrorToastDisplayed()` / `assertErrorToast()`
- `assertNoSuccessToast()` / `assertNoErrorToast()`

## Test Data

- Tests create reviews via API: `POST http://localhost:3000/api/reviews`
- Cleanup in finally block via `deleteReviewViaAPI()`

## Prerequisites

1. Application running on `http://localhost:5173`
2. API Gateway running on `http://localhost:3000`
3. Admin account: `admin@realestate.com` / `admin123`
