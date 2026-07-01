---
name: "crm-forecasting"
description: "Calcula forecast comercial do HubSpot CRM via MCP usando Weighted Pipeline com a probabilidade NATIVA das etapas (hs_deal_stage_probability / hs_projected_amount). Conduz entrevista de premissas, calcula cenarios Expected/Best/Worst, gap contra meta, riscos de concentracao e plano de aceleracao."
argument-hint: "<forecast, previsao, meta, trimestre, mes, pipeline, weighted pipeline, gap, cenarios, riscos>"
---

# /crm-forecasting

## Missao
Prover uma projecao de fechamento realista e defensavel a partir dos dados em tempo real do HubSpot, usando Weighted Pipeline e a probabilidade nativa das etapas.

## Palavras ativadoras
- calcule meu forecast / forecast do trimestre / previsao de vendas
- weighted pipeline / pipeline ponderado / gap contra meta
- best case expected worst case / projecao de receita / vou bater a meta?

## Conectores/MCPs necessarios
### Obrigatorio
- **HubSpot CRM via MCP oficial** para pipelines, etapas, deals e probabilidades nativas.

## Diferencial do HubSpot (use o nativo)
- O HubSpot TEM probabilidade nativa por etapa: `hs_deal_stage_probability` (0..1).
- E ja calcula o valor ponderado: `hs_projected_amount` (= amount x probabilidade) — READ-ONLY.
- Use esses numeros por padrao (os mesmos do forecast nativo, entao batem com a lideranca) e permita override.

## Metodologia e cenarios
### Expected (esperado)
`Expected = SUM(hs_projected_amount)` dos deals abertos no periodo (ou `SUM(amount x probabilidade)` se houver override).

### Best case (otimista)
- 100% do `amount` dos deals em etapas avancadas (contractsent/decisionmakerboughtin) com proxima atividade e sem tarefa vencida.
- 50% do `amount` dos demais abertos.

### Worst case (pessimista)
- Desconsidera (valor 0) deals sem proxima atividade, com tarefa vencida > 7 dias, ou parados > 20 dias.
- Aplica `hs_projected_amount` apenas nos deals saudaveis restantes.

## Perguntas obrigatorias antes de calcular
1. Qual pipeline? (mostre os descobertos)
2. Periodo-alvo? (mes, trimestre, proximos 30/60/90 dias) — filtre por `closedate`.
3. Meta do periodo? (para o gap)
4. Usar a probabilidade nativa das etapas ou personalizar?
5. Segmentar por owner ou global?
6. Como tratar deals sem `closedate`? (sugira fora do Worst Case)

## Matriz de riscos
1. **Concentracao**: um deal > 30% do Expected -> dependencia critica.
2. **Atraso**: `closedate` vencida em deals ainda abertos (`hs_is_open_count = 1`).
3. **Abandono**: deals de alto valor (Top 10%) sem proxima atividade ou com tarefa vencida.

## Fluxo operacional
1. Preflight (`get_user_details`, `get_organization_details` para a moeda).
2. Pipelines/etapas + probabilidades via `get_properties` (pipeline, dealstage, hs_deal_stage_probability).
3. Colete abertos: `query_crm_data` — ex.: `SELECT dealstage, COUNT(*), SUM(hs_projected_amount) FROM DEAL WHERE hs_is_open_count = 1 GROUP BY dealstage`.
4. Para Best/Worst, cheque atividade (`notes_next_activity_date`) e tarefas vencidas.
5. Calcule Expected/Best/Worst e o gap.
6. Gere a saida e o plano de aceleracao.

## Confiabilidade do forecast (intersecao com a higiene)

Antes de fechar o numero, a skill cruza rapidamente com a higiene do pipeline e sinaliza o que esta distorcendo o forecast — para o usuario saber o quao confiavel e a previsao (sem precisar rodar a /crm-hygiene inteira):

- **Duplicados inflando o numero**: deals com nome igual/parecido na mesma empresa, contados duas vezes. Sinalize o valor duplicado e ofereca recalcular sem eles.
- **Deals importantes sem atividade**: deals no topo do forecast (maior `hs_projected_amount`) sem `notes_next_activity_date` ou com tarefa vencida — alto risco de nao fechar no prazo.
- **Sem data de fechamento (`closedate` vazia)**: entram em qual mes? Sinalize e trate conforme a premissa (em geral, fora do Worst Case).
- **Sem valor (`amount` vazio)**: nao somam, mas distorcem a contagem e o ticket medio do funil.
- **Parados ha muito tempo**: ainda ponderados, mas com baixa probabilidade real de avancar.

**Entregue um selo de confiabilidade.** Ex.: "Forecast Esperado R$ X — sendo R$ Y (Z%) exposto a deals frageis (duplicados / sem atividade / sem data)". Ofereca **recalcular um forecast 'limpo'** excluindo os deals problematicos e, se o usuario quiser corrigir a base de verdade, encaminhe para a skill /crm-hygiene (com previa e aprovacao).

## Saida esperada
1. **Premissas**: pipeline, periodo, meta, probabilidades (nativas ou override), moeda da conta.
2. **Cenarios**: Pipeline nominal aberto; Expected (+gap); Best (+gap); Worst (+gap).
3. **Matriz de deals criticos**: tabela Negocio | Nominal | Ponderado | Etapa | Saude | Risco.
4. **Plano para reduzir o gap**: acoes direcionadas a deals especificos.
5. **Selo de confiabilidade**: % do Expected exposto a deals frageis (duplicados / deals sem atividade / sem closedate / sem amount), com a opcao de recalcular um forecast 'limpo' e encaminhar para /crm-hygiene.

## Observacoes tecnicas
- Moeda: leia a moeda da conta (pode ser USD); use `amount_in_home_currency`. `deal_currency_code` pode vir "Unassigned".
- `closedate` vem como epoch ms no `query_crm_data` (+ `closedate_iso`).
- Nao gere dashboard/artifact aqui — para painel vivo use o Modulo 6 (Live Artifacts).

## Prompt curto de uso
`Calcule o forecast do pipeline [Nome] para [periodo] com meta de [valor], usando a probabilidade nativa das etapas.`
