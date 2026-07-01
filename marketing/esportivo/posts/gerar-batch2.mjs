import { writeFileSync } from 'fs';

const R = 'c:/Users/seven/MazyOS/saidas/shopify-produtos-2026/imagens';

const template = ({ img, tag, l1, l2, sub, blade, glow, textColor='#fff', outlineColor='rgba(255,255,255,0.4)' }) => `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,100;0,300;0,900;1,900&family=Barlow:wght@300&display=swap" rel="stylesheet">
<style>
* { margin:0; padding:0; box-sizing:border-box; }
body { width:1080px; height:1350px; overflow:hidden; background:#000; }
.c { width:1080px; height:1350px; position:relative; }
.base { position:absolute; inset:0; z-index:0; background:#080808; }
.product { position:absolute; inset:0; z-index:1; display:flex; align-items:center; justify-content:center; }
.product img {
  width:100%; height:100%;
  object-fit:cover; object-position:center 28%;
  filter:brightness(0.78) contrast(1.18) saturate(1.0);
  mix-blend-mode:multiply;
}
.glow { position:absolute; inset:0; z-index:2; pointer-events:none;
  background:radial-gradient(ellipse at 50% 40%, ${glow} 0%, transparent 58%); }
.vignette { position:absolute; inset:0; z-index:3;
  background:radial-gradient(ellipse at 50% 38%, transparent 28%, rgba(0,0,0,0.42) 55%, rgba(0,0,0,0.97) 100%); }
.shadow-b { position:absolute; bottom:0; left:0; right:0; height:40%; z-index:4;
  background:linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.72) 45%, transparent 100%); }
.shadow-t { position:absolute; top:0; left:0; right:0; height:18%; z-index:4;
  background:linear-gradient(to bottom, rgba(0,0,0,0.88) 0%, transparent 100%); }
.blade { position:absolute; top:0; left:0; z-index:10; width:3px; height:100%;
  background:linear-gradient(to bottom, transparent 5%, ${blade} 25%, ${blade} 78%, transparent 100%); }
.tag { position:absolute; top:52px; left:60px; z-index:20;
  font-family:'Barlow',sans-serif; font-size:12px; font-weight:300; letter-spacing:6px;
  color:rgba(255,255,255,0.28); text-transform:uppercase; }
.handle { position:absolute; top:52px; right:56px; z-index:20;
  font-family:'Barlow',sans-serif; font-size:12px; font-weight:300; letter-spacing:4px;
  color:rgba(255,255,255,0.22); text-transform:lowercase; }
.copy { position:absolute; bottom:60px; left:60px; right:60px; z-index:20; }
.l1 {
  font-family:'Barlow Condensed',sans-serif;
  font-size:136px; font-weight:900; line-height:0.85;
  color:${textColor}; text-transform:uppercase; letter-spacing:-5px; display:block;
}
.l2 {
  font-family:'Barlow Condensed',sans-serif;
  font-size:136px; font-weight:900; line-height:0.85; font-style:italic;
  -webkit-text-stroke:1.5px ${outlineColor}; color:transparent;
  text-transform:uppercase; letter-spacing:-5px; display:block; margin-bottom:20px;
}
.div { width:44px; height:1.5px; background:rgba(255,255,255,0.22); margin-bottom:14px; }
.sub { font-family:'Barlow',sans-serif; font-size:16px; font-weight:300; letter-spacing:7px;
  color:rgba(255,255,255,0.32); text-transform:uppercase; }
</style>
</head>
<body>
<div class="c">
  <div class="base"></div>
  <div class="product"><img src="${img}" alt=""></div>
  <div class="glow"></div>
  <div class="vignette"></div>
  <div class="shadow-b"></div>
  <div class="shadow-t"></div>
  <div class="blade"></div>
  <div class="tag">${tag}</div>
  <div class="handle">@emporionortebelem</div>
  <div class="copy">
    <span class="l1">${l1}</span>
    <span class="l2">${l2}</span>
    <div class="div"></div>
    <div class="sub">${sub}</div>
  </div>
</div>
</body>
</html>`;

const posts = [
  {
    name: 'fla-retro',
    img: `${R}/RÊTRO/flamengo-retro/imagem-principal.jpg`,
    tag: 'Coleção Retrô',
    l1: 'Rubro-', l2: 'Negro.',
    sub: 'Flamengo Retrô · A camisa original · Link na bio',
    blade: 'rgba(210,20,20,0.7)',
    glow: 'rgba(190,15,15,0.14)',
  },
  {
    name: 'holanda',
    img: `${R}/SELEÇÕES/holanda/imagem-principal.jpg`,
    tag: 'Coleção Seleções',
    l1: 'Laranja', l2: 'Mecânica.',
    sub: 'Holanda · Total Football · Link na bio',
    blade: 'rgba(255,110,0,0.7)',
    glow: 'rgba(255,100,0,0.14)',
    textColor: '#fff',
  },
  {
    name: 'napoli',
    img: `${R}/EUROPA/napoli/imagem-principal.jpg`,
    tag: 'Coleção Europa',
    l1: 'Diego', l2: 'viveu aqui.',
    sub: 'Napoli · Nápoles · Link na bio',
    blade: 'rgba(0,120,210,0.65)',
    glow: 'rgba(0,100,200,0.12)',
  },
  {
    name: 'milan-retro',
    img: `${R}/RÊTRO/milan-retro/imagem-principal.jpg`,
    tag: 'Coleção Retrô',
    l1: 'Rosso-', l2: 'Nero.',
    sub: 'AC Milan Retrô · Serie A · Link na bio',
    blade: 'rgba(200,15,15,0.65)',
    glow: 'rgba(180,10,10,0.12)',
  },
  {
    name: 'portugal',
    img: `${R}/SELEÇÕES/portugal/imagem-principal.jpg`,
    tag: 'Coleção Seleções',
    l1: 'Portugal.', l2: 'Sempre.',
    sub: 'Seleção de Portugal · Link na bio',
    blade: 'rgba(200,15,15,0.65)',
    glow: 'rgba(180,10,10,0.10)',
  },
  {
    name: 'fluminense',
    img: `${R}/BRASILEIRO/fluminense/imagem-principal.jpg`,
    tag: 'Coleção Brasileiro',
    l1: 'Tricolor', l2: 'Carioca.',
    sub: 'Fluminense · Laranjeiras · Link na bio',
    blade: 'rgba(150,30,30,0.6)',
    glow: 'rgba(130,20,20,0.10)',
  },
];

const DIR = 'c:/Users/seven/MazyOS/marketing/esportivo/posts';
for (const p of posts) {
  writeFileSync(`${DIR}/b2-${p.name}.html`, template(p));
  console.log(`✓ b2-${p.name}.html`);
}
