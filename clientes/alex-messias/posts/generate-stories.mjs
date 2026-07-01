import { writeFileSync } from 'fs';

const DIR = 'c:/Users/seven/MazyOS/clientes/alex-messias/posts';
const I = '../imagens';

const FONTS = `<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@100;200;300;700;900&family=Inter:wght@200;300;400;500&display=swap" rel="stylesheet">`;
const GWM_SVG = `<svg width="26" height="26" viewBox="0 0 26 26" fill="none"><circle cx="13" cy="13" r="11.5" stroke="white" stroke-width="1.2"/><text x="13" y="17.5" text-anchor="middle" font-family="Arial Black,sans-serif" font-size="7" font-weight="900" fill="white">GWM</text></svg>`;

const BASE = `
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
html{-webkit-font-smoothing:antialiased;}
body{width:1080px;height:1920px;overflow:hidden;background:#080808;}
.c{width:1080px;height:1920px;position:relative;overflow:hidden;}
.hdr{position:absolute;top:52px;left:58px;right:58px;z-index:20;display:flex;align-items:center;justify-content:space-between;}
.hb{display:flex;align-items:center;gap:10px;}
.hn{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:16px;color:#fff;letter-spacing:5px;text-transform:uppercase;}
.hp{color:rgba(255,255,255,.28);margin:0 8px;}
.hd{font-family:'Barlow Condensed',sans-serif;font-weight:300;font-size:16px;color:rgba(255,255,255,.65);letter-spacing:4px;text-transform:uppercase;}
.hu{font-family:'Inter',sans-serif;font-size:10px;font-weight:400;letter-spacing:3px;color:rgba(255,255,255,.5);}
.seal{position:absolute;bottom:0;left:0;right:0;z-index:25;padding:0 58px 52px;}
.s-inner{display:flex;align-items:center;gap:12px;padding-top:20px;border-top:1px solid rgba(255,255,255,.08);margin-bottom:16px;}
.s-bar{width:2.5px;height:38px;background:#D71920;flex-shrink:0;}
.s-name{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:19px;color:#fff;letter-spacing:3px;text-transform:uppercase;line-height:1;}
.s-role{font-family:'Inter',sans-serif;font-size:9px;font-weight:400;letter-spacing:3px;text-transform:uppercase;color:rgba(255,255,255,.58);margin-top:4px;}
.s-wa{margin-left:auto;font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:13px;letter-spacing:2px;color:#25D366;text-transform:uppercase;}
.ftr{display:flex;align-items:center;justify-content:space-between;}
.fc{font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:12px;letter-spacing:5px;color:rgba(255,255,255,.58);text-transform:uppercase;}
.fd{display:inline-block;width:3px;height:3px;background:#D71920;border-radius:50%;margin:0 12px;vertical-align:middle;}
.ft{font-family:'Barlow Condensed',sans-serif;font-size:12px;font-weight:700;letter-spacing:5px;color:#D71920;text-transform:uppercase;}
.fu{font-family:'Inter',sans-serif;font-size:10px;font-weight:400;letter-spacing:3px;color:rgba(255,255,255,.48);}`;

const HDR = `<div class="hdr"><div class="hb">${GWM_SVG}<span class="hn">GWM</span><span class="hp">|</span><span class="hd">DAHRUJ</span></div><div class="hu">gwmdahruj.com.br</div></div>`;

const SEAL = (wa=false) => `
<div class="seal">
  <div class="s-inner">
    <div class="s-bar"></div>
    <div><div class="s-name">ALEX MESSIAS</div><div class="s-role">Especialista GWM · Mobilidade Híbrida e Elétrica</div></div>
    ${wa ? `<div class="s-wa">WhatsApp ↗</div>` : ''}
  </div>
  <div class="ftr"><span class="fc">Jundiaí — SP</span><span class="fd"></span><span class="ft">GWM Dahruj</span><span class="fu">gwmdahruj.com.br</span></div>
</div>`;

