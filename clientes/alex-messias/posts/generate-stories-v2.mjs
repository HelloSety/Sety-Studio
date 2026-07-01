import { writeFileSync } from 'fs';

const DIR = 'c:/Users/seven/MazyOS/clientes/alex-messias/posts';
const I   = '../imagens';
const RED = '#E10613';
const BG  = '#050505';

const FONTS = '<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@100;200;300;700;900&family=Inter:wght@200;300;400;500&display=swap" rel="stylesheet">';
const GWM_SVG = '<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><circle cx="11" cy="11" r="9.5" stroke="white" stroke-width="1.2"/><text x="11" y="15" text-anchor="middle" font-family="Arial Black,sans-serif" font-size="5.5" font-weight="900" fill="white">GWM</text></svg>';

const BASE = `
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
html{-webkit-font-smoothing:antialiased;}
body{width:1080px;height:1920px;overflow:hidden;background:${BG};}
.c{width:1080px;height:1920px;position:relative;overflow:hidden;}
.hdr{position:absolute;top:52px;left:58px;right:58px;z-index:20;display:flex;align-items:center;justify-content:space-between;}
.hb{display:flex;align-items:center;gap:10px;}
.hn{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:16px;color:#fff;letter-spacing:4px;text-transform:uppercase;}
.hp{color:rgba(255,255,255,.3);font-size:13px;margin:0 3px;}
.hd{font-family:'Barlow Condensed',sans-serif;font-weight:300;font-size:14px;color:rgba(255,255,255,.6);letter-spacing:4px;text-transform:uppercase;}
.hu{font-family:'Inter',sans-serif;font-size:10px;font-weight:500;letter-spacing:3px;color:${RED};text-transform:lowercase;}
.bot{position:absolute;bottom:0;left:0;right:0;z-index:25;padding:0 58px 52px;}
.seal{display:flex;align-items:center;gap:12px;padding-top:20px;border-top:1px solid rgba(255,255,255,.1);margin-bottom:14px;}
.s-bar{width:2.5px;height:40px;background:${RED};flex-shrink:0;}
.s-name{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:20px;color:#fff;letter-spacing:3px;text-transform:uppercase;line-height:1;text-shadow:0 1px 8px rgba(0,0,0,.8);}
.s-role{font-family:'Inter',sans-serif;font-size:9px;font-weight:400;letter-spacing:3.5px;text-transform:uppercase;color:rgba(255,255,255,.70);margin-top:4px;}
.s-cta{margin-left:auto;font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:13px;letter-spacing:2.5px;color:${RED};text-transform:uppercase;}
.ftr{display:flex;align-items:center;justify-content:space-between;}
.fc{font-family:'Barlow Condensed',sans-serif;font-weight:400;font-size:11px;letter-spacing:4px;color:rgba(255,255,255,.58);text-transform:uppercase;}
.ft{font-family:'Barlow Condensed',sans-serif;font-size:12px;font-weight:700;letter-spacing:3px;color:${RED};text-transform:lowercase;}
`;

const HDR = `<div class="hdr"><div class="hb">${GWM_SVG}<span class="hn">ALEX MESSIAS</span><span class="hp">·</span><span class="hd">Consultor GWM</span></div><div class="hu">@alexmessiasoficial</div></div>`;

function SEAL(role, cta, ctaLabel) {
  const c = cta ? '<div class="s-cta">' + (ctaLabel||'↗ INSTAGRAM') + '</div>' : '';
  return '<div class="bot"><div class="seal"><div class="s-bar"></div><div><div class="s-name">ALEX MESSIAS</div><div class="s-role">' + role + '</div></div>' + c + '</div><div class="ftr"><span class="fc">Campinas • Jundiaí • São Paulo</span><span class="ft">@alexmessiasoficial</span></div></div>';
}

const br_ = s => s.replace(/\n/g,'<br>');

