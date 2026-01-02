<?xml version="1.0" encoding="UTF-8"?>
<TestSuiteEntity>
   <description>Smoke test suite for Developer Properties microservice - covers basic functionality</description>
   <name>TS_DeveloperProperties_Smoke</name>
   <tag></tag>
   <isRerun>false</isRerun>
   <mailRecipient></mailRecipient>
   <numberOfRerun>0</numberOfRerun>
   <pageLoadTimeout>30</pageLoadTimeout>
   <pageLoadTimeoutDefault>true</pageLoadTimeoutDefault>
   <rerunFailedTestCasesOnly>false</rerunFailedTestCasesOnly>
   <rerunImmediately>false</rerunImmediately>
   <testSuiteGuid>ts-developer-properties-smoke</testSuiteGuid>
   <testCaseLink>
      <guid>tc-link-create-project-valid</guid>
      <isReuseDriver>false</isReuseDriver>
      <isRun>true</isRun>
      <testCaseId>Test Cases/DeveloperProperties/Projects/TC_DEVPROP_001_Create_Project_Valid_Data</testCaseId>
      <usingDataBindingAtTestSuiteLevel>true</usingDataBindingAtTestSuiteLevel>
      <variableLink>
         <testDataLinkId></testDataLinkId>
         <type>DEFAULT</type>
         <value></value>
         <variableId>project_name</variableId>
      </variableLink>
      <variableLink>
         <testDataLinkId></testDataLinkId>
         <type>DEFAULT</type>
         <value></value>
         <variableId>developer_id</variableId>
      </variableLink>
      <variableLink>
         <testDataLinkId></testDataLinkId>
         <type>DEFAULT</type>
         <value></value>
         <variableId>project_location</variableId>
      </variableLink>
   </testCaseLink>
   <testCaseLink>
      <guid>tc-link-get-all-projects</guid>
      <isReuseDriver>false</isReuseDriver>
      <isRun>true</isRun>
      <testCaseId>Test Cases/DeveloperProperties/Projects/TC_DEVPROP_003_Get_All_Projects</testCaseId>
      <usingDataBindingAtTestSuiteLevel>true</usingDataBindingAtTestSuiteLevel>
   </testCaseLink>
   <testCaseLink>
      <guid>tc-link-project-by-valid-id</guid>
      <isReuseDriver>false</isReuseDriver>
      <isRun>true</isRun>
      <testCaseId>Test Cases/DeveloperProperties/Projects/TC_DEVPROP_004_Get_Project_By_Valid_Id</testCaseId>
      <usingDataBindingAtTestSuiteLevel>true</usingDataBindingAtTestSuiteLevel>
      <variableLink>
         <testDataLinkId></testDataLinkId>
         <type>DEFAULT</type>
         <value></value>
         <variableId>project_id</variableId>
      </variableLink>
   </testCaseLink>
   <testCaseLink>
      <guid>tc-link-project-invalid-id</guid>
      <isReuseDriver>false</isReuseDriver>
      <isRun>true</isRun>
      <testCaseId>Test Cases/DeveloperProperties/Projects/TC_DEVPROP_005_Get_Project_By_Invalid_Id</testCaseId>
      <usingDataBindingAtTestSuiteLevel>true</usingDataBindingAtTestSuiteLevel>
   </testCaseLink>
   <testCaseLink>
      <guid>tc-link-update-project</guid>
      <isReuseDriver>false</isReuseDriver>
      <isRun>true</isRun>
      <testCaseId>Test Cases/DeveloperProperties/Projects/TC_DEVPROP_006_Update_Project_Valid_Data</testCaseId>
      <usingDataBindingAtTestSuiteLevel>true</usingDataBindingAtTestSuiteLevel>
   </testCaseLink>
   <testCaseLink>
      <guid>tc-link-delete-project</guid>
      <isReuseDriver>false</isReuseDriver>
      <isRun>true</isRun>
      <testCaseId>Test Cases/DeveloperProperties/Projects/TC_DEVPROP_007_Delete_Project_Valid_Id</testCaseId>
      <usingDataBindingAtTestSuiteLevel>true</usingDataBindingAtTestSuiteLevel>
   </testCaseLink>
   <testCaseLink>
      <guid>tc-link-navigate-property</guid>
      <isReuseDriver>false</isReuseDriver>
      <isRun>true</isRun>
      <testCaseId>Test Cases/DeveloperProperties/Properties/TC_DEVPROP_008_Create_Property_Valid_Data</testCaseId>
      <usingDataBindingAtTestSuiteLevel>true</usingDataBindingAtTestSuiteLevel>
   </testCaseLink>
   <testCaseLink>
      <guid>tc-link-properties-by-project</guid>
      <isReuseDriver>false</isReuseDriver>
      <isRun>true</isRun>
      <testCaseId>Test Cases/DeveloperProperties/Properties/TC_DEVPROP_012_Get_Properties_By_Project</testCaseId>
      <usingDataBindingAtTestSuiteLevel>true</usingDataBindingAtTestSuiteLevel>
      <variableLink>
         <testDataLinkId></testDataLinkId>
         <type>DEFAULT</type>
         <value></value>
         <variableId>project_id</variableId>
      </variableLink>
   </testCaseLink>
</TestSuiteEntity>
