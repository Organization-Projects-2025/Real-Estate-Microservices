<?xml version="1.0" encoding="UTF-8"?>
<WebServiceRequestEntity>
   <description>Update project endpoint</description>
   <name>Update_Project</name>
   <tag></tag>
   <elementGuidId>update-project-endpoint</elementGuidId>
   <selectorMethod>BASIC</selectorMethod>
   <useRalativeImagePath>false</useRalativeImagePath>
   <connectionTimeout>0</connectionTimeout>
   <followRedirects>false</followRedirects>
   <httpBody></httpBody>
   <httpBodyContent>{
  "text": "{\"name\": \"${project_name}\", \"description\": \"${project_description}\", \"location\": \"${project_location}\", \"status\": \"${project_status}\"}",
  "contentType": "application/json",
  "charset": "UTF-8"
}</httpBodyContent>
   <httpBodyType>text</httpBodyType>
   <httpHeaderProperties>
      <isSelected>true</isSelected>
      <matchCondition>equals</matchCondition>
      <name>Content-Type</name>
      <type>Main</type>
      <value>application/json</value>
      <webElementGuid>content-type-header</webElementGuid>
   </httpHeaderProperties>
   <httpHeaderProperties>
      <isSelected>true</isSelected>
      <matchCondition>equals</matchCondition>
      <name>Authorization</name>
      <type>Main</type>
      <value>Bearer ${auth_token}</value>
      <webElementGuid>auth-header</webElementGuid>
   </httpHeaderProperties>
   <katalonVersion>9.0.0</katalonVersion>
   <maxResponseSize>0</maxResponseSize>
   <migratedVersion>5.4.1</migratedVersion>
   <restRequestMethod>PUT</restRequestMethod>
   <restUrl>${base_url}/api/developer-properties/projects/${project_id}</restUrl>
   <serviceType>RESTful</serviceType>
   <soapBody></soapBody>
   <soapHeader></soapHeader>
   <soapRequestMethod></soapRequestMethod>
   <soapServiceEndpoint></soapServiceEndpoint>
   <soapServiceFunction></soapServiceFunction>
   <socketTimeout>0</socketTimeout>
   <useServiceInfoFromWsdl>true</useServiceInfoFromWsdl>
   <variables>
      <defaultValue>http://localhost:3000</defaultValue>
      <description>Base URL for API Gateway</description>
      <id>base_url</id>
      <masked>false</masked>
      <name>base_url</name>
   </variables>
   <variables>
      <defaultValue>507f1f77bcf86cd799439011</defaultValue>
      <description>Project ID</description>
      <id>project_id</id>
      <masked>false</masked>
      <name>project_id</name>
   </variables>
   <variables>
      <defaultValue>Updated Project Name</defaultValue>
      <description>Updated project name</description>
      <id>project_name</id>
      <masked>false</masked>
      <name>project_name</name>
   </variables>
   <variables>
      <defaultValue>Updated project description</defaultValue>
      <description>Updated project description</description>
      <id>project_description</id>
      <masked>false</masked>
      <name>project_description</name>
   </variables>
   <variables>
      <defaultValue>Updated Location</defaultValue>
      <description>Updated project location</description>
      <id>project_location</id>
      <masked>false</masked>
      <name>project_location</name>
   </variables>
   <variables>
      <defaultValue>completed</defaultValue>
      <description>Updated project status</description>
      <id>project_status</id>
      <masked>false</masked>
      <name>project_status</name>
   </variables>
   <variables>
      <defaultValue></defaultValue>
      <description>Authentication token</description>
      <id>auth_token</id>
      <masked>true</masked>
      <name>auth_token</name>
   </variables>
   <verificationScript>import static org.assertj.core.api.Assertions.*

import com.kms.katalon.core.testobject.RequestObject
import com.kms.katalon.core.testobject.ResponseObject
import com.kms.katalon.core.webservice.keyword.WSBuiltInKeywords as WS
import com.kms.katalon.core.webservice.verification.WSResponseManager

import groovy.json.JsonSlurper
import internal.GlobalVariable as GlobalVariable

ResponseObject response = WSResponseManager.getInstance().getCurrentResponse()

// Verify response status
assertThat(response.getStatusCode()).isEqualTo(200)

// Parse response body
def jsonSlurper = new JsonSlurper()
def responseBody = jsonSlurper.parseText(response.getResponseBodyContent())

// Verify response structure
assertThat(responseBody.status).isEqualTo('success')
assertThat(responseBody.data).isNotNull()
assertThat(responseBody.data.project).isNotNull()
</verificationScript>
   <wsdlAddress></wsdlAddress>
</WebServiceRequestEntity>