// ─── LAYOUT ENQUETE ───────────────────────────────────────────────────────────
function enquete(p) {
  return `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8">${FONTS}<style>
${BASE}
.car{position:absolute;inset:0;z-index:1;}
.car img{width:100%;height:100%;object-fit:cover;object-position:${p.pos||'50% 50%'};filter:brightness(${p.br||0.62}) contrast(1.18) saturate(.85);}
.ov{position:absolute;inset:0;z-index:2;background:linear-gradient(to top,rgba(5,5,5,.99) 0%,rgba(5,5,5,.52) 42%,rgba(5,5,5,.18) 66%,transparent 100%);}
.ovt{position:absolute;top:0;left:0;right:0;height:320px;z-index:3;background:linear-gradient(to bottom,rgba(5,5,5,.97) 0%,transparent 100%);}
.blade{position:absolute;top:0;left:0;z-index:5;width:3px;height:100%;background:linear-gradient(to bottom,${RED} 30%,rgba(225,6,19,0) 100%);}
.eye{position:absolute;top:168px;left:58px;z-index:20;font-family:'Inter',sans-serif;font-size:9px;font-weight:500;letter-spacing:7px;text-transform:uppercase;color:rgba(255,255,255,.55);}
.center{position:absolute;top:50%;left:0;right:0;z-index:20;transform:translateY(-64%);padding:0 58px;}
.q{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:98px;line-height:.85;text-transform:uppercase;letter-spacing:-2px;color:#fff;margin-bottom:22px;text-shadow:0 2px 20px rgba(0,0,0,.8);}
.q-sub{font-family:'Inter',sans-serif;font-size:14px;font-weight:300;letter-spacing:5px;text-transform:uppercase;color:rgba(255,255,255,.65);margin-bottom:52px;}
.opts{display:flex;flex-direction:column;gap:18px;}
.opt{display:flex;align-items:center;gap:20px;border:1.5px solid rgba(255,255,255,.22);padding:28px 32px;font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:34px;color:#fff;text-transform:uppercase;letter-spacing:3px;text-shadow:0 1px 8px rgba(0,0,0,.6);}
.opt.a{border-color:${RED};background:rgba(225,6,19,.1);}
.opt-icon{font-size:26px;}
</style></head><body><div class="c">
  <div class="car"><img src="${p.img}" alt=""></div>
  <div class="ov"></div><div class="ovt"></div><div class="blade"></div>
  ${HDR}
  ${p.eye?`<div class="eye">${p.eye}</div>`:''}
  <div class="center">
    <div class="q">${br_(p.h1)}</div>
    ${p.h2?`<div class="q-sub">${p.h2}</div>`:''}
    <div class="opts">
      <div class="opt a">${p.icon1?`<span class="opt-icon">${p.icon1}</span>`:''}${p.op1}</div>
      <div class="opt">${p.icon2?`<span class="opt-icon">${p.icon2}</span>`:''}${p.op2}</div>
    </div>
  </div>
  ${SEAL(p.role||'Consultor Especialista GWM')}
</div></body></html>`;
}

