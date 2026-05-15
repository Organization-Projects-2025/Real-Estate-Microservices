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
const LONG_WAIT = 60000;

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
  await openUserMenu(driver);
  const adminLink = await driver.wait(
    until.elementLocated(By.xpath("//a[normalize-space()='Admin Dashboard']")),
    LONG_WAIT,
  );
  await adminLink.click();
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
      LONG_WAIT,
    );
    const message = await error.getText();
    assert.match(message, /invalid|password|email|credentials/i);
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

  it('Rent page loads seeded rental listings', async function () {
    await driver.get(`${CLIENT_URL}/rent`);
    await waitForPage(driver);
    await waitForText(driver, /Find Your Perfect Rental Home/i);
    const cards = await driver.wait(async () => {
      const found = await driver.findElements(By.css('a[href^="/property/"]'));
      return found.length > 0 ? found : false;
    }, LONG_WAIT);
    assert.ok(cards.length > 0, 'Expected at least one rental property card');
  });

  it('Buy page loads seeded sale properties and supports search', async function () {
    await driver.get(`${CLIENT_URL}/buy`);
    await waitForPage(driver);
    await driver.wait(async () => {
      const text = await visibleText(driver);
      return /Browse Properties for Sale|No properties for sale|Own Your/i.test(
        text,
      );
    }, LONG_WAIT);
    const cards = await driver.wait(async () => {
      const found = await driver.findElements(By.css('a[href^="/property/"]'));
      return found.length > 0 ? found : false;
    }, LONG_WAIT);
    assert.ok(cards.length > 0, 'Expected at least one property card');

    const search = await driver.wait(
      until.elementLocated(
        By.css('input[placeholder*="Search by address, type, price"]'),
      ),
      LONG_WAIT,
    );
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
      LONG_WAIT,
    );
    await detailsLink.click();
    await driver.wait(until.urlContains('/property/'), LONG_WAIT);
    const text = await visibleText(driver);
    assert.match(text, /Price|Beds|Bath|Contact|Description|Property/i);
  });

  it('Agent page loads seeded agents and filters by search', async function () {
    await driver.get(`${CLIENT_URL}/agent`);
    await waitForPage(driver);
    await waitForText(driver, /Real Estate Agent/i);
    await driver.wait(async () => {
      const text = await visibleText(driver);
      return /Showing\s+5\s+of\s+5\s+agents/i.test(text);
    }, LONG_WAIT);

    const search = await driver.findElement(
      By.css('input[placeholder*="Search by name"]'),
    );
    await search.sendKeys('Mariam');
    await driver.findElement(By.css('button[type="submit"]')).click();
    await driver.wait(async () => {
      const text = await visibleText(driver);
      return /Showing\s+1\s+of\s+5\s+agents/i.test(text);
    }, LONG_WAIT);

    const text = await visibleText(driver);
    assert.match(text, /Mariam Fouad|agent1@realestate\.com/i);
  });

  it('Review form submits and redirects to reviews', async function () {
    await driver.get(`${CLIENT_URL}/write-review`);
    await waitForPage(driver);
    await waitForText(driver, /Write a Review/i);

    const nameInput = await driver.findElement(
      By.css('input[placeholder="Enter your name"]'),
    );
    await nameInput.sendKeys(`Selenium Reviewer ${Date.now()}`);

    await selectFirstOptionValue(driver, 'select');

    const fiveStar = await driver.findElement(
      By.css('[data-testid="rating-container"] [data-star="5"]'),
    );
    await fiveStar.click();

    const reviewText = await driver.findElement(
      By.css('textarea[placeholder*="Write your review"]'),
    );
    await reviewText.sendKeys('Great experience with responsive agents.');

    await driver.findElement(By.css('button[type="submit"]')).click();
    await driver.wait(until.urlContains('/reviews'), LONG_WAIT);
    await waitForText(driver, /Reviews/i);
  });

  it('Notifications page loads for authenticated admin', async function () {
    await loginAndWaitHome(driver);
    await driver.get(`${CLIENT_URL}/notifications`);
    await waitForPage(driver);
    await waitForText(driver, /Notifications/i);
    await driver.wait(async () => {
      const text = await visibleText(driver);
      return /Seed Data Loaded|No notifications/i.test(text);
    }, LONG_WAIT);
    const text = await visibleText(driver);
    assert.match(text, /Seed Data Loaded|No notifications/i);
  });

  it('Profile page shows editable user information', async function () {
    await loginAndWaitHome(driver);
    await goToProfile(driver);
    await waitForPage(driver);
    await waitForText(driver, /Profile Settings/i);
    const editButton = await driver.wait(
      until.elementLocated(By.xpath("//button[contains(., 'Edit Profile')]")),
      LONG_WAIT,
    );
    await editButton.click();
    const emailInput = await driver.wait(
      until.elementLocated(By.css('input[name="email"]')),
      LONG_WAIT,
    );
    const emailValue = await emailInput.getAttribute('value');
    assert.strictEqual(emailValue, EMAIL);
  });

  it('Admin filters page is accessible for admin users', async function () {
    await loginAndWaitHome(driver);
    await goToAdminFilters(driver);
    await waitForPage(driver);
    await driver.wait(until.urlContains('/admin'), LONG_WAIT);
    await waitForText(driver, /Filters Management/i);
    const addButton = await driver.wait(
      until.elementLocated(By.xpath("//button[contains(., 'Add Filter')]")),
      LONG_WAIT,
    );
    assert.ok(addButton, 'Expected Add Filter button to be present');
  });

  it('API required by Selenium pages is reachable', async function () {
    await driver.get(`${API_URL}/properties`);
    await waitForPage(driver);
    const source = await driver.getPageSource();
    assert.match(source, /"status":"success"/);
    assert.match(source, /"properties"/);
  });
});
