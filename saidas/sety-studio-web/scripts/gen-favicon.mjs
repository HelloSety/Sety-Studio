import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, '..', 'public');
const iconSrc = 'C:/Users/seven/Downloads/SETYSTUDIO/LOGOTIPO STAR.png';

const sizes = [16, 32, 48, 180, 192, 512];

(async () => {
  const browser = await chromium.launch();

  for (const size of sizes) {
    const page = await browser.newPage();
    await page.setViewportSize({ width: size, height: size });
    await page.setContent(`
      <!DOCTYPE html>
      <html>
      <head><style>*{margin:0;padding:0;background:transparent}</style></head>
      <body style="background:#050505">
        <img src="file:///${iconSrc.replace(/ /g, '%20')}"
             style="width:${size}px;height:${size}px;object-fit:contain;display:block">
      </body>
      </html>
    `);
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(publicDir, `favicon-${size}.png`) });
    await page.close();
    console.log(`favicon-${size}.png ok`);
  }

  // Copiar como padrões esperados pelo Next.js / browsers
  fs.copyFileSync(path.join(publicDir, 'favicon-32.png'), path.join(publicDir, 'favicon.png'));
  fs.copyFileSync(path.join(publicDir, 'favicon-180.png'), path.join(publicDir, 'apple-touch-icon.png'));

  await browser.close();
  console.log('Favicons gerados.');
})();
