import { writeFileSync } from 'fs';

const DIR = 'c:/Users/seven/MazyOS/clientes/alex-messias/posts';
const I = '../imagens'; // image base path

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────

const FONTS = `<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@100;200;300;700;900&family=Inter:wght@200;300;400;500&display=swap" rel="stylesheet">`;

const GWM_SVG = `<svg width="28" height="28" viewBox="0 0 28 28" fill="none"><circle cx="14" cy="14" r="12.5" stroke="white" stroke-width="1.2"/><text x="14" y="18.5" text-anchor="middle" font-family="Arial Black,sans-serif" font-size="7.5" font-weight="900" fill="white">GWM</text></svg>`;

const HEADER_HTML = `<div class="header"><div class="h-brand">${GWM_SVG}<span class="h-name">GWM</span><span class="h-pipe">|</span><span class="h-dealer">DAHRUJ</span></div><div class="h-url">gwmdahruj.com.br</div></div>`;

const bottom = (model = '', wa = false) => `
<div class="bottom-block">
  <div class="seal">
    <div class="seal-bar"></div>
    <div class="seal-txt">
      <div class="seal-name">ALEX MESSIAS</div>
      <div class="seal-role">Especialista GWM · Mobilidade Híbrida e Elétrica</div>
    </div>
    ${wa ? `<div class="seal-wa">WhatsApp ↗</div>` : ''}
  </div>
  <div class="footer">
    <div class="f-l"><span class="f-city">Jundiaí — SP</span><span class="f-dot"></span><span class="f-tag">GWM Dahruj</span></div>
    ${model ? `<div class="f-model">${model}</div>` : `<div class="f-url">gwmdahruj.com.br</div>`}
  </div>
</div>`;

const SHARED_CSS = `
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
html{-webkit-font-smoothing:antialiased;}
body{width:1080px;height:1350px;overflow:hidden;background:#080808;}
.c{width:1080px;height:1350px;position:relative;overflow:hidden;}
.header{position:absolute;top:46px;left:58px;right:58px;z-index:20;display:flex;align-items:center;justify-content:space-between;}
.h-brand{display:flex;align-items:center;gap:10px;}
.h-name{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:16px;color:#fff;letter-spacing:5px;text-transform:uppercase;}
.h-pipe{color:rgba(255,255,255,.28);margin:0 8px;}
.h-dealer{font-family:'Barlow Condensed',sans-serif;font-weight:300;font-size:16px;color:rgba(255,255,255,.65);letter-spacing:4px;text-transform:uppercase;}
.h-url{font-family:'Inter',sans-serif;font-size:10px;font-weight:400;letter-spacing:3px;color:rgba(255,255,255,.5);}
.bottom-block{position:absolute;bottom:0;left:0;right:0;z-index:25;padding:0 58px 42px;}
.seal{display:flex;align-items:center;gap:12px;padding-top:20px;border-top:1px solid rgba(255,255,255,.08);margin-bottom:16px;}
.seal-bar{width:2.5px;height:38px;background:#D71920;flex-shrink:0;}
.seal-name{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:19px;color:#fff;letter-spacing:3px;text-transform:uppercase;line-height:1;}
.seal-role{font-family:'Inter',sans-serif;font-size:9px;font-weight:400;letter-spacing:3px;text-transform:uppercase;color:rgba(255,255,255,.58);margin-top:4px;}
.seal-wa{margin-left:auto;font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:13px;letter-spacing:2px;color:#25D366;text-transform:uppercase;}
.footer{display:flex;align-items:center;justify-content:space-between;}
.f-city{font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:12px;letter-spacing:5px;color:rgba(255,255,255,.58);text-transform:uppercase;}
.f-dot{display:inline-block;width:3px;height:3px;background:#D71920;border-radius:50%;margin:0 12px;vertical-align:middle;}
.f-tag{font-family:'Barlow Condensed',sans-serif;font-size:12px;font-weight:700;letter-spacing:5px;color:#D71920;text-transform:uppercase;}
.f-model{font-family:'Barlow Condensed',sans-serif;font-size:13px;font-weight:400;letter-spacing:4px;color:rgba(255,255,255,.5);text-transform:uppercase;}
.f-url{font-family:'Inter',sans-serif;font-size:10px;font-weight:400;letter-spacing:3px;color:rgba(255,255,255,.48);}`;

// ─── LAYOUTS ──────────────────────────────────────────────────────────────────

