# Quick Reference — Executive Report (HubSpot)

## Comandos rapidos
- `Report semanal [Pipeline]`
- `E-mail comercial para o gestor`
- `Resumir perdas do periodo`

## Ferramentas MCP
- `query_crm_data` (won/lost por flags + closedate; novos por createdate; GROUP BY closed_lost_reason)
- `search_crm_objects` (deals em risco)
- Gmail (opcional, rascunho)

## Lembretes
- Motivo de perda = property `closed_lost_reason` (texto). GROUP BY normaliza o texto.
- Won/Lost via `hs_is_closed_won` / `hs_is_closed_lost`.
