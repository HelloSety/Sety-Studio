# Playbook: Automação de WhatsApp para Captação de Leads

**Stack:** Evolution API + Typebot + N8N + Google Sheets + Telegram  
**Custo:** ~R$ 40-80/mês (só VPS)  
**Tempo de setup:** ~4-6h na primeira vez, ~1h em projetos futuros  
**Validado em:** Sety Studio (Jun/2026)

---

## Arquitetura

```
Meta Ads → WhatsApp → Evolution API → Typebot (qualificação) 
→ N8N → Google Sheets + Telegram (lead quente)
→ N8N follow-up automático (1h / 24h / 3d / 7d)
```

---

## Componentes

| Ferramenta | Função | Custo |
|---|---|---|
| VPS (Hostinger KVM1 / Hetzner CX22) | Infraestrutura | ~R$ 40-80/mês |
| Evolution API | Conectar WhatsApp | Grátis |
| Typebot Cloud | Bot de qualificação | Grátis (free tier) |
| N8N self-hosted | Orquestração | Grátis |
| Google Sheets | CRM | Grátis |
| Telegram Bot | Alertas leads quentes | Grátis |

**VPS mínima:** 2 vCPU, 4GB RAM, 40GB SSD, Ubuntu 22.04

---

## Sistema de Score (0–100)

| Critério | Peso |
|---|---|
| Prazo ("o mais rápido possível") | 25 pts |
| Investimento (acima de R$ 3.000) | 25 pts |
| Tem fornecedor | 20 pts |
| Qtd produtos (50+) | 15 pts |
| Plataforma (Shopify) | 15 pts |

| Score | Classificação | Ação |
|---|---|---|
| 71–100 | 🔥 Lead Quente | Alerta Telegram imediato |
| 41–70 | 🌡️ Lead Morno | Follow-up automático |
| 0–40 | ❄️ Lead Frio | Follow-up long-term |

---

## Follow-up Automático

| Quando | Mensagem |
|---|---|
| 1h sem resposta | "Posso te ajudar com alguma dúvida agora?" |
| 24h | "Quando é um bom momento pra conversar?" |
| 3 dias | "Tenho um case de sucesso do seu nicho pra te mostrar" |
| 7 dias | Última mensagem — encerramento gentil |

---

## Sequência de Setup

1. Contratar VPS → instalar Docker + Docker Compose
2. Subir Evolution API + N8N via docker-compose
3. Conectar WhatsApp Business (QR Code na Evolution API)
4. Criar Typebot com as 9 perguntas de qualificação
5. Configurar webhook Typebot → N8N
6. Criar Google Sheets com colunas de CRM
7. Conectar N8N ao Google Sheets (OAuth)
8. Criar Telegram Bot (@BotFather) + anotar token + chat ID
9. Montar Workflow 1 (score + salvar + alertar)
10. Montar Workflow 2 (follow-up cron a cada 1h)
11. Testar end-to-end com número real

---

## Arquivos de referência

- Documentação completa: `saidas/automacao-whatsapp-sety.md`
- Docker VPS: `sety-automation/docker/docker-compose.yml`
- Scripts VPS: `saidas/vps-aurora-setup/setup.sh`

---

## Replicar para novo cliente

1. Copiar docker-compose e ajustar variáveis de ambiente
2. Adaptar as 9 perguntas do Typebot para o nicho do cliente
3. Ajustar os pesos do score conforme o perfil de cliente ideal
4. Atualizar mensagens de follow-up com o nome da marca
5. Criar nova planilha Google Sheets
6. Apontar webhooks para a nova instância
