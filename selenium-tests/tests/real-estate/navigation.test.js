const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

const CLIENT_URL = process.env.CLIENT_URL || 'http://127.0.0.1:5173';
const EMAIL = process.env.SELENIUM_EMAIL || 'user1@realestate.com';
const PASSWORD = process.env.SELENIUM_PASSWORD || 'Str0ngP@ssw0rd!2026';
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

describe('Navigation (converted)', function () {
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

  it('Main nav links navigate to their pages', async function () {
    await driver.get(`${CLIENT_URL}/`);
    await waitForPage(driver);

    const links = [
      { selector: "a[href='/buy']", verify: /Browse Properties for Sale|Buy/i },
      {
        selector: "a[href='/rent']",
        verify: /Find Your Perfect Rental Home|Rent/i,
      },
      {
        selector: "a[href='/agent']",
        verify: /Find a Real Estate Agent|Agent/i,
      },
      {
        selector: "a[href='/developer-properties']",
        verify: /New Projects|Developer Properties/i,
      },
    ];

    for (const l of links) {
      const el = await driver.findElement(By.css(l.selector));
      await el.click();
      await waitForPage(driver);
      const body = await driver.findElement(By.css('body')).getText();
      assert.match(body, l.verify);
      await driver.get(`${CLIENT_URL}/`);
      await waitForPage(driver);
    }
  });

  it('User dropdown opens after login and shows profile link', async function () {
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
      const userId = await driver.executeScript(() => localStorage.getItem('userId'));
      return !!userId;
    }, LONG_WAIT);

    // Try to open user dropdown/menu
    const buttons = await driver.findElements(By.css('nav button'));
    let opened = false;
    for (const b of buttons) {
      try {
        await driver.executeScript('arguments[0].scrollIntoView({block: "center"});', b);
        await driver.executeScript('arguments[0].click();', b);
        // wait briefly for dropdown content
        await driver.sleep(300);
        const found = await driver.findElements(By.xpath("//a[contains(., 'My Profile') or contains(., 'Profile') or contains(@href, '/profile')]") );
        if (found.length) { opened = true; break; }
      } catch (e) {
        // ignore and try next
      }
    }

    assert.ok(opened, 'User dropdown did not open or profile link not found');
  });
});
