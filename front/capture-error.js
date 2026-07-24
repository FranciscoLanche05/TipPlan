const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('PAGE ERROR:', msg.text());
    }
  });

  page.on('pageerror', error => {
    console.log('UNCAUGHT EXCEPTION:', error.message);
  });

  try {
    await page.goto('http://localhost:5173/autos', { waitUntil: 'networkidle0' });
  } catch (e) {
    console.error("Failed to load page:", e.message);
  }

  await browser.close();
})();
