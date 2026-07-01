import { chromium } from 'playwright';

const BASE = 'c:/Users/seven/MazyOS/marketing/esportivo/brand-posts';

const POSTS = [
  { html:'post-01-bonito.html',      out:'render/post-01-bonito.png' },
  { html:'post-02-trafego.html',     out:'render/post-02-trafego.png' },
  { html:'post-03-concorrente.html', out:'render/post-03-concorrente.png' },
];

const browser = await chromium.launch();

for (const p of POSTS) {
  const ctx = await browser.newContext({ viewport:{ width:1080, height:1350 }, deviceScaleFactor:1 });
  const page = await ctx.newPage();
  await page.goto('file:///' + BASE + '/' + p.html, { waitUntil:'networkidle', timeout:25000 });
  await page.waitForTimeout(2500);
  await page.screenshot({ path: BASE + '/' + p.out, fullPage:false });
  await ctx.close();
  console.log('✓ ' + p.out);
}

await browser.close();
