import { chromium } from 'playwright';
import { mkdirSync } from 'fs';

const BASE = 'c:/Users/seven/MazyOS/marketing/esportivo/autoridade';
const OUT  = BASE + '/render';
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();

// Carrossel — 7 slides
const ctx1 = await browser.newContext({ viewport:{ width:1080, height:1350 }, deviceScaleFactor:1 });
const p1 = await ctx1.newPage();
await p1.goto('file:///' + BASE + '/carrossel-erro-escudo.html', { waitUntil:'networkidle', timeout:20000 });
await p1.waitForTimeout(2500);
const slides = await p1.$$('.slide');
for (let i = 0; i < slides.length; i++) {
  const n = String(i+1).padStart(2,'0');
  await slides[i].screenshot({ path: `${OUT}/erro-escudo-${n}.png` });
  console.log(`✓ slide-${n}`);
}
await ctx1.close();

// Post opinião
const ctx2 = await browser.newContext({ viewport:{ width:1080, height:1350 }, deviceScaleFactor:1 });
const p2 = await ctx2.newPage();
await p2.goto('file:///' + BASE + '/post-opiniao.html', { waitUntil:'networkidle', timeout:20000 });
await p2.waitForTimeout(2000);
await p2.screenshot({ path: `${OUT}/opiniao.png`, fullPage:false });
console.log('✓ opiniao.png');
await ctx2.close();

await browser.close();
console.log('\nPronto em ' + OUT);
