import https from 'https';
import fs from 'fs';
import path from 'path';

const API_KEY = process.env.OPENAI_API_KEY;
const OUT = 'c:/Users/seven/MazyOS/marketing/esportivo/v4-content';
fs.mkdirSync(OUT, { recursive: true });

// Prompts com padrões V4/ESPN/Bleacher Report:
// SEMPRE: pessoa + emoção + contexto esportivo + luz dramática
const CAPAS = [
  {
    nome: '01-copa-torcedor',
    prompt: `Editorial sports magazine cover photograph. Close-up of a passionate Brazilian football fan, face painted in green and yellow, mouth open in pure euphoria screaming a goal celebration during World Cup 2026. Stadium crowd blurred behind, stadium floodlights create dramatic rim lighting on face. Tears of joy visible. Ultra shallow depth of field. Cinematic color grading: deep blacks, vivid yellows and greens. Photorealistic. Style: ESPN The Magazine cover, Bleacher Report, National Geographic Sports. No text. Portrait 3:4.`,
  },
  {
    nome: '02-uniforme-historia',
    prompt: `Editorial documentary photograph for sports media. A footballer's hands gripping their national team jersey, badge in sharp focus at center, stadium lights visible in blurred background creating bokeh. The hands show tension, like before entering the field. Dramatic chiaroscuro lighting — one strong side light creating deep shadows. The texture of the jersey fabric is visible in detail. Cinematic, high contrast. Style of The Athletic, Netflix sports documentary. No text. Portrait 3:4.`,
  },
  {
    nome: '03-escudo-artesao',
    prompt: `Cinematic documentary photograph. Extreme close-up of skilled artisan hands embroidering a football club crest onto a jersey in a dimly lit workshop. Golden and white thread catching the light. One sharp overhead spotlight illuminates the needle and crest. Deep bokeh background with warm workshop tones. Macro detail showing craftsmanship. Feels like a Netflix documentary about football heritage and identity. Photorealistic. No text. Portrait 3:4.`,
  },
  {
    nome: '04-rebrand-antes-depois',
    prompt: `Editorial sports journalism photograph. Two football jerseys dramatically lit from above on a dark surface — one classic vintage jersey on the left (worn and historic), one modern redesigned jersey on the right (bold and clean). Between them, a stark contrast. Top-down perspective with one sharp directional light creating strong shadows. Color contrast between the two jerseys is extreme. Feels like an investigative sports media piece. Bleacher Report style. No text. Portrait 3:4.`,
  },
];

function gerarImagem(prompt) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      model: 'gpt-image-2',
      prompt,
      n: 1,
      size: '1024x1536',
      quality: 'high',
      output_format: 'png',
    });

    const options = {
      hostname: 'api.openai.com',
      path: '/v1/images/generations',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Length': Buffer.byteLength(body),
      },
    };

    const req = https.request(options, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.error) { reject(new Error(json.error.message)); return; }
          // gpt-image-2 retorna base64
          const img = json.data[0];
          if (img.b64_json) resolve({ type: 'base64', data: img.b64_json });
          else if (img.url) resolve({ type: 'url', data: img.url });
          else reject(new Error('Sem imagem na resposta: ' + JSON.stringify(json)));
        } catch (e) { reject(e); }
      });
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    https.get(url, res => {
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
    }).on('error', reject);
  });
}

console.log('Gerando imagens V4 via gpt-image-2...\n');

for (const capa of CAPAS) {
  try {
    console.log(`Gerando: ${capa.nome}...`);
    const result = await gerarImagem(capa.prompt);
    const filepath = path.join(OUT, `${capa.nome}.png`);

    if (result.type === 'base64') {
      fs.writeFileSync(filepath, Buffer.from(result.data, 'base64'));
    } else {
      await downloadImage(result.data, filepath);
    }
    console.log(`✓ ${capa.nome}.png`);
  } catch (err) {
    console.error(`✗ ${capa.nome}: ${err.message}`);
  }
}

console.log(`\nPronto em ${OUT}`);