// ─── LAYOUT STAT STORY ────────────────────────────────────────────────────────
function statStory(p) {
  return `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8">${FONTS}<style>
${BASE}
.car{position:absolute;inset:0;z-index:1;}
.car img{width:100%;height:100%;object-fit:cover;object-position:${p.pos||'55% 48%'};filter:brightness(${p.br||0.18}) contrast(1.38) saturate(0);}
.glow{position:absolute;bottom:0;left:0;right:0;height:600px;z-index:2;background:radial-gradient(ellipse 80% 55% at 50% 100%,rgba(225,6,19,.07) 0%,transparent 70%);}
.eye{position:absolute;top:168px;left:58px;z-index:20;font-family:'Inter',sans-serif;font-size:9px;font-weight:500;letter-spacing:7px;text-transform:uppercase;color:rgba(255,255,255,.58);}
.nb{position:absolute;top:240px;left:48px;z-index:20;display:flex;align-items:flex-start;}
.n{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:420px;line-height:.82;color:#fff;letter-spacing:-12px;text-shadow:0 4px 40px rgba(0,0,0,.9);}
.u{font-family:'Barlow Condensed',sans-serif;font-weight:200;font-size:82px;color:rgba(255,255,255,.55);text-transform:uppercase;margin-top:44px;margin-left:8px;}
.sub{position:absolute;top:738px;left:58px;z-index:20;}
.sl{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:92px;text-transform:uppercase;letter-spacing:-2px;color:#fff;line-height:.9;text-shadow:0 2px 20px rgba(0,0,0,.8);}
.sd{font-family:'Barlow Condensed',sans-serif;font-weight:300;font-size:28px;letter-spacing:7px;text-transform:uppercase;color:rgba(255,255,255,.68);margin-top:18px;}
.copy{position:absolute;top:1100px;left:58px;right:58px;z-index:20;border-left:2.5px solid ${RED};padding-left:22px;}
.ct{font-family:'Barlow Condensed',sans-serif;font-weight:300;font-size:42px;line-height:1.32;color:rgba(255,255,255,.80);}
.ct strong{color:#fff;font-weight:700;}
</style></head><body><div class="c">
  ${p.img?`<div class="car"><img src="${p.img}" alt=""></div>`:''}
  <div class="glow"></div>
  ${HDR}
  ${p.eye?`<div class="eye">${p.eye}</div>`:''}
  <div class="nb"><span class="n">${p.num}</span>${p.unit?`<span class="u">${p.unit}</span>`:''}</div>
  <div class="sub"><div class="sl">${br_(p.sub)}</div>${p.desc?`<div class="sd">${p.desc}</div>`:''}</div>
  ${p.copy?`<div class="copy"><div class="ct">${p.copy}</div></div>`:''}
  ${SEAL(p.role||'Especialista em Mobilidade Híbrida e Elétrica')}
</div></body></html>`;
}

// ─── LAYOUT HERO STORY ────────────────────────────────────────────────────────
function heroStory(p) {
  const h1L = (p.h1.match(/\n/g)||[]).length + 1;
  const h2L = p.h2 ? (p.h2.match(/\n/g)||[]).length + 1 : 0;
  const subTop = 220 + (h1L + h2L) * Math.round(220 * 0.84) + 32;
  return `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8">${FONTS}<style>
${BASE}
.car{position:absolute;inset:0;z-index:1;}
.car img{width:100%;height:100%;object-fit:cover;object-position:${p.pos||'50% 50%'};filter:brightness(${p.br||0.70}) contrast(1.15) saturate(.88);}
.ovl{position:absolute;inset:0;z-index:2;background:linear-gradient(108deg,rgba(5,5,5,.99) 0%,rgba(5,5,5,.9) 26%,rgba(5,5,5,.52) 50%,rgba(5,5,5,.06) 74%,transparent 100%);}
.ovb{position:absolute;inset:0;z-index:3;background:linear-gradient(to top,rgba(5,5,5,.95) 0%,rgba(5,5,5,.1) 18%,transparent 36%);}
.blade{position:absolute;top:0;left:0;z-index:5;width:3px;height:100%;background:linear-gradient(to bottom,${RED} 40%,rgba(225,6,19,0) 100%);}
.eye{position:absolute;top:168px;left:58px;z-index:20;font-family:'Inter',sans-serif;font-size:9px;font-weight:500;letter-spacing:7px;text-transform:uppercase;color:rgba(255,255,255,.55);}
.headline{position:absolute;top:220px;left:54px;z-index:20;}
.hs{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:220px;line-height:.84;text-transform:uppercase;letter-spacing:-5px;color:#fff;text-shadow:0 2px 26px rgba(0,0,0,.8);}
.ho{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:220px;line-height:.84;text-transform:uppercase;letter-spacing:-5px;-webkit-text-stroke:2px rgba(255,255,255,.48);color:transparent;}
.sub{position:absolute;top:${subTop}px;left:58px;z-index:20;font-family:'Barlow Condensed',sans-serif;font-weight:300;font-size:30px;letter-spacing:7px;text-transform:uppercase;color:rgba(255,255,255,.82);text-shadow:0 1px 12px rgba(0,0,0,.8);}
.cta-block{position:absolute;top:1100px;left:58px;z-index:20;}
.cta-lbl{font-family:'Inter',sans-serif;font-size:9px;font-weight:500;letter-spacing:7px;text-transform:uppercase;color:rgba(255,255,255,.60);margin-bottom:18px;}
.cta-btn{display:inline-flex;align-items:center;gap:18px;border:2px solid ${RED};background:rgba(225,6,19,.12);padding:30px 58px;font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:30px;color:#fff;text-transform:uppercase;letter-spacing:5px;text-shadow:0 1px 8px rgba(0,0,0,.6);}
.cta-arr{color:${RED};}
</style></head><body><div class="c">
  <div class="car"><img src="${p.img}" alt=""></div>
  <div class="ovl"></div><div class="ovb"></div><div class="blade"></div>
  ${HDR}
  ${p.eye?`<div class="eye">${p.eye}</div>`:''}
  <div class="headline">
    <div class="hs">${br_(p.h1)}</div>
    ${p.h2?`<div class="ho">${br_(p.h2)}</div>`:''}
  </div>
  ${p.sub?`<div class="sub">${p.sub}</div>`:''}
  ${p.cta?`<div class="cta-block"><div class="cta-lbl">${p.ctaLbl||'Sem compromisso'}</div><div class="cta-btn">${p.cta}<span class="cta-arr"> →</span></div></div>`:''}
  ${SEAL(p.role||'Consultor Especialista GWM', p.hasCta, p.ctaLabel)}
</div></body></html>`;
}

