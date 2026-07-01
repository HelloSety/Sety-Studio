# Analise de motivos de perda (HubSpot)

- Motivo = property de TEXTO `closed_lost_reason` (sem endpoint dedicado). `closed_won_reason` para ganhos.
- Agrupar: `SELECT closed_lost_reason, COUNT(*), SUM(amount_in_home_currency) FROM DEAL WHERE hs_is_closed_lost = true GROUP BY closed_lost_reason`.
- VALIDADO: `GROUP BY` em texto retorna o valor NORMALIZADO (minusculas, sem acento). Para exibir o texto exato, leia o registro original via `search_crm_objects`/`get_crm_objects`.
- Gere insight acionavel para a principal objecao (ex.: preco -> revisar pacote/ancora de valor).
