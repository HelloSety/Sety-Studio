# CRM Health Score — metodologia (HubSpot)

Score de 0 a 100. Comeca em 100, subtrai penalidades. So ajuste quando o dado existir.

| Categoria | Peso | Sinais (properties HubSpot) |
|---|---:|---|
| Cobertura de proxima atividade | 25 | `notes_next_activity_date` vazia; tarefa vencida |
| Recencia / toque | 20 | `notes_last_updated`; dias parado |
| Qualidade da data de fechamento | 10 | `closedate` vazia ou vencida |
| Properties estrategicas | 10 | owner, dealtype, ICP/segmento, custom fields |
| Qualidade de valor | 15 | `amount` vazio/anormal |
| Vinculo contato + empresa | 15 | `num_associated_contacts = 0`; sem empresa |
| Controle de duplicados | 5 | deals com nome igual na mesma empresa |

Semaforo: 90-100 saudavel | 70-89 atencao | <70 critico.

Regra: property indisponivel via MCP nao penaliza — marque "nao informado".
