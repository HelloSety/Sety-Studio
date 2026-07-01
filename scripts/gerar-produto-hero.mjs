import https from 'https';
import fs from 'fs';

const API_KEY = process.env.OPENAI_API_KEY;
const OUT = 'c:/Users/seven/MazyOS/marketing/esportivo/v4-content';

const IMGS = [
  {
    nome: '07-argentina-studio',
    prompt: `Premium fashion product photography, a classic Argentina national football jersey (light blue and white vertical stripes, AFA badge on chest, Adidas logo) hanging on a sleek matte black metal hanger. Background: very dark charcoal studio, almost black. Single dramatic spotlight from upper-left illuminates the jersey fully, creating sharp shadows on the right. The jersey is completely in focus, full front view, entire shirt visible. Fabric texture visible. High-end commercial photography, Nike/Adidas catalog style. Ultra-realistic, 3:4 portrait, no model, no text.`,
  },
  {
    nome: '08-camisa-premium-dark',
    prompt: `Ultra high-end commercial product photography. A premium football jersey, dark navy blue color with golden badge detail on the chest, hanging on a premium brushed gold metal hanger. Studio background is deep black with subtle gradient. Two dramatic side lights create a cinematic rim-light effect on the fabric edges. The entire jersey is in sharp focus, front-facing, full shirt visible. Badge detail is crisp. Rich, deep color tones. Style: Gucci, Balenciaga product photography applied to sportswear. 3:4 portrait, no text, no model.`,
  },
];

function gerar(prompt) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ model:'gpt-image-2', prompt, n:1, size:'1024x1536', quality:'high', output_format:'png' });
    const req = https.request({
      hostname:'api.openai.com', path:'/v1/images/generations', method:'POST',
      headers:{ 'Content-Type':'application/json', 'Authorization':`Bearer ${API_KEY}`, 'Content-Length':Buffer.byteLength(body) },
    }, res => {
      let d=''; res.on('data',c=>d+=c);
      res.on('end',()=>{ const j=JSON.parse(d); if(j.error) reject(new Error(j.error.message)); else resolve(j.data[0].b64_json); });
    });
    req.on('error',reject); req.write(body); req.end();
  });
}

for (const img of IMGS) {
  console.log(`Gerando ${img.nome}...`);
  try {
    const b64 = await gerar(img.prompt);
    fs.writeFileSync(`${OUT}/${img.nome}.png`, Buffer.from(b64,'base64'));
    console.log(`✓ ${img.nome}.png`);
  } catch(e) { console.error(`✗ ${img.nome}: ${e.message}`); }
}
