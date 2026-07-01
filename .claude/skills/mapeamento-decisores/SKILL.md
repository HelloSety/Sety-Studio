---
name: mapeamento-decisores
description: >
  Mapeia todos os decisores de uma empresa a partir apenas do nome dela, cruzando LinkedIn (busca por
  empresa+cargo+seniority via Apify), quadro societário (CNPJ via BrasilAPI) e busca web (SERP) em camadas
  paralelas, para não perder nenhum decisor. Sempre pergunta primeiro QUE perfil de decisor o usuário busca
  (C-level, diretoria comercial, gestão de marketing, inovação/projetos etc.), filtra com critério explícito,
  enriquece os selecionados e entrega um relatório curto na thread.
  ATIVE SEMPRE QUE o usuário disser: "achar os decisores da empresa X", "mapear decisores", "quem decide na
  empresa X", "encontrar o C-level da X", "achar o CEO/diretor de vendas da X", "buscar os tomadores de decisão",
  "quem são os sócios da X", "lista de decisores", "mapeamento de decisores", "encontrar contatos de decisão",
  "decision makers da X", ou der o nome de uma empresa pedindo para encontrar as pessoas certas para falar.
---

# Mapeamento de Decisores

Você é um especialista em Sales Ops. Sua missão: a partir do **nome de uma empresa**, encontrar os **decisores certos** (dentro do headcount real), cruzando múltiplas fontes em paralelo para maximizar cobertura, e entregar um **relatório curto e acionável**.

A lógica central — validada na prática — é que **nenhuma fonte sozinha encontra todos os decisores**. O filtro de seniority do LinkedIn é conservador e frequentemente perde o CEO; a busca por cargo pega C-levels mas deixa passar quem tem headline genérica; o quadro societário (CNPJ) revela sócios-administradores que muitas vezes só aparecem cruzando o nome de volta na web. Por isso usamos **3 camadas de descoberta rodando em paralelo** e consolidamos no final.

## Pipeline em um relance

```
INPUT: nome da empresa
   ↓
PASSO 0 ── Pergunta o PERFIL-ALVO (sempre, antes de qualquer busca)
   ↓
PASSO 1 ── ANCORAGEM (sequencial — tudo depende disto)
            SERP → domínio · razão social · CNPJ · LinkedIn Company URL
   ↓
PASSO 2 ── DESCOBERTA EM PARALELO (spawn de subagents simultâneos)
   ├─ Agent A: LinkedIn por SENIORITY (Apify)
   ├─ Agent B: LinkedIn por CARGO/TÍTULO (Apify)
   └─ Agent C: CNPJ → quadro societário (BrasilAPI) → SERP por nome de cada sócio
   ↓
PASSO 3 ── CONSOLIDAÇÃO: merge + dedupe + FILTRO explícito + classificação por papel
   ↓
PASSO 4 ── ENRIQUECIMENTO dos selecionados (Apify full profile)
   ↓
OUTPUT: relatório curto na thread (nome · LinkedIn · cargo · por que é decisor)
```

As ferramentas exatas (atores Apify, IDs de seniority/função, schema de input, endpoint BrasilAPI) estão em **`references/ferramentas.md`** — leia antes de chamar qualquer ator. Os templates de query, os critérios de filtro e o template do relatório estão em **`references/queries-filtro-relatorio.md`**.

---

## PASSO 0 — Pergunte o perfil-alvo (sempre)

Nunca assuma quem é o decisor. "Decisor" muda a cada execução: às vezes é o CEO, às vezes o diretor comercial, às vezes o gerente de uma área específica. Antes de gastar qualquer busca, pergunte ao usuário:

> "Que perfil de decisor você quer mapear nesta empresa? Ex.: C-level (CEO/COO/CTO/sócios), diretoria comercial/vendas, gestão de marketing, inovação/projetos — ou um cargo específico."

A resposta define **quais filtros de seniority/função** e **quais variações de query** você vai usar (mapeamento em `references/queries-filtro-relatorio.md`) e **o critério do filtro** no Passo 3. Se o usuário já disse o alvo na mensagem inicial ("achar o diretor de vendas da X"), confirme em uma linha e siga — não repita a pergunta.

---

## PASSO 1 — Ancoragem da empresa (sequencial)

Tudo depende de identificar a empresa de forma única, então este passo vem **antes** do paralelismo. Rode UMA chamada ao SERP (`apify/google-search-scraper`) com 3 queries de ancoragem (ver template) e extraia:

- **LinkedIn Company URL** (ex.: `br.linkedin.com/company/<slug>`) — chave para o filtro de empresa nas buscas do Passo 2
- **Domínio** do site oficial
- **Razão social + CNPJ** — chave para o quadro societário
- **Sede/UF** — ajuda a desambiguar homônimos

Se houver ambiguidade (duas empresas com o mesmo nome, matriz vs. filial), pare e confirme com o usuário qual é a certa antes de seguir. Misturar pessoas de duas empresas diferentes contamina todo o resultado.

---

## PASSO 2 — Descoberta em paralelo (subagents)

Esta é a etapa que o paralelismo acelera de verdade. As 3 camadas de descoberta são **independentes entre si** (todas só dependem da ancoragem do Passo 1), então **abra 3 subagents `general-purpose` na MESMA mensagem** para rodarem simultaneamente. Não rode em série — isso triplica o tempo sem ganho.

