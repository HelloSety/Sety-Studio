# Quick Reference — Data Model Audit (HubSpot)

## Comandos rapidos
- `Auditar properties de Deals e Contacts`
- `Quais campos estao sem uso?`
- `Listar properties duplicadas / mal nomeadas`

## Ferramentas
- `search_properties` (lista tudo do objeto), `get_properties` (tipo/enums)
- `search_crm_objects` (`HAS_PROPERTY` + `total` para uso real)
- `manage_crm_objects` (so se a escrita de schema estiver disponivel)

## Lembrete-chave
- O MCP NAO expoe `modificationMetadata`: detecte read-only por lista/inferencia/erro, nao por flag.
