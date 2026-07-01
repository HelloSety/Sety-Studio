/**
 * SETY STUDIO — Gerador de Criativos Meta Ads (Alta Conversão)
 * 18 criativos: 3 nichos × (3 Feed 1080×1350 + 3 Stories 1080×1920)
 * Estilo: Apple / Stripe / Framer / Linear — premium, clean, SaaS-level
 */

import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC   = 'C:/Users/seven/MazyOS/saidas/sety-studio-web/public';
const LOGO     = `file:///${PUBLIC}/logo.png`;
const SHOT     = (n) => `file:///${PUBLIC}/portfolio/${n}/screenshots/thumb.png`;
const WA_NUM   = '5519988090110';

const WA_SVG = `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.12.553 4.11 1.52 5.838L0 24l6.336-1.648A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.6c-1.9 0-3.68-.511-5.21-1.402l-.374-.222-3.76.977.998-3.658-.243-.386A9.576 9.576 0 012.4 12C2.4 6.7 6.7 2.4 12 2.4c5.3 0 9.6 4.3 9.6 9.6 0 5.3-4.3 9.6-9.6 9.6z"/></svg>`;

// ─── NICHOS ───────────────────────────────────────────────────────────────
const NICHOS = [
  {
    slug: 'advocacia',
    label: 'Advocacia',
    name: 'Valença & Associados',
    cor: '#C9A73D',
    tagline: 'Autoridade começa na primeira impressão.',
    resultado: '+80% no ticket médio',
    metrica: '+80%',
    problema: 'Seu escritório transmite a autoridade que seu trabalho merece?',
    shot: SHOT('advocacia'),
    checklist: ['Mais autoridade no mercado', 'Clientes de maior qualidade', 'Ticket médio mais alto', 'Presença que inspira confiança'],
    features: ['Design que transmite autoridade', 'Página de captação de clientes', 'Portfólio de resultados', 'SEO para buscas locais'],
  },
  {
    slug: 'odontologia',
    label: 'Odontologia',
    name: 'Prime Odonto',
    cor: '#00B67A',
    tagline: 'Mais pacientes começam com mais confiança.',
    resultado: '+340% em agendamentos',
    metrica: '+340%',
    problema: 'Sua clínica aparece quando pacientes pesquisam no Google?',
    shot: SHOT('odontologia'),
    checklist: ['Mais agendamentos online', 'Página de procedimentos', 'Automação de atendimento', 'Google Meu Negócio otimizado'],
    features: ['Agenda online integrada', 'Página por procedimento', 'SEO local otimizado', 'Bot de qualificação'],
  },
  {
    slug: 'energia-solar',
    label: 'Energia Solar',
    name: 'SolarMax Energia',
    cor: '#22C55E',
    tagline: 'Sua empresa merece uma presença digital tão forte quanto seus projetos.',
    resultado: '85 projetos em 4 meses',
    metrica: '85',
    problema: 'Quantos clientes buscam energia solar e não te encontram online?',
    shot: SHOT('energia-solar'),
    checklist: ['Calculadora de economia integrada', 'Formulário de captação de leads', 'Campanhas Google Search', 'Automação WhatsApp'],
    features: ['Calculadora de retorno', 'Landing pages por segmento', 'Captação automatizada', 'Dashboard de leads'],
  },
];

