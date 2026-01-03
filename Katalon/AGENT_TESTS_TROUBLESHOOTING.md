# Agent Tests Troubleshooting Guide

## Common Issues and Solutions

### Issue 1: "Cannot find Chrome binary" Error

**Error Message:**
```
SessionNotCreatedException: Could not start a new session. Response code 500. 
Message: session not created from unknown error: cannot find Chrome binary
```

**Root Cause:** Katalon Studio cannot locate the Chrome browser executable on your system.

**Solutions:**

#### Solution 1: Configure Chrome Path in Katalon Studio (Recommended)

1. **Open Katalon Studio**
2. **Go to Project Settings:**
   - Click on **Project** → **Settings** (or press `Ctrl + Alt + S`)
   - Navigate to **Execution** → **Default**
3. **Set Chrome Executable Path:**
   - Find **Chrome executable path** field
   - Enter the path to your Chrome installation:
     - **Windows:** `C:\Program Files\Google\Chrome\Application\chrome.exe`
     - **Windows (64-bit):** `C:\Program Files (x86)\Google\Chrome\Application\chrome.exe`
     - **Alternative locations:**
       - `C:\Users\<YourUsername>\AppData\Local\Google\Chrome\Application\chrome.exe`
4. **Click Apply** and **OK**

#### Solution 2: Install Chrome Browser

If Chrome is not installed:
1. Download Chrome from: https://www.google.com/chrome/
2. Install Chrome
3. Follow Solution 1 to configure the path

#### Solution 3: Use Different Browser

If you prefer to use a different browser:

1. **In Katalon Studio:**
   - Go to **Project** → **Settings** → **Execution** → **Default**
   - Change **Default browser** to:
     - **Firefox** (if installed)
     - **Edge** (Windows default)
     - **Headless Chrome** (if configured)

2. **Or modify test scripts** to specify browser explicitly:
   ```groovy
   WebUI.openBrowser('http://localhost:5173', ['browserName': 'Firefox'])
   ```

#### Solution 4: Verify Chrome Installation

1. **Check if Chrome is installed:**
   - Open Command Prompt
   - Run: `where chrome` (Windows) or `which google-chrome` (Linux/Mac)
   - Note the path returned

2. **If Chrome is installed but path is different:**
   - Use the path found above in Solution 1

#### Solution 5: Update ChromeDriver

1. **In Katalon Studio:**
   - Go to **Tools** → **Update WebDrivers**
   - Select **ChromeDriver**
   - Click **Update**

### Issue 2: ERR_CONNECTION_REFUSED - Application Not Running

**Error Message:**
```
WebDriverException: unknown error: net::ERR_CONNECTION_REFUSED
Unable to navigate to 'http://localhost:5173/login'
```

**Root Cause:** The application is not running on the expected port.

**Solutions:**

#### Solution 1: Start the Application (REQUIRED Before Running Tests)

**You MUST start all services before running Agent tests!**

1. **Start MongoDB** (if not already running):
   ```bash
   # Windows
   net start MongoDB
   
   # Or check if it's running:
   # Open Services (services.msc) and verify MongoDB is running
   ```

2. **Start All Microservices:**
   
   **Option A: Start All at Once** (if you have a script):
   ```bash
   cd microservices
   npm run start:all
   ```
   
   **Option B: Start Individually** (open separate terminals):
   
   **Terminal 1 - API Gateway:**
   ```bash
   cd microservices/api-gateway
   npm run start:dev
   ```
   
   **Terminal 2 - Auth Service:**
   ```bash
   cd microservices/auth-service
   npm run start:dev
   ```
   
   **Terminal 3 - Property Service:**
   ```bash
   cd microservices/property-service
   npm run start:dev
   ```
   
   **Terminal 4 - Review Service:**
   ```bash
   cd microservices/review-service
   npm run start:dev
   ```
   
   **Terminal 5 - Agent Service:**
   ```bash
   cd microservices/agent-service
   npm run start:dev
   ```
   
   **Terminal 6 - Developer Properties Service:**
   ```bash
   cd microservices/developerproperties-service
   npm run start:dev
   ```

3. **Start Frontend (REQUIRED):**
   ```bash
   cd client
   npm run dev
   ```
   
   This should start the frontend on `http://localhost:5173`

4. **Verify All Services Are Running:**
   - Frontend: Open browser and go to `http://localhost:5173` - should see the application
   - API Gateway: Check `http://localhost:3000/api` - should respond
   - Each microservice should log "running on port X" when started

#### Solution 2: Verify Ports Are Correct

1. **Check if ports are in use:**
   ```bash
   # Windows
   netstat -ano | findstr :5173
   netstat -ano | findstr :3000
   ```

2. **If ports are different:**
   - Update `BASE_URL` in `Katalon/Keywords/agent/Agent_Keywords.groovy`
   - Change: `BASE_URL = 'http://localhost:5173'` to your actual port

