# Automação Completa de WhatsApp — Sety Studio

**Stack:** Evolution API + Typebot + N8N + Google Sheets + Telegram  
**Custo mensal:** R$ 0 (self-hosted) ou ~R$ 50/mês (VPS mínima)  
**Data:** 2026-06-22

---

## 1. ARQUITETURA GERAL

```
Meta Ads
   ↓
WhatsApp (link wa.me)
   ↓
Evolution API (recebe mensagem)
   ↓
N8N Webhook (dispara sessão)
   ↓
Typebot (bot de qualificação — 10 perguntas)
   ↓
Webhook final → N8N
   ↓
┌─────────────────────────────────┐
│  Calcular Score (0-100)         │
│  Salvar Google Sheets           │
│  Se score ≥ 71 → Telegram 🔥    │
│  Agendar follow-ups             │
└─────────────────────────────────┘
```

---

## 2. COMPONENTES

| Ferramenta | Função | Instalação |
|---|---|---|
| Evolution API | Conectar WhatsApp | Docker (self-hosted) |
| Typebot | Bot de qualificação | Typebot Cloud (free tier) ou self-hosted |
| N8N | Orquestração + lógica | Docker (self-hosted) |
| Google Sheets | CRM / banco de leads | Google (grátis) |
| Telegram | Notificações de leads quentes | Telegram Bot (grátis) |

### VPS Recomendada (mínima)
- **Hostinger VPS** ou **Hetzner CX22** — ~R$ 40-80/mês
- 2 vCPU, 4GB RAM, 40GB SSD
- Ubuntu 22.04

---

## 3. INSTALAÇÃO (Docker Compose)

Crie `docker-compose.yml` na VPS:

```yaml
version: '3.8'

services:
  evolution:
    image: atendai/evolution-api:latest
    container_name: evolution_api
    ports:
      - "8080:8080"
    environment:
      - SERVER_URL=http://SEU_IP:8080
      - AUTHENTICATION_API_KEY=SUA_CHAVE_SECRETA
      - WEBHOOK_GLOBAL_ENABLED=true
      - WEBHOOK_GLOBAL_URL=http://n8n:5678/webhook/evolution
      - DATABASE_ENABLED=true
      - DATABASE_CONNECTION_URI=mongodb://mongo:27017/evolution
    depends_on:
      - mongo
    restart: always

  mongo:
    image: mongo:latest
    container_name: mongo_db
    volumes:
      - mongo_data:/data/db
    restart: always

  n8n:
    image: n8nio/n8n:latest
    container_name: n8n
    ports:
      - "5678:5678"
    environment:
      - N8N_HOST=SEU_IP
      - N8N_PORT=5678
      - WEBHOOK_URL=http://SEU_IP:5678/
    volumes:
      - n8n_data:/home/node/.n8n
    restart: always

volumes:
  mongo_data:
  n8n_data:
```

```bash
docker-compose up -d
```

---

## 4. GOOGLE SHEETS — ESTRUTURA

**Nome da planilha:** `CRM Sety Studio`

### Aba: LEADS

| Coluna | Campo |
|---|---|
| A | Data/Hora |
| B | Nome |
| C | Instagram |
| D | Cidade |
| E | Nicho |
| F | Plataforma |
| G | Qtd Produtos |
| H | Possui Fornecedor |
| I | Prazo |
| J | Investimento |
| K | Score |
| L | Classificação |
| M | Status CRM |
| N | Telefone |
| O | Último Contato |
| P | Observações |

### Aba: PIPELINE

| Coluna | Estágio |
|---|---|
| A | Novos Leads |
| B | Contato Feito |
| C | Proposta Enviada |
| D | Negociação |
| E | Fechado |
| F | Perdido |

---

## 5. TYPEBOT — FLUXO DE QUALIFICAÇÃO

**Criar em:** typebot.io (free) ou self-hosted

### Sequência de mensagens:

```
[START]
"Olá! 👋 Sou a assistente da Sety Studio.
Vou te fazer algumas perguntas rápidas pra entender 
o seu projeto. Leva menos de 2 minutos!"

↓

P1: "Qual é o seu nome?"
→ Salvar: {{nome}}

P2: "Qual é o seu Instagram? (ex: @seuperfil)"
→ Salvar: {{instagram}}

P3: "De qual cidade você é?"
→ Salvar: {{cidade}}

P4: "Qual é o nicho do seu e-commerce?"
Opções: 
□ Moda / Vestuário
□ Esportes / Fitness
□ Eletrônicos
□ Casa e Decoração
□ Outro
→ Salvar: {{nicho}}

P5: "Qual plataforma você prefere?"
Opções:
□ Shopify (mais completo)
□ Nuvemshop (mais simples)
□ Não sei ainda
→ Salvar: {{plataforma}}

P6: "Quantos produtos você vai vender?"
Opções:
□ Menos de 20 produtos
□ 20 a 50 produtos
□ Mais de 50 produtos
→ Salvar: {{qtd_produtos}}

P7: "Você já possui fornecedor(es)?"
Opções:
□ Sim, já tenho
□ Ainda estou buscando
□ Não tenho
→ Salvar: {{fornecedor}}

P8: "Quando você quer lançar a loja?"
Opções:
□ O mais rápido possível (essa semana)
□ Este mês
□ Nos próximos 3 meses
□ Sem prazo definido
→ Salvar: {{prazo}}

P9: "Qual faixa de investimento você considera?"
Opções:
□ Até R$ 800
□ R$ 800 a R$ 1.500
□ R$ 1.500 a R$ 3.000
□ Acima de R$ 3.000
→ Salvar: {{investimento}}

↓

[FIM] "Perfeito, {{nome}}! 🎉
Recebi suas informações. Em breve nossa equipe 
entrará em contato com você. Fique atento ao WhatsApp!"

↓

[WEBHOOK] → POST para N8N
```

### Payload do Webhook (Typebot → N8N):

```json
{
  "nome": "{{nome}}",
  "instagram": "{{instagram}}",
  "cidade": "{{cidade}}",
  "nicho": "{{nicho}}",
  "plataforma": "{{plataforma}}",
  "qtd_produtos": "{{qtd_produtos}}",
  "fornecedor": "{{fornecedor}}",
  "prazo": "{{prazo}}",
  "investimento": "{{investimento}}",
  "telefone": "{{telefone}}"
}
```

---

## 6. LÓGICA DE SCORE (N8N)

**Total máximo: 100 pontos**

### Prazo (25 pts)
| Resposta | Pontos |
|---|---|
| O mais rápido possível | 25 |
| Este mês | 20 |
| Nos próximos 3 meses | 10 |
| Sem prazo definido | 0 |

### Investimento (25 pts)
| Resposta | Pontos |
|---|---|
| Acima de R$ 3.000 | 25 |
| R$ 1.500 a R$ 3.000 | 20 |
| R$ 800 a R$ 1.500 | 10 |
| Até R$ 800 | 0 |

### Fornecedor (20 pts)
| Resposta | Pontos |
|---|---|
| Sim, já tenho | 20 |
| Ainda estou buscando | 10 |
| Não tenho | 0 |

### Quantidade de Produtos (15 pts)
| Resposta | Pontos |
|---|---|
| Mais de 50 produtos | 15 |
| 20 a 50 produtos | 10 |
| Menos de 20 produtos | 5 |

### Plataforma (15 pts)
| Resposta | Pontos |
|---|---|
| Shopify | 15 |
| Nuvemshop | 10 |
| Não sei ainda | 5 |

### Classificação Final
| Score | Classificação |
|---|---|
| 71 – 100 | 🔥 Lead Quente |
| 41 – 70 | 🌡️ Lead Morno |
| 0 – 40 | ❄️ Lead Frio |

---

## 7. N8N — WORKFLOW 1: RECEBER E CLASSIFICAR LEAD

**Nome:** `Qualificar Lead Sety Studio`

### Nodes em ordem:

```
1. Webhook (POST /webhook/lead-sety)
2. Function (Calcular Score)
3. Function (Definir Classificação)
4. Google Sheets (Append Row)
5. IF (Score >= 71?)
   ├── SIM → Telegram (Notificar Seven)
   │        → Evolution API (Enviar mensagem de confirmação)
   └── NÃO → Evolution API (Enviar mensagem de confirmação)
6. Schedule (Criar follow-ups)
```

### Node 2 — Code (Calcular Score):