function hero(p) {
  const br = p.br ?? 0.72;
  const pos = p.pos ?? '65% center';
  const fs = p.fs ?? 190;
  const subTop = p.subTop ?? 630;
  return `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8">${FONTS}<style>
${SHARED_CSS}
.car{position:absolute;inset:0;z-index:1;}
.car img{width:100%;height:100%;object-fit:cover;object-position:${pos};filter:brightness(${br}) contrast(1.15) saturate(.88);}
.ov-l{position:absolute;inset:0;z-index:2;background:linear-gradient(108deg,rgba(8,8,8,.98) 0%,rgba(8,8,8,.9) 28%,rgba(8,8,8,.55) 52%,rgba(8,8,8,.08) 74%,transparent 100%);}
.ov-b{position:absolute;inset:0;z-index:3;background:linear-gradient(to top,rgba(8,8,8,.9) 0%,rgba(8,8,8,.12) 20%,transparent 40%);}
.blade{position:absolute;top:0;left:0;z-index:5;width:3px;height:100%;background:linear-gradient(to bottom,#D71920 38%,rgba(215,25,32,0) 100%);}
.rule{position:absolute;top:140px;left:58px;z-index:20;display:flex;align-items:center;}
.r-red{width:52px;height:2.5px;background:#D71920;}
.r-line{width:300px;height:1px;background:rgba(255,255,255,.07);}
.eye{position:absolute;top:160px;left:58px;z-index:20;font-family:'Inter',sans-serif;font-size:9px;font-weight:500;letter-spacing:7px;text-transform:uppercase;color:rgba(255,255,255,.5);}
.headline{position:absolute;top:194px;left:54px;z-index:20;}
.hl-s{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:${fs}px;line-height:.84;text-transform:uppercase;letter-spacing:-4px;color:#fff;}
.hl-o{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:${fs}px;line-height:.84;text-transform:uppercase;letter-spacing:-4px;-webkit-text-stroke:2px rgba(255,255,255,.42);color:transparent;}
.hl-red{color:#D71920;-webkit-text-stroke:0;}
.sub{position:absolute;top:${subTop}px;left:58px;z-index:20;font-family:'Barlow Condensed',sans-serif;font-weight:300;font-size:25px;letter-spacing:7px;text-transform:uppercase;color:rgba(255,255,255,.65);}
.badge{position:absolute;bottom:168px;right:58px;z-index:20;text-align:right;}
.badge-n{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:58px;line-height:.88;text-transform:uppercase;letter-spacing:-1px;color:rgba(255,255,255,.9);}
.badge-s{font-family:'Barlow Condensed',sans-serif;font-weight:200;font-size:16px;letter-spacing:6px;text-transform:uppercase;color:rgba(255,255,255,.5);margin-top:8px;}
</style></head><body><div class="c">
  <div class="car"><img src="${p.img}" alt=""></div>
  <div class="ov-l"></div><div class="ov-b"></div><div class="blade"></div>
  ${HEADER_HTML}
  <div class="rule"><div class="r-red"></div><div class="r-line"></div></div>
  <div class="eye">${p.eye ?? 'Mobilidade · Tecnologia · Desempenho'}</div>
  <div class="headline">
    <div class="hl-s">${br_(p.h1)}</div>
    ${p.h2 ? `<div class="hl-o">${br_(p.h2)}</div>` : ''}
  </div>
  ${p.sub ? `<div class="sub">${p.sub}</div>` : ''}
  ${p.badge ? `<div class="badge"><div class="badge-n">${br_(p.badge)}</div>${p.badgeSub ? `<div class="badge-s">${p.badgeSub}</div>` : ''}</div>` : ''}
  ${bottom(p.model ?? '', p.wa)}
</div></body></html>`;
}

function produto(p) {
  const br = p.br ?? 0.74;
  const pos = p.pos ?? '55% 55%';
  const specsHtml = (p.specs ?? []).map((s,i) =>
    `<div class="spec${i > 0 ? ' spl' : ''}"><div><span class="sv">${s.val}</span><span class="su">${s.unit}</span></div><div class="sl">${s.lbl}</div></div>`
  ).join('');
  return `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8">${FONTS}<style>
${SHARED_CSS}
.car{position:absolute;inset:0;z-index:1;}
.car img{width:100%;height:100%;object-fit:cover;object-position:${pos};filter:brightness(${br}) contrast(1.12) saturate(.75);}
.ov-t{position:absolute;top:0;left:0;right:0;height:510px;z-index:2;background:linear-gradient(to bottom,rgba(8,8,8,.98) 0%,rgba(8,8,8,.78) 60%,transparent 100%);}
.ov-b{position:absolute;bottom:0;left:0;right:0;height:320px;z-index:2;background:linear-gradient(to top,rgba(8,8,8,.97) 0%,transparent 100%);}
.line-r{position:absolute;top:438px;left:0;right:0;z-index:5;height:2px;background:linear-gradient(to right,transparent 0%,#D71920 6%,#D71920 72%,transparent 100%);}
.cat{position:absolute;top:126px;left:58px;z-index:20;display:flex;align-items:center;gap:10px;}
.cat-bar{width:28px;height:1.5px;background:#D71920;}
.cat-txt{font-family:'Inter',sans-serif;font-size:9px;font-weight:600;letter-spacing:7px;text-transform:uppercase;color:#D71920;}
.title{position:absolute;top:160px;left:56px;z-index:20;}
.t1{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:178px;line-height:.84;text-transform:uppercase;letter-spacing:-3px;color:#fff;}
.t2{font-family:'Barlow Condensed',sans-serif;font-weight:100;font-size:110px;line-height:.84;text-transform:uppercase;letter-spacing:-2px;-webkit-text-stroke:1.5px rgba(255,255,255,.42);color:transparent;}
.tagline{position:absolute;top:462px;left:58px;z-index:20;font-family:'Barlow Condensed',sans-serif;font-weight:400;font-size:30px;letter-spacing:4px;text-transform:uppercase;color:rgba(255,255,255,.72);}
.specs{position:absolute;bottom:168px;left:58px;right:58px;z-index:20;display:flex;border-top:1px solid rgba(255,255,255,.1);padding-top:26px;}
.spec{flex:1;padding-right:22px;border-right:1px solid rgba(255,255,255,.08);}
.spl{padding-left:22px;border-right:none;}
.sv{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:42px;color:#fff;letter-spacing:-1px;line-height:1;}
.su{font-family:'Barlow Condensed',sans-serif;font-weight:300;font-size:17px;color:#D71920;letter-spacing:2px;margin-left:2px;}
.sl{font-family:'Inter',sans-serif;font-size:9px;font-weight:400;letter-spacing:4px;text-transform:uppercase;color:rgba(255,255,255,.55);margin-top:5px;}
</style></head><body><div class="c">
  <div class="car"><img src="${p.img}" alt=""></div>
  <div class="ov-t"></div><div class="ov-b"></div><div class="line-r"></div>
  ${HEADER_HTML}
  <div class="cat"><div class="cat-bar"></div><div class="cat-txt">${p.cat ?? 'Produto'}</div></div>
  <div class="title">
    <div class="t1">${p.t1}</div>
    ${p.t2 ? `<div class="t2">${p.t2}</div>` : ''}
  </div>
  ${p.tagline ? `<div class="tagline">${p.tagline}</div>` : ''}
  ${specsHtml ? `<div class="specs">${specsHtml}</div>` : ''}
  ${bottom(p.model ?? '', p.wa)}
</div></body></html>`;
}

