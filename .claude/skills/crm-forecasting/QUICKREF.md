# Quick Reference — Forecasting (HubSpot)

## Comandos rapidos
- `Calcular forecast [Pipeline]`
- `Gap da meta de [valor]`
- `Riscos do pipeline`

## Ferramentas MCP
- `get_user_details` / `get_organization_details` (moeda)
- `get_properties` (dealstage, hs_deal_stage_probability)
- `query_crm_data` (SUM(hs_projected_amount), hs_is_open_count = 1)
- `search_crm_objects` (saude de atividade)

## Metodologia
- Expected = SUM(hs_projected_amount) (nativo).
- Best = avancados saudaveis a 100% + demais a 50%.
- Worst = remove deals sem atividade/parados; pondera o resto.

## Confiabilidade do forecast (intersecao com higiene)
- Sinaliza duplicados inflando o numero, deals top sem atividade, sem `closedate` ou sem `amount`.
- Entrega um selo de confiabilidade (% de exposicao a deals frageis) e oferece recalcular um forecast "limpo".
