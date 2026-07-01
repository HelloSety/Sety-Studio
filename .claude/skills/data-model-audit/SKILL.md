---
name: "data-model-audit"
description: "Audita o MODELO DE DADOS (esquema) do HubSpot — as properties, nao os registros: mapeia properties por objeto, sinaliza duplicadas, sem uso, mal nomeadas, read-only/calculadas e orfas de processo, calcula um Schema Health Score e propoe plano de consolidacao priorizado. Nao altera nada sem aprovacao."
argument-hint: "<auditoria de properties, property sprawl, data drift, esquema, governanca de dados, consolidar campos, limpar properties>"
---

# /data-model-audit

## Missao
Devolver a confianca no reporting do HubSpot atacando a raiz: o excesso e a bagunca de properties (property sprawl / data drift). Audita o ESQUEMA da conta — nao os registros — e entrega um plano de consolidacao defensavel. Distincao: `crm-hygiene` faz higiene de REGISTROS; esta faz higiene de ESQUEMA.

## Palavras ativadoras
- audite minhas properties / tenho campos demais no HubSpot
- property sprawl / data drift / quais campos estao sem uso
- limpe meu modelo de dados / campos duplicados / governanca de dados / consolidar propriedades

## Conectores/MCPs necessarios
### Obrigatorio
- **HubSpot CRM via MCP oficial** para descobrir e analisar as definicoes de properties (`search_properties`, `get_properties`) e, so sob aprovacao, ajustar via `manage_crm_objects`.

## Contrato operacional — HubSpot MCP
- **Preflight**: `get_user_details` (identidade, disponibilidade por objeto).
- **Escopo de leitura**: o foco e o SCHEMA (definicoes de property), nao os valores. Use `get_properties` para tipo, grupo e enums.
- **Limitacao validada (importante)**: o MCP NAO expoe `modificationMetadata` em `get_properties`. Logo, NAO ha um flag pronto de read-only/calculated. Para detectar read-only, use uma destas vias:
  1. Lista conhecida de properties calculadas/read-only do HubSpot (ex.: `hs_projected_amount`, `notes_last_updated`, `notes_next_activity_date`, `days_to_close`, `hs_is_*`).
  2. Inferencia pelo nome/descricao (prefixo `hs_`, "calculated", "set automatically by HubSpot").
  3. Teste controlado: uma tentativa de escrita retorna erro claro ("is a read only property") — use com cautela e nunca em massa.
- **Seguranca de escrita**: renomear/arquivar property pode NAO estar exposto no MCP de CRM. Quando nao estiver, entregue o PLANO para execucao manual no HubSpot Settings — nunca prometa a acao. Qualquer escrita disponivel exige aprovacao explicita.

## Perguntas obrigatorias antes de rodar
1. Quais objetos auditar? (sugira comecar por Deals e Contacts)
2. Incluir properties nativas ou so as personalizadas? (sugira so personalizadas — e onde mora a bagunca)
3. Diagnostico ou ja o plano de consolidacao priorizado?

## Matriz de auditoria de esquema (o que sinalizar)
1. **Property orfa (sem uso)**: confirme com `search_crm_objects` usando `HAS_PROPERTY` e o `total` (zero registros preenchidos).
2. **Duplicada / quase-duplicada**: nomes/labels muito similares no mesmo objeto.
3. **Mal nomeada**: label generico ("campo 1", "teste", "temp"), sem descricao, fora de convencao.
4. **Read-only / calculada**: detectada por lista/inferencia (ver limitacao acima) — nunca deve receber escrita das outras skills.
5. **Enum inflado**: property de selecao com opcoes demais/redundantes.
6. **Orfa de processo**: nao aparece em formulario/workflow/view — candidata a arquivar.
7. **Tipo inadequado**: dado numerico/data guardado como texto.

## Schema Health Score (0-100)
Score = 100 - penalidades por objeto, ponderado pelo volume de properties customizadas:
- Cada property orfa: -2
- Cada cluster de duplicadas: -5
- Cada mal nomeada / sem descricao: -1
- Cada tipo inadequado: -3

Classificacao: 90-100 Saudavel | 70-89 Atencao | 50-69 Inflado | <50 Critico.

## Fluxo operacional
1. `get_user_details` (preflight).
2. Para cada objeto: `search_properties` (sem keywords = lista tudo) e `get_properties` (tipo + enums).
3. Para candidatas a "sem uso": `search_crm_objects` com `HAS_PROPERTY` e leia o `total`.
4. Rode a matriz de 7 pontos; calcule o Schema Health Score.
5. Apresente diagnostico + plano de consolidacao priorizado.
6. Execute apenas o que o MCP permitir e o usuario aprovar; o resto vira checklist para o HubSpot Settings.

## Saida esperada
1. **Resumo executivo**: objetos, total de properties (nativas vs custom), Schema Health Score por objeto.
2. **Painel de achados**: tipo de problema x quantidade x impacto no reporting.
3. **Top 10 ofensores**: nome, objeto, problema, recomendacao (arquivar/renomear/mesclar/corrigir tipo).
4. **Plano de consolidacao priorizado**: A (arquivar orfas), B (mesclar duplicadas), C (padronizar nomenclatura) — esforco e impacto.
5. **Guarda-corpo para as outras skills**: lista de properties read-only/calculadas que autofill/enrichment NUNCA devem escrever.

## Prompt curto de uso
`Audite o modelo de dados dos meus Deals e Contacts e me de o Schema Health Score com o plano de consolidacao.`

## Verificação extra — Properties parecidas e governança

O HubSpot traz nativamente MUITAS properties com nomes quase iguais, o que confunde quem vai filtrar/relatar. Além do property sprawl de campos customizados, a skill deve:
- **Agrupar famílias confusas** e explicar a diferença (ex.: `notes_last_updated` = última atividade qualquer; `notes_last_contacted` = último contato comercial; `notes_next_activity_date` = próxima atividade; `hs_lastmodifieddate` = última modificação do registro). Isso evita o usuário escolher a property errada no filtro.
- **Gerar/atualizar um catálogo de governança**: para contas que controlam a criação de properties (admin define nome, finalidade e regra), a skill pode produzir um documento de governança das properties customizadas (nome, objeto, finalidade, tipo, dono) — útil para evitar duplicação futura.