// Layout 1: Enquete (full bleed car + poll)
function enquete({ img, br=0.65, pos='50% 50%', eye, h1, h2, op1, op2, icon1='', icon2='' }) {
  return `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8">${FONTS}<style>
${BASE}
.car{position:absolute;inset:0;z-index:1;}
.car img{width:100%;height:100%;object-fit:cover;object-position:${pos};filter:brightness(${br}) contrast(1.18) saturate(.85);}
.ov{position:absolute;inset:0;z-index:2;background:linear-gradient(to top,rgba(8,8,8,.99) 0%,rgba(8,8,8,.55) 40%,rgba(8,8,8,.2) 65%,transparent 100%);}
.ov-t{position:absolute;top:0;left:0;right:0;height:300px;z-index:3;background:linear-gradient(to bottom,rgba(8,8,8,.95) 0%,transparent 100%);}
.blade{position:absolute;top:0;left:0;z-index:5;width:3px;height:100%;background:linear-gradient(to bottom,#D71920 30%,rgba(215,25,32,0) 100%);}
.eye{position:absolute;top:158px;left:58px;z-index:20;font-family:'Inter',sans-serif;font-size:9px;font-weight:500;letter-spacing:7px;text-transform:uppercase;color:rgba(255,255,255,.5);}
.center{position:absolute;top:50%;left:0;right:0;z-index:20;transform:translateY(-62%);padding:0 58px;}
.q{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:90px;line-height:.85;text-transform:uppercase;letter-spacing:-2px;color:#fff;margin-bottom:20px;}
.q-sub{font-family:'Inter',sans-serif;font-size:15px;font-weight:300;letter-spacing:5px;text-transform:uppercase;color:rgba(255,255,255,.6);margin-bottom:52px;}
.opts{display:flex;flex-direction:column;gap:18px;}
.opt{display:flex;align-items:center;gap:20px;border:1.5px solid rgba(255,255,255,.25);padding:26px 32px;font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:34px;color:#fff;text-transform:uppercase;letter-spacing:3px;}
.opt.a{border-color:#D71920;background:rgba(215,25,32,.08);}
.opt.b{border-color:rgba(255,255,255,.18);}
.opt-icon{font-size:28px;}
</style></head><body><div class="c">
  <div class="car"><img src="${img}" alt=""></div>
  <div class="ov"></div><div class="ov-t"></div><div class="blade"></div>
  ${HDR}
  ${eye ? `<div class="eye">${eye}</div>` : ''}
  <div class="center">
    <div class="q">${h1.replace(/\n/g,'<br>')}</div>
    ${h2 ? `<div class="q-sub">${h2}</div>` : ''}
    <div class="opts">
      <div class="opt a"><span class="opt-icon">${icon1}</span>${op1}</div>
      <div class="opt b"><span class="opt-icon">${icon2}</span>${op2}</div>
    </div>
  </div>
  ${SEAL()}
</div></body></html>`;
}

// Layout 2: Stat story (dark/ghost + massive number)
function statStory({ img, br=0.18, pos='50% 48%', eye, num, unit, sub, desc, copy }) {
  return `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8">${FONTS}<style>
${BASE}
.car{position:absolute;inset:0;z-index:1;}
.car img{width:100%;height:100%;object-fit:cover;object-position:${pos};filter:brightness(${br}) contrast(1.38) saturate(0);}
.glow{position:absolute;bottom:0;left:0;right:0;height:600px;z-index:2;background:radial-gradient(ellipse 80% 55% at 50% 100%,rgba(215,25,32,.07) 0%,transparent 70%);}
.eye{position:absolute;top:158px;left:58px;z-index:20;font-family:'Inter',sans-serif;font-size:9px;font-weight:500;letter-spacing:7px;text-transform:uppercase;color:rgba(255,255,255,.52);}
.num-block{position:absolute;top:240px;left:48px;z-index:20;display:flex;align-items:flex-start;}
.n{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:420px;line-height:.82;color:#fff;letter-spacing:-12px;}
.u{font-family:'Barlow Condensed',sans-serif;font-weight:200;font-size:80px;color:rgba(255,255,255,.5);text-transform:uppercase;margin-top:42px;margin-left:8px;}
.sub{position:absolute;top:720px;left:58px;z-index:20;}
.sl{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:88px;text-transform:uppercase;letter-spacing:-2px;color:#fff;line-height:.9;}
.sd{font-family:'Barlow Condensed',sans-serif;font-weight:300;font-size:28px;letter-spacing:7px;text-transform:uppercase;color:rgba(255,255,255,.62);margin-top:18px;}
.copy{position:absolute;top:1100px;left:58px;right:58px;z-index:20;border-left:2.5px solid #D71920;padding-left:22px;}
.ct{font-family:'Barlow Condensed',sans-serif;font-weight:300;font-size:40px;line-height:1.35;color:rgba(255,255,255,.7);}
.ct strong{color:#fff;font-weight:700;}
</style></head><body><div class="c">
  ${img ? `<div class="car"><img src="${img}" alt=""></div>` : ''}
  <div class="glow"></div>
  ${HDR}
  ${eye ? `<div class="eye">${eye}</div>` : ''}
  <div class="num-block"><span class="n">${num}</span>${unit ? `<span class="u">${unit}</span>` : ''}</div>
  <div class="sub"><div class="sl">${sub.replace(/\n/g,'<br>')}</div>${desc ? `<div class="sd">${desc}</div>` : ''}</div>
  ${copy ? `<div class="copy"><div class="ct">${copy}</div></div>` : ''}
  ${SEAL()}
</div></body></html>`;
}

