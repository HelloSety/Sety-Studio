import { writeFileSync } from 'fs';

const BASE_IMGS = 'c:/Users/seven/MazyOS/saidas/shopify-produtos-2026/imagens';

const template = ({ img, tag, line1, line2, sub, blade, glow }) => `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,100;0,300;0,900;1,900&family=Barlow:wght@300&display=swap" rel="stylesheet">
<style>
* { margin:0; padding:0; box-sizing:border-box; }
body { width:1080px; height:1350px; overflow:hidden; background:#000; }
.c { width:1080px; height:1350px; position:relative; }
.base { position:absolute; inset:0; z-index:0; background:#0a0a0a; }
.product { position:absolute; inset:0; z-index:1; display:flex; align-items:center; justify-content:center; }
.product img { width:100%; height:100%; object-fit:cover; object-position:center 30%;
  filter:brightness(0.72) contrast(1.2) saturate(0.9);
  mix-blend-mode:multiply; }
.glow { position:absolute; inset:0; z-index:2;
  background:radial-gradient(ellipse at 50% 40%, ${glow} 0%, transparent 60%); }
.vignette { position:absolute; inset:0; z-index:3;
  background:radial-gradient(ellipse at 50% 42%, transparent 32%, rgba(0,0,0,0.45) 58%, rgba(0,0,0,0.97) 100%); }
.shadow-b { position:absolute; bottom:0; left:0; right:0; height:42%; z-index:4;
  background:linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.75) 40%, transparent 100%); }
.shadow-t { position:absolute; top:0; left:0; right:0; height:18%; z-index:4;
  background:linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, transparent 100%); }
.blade { position:absolute; top:0; left:0; z-index:10; width:3px; height:100%;
  background:linear-gradient(to bottom, transparent 0%, ${blade} 25%, ${blade} 75%, transparent 100%); }
.tag { position:absolute; top:52px; left:60px; z-index:20;
  font-family:'Barlow',sans-serif; font-size:12px; font-weight:300; letter-spacing:6px;
  color:rgba(255,255,255,0.28); text-transform:uppercase; }
.handle { position:absolute; top:52px; right:56px; z-index:20;
  font-family:'Barlow',sans-serif; font-size:12px; font-weight:300; letter-spacing:4px;
  color:rgba(255,255,255,0.22); text-transform:lowercase; }
.copy { position:absolute; bottom:64px; left:60px; right:60px; z-index:20; }
.l1 { font-family:'Barlow Condensed',sans-serif; font-size:130px; font-weight:900; line-height:0.86;
  color:#fff; text-transform:uppercase; letter-spacing:-5px; display:block; }
.l2 { font-family:'Barlow Condensed',sans-serif; font-size:130px; font-weight:900; line-height:0.86; font-style:italic;
  -webkit-text-stroke:1.5px rgba(255,255,255,0.45); color:transparent;
  text-transform:uppercase; letter-spacing:-5px; display:block; margin-bottom:18px; }
.divider { width:44px; height:1.5px; background:rgba(255,255,255,0.25); margin-bottom:14px; }
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
    <span class="l1">${line1}</span>
    <span class="l2">${line2}</span>
    <div class="divider"></div>
    <div class="sub">${sub}</div>
  </div>
</div>
</body>
</html>`;

const posts = [
  {
    name: 'rubro-negro',
    img: `${BASE_IMGS}/BRASILEIRO/flamengo/imagem-principal.jpg`,
    tag: 'Coleção Brasileiro',
    line1: 'Rubro-',
    line2: 'Negro.',
    sub: 'Maior torcida do Brasil · Link na bio',
    blade: 'rgba(220,30,30,0.65)',
    glow: 'rgba(200,20,20,0.12)',
  },
  {
    name: 'verde',
    img: `${BASE_IMGS}/BRASILEIRO/palmeiras/imagem-principal.jpg`,
    tag: 'Coleção Brasileiro',
    line1: 'Maior',
    line2: 'Campeão.',
    sub: 'Palmeiras · Coleção 2026 · Link na bio',
    blade: 'rgba(0,180,60,0.65)',
    glow: 'rgba(0,160,50,0.10)',
  },
  {
    name: 'la-bombonera',
    img: `${BASE_IMGS}/SUL AMERICANOS/boca-juniors/imagem-principal.jpg`,
    tag: 'Coleção Sul-Americana',
    line1: 'La',
    line2: 'Bombonera.',
    sub: 'Boca Juniors · Uma lenda azul e ouro · Link na bio',
    blade: 'rgba(0,100,220,0.65)',
    glow: 'rgba(0,80,200,0.10)',
  },
  {
    name: '2022',
    img: `${BASE_IMGS}/SELEÇÕES/argentina/imagem-principal.jpg`,
    tag: 'Coleção Seleções',
    line1: '2022.',
    line2: 'Inesquecível.',
    sub: 'Argentina · O mundo parou · Link na bio',
    blade: 'rgba(100,160,255,0.60)',
    glow: 'rgba(80,140,255,0.09)',
  },
  {
    name: 'santos',
    img: `${BASE_IMGS}/BRASILEIRO/santos/imagem-principal.jpg`,
    tag: 'Coleção Brasileiro',
    line1: 'O Rei',
    line2: 'jogou aqui.',
    sub: 'Santos · Vila Belmiro · Link na bio',
    blade: 'rgba(255,255,255,0.35)',
    glow: 'rgba(255,255,255,0.05)',
  },
  {
    name: 'river',
    img: `${BASE_IMGS}/SUL AMERICANOS/river-plate/imagem-principal.jpg`,
    tag: 'Coleção Sul-Americana',
    line1: 'Los',
    line2: 'Millonarios.',
    sub: 'River Plate · Argentina · Link na bio',
    blade: 'rgba(220,30,30,0.55)',
    glow: 'rgba(200,20,20,0.09)',
  },
];

const DIR = 'c:/Users/seven/MazyOS/marketing/esportivo/posts';
for (const p of posts) {
  const html = template(p);
  writeFileSync(`${DIR}/batch-${p.name}.html`, html);
  console.log(`✓ batch-${p.name}.html`);
}
console.log('\n6 HTMLs gerados.');
