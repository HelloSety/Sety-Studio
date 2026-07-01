# Taxonomia de problemas de higiene (HubSpot)

## Critico
- Deal aberto sem proxima atividade em etapa avancada (contractsent/decisionmakerboughtin).
- Deal de alto valor sem follow-up.
- Deal parado 15+ dias.
- `closedate` vencida em deal relevante (ainda aberto).
- Duplicidade que infla o pipeline.

## Alto
- Sem `closedate`.
- Sem `amount` em deal real.
- Tarefa vencida (so atividade futura conta como "proxima atividade").
- `hubspot_owner_id` ausente.

## Medio
- Sem empresa associada / sem contato (`num_associated_contacts = 0`).
- Properties estrategicas ausentes.
- Deal criado e nunca atualizado.

## Baixo
- Campos secundarios ausentes; nomenclatura inconsistente.

Sempre inclua impacto comercial: forecast ruim, perda silenciosa, pipeline inflado, follow-up atrasado.