// Layout 3: Hero story (car full bleed + headline + CTA)
function heroStory({ img, br=0.70, pos='50% 50%', eye, h1, h2, sub, cta, ctaLabel, wa=false }) {
  return `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8">${FONTS}<style>
${BASE}
.car{position:absolute;inset:0;z-index:1;}
.car img{width:100%;height:100%;object-fit:cover;object-position:${pos};filter:brightness(${br}) contrast(1.15) saturate(.88);}
.ov-l{position:absolute;inset:0;z-index:2;background:linear-gradient(108deg,rgba(8,8,8,.98) 0%,rgba(8,8,8,.88) 28%,rgba(8,8,8,.5) 52%,rgba(8,8,8,.06) 74%,transparent 100%);}
.ov-b{position:absolute;inset:0;z-index:3;background:linear-gradient(to top,rgba(8,8,8,.95) 0%,rgba(8,8,8,.1) 22%,transparent 42%);}
.blade{position:absolute;top:0;left:0;z-index:5;width:3px;height:100%;background:linear-gradient(to bottom,#D71920 35%,rgba(215,25,32,0) 100%);}
.eye{position:absolute;top:158px;left:58px;z-index:20;font-family:'Inter',sans-serif;font-size:9px;font-weight:500;letter-spacing:7px;text-transform:uppercase;color:rgba(255,255,255,.5);}
.headline{position:absolute;top:220px;left:54px;z-index:20;}
.hs{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:220px;line-height:.84;text-transform:uppercase;letter-spacing:-5px;color:#fff;}
.ho{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:220px;line-height:.84;text-transform:uppercase;letter-spacing:-5px;-webkit-text-stroke:2px rgba(255,255,255,.42);color:transparent;}
.sub{position:absolute;top:900px;left:58px;z-index:20;font-family:'Barlow Condensed',sans-serif;font-weight:300;font-size:30px;letter-spacing:7px;text-transform:uppercase;color:rgba(255,255,255,.65);}
.cta-block{position:absolute;top:1000px;left:58px;z-index:20;}
.cta-lbl{font-family:'Inter',sans-serif;font-size:9px;font-weight:500;letter-spacing:7px;text-transform:uppercase;color:rgba(255,255,255,.55);margin-bottom:18px;}
.cta-btn{display:inline-flex;align-items:center;gap:18px;border:2px solid #D71920;background:rgba(215,25,32,.1);padding:28px 56px;font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:30px;color:#fff;text-transform:uppercase;letter-spacing:5px;}
.cta-arr{color:#D71920;}
</style></head><body><div class="c">
  <div class="car"><img src="${img}" alt=""></div>
  <div class="ov-l"></div><div class="ov-b"></div><div class="blade"></div>
  ${HDR}
  ${eye ? `<div class="eye">${eye}</div>` : ''}
  <div class="headline">
    <div class="hs">${h1.replace(/\n/g,'<br>')}</div>
    ${h2 ? `<div class="ho">${h2.replace(/\n/g,'<br>')}</div>` : ''}
  </div>
  ${sub ? `<div class="sub">${sub}</div>` : ''}
  ${cta ? `<div class="cta-block"><div class="cta-lbl">${ctaLabel ?? 'Reserve agora'}</div><div class="cta-btn">${cta} <span class="cta-arr">→</span></div></div>` : ''}
  ${SEAL(wa)}
</div></body></html>`;
}

