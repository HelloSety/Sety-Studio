import { chromium } from 'playwright';
import { mkdirSync } from 'fs';

const BASE = 'c:/Users/seven/MazyOS/marketing/esportivo';
const OUT  = `${BASE}/conceitos`;
mkdirSync(OUT, { recursive: true });

const pecas = [
  { html: `${BASE}/posts/conceito-1994.html`,      out: `${OUT}/1994.png` },
  { html: `${BASE}/posts/conceito-ela-voltou.html`, out: `${OUT}/ela-voltou.png` },
  { html: `${BASE}/posts/conceito-memoria.html`,    out: `${OUT}/memoria.png` },
];

const browser = await chromium.launch();

for (const p of pecas) {
  const ctx = await browser.newContext({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  await page.goto('file:///' + p.html, { waitUntil: 'networkidle', timeout: 20000 });
  await page.waitForTimeout(3000);
  await page.screenshot({ path: p.out, fullPage: false });
  console.log('✓ ' + p.out.split('/').pop());
  await ctx.close();
}

await browser.close();
console.log('\n3 conceitos prontos em ' + OUT);
