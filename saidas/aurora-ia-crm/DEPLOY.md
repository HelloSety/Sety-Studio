# Aurora IA CRM — Guia de Deploy

**Stack:** Next.js 16 + Supabase + Z-API + Claude (Anthropic)  
**Hospedagem:** Netlify (configurado via netlify.toml)  
**Tempo estimado:** 30–45 minutos

---

## Pré-requisitos

- Conta em [supabase.com](https://supabase.com) (grátis)
- Conta em [netlify.com](https://netlify.com) (grátis)
- Z-API: instância já configurada (credenciais estão no .env.example)
- ANTHROPIC_API_KEY (Claude)

---

## Passo 1 — Criar projeto no Supabase

1. Acessar [supabase.com](https://supabase.com) → New Project
2. Nome: `aurora-ia-crm`
3. Password: gerar senha forte (salvar em lugar seguro)
4. Region: South America (São Paulo)
5. Clicar em **Create new project** — aguardar ~2 min

---

## Passo 2 — Executar o schema

1. No painel do Supabase, ir em **SQL Editor**
2. Clicar em **New query**
3. Copiar o conteúdo de `supabase/schema.sql`
4. Colar e clicar em **Run**
5. Verificar: deve criar as tabelas `leads`, `messages`, `notifications`, etc.

---

## Passo 3 — Pegar as credenciais do Supabase

No painel do Supabase → **Project Settings** → **API**:

| Variável | Onde pegar |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL (ex: https://xyzxyz.supabase.co) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon public key |
| `SUPABASE_SERVICE_ROLE_KEY` | service_role secret key |

---

## Passo 4 — Criar .env.local

Na pasta `saidas/aurora-ia-crm/`, criar o arquivo `.env.local`:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://XXXX.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Z-API (WhatsApp) — credenciais já conhecidas
ZAPI_INSTANCE_ID=3F513391995B6228E2EA0E47AC50613B
ZAPI_TOKEN=7A012056945828DC8E88E7D5

# Claude (Anthropic)
ANTHROPIC_API_KEY=sk-ant-api03-...

# Segurança do webhook
WEBHOOK_SECRET=gerar-string-aleatoria-aqui

# Seu WhatsApp (recebe alertas de lead quente)
RESPONSIBLE_PHONE=559...

# URL do CRM em produção
NEXT_PUBLIC_APP_URL=https://aurora-crm.netlify.app
```

---

## Passo 5 — Testar localmente

```bash
cd saidas/aurora-ia-crm
npm install
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000) e verificar:
- [ ] Dashboard carrega
- [ ] Tela de leads abre
- [ ] Tela de conversas abre
- [ ] Analytics carrega

---

## Passo 6 — Deploy no Netlify

### Via Netlify CLI (recomendado)

```bash
npm install -g netlify-cli
cd saidas/aurora-ia-crm
netlify login
netlify init
netlify deploy --prod
```

### Via Netlify UI (alternativa)

1. Acessar [netlify.com](https://app.netlify.com) → Add new site → Deploy manually
2. Fazer build local: `npm run build`
3. Arrastar a pasta `.next` para o Netlify

### Configurar variáveis de ambiente no Netlify

Site Settings → Environment variables → Add variable

Adicionar todas as variáveis do `.env.local` (exceto `NEXT_PUBLIC_APP_URL` que deve apontar pro domínio do Netlify).

---

## Passo 7 — Configurar webhook do Z-API

Após o deploy, configurar o webhook de recebimento de mensagens:

No painel do Z-API → Webhook:
- URL: `https://SEU-DOMINIO.netlify.app/api/webhook/whatsapp`
- Eventos: mensagens recebidas

---

## Checklist final

- [ ] Schema executado no Supabase (tabelas criadas)
- [ ] `.env.local` com todas as credenciais
- [ ] `npm run dev` funciona localmente
- [ ] Deploy feito no Netlify
- [ ] Variáveis de ambiente configuradas no Netlify
- [ ] Webhook do Z-API apontando para a URL de produção
- [ ] Testar receber mensagem e aparecer no CRM

---

## Domínio personalizado (opcional)

Netlify → Domain management → Add custom domain  
Sugestões: `crm.setystudio.com.br` ou `aurora.setystudio.com.br`

---

## Custos

| Item | Custo |
|---|---|
| Supabase (free tier) | Grátis até 500MB / 50k req |
| Netlify (free tier) | Grátis até 100GB bandwidth |
| Z-API | Conforme plano contratado |
| Anthropic (Claude API) | Pay-per-use (~R$ 0,01-0,05 por conversa) |
| **Total fixo** | **Grátis** (paga só Claude por uso) |