#### Solution 3: Check Firewall/Antivirus

- Ensure Windows Firewall allows connections on ports 5173 and 3000
- Temporarily disable antivirus to test if it's blocking connections

### Issue 3: Browser Opens but Tests Fail

**Possible Causes:**
- Application not fully loaded
- Wrong URL configuration
- Network/firewall issues

**Solutions:**
1. **Verify Application is Running:**
   - Ensure your frontend is running on `http://localhost:5173`
   - Ensure API Gateway is running on `http://localhost:3000`
   - Ensure all microservices are running

2. **Check URL in Keywords:**
   - Open `Katalon/Keywords/agent/Agent_Keywords.groovy`
   - Verify `BASE_URL = 'http://localhost:5173'` matches your setup

### Issue 4: Element Click Intercepted Error

**Error Message:**
```
ElementClickInterceptedException: element click intercepted: Element ... is not clickable at point (x, y). 
Other element would receive the click: ...
```

**Root Cause:** Another element (usually navbar, menu, or overlay) is covering the button you're trying to click.

**Solutions:**

1. **Already Fixed in Keywords:**
   - The `Agent_Keywords.groovy` file includes a `clickWithFallback()` method
   - This method automatically handles intercepted clicks by:
     - Scrolling to the element
     - Waiting for element to be clickable
     - Using JavaScript click as fallback
   - All click operations in Agent keywords use this method

2. **If Issue Persists:**
   - Ensure you're using the latest version of `Agent_Keywords.groovy`
   - Check if navbar/menu is open and close it manually in test
   - Increase wait times before clicking

3. **Manual Fix (if needed):**
   - Add explicit wait: `WebUI.delay(2)` before clicking
   - Scroll to element: `WebUI.scrollToElement(element, 5)`
   - Use JavaScript click: `WebUI.executeJavaScript('arguments[0].click();', Arrays.asList(element))`

### Issue 5: Element Not Found Errors

**Possible Causes:**
- Page structure changed
- Timing issues
- Wrong selectors

**Solutions:**
1. **Update Object Repository:**
   - Use Katalon's **Spy Web** tool to capture updated elements
   - Update selectors in Object Repository files

2. **Add Wait Times:**
   - Increase wait times in keywords if pages load slowly
   - Use `WebUI.waitForPageLoad()` before interactions

### Issue 6: Authentication Failures

**Possible Causes:**
- Wrong credentials
- User not seeded in database
- Session expired

**Solutions:**
1. **Verify Test Data:**
   - Ensure admin user exists: `admin@realestate.com` / `Password123!`
   - Check seed data in your database

2. **Update Credentials:**
   - Modify credentials in test scripts if your seed data differs
   - Or update `Login_Keywords.groovy` helper methods

## Quick Fix Checklist

**Before Running Tests:**
- [ ] MongoDB is running
- [ ] All microservices are started (API Gateway, Auth, Property, Review, Agent, DeveloperProperties)
- [ ] Frontend is running (`npm run dev` in client folder)
- [ ] Application is accessible at `http://localhost:5173` in browser
- [ ] API Gateway is accessible at `http://localhost:3000/api`

**Browser Configuration:**
- [ ] Browser (Chrome/Edge/Firefox) is installed
- [ ] Browser path is configured in Katalon Studio Project Settings (if needed)
- [ ] WebDriver is updated (Tools → Update WebDrivers)

**Test Data:**
- [ ] Test data (users/agents) exists in database
- [ ] Admin user exists: `admin@realestate.com` / `Password123!`

**Configuration:**
- [ ] Object Repository selectors are correct
- [ ] Network/firewall allows connections
- [ ] BASE_URL in keywords matches your setup

## Testing the Configuration

### Step 1: Verify Application is Running

**Before running any tests, verify the application is accessible:**

1. Open your browser manually
2. Navigate to `http://localhost:5173`
3. You should see the Real Estate application homepage
4. If you see "This site can't be reached" or connection error, the application is NOT running

### Step 2: Test Browser Configuration

After ensuring the application is running, test with a simple script:

```groovy
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI

WebUI.openBrowser('')
WebUI.navigateToUrl('http://localhost:5173')
WebUI.delay(3)
WebUI.closeBrowser()
```

**If this works:**
- ✅ Browser configuration is correct
- ✅ Application is running
- ✅ You can proceed with Agent tests

**If this fails:**
- ❌ Check if application is running (Step 1)
- ❌ Check browser configuration
- ❌ Check firewall/antivirus settings

## Additional Resources

- [Katalon Studio Troubleshooting Guide](https://docs.katalon.com/katalon-studio/troubleshooting/troubleshoot-common-exceptions)
- [ChromeDriver Setup](https://docs.katalon.com/katalon-studio/docs/configure-execution-settings.html)

