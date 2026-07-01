# Operadores de filtro — geração de listas e segmentação (HubSpot)

Construir listas no HubSpot na mão é confuso: muitas properties com nomes parecidos e muitos operadores. Via `search_crm_objects.filterGroups`, o Claude escolhe o operador certo a partir do pedido em linguagem natural. VALIDADO no conector.

## Operadores (propertyName + operator [+ value/values/highValue])
- `EQ` / `NEQ` — é igual / não é igual
- `GT` / `GTE` / `LT` / `LTE` — maior/menor (números, datas como string)
- `BETWEEN` — entre (use `value` + `highValue`)
- `IN` / `NOT_IN` — em uma lista de valores (`values: [...]`)
- `CONTAINS_TOKEN` / `NOT_CONTAINS_TOKEN` — contém / não contém
- `HAS_PROPERTY` / `NOT_HAS_PROPERTY` — preenchido / vazio

## Lógica
- Filtros no MESMO `filterGroup` = **E (AND)**.
- `filterGroups` diferentes = **OU (OR)**.
- Associações: `associatedWith` (ex.: deals de uma empresa).

## Exemplo validado
Deals abertos avançados acima de 50k sem próxima atividade:
`filterGroups: [{ filters: [
  { propertyName: "dealstage", operator: "IN", values: ["qualifiedtobuy","presentationscheduled","decisionmakerboughtin","contractsent"] },
  { propertyName: "amount", operator: "GT", value: "50000" },
  { propertyName: "notes_next_activity_date", operator: "NOT_HAS_PROPERTY" }
]}]`

## Dica de descoberta
Há MUITAS properties de data de atividade com nomes parecidos (`notes_last_updated`, `notes_last_contacted`, `notes_next_activity_date`, `hs_lastmodifieddate`, `hs_last_sales_activity_timestamp`). Sempre confirme a property certa via `search_properties` antes de filtrar — não adivinhe pelo nome.
