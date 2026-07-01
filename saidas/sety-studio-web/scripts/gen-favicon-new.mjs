import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, '..', 'public');

// Calcula pontos de estrela de 5 pontas matematicamente
function starPoints(cx, cy, outerR, innerR, count = 5) {
  const pts = [];
  for (let i = 0; i < count * 2; i++) {
    const angle = (i * Math.PI / count) - Math.PI / 2;
    const r = i % 2 === 0 ? outerR : innerR;
    pts.push(`${(cx + r * Math.cos(angle)).toFixed(2)},${(cy + r * Math.sin(angle)).toFixed(2)}`);
  }
  return pts.join(' ');
}

// outerR=43 innerR=19 → estrela com pontas grossas, legível em 16px
const STAR = starPoints(50, 50, 43, 19);

function makeSVG(size) {
  const rx = Math.max(4, Math.round(size * 0.13));
  return `<svg width="${size}" height="${size}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <rect width="100" height="100" rx="${rx}" fill="#050505"/>
  <polygon points="${STAR}" fill="white"/>
</svg>`;
}

const sizes = [
  { name: 'favicon-16.png',        size: 16  },
  { name: 'favicon-32.png',        size: 32  },
  { name: 'favicon-48.png',        size: 48  },
  { name: 'apple-touch-icon.png',  size: 180 },
  { name: 'favicon-192.png',       size: 192 },
  { name: 'favicon-512.png',       size: 512 },
];

const browser = await chromium.launch();
const pngBuffers = {};

for (const { name, size } of sizes) {
  const svg = makeSVG(size);
  const html = `<!DOCTYPE html>
<html style="margin:0;padding:0;background:#050505;">
<head><style>
  *{margin:0;padding:0;box-sizing:border-box;}
  html,body{width:${size}px;height:${size}px;background:#050505;overflow:hidden;}
</style></head>
<body>${svg}</body></html>`;

  const page = await browser.newPage();
  await page.setViewportSize({ width: size, height: size });
  await page.setContent(html, { waitUntil: 'domcontentloaded' });

  // Força background escuro antes do screenshot
  await page.evaluate(() => {
    document.documentElement.style.background = '#050505';
    document.body.style.background = '#050505';
  });

  const buf = await page.screenshot({
    clip: { x: 0, y: 0, width: size, height: size },
    omitBackground: false,
  });
  await page.close();

  fs.writeFileSync(path.join(publicDir, name), buf);
  pngBuffers[name] = buf;
  console.log(`✓ ${name} (${size}px)`);
}

// Gera favicon.ico com PNG 32px embutido (formato ICO moderno)
function pngToIco(pngBuf) {
  const HEADER = 6;
  const ENTRY  = 16;
  const offset = HEADER + ENTRY;
  const ico = Buffer.allocUnsafe(offset + pngBuf.length);

  ico.writeUInt16LE(0, 0);          // idReserved
  ico.writeUInt16LE(1, 2);          // idType = 1 (ICO)
  ico.writeUInt16LE(1, 4);          // idCount

  ico.writeUInt8(32, 6);            // bWidth
  ico.writeUInt8(32, 7);            // bHeight
  ico.writeUInt8(0,  8);            // bColorCount
  ico.writeUInt8(0,  9);            // bReserved
  ico.writeUInt16LE(1, 10);         // wPlanes
  ico.writeUInt16LE(32, 12);        // wBitCount
  ico.writeUInt32LE(pngBuf.length, 14); // dwBytesInRes
  ico.writeUInt32LE(offset, 18);    // dwImageOffset

  pngBuf.copy(ico, offset);
  return ico;
}

fs.writeFileSync(
  path.join(publicDir, 'favicon.ico'),
  pngToIco(pngBuffers['favicon-32.png'])
);
console.log('✓ favicon.ico');

await browser.close();
console.log('\nFavicons gerados.');
