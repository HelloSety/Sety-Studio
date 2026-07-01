# Mega Operação de Prospecção B2B — Sety Studio

Fluxo completo de geração e conversão de leads combinando Google Maps, LinkedIn e IA.

## Visão Geral

```
GOOGLE MAPS SCRAPER
       ↓
  [CSV Central]  ←——————————————————————————————————
       ↓                                            |
/mapeamento-decisores  →  Nome Decisor + LinkedIn   |
       ↓                                            |
/linkedin-prospecting-dm  →  6 DMs personalizadas   |
       ↓                                            |
Unipile MCP  →  envia convite/DM no LinkedIn        |
       ↓                                            |
/linkedin-post-engagers  →  leads quentes extras ———|
       ↓
/call-prep  →  briefing antes da call
       ↓
/crm-autofill  →  atualiza HubSpot com o resultado
       ↓
/filtro_de_cagada  →  auditoria semanal do funil
       ↓
/crm-forecasting  →  forecast de receita
```

## O CSV Central

Arquivo: `saidas/prospeccao/template-leads.csv`

| Coluna | Fonte | Skill responsável |
|---|---|---|
| Nome, Categoria, Endereço... | Google Maps Scraper | — |
| Nota Maps, Reviews | Google Maps Scraper | — |
| Website, Nº de Contato | Google Maps Scraper | — |
| Nome Decisor | CNPJ + LinkedIn | `/mapeamento-decisores` |
| LinkedIn | CNPJ + LinkedIn | `/mapeamento-decisores` |
| Email | Enriquecimento web | `/mapeamento-decisores` |

## Etapas da Operação

### Fase 1 — Geração de Lista (Google Maps)
- Ferramenta: Google Maps Scraper (Apify actor ou extensão)
- Input: categoria + cidade/região alvo
- Output: CSV com colunas Nome → Link Maps preenchidas
- Volume sugerido: 50–200 empresas por rodada

### Fase 2 — Enriquecimento de Decisores
- Skill: `/mapeamento-decisores`
- Input: nome da empresa (coluna "Nome" do CSV)
- Output: Nome Decisor + URL do LinkedIn + email (quando disponível)
- Fazer em lotes de 10–20 empresas por vez

### Fase 3 — Abordagem LinkedIn
- Skill: `/linkedin-prospecting-dm`
- Input: URL do LinkedIn do decisor
- Output: 6 variações de DM personalizada
- Envio: Unipile MCP (quando conectado)
- Limite: ~80–100 convites/dia (conta paga), ~15/semana (gratuita)

### Fase 4 — Leads Quentes (bônus)
- Skill: `/linkedin-post-engagers`
- Input: posts de nicho relevante (ex: posts sobre "patrocínio esportivo", "camisas de time")
- Output: lista de pessoas que já engajaram — leads mais quentes que qualquer lista fria

### Fase 5 — Pré-call
- Skill: `/call-prep`
- Input: nome da empresa + nome do decisor
- Output: briefing completo + roteiro de descoberta

### Fase 6 — CRM
- Skill: `/crm-autofill` → atualiza HubSpot após cada interação
- Skill: `/filtro_de_cagada` → toda segunda-feira, audita o funil
- Skill: `/executive-report` → toda sexta, relatório de performance

## Nichos Prioritários para Sety Studio

Por ordem de potencial:
1. **Clubes esportivos** (futebol, vôlei, basquete) → patrocinadores, parceiros, fornecedores
2. **Marcas esportivas regionais** → precisam de site, tráfego, identidade
3. **Academia e fitness** → alta concentração no Maps, decisor fácil de achar
4. **Fornecedores de uniformes/equipamentos** → B2B com ticket médio alto

## Métricas de Controle

| Métrica | Meta semanal |
|---|---|
| Empresas scrapeadas | 100–200 |
| Decisores mapeados | 50–100 |
| DMs enviadas | 50–80 |
| Taxa de resposta esperada | 10–20% |
| Calls agendadas | 5–15 |

## Dependências Técnicas

| Ferramenta | Status | Para que serve |
|---|---|---|
| Google Maps Scraper | — | Fase 1 |
| Apify | Precisará de conta | Fases 2, 3, 4 |
| Unipile MCP | Pendente (credenciais) | Fase 3 envio |
| HubSpot MCP | Pendente | Fase 6 |
