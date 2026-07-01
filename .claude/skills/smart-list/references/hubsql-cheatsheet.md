# HubSQL — cheatsheet (validado em conta real)

`query_crm_data` usa SQL com extensoes HubSpot. Chame o Tool Guidance antes da primeira query.

## Suporta
- `SELECT`, `WHERE`, `GROUP BY`, `COUNT(*)`, `SUM`, `MEDIAN`.
- `DATE_TRUNC(prop, 'MONTH'|'WEEK'|'QUARTER'|'YEAR')`.
- `BETWEEN '2026-01-01' AND '2026-03-31'` (datas como string).
- `KEYWORD_SEARCH_QUERY('termo', 'prop')` para busca textual.
- `WHERE prop IS NULL` — VALIDADO: acha properties vazias (deals sem valor/sem closedate).
- `hs_is_open_count = 1` (abertos); `hs_is_closed_won = true` / `hs_is_closed_lost = true` (fechados).
- Cross-object no SELECT: `SELECT dealname, COMPANY.name FROM DEAL` (max 2 objetos associados).
- Filtro de dono: `WHERE hubspot_owner_id = 'ID'` (resolva o ID com search_owners para "meu/minhas").

## Nao suporta (oficialmente)
- `DISTINCT`, alias `AS`, `CASE WHEN`, `IF()`, funcoes de string, `COALESCE`, `JOIN`, `UNION`, subqueries, `HAVING`, `COUNT(DISTINCT x)`.
- `OR` e `LIKE` constam como nao suportados.

## Observacoes de campo (validadas)
- `OR` e `LIKE` RODARAM nos testes, mas sao oficialmente nao suportados: PREFIRA `IN (...)` e `KEYWORD_SEARCH_QUERY` (mais seguro/estavel).
- `GROUP BY` em property de TEXTO normaliza o valor (minusculas, sem acento). Exiba o rotulo a partir do registro original, nao do agrupamento.
- `COUNT(*)` sozinho pode voltar so como mensagem ("The total count is N"), nao como linha.
- `closedate` vem como epoch ms no `query_crm_data` (+ `closedate_iso`); no `search_crm_objects` vem ISO. Normalize datas.
- Valores financeiros: prefira `amount_in_home_currency` e leia a moeda da conta (get_organization_details). `deal_currency_code` pode vir "Unassigned".