// ─── CSS BASE PREMIUM (Apple/Framer/Linear) ──────────────────────────────
const CSS_SHARED = `
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&display=swap');
*{margin:0;padding:0;box-sizing:border-box;}
body{background:#050505;font-family:'Montserrat',sans-serif;}

.ad{position:relative;overflow:hidden;background:#050505;}
.ad-feed{width:1080px;height:1350px;}
.ad-story{width:1080px;height:1920px;}

/* Browser frame */
.browser{background:#0d0d0d;border-radius:12px;border:1px solid rgba(255,255,255,0.1);overflow:hidden;box-shadow:0 40px 100px rgba(0,0,0,0.85),0 0 0 1px rgba(255,255,255,0.04);}
.browser-bar{height:38px;background:#1a1a1a;display:flex;align-items:center;gap:6px;padding:0 14px;flex-shrink:0;}
.dot{width:10px;height:10px;border-radius:50%;}
.url-bar{flex:1;height:20px;background:rgba(255,255,255,0.07);border-radius:4px;margin:0 12px;}
.browser-screen{overflow:hidden;}
.browser-screen img{width:100%;display:block;object-fit:cover;object-position:top;}

/* Phone mockup */
.phone-outer{width:180px;height:360px;border:6px solid #222;border-radius:30px;overflow:hidden;background:#111;box-shadow:0 20px 60px rgba(0,0,0,0.9),inset 0 0 0 1px rgba(255,255,255,0.06);}
.phone-outer img{width:300%;transform:scale(0.333);transform-origin:top left;}

/* WA Button */
.wa-btn{display:inline-flex;align-items:center;justify-content:center;gap:10px;background:#25D366;color:#fff;font-size:17px;font-weight:800;letter-spacing:0.04em;padding:20px 40px;border-radius:8px;width:100%;}

/* Checklist */
.check-item{display:flex;align-items:center;gap:16px;padding:20px 0;border-bottom:1px solid rgba(255,255,255,0.06);}
.check-item:last-child{border-bottom:none;}
.check-icon{width:28px;height:28px;border-radius:50%;background:rgba(255,255,255,0.07);display:flex;align-items:center;justify-content:center;flex-shrink:0;}

/* Feature grid */
.feat-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
.feat-card{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:24px 20px;}
`;

// ─── TEMPLATES ────────────────────────────────────────────────────────────

/** FEED 01 — "SUA EMPRESA MERECE UM SITE ASSIM" (screenshot hero) */
function feed01(n) {
  return `<!DOCTYPE html><html><head><meta charset="UTF-8">
<style>${CSS_SHARED}</style></head><body>
<div class="ad ad-feed">

  <!-- Ambient glow -->
  <div style="position:absolute;inset:0;background:radial-gradient(ellipse 70% 50% at 50% 30%,${n.cor}0d 0%,transparent 65%);pointer-events:none;"></div>

  <!-- TOP BAR -->
  <div style="position:absolute;top:0;left:0;right:0;padding:40px 52px 0;display:flex;justify-content:space-between;align-items:center;z-index:10;">
    <img src="${LOGO}" style="height:18px;filter:brightness(0) invert(1);opacity:0.55;">
    <span style="font-size:9px;font-weight:900;letter-spacing:0.28em;color:${n.cor};background:${n.cor}18;padding:6px 14px;border-radius:4px;border:1px solid ${n.cor}30;">${n.label.toUpperCase()}</span>
  </div>

  <!-- BROWSER MOCKUP -->
  <div class="browser" style="position:absolute;top:96px;left:44px;right:44px;height:672px;">
    <div class="browser-bar">
      <div class="dot" style="background:#FF5F57;"></div>
      <div class="dot" style="background:#FEBC2E;"></div>
      <div class="dot" style="background:#28C840;"></div>
      <div class="url-bar"></div>
    </div>
    <div class="browser-screen" style="height:634px;">
      <img src="${n.shot}" style="height:634px;object-fit:cover;object-position:top;">
    </div>
  </div>

  <!-- RESULT BADGE -->
  <div style="position:absolute;top:742px;right:60px;background:#000;border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:14px 20px;text-align:center;">
    <div style="font-size:32px;font-weight:900;letter-spacing:-0.04em;color:${n.cor};">${n.metrica}</div>
    <div style="font-size:9px;font-weight:800;letter-spacing:0.18em;color:rgba(255,255,255,0.3);margin-top:2px;">${n.resultado.replace(n.metrica,'').trim().toUpperCase()}</div>
  </div>

  <!-- TEXT CONTENT -->
  <div style="position:absolute;bottom:0;left:0;right:0;padding:0 52px 52px;">
    <div style="height:1px;background:rgba(255,255,255,0.07);margin-bottom:36px;"></div>
    <div style="font-size:56px;font-weight:900;line-height:1.0;letter-spacing:-0.045em;color:#fff;margin-bottom:14px;">
      Sua empresa merece<br>um site assim.
    </div>
    <div style="font-size:15px;font-weight:500;color:rgba(255,255,255,0.36);line-height:1.55;margin-bottom:32px;">
      Receba uma demonstração personalizada sem compromisso.
    </div>
    <div class="wa-btn">${WA_SVG} Falar no WhatsApp</div>
  </div>

</div></body></html>`;
}

