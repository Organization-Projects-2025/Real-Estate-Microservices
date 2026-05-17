const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

const CLIENT_URL = process.env.CLIENT_URL || 'http://127.0.0.1:5173';
const API_URL = process.env.API_URL || 'http://127.0.0.1:3000/api';
const DEVELOPER_EMAIL =
  process.env.DEVELOPER_EMAIL || 'developer1@realestate.com';
const USER_EMAIL = process.env.NON_DEVELOPER_EMAIL || 'user1@realestate.com';
const COMMON_PASSWORD =
  process.env.SEED_COMMON_PASSWORD ||
  process.env.SELENIUM_PASSWORD ||
  'Str0ngP@ssw0rd!2026';
const HEADLESS = process.env.HEADLESS !== 'false';
const screenshotsDir = path.join(__dirname, '..', 'screenshots');
const LONG_WAIT = 30000;

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

async function visibleText(driver) {
  return driver.findElement(By.css('body')).getText();
}

async function waitForText(driver, matcher) {
  await driver.wait(async () => {
    const text = await visibleText(driver);
    return matcher.test(text);
  }, LONG_WAIT);
}

async function fetchJson(url) {
  const response = await fetch(url);
  return response.json();
}

async function getDeveloperId(email) {
  const data = await fetchJson(`${API_URL}/auth/users/role/developer`);
  const developer = data?.data?.users?.find((user) => user.email === email);
  if (!developer) {
    throw new Error(`Developer not found for email: ${email}`);
  }
  return developer._id;
}

async function getProjectIdByName(developerId, projectName) {
  const data = await fetchJson(
    `${API_URL}/projects-with-properties/developer/${developerId}`,
  );
  const project = data?.data?.projects?.find(
    (item) => item.name === projectName,
  );
  if (!project) {
    throw new Error(`Project not found: ${projectName}`);
  }
  return project._id;
}

