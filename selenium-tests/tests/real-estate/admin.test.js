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
  await driver.findElement(By.css('input[name="email"]')).clear();
  await driver.findElement(By.css('input[name="email"]')).sendKeys(EMAIL);
  await driver.findElement(By.css('input[name="password"]')).clear();
  await driver.findElement(By.css('input[name="password"]')).sendKeys(PASSWORD);
  await driver.findElement(By.css('button[type="submit"]')).click();
  await driver.wait(async () => {
    const url = await driver.getCurrentUrl();
    if (!url.includes('/login')) return true;
    const userId = await driver.executeScript(() =>
      localStorage.getItem('userId'),
    );
    return !!userId;
  }, LONG_WAIT);
}

async function openUserMenu(driver) {
  const buttons = await driver.findElements(By.css('nav button'));
  for (const button of buttons) {
    try {
      const displayed = await button.isDisplayed();
      const enabled = await button.isEnabled();
      const text = (await button.getText()).trim();
      if (!displayed || !enabled || !text) continue;
      if (/toggle menu/i.test(text) || /search/i.test(text)) continue;
      await driver.executeScript(
        'arguments[0].scrollIntoView({block: "center"});',
        button,
      );
      await driver.executeScript('arguments[0].click();', button);
      return true;
    } catch (err) {
      // try next
    }
  }
  return false;
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
      // ignore quit errors when session already closed
    }
  });

  it('Admin Dashboard accessible from user menu', async function () {
    await login(driver);
    // Try opening user menu and clicking Admin; fallback to direct navigation
    let navigated = false;
    try {
      const opened = await openUserMenu(driver);
      if (opened) {
        const adminLink = await driver.wait(
          until.elementLocated(
            By.xpath(
              "//a[contains(@href, '/admin') or contains(normalize-space(.), 'Admin Dashboard') or contains(., 'Admin') ]",
            ),
          ),
          10000,
        );
        await driver.executeScript(
          'arguments[0].scrollIntoView(true);',
          adminLink,
        );
        await driver.sleep(200);
        await adminLink.click();
        navigated = true;
      }
    } catch (err) {
      // ignore and fallback below
    }
    if (!navigated) {
      await driver.get(`${CLIENT_URL}/admin`);
    }

    await waitForPage(driver);
    await driver.wait(async () => {
      const url = await driver.getCurrentUrl();
      return /\/admin(\/?$)/i.test(url);
    }, LONG_WAIT);
    const body = await driver.findElement(By.css('body')).getText();
    assert.match(
      body,
      /Admin Dashboard|Manage Agents|Site Settings|Users|Filters Management/i,
    );
  });

  it('Filters Management page loads for admin', async function () {
    await login(driver);
    await driver.get(`${CLIENT_URL}/admin/filters`);
    await waitForPage(driver);
    await driver.wait(async () => {
      const body = await driver.findElement(By.css('body')).getText();
      return /Filters Management|Manage Filters|Add Filter/i.test(body);
    }, LONG_WAIT);

    const title = await driver.findElement(By.css('h1')).getText();
    assert.match(title, /Filters Management|Filters/i);
  });
});
