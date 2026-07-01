import { chromium } from 'playwright';
import { mkdirSync } from 'fs';

const BASE = 'c:/Users/seven/MazyOS/marketing/esportivo';
const OUT  = `${BASE}/batch`;
mkdirSync(OUT, { recursive: true });

const nomes = ['rubro-negro','verde','la-bombonera','2022','santos','river'];

const browser = await chromium.launch();

for (const n of nomes) {
  const ctx = await browser.newContext({ viewport:{ width:1080, height:1350 }, deviceScaleFactor:2 });
  const page = await ctx.newPage();
  await page.goto(`file:///${BASE}/posts/batch-${n}.html`, { waitUntil:'networkidle', timeout:20000 });
  await page.waitForTimeout(2500);
  await page.screenshot({ path:`${OUT}/${n}.png`, fullPage:false });
  console.log(`✓ ${n}.png`);
  await ctx.close();
}

await browser.close();
console.log(`\n6 posts prontos em ${OUT}`);
