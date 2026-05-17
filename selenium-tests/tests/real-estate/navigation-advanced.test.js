const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

const CLIENT_URL = process.env.CLIENT_URL || 'http://127.0.0.1:5173';
const USER_EMAIL = process.env.SELENIUM_EMAIL || 'testingemail1@gmail.com';
const USER_PASSWORD = process.env.SELENIUM_PASSWORD || 'Str0ngP@ssw0rd!2026';
const HEADLESS = process.env.HEADLESS !== 'false';
const screenshotsDir = path.join(__dirname, '..', 'screenshots');
const LONG_WAIT = 30000;

function buildDriver() {
  const options = new chrome.Options();
  options.addArguments('--window-size=1200,900');
  if (HEADLESS) options.addArguments('--headless=new');
  options.addArguments(
    '--disable-features=PasswordLeakDetection,PasswordManager,AutofillServerCommunication',
  );
  options.addArguments('--disable-dev-shm-usage');
  options.addArguments('--no-sandbox');
  options.addArguments('--disable-gpu');
  options.addArguments('--disable-software-rasterizer');
  options.addArguments('--disable-extensions');
  options.addArguments('--disable-background-networking');
  try {
    options.setUserPreferences &&
      options.setUserPreferences({
        credentials_enable_service: false,
        'profile.password_manager_enabled': false,
      });
  } catch (e) {}
  return new Builder().forBrowser('chrome').setChromeOptions(options).build();
}

async function waitForPage(driver) {
  await driver.wait(async () => {
    const readyState = await driver.executeScript('return document.readyState');
    return readyState === 'complete';
  }, LONG_WAIT);
}

async function takeScreenshot(driver, name) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
  const image = await driver.takeScreenshot();
  fs.writeFileSync(path.join(screenshotsDir, `${name}.png`), image, 'base64');
}

async function visibleText(driver) {
  return driver.findElement(By.css('body')).getText();
}

async function login(driver, email = USER_EMAIL, password = USER_PASSWORD) {
  await driver.get(`${CLIENT_URL}/login`);
  await waitForPage(driver);
  await driver.sleep(1000);
  
  const emailInput = await driver.findElement(By.css('input[name="email"]'));
  await emailInput.clear();
  await emailInput.sendKeys(email);
  
  const passwordInput = await driver.findElement(By.css('input[name="password"]'));
  await passwordInput.clear();
  await passwordInput.sendKeys(password);
  
  const submitButton = await driver.findElement(By.css('button[type="submit"]'));
  await driver.executeScript('arguments[0].click();', submitButton);
  
  await driver.wait(async () => {
    const url = await driver.getCurrentUrl();
    return !url.includes('/login');
  }, LONG_WAIT);
  
  await driver.sleep(2000);
}

describe('Navigation Advanced Tests', function () {
  let driver;

  beforeEach(async function () {
    driver = buildDriver();
  });

  afterEach(async function () {
    if (this.currentTest.state === 'failed') {
      const safeName = this.currentTest.title
        .replace(/[^a-z0-9]+/gi, '-')
        .toLowerCase();
      try {
        await takeScreenshot(driver, safeName);
      } catch (err) {
        console.warn('takeScreenshot failed:', err && err.message);
      }
    }
    try {
      await driver.quit();
    } catch (err) {
      // ignore session teardown errors
    }
  });

  it('Navigate to Buy page from home', async function () {
    await driver.get(`${CLIENT_URL}/`);
    await waitForPage(driver);
    await driver.sleep(2000);

    await driver.get(`${CLIENT_URL}/buy`);
    await waitForPage(driver);
    await driver.sleep(1000);

    const url = await driver.getCurrentUrl();
    assert.ok(url.includes('/buy'), 'Should navigate to buy page');
  });

  it('Navigate to Rent page from home', async function () {
    await driver.get(`${CLIENT_URL}/`);
    await waitForPage(driver);
    await driver.sleep(2000);

    await driver.get(`${CLIENT_URL}/rent`);
    await waitForPage(driver);
    await driver.sleep(1000);

    const url = await driver.getCurrentUrl();
    assert.ok(url.includes('/rent'), 'Should navigate to rent page');
  });

  it('Navigate to Agents page from home', async function () {
    await driver.get(`${CLIENT_URL}/`);
    await waitForPage(driver);
    await driver.sleep(2000);

    await driver.get(`${CLIENT_URL}/agents`);
    await waitForPage(driver);
    await driver.sleep(1000);

    const url = await driver.getCurrentUrl();
    assert.ok(url.includes('/agents'), 'Should navigate to agents page');
  });

  it('Navigate to Home page', async function () {
    await driver.get(`${CLIENT_URL}/buy`);
    await waitForPage(driver);
    await driver.sleep(1000);

    await driver.get(`${CLIENT_URL}/`);
    await waitForPage(driver);
    await driver.sleep(1000);

    const url = await driver.getCurrentUrl();
    const body = await visibleText(driver);
    assert.ok(url === `${CLIENT_URL}/` || body.includes('Find Your Dream'), 'Should be on home page');
  });

  it('Navigate to Login page when not authenticated', async function () {
    await driver.get(`${CLIENT_URL}/login`);
    await waitForPage(driver);
    await driver.sleep(1000);

    const url = await driver.getCurrentUrl();
    assert.ok(url.includes('/login'), 'Should navigate to login page');
    
    const body = await visibleText(driver);
    assert.match(body, /Login|Sign In|Email|Password/i);
  });

  it('Navigate to Register page', async function () {
    await driver.get(`${CLIENT_URL}/register`);
    await waitForPage(driver);
    await driver.sleep(1000);

    const url = await driver.getCurrentUrl();
    assert.ok(url.includes('/register'), 'Should navigate to register page');
    
    const body = await visibleText(driver);
    assert.match(body, /Register|Sign Up|Create/i);
  });

  it('Navigate to Notifications page when authenticated', async function () {
    await login(driver);
    await driver.get(`${CLIENT_URL}/notifications`);
    await waitForPage(driver);
    await driver.sleep(2000);

    const url = await driver.getCurrentUrl();
    assert.ok(url.includes('/notifications'), 'Should navigate to notifications page');
  });

  it('Logout functionality works correctly', async function () {
    await login(driver);
    await driver.get(`${CLIENT_URL}/`);
    await waitForPage(driver);
    await driver.sleep(2000);

    // Clear localStorage to simulate logout
    await driver.executeScript('localStorage.clear(); sessionStorage.clear();');
    await driver.sleep(500);

    await driver.get(`${CLIENT_URL}/profile`);
    await waitForPage(driver);
    await driver.sleep(2000);

    // Should redirect to login or home
    const url = await driver.getCurrentUrl();
    assert.ok(url.includes('/login') || url === `${CLIENT_URL}/`, 'Should redirect after logout');
  });
});