/** FEED 02 — "QUANTOS CLIENTES VOCÊ ESTÁ PERDENDO?" (autoridade + checklist) */
function feed02(n) {
  return `<!DOCTYPE html><html><head><meta charset="UTF-8">
<style>${CSS_SHARED}</style></head><body>
<div class="ad ad-feed">

  <!-- Header section -->
  <div style="position:absolute;top:0;left:0;right:0;padding:48px 52px 0;display:flex;justify-content:space-between;align-items:center;">
    <img src="${LOGO}" style="height:18px;filter:brightness(0) invert(1);opacity:0.55;">
    <span style="font-size:9px;font-weight:900;letter-spacing:0.28em;color:rgba(255,255,255,0.22);">@SETY.STUDIO</span>
  </div>

  <!-- HEADLINE SECTION -->
  <div style="position:absolute;top:110px;left:52px;right:52px;">
    <div style="display:inline-block;background:#FF2A2A;color:#fff;font-size:10px;font-weight:900;letter-spacing:0.24em;padding:7px 16px;border-radius:4px;margin-bottom:28px;">ATENÇÃO</div>
    <div style="font-size:62px;font-weight:900;line-height:0.98;letter-spacing:-0.048em;color:#fff;margin-bottom:24px;">
      Quantos clientes<br>você está<br>perdendo?
    </div>
    <div style="font-size:15px;font-weight:500;color:rgba(255,255,255,0.38);line-height:1.6;max-width:640px;">
      ${n.problema}
    </div>
  </div>

  <!-- SCREENSHOT (medium, offset) -->
  <div class="browser" style="position:absolute;top:460px;left:52px;right:52px;height:420px;opacity:0.85;">
    <div class="browser-bar">
      <div class="dot" style="background:#FF5F57;"></div>
      <div class="dot" style="background:#FEBC2E;"></div>
      <div class="dot" style="background:#28C840;"></div>
      <div class="url-bar"></div>
    </div>
    <div class="browser-screen" style="height:382px;">
      <img src="${n.shot}" style="height:382px;object-fit:cover;object-position:top;">
    </div>
  </div>

  <!-- FADE OVERLAY over screenshot bottom -->
  <div style="position:absolute;top:760px;left:0;right:0;height:120px;background:linear-gradient(to bottom,transparent,#050505);pointer-events:none;"></div>

  <!-- CHECKLIST -->
  <div style="position:absolute;bottom:160px;left:52px;right:52px;">
    ${n.checklist.map(item=>`
    <div class="check-item">
      <div class="check-icon">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="${n.cor}" stroke-width="3" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>
      </div>
      <span style="font-size:17px;font-weight:700;color:rgba(255,255,255,0.82);letter-spacing:-0.01em;">${item}</span>
    </div>`).join('')}
  </div>

  <!-- CTA -->
  <div style="position:absolute;bottom:0;left:0;right:0;padding:0 52px 52px;">
    <div class="wa-btn">${WA_SVG} Solicitar Demonstração</div>
  </div>

</div></body></html>`;
}

