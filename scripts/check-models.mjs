import https from 'https';

const KEY = process.env.OPENAI_API_KEY;

const options = {
  hostname: 'api.openai.com',
  path: '/v1/models',
  method: 'GET',
  headers: { 'Authorization': `Bearer ${KEY}` },
};

https.request(options, res => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    const j = JSON.parse(data);
    if (j.error) { console.error('ERRO:', j.error.message); return; }
    const imgs = j.data.filter(m => m.id.includes('dall') || m.id.includes('image') || m.id.includes('gpt-image'));
    console.log('Modelos de imagem disponíveis:');
    imgs.forEach(m => console.log(' -', m.id));
    if (!imgs.length) console.log('Nenhum modelo de imagem encontrado nessa conta.');
  });
}).end();
