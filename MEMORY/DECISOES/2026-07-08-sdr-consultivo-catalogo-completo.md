# SDR do aurora-ia-crm vira consultor multi-serviço com catálogo à la carte (2026-07-08)

## Decisão

Reposicionar o `SDR_SYSTEM_PROMPT` (`saidas/aurora-ia-crm/src/lib/sdr-engine.ts`) de "vende sempre a Máquina de Crescimento como resposta universal" para "consultor que descobre o negócio primeiro e monta a solução com qualquer serviço do catálogo (Sety Studio + Sety Vision), sem forçar pacote". Ditado por Seven em 2026-07-08 com um novo prompt-base de referência.

## O que mudou em `sdr-engine.ts`

- Novo bloco **"🎯 DESCUBRA ANTES DE VENDER"**: pergunta o negócio, se já vende, se tem site, WhatsApp Business, anúncios, identidade visual — antes de recomendar qualquer coisa. Identifica o perfil do cliente (iniciando/crescendo/estruturada/grande, loja física, prestador de serviço, infoprodutor, e-commerce, dropshipping, indústria, clínica, restaurante, academia, advogado, dentista etc.).
- Catálogo completo listado explicitamente no prompt (Sety Studio: landing page, site institucional, loja Shopify/Nuvemshop, design, identidade visual, social media, motion, tráfego, SEO, GMN, CRO, hospedagem, manutenção; Sety Vision: automação WhatsApp, IA, CRM, follow-up, dashboard, integrações, agendamento).
- **"A VENDA É SEMPRE O SISTEMA"** (absolutista) virou **"A MÁQUINA DE CRESCIMENTO — UMA DAS SOLUÇÕES POSSÍVEIS"**: a Máquina só é recomendada quando o cliente precisa estruturar o processo comercial inteiro (2+ gargalos); pedido pontual é cotado direto, sem pré-condição de entender "a operação toda".
- **Tabela de preços avulsos** trocada de uma lista parcial (ranges tipo R$600-2.500) pela **tabela à la carte completa e validada** de `MEMORY/DECISOES/2026-07-03-atualizacao-tabela-precos.md` — que até então só estava aplicada no `uazapi-agent/system_prompt.txt`, nunca no aurora-ia-crm. Inclui também o Sety Vision SaaS puro (Start/Growth/Scale R$197/497/997, sem tráfego/site) como opção distinta dos planos da Máquina.
- Limite de linha por balão ajustado de "1-4" pra "1-2 linhas", alinhado ao que `message-formatting.ts` (`splitIntoBubbles`) já força deterministicamente no código independente do prompt (MAX_LINES_PER_BUBBLE=2, MAX_CHARS_PER_BUBBLE=250, MAX_BUBBLES=5).
- ⚡ MODO CLOSER mantido, mas só para ritmo/urgência com lead já quente — deixou de ser o mandato de vender sempre o sistema completo.

## Descoberta técnica relacionada

Verificado ao vivo via `GET /webhook` na instância `setystudio.uazapi.com`: o webhook real ainda aponta pro `aurora-ia-crm` (`https://aurora-ia-crm.vercel.app/api/webhook/whatsapp`), **não** pro `sety-vision-next` — apesar de uma decisão anterior (2026-07-07) ter dito que o aurora-ia-crm estava descontinuado. O `sety-vision-next` só armazena mensagens pro dashboard, não tem motor de resposta com IA. Ou seja, o `aurora-ia-crm` segue sendo o único motor que responde de fato no WhatsApp.

## Por quê

O prompt anterior gerava atrito em pedidos pontuais (ex: cliente só queria um site ou um logo) — o bot insistia em entender "a operação inteira" antes de cotar algo simples, o que não faz sentido pra quem só quer uma peça isolada. A tabela à la carte já existia validada desde 07-03 mas nunca tinha sido replicada pro aurora-ia-crm, causando inconsistência de preços entre os dois motores de bot do repo.

## Onde foi aplicado

- `saidas/aurora-ia-crm/src/lib/sdr-engine.ts` — `SDR_SYSTEM_PROMPT`.
- Memória: `project_aurora_maquina_crescimento` e `project_bot_whatsapp_canonico` (auto-memory do Claude Code).
