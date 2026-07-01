import https from 'https';
import fs from 'fs';

const API_KEY = process.env.OPENAI_API_KEY;
const OUT = 'c:/Users/seven/MazyOS/marketing/esportivo/v4-content';

const IMAGENS = [
  {
    nome: '05-camisa-vestiario',
    prompt: `Cinematic documentary photograph. Single yellow Brazilian national football team jersey hanging alone on a hook in a completely dark, empty locker room. One dramatic overhead spotlight illuminates only the jersey, creating a pool of light in total darkness. The fabric texture and CBF crest detail are visible. Deep black shadows fill the entire background. The atmosphere is heavy, mysterious, documentary. Style of Netflix sports documentary, ESPN FC, The Athletic investigative journalism. Ultra-realistic, 85mm full-frame lens, shallow depth of field, natural film grain. No people. Portrait 3:4.`,
  },
  {
    nome: '06-jogador-costas',
    prompt: `Cinematic sports documentary photograph. Brazilian national team footballer seen from behind, standing completely alone at the center of a pitch at night. He looks toward an empty, massive stadium with stadium lights on in the background. Yellow jersey visible from behind. Strong backlighting creates a dramatic rim light silhouette effect. Deep cinematic color grading — cold blues, warm yellows. Heavy film grain. The scene feels isolating, tense, like a documentary about controversy. Style: Netflix sports doc, ESPN, The Athletic. Ultra-realistic, 85mm lens. Portrait 3:4.`,
  },
];

function gerarImagem(prompt) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ model:'gpt-image-2', prompt, n:1, size:'1024x1536', quality:'high', output_format:'png' });
    const req = https.request({
      hostname:'api.openai.com', path:'/v1/images/generations', method:'POST',
      headers:{ 'Content-Type':'application/json', 'Authorization':`Bearer ${API_KEY}`, 'Content-Length':Buffer.byteLength(body) },
    }, res => {
      let d=''; res.on('data',c=>d+=c);
      res.on('end',()=>{
        const j=JSON.parse(d);
        if(j.error) reject(new Error(j.error.message));
        else resolve(j.data[0].b64_json || j.data[0].url);
      });
    });
    req.on('error',reject); req.write(body); req.end();
  });
}

for (const img of IMAGENS) {
  console.log(`Gerando: ${img.nome}...`);
  try {
    const result = await gerarImagem(img.prompt);
    const path = `${OUT}/${img.nome}.png`;
    if (result.length > 500) fs.writeFileSync(path, Buffer.from(result,'base64'));
    else {
      const { default: https2 } = await import('https');
      await new Promise((res,rej)=>{
        const f=fs.createWriteStream(path);
        https2.get(result, r=>{ r.pipe(f); f.on('finish',()=>{ f.close(); res(); }); }).on('error',rej);
      });
    }
    console.log(`✓ ${img.nome}.png`);
  } catch(e) { console.error(`✗ ${img.nome}: ${e.message}`); }
}
console.log('Pronto.');
