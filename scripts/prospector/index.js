require('dotenv').config({ path: `${__dirname}/.env` });

const fs = require('fs');
const path = require('path');
const { createObjectCsvWriter } = require('csv-writer');
const { searchPlaces, getDetails, preFilter } = require('./maps-scraper');
const { qualifyLeads } = require('./qualifier');
const { buildMessage } = require('./messages');
const { sendText, filterWhatsAppNumbers } = require('./whatsapp');
const {
  NICHES, CITIES,
  DAILY_COMBINATIONS,
  MIN_SCORE_TO_CONTACT,
  MAX_DAILY_CONTACTS,
  MESSAGE_DELAY_MS,
} = require('./config');

const OUTPUT_DIR = path.join(__dirname, '../../saidas/prospector');
const LOG_FILE = path.join(OUTPUT_DIR, 'contacted.json');

const DRY_RUN = process.argv.includes('--dry-run');
const ONLY_EXPORT = process.argv.includes('--only-export');

// ── Utilitários ────────────────────────────────────────────────────────────────

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function todayStr() { return new Date().toISOString().slice(0, 10); }

function log(...args) { console.log(`[${new Date().toTimeString().slice(0, 8)}]`, ...args); }

// ── Log de contatos (anti-spam cross-session) ─────────────────────────────────

function loadContacted() {
  try {
    return new Set(JSON.parse(fs.readFileSync(LOG_FILE, 'utf8')));
  } catch {
    return new Set();
  }
}

function saveContacted(set) {
  fs.mkdirSync(path.dirname(LOG_FILE), { recursive: true });
  fs.writeFileSync(LOG_FILE, JSON.stringify([...set], null, 2));
}

// ── Rotação diária de combinações niche + cidade ──────────────────────────────

function pickCombinations() {
  const all = [];
  for (const niche of NICHES) {
    for (const city of CITIES) {
      all.push({ niche, city });
    }
  }
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  const start = (dayOfYear * DAILY_COMBINATIONS) % all.length;
  const picked = [];
  for (let i = 0; i < DAILY_COMBINATIONS; i++) {
    picked.push(all[(start + i) % all.length]);
  }
  return picked;
}

// ── Scraping ──────────────────────────────────────────────────────────────────

async function scrapeLeads(combinations) {
  const places = [];
  const seen = new Set();

  for (const { niche, city } of combinations) {
    log(`Buscando: ${niche.label} em ${city}`);
    try {
      const raw = await searchPlaces(niche.query, city);
      const filtered = preFilter(raw);
      log(`  → ${raw.length} encontrados, ${filtered.length} após pré-filtro`);

      for (const p of filtered) {
        if (seen.has(p.place_id)) continue;
        seen.add(p.place_id);

        const details = await getDetails(p.place_id);
        if (!details) continue;

        details._niche = niche.label;
        details._city = city;
        places.push(details);
        await sleep(300);
      }
    } catch (err) {
      log(`  ERRO em ${niche.label}/${city}:`, err.message);
    }
  }

  return places;
}

// ── Export CSV ────────────────────────────────────────────────────────────────

async function exportCSV(leads, filename) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  const csvPath = path.join(OUTPUT_DIR, filename);

  const writer = createObjectCsvWriter({
    path: csvPath,
    header: [
      { id: 'score',       title: 'Score' },
      { id: 'name',        title: 'Empresa' },
      { id: 'niche',       title: 'Nicho' },
      { id: 'city',        title: 'Cidade' },
      { id: 'phoneDisplay',title: 'Telefone' },
      { id: 'website',     title: 'Site' },
      { id: 'rating',      title: 'Rating' },
      { id: 'reviews',     title: 'Reviews' },
      { id: 'reasons',     title: 'Por que contatar' },
      { id: 'address',     title: 'Endereço' },
      { id: 'contacted',   title: 'Contatado' },
    ],
  });

  await writer.writeRecords(leads);
  log(`CSV exportado: ${csvPath}`);
  return csvPath;
}

