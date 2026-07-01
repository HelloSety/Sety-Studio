#!/usr/bin/env node
/**
 * sync-memory.js — MazyOS Auto-Sync
 * Roda via Stop hook após cada turn do Claude Code.
 * Detecta novos arquivos em pastas-chave e atualiza MEMORY/README.md.
 */

const fs   = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT   = path.resolve(__dirname, '..');
const MEMORY = path.join(ROOT, 'MEMORY');
const INDEX  = path.join(MEMORY, 'README.md');

// Pastas monitoradas → seção do MEMORY que devem aparecer
const WATCHED = {
  'MEMORY/CLIENTES'  : 'CLIENTES',
  'MEMORY/PLAYBOOKS' : 'PLAYBOOKS',
  'MEMORY/CAMPANHAS' : 'CAMPANHAS',
  'MEMORY/DECISOES'  : 'DECISOES',
  'MEMORY/TEMPLATES' : 'TEMPLATES',
  'MEMORY/PROMPTS'   : 'PROMPTS',
  'MEMORY/PROJETOS'  : 'PROJETOS',
};

// ─── helpers ───────────────────────────────────────────────────────────────

function readLines(file) {
  if (!fs.existsSync(file)) return [];
  return fs.readFileSync(file, 'utf8').split('\n');
}

function extractFrontmatterTitle(filePath) {
  const lines = readLines(filePath);
  for (const line of lines) {
    if (line.startsWith('# ')) return line.slice(2).trim();
  }
  return path.basename(filePath, '.md');
}

function buildIndexLine(relPath, title) {
  const link = relPath.replace(/\\/g, '/');
  return `- [${title}](${link})`;
}

// ─── scan MEMORY subfolders ────────────────────────────────────────────────

function scanMemory() {
  const entries = [];

  for (const [folder] of Object.entries(WATCHED)) {
    const absFolder = path.join(ROOT, folder);
    if (!fs.existsSync(absFolder)) continue;

    const files = fs.readdirSync(absFolder)
      .filter(f => f.endsWith('.md') && f !== 'README.md')
      .sort();

    for (const file of files) {
      const absFile = path.join(absFolder, file);
      const relPath = path.relative(ROOT, absFile).replace(/\\/g, '/');
      const title   = extractFrontmatterTitle(absFile);
      entries.push({ section: folder.replace('MEMORY/', ''), relPath, title });
    }
  }

  return entries;
}

// ─── rebuild MEMORY/README.md ─────────────────────────────────────────────

function rebuildIndex(entries) {
  const sections = {};
  for (const e of entries) {
    if (!sections[e.section]) sections[e.section] = [];
    sections[e.section].push(buildIndexLine(e.relPath, e.title));
  }

  const lines = [
    '# MEMORY HUB — Sety Studio',
    '',
    'Segunda memória operacional da agência. Tudo que funciona fica aqui.',
    '',
    '## Estrutura',
    '',
    '| Pasta | O que guarda |',
    '|---|---|',
    '| `CLIENTES/` | Perfil de cada cliente — histórico, gargalos, wins |',
    '| `PROJETOS/` | Post-mortems de projetos concluídos |',
    '| `CAMPANHAS/` | Estruturas e criativos que convertiram |',
    '| `PROMPTS/` | Prompts validados por resultado |',
    '| `TEMPLATES/` | Templates prontos reutilizáveis |',
    '| `DECISOES/` | Decisões estratégicas importantes + motivo |',
    '| `PLAYBOOKS/` | Processos passo a passo por tipo de entrega |',
    '',
    '## Como usar',
    '',
    '**Antes de criar qualquer coisa**, verificar nesta ordem:',
    '1. Existe template em `MEMORY/TEMPLATES/`?',
    '2. Existe playbook em `MEMORY/PLAYBOOKS/`?',
    '3. Existe campanha similar em `MEMORY/CAMPANHAS/`?',
    '4. Só então criar do zero.',
    '',
    '**Após concluir projeto**, rodar `/post-mortem` para salvar os aprendizados.',
    '',
    '---',
    '',
    '## Índice',
  ];

  const ORDER = ['CLIENTES','PROJETOS','CAMPANHAS','TEMPLATES','PLAYBOOKS','DECISOES','PROMPTS'];
  for (const sec of ORDER) {
    if (!sections[sec] || sections[sec].length === 0) continue;
    lines.push('', `### ${sec}`, '');
    lines.push(...sections[sec]);
  }

  lines.push('');
  return lines.join('\n');
}

// ─── detect new client folders ─────────────────────────────────────────────

function checkClientFolders() {
  const clientsDir = path.join(ROOT, 'clientes');
  if (!fs.existsSync(clientsDir)) return [];

  const clientFolders = fs.readdirSync(clientsDir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);

  const memClientDir = path.join(MEMORY, 'CLIENTES');
  const existing = fs.existsSync(memClientDir)
    ? fs.readdirSync(memClientDir).map(f => f.replace('.md', '').toLowerCase())
    : [];

  const missing = clientFolders.filter(
    c => !existing.includes(c.toLowerCase()) && !existing.includes(c.replace(/-/g,' ').toLowerCase())
  );

  return missing;
}

// ─── detect new skill files ────────────────────────────────────────────────

function checkSkills() {
  const skillsDir = path.join(ROOT, '.claude', 'skills');
  if (!fs.existsSync(skillsDir)) return [];

  return fs.readdirSync(skillsDir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);
}

// ─── main ──────────────────────────────────────────────────────────────────

function main() {
  let changed = false;
  const log   = [];

  // Garantir pastas do MEMORY existem
  for (const folder of Object.keys(WATCHED)) {
    const abs = path.join(ROOT, folder);
    if (!fs.existsSync(abs)) {
      fs.mkdirSync(abs, { recursive: true });
      log.push(`  criada pasta ${folder}/`);
      changed = true;
    }
  }

  // Reconstruir README do MEMORY
  const entries    = scanMemory();
  const newContent = rebuildIndex(entries);
  const oldContent = fs.existsSync(INDEX) ? fs.readFileSync(INDEX, 'utf8') : '';

  if (newContent !== oldContent) {
    fs.writeFileSync(INDEX, newContent, 'utf8');
    log.push(`  MEMORY/README.md atualizado (${entries.length} entradas)`);
    changed = true;
  }

  // Alertar sobre clientes sem entrada no MEMORY
  const missingClients = checkClientFolders();
  if (missingClients.length > 0) {
    log.push(`  AVISO: clientes sem entrada no MEMORY/CLIENTES/: ${missingClients.join(', ')}`);
    log.push(`  → rode /post-mortem ou crie MEMORY/CLIENTES/<nome>.md manualmente`);
  }

  // Listar skills disponíveis (informativo)
  const skills = checkSkills();
  if (skills.length > 0) {
    // silencioso — só loga se houver mudanças
  }

  if (changed || log.length > 0) {
    console.log('\n[MazyOS sync]');
    log.forEach(l => console.log(l));
    if (!changed && missingClients.length === 0) {
      console.log('  tudo em dia — nada pra atualizar');
    }
  }
}

main();
