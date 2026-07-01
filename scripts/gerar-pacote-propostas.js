const { chromium } = require('playwright');
const path = require('path');

const OUT = 'C:/Users/seven/Downloads';

// ─── CSS ───────────────────────────────────────────────────────────────────
const CSS = `
@page { size: A4; margin: 0; }
*,*::before,*::after { margin:0;padding:0;box-sizing:border-box;-webkit-print-color-adjust:exact;print-color-adjust:exact; }
html,body { font-family:'Inter','Helvetica Neue',Arial,sans-serif; background:#ccc; }

.page {
  width:210mm; height:297mm;
  padding:13mm 18mm 12mm;
  position:relative; overflow:hidden;
  display:flex; flex-direction:column;
  page-break-after:always; break-after:page;
  margin:0 auto 4mm;
}

/* ── CAPA ──────────────────────────────────────── */
.cover { background:#0a0a0a; color:#fff; }

.c-top { display:flex; justify-content:space-between; align-items:center; }
.c-top-l { font-size:7.5pt; font-weight:500; letter-spacing:.28em; text-transform:uppercase; color:rgba(255,255,255,.28); }
.c-top-r { font-size:7.5pt; font-weight:400; color:rgba(255,255,255,.18); letter-spacing:.1em; }

.c-body { flex:1; display:flex; flex-direction:column; justify-content:flex-end; padding-bottom:13mm; }

.c-kicker { font-size:7.5pt; font-weight:500; letter-spacing:.3em; text-transform:uppercase; color:rgba(255,255,255,.25); margin-bottom:4.5mm; }
.c-rule { width:10mm; height:1px; background:rgba(255,255,255,.22); margin-bottom:6.5mm; }
.c-title { font-size:38pt; font-weight:900; line-height:1.04; letter-spacing:-.03em; color:#fff; margin-bottom:5mm; max-width:165mm; }
.c-desc { font-size:10pt; font-weight:300; line-height:1.8; color:rgba(255,255,255,.48); max-width:118mm; margin-bottom:9mm; }

.c-prazo { display:inline-flex; align-items:center; gap:8px; border:1px solid rgba(255,255,255,.14); padding:3mm 5mm; }
.c-prazo-lbl { font-size:6.5pt; font-weight:600; letter-spacing:.22em; text-transform:uppercase; color:rgba(255,255,255,.28); }
.c-prazo-sep { font-size:9pt; color:rgba(255,255,255,.18); }
.c-prazo-val { font-size:10pt; font-weight:700; color:#fff; letter-spacing:-.01em; }

.c-divider { height:1px; background:rgba(255,255,255,.1); margin:7mm 0; }
.c-footer { display:flex; justify-content:space-between; align-items:flex-end; }
.c-brand { font-size:18pt; font-weight:900; letter-spacing:-.02em; color:#fff; line-height:1; }
.c-footer-r { text-align:right; font-size:7.5pt; color:rgba(255,255,255,.2); letter-spacing:.15em; text-transform:uppercase; line-height:1.9; }

/* ── ESCOPO ─────────────────────────────────────── */
.scope { background:#fff; color:#0a0a0a; }

.sh { display:flex; justify-content:space-between; align-items:center; padding-bottom:3mm; border-bottom:1px solid #0a0a0a; margin-bottom:8mm; }
.sh-label { font-size:7.5pt; font-weight:500; letter-spacing:.22em; text-transform:uppercase; color:#aaa; }
.sh-brand { font-size:7.5pt; font-weight:600; letter-spacing:.18em; text-transform:uppercase; color:#bbb; }

.s-title { font-size:26pt; font-weight:800; letter-spacing:-.025em; color:#0a0a0a; margin-bottom:8mm; }

.checklist { display:grid; grid-template-columns:1fr 1fr; gap:0 10mm; }
.check-item { display:flex; align-items:center; gap:9px; padding:4.5mm 0; border-top:1px solid #0a0a0a; }
.check-mark { font-size:11pt; font-weight:800; color:#0a0a0a; flex-shrink:0; line-height:1; }
.check-text { font-size:10.5pt; font-weight:500; color:#0a0a0a; line-height:1.3; }

.pf { margin-top:auto; padding-top:3.5mm; border-top:1px solid #e8e8e8; display:flex; justify-content:space-between; align-items:center; }
.pf-brand { font-size:7pt; font-weight:600; letter-spacing:.2em; text-transform:uppercase; color:#ccc; }
.pf-num { font-size:7pt; color:#ccc; }

/* ── INVESTIMENTO ───────────────────────────────── */
.invest { background:#0a0a0a; color:#fff; }

.inv-sh { display:flex; justify-content:space-between; align-items:center; padding-bottom:3mm; border-bottom:1px solid rgba(255,255,255,.1); margin-bottom:14mm; }
.inv-label { font-size:7.5pt; font-weight:500; letter-spacing:.22em; text-transform:uppercase; color:rgba(255,255,255,.25); }

.inv-body { flex:1; display:flex; flex-direction:column; justify-content:center; }

.inv-kicker { font-size:7.5pt; font-weight:500; letter-spacing:.3em; text-transform:uppercase; color:rgba(255,255,255,.25); margin-bottom:4mm; }
.inv-price { font-size:58pt; font-weight:900; letter-spacing:-.04em; color:#fff; line-height:1; margin-bottom:5mm; }
.inv-sep { font-size:7.5pt; letter-spacing:.18em; text-transform:uppercase; color:rgba(255,255,255,.2); margin-bottom:2.5mm; }
.inv-inst { font-size:20pt; font-weight:600; color:rgba(255,255,255,.55); letter-spacing:-.015em; }

/* Variante Operação Completa */
.inv-blk { margin-bottom:9mm; }
.inv-blk-lbl { font-size:7.5pt; font-weight:600; letter-spacing:.22em; text-transform:uppercase; color:rgba(255,255,255,.3); margin-bottom:2mm; }
.inv-blk-price { font-size:46pt; font-weight:900; letter-spacing:-.04em; color:#fff; line-height:1.05; }
.inv-blk-inst { font-size:22pt; font-weight:600; color:rgba(255,255,255,.55); letter-spacing:-.015em; }

.bonus-wrap { margin-top:7mm; padding-top:7mm; border-top:1px solid rgba(255,255,255,.09); }
.bonus-lbl { font-size:7pt; font-weight:600; letter-spacing:.22em; text-transform:uppercase; color:rgba(255,255,255,.22); margin-bottom:3.5mm; }
.bonus-grid { display:flex; gap:5mm; }
.bonus-item { flex:1; font-size:9pt; font-weight:300; color:rgba(255,255,255,.42); padding:2.5mm 0; border-top:1px solid rgba(255,255,255,.07); }

.inv-footer { margin-top:auto; padding-top:3.5mm; border-top:1px solid rgba(255,255,255,.08); display:flex; justify-content:space-between; align-items:center; }
.inv-footer-brand { font-size:7pt; color:rgba(255,255,255,.18); letter-spacing:.18em; font-weight:600; text-transform:uppercase; }
.inv-footer-contact { font-size:7pt; color:rgba(255,255,255,.18); font-weight:400; }

@media print { html,body { background:white; } .page { margin:0; } }
`;

