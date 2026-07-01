# Receitas de lista (HubSpot)

Exemplos prontos de filtro (todos via `search_crm_objects.filterGroups`):

- **Deals quentes sem follow-up**: `dealstage IN [presentationscheduled, decisionmakerboughtin, contractsent]` AND `notes_next_activity_date NOT_HAS_PROPERTY`.
- **Deals de alto valor**: `amount GT 50000` AND `hs_is_open_count EQ 1`.
- **Deals fechando no mês**: `closedate BETWEEN inicio_mes AND fim_mes` AND `hs_is_open_count EQ 1`.
- **Contatos órfãos**: `num_associated_deals EQ 0`.
- **Contatos sem e-mail**: `email NOT_HAS_PROPERTY`.
- **Empresas ICP**: `industry IN [...]` AND `numberofemployees GTE 100`.
- **Por dono**: `hubspot_owner_id EQ <id>` (resolver com `search_owners`).
- **Por empresa**: `associatedWith companies = <companyId>`.

Para contagem/distribuição use `query_crm_data`: `SELECT dealstage, COUNT(*) FROM DEAL WHERE ... GROUP BY dealstage`.