function stat(p) {
  const br = p.br ?? 0.2;
  const pos = p.pos ?? '55% 48%';
  const midHtml = (p.mid ?? []).map((m,i) =>
    `<div class="mi${i > 0 ? ' mil' : ''}"><div><span class="mv">${m.val}</span>${m.unit ? `<span class="mu">${m.unit}</span>` : ''}</div><div class="ml">${m.lbl}</div></div>`
  ).join('');
  return `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8">${FONTS}<style>
${SHARED_CSS}
.car{position:absolute;inset:0;z-index:1;}
.car img{width:100%;height:100%;object-fit:cover;object-position:${pos};filter:brightness(${br}) contrast(1.38) saturate(0);}
.glow{position:absolute;bottom:0;left:0;right:0;height:500px;z-index:2;background:radial-gradient(ellipse 80% 55% at 50% 100%,rgba(215,25,32,.07) 0%,transparent 70%);}
.lt{position:absolute;top:360px;left:58px;right:58px;z-index:5;height:1px;background:rgba(255,255,255,.08);}
.lt-a{position:absolute;top:358px;left:58px;z-index:6;width:68px;height:3px;background:#D71920;}
.lm{position:absolute;top:760px;left:58px;right:58px;z-index:5;height:1px;background:rgba(255,255,255,.07);}
.eye{position:absolute;top:136px;left:58px;z-index:20;font-family:'Inter',sans-serif;font-size:9px;font-weight:500;letter-spacing:7px;text-transform:uppercase;color:rgba(255,255,255,.52);}
.stat-block{position:absolute;top:170px;left:48px;z-index:20;display:flex;align-items:flex-start;}
.s-plus{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:${p.plusSize ?? 260}px;line-height:.82;color:#D71920;letter-spacing:-6px;margin-top:6px;}
.s-num{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:${p.numSize ?? 340}px;line-height:.82;color:#fff;letter-spacing:-10px;}
.s-unit{position:absolute;bottom:-10px;right:${p.unitRight ?? -60}px;font-family:'Barlow Condensed',sans-serif;font-weight:200;font-size:68px;color:rgba(255,255,255,.5);letter-spacing:2px;text-transform:uppercase;}
.stat-sub{position:absolute;top:488px;left:58px;z-index:20;}
.ss-l{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:66px;text-transform:uppercase;letter-spacing:-1px;color:#fff;line-height:.95;}
.ss-d{font-family:'Barlow Condensed',sans-serif;font-weight:300;font-size:24px;letter-spacing:7px;text-transform:uppercase;color:rgba(255,255,255,.62);margin-top:14px;}
.mid{position:absolute;top:780px;left:58px;right:58px;z-index:20;display:flex;}
.mi{flex:1;padding-right:28px;border-right:1px solid rgba(255,255,255,.07);}
.mil{padding-left:28px;border-right:none;}
.mv{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:38px;color:#fff;line-height:1;}
.mu{font-family:'Barlow Condensed',sans-serif;font-weight:200;font-size:17px;color:#D71920;margin-left:2px;}
.ml{font-family:'Inter',sans-serif;font-size:9px;font-weight:400;letter-spacing:4px;text-transform:uppercase;color:rgba(255,255,255,.55);margin-top:5px;}
.copy-block{position:absolute;bottom:168px;left:58px;right:58px;z-index:20;border-left:2.5px solid #D71920;padding-left:22px;}
.copy-t{font-family:'Barlow Condensed',sans-serif;font-weight:300;font-size:34px;line-height:1.35;color:rgba(255,255,255,.7);}
.copy-t strong{color:#fff;font-weight:700;}
</style></head><body><div class="c">
  ${p.img ? `<div class="car"><img src="${p.img}" alt=""></div>` : ''}
  <div class="glow"></div>
  <div class="lt"></div><div class="lt-a"></div><div class="lm"></div>
  ${HEADER_HTML}
  <div class="eye">${p.eye ?? 'Tecnologia · Performance · Eficiência'}</div>
  <div class="stat-block" style="position:absolute;top:170px;left:48px;z-index:20;display:flex;align-items:flex-start;">
    ${p.plus ? `<span class="s-plus">+</span>` : ''}
    <span class="s-num">${p.num}</span>
    ${p.unit ? `<span class="s-unit" style="position:relative;bottom:auto;right:auto;margin-top:28px;margin-left:12px;">${p.unit}</span>` : ''}
  </div>
  <div class="stat-sub">
    <div class="ss-l">${br_(p.sub)}</div>
    ${p.desc ? `<div class="ss-d">${p.desc}</div>` : ''}
  </div>
  ${midHtml ? `<div class="mid">${midHtml}</div>` : ''}
  ${p.copy ? `<div class="copy-block"><div class="copy-t">${p.copy}</div></div>` : ''}
  ${bottom(p.model ?? '', p.wa)}
</div></body></html>`;
}

