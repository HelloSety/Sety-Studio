import { chromium } from 'playwright';
import { mkdirSync, existsSync } from 'fs';

const BASE = 'c:/Users/seven/MazyOS/marketing/esportivo';

const tarefas = [
  // Carrossel: cada .slide vira um PNG separado
  {
    tipo: 'carrossel',
    html: `${BASE}/carrosseis/top5-brasileiras.html`,
    outDir: `${BASE}/para-postar/carrossel-top5-brasileiras`,
    viewport: { width: 1080, height: 1350 },
  },
  // Posts de feed (1080x1350)
  {
    tipo: 'single',
    html: `${BASE}/posts/post-brasil-feed.html`,
    out: `${BASE}/para-postar/feed-brasil.png`,
    viewport: { width: 1080, height: 1350 },
  },
  // Story (1080x1920)
  {
    tipo: 'single',
    html: `${BASE}/stories/story-enquete.html`,
    out: `${BASE}/para-postar/story-enquete.png`,
    viewport: { width: 1080, height: 1920 },
  },
];

mkdirSync(`${BASE}/para-postar`, { recursive: true });

const browser = await chromium.launch();
let total = 0;

for (const t of tarefas) {
  const ctx = await browser.newContext({ viewport: t.viewport, deviceScaleFactor: 2 });
  const page = await ctx.newPage();

  await page.goto('file:///' + t.html, { waitUntil: 'networkidle', timeout: 25000 });
  await page.waitForTimeout(2500);

  if (t.tipo === 'carrossel') {
    mkdirSync(t.outDir, { recursive: true });
    const slides = await page.$$('.slide');
    for (let i = 0; i < slides.length; i++) {
      const num = String(i + 1).padStart(2, '0');
      const out = `${t.outDir}/slide-${num}.png`;
      await slides[i].screenshot({ path: out });
      console.log(`✓ carrossel slide-${num}`);
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
console.log(`\n${total} imagens renderizadas em ${BASE}/para-postar/`);
console.log('\nProntas para postar:');
console.log('  📂 carrossel-top5-brasileiras/ (7 slides)');
console.log('  🖼  feed-brasil.png');
console.log('  📱 story-enquete.png');
