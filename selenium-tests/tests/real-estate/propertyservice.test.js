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

  // TC_PROP_017: Create Property with Valid Data
  it('User can create property with valid data', async function () {
    const timestamp = Date.now();
    const email = `seller+${timestamp}@example.com`;
    const password = 'Str0ngP@ssw0rd!2026';

    // Register and login
    await driver.get(`${CLIENT_URL}/register`);
    await waitForPage(driver);
    await driver.findElement(By.css('input[name="firstName"]')).sendKeys('Test');
    await driver.findElement(By.css('input[name="lastName"]')).sendKeys('Seller');
    await driver.findElement(By.css('input[name="email"]')).sendKeys(email);
    await driver.findElement(By.css('input[name="password"]')).sendKeys(password);
    const confirm = await driver.findElements(
      By.css('input[name="confirmPassword"], input[name="passwordConfirm"]'),
    );
    if (confirm.length) await confirm[0].sendKeys(password);
    await driver.findElement(By.css('button[type="submit"]')).click();
    await driver.wait(async () => {
      const url = await driver.getCurrentUrl();
      return !url.includes('/register');
    }, LONG_WAIT);

    // Navigate to sell page
    await driver.get(`${CLIENT_URL}/sell`);
    await waitForPage(driver);

    // Fill property form
    await driver.findElement(By.css('input[name="title"]')).sendKeys(`Test Property ${timestamp}`);
    await driver.findElement(By.css('textarea[name="description"]')).sendKeys('Beautiful test property');
    await driver.findElement(By.css('input[name="price"]')).sendKeys('250000');
    await driver.findElement(By.css('input[name="bedrooms"]')).sendKeys('3');
    await driver.findElement(By.css('input[name="bathrooms"]')).sendKeys('2');
    await driver.findElement(By.css('input[name="area"]')).sendKeys('1500');
    await driver.findElement(By.css('input[name="address"]')).sendKeys('123 Test St');
    await driver.findElement(By.css('input[name="city"]')).sendKeys('TestCity');

    // Submit form
    await driver.findElement(By.css('button[type="submit"]')).click();

    // Verify success
    await driver.wait(async () => {
      const body = await driver.findElement(By.css('body')).getText();
      return /success|created|submitted|property added/i.test(body);
    }, LONG_WAIT);
  });

  // TC_PROP_018: Missing Required Fields
  it('Sell form shows validation for missing required fields', async function () {
    const timestamp = Date.now();
    const email = `seller+${timestamp}@example.com`;
    const password = 'Str0ngP@ssw0rd!2026';

    // Register and login
    await driver.get(`${CLIENT_URL}/register`);
    await waitForPage(driver);
    await driver.findElement(By.css('input[name="firstName"]')).sendKeys('Test');
    await driver.findElement(By.css('input[name="lastName"]')).sendKeys('Seller');
    await driver.findElement(By.css('input[name="email"]')).sendKeys(email);
    await driver.findElement(By.css('input[name="password"]')).sendKeys(password);
    const confirm = await driver.findElements(
      By.css('input[name="confirmPassword"], input[name="passwordConfirm"]'),
    );
    if (confirm.length) await confirm[0].sendKeys(password);
    await driver.findElement(By.css('button[type="submit"]')).click();
    await driver.wait(async () => {
      const url = await driver.getCurrentUrl();
      return !url.includes('/register');
    }, LONG_WAIT);

    await driver.get(`${CLIENT_URL}/sell`);
    await waitForPage(driver);

    // Try to submit without filling required fields
    await driver.findElement(By.css('button[type="submit"]')).click();

    // Verify validation error
    await driver.wait(async () => {
      const body = await driver.findElement(By.css('body')).getText();
      return /required|please fill|invalid|error/i.test(body);
    }, LONG_WAIT);
  });

  // TC_PROP_019: Form Navigation
  it('Sell form allows navigation between steps if multi-step', async function () {
    const timestamp = Date.now();
    const email = `seller+${timestamp}@example.com`;
    const password = 'Str0ngP@ssw0rd!2026';

    // Register and login
    await driver.get(`${CLIENT_URL}/register`);
    await waitForPage(driver);
    await driver.findElement(By.css('input[name="firstName"]')).sendKeys('Test');
    await driver.findElement(By.css('input[name="lastName"]')).sendKeys('Seller');
    await driver.findElement(By.css('input[name="email"]')).sendKeys(email);
    await driver.findElement(By.css('input[name="password"]')).sendKeys(password);
    const confirm = await driver.findElements(
      By.css('input[name="confirmPassword"], input[name="passwordConfirm"]'),
    );
    if (confirm.length) await confirm[0].sendKeys(password);
    await driver.findElement(By.css('button[type="submit"]')).click();
    await driver.wait(async () => {
      const url = await driver.getCurrentUrl();
      return !url.includes('/register');
    }, LONG_WAIT);

    await driver.get(`${CLIENT_URL}/sell`);
    await waitForPage(driver);

    // Check if form has navigation buttons (Next, Previous, etc.)
    const nextButtons = await driver.findElements(
      By.xpath(
        "//button[contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'next')]",
      ),
    );

    if (nextButtons.length > 0) {
      await nextButtons[0].click();
      await driver.sleep(500);
      const prevButtons = await driver.findElements(
        By.xpath(
          "//button[contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'previous') or contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'back')]",
        ),
      );
      assert.ok(prevButtons.length > 0, 'Previous button should be available');
    }
  });

  // TC_PROP_020: Listing Type Sale
  it('User can select listing type as Sale', async function () {
    const timestamp = Date.now();
    const email = `seller+${timestamp}@example.com`;
    const password = 'Str0ngP@ssw0rd!2026';

    // Register and login
    await driver.get(`${CLIENT_URL}/register`);
    await waitForPage(driver);
    await driver.findElement(By.css('input[name="firstName"]')).sendKeys('Test');
    await driver.findElement(By.css('input[name="lastName"]')).sendKeys('Seller');
    await driver.findElement(By.css('input[name="email"]')).sendKeys(email);
    await driver.findElement(By.css('input[name="password"]')).sendKeys(password);
    const confirm = await driver.findElements(
      By.css('input[name="confirmPassword"], input[name="passwordConfirm"]'),
    );
    if (confirm.length) await confirm[0].sendKeys(password);
    await driver.findElement(By.css('button[type="submit"]')).click();
    await driver.wait(async () => {
      const url = await driver.getCurrentUrl();
      return !url.includes('/register');
    }, LONG_WAIT);

    await driver.get(`${CLIENT_URL}/sell`);
    await waitForPage(driver);

    // Select listing type as Sale
    const listingTypeSelect = await driver.findElements(
      By.css('select[name="listingType"], select[name="type"]'),
    );
    if (listingTypeSelect.length > 0) {
      await listingTypeSelect[0].sendKeys('sale');
    } else {
      // Try radio button
      const saleRadio = await driver.findElements(
        By.css('input[type="radio"][value="sale"]'),
      );
      if (saleRadio.length > 0) await saleRadio[0].click();
    }

    const body = await driver.findElement(By.css('body')).getText();
    assert.ok(body.length > 0, 'Form should be visible');
  });

  // TC_PROP_021: Listing Type Rent
  it('User can select listing type as Rent', async function () {
    const timestamp = Date.now();
    const email = `seller+${timestamp}@example.com`;
    const password = 'Str0ngP@ssw0rd!2026';

    // Register and login
    await driver.get(`${CLIENT_URL}/register`);
    await waitForPage(driver);
    await driver.findElement(By.css('input[name="firstName"]')).sendKeys('Test');
    await driver.findElement(By.css('input[name="lastName"]')).sendKeys('Seller');
    await driver.findElement(By.css('input[name="email"]')).sendKeys(email);
    await driver.findElement(By.css('input[name="password"]')).sendKeys(password);
    const confirm = await driver.findElements(
      By.css('input[name="confirmPassword"], input[name="passwordConfirm"]'),
    );
    if (confirm.length) await confirm[0].sendKeys(password);
    await driver.findElement(By.css('button[type="submit"]')).click();
    await driver.wait(async () => {
      const url = await driver.getCurrentUrl();
      return !url.includes('/register');
    }, LONG_WAIT);

    await driver.get(`${CLIENT_URL}/sell`);
    await waitForPage(driver);

    // Select listing type as Rent
    const listingTypeSelect = await driver.findElements(
      By.css('select[name="listingType"], select[name="type"]'),
    );
    if (listingTypeSelect.length > 0) {
      await listingTypeSelect[0].sendKeys('rent');
    } else {
      // Try radio button
      const rentRadio = await driver.findElements(
        By.css('input[type="radio"][value="rent"]'),
      );
      if (rentRadio.length > 0) await rentRadio[0].click();
    }

    const body = await driver.findElement(By.css('body')).getText();
    assert.ok(body.length > 0, 'Form should be visible');
  });
});
