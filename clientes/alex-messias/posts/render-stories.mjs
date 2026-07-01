import { chromium } from 'playwright';
import { readdirSync } from 'fs';

const __dirname = 'c:/Users/seven/MazyOS/clientes/alex-messias/posts';

const stories = readdirSync(__dirname)
  .filter(f => f.startsWith('story-') && f.endsWith('.html'))
  .sort();

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport:{width:1080,height:1920}, deviceScaleFactor:3 });
const page = await ctx.newPage();

for (const s of stories) {
  const fp = __dirname + '/' + s;
  const out = fp.replace('.html','.png');
  await page.goto('file:///' + fp.replace(/\\/g,'/'), { waitUntil:'domcontentloaded', timeout:15000 });
  await page.waitForTimeout(3500);
  await page.screenshot({ path: out, fullPage:false });
  console.log('OK ' + s);
}
await browser.close();
console.log('\nDone! ' + stories.length + ' stories renderizadas.');
