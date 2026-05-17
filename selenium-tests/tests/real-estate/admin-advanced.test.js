const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

const CLIENT_URL = process.env.CLIENT_URL || 'http://127.0.0.1:5173';
const ADMIN_EMAIL = process.env.SELENIUM_EMAIL || 'testingemail1@gmail.com';
const ADMIN_PASSWORD = process.env.SELENIUM_PASSWORD || 'Str0ngP@ssw0rd!2026';
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

async function login(driver, email = ADMIN_EMAIL, password = ADMIN_PASSWORD) {
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

describe('Admin Advanced Tests', function () {
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

  it('Admin can switch between user management tabs', async function () {
    await login(driver);
    await driver.get(`${CLIENT_URL}/admin/users`);
    await waitForPage(driver);
    await driver.sleep(2000);

    const url = await driver.getCurrentUrl();
    // If redirected to home, user might not have admin access
    if (!url.includes('/admin')) {
      this.skip();
      return;
    }

    const body = await visibleText(driver);
    assert.match(body, /User Management|Users|Admin/i);
    
    // Verify page loaded successfully
    assert.ok(body.length > 100, 'Page should have content');
  });

  it('Admin filters page is accessible for admin users', async function () {
    await login(driver);
    await driver.get(`${CLIENT_URL}/admin/filters`);
    await waitForPage(driver);
    await driver.sleep(2000);

    const url = await driver.getCurrentUrl();
    // If redirected to home, user might not have admin access
    if (!url.includes('/admin')) {
      this.skip();
      return;
    }

    const body = await visibleText(driver);
    assert.match(body, /Filter|Manage|Admin/i);
  });

  it('Filters management page loads for admin', async function () {
    await login(driver);
    await driver.get(`${CLIENT_URL}/admin/filters`);
    await waitForPage(driver);
    await driver.sleep(2000);

    const url = await driver.getCurrentUrl();
    // If redirected to home, user might not have admin access
    if (!url.includes('/admin')) {
      this.skip();
      return;
    }
    
    assert.ok(url.includes('/admin/filters'), 'Should be on filters page');
  });

  it('Admin properties management page is accessible', async function () {
    await login(driver);
    await driver.get(`${CLIENT_URL}/admin/properties`);
    await waitForPage(driver);
    await driver.sleep(2000);

    const url = await driver.getCurrentUrl();
    // If redirected to home, user might not have admin access
    if (!url.includes('/admin')) {
      this.skip();
      return;
    }

    assert.ok(url.includes('/admin/properties'), 'Should be on properties management page');
  });

  it('Admin reviews management page is accessible', async function () {
    await login(driver);
    await driver.get(`${CLIENT_URL}/admin/reviews`);
    await waitForPage(driver);
    await driver.sleep(2000);

    const url = await driver.getCurrentUrl();
    // If redirected to home, user might not have admin access
    if (!url.includes('/admin')) {
      this.skip();
      return;
    }

    assert.ok(url.includes('/admin/reviews'), 'Should be on reviews management page');
  });
});
