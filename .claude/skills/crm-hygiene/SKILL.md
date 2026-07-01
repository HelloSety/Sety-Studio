---
name: "crm-hygiene"
description: "Audita a higiene do HubSpot CRM via MCP oficial: deals sem proxima atividade, parados, sem valor, orfaos de contato/empresa, duplicados e registros de teste. Calcula um CRM Health Score, gera plano de correcao priorizado e executa em lote apenas sob aprovacao explicita (gate nativo do conector)."
argument-hint: "<pipeline, owner, periodo, deals abertos, higiene, auditoria, correcao, duplicados, health score>"
---

# /crm-hygiene

## Missao

Transformar a base do HubSpot num motor comercial confiavel. Esta skill audita a qualidade dos dados, identifica desvios que distorcem o forecast e cria um plano de remediacao — sem alterar nada sem aprovacao.

## Palavras ativadoras
- audite meu CRM / higiene do CRM / pipeline sujo
- deals parados / negocios sem proxima atividade
- encontre problemas no HubSpot / calcule o health score
- quais negocios precisam de atencao / organize meu pipeline / limpeza de base

## Conectores/MCPs necessarios
### Obrigatorio
- **HubSpot CRM via MCP oficial** (`mcp.hubspot.com`) para ler e gravar deals, contatos, empresas, tarefas e notas.

## Contrato operacional — HubSpot MCP
- **Preflight obrigatorio**: `get_user_details` (identidade, ownerId, disponibilidade read/write) e `get_organization_details` (moeda/timezone). Descubra pipelines/etapas via `get_properties` (pipeline/dealstage).
- **Atividade e nativa**: leia `notes_last_updated` (ultima atividade) e `notes_next_activity_date` (proxima atividade futura) direto do deal — NAO cruze tarefas manualmente. Atencao: tarefa VENCIDA nao popula `notes_next_activity_date`.
- **Seguranca de escrita**: nenhuma alteracao sem prévia Antes/Depois e aprovacao explicita. Escrita via `manage_crm_objects` (gate nativo, lote <=10).

Confirmacoes validas: `Aprovado, execute as correcoes`, `Pode criar as tarefas de follow-up`.
Confirmacoes invalidas: `ok`, `pode ser`.

## Perguntas obrigatorias antes de rodar
1. Qual pipeline auditar? (mostre os pipelines descobertos)
2. Analisar apenas deals abertos (`hs_is_open_count = 1`) ou incluir fechados?
3. Limite de dias de inatividade para "parado"? (sugira 14)
4. Filtrar por um owner especifico ou a conta inteira?
5. Apenas diagnostico ou ja gerar o plano de correcao em lote?

## Matriz de auditoria (pontos de higiene)
1. **Sem proxima atividade**: `notes_next_activity_date` vazia (via `search_crm_objects` com `NOT_HAS_PROPERTY`).
2. **Tarefa vencida**: tarefa associada com `hs_timestamp` < hoje e status `NOT_STARTED`.
3. **Parado**: `notes_last_updated` mais antigo que o limite definido.
4. **Sem valor**: `amount IS NULL` (HubSQL) ou vazio.
5. **Orfao de contato**: `num_associated_contacts = 0`.
6. **Orfao de empresa**: sem empresa associada.
7. **Sem data de fechamento**: `closedate` vazia.
8. **Inconsistencia de etapa**: deal parado em etapa avancada (contractsent/decisionmakerboughtin) sem follow-up.
9. **Owner ausente/inativo**: `hubspot_owner_id` vazio ou de usuario inativo (cheque via `search_owners`).
10. **Duplicidade**: deals com nome igual/parecido na mesma empresa (use `search_crm_objects` com `query`).
11. **Properties estrategicas vazias**: campos personalizados-chave sem valor (descubra via `search_properties`).
12. **Registros de teste**: nomes com "teste", "test", "demo".

## CRM Health Score (0 a 100)
Comeca em 100 e subtrai penalidades por deal; o score do funil e a media. Nao penalize property indisponivel — marque "nao informado".
- Sem proxima atividade: -25
- Tarefas vencidas: -20
- Inatividade > 14 dias: -15
- Sem valor: -15
- Sem contato: -10
- Sem empresa: -10
- Sem `closedate`: -5

Classificacao: 90-100 Excelente | 70-89 Bom | 50-69 Atencao | 0-49 Critico.

## Fluxo operacional
1. Preflight (`get_user_details`, `get_organization_details`).
2. Pipelines/etapas via `get_properties`. Confirme o pipeline.
3. Colete deals abertos: `query_crm_data` (`WHERE hs_is_open_count = 1`) e/ou `search_crm_objects` para filtros especificos (orfaos, sem proxima atividade).
4. Aplique a matriz de higiene localmente; calcule o Health Score.
5. Apresente o diagnostico (saida abaixo).
6. Monte o plano de correcao (tarefas de follow-up, datas, associacoes).
7. Sob aprovacao, execute via `manage_crm_objects` em lotes <=10.

## Saida esperada
1. **Resumo executivo**: pipeline, volume e valor aberto, **CRM Health Score**, estado geral.
2. **Painel de inconsistencias**: tabela ponto x quantidade x impacto no forecast.
3. **Top 5 deals criticos**: nome (com link), empresa/contato, problema principal.
4. **Relatorio de duplicidade**: pares para revisao humana.
5. **Plano de correcao proposto**: acoes A/B/C com prompt curto de aprovacao.

## Prompt curto de uso
`Audite o pipeline [Nome] usando apenas deals abertos e me de o CRM Health Score com o plano de correcao.`

## Verificação extra — Qualidade de valor (multi-usuário)

Em CRMs preenchidos por várias pessoas, o problema mais irritante não é só campo vazio — é **valor malformado/placeholder**. A skill deve sinalizar:
- **E-mails inválidos/placeholder**: `aaa@email.com`, `teste@teste.com`, sem `@`, domínio claramente falso.
- **Tax ID / CNPJ / CPF mal formatado**: tamanho/dígitos fora do padrão (crítico para operações que faturam).
- **Texto placeholder**: "xxx", "a definir", "tbd", "asdf", nomes em caixa-baixa só com uma letra.
- **Telefone/valor numérico em campo errado** ou claramente inválido.
Leia os valores via `query_crm_data`/`search_crm_objects` e valide o formato localmente (regex). Esses achados entram no painel de inconsistências e penalizam o Health Score como "dado não confiável". Nunca corrija em massa sem prévia.
