# Probabilidades por etapa (HubSpot)

O HubSpot ja traz uma probabilidade por etapa em `hs_deal_stage_probability` (configuravel nas Deal Pipeline Settings). Etapas closedwon = 1, closedlost = 0.

## Preferencia
1. Usar a probabilidade nativa da conta (default).
2. Override manual por etapa se o usuario pedir (registre as premissas na saida).

## Preset de fallback (se a conta nao tiver probabilidades configuradas)
- appointmentscheduled: 20%
- qualifiedtobuy: 40%
- presentationscheduled: 60%
- decisionmakerboughtin: 80%
- contractsent: 90%

Descubra os valores reais via `get_properties` na property `hs_deal_stage_probability` e/ou lendo os deals.
