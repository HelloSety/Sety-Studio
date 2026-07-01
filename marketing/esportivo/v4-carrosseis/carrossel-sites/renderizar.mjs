import { chromium } from 'playwright';

const BASE = 'c:/Users/seven/MazyOS/marketing/esportivo/v4-carrosseis/carrossel-sites';

const SLIDES = [
  '01-capa.html',
  '02-problema.html',
  '03-hierarquia.html',
  '04-prova-social.html',
  '05-cta.html',
  '06-resumo.html',
  '07-cta-final.html',
];

const browser = await chromium.launch();

for (const slide of SLIDES) {
  const name = slide.replace('.html', '');
  const ctx = await browser.newContext({ viewport:{ width:1080, height:1350 }, deviceScaleFactor:1 });
  const page = await ctx.newPage();
  await page.goto('file:///' + BASE + '/' + slide, { waitUntil:'networkidle', timeout:25000 });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: BASE + '/render/' + name + '.png', fullPage:false });
  await ctx.close();
  console.log('✓ ' + name + '.png');
}

await browser.close();
console.log('\nCarrossel completo: render/');
