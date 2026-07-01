import { chromium } from 'playwright';
import { mkdirSync } from 'fs';

const BASE = 'c:/Users/seven/MazyOS/marketing/esportivo';
const OUT  = `${BASE}/para-postar-v2`;
mkdirSync(OUT, { recursive: true });

const tarefas = [
  {
    tipo: 'carrossel',
    html: `${BASE}/carrosseis/top5-brasileiras-v2.html`,
    outDir: `${OUT}/carrossel-top5`,
    viewport: { width: 1080, height: 1350 },
  },
  {
    tipo: 'single',
    html: `${BASE}/posts/post-brasil-v2.html`,
    out:  `${OUT}/feed-brasil.png`,
    viewport: { width: 1080, height: 1350 },
  },
  {
    tipo: 'single',
    html: `${BASE}/stories/story-enquete-v2.html`,
    out:  `${OUT}/story-enquete.png`,
    viewport: { width: 1080, height: 1920 },
  },
];

const browser = await chromium.launch();
let total = 0;

for (const t of tarefas) {
  const ctx = await browser.newContext({ viewport: t.viewport, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  await page.goto('file:///' + t.html, { waitUntil: 'networkidle', timeout: 25000 });
  await page.waitForTimeout(3000);

  if (t.tipo === 'carrossel') {
    mkdirSync(t.outDir, { recursive: true });
    const slides = await page.$$('.slide');
    for (let i = 0; i < slides.length; i++) {
      const num = String(i + 1).padStart(2, '0');
      await slides[i].screenshot({ path: `${t.outDir}/slide-${num}.png` });
      console.log(`✓ slide-${num}`);
      total++;
    }
  } else {
    await page.screenshot({ path: t.out, fullPage: false });
    console.log(`✓ ${t.out.split('/').pop()}`);
    total++;
  }
  await ctx.close();
}

await browser.close();
console.log(`\n${total} peças prontas em ${OUT}`);
