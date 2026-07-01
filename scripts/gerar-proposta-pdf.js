const { chromium } = require('playwright');
const path = require('path');

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const htmlPath = path.resolve(__dirname, '../saidas/proposta-sety-studio.html');
  await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle' });

  // aguarda fontes do Google carregarem
  await page.waitForTimeout(2500);

  const outPath = path.resolve(__dirname, '../saidas/proposta-sety-studio.pdf');
  await page.pdf({
    path: outPath,
    format: 'A4',
    printBackground: true,
    margin: { top: '0', right: '0', bottom: '0', left: '0' },
  });

  await browser.close();
  console.log('PDF gerado:', outPath);
}

main().catch(err => { console.error(err); process.exit(1); });
