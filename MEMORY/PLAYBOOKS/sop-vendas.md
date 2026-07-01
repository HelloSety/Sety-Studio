# SOP de Vendas â€” Sety Studio

Processo padrÃ£o do primeiro contato ao contrato assinado.

## Oferta Ãºnica

**Sistema Comercial Inteligente**
Setup R$3.500â€“5.000 + R$1.500â€“2.500/mÃªs

---

## ETAPA 1 â€” ProspecÃ§Ã£o (dia 1)

**Fonte A â€” Google Maps (principal)**
1. Scraper Google Maps â†’ nicho + cidade (ex: "clÃ­nica odontolÃ³gica BelÃ©m")
2. Exportar CSV: nome, telefone, WhatsApp, website
3. Filtrar: nota â‰¥ 4.0, pelo menos 10 reviews, tem website

**Fonte B â€” LinkedIn**
1. `/mapeamento-decisores` â†’ encontrar dono/sÃ³cio
2. `/linkedin-prospecting-dm` â†’ gerar 6 variaÃ§Ãµes de DM
3. Disparar via Unipile ou manualmente

**Volume diÃ¡rio:** 20â€“40 contatos por canal

---

## ETAPA 2 â€” Primeiro Contato

**WhatsApp (mais rÃ¡pido para clÃ­nicas):**
> "OlÃ¡ [Nome], vi a [ClÃ­nica X] no Google e notei que vocÃªs tÃªm Ã³tima reputaÃ§Ã£o. Trabalho com automaÃ§Ã£o comercial para clÃ­nicas â€” instalamos um sistema que responde leads automaticamente e organiza tudo no CRM. Em 15 minutos consigo mostrar como funciona. Faz sentido pra vocÃªs?"

**LinkedIn DM:**
Usar variaÃ§Ã£o gerada pelo `/linkedin-prospecting-dm`

**Regras:**
- Primeiro contato: apresentaÃ§Ã£o + dor + pergunta
- Nunca mandar link ou preÃ§o no primeiro contato
- Personalizar com nome da clÃ­nica sempre

---

## ETAPA 3 â€” Call de Descoberta (30 min)

**Antes:** Rodar `/call-prep` com nome da empresa + decisor

**Roteiro:**
1. (5 min) Quebra-gelo â€” como estÃ¡ o movimento da clÃ­nica?
2. (10 min) Descoberta â€” como chegam os leads hoje? Quantos perdem por falta de resposta? Tem CRM?
3. (10 min) ApresentaÃ§Ã£o â€” mostrar o sistema (print do Aurora IA ou demo)
4. (5 min) Proposta verbal â€” "Para uma clÃ­nica do seu tamanho, a gente faz por R$X de setup e R$Y/mÃªs"

**Sinais de compra:** "quanto custa?", "como funciona?", "quando comeÃ§a?", "vocÃªs atendem aqui em [cidade]?"

---

## ETAPA 4 â€” Proposta (enviar em atÃ© 24h apÃ³s a call)

**Template:** `propostas/<cliente>-<YYYY-MM-DD>.html`
**Estrutura (3 pÃ¡ginas):**
1. Capa: nome do cliente, data, logo Sety Studio
2. Escopo: o que serÃ¡ entregue (CRM + automaÃ§Ã£o WhatsApp + IA + dashboard)
3. Investimento: setup + mensalidade + condiÃ§Ãµes

**Prazo de decisÃ£o:** 3 dias Ãºteis (nÃ£o deixar em aberto)

---

## ETAPA 5 â€” Follow-up

| Dia | AÃ§Ã£o |
|---|---|
| D+0 | Enviar proposta por email + WhatsApp |
| D+2 | "Conseguiu ver a proposta? Alguma dÃºvida?" |
| D+5 | "SÃ³ confirmando o interesse â€” posso manter essa proposta aberta atÃ© sexta?" |
| D+10 | "Vou encerrar essa proposta â€” quer reagendar uma conversa antes?" |
| D+15 | Mover para "perdido" no CRM. Reativar em 30 dias. |

---

## ETAPA 6 â€” Fechamento

1. Cliente aceita â†’ enviar contrato simples (Google Docs) + boleto/Pix do setup
2. Setup pago â†’ iniciar onboarding (ver SOP de Onboarding)
3. Criar pasta `clientes/<Nome>/` no Sety Vision
4. Registrar no HubSpot como Won
5. Agendar kick-off em 48h

---

## ETAPA 7 â€” PÃ³s-venda (case)

1. ApÃ³s 30 dias de entrega â†’ coletar depoimento
2. Documentar resultado (leads gerados, tempo economizado, conversÃ£o)
3. Transformar em: carrossel, post, estudo de caso
4. Adicionar ao portfÃ³lio e ao Commander (seÃ§Ã£o Cases)

---

## MÃ©tricas semanais

| MÃ©trica | Meta/semana |
|---|---|
| Contatos feitos (WhatsApp + LinkedIn) | 40â€“80 |
| Respostas recebidas | 8â€“16 (10â€“20%) |
| Calls realizadas | 3â€“6 |
| Propostas enviadas | 1â€“3 |
| Fechamentos | 1 a cada 2 semanas |

---

## CRM (HubSpot + Commander)

Etapas do pipeline:
1. Prospectando
2. Contato feito
3. Call agendada
4. Proposta enviada
5. NegociaÃ§Ã£o
6. Fechado âœ“
7. Perdido (com motivo)

**Regra:** Todo lead contato entra no pipeline no mesmo dia.
