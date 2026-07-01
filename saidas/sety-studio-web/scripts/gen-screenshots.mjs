import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, '..', 'public', 'portfolio');

const nichos = [
  'odontologia',
  'estetica',
  'energia-solar',
  'advocacia',
  'imobiliaria',
  'consorcio',
];

(async () => {
  const browser = await chromium.launch();

  for (const nicho of nichos) {
    const htmlPath = path.join(publicDir, nicho, 'index.html');
    const screenshotDir = path.join(publicDir, nicho, 'screenshots');
    fs.mkdirSync(screenshotDir, { recursive: true });

    if (!fs.existsSync(htmlPath)) {
      console.log(`SKIP ${nicho} — sem index.html`);
      continue;
    }

    const url = `file:///${htmlPath.replace(/\\/g, '/')}`;
    console.log(`Capturando ${nicho}...`);

    // Desktop
    const desktopPage = await browser.newPage();
    await desktopPage.setViewportSize({ width: 1440, height: 900 });
    await desktopPage.goto(url, { waitUntil: 'networkidle', timeout: 15000 });
    await desktopPage.waitForTimeout(800);
    await desktopPage.screenshot({
      path: path.join(screenshotDir, 'desktop.png'),
      clip: { x: 0, y: 0, width: 1440, height: 900 },
    });
    await desktopPage.close();

    // Thumbnail (crop hero area)
    const thumbPage = await browser.newPage();
    await thumbPage.setViewportSize({ width: 1440, height: 900 });
    await thumbPage.goto(url, { waitUntil: 'networkidle', timeout: 15000 });
    await thumbPage.waitForTimeout(600);
    await thumbPage.screenshot({
      path: path.join(screenshotDir, 'thumb.png'),
      clip: { x: 0, y: 0, width: 1440, height: 720 },
    });
    await thumbPage.close();

    // Mobile
    const mobilePage = await browser.newPage();
    await mobilePage.setViewportSize({ width: 390, height: 844 });
    await mobilePage.goto(url, { waitUntil: 'networkidle', timeout: 15000 });
    await mobilePage.waitForTimeout(600);
    await mobilePage.screenshot({
      path: path.join(screenshotDir, 'mobile.png'),
      clip: { x: 0, y: 0, width: 390, height: 844 },
    });
    await mobilePage.close();

    console.log(`  ✓ ${nicho} — desktop, thumb, mobile`);
  }

  await browser.close();
  console.log('\nTodos os screenshots gerados.');
})();
