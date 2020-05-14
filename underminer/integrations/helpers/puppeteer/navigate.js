const stealth = require("underminer/integrations/helpers/puppeteer/stealth");
const chromium = require('chrome-aws-lambda');

module.exports = async(url, isRaw) => {
  const puppeteer = chromium.puppeteer;
  chromium.args.push('--no-sandbox');
  
  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath,
    headless: chromium.headless
  });

  const page = await browser.newPage();
  await stealth(page);

  if(isRaw) {
    await page.setRequestInterception(true);
  
    page.on('request', request => {
      if (request.resourceType() !== 'document')
        request.abort();
      else
        request.continue();
    });
  }

  await page.goto(url);

  const cookies = await page.cookies();
  const body = await page.evaluate(() => document.querySelector('*').outerHTML);
  await browser.close();

  return {
    body,
    cookies
  };
};