/** FEED 03 — "IMAGINE SUA EMPRESA..." (features + screenshot) */
function feed03(n) {
  return `<!DOCTYPE html><html><head><meta charset="UTF-8">
<style>${CSS_SHARED}</style></head><body>
<div class="ad ad-feed">

  <!-- Glow -->
  <div style="position:absolute;inset:0;background:radial-gradient(ellipse 100% 40% at 50% 100%,${n.cor}0a 0%,transparent 60%);pointer-events:none;"></div>

  <!-- TOP BAR -->
  <div style="position:absolute;top:0;left:0;right:0;padding:48px 52px 0;display:flex;justify-content:space-between;align-items:center;">
    <img src="${LOGO}" style="height:18px;filter:brightness(0) invert(1);opacity:0.55;">
    <span style="font-size:9px;font-weight:900;letter-spacing:0.28em;color:${n.cor};background:${n.cor}18;padding:6px 14px;border-radius:4px;border:1px solid ${n.cor}28;">${n.label.toUpperCase()}</span>
  </div>

  <!-- HEADLINE -->
  <div style="position:absolute;top:114px;left:52px;right:52px;">
    <div style="font-size:54px;font-weight:900;line-height:1.0;letter-spacing:-0.045em;color:#fff;margin-bottom:12px;">
      Imagine sua empresa<br>com uma presença<br><span style="color:${n.cor};">digital profissional.</span>
    </div>
    <div style="width:56px;height:3px;background:${n.cor};border-radius:2px;margin-top:24px;"></div>
  </div>

  <!-- FEATURE GRID -->
  <div style="position:absolute;top:430px;left:52px;right:52px;">
    <div class="feat-grid">
      ${[
        ['💼','Design profissional','Interface que converte visitante em cliente'],
        ['📱','Mobile first','100% responsivo em qualquer dispositivo'],
        ['⚡','Carregamento rápido','Score 95+ no Lighthouse'],
        ['🎯','Focado em conversão','Cada elemento guia o usuário ao CTA'],
      ].map(([ic,t,d])=>`
      <div class="feat-card">
        <div style="font-size:24px;margin-bottom:10px;">${ic}</div>
        <div style="font-size:16px;font-weight:800;color:#fff;letter-spacing:-0.02em;margin-bottom:6px;">${t}</div>
        <div style="font-size:12px;font-weight:500;color:rgba(255,255,255,0.32);line-height:1.5;">${d}</div>
      </div>`).join('')}
    </div>
  </div>

  <!-- SCREENSHOT STRIP -->
  <div class="browser" style="position:absolute;top:770px;left:52px;right:52px;height:340px;">
    <div class="browser-bar">
      <div class="dot" style="background:#FF5F57;"></div>
      <div class="dot" style="background:#FEBC2E;"></div>
      <div class="dot" style="background:#28C840;"></div>
      <div class="url-bar"></div>
    </div>
    <div class="browser-screen" style="height:302px;">
      <img src="${n.shot}" style="height:302px;object-fit:cover;object-position:top;">
    </div>
  </div>

  <!-- CTA -->
  <div style="position:absolute;bottom:0;left:0;right:0;padding:0 52px 52px;">
    <div class="wa-btn">${WA_SVG} Receber Demonstração</div>
  </div>

</div></body></html>`;
}