// ─── DADOS ─────────────────────────────────────────────────────────────────
const SERVICES = [
  {
    file: 'Sety-Studio-Proposta-Landing-Page.pdf',
    title: 'Landing Page Profissional',
    desc: 'Captação de leads e oportunidades comerciais para sua empresa.',
    prazo: '48 horas',
    items: ['Design profissional','Integração WhatsApp','Formulário de contato','Meta Pixel','Google Analytics','SEO básico','Responsivo','Suporte inicial'],
    price: 'R$ 800',
    inst: '12x de R$ 79,90',
  },
  {
    file: 'Sety-Studio-Proposta-Website-Institucional.pdf',
    title: 'Website Institucional',
    desc: 'Sua empresa com presença digital moderna e profissional.',
    prazo: '5 dias úteis',
    items: ['Home','Sobre','Serviços','Contato','WhatsApp','SEO','Responsivo','Integrações'],
    price: 'R$ 1.500',
    inst: '12x de R$ 149,90',
  },
  {
    file: 'Sety-Studio-Proposta-CRM-Comercial.pdf',
    title: 'CRM Comercial',
    desc: 'Organize sua operação de vendas e acompanhe cada oportunidade.',
    prazo: '5 dias úteis',
    items: ['Pipeline Comercial','Gestão de Leads','Gestão de Clientes','Follow-up','Dashboard','Relatórios','Treinamento'],
    price: 'R$ 2.000',
    inst: '12x de R$ 199,90',
  },
  {
    file: 'Sety-Studio-Proposta-Aurora-IA.pdf',
    title: 'Aurora IA',
    desc: 'Atendimento inteligente via WhatsApp 24 horas por dia.',
    prazo: '5 dias úteis',
    items: ['Atendimento automático','Qualificação de leads','Fluxos personalizados','Integração WhatsApp','Integração CRM','Encaminhamento comercial'],
    price: 'R$ 2.500',
    inst: '12x de R$ 249,90',
  },
  {
    file: 'Sety-Studio-Proposta-Loja-Virtual.pdf',
    title: 'Loja Virtual Profissional',
    desc: 'Estrutura pronta para vender online.',
    prazo: '7 dias úteis',
    items: ['Shopify ou Nuvemshop','Categorias','Produtos','WhatsApp','Pixel Meta','Google Analytics','SEO'],
    price: 'R$ 3.000',
    inst: '12x de R$ 299,90',
  },
  {
    file: 'Sety-Studio-Proposta-Operacao-Completa.pdf',
    title: 'Operação Comercial Completa',
    desc: 'Estrutura digital completa para empresas que desejam crescer.',
    prazo: 'até 15 dias',
    items: ['Landing Page','CRM Comercial','Aurora IA','WhatsApp Integrado','Setup de Tráfego Pago','Dashboard','Automações','Treinamento','Implantação Completa'],
    price: 'R$ 8.500',
    inst: '12x de R$ 849',
  },
];

