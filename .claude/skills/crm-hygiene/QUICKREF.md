# Quick Reference — CRM Hygiene (HubSpot)

## Comandos rapidos
- `Auditar pipeline [Nome]`
- `Calcular CRM Health Score`
- `Listar deals sem proxima atividade`
- `Identificar deals parados / duplicados`

## Ferramentas MCP
- `get_user_details` (preflight) / `get_organization_details` (moeda)
- `get_properties` (pipeline/dealstage)
- `query_crm_data` (`hs_is_open_count = 1`, `amount IS NULL`)
- `search_crm_objects` (`NOT_HAS_PROPERTY` notes_next_activity_date, `num_associated_contacts = 0`, `query` p/ duplicados)
- `manage_crm_objects` (correcoes, lote <=10)

## Padroes
- Parado: inatividade > 14 dias (`notes_last_updated`).
- Proxima atividade: `notes_next_activity_date` (tarefa vencida NAO conta).
- Sem valor: `amount IS NULL`.