/** STORY 01 — Screenshot full-screen + overlay CTA */
function story01(n) {
  return `<!DOCTYPE html><html><head><meta charset="UTF-8">
<style>${CSS_SHARED}</style></head><body>
<div class="ad ad-story">

  <!-- BACKGROUND: screenshot fill -->
  <div style="position:absolute;inset:0;overflow:hidden;">
    <img src="${n.shot}" style="width:100%;height:100%;object-fit:cover;object-position:top center;filter:brightness(0.45) saturate(1.1);">
  </div>

  <!-- GRADIENT OVERLAY -->
  <div style="position:absolute;inset:0;background:linear-gradient(to bottom,rgba(0,0,0,0.5) 0%,rgba(0,0,0,0.1) 30%,rgba(0,0,0,0.1) 55%,rgba(0,0,0,0.85) 78%,rgba(0,0,0,0.97) 100%);"></div>

  <!-- TOP LOGO -->
  <div style="position:absolute;top:0;left:0;right:0;padding:52px 52px 0;display:flex;justify-content:space-between;align-items:center;z-index:10;">
    <img src="${LOGO}" style="height:22px;filter:brightness(0) invert(1);">
    <span style="font-size:9px;font-weight:900;letter-spacing:0.28em;color:rgba(255,255,255,0.5);">@SETY.STUDIO</span>
  </div>

  <!-- CENTER MESSAGE -->
  <div style="position:absolute;top:50%;left:52px;right:52px;transform:translateY(-80%);text-align:center;">
    <div style="display:inline-block;background:${n.cor};color:#000;font-size:10px;font-weight:900;letter-spacing:0.2em;padding:8px 18px;border-radius:4px;margin-bottom:28px;">${n.label.toUpperCase()}</div>
    <div style="font-size:68px;font-weight:900;line-height:1.0;letter-spacing:-0.05em;color:#fff;text-align:left;">
      Sua empresa<br>merece um<br>site nesse nível.
    </div>
  </div>

  <!-- BOTTOM CTA -->
  <div style="position:absolute;bottom:0;left:0;right:0;padding:0 52px 72px;">
    <div style="font-size:14px;font-weight:600;color:rgba(255,255,255,0.38);text-align:center;letter-spacing:0.08em;margin-bottom:20px;">
      ARRASTE PARA CIMA PARA FALAR CONOSCO
    </div>
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px;">
      <div style="flex:1;height:1px;background:rgba(255,255,255,0.12);"></div>
      <span style="font-size:10px;font-weight:700;letter-spacing:0.16em;color:rgba(255,255,255,0.25);">OU</span>
      <div style="flex:1;height:1px;background:rgba(255,255,255,0.12);"></div>
    </div>
    <div class="wa-btn">${WA_SVG} Falar no WhatsApp</div>
  </div>

</div></body></html>`;
}

/** STORY 02 — Concorrente + Desktop + Mobile */
function story02(n) {
  return `<!DOCTYPE html><html><head><meta charset="UTF-8">
<style>${CSS_SHARED}</style></head><body>
<div class="ad ad-story">

  <!-- Glow -->
  <div style="position:absolute;inset:0;background:radial-gradient(ellipse 80% 40% at 50% 0%,${n.cor}0a 0%,transparent 55%);pointer-events:none;"></div>

  <!-- TOP -->
  <div style="position:absolute;top:0;left:0;right:0;padding:52px 52px 0;display:flex;justify-content:space-between;align-items:center;">
    <img src="${LOGO}" style="height:20px;filter:brightness(0) invert(1);opacity:0.65;">
    <span style="font-size:9px;font-weight:900;letter-spacing:0.28em;color:rgba(255,255,255,0.22);">@SETY.STUDIO</span>
  </div>

  <!-- HEADLINE BLOCK -->
  <div style="position:absolute;top:124px;left:52px;right:52px;">
    <div style="font-size:9px;font-weight:900;letter-spacing:0.32em;color:#FF2A2A;margin-bottom:20px;">VOCÊ SABIA?</div>
    <div style="font-size:62px;font-weight:900;line-height:0.98;letter-spacing:-0.048em;color:#fff;margin-bottom:20px;">
      Seu concorrente<br>já transmite mais<br>confiança online?
    </div>
    <div style="height:3px;width:56px;background:${n.cor};border-radius:2px;margin-bottom:24px;"></div>
    <div style="font-size:16px;font-weight:500;color:rgba(255,255,255,0.4);line-height:1.6;">
      ${n.problema}
    </div>
  </div>

  <!-- DESKTOP SCREENSHOT -->
  <div class="browser" style="position:absolute;top:560px;left:52px;right:52px;height:480px;">
    <div class="browser-bar">
      <div class="dot" style="background:#FF5F57;"></div>
      <div class="dot" style="background:#FEBC2E;"></div>
      <div class="dot" style="background:#28C840;"></div>
      <div class="url-bar"></div>
      <span style="font-size:10px;font-weight:700;letter-spacing:0.1em;color:rgba(255,255,255,0.22);">DESKTOP</span>
    </div>
    <div class="browser-screen" style="height:442px;">
      <img src="${n.shot}" style="height:442px;object-fit:cover;object-position:top;">
    </div>
  </div>

  <!-- MOBILE + METRIC -->
  <div style="position:absolute;top:1100px;left:52px;right:52px;display:flex;align-items:center;gap:40px;">
    <div class="phone-outer">
      <img src="${n.shot}">
    </div>
    <div style="flex:1;">
      <div style="font-size:11px;font-weight:800;letter-spacing:0.22em;color:rgba(255,255,255,0.28);margin-bottom:16px;">RESULTADO REAL</div>
      <div style="font-size:72px;font-weight:900;letter-spacing:-0.05em;color:${n.cor};line-height:0.9;margin-bottom:10px;">${n.metrica}</div>
      <div style="font-size:15px;font-weight:600;color:rgba(255,255,255,0.5);line-height:1.5;">${n.resultado.replace(n.metrica,'').trim()}</div>
    </div>
  </div>

  <!-- CTA -->
  <div style="position:absolute;bottom:0;left:0;right:0;padding:0 52px 72px;">
    <div class="wa-btn">${WA_SVG} Ver Demonstração</div>
  </div>

</div></body></html>`;
}

