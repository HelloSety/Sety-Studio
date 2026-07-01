# BRIEF: Live Artifact de Forecast de Receita (Weighted Pipeline) — HubSpot CRM

Cole este brief inteiro em uma conversa NOVA do Claude Cowork (com o HubSpot conectado) para gerar o artifact em uma unica passada.

## 1. Proposito
Construir um Live Artifact de forecast de receita dos proximos 6 meses, alimentado exclusivamente pelo HubSpot CRM (via MCP oficial). O forecast consolidado por mes e o asset principal (numero-ancora). Abaixo, os negocios que justificam cada mes, para auditoria visual. Usado por gestor comercial e socios, com reabertura semanal.

Pergunta central: "Quanto estamos prestes a fechar nos proximos 6 meses, com base no que existe hoje no funil, e onde focar para sustentar/melhorar a previsao?"

## 2. Metodologia: Weighted Pipeline (nativo do HubSpot)
Cada negocio aberto entra como amount x probabilidade da etapa. O HubSpot JA calcula isso na property `hs_projected_amount` (= `amount` x `hs_deal_stage_probability`). Use-a como numero-ancora; permita override de probabilidade.
Forecast(mes) = SUM(hs_projected_amount) dos deals com `closedate` naquele mes.

## 3. Fonte de dados
CRM: HubSpot (MCP oficial). Pipeline: [TROQUE PELO NOME DO SEU PIPELINE].

Preflight: `get_user_details` (acesso + ownerId) e `get_organization_details` (ACCOUNT_INFORMATION -> moeda da conta; pode ser USD, NAO assuma BRL). Descubra as etapas reais via `get_properties` (property `dealstage`) e use os nomes reais.

Ferramentas: `query_crm_data` (HubSQL) e/ou `search_crm_objects`.
Exemplo: `SELECT dealstage, COUNT(*), SUM(hs_projected_amount) FROM DEAL WHERE hs_is_open_count = 1 GROUP BY dealstage`.

Campos por negocio aberto (`hs_is_open_count = 1`):
- `dealname`, `amount`, `amount_in_home_currency`, `deal_currency_code` (pode vir "Unassigned" -> use a moeda da conta)
- `dealstage`, `hs_deal_stage_probability`, `hs_projected_amount`
- `closedate` (pode estar vazia; no `query_crm_data` vem como epoch ms + `closedate_iso`)
- `hubspot_owner_id` (traduza com `search_owners`)
- `notes_last_updated` (ultima atividade), `notes_next_activity_date` (proxima atividade; tarefa vencida NAO conta)
- `hs_num_of_associated_line_items` (se > 0, valide o `amount` — pode divergir dos itens)

NOTAS DO CONECTOR (validadas):
- Dentro do artifact, ao chamar `callMcpTool`, leia `r.structuredContent ?? JSON.parse(r.content[0].text)`.
- `OR`/`LIKE` no HubSQL sao oficialmente nao suportados (mesmo tendo rodado em teste) — prefira `IN (...)` e `KEYWORD_SEARCH_QUERY`.
- `GROUP BY` em texto normaliza o valor (minusculas/sem acento).

## 4. O que mostrar
- Forecast consolidado por mes (ancora).
- Abaixo de cada mes, os negocios que o sustentam: etapa, valor ponderado, dono e risco (sem proxima atividade / `closedate` vencida).
- Somente leitura — NAO escreva nada no CRM.
