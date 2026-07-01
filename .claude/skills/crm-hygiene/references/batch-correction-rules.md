# Regras para correcoes em lote (HubSpot)

Permitidas apenas apos aprovacao explicita. Lote <= 10 objetos por chamada de `manage_crm_objects` (escrita parcial: leia o `summary`).

## Pode sugerir
- Criar tarefas de follow-up (`TASK`, `hs_task_status: NOT_STARTED`) para deals sem proxima atividade.
- Marcar deals de teste para revisao/arquivamento.
- Adicionar notas de revisao (`NOTE`).
- Atualizar `closedate` vencida quando houver regra aprovada.
- Sinalizar duplicados para revisao humana.

## Nao faca automaticamente
- Merge de duplicados sem revisao.
- Excluir deals; mover `dealstage` sem aprovacao.
- Escrever properties read-only/calculadas (`hs_projected_amount`, `notes_last_updated`).
- Sobrescrever `amount` quando ha line items.
- Sobrescrever property preenchida sem mostrar valor atual.

## Prévia obrigatoria
Tabela: acao, deals afetados, property, valor atual, novo valor, fonte, risco, aprovacao.
