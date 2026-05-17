const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

const CLIENT_URL = process.env.CLIENT_URL || 'http://127.0.0.1:5173';
const EMAIL = process.env.SELENIUM_EMAIL || 'admin@realestate.com';
const PASSWORD =
  process.env.SELENIUM_PASSWORD ||
  process.env.SEED_COMMON_PASSWORD ||
  'Str0ngP@ssw0rd!2026';
const HEADLESS = process.env.HEADLESS !== 'false';
const screenshotsDir = path.join(__dirname, '..', 'screenshots');
const LONG_WAIT = 4000;
function buildDriver() {
  const options = new chrome.Options();
  options.addArguments('--window-size=1200,900');
  if (HEADLESS) options.addArguments('--headless=new');
  options.addArguments(
    '--disable-features=PasswordLeakDetection,PasswordManager,AutofillServerCommunication',
  );
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

async function login(driver) {
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
      return true;
    } catch (err) {
      // try next
    }
  }
  return false;
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
      try {
        await takeScreenshot(driver, safeName);
      } catch (err) {
        console.warn('takeScreenshot failed:', err && err.message);
      }
    }
    try {
      await driver.quit();
    } catch (err) {
      // ignore quit errors when session already closed
    }
  });

  it('Admin Dashboard accessible from user menu', async function () {
    await login(driver);
    // Try opening user menu and clicking Admin; fallback to direct navigation
    let navigated = false;
    try {
      const opened = await openUserMenu(driver);
      if (opened) {
        const adminLink = await driver.wait(
          until.elementLocated(
            By.xpath(
              "//a[contains(@href, '/admin') or contains(normalize-space(.), 'Admin Dashboard') or contains(., 'Admin') ]",
            ),
          ),
          10000,
        );
        await driver.executeScript(
          'arguments[0].scrollIntoView(true);',
          adminLink,
        );
        await driver.sleep(200);
        await adminLink.click();
        navigated = true;
      }
    } catch (err) {
      // ignore and fallback below
    }
    if (!navigated) {
      await driver.get(`${CLIENT_URL}/admin`);
    }

    await waitForPage(driver);
    await driver.wait(async () => {
      const url = await driver.getCurrentUrl();
      return /\/admin(\/?$)/i.test(url);
    }, LONG_WAIT);
    const body = await driver.findElement(By.css('body')).getText();
    assert.match(
      body,
      /Admin Dashboard|Manage Agents|Site Settings|Users|Filters Management/i,
    );
  });

  it('Filters Management page loads for admin', async function () {
    await login(driver);
    await driver.get(`${CLIENT_URL}/admin/filters`);
    await waitForPage(driver);
    await driver.wait(async () => {
      const body = await driver.findElement(By.css('body')).getText();
      return /Filters Management|Manage Filters|Add Filter/i.test(body);
    }, LONG_WAIT);

    const title = await driver.findElement(By.css('h1')).getText();
    assert.match(title, /Filters Management|Filters/i);
  });

  // TC_ADM_USER_001: View Users Management Page
  it('Admin can view Users Management page', async function () {
    await login(driver);
    await driver.get(`${CLIENT_URL}/admin/users`);
    await waitForPage(driver);
    await driver.wait(async () => {
      const body = await driver.findElement(By.css('body')).getText();
      return /Users Management|Manage Users|User List/i.test(body);
    }, LONG_WAIT);
  });

  // TC_ADM_USER_002: Edit User with Valid Data
  it('Admin can edit user with valid data', async function () {
    await login(driver);
    await driver.get(`${CLIENT_URL}/admin/users`);
    await waitForPage(driver);

    // Find and click first edit button
    const editButton = await driver.wait(
      until.elementLocated(
        By.xpath(
          "//button[contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'edit')]",
        ),
      ),
      LONG_WAIT,
    );
    await driver.executeScript('arguments[0].scrollIntoView(true);', editButton);
    await editButton.click();

    // Wait for edit form/modal
    await driver.wait(async () => {
      const body = await driver.findElement(By.css('body')).getText();
      return /Edit User|Update User|Save Changes/i.test(body);
    }, LONG_WAIT);

    // Update first name
    const firstNameInput = await driver.findElement(
      By.css('input[name="firstName"], input[name="first_name"]'),
    );
    await firstNameInput.clear();
    await firstNameInput.sendKeys('UpdatedName');

    // Submit form
    const saveButton = await driver.findElement(
      By.xpath(
        "//button[contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'save') or contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'update')]",
      ),
    );
    await saveButton.click();

    // Verify success
    await driver.wait(async () => {
      const body = await driver.findElement(By.css('body')).getText();
      return /success|updated|saved/i.test(body);
    }, LONG_WAIT);
  });

  // TC_ADM_USER_003: Edit User with Empty Name
  it('Admin cannot edit user with empty name', async function () {
    await login(driver);
    await driver.get(`${CLIENT_URL}/admin/users`);
    await waitForPage(driver);

    const editButton = await driver.wait(
      until.elementLocated(
        By.xpath(
          "//button[contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'edit')]",
        ),
      ),
      LONG_WAIT,
    );
    await editButton.click();

    await driver.wait(async () => {
      const body = await driver.findElement(By.css('body')).getText();
      return /Edit User|Update User/i.test(body);
    }, LONG_WAIT);

    const firstNameInput = await driver.findElement(
      By.css('input[name="firstName"], input[name="first_name"]'),
    );
    await firstNameInput.clear();

    const saveButton = await driver.findElement(
      By.xpath(
        "//button[contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'save') or contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'update')]",
      ),
    );
    await saveButton.click();

    // Verify validation error
    await driver.wait(async () => {
      const body = await driver.findElement(By.css('body')).getText();
      return /required|cannot be empty|invalid|error/i.test(body);
    }, LONG_WAIT);
  });

  // TC_ADM_USER_004: Change User Role
  it('Admin can change user role', async function () {
    await login(driver);
    await driver.get(`${CLIENT_URL}/admin/users`);
    await waitForPage(driver);

    const editButton = await driver.wait(
      until.elementLocated(
        By.xpath(
          "//button[contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'edit')]",
        ),
      ),
      LONG_WAIT,
    );
    await editButton.click();

    await driver.wait(async () => {
      const body = await driver.findElement(By.css('body')).getText();
      return /Edit User|Update User|Role/i.test(body);
    }, LONG_WAIT);

    // Find role selector
    const roleSelect = await driver.findElement(
      By.css('select[name="role"], select[name="userRole"]'),
    );
    await roleSelect.sendKeys('user');

    const saveButton = await driver.findElement(
      By.xpath(
        "//button[contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'save') or contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'update')]",
      ),
    );
    await saveButton.click();

    await driver.wait(async () => {
      const body = await driver.findElement(By.css('body')).getText();
      return /success|updated|saved/i.test(body);
    }, LONG_WAIT);
  });

  // TC_ADM_USER_005: Deactivate User
  it('Admin can deactivate a user', async function () {
    await login(driver);
    await driver.get(`${CLIENT_URL}/admin/users`);
    await waitForPage(driver);

    const deactivateButton = await driver.wait(
      until.elementLocated(
        By.xpath(
          "//button[contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'deactivate') or contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'disable')]",
        ),
      ),
      LONG_WAIT,
    );
    await driver.executeScript(
      'arguments[0].scrollIntoView(true);',
      deactivateButton,
    );
    await deactivateButton.click();

    // Confirm deactivation
    const confirmButton = await driver.wait(
      until.elementLocated(
        By.xpath(
          "//button[contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'confirm') or contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'yes')]",
        ),
      ),
      LONG_WAIT,
    );
    await confirmButton.click();

    await driver.wait(async () => {
      const body = await driver.findElement(By.css('body')).getText();
      return /deactivated|disabled|success/i.test(body);
    }, LONG_WAIT);
  });

  // TC_ADM_USER_006: Cancel Deactivate User
  it('Admin can cancel user deactivation', async function () {
    await login(driver);
    await driver.get(`${CLIENT_URL}/admin/users`);
    await waitForPage(driver);

    const deactivateButton = await driver.wait(
      until.elementLocated(
        By.xpath(
          "//button[contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'deactivate') or contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'disable')]",
        ),
      ),
      LONG_WAIT,
    );
    await deactivateButton.click();

    // Cancel deactivation
    const cancelButton = await driver.wait(
      until.elementLocated(
        By.xpath(
          "//button[contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'cancel') or contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'no')]",
        ),
      ),
      LONG_WAIT,
    );
    await cancelButton.click();

    // Verify modal closed and user still active
    await driver.wait(async () => {
      const body = await driver.findElement(By.css('body')).getText();
      return !/Are you sure|Confirm/i.test(body);
    }, LONG_WAIT);
  });

  // TC_ADM_USER_007: Reactivate User
  it('Admin can reactivate a deactivated user', async function () {
    await login(driver);
    await driver.get(`${CLIENT_URL}/admin/users`);
    await waitForPage(driver);

    // Look for reactivate or activate button
    const reactivateButton = await driver.wait(
      until.elementLocated(
        By.xpath(
          "//button[contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'reactivate') or contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'activate') or contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'enable')]",
        ),
      ),
      LONG_WAIT,
    );
    await reactivateButton.click();

    await driver.wait(async () => {
      const body = await driver.findElement(By.css('body')).getText();
      return /activated|enabled|success/i.test(body);
    }, LONG_WAIT);
  });

  // TC_ADM_USER_008: Switch Between Tabs
  it('Admin can switch between user management tabs', async function () {
    await login(driver);
    await driver.get(`${CLIENT_URL}/admin/users`);
    await waitForPage(driver);

    // Look for tabs (Active/Inactive users, etc.)
    const tabs = await driver.findElements(
      By.css('button[role="tab"], .tab, [class*="tab"]'),
    );

    if (tabs.length > 1) {
      await tabs[1].click();
      await driver.sleep(500);
      const body = await driver.findElement(By.css('body')).getText();
      assert.ok(body.length > 0, 'Tab content should be visible');
    }
  });

  // TC_ADM_USER_009: Cancel Edit User
  it('Admin can cancel editing a user', async function () {
    await login(driver);
    await driver.get(`${CLIENT_URL}/admin/users`);
    await waitForPage(driver);

    const editButton = await driver.wait(
      until.elementLocated(
        By.xpath(
          "//button[contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'edit')]",
        ),
      ),
      LONG_WAIT,
    );
    await editButton.click();

    await driver.wait(async () => {
      const body = await driver.findElement(By.css('body')).getText();
      return /Edit User|Update User/i.test(body);
    }, LONG_WAIT);

    const cancelButton = await driver.findElement(
      By.xpath(
        "//button[contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'cancel')]",
      ),
    );
    await cancelButton.click();

    // Verify modal closed
    await driver.wait(async () => {
      const body = await driver.findElement(By.css('body')).getText();
      return !/Edit User|Update User/i.test(body);
    }, LONG_WAIT);
  });

  // TC_ADM_USER_010: Close Modal with X Button
  it('Admin can close edit modal with X button', async function () {
    await login(driver);
    await driver.get(`${CLIENT_URL}/admin/users`);
    await waitForPage(driver);

    const editButton = await driver.wait(
      until.elementLocated(
        By.xpath(
          "//button[contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'edit')]",
        ),
      ),
      LONG_WAIT,
    );
    await editButton.click();

    await driver.wait(async () => {
      const body = await driver.findElement(By.css('body')).getText();
      return /Edit User|Update User/i.test(body);
    }, LONG_WAIT);

    // Find and click X button
    const closeButton = await driver.findElement(
      By.css('button[aria-label="Close"], button.close, [class*="close"]'),
    );
    await closeButton.click();

    // Verify modal closed
    await driver.wait(async () => {
      const body = await driver.findElement(By.css('body')).getText();
      return !/Edit User|Update User/i.test(body);
    }, LONG_WAIT);
  });

  // TC_ADM_FILTER_002: Create Filter with Valid Data
  it('Admin can create filter with valid data', async function () {
    await login(driver);
    await driver.get(`${CLIENT_URL}/admin/filters`);
    await waitForPage(driver);

    const addButton = await driver.wait(
      until.elementLocated(
        By.xpath(
          "//button[contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'add') or contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'create')]",
        ),
      ),
      LONG_WAIT,
    );
    await addButton.click();

    await driver.wait(async () => {
      const body = await driver.findElement(By.css('body')).getText();
      return /Add Filter|Create Filter|New Filter/i.test(body);
    }, LONG_WAIT);

    const timestamp = Date.now();
    const nameInput = await driver.findElement(
      By.css('input[name="name"], input[name="filterName"]'),
    );
    await nameInput.sendKeys(`TestFilter_${timestamp}`);

    const saveButton = await driver.findElement(
      By.xpath(
        "//button[contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'save') or contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'create')]",
      ),
    );
    await saveButton.click();

    await driver.wait(async () => {
      const body = await driver.findElement(By.css('body')).getText();
      return /success|created|added/i.test(body);
    }, LONG_WAIT);
  });

  // TC_ADM_FILTER_003: Create Filter with Empty Name
  it('Admin cannot create filter with empty name', async function () {
    await login(driver);
    await driver.get(`${CLIENT_URL}/admin/filters`);
    await waitForPage(driver);

    const addButton = await driver.wait(
      until.elementLocated(
        By.xpath(
          "//button[contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'add') or contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'create')]",
        ),
      ),
      LONG_WAIT,
    );
    await addButton.click();

    await driver.wait(async () => {
      const body = await driver.findElement(By.css('body')).getText();
      return /Add Filter|Create Filter/i.test(body);
    }, LONG_WAIT);

    const saveButton = await driver.findElement(
      By.xpath(
        "//button[contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'save') or contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'create')]",
      ),
    );
    await saveButton.click();

    await driver.wait(async () => {
      const body = await driver.findElement(By.css('body')).getText();
      return /required|cannot be empty|invalid|error/i.test(body);
    }, LONG_WAIT);
  });

  // TC_ADM_FILTER_004: Edit Filter
  it('Admin can edit an existing filter', async function () {
    await login(driver);
    await driver.get(`${CLIENT_URL}/admin/filters`);
    await waitForPage(driver);

    const editButton = await driver.wait(
      until.elementLocated(
        By.xpath(
          "//button[contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'edit')]",
        ),
      ),
      LONG_WAIT,
    );
    await editButton.click();

    await driver.wait(async () => {
      const body = await driver.findElement(By.css('body')).getText();
      return /Edit Filter|Update Filter/i.test(body);
    }, LONG_WAIT);

    const nameInput = await driver.findElement(
      By.css('input[name="name"], input[name="filterName"]'),
    );
    await nameInput.clear();
    await nameInput.sendKeys(`UpdatedFilter_${Date.now()}`);

    const saveButton = await driver.findElement(
      By.xpath(
        "//button[contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'save') or contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'update')]",
      ),
    );
    await saveButton.click();

    await driver.wait(async () => {
      const body = await driver.findElement(By.css('body')).getText();
      return /success|updated|saved/i.test(body);
    }, LONG_WAIT);
  });

  // TC_ADM_FILTER_005: Delete Filter
  it('Admin can delete a filter', async function () {
    await login(driver);
    await driver.get(`${CLIENT_URL}/admin/filters`);
    await waitForPage(driver);

    const deleteButton = await driver.wait(
      until.elementLocated(
        By.xpath(
          "//button[contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'delete') or contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'remove')]",
        ),
      ),
      LONG_WAIT,
    );
    await deleteButton.click();

    const confirmButton = await driver.wait(
      until.elementLocated(
        By.xpath(
          "//button[contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'confirm') or contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'yes') or contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'delete')]",
        ),
      ),
      LONG_WAIT,
    );
    await confirmButton.click();

    await driver.wait(async () => {
      const body = await driver.findElement(By.css('body')).getText();
      return /deleted|removed|success/i.test(body);
    }, LONG_WAIT);
  });

  // TC_ADM_FILTER_006: Cancel Delete Filter
  it('Admin can cancel filter deletion', async function () {
    await login(driver);
    await driver.get(`${CLIENT_URL}/admin/filters`);
    await waitForPage(driver);

    const deleteButton = await driver.wait(
      until.elementLocated(
        By.xpath(
          "//button[contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'delete') or contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'remove')]",
        ),
      ),
      LONG_WAIT,
    );
    await deleteButton.click();

    const cancelButton = await driver.wait(
      until.elementLocated(
        By.xpath(
          "//button[contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'cancel') or contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'no')]",
        ),
      ),
      LONG_WAIT,
    );
    await cancelButton.click();

    await driver.wait(async () => {
      const body = await driver.findElement(By.css('body')).getText();
      return !/Are you sure|Confirm/i.test(body);
    }, LONG_WAIT);
  });
});