```javascript
// Recebe dados do Typebot
const data = $input.first().json;

let score = 0;

// Prazo
if (data.prazo.includes('rápido')) score += 25;
else if (data.prazo.includes('Este mês')) score += 20;
else if (data.prazo.includes('3 meses')) score += 10;

// Investimento
if (data.investimento.includes('3.000')) score += 25;
else if (data.investimento.includes('1.500')) score += 20;
else if (data.investimento.includes('800 a')) score += 10;

// Fornecedor
if (data.fornecedor.includes('Sim')) score += 20;
else if (data.fornecedor.includes('buscando')) score += 10;

// Quantidade de produtos
if (data.qtd_produtos.includes('50')) score += 15;
else if (data.qtd_produtos.includes('20 a')) score += 10;
else score += 5;

// Plataforma
if (data.plataforma.includes('Shopify')) score += 15;
else if (data.plataforma.includes('Nuvemshop')) score += 10;
else score += 5;

// Classificação
let classificacao = '';
let emoji = '';
if (score >= 71) { classificacao = 'Lead Quente'; emoji = '🔥'; }
else if (score >= 41) { classificacao = 'Lead Morno'; emoji = '🌡️'; }
else { classificacao = 'Lead Frio'; emoji = '❄️'; }

return [{
  json: {
    ...data,
    score,
    classificacao,
    emoji,
    data_hora: new Date().toLocaleString('pt-BR', { timeZone: 'America/Belem' }),
    status_crm: 'Novo Lead'
  }
}];
```

### Node 3 — Google Sheets (Append Row):

- **Operação:** Append
- **Sheet ID:** ID da sua planilha
- **Range:** LEADS!A:P
- **Mapeamento:**

```
A (Data/Hora) → {{data_hora}}
B (Nome) → {{nome}}
C (Instagram) → {{instagram}}
D (Cidade) → {{cidade}}
E (Nicho) → {{nicho}}
F (Plataforma) → {{plataforma}}
G (Qtd Produtos) → {{qtd_produtos}}
H (Fornecedor) → {{fornecedor}}
I (Prazo) → {{prazo}}
J (Investimento) → {{investimento}}
K (Score) → {{score}}
L (Classificação) → {{classificacao}}
M (Status CRM) → Novo Lead
N (Telefone) → {{telefone}}
O (Último Contato) → {{data_hora}}
```

### Node 4 — Telegram (Lead Quente):

**Mensagem:**
```
🔥 NOVO LEAD QUENTE — Sety Studio

👤 Nome: {{nome}}
📱 Instagram: {{instagram}}
🏙️ Cidade: {{cidade}}
🎯 Nicho: {{nicho}}
🛒 Plataforma: {{plataforma}}
📦 Produtos: {{qtd_produtos}}
🏭 Fornecedor: {{fornecedor}}
⏰ Prazo: {{prazo}}
💰 Investimento: {{investimento}}

🎯 Score: {{score}}/100
📊 Status: {{emoji}} {{classificacao}}

📞 WhatsApp: https://wa.me/{{telefone}}
```

---

## 8. N8N — WORKFLOW 2: FOLLOW-UP AUTOMÁTICO

**Nome:** `Follow-up Leads Sety Studio`  
**Trigger:** Cron — a cada 1 hora

### Lógica:

```
1. Cron (a cada 1h)
2. Google Sheets (Read All Rows)
3. Function (Filtrar leads que precisam de follow-up)
4. Loop por cada lead
   └── IF → qual mensagem enviar?
       ├── 1h sem resposta → Mensagem 1
       ├── 24h sem resposta → Mensagem 2
       ├── 3 dias → Mensagem 3
       └── 7 dias → Mensagem 4
5. Evolution API (enviar mensagem via WhatsApp)
6. Google Sheets (atualizar coluna Último Contato)
```

### Node — Code (Filtrar leads para follow-up):