// ─── LAYOUT PRODUTO STORY ────────────────────────────────────────────────────
function produtoStory(p) {
  const specsHtml = (p.specs||[]).map((s,i)=>
    `<div class="spec${i>0?' spl':''}"><div><span class="sv">${s.val}</span>${s.unit?`<span class="su">${s.unit}</span>`:''}</div><div class="sl_">${s.lbl}</div></div>`
  ).join('');
  return `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8">${FONTS}<style>
${BASE}
.car{position:absolute;inset:0;z-index:1;}
.car img{width:100%;height:100%;object-fit:cover;object-position:${p.pos||'50% 52%'};filter:brightness(${p.br||0.75}) contrast(1.12) saturate(.82);}
.ovt{position:absolute;top:0;left:0;right:0;height:760px;z-index:2;background:linear-gradient(to bottom,rgba(5,5,5,.99) 0%,rgba(5,5,5,.85) 58%,transparent 100%);}
.ovb{position:absolute;bottom:0;left:0;right:0;height:520px;z-index:2;background:linear-gradient(to top,rgba(5,5,5,.98) 0%,transparent 100%);}
.line{position:absolute;top:660px;left:0;right:0;z-index:5;height:2px;background:linear-gradient(to right,transparent 0%,${RED} 5%,${RED} 72%,transparent 100%);}
.cat{position:absolute;top:158px;left:58px;z-index:20;display:flex;align-items:center;gap:12px;}
.cat-bar{width:28px;height:1.5px;background:${RED};}
.cat-txt{font-family:'Inter',sans-serif;font-size:9px;font-weight:600;letter-spacing:7px;text-transform:uppercase;color:${RED};}
.title{position:absolute;top:192px;left:54px;z-index:20;}
.t1{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:240px;line-height:.84;text-transform:uppercase;letter-spacing:-4px;color:#fff;text-shadow:0 2px 24px rgba(0,0,0,.8);}
.t2{font-family:'Barlow Condensed',sans-serif;font-weight:100;font-size:160px;line-height:.84;text-transform:uppercase;letter-spacing:-3px;-webkit-text-stroke:1.5px rgba(255,255,255,.42);color:transparent;}
.tag{position:absolute;top:688px;left:58px;z-index:20;font-family:'Barlow Condensed',sans-serif;font-weight:400;font-size:32px;letter-spacing:5px;text-transform:uppercase;color:rgba(255,255,255,.82);text-shadow:0 1px 10px rgba(0,0,0,.8);}
.specs{position:absolute;bottom:230px;left:58px;right:58px;z-index:20;display:flex;border-top:1px solid rgba(255,255,255,.12);padding-top:30px;}
.spec{flex:1;padding-right:24px;border-right:1px solid rgba(255,255,255,.1);}
.spl{padding-left:24px;border-right:none;}
.sv{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:56px;color:#fff;letter-spacing:-1px;line-height:1;text-shadow:0 2px 12px rgba(0,0,0,.8);}
.su{font-family:'Barlow Condensed',sans-serif;font-weight:300;font-size:22px;color:${RED};letter-spacing:2px;margin-left:2px;}
.sl_{font-family:'Inter',sans-serif;font-size:9px;font-weight:400;letter-spacing:4px;text-transform:uppercase;color:rgba(255,255,255,.68);margin-top:6px;}
</style></head><body><div class="c">
  <div class="car"><img src="${p.img}" alt=""></div>
  <div class="ovt"></div><div class="ovb"></div><div class="line"></div>
  ${HDR}
  <div class="cat"><div class="cat-bar"></div><div class="cat-txt">${p.eye||'Produto'}</div></div>
  <div class="title"><div class="t1">${p.t1}</div>${p.t2?`<div class="t2">${p.t2}</div>`:''}</div>
  ${p.tag?`<div class="tag">${p.tag}</div>`:''}
  ${specsHtml?`<div class="specs">${specsHtml}</div>`:''}
  ${SEAL(p.role||'Especialista em Mobilidade Elétrica')}
</div></body></html>`;
}

