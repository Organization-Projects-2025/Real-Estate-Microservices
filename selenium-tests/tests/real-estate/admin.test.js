const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

const CLIENT_URL = process.env.CLIENT_URL || 'http://127.0.0.1:5173';
const EMAIL = process.env.SELENIUM_EMAIL || 'admin@realestate.com';
const PASSWORD = process.env.SELENIUM_PASSWORD || 'Password123!';
const HEADLESS = process.env.HEADLESS !== 'false';
const screenshotsDir = path.join(__dirname, '..', 'screenshots');
const LONG_WAIT = 150000;

function buildDriver() {
  const options = new chrome.Options();
  options.addArguments('--window-size=1200,900');
  if (HEADLESS) options.addArguments('--headless=new');
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
  await driver.wait(until.urlIs(`${CLIENT_URL}/`), LONG_WAIT);
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
      await takeScreenshot(driver, safeName);
    }
    await driver.quit();
  });

  it('Admin Dashboard accessible from user menu', async function () {
    await login(driver);
    // Prefer a direct anchor to the admin page
    const adminAnchors = await driver.findElements(
      By.xpath(
        "//a[contains(., 'Admin Dashboard') or contains(., 'Admin') or contains(@href, '/admin')]",
      ),
    );
    if (adminAnchors.length > 0) {
      try {
        await adminAnchors[0].click();
      } catch (err) {
        // fallback: scroll into view and click via JS if element not interactable
        await driver.executeScript(
          'arguments[0].scrollIntoView(true);',
          adminAnchors[0],
        );
        await driver.sleep(200);
        await driver.executeScript('arguments[0].click();', adminAnchors[0]);
      }
    } else {
      // If there's a button/menu labelled Admin, open it then click the admin link inside
      const menuBtn = await driver.wait(
        until.elementLocated(
          By.xpath(
            "//button[contains(., 'Admin') or .//span[normalize-space()='Admin']]",
          ),
        ),
        LONG_WAIT,
      );
      await menuBtn.click();
      const adminLink = await driver.wait(
        until.elementLocated(
          By.xpath(
            "//a[contains(., 'Admin Dashboard') or contains(., 'Admin') or contains(@href, '/admin') ]",
          ),
        ),
        LONG_WAIT,
      );
      await adminLink.click();
    }

    await waitForPage(driver);
    const body = await driver.findElement(By.css('body')).getText();
    assert.match(
      body,
      /Admin Dashboard|Manage Agents|Site Settings|Users|Filters Management/i,
    );
  });
});
