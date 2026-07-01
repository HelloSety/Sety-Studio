import sharp from 'sharp';
import { writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const srcLogo  = join(__dirname, '..', '..', 'sety-studio-site', 'logo.png');
const outDir   = join(__dirname, '..', '..', 'sety-studio-site');

const BG = { r: 5, g: 5, b: 5, alpha: 1 };

async function make(size, filename) {
  const iconSize = Math.round(size * 0.78);
  const iconBuf  = await sharp(srcLogo)
    .resize(iconSize, iconSize, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  await sharp({ create: { width: size, height: size, channels: 4, background: BG } })
    .composite([{ input: iconBuf, gravity: 'centre' }])
    .png()
    .toFile(join(outDir, filename));

  console.log(`✓ ${filename}`);
}

async function main() {
  await make(16,  'favicon-16.png');
  await make(32,  'favicon-32.png');
  await make(48,  'favicon-48.png');
  await make(180, 'apple-touch-icon.png');
  await make(192, 'favicon-192.png');
  await make(512, 'favicon-512.png');

  // favicon.ico = PNG 32x32 embutido num container ICO
  const icon32 = await sharp({ create: { width: 32, height: 32, channels: 4, background: BG } })
    .composite([{
      input: await sharp(srcLogo)
        .resize(25, 25, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .png().toBuffer(),
      gravity: 'centre',
    }])
    .png().toBuffer();

  const hdr = Buffer.alloc(22);
  hdr.writeUInt16LE(0,              0);   // reservado
  hdr.writeUInt16LE(1,              2);   // tipo ICO
  hdr.writeUInt16LE(1,              4);   // 1 imagem
  hdr.writeUInt8(32,                6);   // largura
  hdr.writeUInt8(32,                7);   // altura
  hdr.writeUInt8(0,                 8);   // cores
  hdr.writeUInt8(0,                 9);   // reservado
  hdr.writeUInt16LE(1,             10);   // planos
  hdr.writeUInt16LE(32,            12);   // bpp
  hdr.writeUInt32LE(icon32.length, 14);   // tamanho
  hdr.writeUInt32LE(22,            18);   // offset

  writeFileSync(join(outDir, 'favicon.ico'), Buffer.concat([hdr, icon32]));
  console.log('✓ favicon.ico');
  console.log('\nTudo pronto em sety-studio-site/');
}

main().catch(console.error);
