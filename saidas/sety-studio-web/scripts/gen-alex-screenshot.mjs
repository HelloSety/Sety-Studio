import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, '..', 'public', 'portfolio', 'alex-messias', 'screenshots');
const URL = 'https://euphonious-bavarois-426c1b.netlify.app/';

(async () => {
  const browser = await chromium.launch();

  // Desktop thumb
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(URL, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(outDir, 'thumb.png'), clip: { x: 0, y: 0, width: 1440, height: 900 } });
  await page.close();
  console.log('thumb.png ok');

  // Desktop full
  const page2 = await browser.newPage();
  await page2.setViewportSize({ width: 1440, height: 900 });
  await page2.goto(URL, { waitUntil: 'networkidle', timeout: 30000 });
  await page2.waitForTimeout(1200);
  await page2.screenshot({ path: path.join(outDir, 'desktop.png') });
  await page2.close();
  console.log('desktop.png ok');

  // Mobile
  const page3 = await browser.newPage();
  await page3.setViewportSize({ width: 390, height: 844 });
  await page3.goto(URL, { waitUntil: 'networkidle', timeout: 30000 });
  await page3.waitForTimeout(1000);
  await page3.screenshot({ path: path.join(outDir, 'mobile.png'), clip: { x: 0, y: 0, width: 390, height: 844 } });
  await page3.close();
  console.log('mobile.png ok');

  await browser.close();
  console.log('Alex screenshots prontos.');
})();
