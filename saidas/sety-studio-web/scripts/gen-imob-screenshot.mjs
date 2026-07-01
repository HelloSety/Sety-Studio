import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..', 'public', 'portfolio');

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setViewportSize({ width: 1440, height: 900 });

const fileUrl = `file:///${root.replace(/\\/g, '/')}/imobiliaria/index.html`;
await page.goto(fileUrl, { waitUntil: 'networkidle', timeout: 20000 });
await page.waitForTimeout(2500);
await page.screenshot({
  path: `${root}/imobiliaria/screenshots/thumb.png`,
  clip: { x: 0, y: 0, width: 1440, height: 900 },
});
console.log('Screenshot imobiliaria OK');
await browser.close();
