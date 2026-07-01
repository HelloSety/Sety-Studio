# Matriz de auditoria de esquema (detalhe)

1. Orfa (sem uso): `search_crm_objects` com filtro `HAS_PROPERTY` na property -> se `total = 0`, ninguem preencheu.
2. Duplicada: agrupe por similaridade de name/label no mesmo objeto.
3. Mal nomeada: label generico, sem descricao, fora do padrao.
4. Read-only/calculada: ver `property-metadata-notes.md` (sem modificationMetadata no MCP).
5. Enum inflado: muitas opcoes / opcoes redundantes (via `get_properties`).
6. Orfa de processo: nao referenciada (sinalize para revisao humana — o MCP nao expoe workflows).
7. Tipo inadequado: numero/data como texto.
