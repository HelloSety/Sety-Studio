# Escopo de operacoes no HubSpot CRM

## Leitura (padrao)
- `query_crm_data`, `search_crm_objects`, `get_crm_objects`, `search_properties`, `get_properties`, `search_owners`, `get_user_details`, `get_organization_details`.

## Analise (padrao)
- Calcular score, classificar riscos, identificar duplicados, estimar forecast, sugerir proximos passos, montar plano de correcao.

## Escrita (exige prévia + aprovacao explicita)
- `manage_crm_objects` (create/update + associations), com `confirmationStatus: CONFIRMED`.
- Criar/atualizar deal, tarefa, nota; associar contato/empresa; ajustar valor (direto ou via line items).

## Proibido sem instrucao especifica
- Excluir/arquivar em massa.
- Sobrescrever property preenchida sem mostrar valor atual.
- Tentar escrever properties read-only/calculadas (ex.: `hs_projected_amount`, `notes_last_updated`).
- Fundir duplicados automaticamente.
- Enviar e-mail/mensagem em nome do usuario sem aprovacao.

## Modo padrao
Comece sempre em leitura. Escrita e excecao. Lote de escrita <= 10 objetos por chamada.
