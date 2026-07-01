# Desambiguação de properties parecidas (HubSpot)

O HubSpot tem dezenas de properties com nomes semelhantes. O usuário precisa saber QUAL filtrar. A skill deve explicar as famílias mais confusas:

## Datas de atividade (deal/contato)
- `notes_last_updated` — última atividade de QUALQUER tipo (nota/call/e-mail/meeting/task). "Last Activity Date".
- `notes_last_contacted` — último CONTATO comercial (call/e-mail/meeting). "Last Contacted".
- `notes_next_activity_date` — próxima atividade FUTURA agendada.
- `hs_lastmodifieddate` — última modificação do REGISTRO (qualquer campo), não é atividade.
- `hs_last_sales_activity_timestamp` — última atividade de vendas.

## Datas de ciclo
- `createdate` (criação), `closedate` (fechamento), `hs_lastmodifieddate` (modificação).

## Recomendação
Antes de qualquer filtro/relatório, confirme a property pelo `search_properties`/`get_properties` e mostre ao usuário qual foi escolhida e por quê. Para governança, produza um catálogo (nome, objeto, finalidade, tipo, dono).
