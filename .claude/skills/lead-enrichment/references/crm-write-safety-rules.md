# Regras de escrita segura — HubSpot (manage_crm_objects)

## Gate de confirmacao (obrigatorio)
- Toda escrita usa `manage_crm_objects` com `confirmationStatus: CONFIRMED` (ou CONFIRMATION_WAIVED_FOR_SESSION se o usuario optar).
- Sempre mostre uma prévia Antes/Depois (tabela) antes de gravar. O proprio conector exige isso.

## Limites e comportamento (validados)
- **Lote maximo: 10 objetos por chamada.** Acima: VALIDATION_ERROR. Pagine em lotes <=10.
- **Escrita em lote e parcial**: cada objeto retorna sucesso/erro; um item invalido nao derruba os demais. Sempre leia o `summary`.
- **Read-only/calculadas**: escrever em `hs_projected_amount`, `notes_last_updated`, etc. retorna erro ("is a read only property"). Nao tente. O MCP NAO expoe `modificationMetadata` em `get_properties` — mantenha uma lista conhecida e/ou trate o erro.
- **Enums**: use o `value` interno exato (`dealstage`, `industry`, `dealtype`). Enum invalido retorna a lista de valores validos.

## Valor do deal e line items
- `amount` e gravavel direto.
- Se `hs_num_of_associated_line_items > 0`, o valor passa a ser derivado dos itens (rollup assincrono). EVITE sobrescrever `amount`; ajuste pelos line items para nao divergir.

## Associacoes
- Crie o objeto ja associado (deal -> company + contact; note/task -> deal) na mesma chamada (`associations: [{targetObjectId, targetObjectType}]`).
- O HubSpot suporta rotulos de associacao (ex.: "Empresa principal", "Contato de cobranca") — use quando o par existir.

## Proibido sem instrucao
Excluir, arquivar em massa, mover etapa sem aprovacao, sobrescrever campo preenchido sem mostrar valor atual, fundir duplicados automaticamente.
