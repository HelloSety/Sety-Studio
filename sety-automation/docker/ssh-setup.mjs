// Script de setup remoto — roda localmente e configura a VPS via SSH
// Uso: node ssh-setup.mjs

import { Client } from 'ssh2';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const HOST = '67.207.90.199';
const USER = process.env.SSH_USER || 'root';
const PASS = process.env.SSH_PASS;
const KEY  = process.env.SSH_KEY  || resolve(process.env.HOME || 'C:/Users/seven', '.ssh/sety_vps');

// ── Comandos de setup ─────────────────────────────────────────────────────────

const SETUP_COMMANDS = [

  // 1. Sistema
  'apt-get update -y && apt-get upgrade -y && apt-get install -y curl git',

  // 2. Docker
  `
  if ! command -v docker &>/dev/null; then
    curl -fsSL https://get.docker.com | sh
    systemctl enable docker && systemctl start docker
    echo "Docker instalado"
  else
    echo "Docker já instalado: $(docker --version)"
  fi
  `,

  // 3. Docker Compose plugin
  `
  if ! docker compose version &>/dev/null 2>&1; then
    apt-get install -y docker-compose-plugin
    echo "Docker Compose instalado"
  else
    echo "Docker Compose: $(docker compose version)"
  fi
  `,

  // 4. Clonar / copiar projeto
  `
  mkdir -p /opt/sety
  cd /opt/sety
  echo "Pasta /opt/sety pronta"
  ls -la
  `,
];

// ── Helper: executar comando via SSH ─────────────────────────────────────────

function runCommand(conn, cmd) {
  return new Promise((resolve, reject) => {
    conn.exec(cmd.trim(), (err, stream) => {
      if (err) return reject(err);
      let out = '';
      let errOut = '';
      stream
        .on('data', (d) => { out += d; process.stdout.write(d.toString()); })
        .stderr.on('data', (d) => { errOut += d; process.stderr.write(d.toString()); });
      stream.on('close', (code) => {
        if (code !== 0) reject(new Error(`Saiu com código ${code}\n${errOut}`));
        else resolve(out);
      });
    });
  });
}

// ── Conexão SSH ───────────────────────────────────────────────────────────────

async function main() {
  const conn = new Client();

  const authConfig = { host: HOST, port: 22, username: USER };

  if (PASS) {
    authConfig.password = PASS;
    console.log(`Conectando com senha: ${USER}@${HOST}`);
  } else {
    try {
      authConfig.privateKey = readFileSync(KEY);
      console.log(`Conectando com chave SSH: ${USER}@${HOST}`);
    } catch {
      console.error(`Não foi possível ler a chave SSH em: ${KEY}`);
      console.error('Defina SSH_USER e SSH_PASS como variáveis de ambiente.');
      process.exit(1);
    }
  }

  await new Promise((resolve, reject) => {
    conn.on('ready', resolve).on('error', reject).connect(authConfig);
  });

  console.log('\n=== Conexão SSH estabelecida ===\n');

  try {
    for (const cmd of SETUP_COMMANDS) {
      console.log(`\n--- Executando ---\n${cmd.trim().split('\n')[0]}...`);
      await runCommand(conn, cmd);
    }
    console.log('\n=== Setup base concluído! ===');
    console.log('\nPróximo passo: copiar docker-compose.yml e .env.production para /opt/sety/');
  } catch (err) {
    console.error('\nErro durante setup:', err.message);
  } finally {
    conn.end();
  }
}

main();
