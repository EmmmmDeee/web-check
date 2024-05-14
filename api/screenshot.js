const puppeteer = require('puppeteer-core');
const chromium = require('chrome-aws-lambda');
const middleware = require('./_common/middleware');

const handler = async (targetUrl) => {
  if (!targetUrl) {
    throw new Error('URL is missing from queryStringParameters');
  }

  const urlRegex = /^(http|https):\/\/[^ "]+$/;
  if (!urlRegex.test(targetUrl)) {
    throw new Error('Invalid URL format');
  }

  if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
    targetUrl = `http://${targetUrl}`;
  }

  try {
    new URL(targetUrl);
  } catch (error) {
    throw new Error('Invalid URL provided');
  }

  let browser = null;
  try {
    browser = await puppeteer.launch({
      args: [...chromium.args, '--no-sandbox'],
      defaultViewport: { width: 800, height: 600 },
      executablePath: process.env.CHROME_PATH || await chromium.executablePath,
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
      ignoreDefaultArgs: ['--disable-extensions'],
    });

    const page = await browser.newPage();

    await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'dark' }]);
    page.setDefaultNavigationTimeout(8000);
    await page.goto(targetUrl, { waitUntil: 'domcontentloaded' });

    await page.addScriptTag({
      path: './_common/inject.js',
    });

    const screenshotBuffer = await page.screenshot({
      fullPage: true,
      omitBackground: true,
    });

    return screenshotBuffer;

  } catch (error) {
    throw new Error(error.message);
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }
};

module.exports = middleware(handler);
module.exports.handler = middleware(handler);
