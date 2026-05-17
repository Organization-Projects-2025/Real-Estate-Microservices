const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

const CLIENT_URL = process.env.CLIENT_URL || 'http://127.0.0.1:5173';
const EMAIL = process.env.SELENIUM_EMAIL || 'admin@realestate.com';
const PASSWORD =
  process.env.SELENIUM_PASSWORD ||
  process.env.SEED_COMMON_PASSWORD ||
  'Str0ngP@ssw0rd!2026';
const HEADLESS = process.env.HEADLESS !== 'false';
const screenshotsDir = path.join(__dirname, '..', 'screenshots');
const LONG_WAIT = 4000;

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

async function login(driver) {
  await driver.get(`${CLIENT_URL}/login`);
  await waitForPage(driver);
  await driver.findElement(By.css('input[name="email"]')).sendKeys(EMAIL);
  await driver
    .findElement(By.css('input[name="password"]'))
    .sendKeys(PASSWORD);
  await driver.findElement(By.css('button[type="submit"]')).click();
  await driver.wait(async () => {
    const url = await driver.getCurrentUrl();
    return !url.includes('/login');
  }, LONG_WAIT);
}

describe('Admin (converted)', function () {
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

  it('Admin Dashboard accessible from user menu', async function () {
    await login(driver);
    await driver.get(`${CLIENT_URL}/admin`);
    await waitForPage(driver);

    const url = await driver.getCurrentUrl();
    assert.ok(url.includes('/admin'));
  });

  it('Admin can view Filters Management page', async function () {
    await login(driver);
    await driver.get(`${CLIENT_URL}/admin/filters`);
    await waitForPage(driver);

    const url = await driver.getCurrentUrl();
    assert.ok(url.includes('/admin/filters'));
  });

  it('Admin can view Users Management page', async function () {
    await login(driver);
    await driver.get(`${CLIENT_URL}/admin/users`);
    await waitForPage(driver);

    const url = await driver.getCurrentUrl();
    assert.ok(url.includes('/admin/users'));
  });

  it('Admin can view Properties page', async function () {
    await login(driver);
    await driver.get(`${CLIENT_URL}/admin/properties`);
    await waitForPage(driver);

    const url = await driver.getCurrentUrl();
    assert.ok(url.includes('/admin/properties'));
  });

  it('Admin can view Reviews page', async function () {
    await login(driver);
    await driver.get(`${CLIENT_URL}/admin/reviews`);
    await waitForPage(driver);

    const url = await driver.getCurrentUrl();
    assert.ok(url.includes('/admin/reviews'));
  });

  it('Admin can view Settings page', async function () {
    await login(driver);
    await driver.get(`${CLIENT_URL}/admin/settings`);
    await waitForPage(driver);

    const url = await driver.getCurrentUrl();
    assert.ok(url.includes('/admin/settings'));
  });
});
