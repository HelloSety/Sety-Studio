---
name: "crm-autofill"
description: "Preenche e atualiza o HubSpot CRM via MCP a partir de reunioes, calls ou e-mails. Localiza o deal com busca antiduplicidade, extrai compromissos estruturados, atualiza properties existentes, cria notas e tarefas — apenas com prévia e aprovacao explicita (gate nativo do conector)."
argument-hint: "<transcricao, call, reuniao, e-mail, preencher CRM, atualizar negocio, nova tarefa, anotacao>"
---

# /crm-autofill

## Missao
Eliminar a digitacao manual de CRM. Analisa transcricoes (tl;dv, Fireflies, Zoom), e-mails ou notas, identifica o deal correto (evitando duplicados), extrai os fatos e atualiza o HubSpot de forma estruturada.

## Palavras ativadoras
- atualize esse negocio / preencha o CRM / registre essa call
- crie uma anotacao no HubSpot / crie a proxima tarefa
- transforme esse e-mail em atualizacao de negocio / acabei de falar com o cliente, atualize o CRM

## Conectores/MCPs necessarios
### Obrigatorio
- **HubSpot CRM via MCP oficial**.
### Fonte da conversa (pelo menos uma)
- Transcricao/e-mail colado no prompt, arquivos anexados, ou conector (tl;dv, Fireflies, Gmail).

## Extracao de dados (framework comercial)
1. **Fatos explicitos**: orcamentos, datas acordadas, cargos/e-mails de decisores, concorrentes.
2. **Dores**: problemas operacionais/de negocio.
3. **Proximos passos**: quem faz o que e ate quando.
4. **Sinais de compra / objecoes**.
5. **Riscos**: atrasos de aprovacao, perda de patrocinador, concorrencia.

## Passo 1 — Identificar o deal (antiduplicidade)
Nunca crie empresa/contato/deal sem verificar se ja existe.
- **Empresa/contato**: `search_crm_objects` com `query` (nome/dominio) ou `filterGroups`.
- **Deal**: `search_crm_objects` com `query` pelo nome, ou filtrando por `associatedWith` (empresa). Se houver mais de um candidato, peca confirmacao.
- Infira o pipeline a partir do deal encontrado; so pergunte o pipeline se nao localizar com seguranca.

## Passo 2 — Preparar criacoes/atualizacoes
- **Properties**: descubra as existentes via `search_properties`; so preencha as que existem. Se faltar, sugira criar, mapear, deixar como `NOTE` ou ignorar.
- **Valor (`amount`)**: gravavel direto. Se o deal tem line items (`hs_num_of_associated_line_items > 0`), NAO sobrescreva `amount` — ajuste pelos line items.
- **Tarefa**: `TASK` com `hs_task_subject`, `hs_task_status: NOT_STARTED`, `hs_task_type` (CALL/EMAIL/MEETING/TODO), `hs_timestamp` (vencimento), associada ao deal.
- **Nota**: `NOTE` com `hs_note_body`, associada ao deal.
- Nunca escreva properties read-only/calculadas (`hs_projected_amount`, `notes_last_updated`).

## Passo 3 — Prévia comparativa (Antes vs Depois)
Mostre: deal identificado (nome/ID), empresa/contato vinculados, properties a alterar (atual vs novo + fonte), resumo da nota, tarefas a agendar, nivel de confianca, itens que NAO devem ser atualizados.

## Passo 4 — Gravar (sob aprovacao)
- Escreva via `manage_crm_objects` (gate de confirmacao). Lote <= 10 objetos por chamada; escrita parcial (leia o `summary`).

## Exemplo de aprovacao
`Pode atualizar o HubSpot com os itens aprovados.`
Ou parcial: `Crie apenas a anotacao e a proxima tarefa. Nao altere etapa nem valor.`

## Exemplo de conteudo para teste
```
Reuniao com a empresa Acme. Joao (diretor comercial) relatou dificuldade de manter o CRM atualizado apos reunioes; dor: perda de contexto nos follow-ups e forecast pouco confiavel. Pediu proposta para automatizar preenchimento de CRM e report semanal. Proximo passo: enviar proposta ate sexta e agendar nova call.
```

## Prompt curto de uso
`Registre esta call no deal certo e me mostre a prévia antes de gravar: [transcricao].`