function institucional(p) {
  const br = p.br ?? 0.28;
  const pos = p.pos ?? '55% 45%';
  const itemsHtml = (p.items ?? []).map(it =>
    `<div class="mod"><div class="mod-dot"></div><div class="mod-name">${it.name}</div>${it.sub ? `<div class="mod-type">${it.sub}</div>` : ''}</div>`
  ).join('');
  return `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8">${FONTS}<style>
${SHARED_CSS}
.car{position:absolute;inset:0;z-index:1;}
.car img{width:100%;height:100%;object-fit:cover;object-position:${pos};filter:brightness(${br}) contrast(1.4) saturate(0);}
.ov{position:absolute;inset:0;z-index:2;background:radial-gradient(ellipse 110% 90% at 70% 50%,rgba(8,8,8,0) 0%,rgba(8,8,8,.6) 55%,rgba(8,8,8,.97) 100%);}
.ov-b{position:absolute;bottom:0;left:0;right:0;height:400px;z-index:3;background:linear-gradient(to top,rgba(8,8,8,.99) 0%,rgba(8,8,8,.35) 60%,transparent 100%);}
.ov-t{position:absolute;top:0;left:0;right:0;height:190px;z-index:3;background:linear-gradient(to bottom,rgba(8,8,8,.97) 0%,transparent 100%);}
.rv{position:absolute;top:0;right:0;z-index:6;width:5px;height:460px;background:linear-gradient(to bottom,#D71920 0%,rgba(215,25,32,0) 100%);}
.rh{position:absolute;top:0;right:0;z-index:6;width:${p.rw ?? 200}px;height:3px;background:#D71920;}
.center{position:absolute;top:50%;left:0;right:0;z-index:20;transform:translateY(-50%);padding:0 58px;}
.c-eye{font-family:'Inter',sans-serif;font-size:9px;font-weight:500;letter-spacing:9px;text-transform:uppercase;color:rgba(255,255,255,.55);margin-bottom:36px;display:flex;align-items:center;gap:14px;}
.c-eye::before{content:'';display:block;width:32px;height:1.5px;background:#D71920;}
.c-h1{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:${p.fs ?? 185}px;line-height:.82;text-transform:uppercase;letter-spacing:-4px;color:#fff;}
.c-h2{font-family:'Barlow Condensed',sans-serif;font-weight:100;font-size:${p.fs ?? 185}px;line-height:.82;text-transform:uppercase;letter-spacing:-4px;-webkit-text-stroke:2px rgba(255,255,255,.35);color:transparent;}
.c-h2 .red{color:#D71920;-webkit-text-stroke:0;}
.c-div{width:52px;height:1.5px;background:rgba(255,255,255,.14);margin:40px 0;}
.c-sub{font-family:'Barlow Condensed',sans-serif;font-weight:300;font-size:29px;letter-spacing:4px;text-transform:uppercase;color:rgba(255,255,255,.65);max-width:580px;line-height:1.4;}
.mods{position:absolute;bottom:170px;left:58px;right:58px;z-index:20;display:flex;}
.mod{flex:1;padding-right:22px;border-right:1px solid rgba(255,255,255,.07);}
.mod:last-child{border-right:none;padding-left:22px;padding-right:0;}
.mod-dot{width:24px;height:2px;background:#D71920;margin-bottom:12px;}
.mod-name{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:20px;color:rgba(255,255,255,.9);letter-spacing:2px;text-transform:uppercase;}
.mod-type{font-family:'Inter',sans-serif;font-size:9px;font-weight:400;letter-spacing:4px;text-transform:uppercase;color:rgba(255,255,255,.5);margin-top:4px;}
</style></head><body><div class="c">
  ${p.img ? `<div class="car"><img src="${p.img}" alt=""></div>` : ''}
  <div class="ov"></div><div class="ov-b"></div><div class="ov-t"></div>
  <div class="rv"></div><div class="rh"></div>
  ${HEADER_HTML}
  <div class="center">
    ${p.eye ? `<div class="c-eye">${p.eye}</div>` : ''}
    <div class="c-h1">${br_(p.h1)}</div>
    ${p.h2 ? `<div class="c-h2">${br_(p.h2)}<span class="red">.</span></div>` : ''}
    <div class="c-div"></div>
    ${p.sub ? `<div class="c-sub">${p.sub}</div>` : ''}
  </div>
  ${itemsHtml ? `<div class="mods">${itemsHtml}</div>` : ''}
  ${bottom(p.model ?? '', p.wa)}
</div></body></html>`;
}

