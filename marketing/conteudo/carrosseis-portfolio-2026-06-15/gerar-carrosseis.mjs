/**
 * SETY STUDIO — Gerador de Carrosséis Premium
 * Gera carrossel.html para cada projeto + carrosséis institucionais
 * Design: Montserrat 900 · Preto/Branco/Vermelho · Estilo editorial premium
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE     = __dirname;
const PUBLIC   = 'C:/Users/seven/MazyOS/saidas/sety-studio-web/public';
const LOGO     = `file:///${PUBLIC}/logo.png`;
const PHOTO    = 'file:///C:/Users/seven/Downloads/SETY%20STUDIO/WhatsApp%20Image%202026-06-14%20at%2014.17.06.jpeg';
const SHOT     = (n) => `file:///${PUBLIC}/portfolio/${n}/screenshots/thumb.png`;

// ─── PALETA & FONTE ────────────────────────────────────────────────────────
const CSS_BASE = `
@import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,900&display=swap');
*{margin:0;padding:0;box-sizing:border-box;}
body{background:#000;}
.slide{
  width:1080px;height:1350px;
  position:relative;overflow:hidden;
  font-family:'Montserrat',sans-serif;
  display:block;
}
.s-black{background:#000;color:#fff;}
.s-dark{background:#111111;color:#fff;}
.s-card{background:#1A1A1A;color:#fff;}
.s-red{background:#FF2A2A;color:#fff;}

/* HEADER */
.hdr{position:absolute;top:52px;left:68px;right:68px;display:flex;align-items:center;justify-content:space-between;z-index:10;}
.hdr img{height:22px;width:auto;object-fit:contain;filter:brightness(0) invert(1);}
.hdr-right{display:flex;align-items:center;gap:16px;}
.slide-num{font-size:12px;font-weight:600;letter-spacing:0.22em;color:rgba(255,255,255,0.3);}
.handle{font-size:12px;font-weight:700;letter-spacing:0.1em;color:rgba(255,255,255,0.2);}

/* FOOTER */
.ftr{position:absolute;bottom:48px;left:68px;right:68px;display:flex;align-items:center;justify-content:space-between;z-index:10;}
.ftr-line{height:1px;flex:1;background:rgba(255,255,255,0.08);}
.ftr-tag{font-size:10px;font-weight:700;letter-spacing:0.26em;color:rgba(255,255,255,0.18);}

/* EYEBROW */
.eyebrow{font-size:11px;font-weight:800;letter-spacing:0.32em;margin-bottom:20px;display:inline-block;}
.accent-line{height:3px;width:56px;margin-bottom:28px;border-radius:2px;}

