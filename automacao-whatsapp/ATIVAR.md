# ATIVAR — Guia de Ativação em Ordem

Siga exatamente nesta ordem. Cada passo depende do anterior.

---

## PASSO 1 — Contratar VPS

**Recomendado:** Hostinger KVM2 (~R$ 50/mês) ou Hetzner CX22 (~R$ 35/mês)
- Ubuntu 22.04
- IP estático
- Anotar o IP público

---

## PASSO 2 — Instalar Docker na VPS

```bash
ssh root@SEU_IP
curl -fsSL https://get.docker.com | sh
curl -SL https://github.com/docker/compose/releases/latest/download/docker-compose-linux-x86_64 -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
```

---

## PASSO 3 — Subir os serviços

```bash
# Copiar arquivos para a VPS
scp -r automacao-whatsapp/ root@SEU_IP:/opt/sety/

# Na VPS
cd /opt/sety/automacao-whatsapp
cp .env.example .env
nano .env   # preencher SERVER_IP, senhas, etc.
docker-compose up -d
docker-compose ps  # verificar se todos estão "Up"
```

---

## PASSO 4 — Criar planilha Google Sheets

1. Acessar **script.google.com**
2. Criar novo projeto → colar conteúdo de `scripts/criar-planilha.js`
3. Executar `criarPlanilha`
4. Copiar o ID gerado → colar em `.env` como `GOOGLE_SHEET_ID`

---

## PASSO 5 — Criar bot Telegram

```
1. Abrir @BotFather no Telegram
2. Enviar: /newbot
3. Nome: Sety Studio Leads
4. Username: setyStudioLeadsBot (ou outro disponível)
5. Copiar o TOKEN gerado → TELEGRAM_BOT_TOKEN no .env
6. Mandar qualquer mensagem pro bot criado
7. Acessar: https://api.telegram.org/bot{TOKEN}/getUpdates
8. Copiar o "id" do campo "chat" → TELEGRAM_CHAT_ID no .env
```

Reiniciar após atualizar .env:
```bash
docker-compose restart n8n evolution
```

---

## PASSO 6 — Conectar WhatsApp

```bash
# Na VPS
cd /opt/sety/automacao-whatsapp
bash scripts/configurar-evolution.sh
```

Ele vai:
1. Criar a instância
2. Mostrar o QR Code (escanear com WhatsApp Business)
3. Conectar ao Typebot
4. Configurar webhook → N8N

---

## PASSO 7 — Criar bot Typebot

1. Acessar **typebot.io** → criar conta
2. Criar novo Typebot → **Import** → selecionar `typebot/fluxo-sety.json`
3. Na aba de blocos, atualizar o webhook final:
   - Trocar `http://SEU_IP:5678` pelo IP real da VPS
4. Publicar o bot (botão Publish)
5. Copiar o **ID do bot** (aparece na URL) → `TYPEBOT_BOT_ID` no `.env`
6. Reiniciar: `docker-compose restart evolution`

---

## PASSO 8 — Importar workflows N8N

1. Acessar `http://SEU_IP:5678` (login: usuário/senha do .env)
2. Menu → **Import from File**
3. Importar `n8n/workflow-qualificacao.json`
4. Importar `n8n/workflow-followup.json`
5. Em cada workflow:
   - Conectar credencial **Google Sheets** (OAuth com sua conta Google)
   - Conectar credencial **Telegram** (colar o token do BotFather)
   - Verificar variáveis de ambiente (`$env.GOOGLE_SHEET_ID`, etc.)
6. Ativar os dois workflows (toggle ON)

---

## PASSO 9 — Teste end-to-end

1. Mandar "Oi" para o número WhatsApp conectado
2. Bot deve responder e fazer as 9 perguntas
3. Ao finalizar, verificar:
   - Lead salvo no Google Sheets (aba LEADS)
   - Se score >= 71, notificação no Telegram
4. Sucesso!

---

## CHECKLIST FINAL

- [ ] VPS contratada e com Docker rodando
- [ ] `docker-compose up -d` (todos os containers Up)
- [ ] Planilha Google Sheets criada
- [ ] Bot Telegram criado e token configurado
- [ ] WhatsApp Business conectado (QR Code escaneado)
- [ ] Typebot importado e publicado
- [ ] Workflows N8N importados e ativos
- [ ] Teste end-to-end aprovado
