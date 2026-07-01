import { chromium } from 'playwright';
import { mkdirSync } from 'fs';

const OUT = 'c:/Users/seven/MazyOS/marketing/esportivo/carrosseis/top5-brasileiras';
mkdirSync(OUT, { recursive: true });

const HTML = 'c:/Users/seven/MazyOS/marketing/esportivo/carrosseis/top5-brasileiras.html';

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();

await page.goto('file:///' + HTML, { waitUntil: 'networkidle', timeout: 20000 });
await page.waitForTimeout(2000);

const slides = await page.$$('.slide');
console.log(`Encontrados ${slides.length} slides`);

for (let i = 0; i < slides.length; i++) {
  const num = String(i + 1).padStart(2, '0');
  const out = `${OUT}/slide-${num}.png`;
  await slides[i].screenshot({ path: out });
  console.log(`✓ Slide ${num} → ${out}`);
}

await browser.close();
console.log(`\n${slides.length} slides renderizados em ${OUT}`);
