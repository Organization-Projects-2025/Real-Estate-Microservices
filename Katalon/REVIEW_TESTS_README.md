# Review Test Cases - Documentation

## Overview
This document describes the Review microservice test automation implementation using Katalon Studio.

## Test Cases

### Create Review Tests (5 test cases)
Located in: `Test Cases/Review/`

1. **TC_Review_CR1_1Star** - Creates a review with 1-star rating
2. **TC_Review_CR2_2Star** - Creates a review with 2-star rating
3. **TC_Review_CR3_3Star** - Creates a review with 3-star rating
4. **TC_Review_CR4_4Star** - Creates a review with 4-star rating
5. **TC_Review_CR5_5Star** - Creates a review with 5-star rating

### Delete Review Test (1 test case)
Located in: `Test Cases/Review/Delete/`

1. **TC_Review_DEL1_DeleteLast** - Admin deletes the last review

## Keywords

### Review_Keywords.groovy
Located in: `Keywords/review/Review_Keywords.groovy`

Provides reusable functions for review operations:

#### Login Functions
- `loginAsUser()` - Login as regular user (a7med3li@gmail.com)
- `loginAsAdmin()` - Login as admin user

#### Review Creation Functions
- `navigateToWriteReview()` - Navigate to write review page
- `fillReviewForm(reviewerName, agentId, starRating, reviewText)` - Fill review form
- `clickStarRating(rating)` - Click star rating (1-5)
- `submitReview()` - Submit the review form
- `createReview(reviewerName, starRating, reviewText, agentId)` - Complete review creation flow

#### Admin Functions
- `navigateToAdminReviews()` - Navigate to admin reviews page
- `deleteLastReview()` - Delete the last review in the list
- `adminDeleteLastReview()` - Complete admin delete flow

## Object Repository

### Review Objects
Located in: `Object Repository/Review/`

All review-related page objects are organized in this folder:

**Login Objects:**
- signInLink.rs
- emailInput.rs
- passwordInput.rs
- loginButton.rs
- loginForm.rs
- loginFormDiv.rs
- loginSection.rs
- heroOverlay.rs

**Review Form Objects:**
- writeReviewLink.rs
- viewAllReviewsLink.rs
- reviewerNameInput.rs
- agentSelect.rs
- star_1.rs through star_5.rs
- reviewTextarea.rs
- submitReviewButton.rs

**Admin Objects:**
- adminSpan.rs
- adminDashboardLink.rs
- reviewsMenuLink.rs
- deleteLastReviewButton.rs

## Test Data

### User Credentials
- **Regular User:** a7med3li@gmail.com (encrypted password in keywords)
- **Admin User:** admin@realestate.com (encrypted password in keywords)

### Default Values
- **Agent ID:** 694b6474061ba8a480628253
- **Base URL:** http://localhost:5173

## Usage Example

### Simple Test Case
```groovy
import review.Review_Keywords as ReviewKeywords

ReviewKeywords reviewKW = new ReviewKeywords()

// Create a 5-star review
reviewKW.createReview('John Doe', 5, 'Excellent service!')
```

### Custom Test Case
```groovy
import review.Review_Keywords as ReviewKeywords

ReviewKeywords reviewKW = new ReviewKeywords()

// Login
reviewKW.loginAsUser()

// Navigate to write review
reviewKW.navigateToWriteReview()

// Fill form
reviewKW.fillReviewForm('Jane Smith', '694b6474061ba8a480628253', 4, 'Great experience')

// Submit
reviewKW.submitReview()

// Close browser
WebUI.closeBrowser()
```

## Benefits of Keyword-Driven Approach

1. **Reusability** - Keywords can be used across multiple test cases
2. **Maintainability** - Changes to UI only require updating keywords, not all test cases
3. **Readability** - Test cases are clean and easy to understand
4. **Professional** - Follows industry best practices
5. **Consistency** - Same pattern as Authentication tests

## Notes

- All test cases use keywords for cleaner, more maintainable code
- Objects are organized in a dedicated Review folder
- Star ratings use individual objects (star_1 through star_5) for accurate selection
- Admin delete test includes proper wait times and alert handling