```javascript
const leads = $input.all();
const agora = new Date();
const resultado = [];

for (const lead of leads) {
  const ultimoContato = new Date(lead.json['Último Contato']);
  const diffHoras = (agora - ultimoContato) / (1000 * 60 * 60);
  const status = lead.json['Status CRM'];
  
  // Só fazer follow-up em leads que não fecharam/perderam
  if (['Fechado', 'Perdido'].includes(status)) continue;
  
  let mensagem = null;
  let etapa = null;
  
  // 1 hora (apenas uma vez)
  if (diffHoras >= 1 && diffHoras < 2 && !lead.json['followup_1h']) {
    etapa = '1h';
    mensagem = `Oi ${lead.json['Nome']}! 👋 Vi que você demonstrou interesse em ter sua loja online. Posso te ajudar com alguma dúvida agora?`;
  }
  // 24 horas
  else if (diffHoras >= 24 && diffHoras < 25 && !lead.json['followup_24h']) {
    etapa = '24h';
    mensagem = `${lead.json['Nome']}, vi que você ainda não respondeu. 😊 Estou aqui pra tirar dúvidas sobre como criar sua loja ${lead.json['Plataforma']}. Quando é um bom momento pra conversar?`;
  }
  // 3 dias
  else if (diffHoras >= 72 && diffHoras < 73 && !lead.json['followup_3d']) {
    etapa = '3d';
    mensagem = `Olá ${lead.json['Nome']}! Queria compartilhar um case de sucesso: uma loja do nicho ${lead.json['Nicho']} que lançamos recentemente. Posso te enviar os detalhes?`;
  }
  // 7 dias
  else if (diffHoras >= 168 && diffHoras < 169 && !lead.json['followup_7d']) {
    etapa = '7d';
    mensagem = `${lead.json['Nome']}, última mensagem da minha parte. 🙏 Sei que você estava pensando em criar sua loja. Se mudar de ideia ou tiver dúvidas, estou aqui. Abraço!`;
  }
  
  if (mensagem) {
    resultado.push({
      json: {
        ...lead.json,
        mensagem_followup: mensagem,
        etapa_followup: etapa
      }
    });
  }
}

return resultado;
```

### Mensagens de Follow-up (prontas):

**1 hora:**
> Oi {{nome}}! 👋 Vi que você demonstrou interesse em ter sua loja online. Posso te ajudar com alguma dúvida agora?

**24 horas:**
> {{nome}}, vi que você ainda não respondeu. 😊 Estou aqui pra tirar dúvidas sobre como criar sua loja {{plataforma}}. Quando é um bom momento pra conversar?

**3 dias:**
> Olá {{nome}}! Queria compartilhar um case de sucesso: uma loja do nicho {{nicho}} que lançamos recentemente. Posso te enviar os detalhes?

**7 dias (último contato):**
> {{nome}}, última mensagem da minha parte. 🙏 Sei que você estava pensando em criar sua loja. Se mudar de ideia ou tiver dúvidas, estou aqui. Abraço!

---

## 9. EVOLUTION API — CONFIGURAÇÃO

### 1. Criar instância

```bash
curl -X POST http://SEU_IP:8080/instance/create \
  -H "apikey: SUA_CHAVE" \
  -H "Content-Type: application/json" \
  -d '{
    "instanceName": "sety-studio",
    "qrcode": true,
    "integration": "WHATSAPP-BAILEYS"
  }'
```

### 2. Conectar WhatsApp (QR Code)

```bash
curl http://SEU_IP:8080/instance/connect/sety-studio \
  -H "apikey: SUA_CHAVE"
```
→ Escanear QR Code com WhatsApp Business

### 3. Configurar Webhook para Typebot

```bash
curl -X POST http://SEU_IP:8080/webhook/set/sety-studio \
  -H "apikey: SUA_CHAVE" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://typebot.io/api/v1/sendMessagePreviewBot",
    "webhook_by_events": false,
    "webhook_base64": false,
    "events": ["MESSAGES_UPSERT"]
  }'
```

### 4. Conectar Typebot ao Evolution API

No painel da Evolution API, ativar integração com Typebot:
- Typebot URL: `https://typebot.io` (ou self-hosted)
- Typebot ID: ID do seu bot
- Keyword: (vazio = qualquer mensagem inicia o bot)

---

## 10. TELEGRAM BOT — CONFIGURAÇÃO

### 1. Criar o bot

1. Abrir `@BotFather` no Telegram
2. `/newbot`
3. Nome: `Sety Studio Leads`
4. Username: `setyStudioLeadsBot`
5. Copiar o **token** gerado

### 2. Pegar seu Chat ID

1. Mandar qualquer mensagem pro bot
2. Acessar: `https://api.telegram.org/bot{TOKEN}/getUpdates`
3. Copiar o `chat.id` do seu usuário

### 3. Configurar no N8N