const SLAY = { enquete, statStory, heroStory, produtoStory };

// ─── 12 STORIES DATA ─────────────────────────────────────────────────────────
const STORIES = [
  {id:'01',fn:'enquete',
   img:`${I}/fabrica/lineup-dusk.png`,br:.58,pos:'50% 38%',
   eye:'Qual é o seu favorito?',
   h1:'QUAL GWM\nVOCÊ ESCOLHERIA?',h2:'Vote e me conta nos comentários',
   op1:'HAVAL H6  — Híbrido',op2:'HAVAL H9  — V6 Turbo',
   icon1:'⚡',icon2:'💪',role:'Consultor Especialista GWM'},

  {id:'02',fn:'enquete',
   img:`${I}/h6gt-blue.webp`,br:.62,pos:'50% 55%',
   eye:'Enquete · Test Drive',
   h1:'JÁ FEZ TEST\nDRIVE EM HÍBRIDO?',h2:'Me conta a sua experiência',
   op1:'SIM, já experimentei',op2:'NÃO, quero agendar',
   icon1:'✅',icon2:'📅',role:'Atendimento Personalizado'},

  {id:'03',fn:'statStory',
   img:`${I}/h6-phev-blue.jpg`,br:.18,
   eye:'HAVAL H6 PHEV · Autonomia',
   num:'+800',unit:'KM',
   sub:'SEM\nPARAR.',
   desc:'HAVAL H6 PHEV · Modo híbrido ativado',
   copy:'Enquanto você abastece <strong>uma vez</strong>, o H6 já percorreu o Brasil.',
   role:'Especialista em Mobilidade Híbrida e Elétrica'},

  {id:'04',fn:'produtoStory',
   img:`${I}/ora5/ora5-teal.jpg`,br:.80,pos:'48% 48%',
   eye:'ORA 5 · Elétrico · Em breve 2026',
   t1:'ORA',t2:'5',
   tag:'100% elétrico. Chegando ao Brasil.',
   specs:[{val:'EV',unit:'',lbl:'100% elétrico'},{val:'AI',unit:'',lbl:'Assistente'},{val:'2026',unit:'',lbl:'Em breve'}],
   role:'Especialista em Mobilidade Elétrica'},

  {id:'05',fn:'produtoStory',
   img:`${I}/ora5/ora5-interior.jpg`,br:.82,pos:'50% 38%',
   eye:'ORA 5 · Interior · Tecnologia',
   t1:'INTERIOR',t2:'DO FUTURO.',
   tag:'15 polegadas. IA integrada. Zero emissão.',
   specs:[{val:'15"',unit:'',lbl:'Tela central'},{val:'AI',unit:'',lbl:'Assistente integrado'},{val:'OTA',unit:'',lbl:'Updates remotos'}],
   role:'Especialista em Mobilidade Elétrica'},

  {id:'06',fn:'heroStory',
   img:`${I}/fabrica/lineup-dusk.png`,br:.62,pos:'50% 38%',
   eye:'GWM Brasil · Fábrica · Nacional',
   h1:'A FÁBRICA\nGWM NO',h2:'BRASIL\nJÁ É REAL.',
   sub:'Produção nacional. Padrão global.',
   role:'Consultor Especialista GWM'},

  {id:'07',fn:'statStory',
   img:`${I}/h6-phev-blue.jpg`,br:.16,
   eye:'Pergunta · Elétrico · Economia',
   num:'R$8',unit:'',
   sub:'POR\n100KM.',
   desc:'ORA 5 / HAVAL H6 PHEV · Recarga em casa',
   copy:'Carregar em casa custa <strong>∼R$ 8 por 100km.</strong> Gasolina? 3x mais. <strong>Faz sentido?</strong>',
   role:'Especialista em Mobilidade Híbrida e Elétrica'},

  {id:'08',fn:'heroStory',
   img:`${I}/h6gt-dark.webp`,br:.68,pos:'68% center',
   eye:'GWM vs Concorrência',
   h1:'GWM.', h2:'A ESCOLHA\nQUE SURPREENDE.',
   sub:'Tecnologia superior. Custo acessível.',
   role:'Consultor Especialista GWM'},

  {id:'09',fn:'heroStory',
   img:`${I}/h6gt-blue.webp`,br:.74,pos:'50% 56%',
   eye:'Test Drive · Hoje · Jundiaí',
   h1:'VAGA\nDISPONÍVEL.',h2:'HOJE.',
   sub:'HAVAL H6 GT · GWM Dahruj Jundiaí',
   cta:'AGENDAR TEST DRIVE',ctaLbl:'Reserve seu horário agora',hasCta:true,ctaLabel:'↗ AGENDAR',
   role:'Atendimento Personalizado'},

  {id:'10',fn:'heroStory',
   img:`${I}/h6gt-dark.webp`,br:.62,pos:'68% center',
   eye:'WhatsApp · Contato Direto',
   h1:'FALE\nCOMIGO',h2:'DIRETO\nPELO INSTA.',
   sub:'Sem enrolação. Resposta rápida.',
   cta:'CHAMAR NO INSTAGRAM',ctaLbl:'Atendimento direto',hasCta:true,ctaLabel:'↗ @alexmessiasoficial',
   role:'Atendimento Personalizado'},

  {id:'11',fn:'heroStory',
   img:`${I}/h6-silver-event.jpg`,br:.64,pos:'55% 44%',
   eye:'Alex Messias · GWM · Jundiaí',
   h1:'ALEX\nMESSIAS.',h2:'ESPECIALISTA\nGWM.',
   sub:'Mobilidade híbrida e elétrica em Campinas, Jundiaí e São Paulo.',
   role:'Consultor Especialista GWM'},

  {id:'12',fn:'statStory',
   img:`${I}/h6gt-blue.webp`,br:.18,
   eye:'Test Drive · Decisão · Resultado',
   num:'20',unit:'min',
   sub:'MUDAM\nTUDO.',
   desc:'Test drive sem compromisso · Jundiaí SP',
   copy:'<strong>20 minutos ao volante</strong> valem mais do que qualquer explicação. <strong>Agende com Alex.</strong>',
   role:'Atendimento Personalizado'},
];

let ok = 0;
for (const s of STORIES) {
  const fn = SLAY[s.fn];
  if (!fn) { console.error('Unknown fn:', s.fn, 'story', s.id); continue; }
  writeFileSync(`${DIR}/story-${s.id}.html`, fn(s), 'utf8');
  console.log(`OK story-${s.id}.html  [${s.fn}]`);
  ok++;
}
console.log(`\n${ok}/12 stories geradas.`);
