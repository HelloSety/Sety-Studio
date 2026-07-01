# Sety Studio — Infraestrutura VPS

## Stack

| Serviço | Container | Porta interna | Porta pública |
|---|---|---|---|
| Evolution API | sety-evolution | 8080 | via Nginx (443) |
| Aurora IA SDR (Node.js) | aurora-ia | 3001 | interno apenas |
| PostgreSQL | sety-postgres | 5432 | interno apenas |
| Redis | sety-redis | 6379 | interno apenas |
| Nginx Proxy Manager | sety-nginx | 80/443/81 | 80, 443, 81 |

---

## URLs de Acesso

| Recurso | URL |
|---|---|
| Evolution API | `https://api.seudominio.com.br` |
| Nginx Proxy Manager (painel) | `http://IP_VPS:81` |
| Health check Aurora IA | `http://localhost:3001/health` (interno) |

---

## Senhas e Credenciais

Ficam no arquivo `docker/.env.production` (nunca commitar).

| Variável | Descrição |
|---|---|
| `POSTGRES_PASSWORD` | Senha do PostgreSQL |
| `REDIS_PASSWORD` | Senha do Redis |
| `EVOLUTION_API_KEY` | API key da Evolution API |
| `ANTHROPIC_API_KEY` | Chave Claude (Anthropic) |
| `SUPABASE_SERVICE_KEY` | Service key do Supabase |
| `TELEGRAM_BOT_TOKEN` | Bot Telegram para alertas |
| `TELEGRAM_CHAT_ID` | Chat ID do Seven no Telegram |

Nginx Proxy Manager — login inicial: `admin@example.com` / `changeme` (trocar imediatamente).

---

## Estrutura dos Containers

```
sety-net (rede interna Docker)
├── sety-nginx        — Reverso proxy + SSL (Let's Encrypt)
│     ├── :80   → redirect para 443
│     ├── :443  → Evolution API (api.seudominio.com.br)
│     └── :81   → Painel NPM
├── sety-evolution    — WhatsApp API
│     └── webhook → http://nexa:3000/webhook
├── aurora-ia        — SDR IA Aurora IA (Node.js)
│     └── :3000/webhook ← Evolution API
├── sety-postgres     — Banco de dados
└── sety-redis        — Cache
```

---

## Deploy

### Primeira vez

```bash
# Na VPS, na pasta /opt/sety
git clone <repo> .
cd sety-automation/docker
cp .env.production .env.production.local  # edite com as senhas reais
bash setup.sh
```

### Atualizar Aurora IA após mudança de código

```bash
cd /opt/sety/sety-automation/docker
docker compose --env-file .env.production up -d --build nexa
```

---

## Reiniciar Serviços

```bash
# Reiniciar tudo
docker compose --env-file .env.production restart

# Reiniciar serviço específico
docker compose --env-file .env.production restart nexa
docker compose --env-file .env.production restart evolution

# Ver logs em tempo real
docker compose --env-file .env.production logs -f nexa
docker compose --env-file .env.production logs -f evolution

# Status de todos os containers
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
```

---

## Conectar Novo Número WhatsApp

### 1. Criar instância

```bash
curl -X POST "https://api.seudominio.com.br/instance/create" \
  -H "apikey: SUA_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "instanceName": "nome-da-instancia",
    "integration": "WHATSAPP-BAILEYS",
    "qrcode": true
  }'
```

### 2. Obter QR Code

```bash
curl "https://api.seudominio.com.br/instance/connect/nome-da-instancia" \
  -H "apikey: SUA_API_KEY"
```

Acesse a URL retornada no campo `base64` para escanear o QR.

### 3. Configurar webhook da instância

```bash
curl -X POST "https://api.seudominio.com.br/webhook/set/nome-da-instancia" \
  -H "apikey: SUA_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "webhook": {
      "enabled": true,
      "url": "http://nexa:3000/webhook",
      "webhookByEvents": true,
      "webhookBase64": false,
      "events": ["MESSAGES_UPSERT"]
    }
  }'
```

### 4. Verificar conexão

```bash
curl "https://api.seudominio.com.br/instance/fetchInstances" \
  -H "apikey: SUA_API_KEY"
```

---

## Nginx Proxy Manager — Configurar Domínios

1. Acesse `http://IP_VPS:81`
2. Troque a senha do admin no primeiro acesso
3. Add Proxy Host:
   - **Evolution API**
     - Domain: `api.seudominio.com.br`
     - Forward Hostname: `evolution`
     - Forward Port: `8080`
     - SSL: Let's Encrypt (ativar Force SSL + HSTS)
4. Aurora IA fica interno — não expor publicamente

---

## Configurar Supabase

Execute o arquivo `src/database/schema.sql` no SQL Editor do Supabase.

O Supabase é o banco de dados principal dos leads (não o PostgreSQL local, que é exclusivo da Evolution API).

---

## Variáveis de Ambiente Completas

```env
# Servidor
PORT=3000
SERVER_IP=67.207.90.199

# Banco PostgreSQL (Evolution API)
POSTGRES_DB=setydb
POSTGRES_USER=sety
POSTGRES_PASSWORD=senha_forte_aqui

# Redis (Evolution API)
REDIS_PASSWORD=senha_redis_aqui

# Evolution API
EVOLUTION_DOMAIN=api.seudominio.com.br
EVOLUTION_API_KEY=chave_longa_aqui
EVOLUTION_INSTANCE=sety

# Supabase (leads do Aurora IA)
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJ...

# Claude (Anthropic)
ANTHROPIC_API_KEY=sk-ant-...
CLAUDE_MODEL=claude-haiku-4-5-20251001

# Alertas
TELEGRAM_BOT_TOKEN=123456789:AAF...
TELEGRAM_CHAT_ID=-100...
```

---

## Fluxo de uma Mensagem

```
Cliente WhatsApp
      |
      v
Evolution API (sety-evolution)
      |  webhook POST /webhook
      v
Aurora IA SDR (aurora-ia:3000)
      |
      |-- Supabase: busca/cria lead
      |-- Supabase: carrega histórico
      |-- Claude API: gera resposta como Aurora IA
      |-- Evolution API: envia resposta WhatsApp
      |-- Supabase: salva conversa + atualiza lead
      |
      +-- Score >= 71 ou transferência solicitada?
               |
               v
          Telegram: alerta para Seven
```