async function login(driver, email, password = COMMON_PASSWORD) {
  await driver.get(`${CLIENT_URL}/login`);
  await waitForPage(driver);
  const emailInput = await driver.findElement(By.css('input[name="email"]'));
  await emailInput.clear();
  await emailInput.sendKeys(email);
  const passwordInput = await driver.findElement(
    By.css('input[name="password"]'),
  );
  await passwordInput.clear();
  await passwordInput.sendKeys(password);
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

async function clickCardByHeading(driver, headingText) {
  const card = await driver.wait(
    until.elementLocated(
      By.xpath(
        `//h3[normalize-space()=${JSON.stringify(headingText)}]/ancestor::div[contains(@class, 'cursor-pointer') or contains(@class, 'border')]`,
      ),
    ),
    LONG_WAIT,
  );
  await driver.executeScript(
    'arguments[0].scrollIntoView({block: "center"});',
    card,
  );
  await driver.executeScript('arguments[0].click();', card);
}

async function findButtonByText(driver, text) {
  return driver.wait(
    until.elementLocated(
      By.xpath(
        `//button[contains(normalize-space(.), ${JSON.stringify(text)})]`,
      ),
    ),
    LONG_WAIT,
  );
}

describe('Developer Properties (converted)', function () {
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
      // ignore session teardown errors
    }
  });

  it('Main nav -> Developer Properties page loads', async function () {
    await driver.get(`${CLIENT_URL}/`);
    await waitForPage(driver);

    const devLink = await driver.findElement(
      By.css("a[href='/developer-properties']"),
    );
    await devLink.click();
    await waitForPage(driver);

    const body = await visibleText(driver);
    assert.match(
      body,
      /New Projects|Developer Properties|Properties by Developers/i,
    );
  });

  it('Developer directory opens a developer project portfolio', async function () {
    await driver.get(`${CLIENT_URL}/developer-properties`);
    await waitForPage(driver);
    
    // Wait for page content to load
    await driver.sleep(2000);
    
    const body = await visibleText(driver);
    
    // Check for the actual text on the page
    assert.match(
      body,
      /Properties by Developers|Explore properties from trusted real estate developers/i,
    );

    const developerId = await getDeveloperId(DEVELOPER_EMAIL);
    await driver.get(`${CLIENT_URL}/developer-properties/${developerId}`);
    await waitForPage(driver);
    
    // Wait for content to load
    await driver.sleep(2000);
    
    const detailText = await visibleText(driver);
    
    // Check for actual content on developer detail page
    assert.match(detailText, /Projects Portfolio|Active Projects/i);
  });

  it('Developer detail page back button returns to the directory', async function () {
    const developerId = await getDeveloperId(DEVELOPER_EMAIL);
    await driver.get(`${CLIENT_URL}/developer-properties/${developerId}`);
    await waitForPage(driver);
    
    // Wait for page to load
    await driver.sleep(2000);

    const backButton = await driver.wait(
      until.elementLocated(
        By.xpath('//button[contains(normalize-space(.), "Back to Developers")]'),
      ),
      LONG_WAIT,
    );

    // Use JavaScript click to avoid click intercepted errors
    await driver.executeScript('arguments[0].click();', backButton);
    await driver.wait(until.urlContains('/developer-properties'), LONG_WAIT);

    const body = await visibleText(driver);
    assert.match(
      body,
      /Properties by Developers|Explore properties from trusted real estate developers/i,
    );
  });

  it('Developer account can create and delete a project', async function () {
    const projectName = `Selenium Project ${Date.now()}`;
    await login(driver, DEVELOPER_EMAIL);
    await driver.get(`${CLIENT_URL}/my-projects`);
    await waitForPage(driver);
    
    // Wait for page to load
    await driver.sleep(2000);

    const pageText = await visibleText(driver);
    assert.match(
      pageText,
      /My Projects|Manage your development projects/i,
    );

    const addProjectButton = await driver.wait(
      until.elementLocated(
        By.xpath('//button[contains(normalize-space(.), "Add Project")]'),
      ),
      LONG_WAIT,
    );
    await addProjectButton.click();

    await driver.wait(
      until.elementLocated(By.css('input[placeholder="Project Name"]')),
      LONG_WAIT,
    );

    await driver
      .findElement(By.css('input[placeholder="Project Name"]'))
      .sendKeys(projectName);
    await driver
      .findElement(By.css('textarea[placeholder="Project Description"]'))
      .sendKeys('Selenium created project');
    await driver
      .findElement(By.css('input[placeholder="Location"]'))
      .sendKeys('New Cairo, Cairo Governorate');
    await driver.findElement(By.css('button[type="submit"]')).click();

    await waitForText(
      driver,
      new RegExp(projectName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')),
    );

    const projectCard = await driver.wait(
      until.elementLocated(
        By.xpath(
          `//h3[normalize-space()=${JSON.stringify(projectName)}]/ancestor::div[contains(@class, 'border')][1]`,
        ),
      ),
      LONG_WAIT,
    );
    const propertiesButton = await projectCard.findElement(
      By.xpath('.//button[contains(normalize-space(.), "Properties")]'),
    );
    await driver.executeScript('arguments[0].click();', propertiesButton);
    await driver.wait(until.urlContains('/project/'), LONG_WAIT);
    await driver.wait(until.urlContains('/properties'), LONG_WAIT);
    await waitForText(
      driver,
      /Manage properties in this project|No properties are currently listed for this project/i,
    );

    const projectPageBody = await visibleText(driver);
    assert.match(projectPageBody, /Manage properties in this project/);
    assert.match(
      projectPageBody,
      /No properties are currently listed for this project/i,
    );

    await driver.navigate().back();
    await waitForPage(driver);

    const deleteCard = await driver.wait(
      until.elementLocated(
        By.xpath(
          `//h3[normalize-space()=${JSON.stringify(projectName)}]/ancestor::div[contains(@class, 'border')][1]`,
        ),
      ),
      LONG_WAIT,
    );
    const deleteButton = await deleteCard.findElement(
      By.xpath('.//button[contains(normalize-space(.), "Delete")]'),
    );
    await driver.executeScript('arguments[0].click();', deleteButton);
    await driver.switchTo().alert().accept();

    await driver.wait(async () => {
      const text = await visibleText(driver);
      return !text.includes(projectName);
    }, LONG_WAIT);
  });

  it('Developer account can create and delete a developer-owned property', async function () {
    const propertyTitle = `Selenium Developer Property ${Date.now()}`;
    await login(driver, DEVELOPER_EMAIL);
    await driver.get(`${CLIENT_URL}/my-developer-properties`);
    await waitForPage(driver);
    
    // Wait for page to load
    await driver.sleep(2000);

    const intro = await visibleText(driver);
    assert.match(intro, /My Properties|Manage your property listings/i);

    const addPropertyButton = await driver.wait(
      until.elementLocated(
        By.xpath('//button[contains(normalize-space(.), "Add Property")]'),
      ),
      LONG_WAIT,
    );
    await addPropertyButton.click();

    await driver.wait(
      until.elementLocated(By.css('input[placeholder="Property Title"]')),
      LONG_WAIT,
    );

    await driver
      .findElement(By.css('input[placeholder="Property Title"]'))
      .sendKeys(propertyTitle);
    await driver
      .findElement(By.css('textarea[placeholder="Description"]'))
      .sendKeys('Created by Selenium');
    await driver
      .findElement(By.css('input[placeholder="Price"]'))
      .sendKeys('4500000');
    await driver.findElement(By.css('button[type="submit"]')).click();

    await waitForText(
      driver,
      new RegExp(propertyTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')),
    );

    const propertyCard = await driver.wait(
      until.elementLocated(
        By.xpath(
          `//h3[normalize-space()=${JSON.stringify(propertyTitle)}]/ancestor::div[contains(@class, 'border')][1]`,
        ),
      ),
      LONG_WAIT,
    );
    const deleteButton = await propertyCard.findElement(
      By.xpath('.//button[contains(normalize-space(.), "Delete")]'),
    );
    await driver.executeScript('arguments[0].click();', deleteButton);
    await driver.switchTo().alert().accept();

    await driver.wait(async () => {
      const text = await visibleText(driver);
      return !text.includes(propertyTitle);
    }, LONG_WAIT);
  });

  it('Regular users are redirected away from My Projects', async function () {
    await login(driver, USER_EMAIL);
    await driver.get(`${CLIENT_URL}/my-projects`);
    
    // Wait for redirect
    await driver.sleep(2000);
    
    const url = await driver.getCurrentUrl();
    
    // Should be redirected away from /my-projects
    assert.ok(!url.includes('/my-projects'), 'Non-developer user should be redirected away from My Projects');
  });
});