// Layout 4: Produto story
function produtoStory({ img, br=0.72, pos='50% 52%', eye, t1, t2, tagline, specs=[] }) {
  const specsHtml = specs.map((s,i) =>
    `<div class="spec${i>0?' spl':''}"><div><span class="sv">${s.val}</span>${s.unit?`<span class="su">${s.unit}</span>`:''}</div><div class="sl">${s.lbl}</div></div>`
  ).join('');
  return `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8">${FONTS}<style>
${BASE}
.car{position:absolute;inset:0;z-index:1;}
.car img{width:100%;height:100%;object-fit:cover;object-position:${pos};filter:brightness(${br}) contrast(1.12) saturate(.78);}
.ov-t{position:absolute;top:0;left:0;right:0;height:680px;z-index:2;background:linear-gradient(to bottom,rgba(8,8,8,.98) 0%,rgba(8,8,8,.82) 58%,transparent 100%);}
.ov-b{position:absolute;bottom:0;left:0;right:0;height:480px;z-index:2;background:linear-gradient(to top,rgba(8,8,8,.97) 0%,transparent 100%);}
.line{position:absolute;top:580px;left:0;right:0;z-index:5;height:2px;background:linear-gradient(to right,transparent 0%,#D71920 6%,#D71920 70%,transparent 100%);}
.cat{position:absolute;top:158px;left:58px;z-index:20;display:flex;align-items:center;gap:10px;}
.cat-bar{width:28px;height:1.5px;background:#D71920;}
.cat-txt{font-family:'Inter',sans-serif;font-size:9px;font-weight:600;letter-spacing:7px;text-transform:uppercase;color:#D71920;}
.title{position:absolute;top:195px;left:56px;z-index:20;}
.t1{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:220px;line-height:.84;text-transform:uppercase;letter-spacing:-4px;color:#fff;}
.t2{font-family:'Barlow Condensed',sans-serif;font-weight:100;font-size:140px;line-height:.84;text-transform:uppercase;letter-spacing:-3px;-webkit-text-stroke:1.5px rgba(255,255,255,.42);color:transparent;}
.tag{position:absolute;top:604px;left:58px;z-index:20;font-family:'Barlow Condensed',sans-serif;font-weight:400;font-size:34px;letter-spacing:4px;text-transform:uppercase;color:rgba(255,255,255,.72);}
.specs{position:absolute;bottom:230px;left:58px;right:58px;z-index:20;display:flex;border-top:1px solid rgba(255,255,255,.1);padding-top:30px;}
.spec{flex:1;padding-right:24px;border-right:1px solid rgba(255,255,255,.08);}
.spl{padding-left:24px;border-right:none;}
.sv{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:52px;color:#fff;letter-spacing:-1px;line-height:1;}
.su{font-family:'Barlow Condensed',sans-serif;font-weight:300;font-size:20px;color:#D71920;letter-spacing:2px;margin-left:2px;}
.sl{font-family:'Inter',sans-serif;font-size:9px;font-weight:400;letter-spacing:4px;text-transform:uppercase;color:rgba(255,255,255,.55);margin-top:6px;}
</style></head><body><div class="c">
  <div class="car"><img src="${img}" alt=""></div>
  <div class="ov-t"></div><div class="ov-b"></div><div class="line"></div>
  ${HDR}
  <div class="cat"><div class="cat-bar"></div><div class="cat-txt">${eye ?? 'Produto'}</div></div>
  <div class="title"><div class="t1">${t1}</div>${t2?`<div class="t2">${t2}</div>`:''}</div>
  ${tagline?`<div class="tag">${tagline}</div>`:''}
  ${specsHtml?`<div class="specs">${specsHtml}</div>`:''}
  ${SEAL()}
</div></body></html>`;
}

// ─── STORIES DATA ─────────────────────────────────────────────────────────────