/** STORY 03 — "Demonstrações personalizadas" (offer) */
function story03(n) {
  return `<!DOCTYPE html><html><head><meta charset="UTF-8">
<style>${CSS_SHARED}</style></head><body>
<div class="ad ad-story">

  <!-- Grid texture subtle -->
  <div style="position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px);background-size:80px 80px;opacity:0.018;pointer-events:none;"></div>

  <!-- Glow -->
  <div style="position:absolute;inset:0;background:radial-gradient(ellipse 90% 50% at 50% 50%,${n.cor}08 0%,transparent 65%);pointer-events:none;"></div>

  <!-- TOP -->
  <div style="position:absolute;top:0;left:0;right:0;padding:52px 52px 0;display:flex;justify-content:space-between;align-items:center;">
    <img src="${LOGO}" style="height:20px;filter:brightness(0) invert(1);opacity:0.65;">
    <span style="font-size:9px;font-weight:900;letter-spacing:0.28em;color:rgba(255,255,255,0.22);">@SETY.STUDIO</span>
  </div>

  <!-- MAIN CONTENT — centered vertically -->
  <div style="position:absolute;top:0;left:52px;right:52px;bottom:0;display:flex;flex-direction:column;justify-content:center;gap:0;">

    <!-- Eyebrow -->
    <div style="display:inline-block;background:#FF2A2A;color:#fff;font-size:10px;font-weight:900;letter-spacing:0.22em;padding:8px 18px;border-radius:4px;margin-bottom:36px;align-self:flex-start;">OFERTA ESPECIAL</div>

    <!-- Big headline -->
    <div style="font-size:72px;font-weight:900;line-height:0.97;letter-spacing:-0.05em;color:#fff;margin-bottom:28px;">
      Estamos criando<br>demonstrações<br><span style="color:${n.cor};">personalizadas.</span>
    </div>

    <!-- Rule -->
    <div style="height:3px;width:56px;background:${n.cor};border-radius:2px;margin-bottom:32px;"></div>

    <!-- Subtext -->
    <div style="font-size:22px;font-weight:600;color:rgba(255,255,255,0.55);line-height:1.5;margin-bottom:48px;">
      Veja sua empresa com um<br>site profissional antes<br>de tomar qualquer decisão.
    </div>

    <!-- Screenshot strip -->
    <div class="browser" style="height:380px;">
      <div class="browser-bar">
        <div class="dot" style="background:#FF5F57;"></div>
        <div class="dot" style="background:#FEBC2E;"></div>
        <div class="dot" style="background:#28C840;"></div>
        <div class="url-bar"></div>
      </div>
      <div class="browser-screen" style="height:342px;">
        <img src="${n.shot}" style="height:342px;object-fit:cover;object-position:top;">
      </div>
    </div>

    <!-- Social proof -->
    <div style="margin-top:32px;padding:24px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.07);border-radius:8px;">
      <div style="display:flex;align-items:center;gap:16px;">
        <div style="font-size:32px;font-weight:900;letter-spacing:-0.04em;color:${n.cor};">${n.metrica}</div>
        <div>
          <div style="font-size:13px;font-weight:700;color:#fff;">${n.name}</div>
          <div style="font-size:11px;font-weight:500;color:rgba(255,255,255,0.3);margin-top:2px;">${n.resultado}</div>
        </div>
      </div>
    </div>

  </div>

  <!-- CTA -->
  <div style="position:absolute;bottom:0;left:0;right:0;padding:0 52px 72px;">
    <div class="wa-btn">${WA_SVG} Solicitar Demonstração</div>
  </div>

</div></body></html>`;
}

