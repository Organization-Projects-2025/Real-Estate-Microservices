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
const LONG_WAIT = 37500;

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
    } catch (err) {}
  }
  throw new Error('Could not locate authenticated user menu button');
}

describe('Profile (converted)', function () {
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

  it('Profile page shows user info and can enter edit mode', async function () {
    await login(driver);
    await openUserMenu(driver);
    const profileLink = await driver.wait(
      until.elementLocated(By.xpath("//a[normalize-space()='My Profile']")),
      LONG_WAIT,
    );
    await profileLink.click();

    await waitForPage(driver);
    await driver.wait(
      until.elementLocated(
        By.xpath(
          "//h1[contains(., 'Profile Settings') or contains(., 'Profile')]",
        ),
      ),
      LONG_WAIT,
    );

    const body = await visibleText(driver);
    assert.match(body, /Profile Settings|Personal Information|Email/i);

    const editBtn = await driver.findElement(
      By.xpath("//button[.//text()[contains(., 'Edit Profile')]]"),
    );
    await editBtn.click();
    await driver.wait(
      until.elementLocated(
        By.xpath("//button[normalize-space()='Save Changes']"),
      ),
      LONG_WAIT,
    );
  });
});
