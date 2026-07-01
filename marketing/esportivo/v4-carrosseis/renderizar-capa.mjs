import { chromium } from 'playwright';

const BASE = 'c:/Users/seven/MazyOS/marketing/esportivo/v4-carrosseis';
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport:{ width:1080, height:1350 }, deviceScaleFactor:1 });
const page = await ctx.newPage();
await page.goto('file:///' + BASE + '/capa-v4.html', { waitUntil:'networkidle', timeout:20000 });
await page.waitForTimeout(2500);
await page.screenshot({ path: BASE + '/render/capa-v4.png', fullPage:false });
await browser.close();
console.log('✓ render/capa-teste.png');
