# HubSpot CRM — object model para as skills (validado em conta real)

Nomes de properties internos validados contra o conector. Property vazia nao vem no objeto: trate como "nao informado", nao como zero.

## Negocio (DEAL)
- `dealname`, `pipeline` (ex.: `default`), `dealstage` (enum: appointmentscheduled, qualifiedtobuy, presentationscheduled, decisionmakerboughtin, contractsent, closedwon, closedlost).
- `amount` (gravavel direto), `amount_in_home_currency`, `deal_currency_code` (pode vir "Unassigned").
- `hs_deal_stage_probability` — probabilidade NATIVA por etapa (0..1).
- `hs_projected_amount` — valor ponderado NATIVO (= amount x probabilidade). READ-ONLY.
- `hs_forecast_amount` / `hs_forecast_probability` — forecast custom.
- `closedate`, `createdate`, `days_to_close`.
- `hs_is_closed`, `hs_is_closed_won`, `hs_is_closed_lost`, `hs_is_open_count`, `hs_is_closed_count`.
- `closed_lost_reason` (texto livre), `closed_won_reason`.
- `notes_last_updated` (ultima atividade, auto), `notes_next_activity_date` (proxima atividade futura, auto), `notes_next_activity_date` so reflete atividade FUTURA (tarefa vencida NAO conta).
- `num_associated_contacts`, `hs_num_of_associated_line_items`.
- `hubspot_owner_id`, `dealtype` (newbusiness/existingbusiness), `hs_next_step` (texto).

## Empresa (COMPANY)
`name`, `domain`, `industry` (enum ~150 valores), `numberofemployees`, `annualrevenue`, `city`, `country`, `phone`, `description`, `num_associated_contacts`.

## Contato (CONTACT)
`firstname`, `lastname`, `email`, `jobtitle`, `phone`, `num_associated_deals`. Pode ser criado sem email.

## Tarefa (TASK)
`hs_task_subject`, `hs_task_status` (aberta = `NOT_STARTED`; tambem COMPLETED/IN_PROGRESS/WAITING/DEFERRED), `hs_task_type` (CALL/EMAIL/MEETING/TODO/LINKED_IN...), `hs_timestamp` (vencimento), `hs_task_priority` (LOW/MEDIUM/HIGH/NONE), `hubspot_owner_id`. Associe ao deal na criacao.

## Anotacao (NOTE)
`hs_note_body`, `hs_timestamp`. Associe ao deal na criacao.

## Produto (PRODUCT) e Line item (LINE_ITEM)
- PRODUCT: catalogo (`name`, `price`, `description`).
- LINE_ITEM: item de um deal (`hs_product_id`, `name`, `price`, `quantity`), associado ao deal.
- Quando o deal tem line items, `amount` passa a ser derivado deles (rollup assincrono). Evite sobrescrever `amount` nesse caso.

## Owners / Pipelines
- `search_owners` traduz `hubspot_owner_id`. Pipelines/etapas via `get_properties` (pipeline/dealstage).
- O HubSpot TEM probabilidade nativa por etapa (diferente de RD/Pipedrive) — use `hs_deal_stage_probability`/`hs_projected_amount`.
