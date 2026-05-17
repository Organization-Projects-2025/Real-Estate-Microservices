const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

const CLIENT_URL = process.env.CLIENT_URL || 'http://127.0.0.1:5173';
const API_URL = process.env.API_URL || 'http://127.0.0.1:3000/api';
const EMAIL = process.env.SELENIUM_EMAIL || 'admin@realestate.com';
const PASSWORD =
  process.env.SELENIUM_PASSWORD ||
  process.env.SEED_COMMON_PASSWORD ||
  'Str0ngP@ssw0rd!2026';
const HEADLESS = process.env.HEADLESS !== 'false';
const screenshotsDir = path.join(__dirname, '..', 'screenshots');
const LONG_WAIT = 30000;

function buildDriver() {
  const options = new chrome.Options();
  options.addArguments('--window-size=1440,1000');
  if (HEADLESS) {
    options.addArguments('--headless=new');
  }
  // Disable password manager and leak detection UI to avoid popups
  options.addArguments(
    '--disable-features=PasswordLeakDetection,PasswordManager,AutofillServerCommunication',
  );
  // Stabilizing flags to reduce crashes when running many chrome instances
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

async function visibleText(driver) {
  return driver.findElement(By.css('body')).getText();
}

async function waitForText(driver, matcher) {
  await driver.wait(async () => {
    const text = await visibleText(driver);
    return matcher.test(text);
  }, LONG_WAIT);
}

async function takeScreenshot(driver, name) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
  const image = await driver.takeScreenshot();
  fs.writeFileSync(path.join(screenshotsDir, `${name}.png`), image, 'base64');
}

async function login(driver, email = EMAIL, password = PASSWORD) {
  await driver.get(`${CLIENT_URL}/login`);
  await waitForPage(driver);
  await driver.findElement(By.css('input[name="email"]')).clear();
  await driver.findElement(By.css('input[name="email"]')).sendKeys(email);
  await driver.findElement(By.css('input[name="password"]')).clear();
  await driver.findElement(By.css('input[name="password"]')).sendKeys(password);
  await driver.findElement(By.css('button[type="submit"]')).click();
}

async function loginAndWaitHome(driver, email = EMAIL, password = PASSWORD) {
  await login(driver, email, password);
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
      return;
    } catch (err) {
      // try next button
    }
  }
  throw new Error('Could not locate authenticated user menu button');
}

async function goToProfile(driver) {
  await openUserMenu(driver);
  const profileLink = await driver.wait(
    until.elementLocated(By.xpath("//a[normalize-space()='My Profile']")),
    LONG_WAIT,
  );
  await profileLink.click();
}

async function goToAdminFilters(driver) {
  try {
    await openUserMenu(driver);
    const adminLink = await driver.wait(
      until.elementLocated(
        By.xpath(
          "//a[contains(@href, '/admin') or contains(normalize-space(.), 'Admin Dashboard') or contains(., 'Admin') ]",
        ),
      ),
      LONG_WAIT,
    );
    await driver.executeScript('arguments[0].scrollIntoView(true);', adminLink);
    await adminLink.click();
  } catch (err) {
    // Fallback: navigate directly to admin filters if menu navigation fails
    try {
      await driver.get(`${CLIENT_URL}/admin/filters`);
    } catch (e) {
      // ignore navigation error
    }
  }
}

async function selectFirstOptionValue(driver, selector) {
  const select = await driver.findElement(By.css(selector));
  await driver.wait(async () => {
    const options = await select.findElements(By.css('option'));
    return options.length > 1;
  }, LONG_WAIT);
  const options = await select.findElements(By.css('option'));
  const optionText = await options[1].getText();
  await select.sendKeys(optionText);
  return optionText;
}

describe('Real Estate Selenium Core', function () {
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
      // session may already be closed; ignore
    }
  });
  it('Home page search routes to Buy with query', async function () {
    await driver.get(`${CLIENT_URL}/`);
    await waitForPage(driver);
    const searchInput = await driver.findElement(
      By.css('input[placeholder*="Enter an address"]'),
    );
    await searchInput.sendKeys('Cairo');
    await driver.findElement(By.css('form button[type="submit"]')).click();
    await driver.wait(until.urlContains('/buy?search='), LONG_WAIT);
    const buySearch = await driver.wait(
      until.elementLocated(
        By.css('input[placeholder*="Search by address, type, price"]'),
      ),
      LONG_WAIT,
    );
    const value = await buySearch.getAttribute('value');
    assert.match(value, /Cairo/i);
  });
  it('API required by Selenium pages is reachable', async function () {
    await driver.get(`${API_URL}/properties`);
    await waitForPage(driver);
    const source = await driver.getPageSource();
    assert.match(source, /"status":"success"/);
    assert.match(source, /"properties"/);
  });
});
