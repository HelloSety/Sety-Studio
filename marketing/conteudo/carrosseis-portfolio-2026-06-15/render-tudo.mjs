/**
 * Renderiza todos os carrosséis em PNG 1080×1350
 * Roda DEPOIS de gerar-carrosseis.mjs
 */

import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 1) Gera todos os HTMLs primeiro
console.log('Gerando HTMLs...');
execSync('node gerar-carrosseis.mjs', { cwd: __dirname, stdio: 'inherit' });
console.log('\nRenderizando PNGs...\n');

const NICHOS = [
  'odontologia', 'advocacia', 'energia-solar', 'imobiliaria',
  'estetica', 'consorcio', 'institucional-2026', 'nossos-projetos', 'processo',
];

const browser = await chromium.launch();

for (const nicho of NICHOS) {
  const htmlPath = path.join(__dirname, nicho, 'carrossel.html');
  if (!fs.existsSync(htmlPath)) { console.warn(`! Pulando ${nicho} (sem HTML)`); continue; }

  const outDir = path.join(__dirname, nicho, 'instagram');
  fs.mkdirSync(outDir, { recursive: true });

  const url = `file:///${htmlPath.replace(/\\/g, '/')}`;
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1080, height: 1350 });
  await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });

  // Aguarda fontes do Google Fonts
  await page.waitForTimeout(2500);

  let count = 0;
  for (let i = 1; i <= 10; i++) {
    const el = await page.$(`#s${i}`);
    if (!el) break;
    const buf = await el.screenshot({ type: 'png' });
    const fname = `slide-${String(i).padStart(2, '0')}.png`;
    fs.writeFileSync(path.join(outDir, fname), buf);
    count++;
  }

  await page.close();
  console.log(`✓ ${nicho} — ${count} slides`);
}

await browser.close();
console.log('\n✅ Todos os carrosséis renderizados!');
