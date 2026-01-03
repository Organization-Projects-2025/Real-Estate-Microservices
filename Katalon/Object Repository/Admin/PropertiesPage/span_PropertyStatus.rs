<?xml version="1.0" encoding="UTF-8"?>
<WebElementEntity>
   <description>Property status badge - parameterized by propertyTitle and status</description>
   <name>span_PropertyStatus</name>
   <tag></tag>
   <elementGuidId>prop-mgmt-span-status-001</elementGuidId>
   <selectorCollection>
      <entry>
         <key>XPATH</key>
         <value>//div[contains(@class,'text-sm font-medium text-white') and contains(text(),'${propertyTitle}')]/ancestor::tr//span[contains(text(),'${status}')]</value>
      </entry>
   </selectorCollection>
   <selectorMethod>XPATH</selectorMethod>
   <useRalativeImagePath>false</useRalativeImagePath>
</WebElementEntity>