// ── Envio de mensagens ────────────────────────────────────────────────────────

async function contactLeads(leads, contacted) {
  const toContact = leads
    .filter(l => l.score >= MIN_SCORE_TO_CONTACT)
    .filter(l => !contacted.has(l.phone))
    .slice(0, MAX_DAILY_CONTACTS);

  log(`\n${toContact.length} leads qualificados para contato`);
  log(`(score >= ${MIN_SCORE_TO_CONTACT}, não contatados anteriormente, máx ${MAX_DAILY_CONTACTS}/dia)\n`);

  if (toContact.length === 0) {
    log('Nenhum lead novo para contatar hoje.');
    return { sent: 0, failed: 0 };
  }

  if (DRY_RUN) {
    log('[DRY RUN] Prévia das 3 primeiras mensagens:\n');
    for (const lead of toContact.slice(0, 3)) {
      console.log(`── ${lead.name} (${lead.phoneDisplay}) | Score: ${lead.score} ──`);
      console.log(buildMessage(lead));
      console.log();
    }
    return { sent: 0, failed: 0 };
  }

  // Verifica quais têm WhatsApp (batch)
  const allPhones = toContact.map(l => l.phone);
  log('Verificando números com WhatsApp...');
  const validPhones = await filterWhatsAppNumbers(allPhones);
  log(`${validPhones.size}/${allPhones.length} números validados\n`);

  let sent = 0;
  let failed = 0;
  let skipped = 0;

  for (const lead of toContact) {
    if (!validPhones.has(lead.phone)) {
      skipped++;
      continue;
    }

    const msg = buildMessage(lead);
    try {
      await sendText(lead.phone, msg);
      contacted.add(lead.phone);
      lead.contacted = true;
      sent++;
      log(`✓ ${lead.name} (${lead.phoneDisplay})`);
    } catch (err) {
      failed++;
      log(`✗ ${lead.name}: ${err.response?.data?.message || err.message}`);
    }

    await sleep(MESSAGE_DELAY_MS);
  }

  saveContacted(contacted);
  log(`\nResultado: ${sent} enviados | ${failed} falhas | ${skipped} sem WhatsApp`);
  return { sent, failed, skipped };
}

// ── Orquestrador principal ────────────────────────────────────────────────────

async function run() {
  console.log(`\n${'═'.repeat(50)}`);
  console.log(`  Sety Prospector — ${todayStr()}`);
  if (DRY_RUN)    console.log('  MODO: DRY RUN (não envia mensagens)');
  if (ONLY_EXPORT) console.log('  MODO: ONLY EXPORT (não envia mensagens)');
  console.log(`${'═'.repeat(50)}\n`);

  const combinations = pickCombinations();
  log('Combinações de hoje:');
  combinations.forEach(c => log(`  • ${c.niche.label} em ${c.city}`));
  console.log();

  // 1. Scrape
  const rawPlaces = await scrapeLeads(combinations);
  log(`\nTotal coletado: ${rawPlaces.length} estabelecimentos`);

  // 2. Qualifica
  const leads = qualifyLeads(rawPlaces);
  const qualifiedCount = leads.filter(l => l.score >= MIN_SCORE_TO_CONTACT).length;
  log(`Qualificados (score >= ${MIN_SCORE_TO_CONTACT}): ${qualifiedCount} de ${leads.length}`);

  // 3. Exporta CSV
  const csvFile = `leads-${todayStr()}.csv`;
  await exportCSV(leads, csvFile);

  // 4. Contata
  if (!ONLY_EXPORT) {
    const contacted = loadContacted();
    log(`Histórico: ${contacted.size} números já contatados anteriormente`);
    await contactLeads(leads, contacted);
  }

  console.log(`\n${'═'.repeat(50)}`);
  console.log('  Concluído.');
  console.log(`${'═'.repeat(50)}\n`);
}

run().catch(err => {
  console.error('ERRO FATAL:', err.message);
  process.exit(1);
});
