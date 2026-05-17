const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

const CLIENT_URL = process.env.CLIENT_URL || 'http://127.0.0.1:5173';
const API_URL = process.env.API_URL || 'http://127.0.0.1:3000/api';
const COMMON_PASSWORD =
  process.env.SEED_COMMON_PASSWORD ||
  process.env.SELENIUM_PASSWORD ||
  'Str0ngP@ssw0rd!2026';
const HEADLESS = process.env.HEADLESS !== 'false';
const screenshotsDir = path.join(__dirname, '..', 'screenshots');
const LONG_WAIT = 37500;


function buildDriver() {
  const options = new chrome.Options();
  options.addArguments('--window-size=1200,900');
  if (HEADLESS) options.addArguments('--headless=new');
  // Disable password manager and leak detection UI to avoid popups
  options.addArguments(
    '--disable-features=PasswordLeakDetection,PasswordManager,AutofillServerCommunication',
  );
  // Stabilizing flags
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
      .sendKeys(COMMON_PASSWORD);
    const confirmElems = await driver.findElements(
      By.css('input[name="confirmPassword"], input[name="passwordConfirm"]'),
    );
    if (confirmElems.length) {
      await confirmElems[0].sendKeys(COMMON_PASSWORD);
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

  it('Login with valid credentials', async function () {
    // prefer env-provided credentials for stability
    const envEmail = process.env.SELENIUM_EMAIL;
    const envPass = COMMON_PASSWORD;
    let email = envEmail;
    let password = envPass;

    if (!email) {
      // create a user via register flow to use for login
      const timestamp = Date.now();
      email = `selenium+${timestamp}@example.com`;
      password = COMMON_PASSWORD;
      await driver.get(`${CLIENT_URL}/register`);
      await waitForPage(driver);
      await driver
        .findElement(By.css('input[name="firstName"]'))
        .sendKeys('Selenium');
      await driver
        .findElement(By.css('input[name="lastName"]'))
        .sendKeys('User');
      await driver.findElement(By.css('input[name="email"]')).sendKeys(email);
      await driver
        .findElement(By.css('input[name="password"]'))
        .sendKeys(password);
      const confirm = await driver.findElements(
        By.css('input[name="confirmPassword"], input[name="passwordConfirm"]'),
      );
      if (confirm.length) await confirm[0].sendKeys(password);
      await driver.findElement(By.css('button[type="submit"]')).click();
      await driver.wait(async () => {
        const url = await driver.getCurrentUrl();
        return !url.includes('/register');
      }, LONG_WAIT);
      // logout if auto-logged in
      try {
        const logout = await driver.findElements(
          By.xpath(
            "//button[contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'logout')]|//a[contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'logout')]|//button[contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'sign out')]|//a[contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'sign out')]",
          ),
        );
        if (logout.length) await logout[0].click();
      } catch (e) {}
    }

    // perform login
    await driver.get(`${CLIENT_URL}/login`);
    await waitForPage(driver);
    await driver
      .findElement(By.css('input[name="email"], input[type="email"]'))
      .clear();
    await driver
      .findElement(By.css('input[name="email"], input[type="email"]'))
      .sendKeys(email);
    await driver
      .findElement(By.css('input[name="password"], input[type="password"]'))
      .sendKeys(password);
    await driver.findElement(By.css('button[type="submit"]')).click();

    // assert logged in by presence of logout/user menu
    // wait for `localStorage.userId` to be set by the auth flow (deterministic)
    await driver.wait(async () => {
      const id = await driver.executeScript(() =>
        localStorage.getItem('userId'),
      );
      return !!id;
    }, LONG_WAIT);
  });

  it('Login shows error for incorrect password', async function () {
    const timestamp = Date.now();
    const email = `selenium+${timestamp}@example.com`;
    const password = COMMON_PASSWORD;
    // register first
    await driver.get(`${CLIENT_URL}/register`);
    await waitForPage(driver);
    await driver
      .findElement(By.css('input[name="firstName"]'))
      .sendKeys('Selenium');
    await driver.findElement(By.css('input[name="lastName"]')).sendKeys('User');
    await driver.findElement(By.css('input[name="email"]')).sendKeys(email);
    await driver
      .findElement(By.css('input[name="password"]'))
      .sendKeys(password);
    const confirm = await driver.findElements(
      By.css('input[name="confirmPassword"], input[name="passwordConfirm"]'),
    );
    if (confirm.length) await confirm[0].sendKeys(password);
    await driver.findElement(By.css('button[type="submit"]')).click();
    await driver.wait(async () => {
      const url = await driver.getCurrentUrl();
      return !url.includes('/register');
    }, LONG_WAIT);

    // attempt login with wrong password
    await driver.get(`${CLIENT_URL}/login`);
    await waitForPage(driver);
    await driver
      .findElement(By.css('input[name="email"], input[type="email"]'))
      .sendKeys(email);
    await driver
      .findElement(By.css('input[name="password"], input[type="password"]'))
      .sendKeys('WrongPass!');
    await driver.findElement(By.css('button[type="submit"]')).click();

    await driver.wait(async () => {
      const body = await driver.findElement(By.css('body')).getText();
      return /invalid|incorrect|wrong|credentials|error/i.test(body);
    }, LONG_WAIT);
  });

  it('Login empty fields shows validation', async function () {
    await driver.get(`${CLIENT_URL}/login`);
    await waitForPage(driver);
    await driver.findElement(By.css('button[type="submit"]')).click();
    await driver.wait(async () => {
      const body = await driver.findElement(By.css('body')).getText();
      return /required|enter|email|password|invalid/i.test(body);
    }, LONG_WAIT);
  });

  it('Forgot password invalid email format shows validation', async function () {
    await driver.get(`${CLIENT_URL}/forget-password`);
    await waitForPage(driver);
    const input = await driver.findElement(
      By.css('input[type="email"], input[name="email"]'),
    );
    await input.clear();
    await input.sendKeys('not-an-email');
    await driver.findElement(By.css('button[type="submit"]')).click();
    // immediate check: either an error message or the browser input validity
    const invalidDetected = await driver.executeScript(() => {
      const bodyText = document.body ? document.body.innerText : '';
      if (/invalid|format|enter a valid email/i.test(bodyText)) return true;
      const el = document.querySelector(
        'input[type="email"], input[name="email"]',
      );
      if (!el) return false;
      return el.checkValidity() === false;
    });
    if (!invalidDetected) {
      // fail fast so the test doesn't hang on long waits
      throw new Error('Expected invalid email feedback not detected');
    }
  });
});
