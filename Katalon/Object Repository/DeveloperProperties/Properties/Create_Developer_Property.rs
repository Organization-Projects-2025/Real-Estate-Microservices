<?xml version="1.0" encoding="UTF-8"?>
<WebServiceRequestEntity>
   <description>Create a new developer property endpoint</description>
   <name>Create_Developer_Property</name>
   <tag></tag>
   <elementGuidId>create-developer-property-endpoint</elementGuidId>
   <selectorMethod>BASIC</selectorMethod>
   <useRalativeImagePath>false</useRalativeImagePath>
   <connectionTimeout>0</connectionTimeout>
   <followRedirects>false</followRedirects>
   <httpBody></httpBody>
   <httpBodyContent>{
  "text": "{\"developerId\": \"${developer_id}\", \"projectId\": \"${project_id}\", \"title\": \"${property_title}\", \"description\": \"${property_description}\", \"price\": ${property_price}, \"listingType\": \"${listing_type}\", \"propertyType\": \"${property_type}\", \"address\": {\"street\": \"${street}\", \"city\": \"${city}\", \"state\": \"${state}\", \"country\": \"${country}\", \"zipCode\": \"${zip_code}\"}, \"area\": {\"sqft\": ${sqft}, \"sqm\": ${sqm}}, \"features\": {\"bedrooms\": ${bedrooms}, \"bathrooms\": ${bathrooms}, \"garage\": ${garage}, \"pool\": ${pool}, \"yard\": ${yard}, \"pets\": ${pets}, \"furnished\": \"${furnished}\"}, \"images\": [\"${image1}\", \"${image2}\"], \"status\": \"${property_status}\"}",
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
   <restRequestMethod>POST</restRequestMethod>
   <restUrl>${base_url}/api/developer-properties/properties</restUrl>
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
      <defaultValue>507f1f77bcf86cd799439012</defaultValue>
      <description>Project ID</description>
      <id>project_id</id>
      <masked>false</masked>
      <name>project_id</name>
   </variables>
   <variables>
      <defaultValue>Luxury Apartment</defaultValue>
      <description>Property title</description>
      <id>property_title</id>
      <masked>false</masked>
      <name>property_title</name>
   </variables>
   <variables>
      <defaultValue>Beautiful luxury apartment with modern amenities</defaultValue>
      <description>Property description</description>
      <id>property_description</id>
      <masked>false</masked>
      <name>property_description</name>
   </variables>
   <variables>
      <defaultValue>500000</defaultValue>
      <description>Property price</description>
      <id>property_price</id>
      <masked>false</masked>
      <name>property_price</name>
   </variables>
   <variables>
      <defaultValue>sale</defaultValue>
      <description>Listing type (sale/rent)</description>
      <id>listing_type</id>
      <masked>false</masked>
      <name>listing_type</name>
   </variables>
   <variables>
      <defaultValue>apartment</defaultValue>
      <description>Property type</description>
      <id>property_type</id>
      <masked>false</masked>
      <name>property_type</name>
   </variables>
   <variables>
      <defaultValue>123 Main Street</defaultValue>
      <description>Street address</description>
      <id>street</id>
      <masked>false</masked>
      <name>street</name>
   </variables>
   <variables>
      <defaultValue>New York</defaultValue>
      <description>City</description>
      <id>city</id>
      <masked>false</masked>
      <name>city</name>
   </variables>
   <variables>
      <defaultValue>NY</defaultValue>
      <description>State</description>
      <id>state</id>
      <masked>false</masked>
      <name>state</name>
   </variables>
   <variables>
      <defaultValue>USA</defaultValue>
      <description>Country</description>
      <id>country</id>
      <masked>false</masked>
      <name>country</name>
   </variables>
   <variables>
      <defaultValue>10001</defaultValue>
      <description>ZIP code</description>
      <id>zip_code</id>
      <masked>false</masked>
      <name>zip_code</name>
   </variables>
   <variables>
      <defaultValue>1200</defaultValue>
      <description>Square feet</description>
      <id>sqft</id>
      <masked>false</masked>
      <name>sqft</name>
   </variables>
   <variables>
      <defaultValue>111</defaultValue>
      <description>Square meters</description>
      <id>sqm</id>
      <masked>false</masked>
      <name>sqm</name>
   </variables>
   <variables>
      <defaultValue>3</defaultValue>
      <description>Number of bedrooms</description>
      <id>bedrooms</id>
      <masked>false</masked>
      <name>bedrooms</name>
   </variables>
   <variables>
      <defaultValue>2</defaultValue>
      <description>Number of bathrooms</description>
      <id>bathrooms</id>
      <masked>false</masked>
      <name>bathrooms</name>
   </variables>
   <variables>
      <defaultValue>1</defaultValue>
      <description>Number of garage spaces</description>
      <id>garage</id>
      <masked>false</masked>
      <name>garage</name>
   </variables>
   <variables>
      <defaultValue>true</defaultValue>
      <description>Has pool</description>
      <id>pool</id>
      <masked>false</masked>
      <name>pool</name>
   </variables>
   <variables>
      <defaultValue>true</defaultValue>
      <description>Has yard</description>
      <id>yard</id>
      <masked>false</masked>
      <name>yard</name>
   </variables>
   <variables>
      <defaultValue>true</defaultValue>
      <description>Pets allowed</description>
      <id>pets</id>
      <masked>false</masked>
      <name>pets</name>
   </variables>
   <variables>
      <defaultValue>fully</defaultValue>
      <description>Furnished status</description>
      <id>furnished</id>
      <masked>false</masked>
      <name>furnished</name>
   </variables>
   <variables>
      <defaultValue>image1.jpg</defaultValue>
      <description>First image</description>
      <id>image1</id>
      <masked>false</masked>
      <name>image1</name>
   </variables>
   <variables>
      <defaultValue>image2.jpg</defaultValue>
      <description>Second image</description>
      <id>image2</id>
      <masked>false</masked>
      <name>image2</name>
   </variables>
   <variables>
      <defaultValue>active</defaultValue>
      <description>Property status</description>
      <id>property_status</id>
      <masked>false</masked>
      <name>property_status</name>
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
assertThat(response.getStatusCode()).isEqualTo(201)

// Parse response body
def jsonSlurper = new JsonSlurper()
def responseBody = jsonSlurper.parseText(response.getResponseBodyContent())

// Verify response structure
assertThat(responseBody.status).isEqualTo('success')
assertThat(responseBody.data).isNotNull()
assertThat(responseBody.data.property).isNotNull()
assertThat(responseBody.data.property._id).isNotNull()
</verificationScript>
   <wsdlAddress></wsdlAddress>
</WebServiceRequestEntity>