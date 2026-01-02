<?xml version="1.0" encoding="UTF-8"?>
<WebServiceRequestEntity>
   <description>Get developer by ID endpoint</description>
   <name>Get_Developer_By_Valid_Id</name>
   <tag></tag>
   <elementGuidId>get-developer-by-id-endpoint</elementGuidId>
   <selectorMethod>BASIC</selectorMethod>
   <useRalativeImagePath>false</useRalativeImagePath>
   <connectionTimeout>0</connectionTimeout>
   <followRedirects>false</followRedirects>
   <httpBody></httpBody>
   <httpBodyContent></httpBodyContent>
   <httpBodyType></httpBodyType>
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
   <restRequestMethod>GET</restRequestMethod>
   <restUrl>${base_url}/api/developer-properties/developers/${developer_id}</restUrl>
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
      <description>Developer ID</description>
      <id>developer_id</id>
      <masked>false</masked>
      <name>developer_id</name>
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
assertThat(responseBody.data.developer).isNotNull()
assertThat(responseBody.data.developer._id).isNotNull()
</verificationScript>
   <wsdlAddress></wsdlAddress>
</WebServiceRequestEntity>