// ─── TEMPLATES ─────────────────────────────────────────────────────────────
function checkItems(items) {
  return items.map(i => `
    <div class="check-item">
      <span class="check-mark">✓</span>
      <span class="check-text">${i}</span>
    </div>`).join('');
}

function coverPage(s) {
  return `
<div class="page cover">
  <div class="c-top">
    <span class="c-top-l">Sety Studio</span>
    <span class="c-top-r">2026</span>
  </div>
  <div class="c-body">
    <p class="c-kicker">Proposta Comercial</p>
    <div class="c-rule"></div>
    <h1 class="c-title">${s.title}</h1>
    <p class="c-desc">${s.desc}</p>
    <div class="c-prazo">
      <span class="c-prazo-lbl">Entrega em</span>
      <span class="c-prazo-sep">—</span>
      <span class="c-prazo-val">${s.prazo}</span>
    </div>
  </div>
  <div class="c-divider"></div>
  <div class="c-footer">
    <span class="c-brand">SETY STUDIO</span>
    <div class="c-footer-r"><p>Agência Digital</p><p>Alto Desempenho</p></div>
  </div>
</div>`;
}

function scopePage(s) {
  return `
<div class="page scope">
  <div class="sh">
    <span class="sh-label">02 / O que está incluso</span>
    <span class="sh-brand">Sety Studio</span>
  </div>
  <h2 class="s-title">O que está incluso.</h2>
  <div class="checklist">${checkItems(s.items)}</div>
  <div class="pf">
    <span class="pf-brand">Sety Studio</span>
    <span class="pf-num">02</span>
  </div>
</div>`;
}

function investPage(s) {
  const body = s.avista
    ? `
      <div class="inv-blk">
        <div class="inv-blk-lbl">À Vista</div>
        <div class="inv-blk-price">${s.avista}</div>
      </div>
      <div class="inv-blk">
        <div class="inv-blk-lbl">Parcelado</div>
        <div class="inv-blk-inst">${s.parcelado}</div>
      </div>
      <div class="bonus-wrap">
        <div class="bonus-lbl">Bônus incluídos</div>
        <div class="bonus-grid">
          ${s.bonus.map(b => `<div class="bonus-item">✓ ${b}</div>`).join('')}
        </div>
      </div>`
    : `
      <p class="inv-kicker">Investimento</p>
      <div class="inv-price">${s.price}</div>
      <p class="inv-sep">ou</p>
      <div class="inv-inst">${s.inst}</div>`;

  return `
<div class="page invest">
  <div class="inv-sh">
    <span class="inv-label">03 / Investimento</span>
    <span class="inv-label">Sety Studio</span>
  </div>
  <div class="inv-body">${body}</div>
  <div class="inv-footer">
    <span class="inv-footer-brand">Sety Studio</span>
    <span class="inv-footer-contact">sevendsgnn@gmail.com</span>
  </div>
</div>`;
}

function buildHTML(s) {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
  <title>${s.title} — Sety Studio</title>
  <style>${CSS}</style>
</head>
<body>
  ${coverPage(s)}
  ${scopePage(s)}
  ${investPage(s)}
</body>
</html>`;
}

// ─── MAIN ──────────────────────────────────────────────────────────────────
async function main() {
  const browser = await chromium.launch();

  for (const svc of SERVICES) {
    const page = await browser.newPage();
    await page.setContent(buildHTML(svc), { waitUntil: 'networkidle' });
    await page.waitForTimeout(2200);

    const outPath = path.join(OUT, svc.file);
    await page.pdf({
      path: outPath,
      format: 'A4',
      printBackground: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' },
    });

    await page.close();
    console.log(`✓ ${svc.file}`);
  }

  await browser.close();
  console.log(`\nSalvos em: ${OUT}`);
}

main().catch(err => { console.error(err); process.exit(1); });
