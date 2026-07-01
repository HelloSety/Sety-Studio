# Definicoes de KPI (HubSpot)

- **Novos negocios**: `createdate` no periodo. Soma de `amount`.
- **Won**: `hs_is_closed_won = true` e `closedate` no periodo.
- **Lost**: `hs_is_closed_lost = true` e `closedate` no periodo.
- **Pipeline ativo**: `hs_is_open_count = 1`.
- **Taxa de conversao**: Won / (Won + Lost).
- **Ticket medio**: soma ganha / qtd ganha.
- **Valores**: use `amount_in_home_currency` e a moeda da conta (get_organization_details).

Exemplo HubSQL: `SELECT DATE_TRUNC(closedate,'MONTH'), SUM(amount_in_home_currency) FROM DEAL WHERE closedate BETWEEN '2026-06-01' AND '2026-09-30' GROUP BY DATE_TRUNC(closedate,'MONTH')`.
