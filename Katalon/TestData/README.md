# Test Data Assets

This folder contains test assets (images, files, etc.) used by Katalon test cases.

## Files

- **villa.jpg** - Sample property image used for testing property listing functionality
  - Used by: TC_NOTIF_TRIG_002_PropertySell, TC_PROP_002_Create_Property_Valid_Data
  - Purpose: Testing image upload in property creation forms

## Usage

Test scripts access files in this folder using:
```groovy
String projectDir = RunConfiguration.getProjectDir()
String imagePath = projectDir + '/TestData/villa.jpg'
```

## Note

Do not use the "Data Files" folder for binary assets like images. That folder is for data-driven testing files (CSV, Excel, etc.).
