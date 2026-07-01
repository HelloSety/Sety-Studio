---
name: "smart-list"
description: "Gera listas e segmentacoes no HubSpot a partir de um pedido em linguagem natural. Descobre as properties certas (mesmo com nomes parecidos), escolhe os operadores corretos, mostra a contagem (total) e entrega a lista pronta para acao ou exportacao. Substitui o trabalho confuso de montar filtros na mao no HubSpot."
argument-hint: "<gerar lista, segmentar, filtrar deals/contatos/empresas, lista de, quem está em, criar segmento, exportar lista>"
---

# /smart-list

## Missao
Eliminar a fricao de montar listas no HubSpot. O usuario descreve o que quer em linguagem natural; a skill traduz para as properties e operadores certos, roda a busca, mostra a contagem e devolve a lista — sem o usuario precisar saber o nome interno da property nem qual operador escolher. E o caso de uso nº 1 de power users.

## Palavras ativadoras
- gere uma lista de / segmente / filtre os deals (ou contatos/empresas)
- quem está em [condicao] / quantos / lista de
- exporte os contatos que / me dê os negócios com
- monte um segmento de

## Conectores/MCPs necessarios
### Obrigatorio
- **HubSpot CRM via MCP oficial** (`search_properties`, `get_properties`, `search_crm_objects`, `query_crm_data`).

## Por que esta skill existe
Montar listas no HubSpot na mao e confuso: ha MUITAS properties com nomes parecidos (`notes_last_updated`, `notes_last_contacted`, `notes_next_activity_date`, `hs_lastmodifieddate`…) e muitos operadores ("contém / não contém / é igual / entre datas"). O usuario nem sempre sabe qual property/operador escolher. A skill resolve isso por contexto.

## Fluxo operacional
1. **Preflight**: `get_user_details` (objeto disponivel) + `get_organization_details` (moeda/timezone para filtros de data relativos).
2. **Entender o pedido**: identificar objeto (DEAL/CONTACT/COMPANY/TICKET) e as condicoes.
3. **Descobrir a property certa**: para cada condicao, `search_properties` (e `get_properties` para enums). Se houver properties parecidas, **mostrar a escolhida e por quê** (ex.: "usei `notes_last_updated` = última atividade, não `notes_last_contacted`").
4. **Montar o filtro**: traduzir para `filterGroups` com o operador correto (ver `filter-operators.md`). AND no mesmo grupo; OR em grupos separados.
5. **Rodar e contar**: `search_crm_objects` com as properties pedidas e ler o `total`. Para contagens/agrupamentos, `query_crm_data` (`COUNT`, `GROUP BY`).
6. **Entregar**: lista em tabela (com link do registro via `urlTemplate`), a contagem total, e o filtro usado em texto (para o usuario reaproveitar). Oferecer exportacao (CSV/markdown) e refino ("e se eu adicionar…").

## Tradução de pedidos comuns
- "criados nos últimos 30 dias" → `createdate` `GTE` (hoje-30) — calcule a data com a timezone da conta.
- "acima de X" → `amount`/property numérica `GT` X.
- "entre A e B" → `BETWEEN` (`value` + `highValue`).
- "que contém X" → `CONTAINS_TOKEN`.
- "sem [campo]" / "com [campo] vazio" → `NOT_HAS_PROPERTY`.
- "no estágio X ou Y" → `dealstage` `IN` [...].
- "da empresa Z" → `associatedWith` companies.
- "meus" → resolver `hubspot_owner_id` (via `search_owners`) e filtrar.

## Escopo de escrita
- Esta skill é, por padrão, **somente leitura** (gera e exibe a lista).
- Criar uma **lista estática nativa** no HubSpot (objeto OBJECT_LIST) pode estar indisponivel para escrita no conector — nesse caso, a skill entrega a lista exportada e/ou os IDs, e orienta criar a lista no HubSpot. Confirme a disponibilidade no preflight.
- Qualquer acao em lote sobre os registros da lista (ex.: criar tarefa, atualizar property) é delegada às skills de escrita (`crm-autofill`/`crm-hygiene`) com prévia + aprovação.

## Saida esperada
1. **A lista**: tabela com os campos pedidos + link, ordenada de forma util.
2. **Contagem total** (`total`) — inclusive quando passa do limite de paginacao.
3. **O filtro usado** (em texto), para auditoria e reuso.
4. **Próximos passos sugeridos** (refinar, exportar, ou acionar uma skill de escrita).

## Prompt curto de uso
`Liste os [objeto] que [condições] e me diga quantos são.`