/* GHOST BG TEXT */
.ghost{position:absolute;font-size:520px;font-weight:900;line-height:1;opacity:0.03;z-index:0;pointer-events:none;color:#fff;}

/* SCREENSHOT FRAME */
.frame{
  background:#0a0a0a;border-radius:10px;
  border:1px solid rgba(255,255,255,0.1);
  overflow:hidden;
  box-shadow:0 24px 80px rgba(0,0,0,0.8);
}
.frame-bar{height:36px;background:#1a1a1a;display:flex;align-items:center;gap:6px;padding:0 14px;flex-shrink:0;}
.dot{width:10px;height:10px;border-radius:50%;}
.frame-url{flex:1;height:20px;background:rgba(255,255,255,0.06);border-radius:4px;margin:0 12px;}
.frame-screen{overflow:hidden;}
.frame-screen img{width:100%;display:block;}

/* PHONE MOCKUP */
.phone-wrap{position:relative;display:inline-block;}
.phone{width:220px;height:440px;border:7px solid #2a2a2a;border-radius:36px;overflow:hidden;background:#000;position:relative;box-shadow:0 32px 80px rgba(0,0,0,0.9),inset 0 0 0 1px rgba(255,255,255,0.08);}
.phone-notch{position:absolute;top:0;left:50%;transform:translateX(-50%);width:70px;height:20px;background:#2a2a2a;border-radius:0 0 14px 14px;z-index:10;}
.phone-screen{width:100%;height:100%;overflow:hidden;}
.phone-screen img{width:300%;margin-left:0;transform-origin:top left;transform:scale(0.333);}

/* METRIC GRID */
.metric-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;}
.metric-card{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.07);border-radius:6px;padding:36px 32px;}
.metric-val{font-size:52px;font-weight:900;line-height:1;letter-spacing:-0.04em;margin-bottom:10px;}
.metric-label{font-size:11px;font-weight:700;letter-spacing:0.22em;color:rgba(255,255,255,0.35);}
.metric-desc{font-size:13px;font-weight:500;color:rgba(255,255,255,0.45);margin-top:6px;line-height:1.5;}

/* STRATEGY ITEMS */
.strat-list{display:flex;flex-direction:column;gap:32px;margin-top:40px;}
.strat-item{display:flex;align-items:flex-start;gap:24px;padding-bottom:32px;border-bottom:1px solid rgba(255,255,255,0.06);}
.strat-item:last-child{border-bottom:none;}
.strat-num{font-size:13px;font-weight:800;letter-spacing:0.14em;flex-shrink:0;margin-top:4px;}
.strat-text{font-size:24px;font-weight:700;line-height:1.3;letter-spacing:-0.02em;}
.strat-sub{font-size:14px;font-weight:500;color:rgba(255,255,255,0.38);margin-top:6px;line-height:1.5;}

/* CTA SLIDE */
.cta-center{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:80px;}
.cta-logo{height:30px;width:auto;object-fit:contain;filter:brightness(0) invert(1);margin-bottom:60px;}
.cta-title{font-size:58px;font-weight:900;line-height:1.0;letter-spacing:-0.04em;margin-bottom:32px;}
.cta-sub{font-size:20px;font-weight:600;color:rgba(255,255,255,0.75);margin-bottom:56px;line-height:1.5;}
.cta-btn{display:inline-flex;align-items:center;gap:10px;background:#000;color:#fff;font-size:16px;font-weight:800;letter-spacing:0.1em;padding:20px 44px;border-radius:4px;}
.cta-btn-red{background:#fff;color:#FF2A2A;}
.cta-handle{font-size:13px;font-weight:700;letter-spacing:0.18em;color:rgba(255,255,255,0.5);margin-top:32px;}
`;

// ─── HELPERS ──────────────────────────────────────────────────────────────
const hdr = (n, t=8) => `
<div class="hdr">
  <img src="${LOGO}" alt="Sety Studio">
  <div class="hdr-right">
    <span class="handle">@SETY.STUDIO</span>
    <span class="slide-num">${String(n).padStart(2,'0')} / ${String(t).padStart(2,'0')}</span>
  </div>
</div>`;

const ftr = (label='SETY STUDIO') => `
<div class="ftr">
  <span class="ftr-tag">SETYSTUDIO.COM.BR</span>
  <div class="ftr-line" style="margin:0 20px;"></div>
  <span class="ftr-tag">${label}</span>
</div>`;

// ─── TEMPLATE POR NICHO ───────────────────────────────────────────────────
function buildPortfolioCarrossel(p) {
  const { cor, nicho, name, headline, desafio, desafio_context,
          strat, destaques, resultado_big, resultado_sub, screenshot } = p;

  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8">
<style>${CSS_BASE}</style>
</head><body>

<!-- SLIDE 01 — CAPA -->
<div class="slide s-black" id="s1">
  ${hdr(1)}
  <div style="position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;padding:68px 68px 120px;">
    <span class="eyebrow" style="color:${cor};">${nicho.toUpperCase()} · PORTFÓLIO</span>
    <div class="accent-line" style="background:${cor};"></div>
    <h1 style="font-size:72px;font-weight:900;line-height:1.0;letter-spacing:-0.045em;color:#fff;max-width:820px;margin-bottom:48px;">${headline}</h1>
    <div style="display:flex;align-items:center;gap:20px;">
      <div style="width:48px;height:2px;background:${cor};border-radius:1px;"></div>
      <span style="font-size:14px;font-weight:700;letter-spacing:0.14em;color:rgba(255,255,255,0.4);">${name.toUpperCase()}</span>
    </div>
  </div>
  ${ftr(nicho.toUpperCase())}
</div>

<!-- SLIDE 02 — DESAFIO -->
<div class="slide s-card" id="s2">
  ${hdr(2)}
  <span class="ghost" style="right:-60px;top:-60px;">×</span>
  <div style="position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;padding:68px 68px 120px;">
    <span class="eyebrow" style="color:${cor};">O DESAFIO</span>
    <div class="accent-line" style="background:${cor};"></div>
    <h2 style="font-size:60px;font-weight:900;line-height:1.08;letter-spacing:-0.04em;color:#fff;margin-bottom:32px;">${desafio}</h2>
    <p style="font-size:18px;font-weight:500;color:rgba(255,255,255,0.42);line-height:1.65;max-width:680px;">${desafio_context}</p>
  </div>
  ${ftr(nicho.toUpperCase())}
</div>

<!-- SLIDE 03 — ESTRATÉGIA -->
<div class="slide s-black" id="s3">
  ${hdr(3)}
  <div style="position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;padding:68px 68px 120px;">
    <span class="eyebrow" style="color:${cor};">A ESTRATÉGIA</span>
    <div class="accent-line" style="background:${cor};"></div>
    <div class="strat-list">
      ${strat.map((s,i)=>`
      <div class="strat-item">
        <span class="strat-num" style="color:${cor};">0${i+1}</span>
        <div>
          <div class="strat-text">${s.title}</div>
          <div class="strat-sub">${s.desc}</div>
        </div>
      </div>`).join('')}
    </div>
  </div>
  ${ftr(nicho.toUpperCase())}
</div>

<!-- SLIDE 04 — DESIGN -->
<div class="slide s-card" id="s4">
  ${hdr(4)}
  <div style="position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;padding:68px 68px 120px;gap:36px;">
    <div>
      <span class="eyebrow" style="color:${cor};">O DESIGN</span>
      <div class="accent-line" style="background:${cor};margin-top:16px;"></div>
      <h2 style="font-size:38px;font-weight:900;letter-spacing:-0.03em;color:#fff;">Interface que converte.</h2>
    </div>
    <div class="frame">
      <div class="frame-bar">
        <div class="dot" style="background:#FF5F57;"></div>
        <div class="dot" style="background:#FEBC2E;"></div>
        <div class="dot" style="background:#28C840;"></div>
        <div class="frame-url"></div>
      </div>
      <div class="frame-screen" style="height:600px;overflow:hidden;">
        <img src="${screenshot}" style="width:100%;display:block;">
      </div>
    </div>
  </div>
  ${ftr(nicho.toUpperCase())}
</div>

<!-- SLIDE 05 — MOBILE -->
<div class="slide s-black" id="s5">
  ${hdr(5)}
  <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:68px 68px 120px;gap:40px;">
    <div style="align-self:flex-start;">
      <span class="eyebrow" style="color:${cor};">EXPERIÊNCIA MOBILE</span>
      <div class="accent-line" style="background:${cor};margin-top:16px;"></div>
      <h2 style="font-size:46px;font-weight:900;letter-spacing:-0.04em;color:#fff;line-height:1.05;">Mobile first.<br>Sempre.</h2>
    </div>
    <div style="display:flex;align-items:flex-start;justify-content:center;gap:40px;width:100%;">
      <div class="phone">
        <div class="phone-notch"></div>
        <div class="phone-screen"><img src="${screenshot}"></div>
      </div>
      <div style="flex:1;display:flex;flex-direction:column;gap:20px;padding-top:40px;">
        ${[
          ['100%','Responsivo'],
          ['< 1.5s','Tempo de carregamento'],
          ['95+','Score Lighthouse'],
        ].map(([v,l])=>`
        <div style="border-left:3px solid ${cor};padding-left:20px;">
          <div style="font-size:36px;font-weight:900;letter-spacing:-0.03em;color:#fff;">${v}</div>
          <div style="font-size:11px;font-weight:700;letter-spacing:0.18em;color:rgba(255,255,255,0.3);margin-top:4px;">${l.toUpperCase()}</div>
        </div>`).join('')}
      </div>
    </div>
  </div>
  ${ftr(nicho.toUpperCase())}
</div>

<!-- SLIDE 06 — DESTAQUES -->
<div class="slide s-card" id="s6">
  ${hdr(6)}
  <div style="position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;padding:68px 68px 120px;gap:32px;">
    <div>
      <span class="eyebrow" style="color:${cor};">DESTAQUES DO PROJETO</span>
      <div class="accent-line" style="background:${cor};margin-top:16px;"></div>
    </div>
    <div class="metric-grid">
      ${destaques.map(d=>`
      <div class="metric-card">
        <div class="metric-val" style="color:${cor};">${d.val}</div>
        <div class="metric-label">${d.label.toUpperCase()}</div>
        <div class="metric-desc">${d.desc}</div>
      </div>`).join('')}
    </div>
  </div>
  ${ftr(nicho.toUpperCase())}
</div>

<!-- SLIDE 07 — RESULTADO FINAL -->
<div class="slide s-black" id="s7">
  ${hdr(7)}
  <div style="position:absolute;inset:0;background:url('${screenshot}') center/cover no-repeat;opacity:0.15;"></div>
  <div style="position:absolute;inset:0;background:linear-gradient(to bottom,rgba(0,0,0,0.6) 0%,rgba(0,0,0,0.92) 60%,#000 100%);"></div>
  <div style="position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;padding:68px 68px 120px;">
    <span class="eyebrow" style="color:${cor};">RESULTADO FINAL</span>
    <div class="accent-line" style="background:${cor};margin-top:16px;"></div>
    <div style="font-size:140px;font-weight:900;line-height:0.85;letter-spacing:-0.06em;color:${cor};margin-bottom:16px;">${resultado_big}</div>
    <div style="font-size:28px;font-weight:700;color:#fff;letter-spacing:-0.02em;margin-bottom:16px;">${resultado_sub}</div>
    <p style="font-size:16px;font-weight:500;color:rgba(255,255,255,0.35);max-width:600px;line-height:1.6;">Resultado real. Cliente real. Estrutura construída pela Sety Studio.</p>
  </div>
  ${ftr(nicho.toUpperCase())}
</div>

<!-- SLIDE 08 — CTA -->
<div class="slide s-red" id="s8">
  <div class="cta-center">
    <img class="cta-logo" src="${LOGO}" alt="Sety Studio">
    <h2 class="cta-title">Quer um projeto nesse nível para sua empresa?</h2>
    <p class="cta-sub">Do briefing à entrega em dias.<br>Design premium. Resultado real.</p>
    <div class="cta-btn cta-btn-red" style="gap:12px;">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.12.553 4.11 1.52 5.838L0 24l6.336-1.648A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.6c-1.9 0-3.68-.511-5.21-1.402l-.374-.222-3.76.977.998-3.658-.243-.386A9.576 9.576 0 012.4 12C2.4 6.7 6.7 2.4 12 2.4c5.3 0 9.6 4.3 9.6 9.6 0 5.3-4.3 9.6-9.6 9.6z"/></svg>
      Falar com a Sety Studio
    </div>
    <div class="cta-handle">(19) 98809-0110 · @SETY.STUDIO</div>
  </div>
</div>

</body></html>`;
}

// ─── DADOS DOS PROJETOS ───────────────────────────────────────────────────
const projetos = [
  {
    slug: 'odontologia',
    nicho: 'Odontologia',
    name: 'Prime Odonto',
    cor: '#00B67A',
    headline: 'Como estruturamos a captação digital de uma clínica odontológica do zero ao resultado.',
    desafio: '12 anos no mercado. 0% de pacientes vindo do digital.',
    desafio_context: 'Clínica consolidada, ótima reputação, mas agenda subutilizada em 40% nos meses de baixa temporada. Sem presença digital real. Sem estratégia de captação.',
    strat: [
      { title: 'Site institucional premium', desc: 'Foco em conversão, não em estética. Copy orientada ao paciente ideal.' },
      { title: 'Landing pages por procedimento', desc: 'Implante, facetas, harmonização — cada um com sua própria página e oferta.' },
      { title: 'Funil Meta + Google Ads', desc: 'Campanhas segmentadas por intenção. Captura de demanda ativa no Google.' },
      { title: 'SEO local estruturado', desc: 'Schema.org, GMB otimizado, palavras-chave de alto valor em São Paulo.' },
    ],
    destaques: [
      { val: '+340%', label: 'Agendamentos', desc: 'em 60 dias de operação' },
      { val: '-68%', label: 'Custo por Lead', desc: 'em relação às ações anteriores' },
      { val: '8,4×', label: 'ROAS Médio', desc: 'retorno sobre investimento em anúncios' },
      { val: '60', label: 'Dias p/ resultado', desc: 'do início ao maior mês da história' },
    ],
    resultado_big: '+340%',
    resultado_sub: 'em agendamentos. 60 dias. Maior mês da história da clínica.',
    screenshot: SHOT('odontologia'),
  },
  {
    slug: 'advocacia',
    nicho: 'Advocacia',
    name: 'Valença & Associados',
    cor: '#C9A73D',
    headline: 'Como posicionamos um escritório de advocacia para atrair contratos maiores.',
    desafio: 'Excelente reputação. Presença digital que não refletia o nível do serviço.',
    desafio_context: '15 anos de mercado, reconhecido entre pares, mas com site desatualizado que atraía clientes abaixo do potencial. Ticket médio estagnado há 3 anos.',
    strat: [
      { title: 'Rebranding completo', desc: 'Identidade visual premium que comunica autoridade sem precisar de explicação.' },
      { title: 'Site institucional com conteúdo de autoridade', desc: 'Direito empresarial e tributário posicionados para decisores de alto nível.' },
      { title: 'SEO para termos de alto valor', desc: '+420% de tráfego orgânico em 3 meses com foco em intenção de contratação.' },
      { title: 'LinkedIn Ads para decisores', desc: 'Campanhas segmentadas por cargo e setor para C-level e sócios.' },
    ],
    destaques: [
      { val: '+80%', label: 'Ticket Médio', desc: 'nos contratos após reposicionamento' },
      { val: '4×', label: 'Empresas maiores', desc: 'tamanho médio dos novos contratos' },
      { val: '+420%', label: 'SEO', desc: 'crescimento em tráfego orgânico qualificado' },
      { val: '3 meses', label: 'Para resultado', desc: 'do briefing ao primeiro contrato premium' },
    ],
    resultado_big: '+80%',
    resultado_sub: 'no ticket médio. Contratos com empresas 4× maiores em 3 meses.',
    screenshot: SHOT('advocacia'),
  },
  {
    slug: 'energia-solar',
    nicho: 'Energia Solar',
    name: 'SolarMax Energia',
    cor: '#22C55E',
    headline: 'Como geramos 85 projetos fechados em 4 meses para uma instaladora solar.',
    desafio: 'Nova no mercado. 100% dependente de indicações. Sem presença digital.',
    desafio_context: 'Empresa nova, produto competitivo, mas sem histórico comprovado para competir com players estabelecidos. Tempo médio de resposta ao lead: 2 horas.',
    strat: [
      { title: 'Site com calculadora de economia', desc: 'Lead já chega qualificado sabendo quanto vai economizar. Conversão mais rápida.' },
      { title: 'Landing pages por segmento', desc: 'Residencial, comercial e rural — cada um com argumento específico e CTA direto.' },
      { title: 'Google Search capturando demanda ativa', desc: 'Campanhas para quem já está pesquisando energia solar na região.' },
      { title: 'Automação de qualificação via WhatsApp', desc: 'Bot qualifica o lead e distribui para o consultor certo em 3 minutos.' },
    ],
    destaques: [
      { val: '85', label: 'Projetos fechados', desc: 'em 4 meses de operação digital' },
      { val: 'R$28k', label: 'Ticket médio', desc: 'por projeto instalado' },
      { val: '3 min', label: 'Resposta ao Lead', desc: 'antes: 2 horas. Agora: 3 minutos.' },
      { val: '22%', label: 'Conversão', desc: 'de lead qualificado para projeto fechado' },
    ],
    resultado_big: '85',
    resultado_sub: 'projetos fechados. 4 meses. R$28k de ticket médio.',
    screenshot: SHOT('energia-solar'),
  },
  {
    slug: 'imobiliaria',
    nicho: 'Imobiliária',
    name: 'Prime Select Imóveis',
    cor: '#8B9EFF',
    headline: 'Como triplicamos os leads qualificados de uma imobiliária premium com custo 45% menor.',
    desafio: 'Portfólio premium. 8% de conversão de lead para visita.',
    desafio_context: 'Corretores desperdiçando tempo com leads sem perfil. Custo por lead alto. Taxa de conversão de lead para visita de apenas 8% — abaixo do mercado.',
    strat: [
      { title: 'Landing pages por empreendimento', desc: 'Cada imóvel com sua página específica, copy e CTA direcionados.' },
      { title: 'Bot de qualificação no WhatsApp', desc: 'Filtra renda, intenção e prazo antes de encaminhar ao corretor.' },
      { title: 'Campanhas segmentadas por perfil', desc: 'Meta e Google com públicos por faixa de renda, localização e interesse.' },
      { title: 'Sistema de distribuição automática', desc: 'Lead qualificado → corretor certo → em menos de 30 segundos.' },
    ],
    destaques: [
      { val: '3×', label: 'Leads Qualificados', desc: 'volume triplicado com mesmo investimento' },
      { val: '-45%', label: 'Custo por Lead', desc: 'queda no custo de aquisição' },
      { val: '31%', label: 'Conversão Lead→Visita', desc: 'antes estava em 8%' },
      { val: '200+', label: 'Leads/semana', desc: 'qualificados automaticamente pelo bot' },
    ],
    resultado_big: '3×',
    resultado_sub: 'mais leads qualificados. Custo 45% menor. Taxa de visita em 31%.',
    screenshot: SHOT('imobiliaria'),
  },
  {
    slug: 'estetica',
    nicho: 'Estética',
    name: 'Aura Estética Premium',
    cor: '#C9A96E',
    headline: 'Como reposicionamos uma clínica de estética e triplicamos o ticket médio.',
    desafio: 'Qualidade técnica alta. Comunicação visual que não justificava o preço.',
    desafio_context: 'Clínica com ótimos resultados, mas posicionamento visual amador. Dificuldade em cobrar mais mesmo com serviço superior. Agenda cheia de baixo ticket.',
    strat: [
      { title: 'Rebranding premium completo', desc: 'Nova identidade visual, nome de marca e posicionamento para alto padrão.' },
      { title: 'Site focado em desejo e autoridade', desc: 'Fotografia editorial, copy aspiracional, experiência de navegação premium.' },
      { title: 'Campanha de lançamento', desc: 'Influenciadoras do segmento premium de Brasília. Validação social imediata.' },
      { title: 'Funil de nutrição pós-consulta', desc: 'Sequência de e-mail e WhatsApp para aumentar LTV de cada paciente.' },
    ],
    destaques: [
      { val: 'R$280k', label: 'Receita', desc: 'nos primeiros 90 dias após reposicionamento' },
      { val: '3×', label: 'Ticket Médio', desc: 'triplicado com a nova identidade' },
      { val: '+120', label: 'Pacientes/mês', desc: 'novos pacientes no perfil ideal' },
      { val: '30 dias', label: 'Lista de Espera', desc: 'formada para harmonização facial' },
    ],
    resultado_big: 'R$280k',
    resultado_sub: 'em 90 dias. Ticket 3× maior. Lista de espera em 30 dias.',
    screenshot: SHOT('estetica'),
  },
  {
    slug: 'consorcio',
    nicho: 'Consórcio',
    name: 'Projeto Consórcio',
    cor: '#3B82F6',
    headline: 'Como construímos um funil digital que vendeu 180 cotas em 45 dias.',
    desafio: 'Produto competitivo. 50 leads por semana. 100% manual.',
    desafio_context: 'Administradora com equipe de 5 consultores limitada a 50 leads por semana. Captação dependente de indicações. Sem funil digital estruturado.',
    strat: [
      { title: 'Landing page com simulador de parcelas', desc: 'Lead simula, entende o produto e chega ao consultor já educado para fechar.' },
      { title: 'Sequência de automação educativa', desc: 'WhatsApp que explica consórcio vs. financiamento e quebra objeções automaticamente.' },
      { title: 'Campanhas de performance testadas', desc: 'Criativos em múltiplas variantes. Custo por lead otimizado semanalmente.' },
      { title: 'Distribuição automática para consultores', desc: 'Lead qualificado distribuído para o consultor disponível em segundos.' },
    ],
    destaques: [
      { val: '180', label: 'Cotas Vendidas', desc: 'em 45 dias de campanha ativa' },
      { val: '28%', label: 'Conversão', desc: 'de lead qualificado para venda' },
      { val: '150+', label: 'Leads/semana', desc: 'contra 50 antes do funil digital' },
      { val: '3×', label: 'Capacidade', desc: 'de atendimento sem aumentar equipe' },
    ],
    resultado_big: '180',
    resultado_sub: 'cotas vendidas em 45 dias. Recorde histórico da empresa.',
    screenshot: SHOT('consorcio'),
  },
];

// ─── CARROSSEL INSTITUCIONAL ───────────────────────────────────────────────
function buildInstitucional() {
  const cor = '#FF2A2A';
  const stats = [
    ['73%', 'das pessoas pesquisam online antes de contratar um serviço local'],
    ['87%', 'dos consumidores avaliam a credibilidade de uma empresa pelo site'],
    ['3 seg', 'é o tempo que você tem pra convencer alguém a ficar na sua página'],
    ['4×', 'mais leads por mês — média de nossos clientes após 90 dias'],
  ];
  const motivos = [
    ['Credibilidade imediata', 'Site profissional = empresa séria. Sem ele, você perde para concorrentes que têm.'],
    ['Captação 24 horas', 'Seu site trabalha enquanto você dorme. Lead chegando às 3h da manhã? Acontece todo dia.'],
    ['Redução do CAC', 'Funil digital bem estruturado reduz o custo de aquisição de clientes em 40-60%.'],
    ['Escalabilidade', 'Uma estrutura digital certa permite crescer sem contratar proporcionalmente.'],
  ];

  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8">
<style>${CSS_BASE}</style>
</head><body>

<!-- S1 — CAPA INSTITUCIONAL -->
<div class="slide s-black" id="s1">
  ${hdr(1)}
  <div style="position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;padding:68px 68px 120px;">
    <span class="eyebrow" style="color:${cor};">SETY STUDIO · 2026</span>
    <div class="accent-line" style="background:${cor};margin-top:20px;"></div>
    <h1 style="font-size:66px;font-weight:900;line-height:1.0;letter-spacing:-0.045em;color:#fff;margin-bottom:40px;">Por que empresas estão investindo em sites profissionais em 2026?</h1>
    <p style="font-size:18px;font-weight:500;color:rgba(255,255,255,0.38);line-height:1.6;max-width:600px;">A resposta que todo empreendedor precisa ler antes de tomar essa decisão.</p>
  </div>
  ${ftr('INSTITUCIONAL')}
</div>

<!-- S2 — A REALIDADE DO MERCADO -->
<div class="slide s-card" id="s2">
  ${hdr(2)}
  <span class="ghost" style="left:-80px;top:200px;font-size:400px;opacity:0.04;">%</span>
  <div style="position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;padding:68px 68px 120px;">
    <span class="eyebrow" style="color:${cor};">A REALIDADE</span>
    <div class="accent-line" style="background:${cor};margin-top:16px;"></div>
    <h2 style="font-size:52px;font-weight:900;line-height:1.05;letter-spacing:-0.04em;color:#fff;margin-bottom:48px;">O mercado mudou.<br>Seu site ainda é do passado?</h2>
    <div style="display:flex;flex-direction:column;gap:24px;">
      ${stats.map(([v,d])=>`
      <div style="display:flex;align-items:center;gap:24px;padding:20px 24px;background:rgba(255,255,255,0.04);border-radius:4px;border-left:3px solid ${cor};">
        <span style="font-size:36px;font-weight:900;color:${cor};letter-spacing:-0.03em;min-width:80px;">${v}</span>
        <span style="font-size:15px;font-weight:500;color:rgba(255,255,255,0.55);line-height:1.5;">${d}</span>
      </div>`).join('')}
    </div>
  </div>
  ${ftr('INSTITUCIONAL')}
</div>

<!-- S3 — O PROBLEMA -->
<div class="slide s-black" id="s3">
  ${hdr(3)}
  <div style="position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;padding:68px 68px 120px;">
    <span class="eyebrow" style="color:${cor};">O PROBLEMA</span>
    <div class="accent-line" style="background:${cor};margin-top:16px;"></div>
    <h2 style="font-size:60px;font-weight:900;line-height:1.0;letter-spacing:-0.04em;color:#fff;margin-bottom:32px;">Seu Instagram está bonito.<br><span style="color:rgba(255,255,255,0.28);">Mas está trazendo clientes?</span></h2>
    <p style="font-size:18px;font-weight:500;color:rgba(255,255,255,0.4);line-height:1.65;max-width:700px;">Seguidores não pagam conta. O que gera cliente é estrutura de vendas funcionando. Site + anúncio + automação — não só posts bonitos.</p>
  </div>
  ${ftr('INSTITUCIONAL')}
</div>

<!-- S4 — 4 MOTIVOS -->
<div class="slide s-card" id="s4">
  ${hdr(4)}
  <div style="position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;padding:68px 68px 120px;gap:28px;">
    <div>
      <span class="eyebrow" style="color:${cor};">4 MOTIVOS PARA INVESTIR AGORA</span>
      <div class="accent-line" style="background:${cor};margin-top:16px;"></div>
    </div>
    ${motivos.map(([t,d],i)=>`
    <div style="display:flex;gap:20px;align-items:flex-start;">
      <span style="font-size:13px;font-weight:900;color:${cor};letter-spacing:0.1em;flex-shrink:0;margin-top:3px;">0${i+1}</span>
      <div>
        <div style="font-size:22px;font-weight:800;color:#fff;letter-spacing:-0.02em;margin-bottom:4px;">${t}</div>
        <div style="font-size:14px;font-weight:500;color:rgba(255,255,255,0.38);line-height:1.6;">${d}</div>
      </div>
    </div>`).join('')}
  </div>
  ${ftr('INSTITUCIONAL')}
</div>

<!-- S5 — CONCORRÊNCIA -->
<div class="slide s-black" id="s5">
  ${hdr(5)}
  <div style="position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;padding:68px 68px 120px;">
    <span class="eyebrow" style="color:${cor};">A CONCORRÊNCIA</span>
    <div class="accent-line" style="background:${cor};margin-top:16px;"></div>
    <h2 style="font-size:64px;font-weight:900;line-height:1.02;letter-spacing:-0.045em;color:#fff;margin-bottom:32px;">Enquanto você hesita, seu concorrente está captando os seus clientes.</h2>
    <p style="font-size:18px;font-weight:500;color:rgba(255,255,255,0.38);line-height:1.65;">O digital não espera. Quem estrutura primeiro domina o mercado local por meses antes dos outros perceberem o que está acontecendo.</p>
  </div>
  ${ftr('INSTITUCIONAL')}
</div>

<!-- S6 — O QUE FAZEMOS -->
<div class="slide s-card" id="s6">
  ${hdr(6)}
  <div style="position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;padding:68px 68px 120px;gap:28px;">
    <div>
      <span class="eyebrow" style="color:${cor};">O QUE A SETY STUDIO FAZ</span>
      <div class="accent-line" style="background:${cor};margin-top:16px;"></div>
    </div>
    <div class="metric-grid">
      ${[
        ['Site Premium','Conversão real, não só visual bonito'],
        ['Tráfego Pago','Meta e Google com foco em custo por resultado'],
        ['Automação','WhatsApp que qualifica e vende 24h por dia'],
        ['Entrega em dias','Não em semanas. Sem enrolação.'],
      ].map(([t,d])=>`
      <div class="metric-card">
        <div style="font-size:14px;font-weight:900;color:${cor};letter-spacing:0.16em;margin-bottom:12px;">${t.toUpperCase()}</div>
        <div style="font-size:18px;font-weight:700;color:#fff;line-height:1.4;">${d}</div>
      </div>`).join('')}
    </div>
  </div>
  ${ftr('INSTITUCIONAL')}
</div>

<!-- S7 — RESULTADO MÉDIO -->
<div class="slide s-black" id="s7">
  ${hdr(7)}
  <div style="position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;padding:68px 68px 120px;">
    <span class="eyebrow" style="color:${cor};">RESULTADO MÉDIO DOS NOSSOS CLIENTES</span>
    <div class="accent-line" style="background:${cor};margin-top:16px;"></div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:0;margin-top:8px;">
      ${[
        ['4×','mais leads qualificados por mês'],
        ['-52%','custo de aquisição de clientes'],
        ['< 3 dias','da aprovação à entrega do site'],
        ['95+','score de performance Lighthouse'],
      ].map(([v,d],i)=>`
      <div style="padding:48px 40px;border-right:${i%2===0?'1px solid rgba(255,255,255,0.06)':'none'};border-bottom:${i<2?'1px solid rgba(255,255,255,0.06)':'none'};">
        <div style="font-size:72px;font-weight:900;letter-spacing:-0.05em;color:${cor};line-height:1;">${v}</div>
        <div style="font-size:14px;font-weight:500;color:rgba(255,255,255,0.38);margin-top:8px;line-height:1.5;">${d}</div>
      </div>`).join('')}
    </div>
  </div>
  ${ftr('INSTITUCIONAL')}
</div>

<!-- S8 — CTA -->
<div class="slide s-red" id="s8">
  <div class="cta-center">
    <img class="cta-logo" src="${LOGO}" alt="Sety Studio">
    <h2 class="cta-title">Pronto para ter uma estrutura digital que realmente vende?</h2>
    <p class="cta-sub">Diagnóstico gratuito. Proposta em 24h.<br>Resultado em dias, não meses.</p>
    <div class="cta-btn cta-btn-red">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.12.553 4.11 1.52 5.838L0 24l6.336-1.648A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.6c-1.9 0-3.68-.511-5.21-1.402l-.374-.222-3.76.977.998-3.658-.243-.386A9.576 9.576 0 012.4 12C2.4 6.7 6.7 2.4 12 2.4c5.3 0 9.6 4.3 9.6 9.6 0 5.3-4.3 9.6-9.6 9.6z"/></svg>
      Falar com a Sety Studio
    </div>
    <div class="cta-handle">(19) 98809-0110 · @SETY.STUDIO</div>
  </div>
</div>

</body></html>`;
}

// ─── CARROSSEL NOSSOS PROJETOS ────────────────────────────────────────────
function buildNossosProjetos() {
  const cor = '#FF2A2A';
  const nichos = [
    { slug: 'odontologia',  label: 'Odontologia',   name: 'Prime Odonto',           resultado: '+340% em agendamentos', cor: '#00B67A' },
    { slug: 'estetica',     label: 'Estética',      name: 'Aura Estética Premium',  resultado: 'R$280k em 90 dias',     cor: '#C9A96E' },
    { slug: 'energia-solar',label: 'Energia Solar', name: 'SolarMax Energia',       resultado: '85 projetos / 4 meses', cor: '#22C55E' },
    { slug: 'advocacia',    label: 'Advocacia',     name: 'Valença & Assoc.',       resultado: '+80% ticket médio',     cor: '#C9A73D' },
    { slug: 'imobiliaria',  label: 'Imobiliária',   name: 'Prime Select Imóveis',   resultado: '3× leads qualificados', cor: '#8B9EFF' },
    { slug: 'consorcio',    label: 'Consórcio',     name: 'Projeto Consórcio',      resultado: '180 cotas em 45 dias',  cor: '#3B82F6' },
  ];

  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8">
<style>${CSS_BASE}
.proj-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;}
.proj-card{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:6px;overflow:hidden;}
.proj-card-img{height:140px;overflow:hidden;position:relative;}
.proj-card-img img{width:100%;object-fit:cover;object-position:top;}
.proj-card-info{padding:16px;}
.proj-card-tag{font-size:9px;font-weight:800;letter-spacing:0.2em;margin-bottom:6px;display:block;}
.proj-card-name{font-size:17px;font-weight:800;letter-spacing:-0.02em;color:#fff;margin-bottom:4px;}
.proj-card-res{font-size:11px;font-weight:700;color:rgba(255,255,255,0.3);}
</style>
</head><body>

<!-- S1 — CAPA -->
<div class="slide s-black" id="s1">
  ${hdr(1)}
  <div style="position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;padding:68px 68px 120px;">
    <span class="eyebrow" style="color:${cor};">PORTFÓLIO · SETY STUDIO</span>
    <div class="accent-line" style="background:${cor};margin-top:20px;"></div>
    <h1 style="font-size:76px;font-weight:900;line-height:0.95;letter-spacing:-0.05em;color:#fff;margin-bottom:40px;">Nossos<br>Projetos.</h1>
    <p style="font-size:18px;font-weight:500;color:rgba(255,255,255,0.36);max-width:560px;line-height:1.65;">6 nichos. 6 resultados reais. Sites e estratégias que movem o ponteiro do negócio.</p>
  </div>
  ${ftr('PORTFÓLIO')}
</div>

<!-- S2 — GRADE PROJETOS (todos 6) -->
<div class="slide s-card" id="s2">
  ${hdr(2)}
  <div style="position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;padding:68px 68px 120px;gap:28px;">
    <div>
      <span class="eyebrow" style="color:${cor};">TODOS OS NICHOS</span>
      <div class="accent-line" style="background:${cor};margin-top:16px;"></div>
    </div>
    <div class="proj-grid">
      ${nichos.map(n=>`
      <div class="proj-card">
        <div class="proj-card-img"><img src="${SHOT(n.slug)}"></div>
        <div class="proj-card-info">
          <span class="proj-card-tag" style="color:${n.cor};">${n.label.toUpperCase()}</span>
          <div class="proj-card-name">${n.name}</div>
          <div class="proj-card-res">${n.resultado}</div>
        </div>
      </div>`).join('')}
    </div>
  </div>
  ${ftr('PORTFÓLIO')}
</div>

<!-- S3 - S7: 5 projetos em destaque (mantém 8 slides no total) -->
${nichos.slice(0,5).map((n,i)=>`
<!-- S${i+3} — ${n.label.toUpperCase()} -->
<div class="slide s-black" id="s${i+3}">
  ${hdr(i+3)}
  <div style="position:absolute;inset:0;background:url('${SHOT(n.slug)}') center top/cover no-repeat;opacity:0.12;"></div>
  <div style="position:absolute;inset:0;background:linear-gradient(to bottom,rgba(0,0,0,0.5) 0%,rgba(0,0,0,0.95) 55%,#000 100%);"></div>
  <div style="position:absolute;left:68px;right:68px;bottom:120px;">
    <span class="eyebrow" style="color:${n.cor};">${n.label.toUpperCase()} · CASE</span>
    <div style="height:3px;width:56px;background:${n.cor};margin:16px 0 28px;border-radius:2px;"></div>
    <h2 style="font-size:56px;font-weight:900;letter-spacing:-0.04em;color:#fff;line-height:1.0;margin-bottom:20px;">${n.name}</h2>
    <div style="display:inline-flex;align-items:center;gap:12px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:4px;padding:12px 20px;">
      <span style="font-size:22px;font-weight:900;color:${n.cor};">${n.resultado.split(' ')[0]}</span>
      <span style="font-size:13px;font-weight:600;color:rgba(255,255,255,0.4);">${n.resultado.split(' ').slice(1).join(' ')}</span>
    </div>
  </div>
  ${ftr(n.label.toUpperCase())}
</div>`).join('')}

<!-- S8 — CTA -->
<div class="slide s-red" id="s8">
  <div class="cta-center">
    <img class="cta-logo" src="${LOGO}" alt="Sety Studio">
    <h2 class="cta-title">Qual o próximo<br>projeto?</h2>
    <p class="cta-sub">Seu negócio pode ser o próximo case.<br>Entrega premium. Resultado real.</p>
    <div class="cta-btn cta-btn-red">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.12.553 4.11 1.52 5.838L0 24l6.336-1.648A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.6c-1.9 0-3.68-.511-5.21-1.402l-.374-.222-3.76.977.998-3.658-.243-.386A9.576 9.576 0 012.4 12C2.4 6.7 6.7 2.4 12 2.4c5.3 0 9.6 4.3 9.6 9.6 0 5.3-4.3 9.6-9.6 9.6z"/></svg>
      Solicitar Proposta
    </div>
    <div class="cta-handle">(19) 98809-0110 · @SETY.STUDIO</div>
  </div>
</div>

</body></html>`;
}

// ─── CARROSSEL PROCESSO ───────────────────────────────────────────────────
function buildProcesso() {
  const cor = '#FF2A2A';
  const etapas = [
    { num: '01', title: 'Captação', sub: 'Primeiro contato', desc: 'Você entra em contato pelo WhatsApp ou site. Resposta em até 2 horas úteis. Sem espera, sem burocracia.' },
    { num: '02', title: 'Briefing', sub: 'Entendemos seu negócio', desc: 'Reunião de alinhamento para mapear objetivos, público-alvo, concorrência e o que precisa ser construído primeiro.' },
    { num: '03', title: 'Design', sub: 'Criamos a identidade', desc: 'Wireframe, identidade visual e copy aplicados. Você aprova antes de avançar. Uma rodada de ajustes inclusa.' },
    { num: '04', title: 'Desenvolvimento', sub: 'Construímos e testamos', desc: 'Site desenvolvido com performance, SEO técnico e integração com WhatsApp. Testado em todos os dispositivos.' },
    { num: '05', title: 'Entrega', sub: 'Deploy e suporte', desc: 'Deploy em produção no prazo combinado. 30 dias de suporte técnico inclusos. Relatório de performance inicial.' },
  ];

  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8">
<style>${CSS_BASE}</style>
</head><body>

<!-- S1 — CAPA PROCESSO -->
<div class="slide s-black" id="s1">
  ${hdr(1)}
  <div style="position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;padding:68px 68px 120px;">
    <span class="eyebrow" style="color:${cor};">SETY STUDIO · METODOLOGIA</span>
    <div class="accent-line" style="background:${cor};margin-top:20px;"></div>
    <h1 style="font-size:76px;font-weight:900;line-height:0.95;letter-spacing:-0.05em;color:#fff;margin-bottom:40px;">Como funciona<br>nosso processo.</h1>
    <p style="font-size:18px;font-weight:500;color:rgba(255,255,255,0.36);max-width:560px;line-height:1.65;">5 etapas. Do primeiro contato até o site no ar e gerando resultado. Sem surpresas, sem enrolação.</p>
  </div>
  ${ftr('PROCESSO')}
</div>

<!-- S2 — VISÃO GERAL (timeline) -->
<div class="slide s-card" id="s2">
  ${hdr(2)}
  <div style="position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;padding:68px 68px 120px;gap:24px;">
    <div>
      <span class="eyebrow" style="color:${cor};">VISÃO GERAL</span>
      <div class="accent-line" style="background:${cor};margin-top:16px;"></div>
    </div>
    ${etapas.map((e,i)=>`
    <div style="display:flex;align-items:center;gap:20px;">
      <div style="width:40px;height:40px;border-radius:50%;background:${i===0?cor:'rgba(255,255,255,0.07)'};display:flex;align-items:center;justify-content:center;flex-shrink:0;">
        <span style="font-size:12px;font-weight:900;color:${i===0?'#000':'rgba(255,255,255,0.5)'};">${e.num}</span>
      </div>
      ${i<4?`<div style="height:1px;flex:1;background:rgba(255,255,255,0.08);"></div>`:''}
      <span style="font-size:13px;font-weight:700;color:${i===0?cor:'rgba(255,255,255,0.35)'};letter-spacing:0.1em;">${e.title.toUpperCase()}</span>
    </div>`).join('')}
  </div>
  ${ftr('PROCESSO')}
</div>

<!-- S3-S7 — Cada etapa -->
${etapas.map((e,i)=>`
<!-- S${i+3} — ${e.title.toUpperCase()} -->
<div class="slide ${i%2===0?'s-black':'s-card'}" id="s${i+3}">
  ${hdr(i+3)}
  <span class="ghost" style="left:-60px;bottom:-80px;color:#fff;">${e.num}</span>
  <div style="position:absolute;inset:0;display:flex;flex-direction:column;justify-content:flex-end;padding:68px 68px 140px;">
    <div style="display:inline-flex;align-items:center;gap:12px;margin-bottom:24px;">
      <div style="width:36px;height:36px;border-radius:50%;background:${cor};display:flex;align-items:center;justify-content:center;">
        <span style="font-size:11px;font-weight:900;color:#000;">${e.num}</span>
      </div>
      <span class="eyebrow" style="color:${cor};">${e.sub.toUpperCase()}</span>
    </div>
    <h2 style="font-size:88px;font-weight:900;line-height:0.9;letter-spacing:-0.06em;color:#fff;margin-bottom:32px;">${e.title}.</h2>
    <p style="font-size:19px;font-weight:500;color:rgba(255,255,255,0.45);line-height:1.65;max-width:700px;">${e.desc}</p>
  </div>
  ${ftr('PROCESSO')}
</div>`).join('')}

<!-- S8 — CTA -->
<div class="slide s-red" id="s8">
  <div class="cta-center">
    <img class="cta-logo" src="${LOGO}" alt="Sety Studio">
    <h2 class="cta-title">Vamos começar o seu projeto?</h2>
    <p class="cta-sub">Do briefing à entrega em dias.<br>Sem enrolação. Sem surpresas.</p>
    <div class="cta-btn cta-btn-red">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.12.553 4.11 1.52 5.838L0 24l6.336-1.648A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.6c-1.9 0-3.68-.511-5.21-1.402l-.374-.222-3.76.977.998-3.658-.243-.386A9.576 9.576 0 012.4 12C2.4 6.7 6.7 2.4 12 2.4c5.3 0 9.6 4.3 9.6 9.6 0 5.3-4.3 9.6-9.6 9.6z"/></svg>
      Iniciar Projeto
    </div>
    <div class="cta-handle">(19) 98809-0110 · @SETY.STUDIO</div>
  </div>
</div>

</body></html>`;
}

// ─── GERAR TODOS OS HTMLs ─────────────────────────────────────────────────
console.log('Gerando HTMLs...\n');

for (const p of projetos) {
  const out = path.join(BASE, p.slug, 'carrossel.html');
  fs.writeFileSync(out, buildPortfolioCarrossel(p));
  console.log(`✓ ${p.slug}/carrossel.html`);
}

fs.writeFileSync(path.join(BASE, 'institucional-2026', 'carrossel.html'), buildInstitucional());
console.log('✓ institucional-2026/carrossel.html');

fs.writeFileSync(path.join(BASE, 'nossos-projetos', 'carrossel.html'), buildNossosProjetos());
console.log('✓ nossos-projetos/carrossel.html');

fs.writeFileSync(path.join(BASE, 'processo', 'carrossel.html'), buildProcesso());
console.log('✓ processo/carrossel.html');

console.log('\nTodos os HTMLs gerados. Rodando render...');