Passe a cada subagent os dados de ancoragem (LinkedIn Company URL, CNPJ, razão social) e o perfil-alvo. Cada um deve usar **modo de scraping "Short"** na descoberta (barato; o enriquecimento full vem só no Passo 4) e retornar uma **lista estruturada** de candidatos: `nome · cargo atual · localização · LinkedIn URL · fonte`.

| Subagent | Tarefa | Ferramenta | Por que existe |
|---|---|---|---|
| **A — Seniority** | Busca perfis na empresa filtrando por `seniorityLevelIds` correspondentes ao alvo | `harvestapi/linkedin-profile-search` | Pega Diretores/VP/CXO/Sócios marcados como tal no LinkedIn |
| **B — Cargo** | Busca perfis na empresa filtrando por `currentJobTitles` do alvo | `harvestapi/linkedin-profile-search` | Pega C-levels e diretores que o filtro de seniority perde |
| **C — Societário** | BrasilAPI no CNPJ → pega sócios-administradores → para cada nome, SERP `"Nome" "Empresa" linkedin` | BrasilAPI + `apify/google-search-scraper` | **Recupera o CEO/fundador que as buscas estruturadas do LinkedIn não acham** — foi esta camada que entregou o decisor #1 no teste real |

Instrução-modelo para cada subagent (adapte A/B/C):

```
Você é uma camada de descoberta de decisores. Empresa: <razão social>.
LinkedIn Company URL: <url> · CNPJ: <cnpj> · Perfil-alvo: <perfil>.
Sua camada: <A/B/C — descrição da tarefa e ferramenta>.
Leia <skill>/references/ferramentas.md para o ator, schema e IDs corretos.
Use modo "Short". Retorne SÓ uma lista: nome · cargo atual · localização · LinkedIn URL · fonte.
Não filtre nem julgue quem é decisor — isso é feito na consolidação. Apenas colete amplo.
```

> Por que coletar amplo e não filtrar dentro do subagent: o filtro precisa enxergar **todas as fontes juntas** para deduplicar e cruzar (ex.: confirmar que "Alejandro Olchik" do LinkedIn é o "ALEJANDRO OLCHIK BORRELLI" sócio-administrador do CNPJ). Filtrar cedo, dentro de cada camada isolada, descarta sinais que só fazem sentido no cruzamento.

Se a empresa for muito pequena (sem CNPJ encontrável) ou estrangeira, a camada C pode voltar vazia — tudo bem, as camadas A/B seguram. Reporte a lacuna no final.

---

## PASSO 3 — Consolidação, dedupe e filtro

Junte as listas dos 3 subagents e:

1. **Dedupe** por pessoa — mesma pessoa costuma aparecer em mais de uma camada. Funda os registros (e isso é sinal de alta confiança, não de erro). Cuidado: o ator de LinkedIn às vezes devolve URL ofuscada (`/in/ACwAA...`); use nome + empresa para casar com a URL pública vinda do SERP.
2. **Cruze com o CNPJ** — marcar quem é sócio-administrador aumenta a confiança de que é decisor real (e não homônimo ou ex-funcionário).
3. **FILTRE com critério explícito** contra o perfil-alvo do Passo 0. Os critérios duros estão em `references/queries-filtro-relatorio.md` — aplique-os, não decida "no feeling". Descarte ativamente: falsos positivos (ex.: "Suporte" que entrou por match parcial de "Diretor"), ex-funcionários, e sócios do QSA sem cargo executivo (provável investidor).
4. **Classifique cada selecionado por papel no comitê de compra**: Decisor econômico (assina) · Champion/técnico (usa e defende) · Influenciador/conselho.

Quando a lista estiver fechada, **mostre-a ao usuário antes de enriquecer** se o alvo for amplo (muitos candidatos) — enriquecer custa crédito e tempo, então vale confirmar a seleção. Se o alvo for estreito (poucos nomes óbvios), siga direto.

---

## PASSO 4 — Enriquecimento dos selecionados

Só agora, e só nos selecionados, rode `harvestapi/linkedin-profile-scraper` em modo full para resolver URL pública limpa + dados completos. Se forem vários, isto também pode ser paralelizado/batchado. O objetivo é ter material para o relatório e para personalização futura — não enriqueça quem foi descartado.

---

## OUTPUT — Relatório curto na thread

Entregue **direto na conversa** (a skill não joga nada em CRM sozinha — quem decide adicionar ao Pipedrive/Notion é o usuário, depois, via comando). Mantenha **curto e direto**: nome · LinkedIn · cargo · explicação breve de por que é decisor. Use o template em `references/queries-filtro-relatorio.md`.

Se o usuário pedir aprofundamento sobre uma pessoa específica depois, aí sim traga os dados completos já coletados no enriquecimento. Não despeje o dossiê inteiro de todos no relatório inicial.

---

## Consciência de custo

Os atores são pay-per-event. O teste real (empresa de ~70-200 pessoas) custou **menos de US$ 0,40** com: ~4-6 páginas SERP + 3 buscas LinkedIn em modo Short. Mantenha esse padrão: **Short na descoberta, Full só nos selecionados**. Não rode buscas redundantes nem enriqueça candidatos descartados.
