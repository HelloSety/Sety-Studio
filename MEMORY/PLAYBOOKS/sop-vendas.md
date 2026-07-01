# SOP de Vendas — Sety Studio

Processo padrão do primeiro contato ao contrato assinado.

## Oferta única

**Sistema Comercial Inteligente**
Setup R$3.500–5.000 + R$1.500–2.500/mês

---

## ETAPA 1 — Prospecção (dia 1)

**Fonte A — Google Maps (principal)**
1. Scraper Google Maps → nicho + cidade (ex: "clínica odontológica Belém")
2. Exportar CSV: nome, telefone, WhatsApp, website
3. Filtrar: nota ≥ 4.0, pelo menos 10 reviews, tem website

**Fonte B — LinkedIn**
1. `/mapeamento-decisores` → encontrar dono/sócio
2. `/linkedin-prospecting-dm` → gerar 6 variações de DM
3. Disparar via Unipile ou manualmente

**Volume diário:** 20–40 contatos por canal

---

## ETAPA 2 — Primeiro Contato

**WhatsApp (mais rápido para clínicas):**
> "Olá [Nome], vi a [Clínica X] no Google e notei que vocês têm ótima reputação. Trabalho com automação comercial para clínicas — instalamos um sistema que responde leads automaticamente e organiza tudo no CRM. Em 15 minutos consigo mostrar como funciona. Faz sentido pra vocês?"

**LinkedIn DM:**
Usar variação gerada pelo `/linkedin-prospecting-dm`

**Regras:**
- Primeiro contato: apresentação + dor + pergunta
- Nunca mandar link ou preço no primeiro contato
- Personalizar com nome da clínica sempre

---

## ETAPA 3 — Call de Descoberta (30 min)

**Antes:** Rodar `/call-prep` com nome da empresa + decisor

**Roteiro:**
1. (5 min) Quebra-gelo — como está o movimento da clínica?
2. (10 min) Descoberta — como chegam os leads hoje? Quantos perdem por falta de resposta? Tem CRM?
3. (10 min) Apresentação — mostrar o sistema (print do Aurora IA ou demo)
4. (5 min) Proposta verbal — "Para uma clínica do seu tamanho, a gente faz por R$X de setup e R$Y/mês"

**Sinais de compra:** "quanto custa?", "como funciona?", "quando começa?", "vocês atendem aqui em [cidade]?"

---

## ETAPA 4 — Proposta (enviar em até 24h após a call)

**Template:** `propostas/<cliente>-<YYYY-MM-DD>.html`
**Estrutura (3 páginas):**
1. Capa: nome do cliente, data, logo Sety Studio
2. Escopo: o que será entregue (CRM + automação WhatsApp + IA + dashboard)
3. Investimento: setup + mensalidade + condições

**Prazo de decisão:** 3 dias úteis (não deixar em aberto)

---

## ETAPA 5 — Follow-up

| Dia | Ação |
|---|---|
| D+0 | Enviar proposta por email + WhatsApp |
| D+2 | "Conseguiu ver a proposta? Alguma dúvida?" |
| D+5 | "Só confirmando o interesse — posso manter essa proposta aberta até sexta?" |
| D+10 | "Vou encerrar essa proposta — quer reagendar uma conversa antes?" |
| D+15 | Mover para "perdido" no CRM. Reativar em 30 dias. |

---

## ETAPA 6 — Fechamento

1. Cliente aceita → enviar contrato simples (Google Docs) + boleto/Pix do setup
2. Setup pago → iniciar onboarding (ver SOP de Onboarding)
3. Criar pasta `clientes/<Nome>/` no MazyOS
4. Registrar no HubSpot como Won
5. Agendar kick-off em 48h

---

## ETAPA 7 — Pós-venda (case)

1. Após 30 dias de entrega → coletar depoimento
2. Documentar resultado (leads gerados, tempo economizado, conversão)
3. Transformar em: carrossel, post, estudo de caso
4. Adicionar ao portfólio e ao Commander (seção Cases)

---

## Métricas semanais

| Métrica | Meta/semana |
|---|---|
| Contatos feitos (WhatsApp + LinkedIn) | 40–80 |
| Respostas recebidas | 8–16 (10–20%) |
| Calls realizadas | 3–6 |
| Propostas enviadas | 1–3 |
| Fechamentos | 1 a cada 2 semanas |

---

## CRM (HubSpot + Commander)

Etapas do pipeline:
1. Prospectando
2. Contato feito
3. Call agendada
4. Proposta enviada
5. Negociação
6. Fechado ✓
7. Perdido (com motivo)

**Regra:** Todo lead contato entra no pipeline no mesmo dia.