// ─── MAPA DE CRIATIVOS ────────────────────────────────────────────────────
const FEED_FNS    = [feed01, feed02, feed03];
const STORY_FNS   = [story01, story02, story03];

// ─── GERAR HTMLs E RENDERIZAR ─────────────────────────────────────────────
console.log('Iniciando geração dos criativos Meta Ads...\n');

const browser = await chromium.launch();

for (const n of NICHOS) {
  const feedDir  = path.join(__dirname, n.slug, 'feed');
  const storyDir = path.join(__dirname, n.slug, 'stories');
  fs.mkdirSync(feedDir,  { recursive: true });
  fs.mkdirSync(storyDir, { recursive: true });

  // ── Feed (1080×1350) ──
  for (let i = 0; i < FEED_FNS.length; i++) {
    const html    = FEED_FNS[i](n);
    const htmlPath = path.join(feedDir, `feed-0${i+1}.html`);
    const pngPath  = path.join(feedDir, `feed-0${i+1}.png`);
    fs.writeFileSync(htmlPath, html);

    const page = await browser.newPage();
    await page.setViewportSize({ width: 1080, height: 1350 });
    await page.goto(`file:///${htmlPath.replace(/\\/g,'/')}`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);
    const buf = await page.screenshot({ clip: { x:0, y:0, width:1080, height:1350 } });
    fs.writeFileSync(pngPath, buf);
    await page.close();
    console.log(`✓ ${n.slug}/feed/feed-0${i+1}.png`);
  }

  // ── Stories (1080×1920) ──
  for (let i = 0; i < STORY_FNS.length; i++) {
    const html    = STORY_FNS[i](n);
    const htmlPath = path.join(storyDir, `story-0${i+1}.html`);
    const pngPath  = path.join(storyDir, `story-0${i+1}.png`);
    fs.writeFileSync(htmlPath, html);

    const page = await browser.newPage();
    await page.setViewportSize({ width: 1080, height: 1920 });
    await page.goto(`file:///${htmlPath.replace(/\\/g,'/')}`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);
    const buf = await page.screenshot({ clip: { x:0, y:0, width:1080, height:1920 } });
    fs.writeFileSync(pngPath, buf);
    await page.close();
    console.log(`✓ ${n.slug}/stories/story-0${i+1}.png`);
  }

  console.log(`\n── ${n.label}: 6 criativos prontos ──\n`);
}

await browser.close();

console.log('✅ 18 criativos gerados em /social-media/ads/');
console.log('\nPastas:');
for (const n of NICHOS) {
  console.log(`  ${n.slug}/feed/  (feed-01 a feed-03)`);
  console.log(`  ${n.slug}/stories/  (story-01 a story-03)`);
}
