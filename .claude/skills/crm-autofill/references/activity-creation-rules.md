# Regras de criacao de atividade (HubSpot)

## Tarefa (TASK)
- `hs_task_subject` (titulo), `hs_task_status: NOT_STARTED` (aberta), `hs_task_type` (CALL/EMAIL/MEETING/TODO/LINKED_IN), `hs_timestamp` (vencimento), `hs_task_priority` (LOW/MEDIUM/HIGH), `hubspot_owner_id`.
- Associe ao deal na mesma chamada.

## Nota (NOTE)
- `hs_note_body` + `hs_timestamp`. Associe ao deal.

## Observacoes
- Criar a atividade atualiza automaticamente `notes_last_updated` / `notes_next_activity_date` do deal (proxima atividade so reflete tarefa FUTURA).
- Lote de escrita <= 10 objetos por chamada.
