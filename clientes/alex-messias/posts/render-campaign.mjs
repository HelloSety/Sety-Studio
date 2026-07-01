import { chromium } from 'playwright';
import { readdirSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = 'c:/Users/seven/MazyOS/clientes/alex-messias/posts';

const posts = readdirSync(__dirname)
  .filter(f => f.startsWith('campaign-') && f.endsWith('.html'))
  .sort();

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport:{width:1080,height:1350}, deviceScaleFactor:3 });
const page = await ctx.newPage();

for (const post of posts) {
  const fp = __dirname + '/' + post;
  const out = fp.replace('.html','.png');
  await page.goto('file:///' + fp.replace(/\\/g,'/'), { waitUntil:'domcontentloaded', timeout:15000 });
  await page.waitForTimeout(3500);
  await page.screenshot({ path: out, fullPage:false });
  console.log('OK ' + post);
}
await browser.close();
