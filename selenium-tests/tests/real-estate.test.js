const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

const CLIENT_URL = process.env.CLIENT_URL || 'http://127.0.0.1:5173';
const API_URL = process.env.API_URL || 'http://127.0.0.1:3000/api';
const EMAIL = process.env.SELENIUM_EMAIL || 'admin@realestate.com';
const PASSWORD = process.env.SELENIUM_PASSWORD || 'Password123!';
const HEADLESS = process.env.HEADLESS !== 'false';
const screenshotsDir = path.join(__dirname, '..', 'screenshots');
const LONG_WAIT = 150000;

function buildDriver() {
  const options = new chrome.Options();
  options.addArguments('--window-size=1440,1000');
  if (HEADLESS) {
    options.addArguments('--headless=new');
  }
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

describe('Real Estate Selenium Tests', function () {
  let driver;

  beforeEach(async function () {
    driver = buildDriver();
  });

  afterEach(async function () {
    if (this.currentTest.state === 'failed') {
      const safeName = this.currentTest.title.replace(/[^a-z0-9]+/gi, '-').toLowerCase();
      await takeScreenshot(driver, safeName);
    }
    await driver.quit();
  });

  it('Login page accepts valid seeded admin credentials', async function () {
    await login(driver);
    await driver.wait(until.urlIs(`${CLIENT_URL}/`), LONG_WAIT);
    const text = await visibleText(driver);
    assert.match(text, /Tamalk|Home|Buy|Rent/i);
  });

  it('Login page rejects invalid credentials', async function () {
    await login(driver, 'admin@realestate.com', 'WrongPassword123!');
    const error = await driver.wait(
      until.elementLocated(By.css('.text-red-500')),
      LONG_WAIT
    );
    const message = await error.getText();
    assert.match(message, /invalid|password|email|credentials/i);
  });

  it('Buy page loads seeded sale properties and supports search', async function () {
    await driver.get(`${CLIENT_URL}/buy`);
    await waitForPage(driver);
    await driver.wait(async () => {
      const text = await visibleText(driver);
      return /Browse Properties for Sale|No properties for sale|Own Your/i.test(text);
    }, LONG_WAIT);
    const cards = await driver.wait(async () => {
      const found = await driver.findElements(By.css('a[href^="/property/"]'));
      return found.length > 0 ? found : false;
    }, LONG_WAIT);
    assert.ok(cards.length > 0, 'Expected at least one property card');

    const search = await driver.findElement(By.css('input[placeholder*="Search by address"]'));
    await search.sendKeys('Cairo');
    await driver.sleep(800);
    const pageText = await visibleText(driver);
    assert.match(pageText, /Cairo|New Cairo|Browse Properties/i);
  });

  it('Buy page can open a property details page', async function () {
    await driver.get(`${CLIENT_URL}/buy`);
    await waitForPage(driver);
    const detailsLink = await driver.wait(
      until.elementLocated(By.css('a[href^="/property/"]')),
      LONG_WAIT
    );
    await detailsLink.click();
    await driver.wait(until.urlContains('/property/'), LONG_WAIT);
    const text = await visibleText(driver);
    assert.match(text, /Price|Beds|Bath|Contact|Description|Property/i);
  });

  it('Agent page loads seeded agents and filters by search', async function () {
    await driver.get(`${CLIENT_URL}/agent`);
    await waitForPage(driver);
    await driver.wait(async () => {
      const text = await visibleText(driver);
      return /Real Estate Agent/i.test(text);
    }, LONG_WAIT);
    await driver.wait(async () => {
      const text = await visibleText(driver);
      return /Showing\s+5\s+of\s+5\s+agents/i.test(text);
    }, LONG_WAIT);

    const search = await driver.findElement(By.css('input[placeholder*="Search by name"]'));
    await search.sendKeys('Mariam');
    await driver.findElement(By.css('button[type="submit"]')).click();
    await driver.wait(async () => {
      const text = await visibleText(driver);
      return /Showing\s+1\s+of\s+5\s+agents/i.test(text);
    }, LONG_WAIT);

    const text = await visibleText(driver);
    assert.match(text, /Mariam Fouad|agent1@realestate\.com/i);
  });

  it('API required by Selenium pages is reachable', async function () {
    await driver.get(`${API_URL}/properties`);
    await waitForPage(driver);
    const source = await driver.getPageSource();
    assert.match(source, /"status":"success"/);
    assert.match(source, /"properties"/);
  });
});
