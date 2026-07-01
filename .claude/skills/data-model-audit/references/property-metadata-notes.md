# Deteccao de read-only/calculated (limitacao validada)

VALIDADO em conta real: o MCP do HubSpot NAO expoe `modificationMetadata` em `get_properties` (so name/label/description/type/options). Portanto nao ha flag pronto de read-only/calculated.

## Como inferir read-only/calculated
1. **Lista conhecida** (nao escrever): `hs_projected_amount`, `hs_projected_amount_in_home_currency`, `notes_last_updated`, `notes_last_contacted`, `notes_next_activity_date`, `days_to_close`, `hs_is_closed*`, `hs_is_open_count`, `num_associated_contacts`, `hs_num_of_associated_line_items`, `amount_in_home_currency`, `createdate`, `hs_lastmodifieddate`.
2. **Inferencia textual**: descricao contendo "set automatically by HubSpot" / "calculated".
3. **Teste controlado**: a escrita retorna `"<prop>" is a read only property; its value cannot be set.` — use 1x, com cautela, nunca em massa.

Entregue essa lista como guarda-corpo para autofill/enrichment.
