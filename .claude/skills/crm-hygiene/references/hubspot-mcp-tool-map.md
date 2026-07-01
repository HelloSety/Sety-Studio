# Mapa de ferramentas — HubSpot CRM via MCP oficial

O HubSpot expoe poucas ferramentas GENERICAS (recebem `objectType` como parametro), nao tools por objeto. Mapeie por capacidade.

## Preflight (sempre primeiro)
- `get_user_details` — identidade, `ownerId`, disponibilidade read/write por objeto. Obrigatorio antes de qualquer operacao.
- `get_organization_details` (ACCOUNT_INFORMATION) — moeda e timezone da conta.

## Leitura
- `query_crm_data` — HubSQL (SELECT/WHERE/GROUP BY/agregacoes). Ideal para KPIs, forecast, somas por etapa.
- `search_crm_objects` — busca por `filterGroups`, associacoes e `total` (exige `chatInsights`). Ideal para listas filtradas, orfaos, duplicados, antiduplicidade.
- `get_crm_objects` — busca em lote por IDs (entender o data model de um registro).
- `search_properties` / `get_properties` — descobrir nomes internos, tipos e enums das properties.
- `search_owners` — resolver `hubspot_owner_id` por nome/email.

## Escrita
- `manage_crm_objects` — UNICA ferramenta de escrita: create/update + associations. Exige `confirmationStatus`.

## Ordem preferida para analise de deals
1. `get_user_details` (preflight).
2. Descobrir pipelines/etapas: `get_properties` na property `pipeline` e `dealstage`.
3. `search_owners` se a analise for por dono ("meu/minhas").
4. Deals do escopo via `query_crm_data` ou `search_crm_objects`.
5. Properties de atividade (`notes_last_updated`, `notes_next_activity_date`) ja vem no deal — nao precisa cruzar tarefas.

## Regra de seguranca
Toda escrita passa por `manage_crm_objects` com prévia + aprovacao. Nunca grave sem confirmacao.
