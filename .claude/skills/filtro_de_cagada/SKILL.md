---
name: filtro-de-cagada
description: Analisa o pipeline do Pipedrive e identifica deals com problemas críticos — sem tarefa agendada, tarefas atrasadas, campos importantes vazios, deals estagnados e deals sem nota pós-reunião. Entrega resumo no chat, tabela por owner e envia e-mail automático para os responsáveis. Ative com "filtro de cagada", "analisa meu pipeline", "revisa meu funil" ou "quais deals estão uma merda".
---

# Filtro de Cagada — Auditoria do Pipeline de Vendas

Varre o funil inteiro no Pipedrive, identifica os deals com problemas e entrega um diagnóstico prático com quem precisa agir e em quê.

---

## Fluxo de Execução

### Passo 1 — Coleta de dados (em paralelo)

Disparar as três chamadas ao mesmo tempo para maximizar velocidade:

```
PARALELO:
  mcp Pipedrive → Get_OPEN_Deals           (todos os deals abertos)
  mcp Pipedrive → Get_Deals_Without_Activities  (deals sem atividade alguma)
  mcp Pipedrive → Get_Many_Notes           (todas as notas registradas)
```

> Os retornos são grandes. Processar via python em subagente para não poluir o contexto principal. Ver instruções de processamento abaixo.

---

### Passo 2 — Processamento dos dados

Os três arquivos retornam como JSON grande (150k–230k chars). Usar subagente com python para:

**Dos deals abertos**, extrair por deal:
- `id`, `title`, `org_name`, `person_emails`, `stage_id`, `pipeline_id`
- `value`, `add_time`, `update_time`, `stage_change_time`
- `next_activity_date`, `last_activity_date`
- `activities_count`, `done_activities_count`, `undone_activities_count`
- `notes_count`, `expected_close_date`, `owner_name`

**Das notas**, extrair: `deal_id` de cada nota → montar set de `deal_ids_com_nota`

**Dos deals sem atividade**: confirmar lista de IDs

---

### Passo 3 — Aplicar as regras de diagnóstico

**Referência de estágios** (inferir pelo `pipeline_id` + `stage_id`):

| Pipeline | Estágios avançados / pós-reunião |
|----------|----------------------------------|
| Pipeline 1 | stage_id ≥ 4 (Reunião Finalizada, Proposta, Negociação, Contrato) |
| Pipeline 2 | stage_id ≥ 11 |

**Estágio de entrada inbound** (pipeline 2, stage 9): ser leniente — deal novo (add_time < 7 dias) sem tarefa não é cagada.

---

#### P1 — Deals sem tarefa agendada
**Critério:** `next_activity_date` é nulo E `undone_activities_count == 0`

Excluir:
- Deals de teste (sem org e sem valor e título genérico)
- Stage de entrada inbound com `add_time` < 7 dias atrás

---

#### P2 — Deals com tarefa atrasada
**Critério:** `next_activity_date` não nulo E `next_activity_date < hoje`

Calcular dias de atraso. Ordenar do mais atrasado ao mais recente.

---

#### P3 — Campos importantes vazios
Verificar cada deal contra estas regras:

| Campo | Regra |
|-------|-------|
| Empresa (`org_name`) | Obrigatório em qualquer estágio |
| E-mail do contato (`person_emails`) | Obrigatório em qualquer estágio |
| Valor do negócio (`value`) | Obrigatório em estágios avançados (value == 0 é cagada) |
| Data de fechamento prevista (`expected_close_date`) | Obrigatório em qualquer deal com mais de 7 dias, exceto stage inbound recente |

---

#### P4 — Deals estagnados na etapa
**Critério:** `stage_change_time` < 30 dias atrás (antes de `hoje - 30 dias`)

Calcular dias parado. Ordenar do mais estagnado ao mais recente.

---

#### P5 — Deals sem nota pós-reunião
**Critério:** deal está em estágio avançado/pós-reunião E `id` NÃO está no `deal_ids_com_nota`

---

### Passo 4 — Identificar owners e seus e-mails

Após a análise, listar os owners únicos encontrados nos deals com problema.

**Para cada owner:**
- Se o e-mail já for conhecido (informado anteriormente ou encontrado no Pipedrive via `user_id`), usar.
- Se não for conhecido, perguntar ao usuário antes de prosseguir:
  > "Encontrei os seguintes owners com problemas no pipeline: [lista]. Qual o e-mail de cada um para eu enviar o relatório?"

