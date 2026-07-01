import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public');
const logoIcon = join(publicDir, 'logo-icon.png');

const BG = { r: 5, g: 5, b: 5, alpha: 1 };

async function makeFavicon(size, outName) {
  await sharp({
    create: { width: size, height: size, channels: 4, background: BG },
  })
    .composite([{
      input: await sharp(logoIcon)
        .resize(Math.round(size * 0.75), Math.round(size * 0.75), { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .png()
        .toBuffer(),
      gravity: 'centre',
    }])
    .png()
    .toFile(join(publicDir, outName));
  console.log(`✓ ${outName}`);
}

async function main() {
  await makeFavicon(16,  'favicon-16.png');
  await makeFavicon(32,  'favicon-32.png');
  await makeFavicon(32,  'favicon.png');
  await makeFavicon(48,  'favicon-48.png');
  await makeFavicon(180, 'apple-touch-icon.png');
  await makeFavicon(192, 'favicon-192.png');
  await makeFavicon(512, 'favicon-512.png');
  await makeFavicon(180, 'favicon-180.png');

  // Gerar favicon.ico (32x32 embutido)
  const ico32 = await sharp({
    create: { width: 32, height: 32, channels: 4, background: BG },
  })
    .composite([{
      input: await sharp(logoIcon)
        .resize(24, 24, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .png()
        .toBuffer(),
      gravity: 'centre',
    }])
    .png()
    .toBuffer();

  // ICO = cabeçalho simples com 1 imagem 32x32
  const icoHeader = Buffer.alloc(6 + 16);
  icoHeader.writeUInt16LE(0, 0);   // reservado
  icoHeader.writeUInt16LE(1, 2);   // tipo ICO
  icoHeader.writeUInt16LE(1, 4);   // num imagens
  icoHeader.writeUInt8(32, 6);     // largura
  icoHeader.writeUInt8(32, 7);     // altura
  icoHeader.writeUInt8(0, 8);      // cores
  icoHeader.writeUInt8(0, 9);      // reservado
  icoHeader.writeUInt16LE(1, 10);  // planos
  icoHeader.writeUInt16LE(32, 12); // bits por pixel
  icoHeader.writeUInt32LE(ico32.length, 14); // tamanho
  icoHeader.writeUInt32LE(22, 18); // offset

  writeFileSync(join(publicDir, 'favicon.ico'), Buffer.concat([icoHeader, ico32]));
  console.log('✓ favicon.ico');
}

main().catch(console.error);