const stories = [
  { id:'01', fn:'enquete',
    img:`${I}/fabrica/lineup-dusk.png`, br:0.58, pos:'50% 38%',
    eye:'Qual é o seu?',
    h1:'QUAL GWM\nVOCÊ ESCOLHERIA?',
    h2:'Selecione a sua opção',
    op1:'HAVAL H6  — Híbrido', op2:'HAVAL H9  — V6 Turbo',
    icon1:'⚡', icon2:'💪' },

  { id:'02', fn:'enquete',
    img:`${I}/h6gt-blue.webp`, br:0.62, pos:'50% 55%',
    eye:'Enquete · Test Drive',
    h1:'JÁ FEZ TEST\nDRIVE EM UM HÍBRIDO?',
    h2:'Me conta a sua experiência',
    op1:'SIM, já experimentei', op2:'NÃO, quero agendar',
    icon1:'✅', icon2:'📅' },

  { id:'03', fn:'statStory',
    img:`${I}/h6-phev-blue.jpg`, br:0.2,
    eye:'HAVAL H6 PHEV · Autonomia',
    num:'+800', unit:'KM',
    sub:'SEM PARAR.',
    desc:'HAVAL H6 PHEV · Modo híbrido',
    copy:'Enquanto você abastece <strong>uma vez</strong>, o H6 já percorreu o Brasil.' },

  { id:'04', fn:'heroProd',
    img:`${I}/ora5/ora5-teal.jpg`, br:0.72, pos:'48% 48%',
    eye:'ORA 5 · Elétrico · Em breve',
    t1:'ORA', t2:'5',
    tagline:'100% elétrico. Chegando ao Brasil.',
    specs:[{val:'EV',unit:'',lbl:'100% elétrico'},{val:'Design',unit:'',lbl:'Que faz diferença'},{val:'2026',unit:'',lbl:'Em breve'}] },

  { id:'05', fn:'heroProd',
    img:`${I}/ora5/ora5-interior.jpg`, br:0.8, pos:'50% 38%',
    eye:'ORA 5 · Interior · Tecnologia',
    t1:'INTERIOR', t2:'DO FUTURO.',
    tagline:'15 polegadas. IA integrada. Zero emissão.',
    specs:[{val:'15"',unit:'',lbl:'Tela central'},{val:'AI',unit:'',lbl:'Assistente integrado'},{val:'OTA',unit:'',lbl:'Atualizações remotas'}] },

  { id:'06', fn:'heroStory',
    img:`${I}/fabrica/lineup-dusk.png`, br:0.62, pos:'50% 38%',
    eye:'GWM Brasil · Fábrica Nacional',
    h1:'A FÁBRICA\nGWM NO', h2:'BRASIL\nJÁ É REAL',
    sub:'Produção nacional. Padrão global.' },

  { id:'07', fn:'statStory',
    img:`${I}/h6-phev-blue.jpg`, br:0.16,
    eye:'Pergunta · Elétrico · Economia',
    num:'R$', unit:'',
    sub:'QUANTO CUSTA\nCARREGAR?',
    desc:'ORA 5 / HAVAL H6 PHEV',
    copy:'Carregar em casa custa <strong>~R$ 8-15 por 100km.</strong> Gasolina? 3x mais. <strong>Consulte.</strong>' },

  { id:'08', fn:'heroStory',
    img:`${I}/h6gt-dark.webp`, br:0.68, pos:'68% center',
    eye:'GWM vs Concorrência',
    h1:'GWM.', h2:'A ESCOLHA\nQUE SURPREENDE',
    sub:'Tecnologia superior. Custo acessível.' },

  { id:'09', fn:'heroStory',
    img:`${I}/h6gt-blue.webp`, br:0.72, pos:'50% 56%',
    eye:'Test Drive · Hoje · Jundiaí',
    h1:'VAGA\nDISPONÍVEL', h2:'HOJE',
    sub:'HAVAL H6 GT · GWM Dahruj Jundiaí',
    cta:'Agendar agora', ctaLabel:'Reserve seu test drive', wa:true },

  { id:'10', fn:'heroStory',
    img:`${I}/h6gt-dark.webp`, br:0.62,
    eye:'WhatsApp · Contato direto',
    h1:'FALE\nCOMIGO', h2:'DIRETO\nPELO WHATS',
    sub:'Sem enrolação. Resposta rápida.',
    cta:'Abrir WhatsApp', ctaLabel:'Tire suas dúvidas agora', wa:true },

  { id:'11', fn:'heroStory',
    img:`${I}/h6-silver-event.jpg`, br:0.62, pos:'55% 44%',
    eye:'Alex Messias · GWM Dahruj',
    h1:'ALEX\nMESSIAS', h2:'ESPECIALISTA\nGWM',
    sub:'Mobilidade híbrida e elétrica em Jundiaí.' },

  { id:'12', fn:'statStory',
    img:`${I}/h6gt-blue.webp`, br:0.18,
    eye:'Test Drive · Decisão · Resultado',
    num:'20', unit:'min',
    sub:'MUDAM\nTUDO.',
    desc:'Test drive sem compromisso · Jundiaí',
    copy:'<strong>20 minutos ao volante</strong> valem mais do que qualquer explicação. <strong>Agende.</strong>' },
];

// Map fn names
const FNS = { enquete, statStory, heroStory, heroProd: produtoStory };

let ok = 0;
for (const s of stories) {
  const fn = FNS[s.fn];
  if (!fn) { console.error(`Unknown fn: ${s.fn} story ${s.id}`); continue; }
  const html = fn(s);
  writeFileSync(`${DIR}/story-${s.id}.html`, html, 'utf8');
  console.log(`✓ story-${s.id}.html  [${s.fn}]`);
  ok++;
}
console.log(`\n${ok}/12 stories geradas.`);