function testdrive(p) {
  const br = p.br ?? 0.72;
  const pos = p.pos ?? '50% 58%';
  return `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8">${FONTS}<style>
${SHARED_CSS}
.car{position:absolute;inset:0;z-index:1;}
.car img{width:100%;height:100%;object-fit:cover;object-position:${pos};filter:brightness(${br}) contrast(1.2) saturate(.85);}
.ov-t{position:absolute;top:0;left:0;right:0;height:640px;z-index:2;background:linear-gradient(to bottom,rgba(8,8,8,.97) 0%,rgba(8,8,8,.72) 55%,transparent 100%);}
.ov-l{position:absolute;inset:0;z-index:3;background:linear-gradient(to right,rgba(8,8,8,.42) 0%,transparent 50%);}
.ov-b{position:absolute;bottom:0;left:0;right:0;height:360px;z-index:4;background:linear-gradient(to top,rgba(8,8,8,.99) 0%,rgba(8,8,8,.5) 60%,transparent 100%);}
.cat{position:absolute;top:126px;left:58px;z-index:20;display:flex;align-items:center;gap:10px;}
.cat-bar{width:28px;height:1.5px;background:#D71920;}
.cat-txt{font-family:'Inter',sans-serif;font-size:9px;font-weight:600;letter-spacing:7px;text-transform:uppercase;color:#D71920;}
.headline{position:absolute;top:160px;left:56px;z-index:20;}
.hl-s{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:${p.fs ?? 154}px;line-height:.84;text-transform:uppercase;letter-spacing:-3px;color:#fff;}
.hl-o{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:${p.fs ?? 154}px;line-height:.84;text-transform:uppercase;letter-spacing:-3px;-webkit-text-stroke:2px rgba(255,255,255,.42);color:transparent;}
.hl-red{color:#D71920;-webkit-text-stroke:0;}
.sub{position:absolute;top:${p.subTop ?? 648}px;left:58px;z-index:20;font-family:'Barlow Condensed',sans-serif;font-weight:300;font-size:25px;letter-spacing:6px;text-transform:uppercase;color:rgba(255,255,255,.65);}
.cta-block{position:absolute;bottom:172px;left:58px;z-index:20;}
.cta-lbl{font-family:'Inter',sans-serif;font-size:9px;font-weight:500;letter-spacing:7px;text-transform:uppercase;color:rgba(255,255,255,.55);margin-bottom:16px;}
.cta-btn{display:inline-flex;align-items:center;gap:18px;border:2px solid #D71920;background:rgba(215,25,32,.1);padding:22px 50px;font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:26px;color:#fff;text-transform:uppercase;letter-spacing:5px;}
.cta-arr{color:#D71920;font-size:22px;}
</style></head><body><div class="c">
  <div class="car"><img src="${p.img}" alt=""></div>
  <div class="ov-t"></div><div class="ov-l"></div><div class="ov-b"></div>
  ${HEADER_HTML}
  <div class="cat"><div class="cat-bar"></div><div class="cat-txt">${p.cat ?? 'Test Drive'}</div></div>
  <div class="headline">
    <div class="hl-s">${br_(p.h1)}</div>
    ${p.h2 ? `<div class="hl-s">${br_(p.h2)}</div>` : ''}
    ${p.h3 ? `<div class="hl-o">${br_(p.h3)}<span class="hl-red">.</span></div>` : ''}
  </div>
  ${p.sub ? `<div class="sub">${p.sub}</div>` : ''}
  <div class="cta-block">
    <div class="cta-lbl">${p.ctaLabel ?? 'Reserve agora'}</div>
    <div class="cta-btn">${p.cta ?? 'Falar com Alex'} <span class="cta-arr">→</span></div>
  </div>
  ${bottom('', true)}
</div></body></html>`;
}

// Helper: replace \n with <br>
function br_(s) { return s ? s.replace(/\n/g, '<br>') : ''; }

// Layout map
const L = { hero, produto, stat, institucional, testdrive };

// ─── POST DATA ────────────────────────────────────────────────────────────────

