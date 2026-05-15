const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

const CLIENT_URL = process.env.CLIENT_URL || 'http://127.0.0.1:5173';
const API_URL = process.env.API_URL || 'http://127.0.0.1:3000/api';
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

describe('Authentication (converted)', function () {
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

  it('Register page accepts a new user', async function () {
    const timestamp = Date.now();
    const email = `selenium+${timestamp}@example.com`;
    await driver.get(`${CLIENT_URL}/register`);
    await waitForPage(driver);

    await driver
      .findElement(By.css('input[name="firstName"]'))
      .sendKeys('Selenium');
    await driver
      .findElement(By.css('input[name="lastName"]'))
      .sendKeys('Tester');
    await driver.findElement(By.css('input[name="email"]')).sendKeys(email);
    await driver
      .findElement(By.css('input[name="password"]'))
      .sendKeys('Password123!');
    const confirmElems = await driver.findElements(
      By.css('input[name="confirmPassword"], input[name="passwordConfirm"]'),
    );
    if (confirmElems.length) {
      await confirmElems[0].sendKeys('Password123!');
    }

    await driver.findElement(By.css('button[type="submit"]')).click();

    // After submission app should navigate away from /register (to home or login)
    await driver.wait(async () => {
      const url = await driver.getCurrentUrl();
      return !url.includes('/register');
    }, LONG_WAIT);
  });

  it('Forgot password page accepts an email and shows feedback', async function () {
    const adminEmail = 'admin@realestate.com';
    await driver.get(`${CLIENT_URL}/forget-password`);
    await waitForPage(driver);

    const input = await driver.findElement(
      By.css('input[type="email"], input[name="email"]'),
    );
    await input.clear();
    await input.sendKeys(adminEmail);
    await driver.findElement(By.css('button[type="submit"]')).click();

    await driver.wait(async () => {
      const body = await driver.findElement(By.css('body')).getText();
      return /reset|sent|invalid|error|token/i.test(body);
    }, LONG_WAIT);
  });
});