- Node: **Telegram**
- Credential: Token do BotFather
- Chat ID: seu Chat ID pessoal

---

## 11. CHECKLIST DE IMPLEMENTAÇÃO

### Fase 1 — Infraestrutura
- [ ] Contratar VPS (Hostinger/Hetzner)
- [ ] Instalar Docker e Docker Compose
- [ ] Subir Evolution API + N8N com docker-compose
- [ ] Conectar WhatsApp Business na Evolution API (QR Code)
- [ ] Criar Telegram Bot e anotar token + chat ID

### Fase 2 — Typebot
- [ ] Criar conta em typebot.io
- [ ] Montar fluxo com as 9 perguntas
- [ ] Configurar webhook final apontando para N8N
- [ ] Testar bot manualmente

### Fase 3 — Google Sheets
- [ ] Criar planilha "CRM Sety Studio"
- [ ] Criar abas LEADS e PIPELINE com colunas corretas
- [ ] Conectar Google Sheets no N8N (OAuth)

### Fase 4 — N8N
- [ ] Criar Workflow 1 (qualificação + score + notificação)
- [ ] Criar Workflow 2 (follow-up automático)
- [ ] Testar end-to-end com número real

### Fase 5 — Evolution API + Typebot
- [ ] Configurar webhook da Evolution API
- [ ] Conectar Evolution ao Typebot
- [ ] Testar: mandar mensagem → bot responder → dados no Sheets

### Fase 6 — Validação
- [ ] Enviar lead de teste pelo Meta Ads (ou simular)
- [ ] Verificar dados no Google Sheets
- [ ] Verificar notificação no Telegram
- [ ] Verificar follow-ups chegando nos horários certos

---

## 12. FLUXO COMPLETO — DIAGRAMA DETALHADO

```
CLIENTE CLICA NO ANÚNCIO DO META ADS
              ↓
    Abre WhatsApp Business
              ↓
    Manda "Oi" ou qualquer mensagem
              ↓
    Evolution API recebe → dispara Typebot
              ↓
    ┌─────────────────────────────────────┐
    │           TYPEBOT                   │
    │  P1: Nome                           │
    │  P2: Instagram                      │
    │  P3: Cidade                         │
    │  P4: Nicho                          │
    │  P5: Plataforma                     │
    │  P6: Qtd Produtos                   │
    │  P7: Fornecedor?                    │
    │  P8: Prazo                          │
    │  P9: Investimento                   │
    │  → "Perfeito! Em breve te contato"  │
    └─────────────────────────────────────┘
              ↓
    Webhook → N8N recebe os dados
              ↓
    ┌─────────────────────────────────────┐
    │           N8N WORKFLOW 1            │
    │  1. Calcular Score (0-100)          │
    │  2. Salvar Google Sheets            │
    │  3. Score ≥ 71?                     │
    │     SIM → Telegram: 🔥 Lead Quente  │
    │     NÃO → apenas salva             │
    └─────────────────────────────────────┘
              ↓
    ┌─────────────────────────────────────┐
    │           N8N WORKFLOW 2            │
    │  (roda a cada 1 hora)               │
    │  Verifica leads sem resposta        │
    │  1h  → Mensagem 1                   │
    │  24h → Mensagem 2                   │
    │  3d  → Mensagem 3                   │
    │  7d  → Mensagem 4 (último contato)  │
    └─────────────────────────────────────┘
              ↓
    VOCÊ RECEBE APENAS LEADS QUENTES
    (score ≥ 71) via Telegram
    
    Acessa Google Sheets para pipeline CRM
    e negocia diretamente com quem tem fit
```

---

## 13. CUSTO TOTAL

| Item | Custo |
|---|---|
| VPS (Hostinger KVM1 ou Hetzner CX22) | ~R$ 40-80/mês |
| Evolution API | Grátis |
| Typebot Cloud (free tier) | Grátis |
| N8N Self-hosted | Grátis |
| Google Sheets | Grátis |
| Telegram | Grátis |
| **TOTAL** | **~R$ 40-80/mês** |

---

## PRÓXIMO PASSO

Qual parte você quer começar?

1. **Infraestrutura** — subir VPS + Docker
2. **Typebot** — montar o bot de qualificação
3. **N8N** — importar os workflows
4. **Evolution API** — conectar WhatsApp

Recomendo a ordem 1 → 4 → 2 → 3.