---

### Passo 5 — Outputs

#### Output 1 — Resumo no chat

Entregar no chat um diagnóstico completo com:

```markdown
## FILTRO DE CAGADA — [DATA DE HOJE]

**Resumo:** X deals abertos | Y deals com problema(s)

---

### P1 — Deals sem tarefa agendada (X deals)
| Deal | Empresa | Estágio | Valor | Último update |
...

### P2 — Deals com tarefa atrasada (X deals)
| Deal | Empresa | Estágio | Vencida em | Atraso |
...

### P3 — Campos importantes vazios (X deals)
| Deal | Estágio | Campos faltando |
...

### P4 — Estagnados na etapa (X deals)
| Deal | Empresa | Estágio | Parado há |
...

### P5 — Sem nota pós-reunião (X deals)
| Deal | Empresa | Estágio | Valor |
...
```

---

#### Output 2 — Tabela por owner

Para cada owner, entregar uma tabelinha enxuta:

```markdown
### [Nome do Owner]

| Tipo de cagada               | Deals |
|------------------------------|:-----:|
| Sem tarefa agendada          |   X   |
| Tarefa atrasada              |   X   |
| Campos importantes vazios    |   X   |
| Estagnado na etapa (+30 dias)|   X   |
| Sem nota pós-reunião         |   X   |
```

Um bloco por owner, ordenado do que tem mais problemas para o que tem menos.

---

#### Output 3 — E-mail automático por owner

Para cada owner com pelo menos 1 deal com problema, enviar e-mail via Gmail MCP (`send_email`).

**Assunto:** `Pipeline Review — Cagadas encontradas no seu funil`

**Corpo (HTML):**

```html
<p>Oi [Nome],</p>

<p>Rodamos uma análise do seu funil no Pipedrive hoje ([DATA]) e encontramos os seguintes problemas:</p>

<table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse; font-family: Arial, sans-serif; font-size: 14px;">
  <thead style="background-color: #f2f2f2;">
    <tr>
      <th style="text-align: left;">Tipo de cagada</th>
      <th style="text-align: center;">Deals afetados</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>Sem tarefa agendada</td><td style="text-align: center;">[X]</td></tr>
    <tr><td>Tarefa atrasada</td><td style="text-align: center;">[X]</td></tr>
    <tr><td>Campos importantes vazios</td><td style="text-align: center;">[X]</td></tr>
    <tr><td>Estagnado na etapa (+30 dias)</td><td style="text-align: center;">[X]</td></tr>
    <tr><td>Sem nota pós-reunião</td><td style="text-align: center;">[X]</td></tr>
  </tbody>
</table>

<p>Entra no Pipedrive e resolve isso. Um deal sem tarefa é um deal esquecido.</p>

<p>[]s</p>
```

Disparar os e-mails em paralelo, um por owner.

---

## Regras Gerais

- **Velocidade:** disparar Get_OPEN_Deals, Get_Deals_Without_Activities e Get_Many_Notes em paralelo no início.
- **Subagente para processamento:** os JSONs retornam grandes (100k–230k chars). Usar subagente com python para processar e retornar só o que é necessário para a análise. Nunca tentar ler o arquivo bruto no contexto principal.
- **Deals de teste:** ignorar deals com título claramente genérico (ex: "teste", "hi", "Deal Teste") e sem org cadastrada.
- **Stage de entrada inbound:** deals no estágio mais baixo do pipeline (stage de prospecção/inbound) com menos de 7 dias de criação são poupados do P1 — é normal ainda não ter tarefa.
- **E-mails:** nunca hardcodar e-mails de owners. Sempre perguntar se não souber. Só enviar depois de ter o e-mail confirmado.
- **Tom do e-mail:** direto e sem enrolação. Sem introdução longa. A tabela fala por si.

---

## Tools utilizadas

| Ferramenta | Tool | Finalidade |
|------------|------|------------|
| Pipedrive | `Get_OPEN_Deals` | Lista todos os deals abertos com seus campos |
| Pipedrive | `Get_Deals_Without_Activities` | Atalho para deals sem atividade registrada |
| Pipedrive | `Get_Many_Notes` | Lista todas as notas para cruzar com deals pós-reunião |
| Gmail | `send_email` | Envia o relatório de cagadas para cada owner |
