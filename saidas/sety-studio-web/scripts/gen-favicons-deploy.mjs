import sharp from 'sharp';
import { writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const srcLogo  = join(__dirname, '..', '..', 'sety-studio-site', 'logo.png');
const outDir   = 'C:\\Users\\seven\\Downloads\\sety-studio-deploy';

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
  await make(16,  'favicon-16x16.png');
  await make(32,  'favicon-32x32.png');
  await make(180, 'apple-touch-icon.png');
  await make(192, 'android-chrome-192x192.png');
  await make(512, 'android-chrome-512x512.png');

  // favicon.ico (32x32 embutido)
  const icon32 = await sharp({ create: { width: 32, height: 32, channels: 4, background: BG } })
    .composite([{
      input: await sharp(srcLogo)
        .resize(25, 25, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .png().toBuffer(),
      gravity: 'centre',
    }])
    .png().toBuffer();

  const hdr = Buffer.alloc(22);
  hdr.writeUInt16LE(0,              0);
  hdr.writeUInt16LE(1,              2);
  hdr.writeUInt16LE(1,              4);
  hdr.writeUInt8(32,                6);
  hdr.writeUInt8(32,                7);
  hdr.writeUInt8(0,                 8);
  hdr.writeUInt8(0,                 9);
  hdr.writeUInt16LE(1,             10);
  hdr.writeUInt16LE(32,            12);
  hdr.writeUInt32LE(icon32.length, 14);
  hdr.writeUInt32LE(22,            18);

  writeFileSync(join(outDir, 'favicon.ico'), Buffer.concat([hdr, icon32]));
  console.log('✓ favicon.ico');
  console.log('\nFavicons gerados em sety-studio-deploy/');
}

main().catch(console.error);
