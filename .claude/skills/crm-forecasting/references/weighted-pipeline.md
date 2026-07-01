# Weighted Pipeline no HubSpot

Formula: `forecast ponderado = amount x probabilidade da etapa`.

No HubSpot isso e NATIVO:
- `hs_deal_stage_probability` (0..1) por etapa.
- `hs_projected_amount` = amount x probabilidade (READ-ONLY; recalcula quando o amount ou a etapa mudam).

Validado em conta real: amount 99999, etapa com prob 0,2 -> `hs_projected_amount` = 19999,8.

Use `SUM(hs_projected_amount)` para o Expected. Permita override de probabilidade por etapa quando o usuario tiver historico proprio.

Cuidado: `hs_projected_amount` deriva do `amount`, NAO de line items. Se o deal tem line items, valide o `amount` antes de confiar no ponderado.
