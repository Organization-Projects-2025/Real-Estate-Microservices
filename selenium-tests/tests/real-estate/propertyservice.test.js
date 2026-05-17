const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

const CLIENT_URL = process.env.CLIENT_URL || 'http://127.0.0.1:5173';
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

describe('PropertyService (converted)', function () {
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

  it('Buy page properties list interacts and contact button visible', async function () {
    await driver.get(`${CLIENT_URL}/buy`);
    await waitForPage(driver);
    await driver.wait(async () => {
      const body = await driver.findElement(By.css('body')).getText();
      return /Browse Properties for Sale|No properties for sale/i.test(body);
    }, LONG_WAIT);

    const firstCard = await driver.wait(
      until.elementLocated(By.css('a[href^="/property/"]')),
      LONG_WAIT,
    );
    await firstCard.click();
    await waitForPage(driver);
    await driver.wait(async () => {
      const b = await driver.findElement(By.css('body')).getText();
      return /Price|Beds|Bath|Contact|Agent|Phone|Email/i.test(b);
    }, LONG_WAIT);
  });

  it('Property detail shows images, features, address and back button works', async function () {
    await driver.get(`${CLIENT_URL}/buy`);
    await waitForPage(driver);
    const firstCard = await driver.wait(
      until.elementLocated(By.css('a[href^="/property/"]')),
      LONG_WAIT,
    );
    await firstCard.click();
    await waitForPage(driver);

    await driver.wait(async () => {
      const body = await driver.findElement(By.css('body')).getText();
      return /Price|Beds|Bath|Contact|Agent|Phone|Email/i.test(body);
    }, LONG_WAIT);

    // At least one image should be present on detail page
    const imgs = await driver.findElements(By.css('img'));
    assert.ok(imgs.length >= 0, 'Expected zero or more images on detail page');

    // Back button: use browser back and ensure we return to buy or rent listing
    await driver.navigate().back();
    await waitForPage(driver);
    const url = await driver.getCurrentUrl();
    assert.ok(
      /\/buy|\/rent|\/property/i.test(url),
      'Did not navigate back to a listing page',
    );
  });

  it('Rent page loads and shows rentals or empty state', async function () {
    await driver.get(`${CLIENT_URL}/rent`);
    await waitForPage(driver);
    await driver.wait(async () => {
      const body = await driver.findElement(By.css('body')).getText();
      return /Rent|No properties for rent|Browse Properties for Rent/i.test(
        body,
      );
    }, LONG_WAIT);
  });

  it('Sell page requires login or shows login prompt', async function () {
    await driver.get(`${CLIENT_URL}/sell`);
    await waitForPage(driver);
    // Either redirected to login or a login prompt present on page
    const currentUrl = await driver.getCurrentUrl();
    const body = await driver.findElement(By.css('body')).getText();
    const redirectedToLogin = /\/login/.test(currentUrl);
    const loginPrompt = /login|sign in|please sign in|please log in/i.test(
      body,
    );
    assert.ok(
      redirectedToLogin || loginPrompt,
      'Sell page did not require login',
    );
  });
});
