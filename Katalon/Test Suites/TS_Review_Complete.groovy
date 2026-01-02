import static com.kms.katalon.core.checkpoint.CheckpointFactory.findCheckpoint
import static com.kms.katalon.core.testcase.TestCaseFactory.findTestCase
import static com.kms.katalon.core.testdata.TestDataFactory.findTestData
import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject

import com.kms.katalon.core.checkpoint.Checkpoint as Checkpoint
import com.kms.katalon.core.checkpoint.CheckpointFactory as CheckpointFactory
import com.kms.katalon.core.model.FailureHandling as FailureHandling
import com.kms.katalon.core.testcase.TestCase as TestCase
import com.kms.katalon.core.testcase.TestCaseFactory as TestCaseFactory
import com.kms.katalon.core.testdata.TestData as TestData
import com.kms.katalon.core.testdata.TestDataFactory as TestDataFactory
import com.kms.katalon.core.testobject.ObjectRepository as ObjectRepository
import com.kms.katalon.core.testobject.TestObject as TestObject

import com.kms.katalon.core.webservice.keyword.WSBuiltInKeywords as WS
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import com.kms.katalon.core.mobile.keyword.MobileBuiltInKeywords as Mobile

import internal.GlobalVariable as GlobalVariable

import com.kms.katalon.core.annotation.SetUp
import com.kms.katalon.core.annotation.SetupTestCase
import com.kms.katalon.core.annotation.TearDown
import com.kms.katalon.core.annotation.TearDownTestCase

/**
 * Complete Test Suite for Review Microservice
 * 
 * This test suite includes all review test cases:
 * - 5 Create Review tests (1-5 star ratings)
 * - 1 Delete Review test (admin)
 * 
 * Execution Order:
 * 1. TC_Review_CR1_1Star - Create 1-star review
 * 2. TC_Review_CR2_2Star - Create 2-star review
 * 3. TC_Review_CR3_3Star - Create 3-star review
 * 4. TC_Review_CR4_4Star - Create 4-star review
 * 5. TC_Review_CR5_5Star - Create 5-star review
 * 6. TC_Review_DEL1_DeleteLast - Admin deletes last review
 * 
 * Prerequisites:
 * - Application running at http://localhost:5173
 * - Test user account: a7med3li@gmail.com
 * - Admin account: admin@realestate.com
 * - Agent ID: 694b6474061ba8a480628253
 */

@SetUp(skipped = false)
def setUp() {
    // Setup code before test suite execution
    println("========================================")
    println("Starting Review Complete Test Suite")
    println("========================================")
}

@TearDown(skipped = false)
def tearDown() {
    // Cleanup code after test suite execution
    println("========================================")
    println("Review Complete Test Suite Finished")
    println("========================================")
}
