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
body{width:1080px;height:1350px;overflow:hidden;background:${BG};}
.c{width:1080px;height:1350px;position:relative;overflow:hidden;}
.hdr{position:absolute;top:46px;left:58px;right:58px;z-index:20;display:flex;align-items:center;justify-content:space-between;}
.hb{display:flex;align-items:center;gap:10px;}
.hn{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:16px;color:#fff;letter-spacing:4px;text-transform:uppercase;}
.hp{color:rgba(255,255,255,.3);font-size:13px;margin:0 3px;}
.hd{font-family:'Barlow Condensed',sans-serif;font-weight:300;font-size:14px;color:rgba(255,255,255,.6);letter-spacing:4px;text-transform:uppercase;}
.hu{font-family:'Inter',sans-serif;font-size:10px;font-weight:500;letter-spacing:3px;color:${RED};font-style:normal;text-transform:lowercase;}
.bot{position:absolute;bottom:0;left:0;right:0;z-index:25;padding:0 58px 42px;}
.seal{display:flex;align-items:center;gap:12px;padding-top:20px;border-top:1px solid rgba(255,255,255,.1);margin-bottom:14px;}
.s-bar{width:2.5px;height:40px;background:${RED};flex-shrink:0;}
.s-name{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:20px;color:#fff;letter-spacing:3px;text-transform:uppercase;line-height:1;text-shadow:0 1px 8px rgba(0,0,0,.8);}
.s-role{font-family:'Inter',sans-serif;font-size:9px;font-weight:400;letter-spacing:3.5px;text-transform:uppercase;color:rgba(255,255,255,.70);margin-top:4px;}
.s-cta{margin-left:auto;font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:13px;letter-spacing:2.5px;color:${RED};text-transform:uppercase;white-space:nowrap;text-shadow:none;}
.ftr{display:flex;align-items:center;justify-content:space-between;}
.fc{font-family:'Barlow Condensed',sans-serif;font-weight:400;font-size:11px;letter-spacing:4px;color:rgba(255,255,255,.58);text-transform:uppercase;}
.ft{font-family:'Barlow Condensed',sans-serif;font-size:12px;font-weight:700;letter-spacing:3px;color:${RED};text-transform:lowercase;}
`;

const HDR = `<div class="hdr"><div class="hb">${GWM_SVG}<span class="hn">ALEX MESSIAS</span><span class="hp">·</span><span class="hd">Consultor GWM</span></div><div class="hu">@alexmessiasoficial</div></div>`;

function SEAL(role, cta, ctaLabel) {
  const c = cta ? '<div class="s-cta">' + (ctaLabel || '↗ INSTAGRAM') + '</div>' : '';
  return '<div class="bot"><div class="seal"><div class="s-bar"></div><div><div class="s-name">ALEX MESSIAS</div><div class="s-role">' + role + '</div></div>' + c + '</div><div class="ftr"><span class="fc">Campinas • Jundiaí • São Paulo</span><span class="ft">@alexmessiasoficial</span></div></div>';
}

const br_ = s => s.replace(/\n/g, '<br>');

// ─── LAYOUT: HERO ────────────────────────────────────────────────────────────
function hero(p) {
  const h1L = (p.h1.match(/\n/g)||[]).length + 1;
  const h2L = p.h2 ? (p.h2.match(/\n/g)||[]).length + 1 : 0;
  const subTop = 194 + (h1L + h2L) * Math.round(190 * 0.84) + 28;
  return `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8">${FONTS}<style>
${BASE}
.car{position:absolute;inset:0;z-index:1;}
.car img{width:100%;height:100%;object-fit:cover;object-position:${p.pos||'68% center'};filter:brightness(${p.br||0.72}) contrast(1.15) saturate(.88);}
.ov-l{position:absolute;inset:0;z-index:2;background:linear-gradient(108deg,rgba(5,5,5,.99) 0%,rgba(5,5,5,.92) 26%,rgba(5,5,5,.58) 50%,rgba(5,5,5,.08) 72%,transparent 100%);}
.ov-b{position:absolute;inset:0;z-index:3;background:linear-gradient(to top,rgba(5,5,5,.92) 0%,rgba(5,5,5,.1) 18%,transparent 36%);}
.blade{position:absolute;top:0;left:0;z-index:5;width:3px;height:100%;background:linear-gradient(to bottom,${RED} 40%,rgba(225,6,19,0) 100%);}
.eye{position:absolute;top:158px;left:58px;z-index:20;font-family:'Inter',sans-serif;font-size:9px;font-weight:500;letter-spacing:7px;text-transform:uppercase;color:rgba(255,255,255,.55);}
.headline{position:absolute;top:194px;left:54px;z-index:20;}
.hl-s{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:190px;line-height:.84;text-transform:uppercase;letter-spacing:-4px;color:#fff;text-shadow:0 2px 24px rgba(0,0,0,.75),0 1px 8px rgba(0,0,0,.9);}
.hl-o{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:190px;line-height:.84;text-transform:uppercase;letter-spacing:-4px;-webkit-text-stroke:2px rgba(255,255,255,.48);color:transparent;text-shadow:none;}
.sub{position:absolute;top:${subTop}px;left:58px;z-index:20;font-family:'Barlow Condensed',sans-serif;font-weight:300;font-size:26px;letter-spacing:7px;text-transform:uppercase;color:rgba(255,255,255,.80);text-shadow:0 1px 12px rgba(0,0,0,.8);}
.badge{position:absolute;bottom:168px;right:58px;z-index:20;text-align:right;}
.badge-n{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:56px;line-height:.88;text-transform:uppercase;letter-spacing:-1px;color:rgba(255,255,255,.88);text-shadow:0 2px 16px rgba(0,0,0,.8);}
.badge-s{font-family:'Barlow Condensed',sans-serif;font-weight:200;font-size:15px;letter-spacing:6px;text-transform:uppercase;color:rgba(255,255,255,.55);margin-top:8px;}
</style></head><body><div class="c">
  <div class="car"><img src="${p.img}" alt=""></div>
  <div class="ov-l"></div><div class="ov-b"></div><div class="blade"></div>
  ${HDR}
  ${p.eye ? `<div class="eye">${p.eye}</div>` : ''}
  <div class="headline">
    <div class="hl-s">${br_(p.h1)}</div>
    ${p.h2 ? `<div class="hl-o">${br_(p.h2)}</div>` : ''}
  </div>
  ${p.sub ? `<div class="sub">${p.sub}</div>` : ''}
  ${p.badge ? `<div class="badge"><div class="badge-n">${br_(p.badge)}</div>${p.badgeSub?`<div class="badge-s">${p.badgeSub}</div>`:''}</div>` : ''}
  ${SEAL(p.role||'Consultor Especialista GWM', p.cta, p.ctaLabel)}
</div></body></html>`;
}

// ─── LAYOUT: PRODUTO ─────────────────────────────────────────────────────────
function produto(p) {
  const specsHtml = (p.specs||[]).map((s,i) =>
    `<div class="spec${i>0?' spl':''}"><div><span class="sv">${s.val}</span>${s.unit?`<span class="su">${s.unit}</span>`:''}</div><div class="sl_">${s.lbl}</div></div>`
  ).join('');
  return `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8">${FONTS}<style>
${BASE}
.car{position:absolute;inset:0;z-index:1;}
.car img{width:100%;height:100%;object-fit:cover;object-position:${p.pos||'60% center'};filter:brightness(${p.br||0.76}) contrast(1.12) saturate(.82);}
.ov-t{position:absolute;top:0;left:0;right:0;height:640px;z-index:2;background:linear-gradient(to bottom,rgba(5,5,5,.99) 0%,rgba(5,5,5,.85) 52%,transparent 100%);}
.ov-b{position:absolute;bottom:0;left:0;right:0;height:380px;z-index:2;background:linear-gradient(to top,rgba(5,5,5,.98) 0%,transparent 100%);}
.ov-l{position:absolute;inset:0;z-index:3;background:linear-gradient(to right,rgba(5,5,5,.6) 0%,transparent 55%);}
.redline{position:absolute;top:460px;left:0;right:0;z-index:5;height:2px;background:linear-gradient(to right,transparent 0%,${RED} 5%,${RED} 72%,transparent 100%);}
.blade{position:absolute;top:0;left:0;z-index:5;width:3px;height:100%;background:linear-gradient(to bottom,${RED} 38%,rgba(225,6,19,0) 100%);}
.cat{position:absolute;top:120px;left:58px;z-index:20;display:flex;align-items:center;gap:12px;}
.cat-bar{width:28px;height:1.5px;background:${RED};}
.cat-txt{font-family:'Inter',sans-serif;font-size:9px;font-weight:600;letter-spacing:7px;text-transform:uppercase;color:${RED};}
.title{position:absolute;top:148px;left:54px;z-index:20;}
.t1{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:200px;line-height:.84;text-transform:uppercase;letter-spacing:-4px;color:#fff;text-shadow:0 2px 22px rgba(0,0,0,.75);}
.t2{font-family:'Barlow Condensed',sans-serif;font-weight:100;font-size:130px;line-height:.84;text-transform:uppercase;letter-spacing:-3px;-webkit-text-stroke:1.5px rgba(255,255,255,.45);color:transparent;}
.tag{position:absolute;top:484px;left:58px;z-index:20;font-family:'Barlow Condensed',sans-serif;font-weight:400;font-size:30px;letter-spacing:5px;text-transform:uppercase;color:rgba(255,255,255,.80);text-shadow:0 1px 10px rgba(0,0,0,.8);}
.specs{position:absolute;bottom:210px;left:58px;right:58px;z-index:20;display:flex;border-top:1px solid rgba(255,255,255,.12);padding-top:28px;}
.spec{flex:1;padding-right:24px;border-right:1px solid rgba(255,255,255,.1);}
.spl{padding-left:24px;border-right:none;}
.sv{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:52px;color:#fff;letter-spacing:-1px;line-height:1;text-shadow:0 2px 12px rgba(0,0,0,.8);}
.su{font-family:'Barlow Condensed',sans-serif;font-weight:300;font-size:20px;color:${RED};letter-spacing:2px;margin-left:2px;}
.sl_{font-family:'Inter',sans-serif;font-size:9px;font-weight:400;letter-spacing:4px;text-transform:uppercase;color:rgba(255,255,255,.65);margin-top:6px;}
</style></head><body><div class="c">
  <div class="car"><img src="${p.img}" alt=""></div>
  <div class="ov-t"></div><div class="ov-b"></div><div class="ov-l"></div><div class="redline"></div><div class="blade"></div>
  ${HDR}
  <div class="cat"><div class="cat-bar"></div><div class="cat-txt">${p.eye||'Produto'}</div></div>
  <div class="title"><div class="t1">${p.t1}</div>${p.t2?`<div class="t2">${p.t2}</div>`:''}</div>
  ${p.tag?`<div class="tag">${p.tag}</div>`:''}
  ${specsHtml?`<div class="specs">${specsHtml}</div>`:''}
  ${SEAL(p.role||'Especialista em Mobilidade Híbrida e Elétrica')}
</div></body></html>`;
}

// ─── LAYOUT: STAT ────────────────────────────────────────────────────────────
function stat(p) {
  const metricsHtml = (p.metrics||[]).map((m,i) =>
    `<div class="mi${i>0?' mil':''}"><div><span class="mv">${m.v}</span></div><div class="ml_">${m.l}</div></div>`
  ).join('');
  const carHtml = p.img ? `<div class="car"><img src="${p.img}" alt="" style="object-position:${p.pos||'55% 48%'};"></div>` : '';
  return `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8">${FONTS}<style>
${BASE}
.car{position:absolute;inset:0;z-index:1;}
.car img{width:100%;height:100%;object-fit:cover;filter:brightness(${p.br||0.2}) contrast(1.38) saturate(0);}
.glow{position:absolute;bottom:0;left:0;right:0;height:500px;z-index:2;background:radial-gradient(ellipse 80% 55% at 50% 100%,rgba(225,6,19,.07) 0%,transparent 70%);}
.lt{position:absolute;top:370px;left:58px;right:58px;z-index:5;height:1px;background:rgba(255,255,255,.08);}
.lt-a{position:absolute;top:368px;left:58px;z-index:6;width:72px;height:3px;background:${RED};}
.lm{position:absolute;top:762px;left:58px;right:58px;z-index:5;height:1px;background:rgba(255,255,255,.07);}
.eye{position:absolute;top:136px;left:58px;z-index:20;font-family:'Inter',sans-serif;font-size:9px;font-weight:500;letter-spacing:7px;text-transform:uppercase;color:rgba(255,255,255,.58);}
.stat-block{position:absolute;top:170px;left:48px;z-index:20;display:flex;align-items:flex-start;}
.s-plus{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:260px;line-height:.82;color:${RED};letter-spacing:-6px;margin-top:6px;text-shadow:0 0 40px rgba(225,6,19,.3);}
.s-num{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:340px;line-height:.82;color:#fff;letter-spacing:-10px;text-shadow:0 2px 32px rgba(0,0,0,.9);}
.s-unit{font-family:'Barlow Condensed',sans-serif;font-weight:200;font-size:68px;color:rgba(255,255,255,.55);letter-spacing:2px;text-transform:uppercase;margin-top:28px;margin-left:12px;}
.stat-sub{position:absolute;top:490px;left:58px;z-index:20;}
.ss-l{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:68px;text-transform:uppercase;letter-spacing:-1px;color:#fff;line-height:.94;text-shadow:0 2px 18px rgba(0,0,0,.8);}
.ss-d{font-family:'Barlow Condensed',sans-serif;font-weight:300;font-size:22px;letter-spacing:7px;text-transform:uppercase;color:rgba(255,255,255,.68);margin-top:14px;}
.mid{position:absolute;top:782px;left:58px;right:58px;z-index:20;display:flex;}
.mi{flex:1;padding-right:28px;border-right:1px solid rgba(255,255,255,.08);}
.mil{padding-left:28px;border-right:none;}
.mv{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:38px;color:#fff;line-height:1;text-shadow:0 1px 8px rgba(0,0,0,.8);}
.ml_{font-family:'Inter',sans-serif;font-size:9px;font-weight:400;letter-spacing:4px;text-transform:uppercase;color:rgba(255,255,255,.62);margin-top:5px;}
.copy-block{position:absolute;bottom:170px;left:58px;right:58px;z-index:20;border-left:2.5px solid ${RED};padding-left:22px;}
.copy-t{font-family:'Barlow Condensed',sans-serif;font-weight:300;font-size:34px;line-height:1.35;color:rgba(255,255,255,.78);}
.copy-t strong{color:#fff;font-weight:700;}
</style></head><body><div class="c">
  ${carHtml}
  <div class="glow"></div><div class="lt"></div><div class="lt-a"></div><div class="lm"></div>
  ${HDR}
  ${p.eye?`<div class="eye">${p.eye}</div>`:''}
  <div class="stat-block">
    ${p.plus?`<span class="s-plus">+</span>`:''}
    <span class="s-num">${p.num}</span>
    ${p.unit?`<span class="s-unit">${p.unit}</span>`:''}
  </div>
  <div class="stat-sub">
    <div class="ss-l">${br_(p.sub)}</div>
    ${p.desc?`<div class="ss-d">${p.desc}</div>`:''}
  </div>
  ${metricsHtml?`<div class="mid">${metricsHtml}</div>`:''}
  ${p.copy?`<div class="copy-block"><div class="copy-t">${p.copy}</div></div>`:''}
  ${SEAL(p.role||'Especialista em Mobilidade Híbrida e Elétrica', p.cta, p.ctaLabel)}
</div></body></html>`;
}

// ─── LAYOUT: INSTITUCIONAL ───────────────────────────────────────────────────
function institucional(p) {
  const itemsHtml = (p.items||[]).map(it =>
    `<div class="item"><div class="item-dot"></div><div class="item-t">${it}</div></div>`
  ).join('');
  return `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8">${FONTS}<style>
${BASE}
.car{position:absolute;inset:0;z-index:1;}
.car img{width:100%;height:100%;object-fit:cover;object-position:${p.pos||'50% 50%'};filter:brightness(${p.br||0.18}) contrast(1.4) saturate(0);}
.ov{position:absolute;inset:0;z-index:2;background:radial-gradient(ellipse 110% 90% at 60% 50%,rgba(5,5,5,0) 0%,rgba(5,5,5,.55) 55%,rgba(5,5,5,.97) 100%);}
.ov-b{position:absolute;bottom:0;left:0;right:0;height:380px;z-index:3;background:linear-gradient(to top,rgba(5,5,5,.99) 0%,rgba(5,5,5,.35) 60%,transparent 100%);}
.ov-t{position:absolute;top:0;left:0;right:0;height:180px;z-index:3;background:linear-gradient(to bottom,rgba(5,5,5,.97) 0%,transparent 100%);}
.rv{position:absolute;top:0;right:0;z-index:6;width:4px;height:480px;background:linear-gradient(to bottom,${RED} 0%,rgba(225,6,19,0) 100%);}
.rh{position:absolute;top:0;right:0;z-index:6;width:240px;height:2.5px;background:${RED};}
.center{position:absolute;top:50%;left:0;right:0;z-index:20;transform:translateY(-50%);padding:0 62px;}
.eyebrow{font-family:'Inter',sans-serif;font-size:9px;font-weight:500;letter-spacing:9px;text-transform:uppercase;color:rgba(255,255,255,.62);margin-bottom:32px;display:flex;align-items:center;gap:14px;}
.eyebrow::before{content:'';display:block;width:32px;height:1.5px;background:${RED};}
.h1_{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:188px;line-height:.82;text-transform:uppercase;letter-spacing:-4px;color:#fff;text-shadow:0 2px 24px rgba(0,0,0,.8);}
.h2_{font-family:'Barlow Condensed',sans-serif;font-weight:100;font-size:188px;line-height:.82;text-transform:uppercase;letter-spacing:-4px;-webkit-text-stroke:2px rgba(255,255,255,.40);color:transparent;}
.divider{width:52px;height:1.5px;background:rgba(255,255,255,.15);margin:38px 0;}
.sub_{font-family:'Barlow Condensed',sans-serif;font-weight:300;font-size:28px;letter-spacing:5px;text-transform:uppercase;color:rgba(255,255,255,.78);max-width:540px;line-height:1.4;text-shadow:0 1px 10px rgba(0,0,0,.8);}
.items{position:absolute;bottom:180px;left:62px;right:62px;z-index:20;display:flex;gap:0;}
.item{flex:1;padding-right:22px;border-right:1px solid rgba(255,255,255,.08);}
.item:last-child{border-right:none;padding-right:0;}
.item-dot{width:22px;height:2px;background:${RED};margin-bottom:12px;}
.item-t{font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:20px;color:rgba(255,255,255,.88);letter-spacing:2px;text-transform:uppercase;line-height:1.3;}
</style></head><body><div class="c">
  ${p.img?`<div class="car"><img src="${p.img}" alt=""></div>`:''}
  <div class="ov"></div><div class="ov-b"></div><div class="ov-t"></div><div class="rv"></div><div class="rh"></div>
  ${HDR}
  <div class="center">
    ${p.eye?`<div class="eyebrow">${p.eye}</div>`:''}
    <div class="h1_">${br_(p.h1)}</div>
    ${p.h2?`<div class="h2_">${br_(p.h2)}</div>`:''}
    <div class="divider"></div>
    ${p.sub?`<div class="sub_">${p.sub}</div>`:''}
  </div>
  ${itemsHtml?`<div class="items">${itemsHtml}</div>`:''}
  ${SEAL(p.role||'Consultor Especialista GWM')}
</div></body></html>`;
}

// ─── LAYOUT: TESTDRIVE ───────────────────────────────────────────────────────
function testdrive(p) {
  const h1L = (p.h1.match(/\n/g)||[]).length + 1;
  const h2L = p.h2 ? (p.h2.match(/\n/g)||[]).length + 1 : 0;
  const subTop = 170 + (h1L + h2L) * Math.round(158 * 0.84) + 20;
  return `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8">${FONTS}<style>
${BASE}
.car{position:absolute;inset:0;z-index:1;}
.car img{width:100%;height:100%;object-fit:cover;object-position:${p.pos||'50% 56%'};filter:brightness(${p.br||0.74}) contrast(1.18) saturate(.88);}
.ov-t{position:absolute;top:0;left:0;right:0;height:680px;z-index:2;background:linear-gradient(to bottom,rgba(5,5,5,.98) 0%,rgba(5,5,5,.75) 52%,transparent 100%);}
.ov-l{position:absolute;inset:0;z-index:3;background:linear-gradient(to right,rgba(5,5,5,.52) 0%,transparent 52%);}
.ov-b{position:absolute;bottom:0;left:0;right:0;height:320px;z-index:4;background:linear-gradient(to top,rgba(5,5,5,.99) 0%,rgba(5,5,5,.5) 58%,transparent 100%);}
.blade{position:absolute;top:0;left:0;z-index:5;width:3px;height:100%;background:linear-gradient(to bottom,${RED} 38%,rgba(225,6,19,0) 100%);}
.cat{position:absolute;top:118px;left:58px;z-index:20;display:flex;align-items:center;gap:10px;}
.cat-bar{width:28px;height:1.5px;background:${RED};}
.cat-txt{font-family:'Inter',sans-serif;font-size:9px;font-weight:600;letter-spacing:7px;text-transform:uppercase;color:${RED};}
.headline{position:absolute;top:148px;left:54px;z-index:20;}
.hl1{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:158px;line-height:.84;text-transform:uppercase;letter-spacing:-3px;color:#fff;text-shadow:0 2px 22px rgba(0,0,0,.8);}
.hl2{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:158px;line-height:.84;text-transform:uppercase;letter-spacing:-3px;color:#fff;text-shadow:0 2px 22px rgba(0,0,0,.8);}
.hl3{font-family:'Barlow Condensed',sans-serif;font-weight:100;font-size:158px;line-height:.84;text-transform:uppercase;letter-spacing:-3px;-webkit-text-stroke:2px rgba(255,255,255,.48);color:transparent;}
.sub{position:absolute;top:${subTop}px;left:58px;z-index:20;font-family:'Barlow Condensed',sans-serif;font-weight:300;font-size:24px;letter-spacing:7px;text-transform:uppercase;color:rgba(255,255,255,.82);text-shadow:0 1px 12px rgba(0,0,0,.8);}
.cta-block{position:absolute;bottom:170px;left:58px;z-index:20;}
.cta-lbl{font-family:'Inter',sans-serif;font-size:9px;font-weight:500;letter-spacing:7px;text-transform:uppercase;color:rgba(255,255,255,.62);margin-bottom:18px;}
.cta-btn{display:inline-flex;align-items:center;gap:20px;border:2px solid ${RED};background:rgba(225,6,19,.12);padding:26px 56px;font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:28px;color:#fff;text-transform:uppercase;letter-spacing:5px;text-shadow:0 1px 8px rgba(0,0,0,.6);}
.cta-arr{color:${RED};}
</style></head><body><div class="c">
  <div class="car"><img src="${p.img}" alt=""></div>
  <div class="ov-t"></div><div class="ov-l"></div><div class="ov-b"></div><div class="blade"></div>
  ${HDR}
  <div class="cat"><div class="cat-bar"></div><div class="cat-txt">${p.eye||'Test Drive'}</div></div>
  <div class="headline">
    ${p.h1Lines ? p.h1Lines.map((l,i) => `<div class="${i<p.h1Lines.length-1?'hl1':'hl2'}">${l}</div>`).join('') : `<div class="hl1">${br_(p.h1)}</div>`}
    ${p.h2?`<div class="hl3">${br_(p.h2)}</div>`:''}
  </div>
  ${p.sub?`<div class="sub">${p.sub}</div>`:''}
  ${p.cta?`<div class="cta-block"><div class="cta-lbl">${p.ctaLbl||'Sem compromisso · Dirija e decida'}</div><div class="cta-btn">${p.cta} <span class="cta-arr">→</span></div></div>`:''}
  ${SEAL(p.role||'Atendimento Personalizado', true, '↗ INSTAGRAM')}
</div></body></html>`;
}

const LAYOUTS = { hero, produto, stat, institucional, testdrive };

// ─── 30 POSTS DATA ───────────────────────────────────────────────────────────
const POSTS = [
  // ─ B01: AUTORIDADE ─
  {id:'01',fn:'hero',img:`${I}/h6gt-dark.webp`,br:.72,pos:'68% center',
   eye:'Alex Messias · Consultor Premium GWM',
   h1:'O FUTURO\nCHEGOU.',h2:'DIRIJA O\nEXTRAORDINÁRIO.',
   sub:'Tecnologia híbrida. Atendimento de alto padrão.',
   badge:'HAVAL\nH6 GT',badgeSub:'PHEV · 2026',
   role:'Consultor Especialista GWM'},

  {id:'02',fn:'hero',img:`${I}/h6-white2.webp`,br:.78,pos:'50% 44%',
   eye:'GWM · Mobilidade Híbrida',
   h1:'MAIS QUE\nUM SUV.',h2:'UMA NOVA\nEXPERIÊNCIA.',
   sub:'Com Alex Messias. Especialista em GWM.',
   badge:'HAVAL\nH6 HEV',badgeSub:'HEV2 · 2026',
   role:'Consultor Especialista GWM'},

  {id:'03',fn:'hero',img:`${I}/fabrica/lineup-dusk.png`,br:.68,pos:'50% 38%',
   eye:'GWM Brasil · Fábrica Nacional',
   h1:'A ESCOLHA\nDO BRASIL.',h2:'PRODUÇÃO\nNACIONAL.',
   sub:'Fábrica própria. Engenharia global. Aqui no Brasil.',
   role:'Especialista em Mobilidade Híbrida e Elétrica'},

  {id:'04',fn:'institucional',img:`${I}/fabrica/dealership.jpg`,br:.22,pos:'50% 50%',
   eye:'GWM Dahruj · Jundiaí',
   h1:'GWM',h2:'DAHRUJ.',
   sub:'Excelência no atendimento. Consultoria sem pressão.',
   items:['Haval H6 · Híbrido e PHEV','Haval H9 · V6 Turbo','ORA 5 · 100% Elétrico'],
   role:'Consultoria Premium GWM'},

  {id:'05',fn:'hero',img:`${I}/h6-phev-blue.jpg`,br:.76,pos:'50% 48%',
   eye:'HAVAL H6 PHEV · Performance',
   h1:'TECNOLOGIA\nQUE',h2:'IMPRESSIONA.',
   sub:'1.5T Híbrido. 326cv. Sem pagar IPVA.',
   badge:'PHEV\n35',badgeSub:'PLUG-IN · 2026',
   role:'Especialista em Mobilidade Híbrida e Elétrica'},

  {id:'06',fn:'stat',img:`${I}/h6gt-dark.webp`,br:.2,plus:false,
   eye:'GWM · Crescimento · Brasil',
   num:'3°',unit:'',
   sub:'MAIOR MARCA\nEM CRESCIMENTO.',
   desc:'Montadoras premium no Brasil · 2024',
   metrics:[{v:'326cv',l:'Potência H6 PHEV'},{v:'0%',l:'IPVA em SP'},{v:'+800',l:'KM por tanque'}],
   copy:'A GWM não veio para ocupar espaço. Veio para redefinir o segmento premium brasileiro.',
   role:'Consultor Especialista GWM'},

  // ─ B02: HAVAL H6 ─
  {id:'07',fn:'stat',img:`${I}/h6-phev-blue.jpg`,br:.18,plus:true,
   eye:'HAVAL H6 PHEV · Autonomia',
   num:'800',unit:'KM',
   sub:'SEM\nPREOCUPAÇÃO.',
   desc:'HAVAL H6 PHEV · Modo híbrido ativado',
   metrics:[{v:'1.5T',l:'Motor turbo'},{v:'244cv',l:'Potência combinada'},{v:'∼R$0',l:'Km em modo EV'}],
   copy:'Enquanto outros abasteciam <strong>duas vezes</strong>, o H6 ainda estava em movimento.',
   role:'Especialista em Mobilidade Híbrida e Elétrica'},

  {id:'08',fn:'produto',img:`${I}/h6gt-dark.webp`,br:.78,pos:'60% center',
   eye:'HAVAL H6 GT · Design Premium',
   t1:'HAVAL',t2:'H6 GT',
   tag:'Design que define uma nova era no segmento.',
   specs:[{val:'326',unit:'cv',lbl:'Potência combinada'},{val:'HEV',unit:'+',lbl:'Motor híbrido'},{val:'0%',unit:'',lbl:'IPVA 2024 SP'}],
   role:'Especialista em Mobilidade Híbrida e Elétrica'},

  {id:'09',fn:'hero',img:`${I}/h6-white2.webp`,br:.80,pos:'50% 42%',
   eye:'HAVAL H6 HEV · Inovação',
   h1:'DIRIJA O\nDIFERENTE.',h2:'SINTA A\nDIFERENÇA.',
   sub:'HEV2. Híbrido de verdade. Sem concessões.',
   badge:'HEV\n2',badgeSub:'HAVAL H6 · 2026',
   role:'Especialista em Mobilidade Híbrida e Elétrica'},

  {id:'10',fn:'stat',img:null,br:.2,plus:false,
   eye:'GWM · Isenção Fiscal · SP',
   num:'0%',unit:'',
   sub:'DE\nIPVA.',
   desc:'Veículos híbridos e elétricos GWM · Estado de São Paulo',
   metrics:[{v:'H6 HEV',l:'Isento SP'},{v:'H6 PHEV',l:'Isento SP'},{v:'ORA 5',l:'Isento SP'}],
   copy:'Em São Paulo, quem escolhe híbrido não paga IPVA. <strong>Escolha inteligente.</strong>',
   role:'Especialista em Mobilidade Híbrida e Elétrica'},

  {id:'11',fn:'hero',img:`${I}/h6gt-blue.webp`,br:.72,pos:'50% 56%',
   eye:'HAVAL H6 GT · Presença',
   h1:'PRESENÇA\nQUE',h2:'COMANDA\nATENÇÃO.',
   sub:'H6 GT. Uma categoria acima.',
   badge:'H6\nGT',badgeSub:'AWD · TURBO',
   role:'Consultor Especialista GWM'},

  {id:'12',fn:'produto',img:`${I}/h6-phev-blue.jpg`,br:.76,pos:'50% 50%',
   eye:'HAVAL H6 PHEV 35 · Plug-in',
   t1:'PHEV',t2:'35',
   tag:'Plug-in híbrido. A evolução que você esperava.',
   specs:[{val:'1.5T',unit:'',lbl:'Motor turbo'},{val:'35km',unit:'',lbl:'Modo 100% elétrico'},{val:'326',unit:'cv',lbl:'Potência total'}],
   role:'Especialista em Mobilidade Híbrida e Elétrica'},

  // ─ B03: HAVAL H9 ─
  {id:'13',fn:'hero',img:`${I}/fabrica/lineup-dusk.png`,br:.72,pos:'50% 40%',
   eye:'HAVAL H9 · V6 Turbo · 7 Lugares',
   h1:'O REI DO\nSEGMENTO.',h2:'HAVAL\nH9.',
   sub:'V6 Turbo. 7 lugares. Presença absoluta.',
   badge:'HAVAL\nH9',badgeSub:'V6 · 7 LUGARES',
   role:'Consultor Especialista GWM'},

  {id:'14',fn:'produto',img:`${I}/h6-silver-event.jpg`,br:.78,pos:'55% 44%',
   eye:'HAVAL H9 · Especificações',
   t1:'HAVAL',t2:'H9',
   tag:'O SUV de 7 lugares que redefine luxo acessível.',
   specs:[{val:'V6',unit:'',lbl:'Motor turbo bi-turbo'},{val:'7',unit:'',lbl:'Lugares premium'},{val:'4x4',unit:'',lbl:'Tração integral'}],
   role:'Consultor Especialista GWM'},

  {id:'15',fn:'hero',img:`${I}/fabrica/lineup-dusk.png`,br:.70,pos:'50% 36%',
   eye:'GWM · Linha Completa · Jundiaí',
   h1:'TODA A\nLINHA.',h2:'UM ÚNICO\nESPECIALISTA.',
   sub:'Alex Messias. Do H6 ao H9. Do híbrido ao elétrico.',
   role:'Consultoria Premium GWM'},

  {id:'16',fn:'stat',img:`${I}/fabrica/lineup-dusk.png`,br:.18,pos:'50% 40%',plus:false,
   eye:'HAVAL H9 · Família Completa',
   num:'7',unit:'',
   sub:'LUGARES.\nUMA FAMÍLIA.',
   desc:'HAVAL H9 · Conforto premium em cada assento',
   metrics:[{v:'V6',l:'Motor potente'},{v:'4x4',l:'Tração total'},{v:'AWD',l:'Controle absoluto'}],
   copy:'Quando o espaço importa tanto quanto o desempenho. <strong>HAVAL H9.</strong>',
   role:'Consultor Especialista GWM'},

  // ─ B04: ORA 5 ─
  {id:'17',fn:'hero',img:`${I}/ora5/ora5-teal.jpg`,br:.80,pos:'48% 50%',
   eye:'ORA 5 · 100% Elétrico · Em breve',
   h1:'O ORA 5\nESTÁ',h2:'CHEGANDO.',
   sub:'100% elétrico. Design que rompe padrões.',
   badge:'ORA\n5',badgeSub:'EV · 2026',
   role:'Especialista em Mobilidade Elétrica'},

  {id:'18',fn:'produto',img:`${I}/ora5/ora5-gray.jpg`,br:.84,pos:'50% 48%',
   eye:'ORA 5 · Design · Elétrico',
   t1:'ORA',t2:'5',
   tag:'Elétrico. Inteligente. Diferente de tudo.',
   specs:[{val:'EV',unit:'',lbl:'100% elétrico'},{val:'AI',unit:'',lbl:'Assistente integrado'},{val:'OTA',unit:'',lbl:'Atualizações remotas'}],
   role:'Especialista em Mobilidade Elétrica'},

  {id:'19',fn:'stat',img:`${I}/ora5/ora5-interior.jpg`,br:.22,pos:'50% 38%',plus:false,
   eye:'ORA 5 · Interior · Tecnologia',
   num:'15"',unit:'',
   sub:'TELA\nCENTRAL.',
   desc:'ORA 5 · Cockpit do futuro',
   metrics:[{v:'AI',l:'Assistente'},{v:'Hi-Fi',l:'12 alto-falantes'},{v:'OTA',l:'Updates remotos'}],
   copy:'No ORA 5, a tecnologia não é opcional. <strong>É a essência do veículo.</strong>',
   role:'Especialista em Mobilidade Elétrica'},

  {id:'20',fn:'hero',img:`${I}/ora5/ora5-teal.jpg`,br:.74,pos:'52% 52%',
   eye:'ORA 5 · Lista de Espera · Reserve',
   h1:'RESERVE\nO SEU.',h2:'ANTES DE\nCHEGAR.',
   sub:'ORA 5. Lista de espera aberta. Fale com Alex.',
   role:'Especialista em Mobilidade Elétrica',
   cta:'QUERO RESERVAR',ctaLabel:'↗ INSTAGRAM'},

  // ─ B05: FÁBRICA ─
  {id:'21',fn:'hero',img:`${I}/fabrica/lineup-dusk.png`,br:.74,pos:'50% 38%',
   eye:'GWM Brasil · Fábrica Nacional · Iracemápolis SP',
   h1:'A FÁBRICA\nGWM NO',h2:'BRASIL\nJÁ É REAL.',
   sub:'Produção nacional. Padrão de engenharia global.',
   role:'Consultor Especialista GWM'},

  {id:'22',fn:'institucional',img:`${I}/ora5/ora5-interior.jpg`,br:.18,pos:'50% 38%',
   eye:'GWM · Brasil · Investimento',
   h1:'A GWM',h2:'ESCOLHEU\nO BRASIL.',
   sub:'R$ 10 bilhões investidos. Fábrica em operação. Empregos gerados.',
   items:['Produção nacional · SP','Padrão global · Tecnologia','ORA 5 · Em breve no Brasil'],
   role:'Consultor Especialista GWM'},

  // ─ B06: ECONOMIA ─
  {id:'23',fn:'stat',img:`${I}/h6-phev-blue.jpg`,br:.18,plus:false,
   eye:'GWM Híbrido · Economia Real',
   num:'60%',unit:'',
   sub:'MENOS\nGASTOS.',
   desc:'Comparativo: H6 PHEV vs SUV convencional · custo por km',
   metrics:[{v:'0%',l:'IPVA em SP'},{v:'R$0',l:'Km modo elétrico'},{v:'+800',l:'KM por tanque'}],
   copy:'Híbrido não é tendência. <strong>É a decisão mais inteligente</strong> que você pode tomar hoje.',
   role:'Especialista em Mobilidade Híbrida e Elétrica'},

  // ─ B07: PROVA SOCIAL ─
  {id:'24',fn:'hero',img:`${I}/h6-white2.webp`,br:.76,pos:'50% 44%',
   eye:'Experiência · Clientes · Resultados',
   h1:'QUEM\nCOMPRA',h2:'COM ALEX\nVOLTA.',
   sub:'Atendimento que gera confiança. E indicações.',
   role:'Consultoria Premium GWM'},

  {id:'25',fn:'hero',img:`${I}/h6-white2.webp`,br:.74,pos:'50% 46%',
   eye:'Test Drive · Experiência · Jundiaí',
   h1:'EXPERIMENTE\nANTES',h2:'DE\nDECIDIR.',
   sub:'Test drive gratuito. Sem pressão. Apenas a experiência.',
   role:'Atendimento Personalizado'},

  // ─ B08: TEST DRIVE ─
  {id:'26',fn:'testdrive',img:`${I}/h6gt-blue.webp`,br:.76,pos:'50% 56%',
   eye:'Test Drive · HAVAL H6 GT',
   h1:'AGENDE\nSEU TEST',h2:'DRIVE\nHOJE.',
   sub:'SEM COMPROMISSO. DIRIJA E DECIDA.',
   cta:'FALAR COM ALEX',ctaLbl:'Reserve seu horário agora',
   role:'Atendimento Personalizado'},

  {id:'27',fn:'testdrive',img:`${I}/h6gt-dark.webp`,br:.76,pos:'68% center',
   eye:'Test Drive · HAVAL H6 GT',
   h1:'VAGAS\nLIMITADAS.',h2:'AGENDE\nAGORA.',
   sub:'HAVAL H6 GT · GWM Dahruj Jundiaí',
   cta:'CHAMAR NO INSTAGRAM',ctaLbl:'Atendimento direto com Alex',
   role:'Atendimento Personalizado'},

  {id:'28',fn:'stat',img:`${I}/h6-phev-blue.jpg`,br:.22,plus:false,
   eye:'Test Drive · Experiência · Decisão',
   num:'20',unit:'min',
   sub:'MUDAM\nTUDO.',
   desc:'Test drive sem compromisso · Jundiaí SP',
   metrics:[{v:'H6',l:'Disponível'},{v:'H9',l:'Disponível'},{v:'Grátis',l:'Sem custo'}],
   copy:'<strong>20 minutos</strong> ao volante valem mais que qualquer brochura. <strong>Chama o Alex.</strong>',
   role:'Atendimento Personalizado',cta:true,ctaLabel:'↗ AGENDAR COM ALEX'},

  // ─ B09: ALEX ─
  {id:'29',fn:'institucional',img:`${I}/h6gt-dark.webp`,br:.18,pos:'68% center',
   eye:'Alex Messias · Especialista GWM',
   h1:'ALEX',h2:'MESSIAS.',
   sub:'Consultor especializado em mobilidade híbrida e elétrica no interior de SP.',
   items:['Atendimento personalizado','Consultoria sem pressão','Especialista GWM · Jundiaí'],
   role:'Consultor Especialista GWM'},

  {id:'30',fn:'stat',img:`${I}/h6gt-dark.webp`,br:.18,pos:'68% center',plus:false,
   eye:'Alex Messias · Autoridade GWM',
   num:'GWM',unit:'',
   sub:'ESPECIALISTA\nDE VERDADE.',
   desc:'Mobilidade Híbrida e Elétrica · Campinas · Jundiaí · São Paulo',
   metrics:[{v:'H6',l:'Especialista'},{v:'H9',l:'Especialista'},{v:'ORA',l:'Especialista'}],
   copy:'Não basta vender o carro. <strong>Alex entende de cada detalhe.</strong> É isso que faz a diferença.',
   role:'Consultor Especialista GWM'},
];

// ─── GERAÇÃO ─────────────────────────────────────────────────────────────────
let ok = 0;
for (const p of POSTS) {
  const fn = LAYOUTS[p.fn];
  if (!fn) { console.error('Unknown fn:', p.fn, 'post', p.id); continue; }
  writeFileSync(`${DIR}/post-${p.id}.html`, fn(p), 'utf8');
  console.log(`OK post-${p.id}.html  [${p.fn}]`);
  ok++;
}
console.log(`\n${ok}/30 posts gerados.`);
