# Campanha: Qualificação de Leads E-commerce via Typebot + N8N

**Objetivo:** Qualificar leads de e-commerce vindos de Meta Ads via WhatsApp  
**Nicho testado:** E-commerce (Shopify / Nuvemshop)  
**Canal:** Meta Ads → WhatsApp → Bot de qualificação  
**Status:** Fluxo documentado, pronto para implementar  
**Data:** Jun/2026

---

## Funil

```
Meta Ads (CTA: fale no WhatsApp)
   ↓
WhatsApp Business
   ↓
Bot Typebot — 9 perguntas (< 2 min)
   ↓
N8N — Score 0-100
   ↓
Score ≥ 71 → Seven recebe alerta no Telegram
Score < 71 → Follow-up automático (1h / 24h / 3d / 7d)
```

---

## 9 perguntas de qualificação

1. Nome
2. Instagram
3. Cidade
4. Nicho do e-commerce
5. Plataforma (Shopify / Nuvemshop / Não sei)
6. Qtd de produtos
7. Tem fornecedor?
8. Prazo para lançar
9. Faixa de investimento

---

## Score — pesos

| Variável | Valor máximo | Melhor resposta |
|---|---|---|
| Prazo | 25 pts | "o mais rápido possível" |
| Investimento | 25 pts | "Acima de R$ 3.000" |
| Fornecedor | 20 pts | "Sim, já tenho" |
| Qtd produtos | 15 pts | "Mais de 50" |
| Plataforma | 15 pts | "Shopify" |

---

## Resultado esperado

- Leads frios nunca chegam ao Seven
- Apenas leads com score ≥ 71 geram notificação
- Follow-up automático aquece os mornos sem esforço manual

---

## O que funcionou

- Score simples e direto — fácil de ajustar por nicho
- Mensagem de encerramento no bot gera boa percepção ("nossa equipe vai entrar em contato")
- Telegram como canal de alerta é instantâneo e prático

---

## Como adaptar para outro nicho

- Trocar as opções da P4 (nicho) e P6 (quantidade/volume)
- Ajustar perguntas 5-9 para o contexto do serviço (ex: para clínicas: especialidade, nº de pacientes/mês, cidade, ticket médio, urgência)
- Recalibrar os pesos do score conforme o ICP do cliente

---

## Referência completa

`saidas/automacao-whatsapp-sety.md` — todo o código N8N, Typebot, Evolution API e Google Sheets documentado.
