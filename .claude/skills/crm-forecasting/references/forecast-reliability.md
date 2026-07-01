# Confiabilidade do forecast — cruzamento com a higiene

O numero do forecast so vale se a base estiver limpa. Esta verificacao roda DENTRO do forecasting (sem exigir a skill de higiene completa) e qualifica a previsao.

## O que sinalizar (e como)
- **Duplicados** (inflam o numero): `search_crm_objects` com `query` pelo nome do deal; deals com nome/empresa iguais somam valor em dobro. Recalcular sem o duplicado.
- **Deals top sem atividade**: ordene por `hs_projected_amount` desc; nos primeiros, cheque `notes_next_activity_date` (vazia = sem proximo passo) e tarefas vencidas.
- **Sem `closedate`**: nao da para alocar no mes — fora do Worst Case por padrao.
- **`amount` vazio** (`amount IS NULL`): distorce contagem/ticket.
- **Parados**: `notes_last_updated` antigo, mas ainda ponderado.

## Selo de confiabilidade
Calcule a fracao do Expected que vem de deals "frageis" (duplicados + sem atividade + sem data):
`Exposicao fragil (%) = valor ponderado fragil / Expected`.
Apresente: Expected total, valor fragil, % de exposicao e a lista dos deals frageis.

## Acao
Ofereca duas saidas:
1. **Forecast limpo**: recalcular o Expected excluindo os deals frageis (cenario conservador).
2. **Corrigir a base**: encaminhar para /crm-hygiene (criar tarefas, mesclar duplicados, preencher datas) — com previa e aprovacao.