const posts = [
  // BLOCO 01 — AUTORIDADE
  { id:'01', fn:'hero', eye:'Autoridade · GWM Dahruj · Jundiaí',
    h1:'A GWM NÃO\nVENDE CARROS.', h2:'VENDE\nO FUTURO',
    sub:'Alex Messias · Consultor GWM Especialista',
    img:`${I}/h6gt-dark.webp`, br:0.70, pos:'68% center',
    badge:'HAVAL\nH6 GT', badgeSub:'PHEV · 2026' },

  { id:'02', fn:'produto', cat:'Autoridade GWM',
    t1:'NÃO É UM', t2:'CARRO CHINÊS.',
    tagline:'É tecnologia global. Produzida no Brasil.',
    img:`${I}/h6-white2.webp`, br:0.76, pos:'55% 60%',
    specs:[{val:'5°', unit:'', lbl:'Maior montadora do mundo'},{val:'3M+', unit:'', lbl:'Veículos vendidos/ano'},{val:'170+', unit:'', lbl:'Países atendidos'}] },

  { id:'03', fn:'hero', eye:'GWM · Crescimento · Brasil',
    h1:'POR QUE A GWM\nCRESCE', h2:'TÃO\nRÁPIDO',
    sub:'Mais de 3 milhões de veículos por ano.',
    img:`${I}/fabrica/lineup-dusk.png`, br:0.62, pos:'50% 45%',
    badge:'GWM\nBRASIL', badgeSub:'Em expansão' },

  { id:'04', fn:'institucional', eye:'GWM Dahruj · Jundiaí',
    h1:'A GWM\nESCOLHEU', h2:'O BRASIL',
    sub:'E Jundiaí é o ponto de partida.', rw:180,
    img:`${I}/fabrica/dealership.jpg`, br:0.22, pos:'50% 50%',
    items:[{name:'HAVAL H6',sub:'HEV · PHEV 35'},{name:'HAVAL H9',sub:'V6 · Turbo'},{name:'ORA 5',sub:'100% Elétrico'}] },

  { id:'05', fn:'hero', eye:'Experiência · Atendimento · Confiança',
    h1:'A EXPERIÊNCIA\nCOMEÇA', h2:'ANTES\nDA COMPRA',
    sub:'Atendimento personalizado do início ao fim.',
    img:`${I}/h6-phev-blue.jpg`, br:0.70, pos:'62% center',
    fs:175 },

  { id:'06', fn:'institucional', eye:'Híbridos · Elétricos · Futuro',
    h1:'QUEM COMPRA\nGWM', h2:'RARAMENTE\nVOLTA ATRÁS',
    sub:'Tecnologia que convence na primeira experiência.',
    img:`${I}/h6gt-dark.webp`, br:0.25, rw:220 },

  // BLOCO 02 — HAVAL H6
  { id:'07', fn:'stat', eye:'HAVAL H6 PHEV · Autonomia',
    plus:true, num:'800', unit:'KM',
    sub:'SEM\nPREOCUPAÇÃO.',
    desc:'HAVAL H6 PHEV · Modo híbrido',
    mid:[{val:'1.5T',lbl:'Motor turbo'},{val:'244',unit:'cv',lbl:'Potência combinada'},{val:'0',unit:'R$/km',lbl:'Modo elétrico'}],
    copy:'Enquanto você abastece <strong>uma vez</strong>, o H6 já percorreu <strong>o Brasil inteiro.</strong>',
    img:`${I}/h6-phev-blue.jpg`, br:0.22, model:'HAVAL H6 PHEV' },

  { id:'08', fn:'stat', eye:'HAVAL H6 GT · Performance',
    num:'243', unit:'CV',
    sub:'POTÊNCIA\nCOMBINADA.',
    desc:'HAVAL H6 GT · Motor 1.5T + Elétrico',
    mid:[{val:'+800',lbl:'km de autonomia'},{val:'1.5T',lbl:'Turbo direto'},{val:'0',unit:'→',lbl:'Emissão elétrica'}],
    copy:'Dois motores. Uma experiência. <strong>Zero compromisso</strong> entre performance e eficiência.',
    img:`${I}/h6gt-dark.webp`, br:0.18, numSize:310, plusSize:240 },

  { id:'09', fn:'produto', cat:'HAVAL H6 · Destaque',
    t1:'HAVAL', t2:'H6 HEV 2',
    tagline:'O SUV híbrido mais desejado do momento.',
    img:`${I}/h6-white2.webp`, br:0.74, pos:'55% 58%',
    specs:[{val:'243',unit:'cv',lbl:'Potência total'},{val:'800',unit:'+km',lbl:'Autonomia'},{val:'0',unit:'R$/km',lbl:'Modo elétrico'}],
    model:'HAVAL H6' },

  { id:'10', fn:'stat', eye:'HAVAL H6 · Economia · Modo Elétrico',
    num:'0', unit:'R$/KM',
    sub:'NO MODO\nELÉTRICO.',
    desc:'HAVAL H6 PHEV · Nas rotas urbanas',
    mid:[{val:'60km',lbl:'Pura bateria'},{val:'0%',lbl:'Combustível urbano'},{val:'Full',lbl:'Recarga em casa'}],
    copy:'Seu trajeto diário. <strong>Completamente grátis.</strong> Sem gasolina, sem culpa.',
    img:null, br:0.12, model:'HAVAL H6 PHEV' },

  { id:'11', fn:'hero', eye:'HAVAL H6 · Design · Inovação',
    h1:'O H6 NÃO\nSEGUE', h2:'TENDÊNCIAS.\nELE CRIA',
    sub:'Design que define uma geração.',
    img:`${I}/h6gt-blue.webp`, br:0.68, pos:'50% 56%',
    badge:'H6 GT', badgeSub:'2026' },

  { id:'12', fn:'produto', cat:'HAVAL H6 · Eficiência',
    t1:'MENOS', t2:'COMBUSTÍVEL.',
    tagline:'Mais autonomia. Mais experiência. Mais liberdade.',
    img:`${I}/h6-phev-blue.jpg`, br:0.72, pos:'58% 52%',
    specs:[{val:'-60%',unit:'',lbl:'Menos gasolina'},{val:'800',unit:'+km',lbl:'Autonomia total'},{val:'R$0',unit:'',lbl:'No modo elétrico'}],
    model:'HAVAL H6 PHEV' },

  // BLOCO 03 — HAVAL H9
  { id:'13', fn:'hero', eye:'HAVAL H9 · Poder · Presença',
    h1:'VOCÊ NÃO\nDIRIGE UM H9.', h2:'VOCÊ\nCOMANDA',
    sub:'V6 turbo. SUV de grande porte. Puro domínio.',
    img:`${I}/fabrica/lineup-dusk.png`, br:0.6, pos:'50% 42%',
    fs:164, badge:'HAVAL H9', badgeSub:'V6 · Turbo' },

  { id:'14', fn:'institucional', eye:'HAVAL H9 · Luxo · Performance',
    h1:'LUXO E\nPERFORMANCE.', h2:'SEM ESCOLHER\nUM OU OUTRO',
    sub:'O H9 foi feito para quem recusa fazer concessões.',
    img:`${I}/h6-silver-event.jpg`, br:0.22, rw:200,
    items:[{name:'V6 Turbo',sub:'Alta performance'},{name:'Luxo',sub:'Interior premium'},{name:'4WD',sub:'Tração integral'}] },

  { id:'15', fn:'hero', eye:'HAVAL H9 · Aventura · Cidade',
    h1:'PRONTO PARA\nAVENTURAS.', h2:'PRONTO PARA\nA CIDADE',
    sub:'Uma escolha. Infinitas possibilidades.',
    img:`${I}/fabrica/lineup-dusk.png`, br:0.58, pos:'50% 40%',
    fs:155 },

  { id:'16', fn:'produto', cat:'HAVAL H9 · SUV Premium',
    t1:'HAVAL', t2:'H9',
    tagline:'Potência, espaço e luxo em cada detalhe.',
    img:`${I}/fabrica/lineup-dusk.png`, br:0.65, pos:'50% 40%',
    specs:[{val:'V6',unit:'Turbo',lbl:'Motor alto desempenho'},{val:'7',unit:'lugares',lbl:'Espaço generoso'},{val:'4WD',unit:'',lbl:'Tração nas quatro rodas'}],
    model:'HAVAL H9' },

  // BLOCO 04 — ORA 5
  { id:'17', fn:'hero', eye:'ORA 5 · Elétrico · Inovação',
    h1:'O ORA 5\nESTÁ', h2:'CHEGANDO',
    sub:'100% elétrico. Design que não passa despercebido.',
    img:`${I}/ora5/ora5-teal.jpg`, br:0.72, pos:'50% 48%',
    badge:'ORA 5', badgeSub:'100% Elétrico' },

  { id:'18', fn:'produto', cat:'ORA 5 · Elétrico',
    t1:'100%', t2:'ELÉTRICO.',
    tagline:'100% diferente. Design que muda a conversa.',
    img:`${I}/ora5/ora5-gray.jpg`, br:0.72, pos:'50% 46%',
    specs:[{val:'EV',unit:'',lbl:'100% elétrico'},{val:'400',unit:'+km',lbl:'Autonomia estimada'},{val:'Tech',unit:'',lbl:'Interior premium'}],
    model:'ORA 5' },

  { id:'19', fn:'institucional', eye:'ORA 5 · Sustentabilidade · Futuro',
    h1:'CARREGUE.\nDIRIJA.', h2:'REPITA',
    sub:'Zero emissão. Impacto real no presente.',
    img:`${I}/ora5/ora5-interior.jpg`, br:0.35, pos:'50% 40%', rw:160,
    items:[{name:'Zero CO₂',sub:'Emissão elétrica'},{name:'Casa ou',sub:'Ponto público'},{name:'Futuro',sub:'Está aqui'}] },

  { id:'20', fn:'hero', eye:'ORA 5 · Tecnologia Global',
    h1:'O FUTURO\nNÃO É', h2:'ELÉTRICO.\nÉ INTELIGENTE',
    sub:'ORA 5. A nova geração já está aqui.',
    img:`${I}/ora5/ora5-teal.jpg`, br:0.70, pos:'48% 50%',
    fs:175, badge:'ORA 5', badgeSub:'2026' },

  // BLOCO 05 — FÁBRICA + GLOBAL
  { id:'21', fn:'hero', eye:'GWM Brasil · Fábrica · Expansão',
    h1:'A FÁBRICA DA\nGWM NO BRASIL', h2:'JÁ É\nREAL',
    sub:'Produção nacional. Padrão global.',
    img:`${I}/fabrica/lineup-dusk.png`, br:0.6, pos:'50% 38%',
    fs:145 },

  { id:'22', fn:'produto', cat:'ORA 5 · Tecnologia',
    t1:'TECNOLOGIA', t2:'QUE VOCÊ SENTE.',
    tagline:'Do volante ao painel. Cada detalhe foi pensado.',
    img:`${I}/ora5/ora5-interior.jpg`, br:0.78, pos:'50% 38%',
    specs:[{val:'15"',unit:'',lbl:'Tela central'},{val:'AI',unit:'',lbl:'Assistente integrado'},{val:'OTA',unit:'',lbl:'Atualizações remotas'}] },

  // BLOCO 06 — ECONOMIA
  { id:'23', fn:'stat', eye:'Benefícios · IPVA · Híbridos',
    num:'IPVA', unit:'',
    sub:'PODE SER\nMENOR.',
    desc:'Veículos híbridos · Verifique no seu estado',
    mid:[{val:'Híbrido',lbl:'PHEV qualificado'},{val:'Isenção',lbl:'Em alguns estados'},{val:'GWM',lbl:'Já se qualifica'}],
    copy:'Alguns estados oferecem <strong>redução ou isenção de IPVA</strong> para veículos híbridos. <strong>Consulte seu consultor.</strong>',
    img:`${I}/h6-phev-blue.jpg`, br:0.18, numSize:220 },

  // BLOCO 07 — PROVA SOCIAL
  { id:'24', fn:'institucional', eye:'Entrega · Satisfação · GWM Dahruj',
    h1:'MAIS UM\nCLIENTE', h2:'ENTREGUE',
    sub:'A experiência começa agora. E nunca termina.',
    img:`${I}/h6-white2.webp`, br:0.2, rw:160 },

  { id:'25', fn:'hero', eye:'Missão · Propósito · Resultado',
    h1:'NÃO VENDO\nCARROS.', h2:'AJUDO\nPESSOAS',
    sub:'A encontrar o carro certo para cada momento.',
    img:`${I}/h6-white2.webp`, br:0.65, pos:'55% 55%',
    fs:175 },

  // BLOCO 08 — TEST DRIVE
  { id:'26', fn:'testdrive', cat:'Test Drive · Jundiaí',
    h1:'AGENDE SEU', h2:'TEST DRIVE',
    h3:'HOJE',
    sub:'Sem compromisso. Dirija e decida.',
    ctaLabel:'Reserve seu horário agora',
    cta:'Falar com Alex — WhatsApp',
    img:`${I}/h6gt-blue.webp`, br:0.72, pos:'50% 56%' },

  { id:'27', fn:'hero', eye:'Test Drive · Experiência · GWM',
    h1:'VOCÊ PRECISA\nSENTIR.', h2:'PALAVRAS\nNÃO CHEGAM',
    sub:'20 minutos ao volante mudam tudo.',
    img:`${I}/h6gt-dark.webp`, br:0.70, pos:'66% center',
    fs:168 },

  { id:'28', fn:'stat', eye:'Test Drive · Decisão · Confiança',
    num:'20', unit:'MIN',
    sub:'AO VOLANTE.\nMUDAM TUDO.',
    desc:'Test drive HAVAL H6 · GWM Dahruj Jundiaí',
    mid:[{val:'Grátis',lbl:'Sem compromisso'},{val:'Hoje',lbl:'Agenda disponível'},{val:'H6',lbl:'GT ou PHEV'}],
    copy:'Uma decisão desse tamanho merece <strong>20 minutos</strong> para ser testada. <strong>Agende agora.</strong>',
    img:`${I}/h6-phev-blue.jpg`, br:0.22, numSize:300, plusSize:220, wa:true },

  // BLOCO 09 — ALEX MESSIAS
  { id:'29', fn:'institucional', eye:'Alex Messias · GWM Dahruj · Jundiaí',
    h1:'ALEX\nMESSIAS', h2:'ESPECIALISTA\nGWM',
    sub:'Mobilidade híbrida e elétrica. Do test drive à entrega.',
    img:`${I}/h6gt-dark.webp`, br:0.2, rw:240, fs:165,
    items:[{name:'GWM Dahruj',sub:'Jundiaí — SP'},{name:'WhatsApp',sub:'Contato direto'},{name:'Test Drive',sub:'Agendamento fácil'}] },

  { id:'30', fn:'hero', eye:'Consultor GWM · Jundiaí',
    h1:'MEU OBJETIVO\nNÃO É VENDER.', h2:'É ENCONTRAR\nO CARRO CERTO',
    sub:'Para você. Para sua vida. Para o seu bolso.',
    img:`${I}/h6gt-dark.webp`, br:0.68, pos:'66% center',
    fs:145, wa:true },
];

// ─── GENERATE ─────────────────────────────────────────────────────────────────

let ok = 0;
for (const p of posts) {
  const fn = L[p.fn];
  if (!fn) { console.error(`Unknown layout: ${p.fn} for post ${p.id}`); continue; }
  const html = fn(p);
  const file = `${DIR}/post-${p.id}.html`;
  writeFileSync(file, html, 'utf8');
  console.log(`✓ post-${p.id}.html  [${p.fn}]`);
  ok++;
}
console.log(`\n${ok}/30 posts gerados.`);
