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

async function visibleText(driver) {
  return driver.findElement(By.css('body')).getText();
}

async function takeScreenshot(driver, name) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
  const image = await driver.takeScreenshot();
  fs.writeFileSync(path.join(screenshotsDir, `${name}.png`), image, 'base64');
}

describe('Agent (converted)', function () {
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

  it('Agent list shows results and filters work', async function () {
    await driver.get(`${CLIENT_URL}/agent`);
    await waitForPage(driver);
    await driver.wait(async () => {
      const text = await visibleText(driver);
      return /Real Estate Agent/i.test(text);
    }, LONG_WAIT);

    await driver.wait(async () => {
      const text = await visibleText(driver);
      return /Showing \d+ of \d+ agents/i.test(text);
    }, LONG_WAIT);

    const search = await driver.findElement(
      By.css('input[placeholder*="Search by name"]'),
    );
    await search.clear();
    await search.sendKeys('NoSuchAgent123');
    await driver.findElement(By.css('button[type="submit"]')).click();

    await driver.wait(async () => {
      const text = await visibleText(driver);
      return /No agents found matching your criteria/i.test(text);
    }, LONG_WAIT);

    await driver
      .findElement(By.css('input[placeholder*="Search by name"]'))
      .clear();
    const showingTextBefore = await driver
      .findElement(By.xpath("//p[contains(., 'Showing')]"))
      .getText();
    const match = showingTextBefore.match(/Showing\s+(\d+)\s+of\s+(\d+)/i);
    const total = match ? parseInt(match[2], 10) : null;

    const select = await driver.findElement(
      By.css('select[name="minExperience"]'),
    );
    await select.sendKeys('5');
    await driver.findElement(By.css('button[type="submit"]')).click();

    await driver.wait(async () => {
      const text = await driver
        .findElement(By.xpath("//p[contains(., 'Showing')]"))
        .getText();
      const m = text.match(/Showing\s+(\d+)\s+of\s+(\d+)/i);
      if (!m) return false;
      const shownNow = parseInt(m[1], 10);
      return total === null || shownNow <= total;
    }, LONG_WAIT);
  });
});
