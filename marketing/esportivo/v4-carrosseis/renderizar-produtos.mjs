import { chromium } from 'playwright';

const BASE = 'c:/Users/seven/MazyOS/marketing/esportivo/v4-carrosseis';

const FILES = [
  { html:'produto-showcase-01.html', out:'render/produto-01.png' },
  { html:'produto-showcase-02.html', out:'render/produto-02.png' },
  { html:'sety-brand-01.html',       out:'render/sety-brand-01.png' },
];

const browser = await chromium.launch();

for (const f of FILES) {
  const ctx = await browser.newContext({ viewport:{ width:1080, height:1350 }, deviceScaleFactor:1 });
  const page = await ctx.newPage();
  await page.goto('file:///' + BASE + '/' + f.html, { waitUntil:'networkidle', timeout:25000 });
  await page.waitForTimeout(2500);
  await page.screenshot({ path: BASE + '/' + f.out, fullPage:false });
  await ctx.close();
  console.log('✓ ' + f.out);
}

await browser.close();
