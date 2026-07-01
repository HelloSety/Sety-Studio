---
name: "executive-report"
description: "Gera report executivo semanal do HubSpot CRM via MCP: vendas ganhas (won), perdas (lost) com motivos reais (closed_lost_reason), novos negocios, taxa de conversao, ticket medio e pipeline ativo. Cria painel de riscos e rascunho de e-mail board-ready (opcionalmente no Gmail)."
argument-hint: "<report semanal, e-mail gestor, pipeline review, resumo executivo, riscos, vendas ganhas, perdas>"
---

# /executive-report

## Missao
Transformar a operacao bruta do HubSpot em inteligencia executiva: velocidade do funil, motivos de perda reais, riscos e um e-mail de alto nivel para founders/diretoria.

## Palavras ativadoras
- gere report executivo / report semanal / resumo da semana
- e-mail para gestor / pipeline review / cockpit do gestor
- negocios em risco / report de fechamentos / manda um resumo para a lideranca

## Conectores/MCPs necessarios
### Obrigatorio
- **HubSpot CRM via MCP oficial**.
### Opcional recomendado
- **Gmail** para criar rascunho de e-mail.

## KPIs obrigatorios (cockpit)
1. **Novos negocios**: criados no periodo (`createdate`) — quantidade e soma de `amount`.
2. **Ganhos (Won)**: `hs_is_closed_won = true` com `closedate` no periodo — quantidade e soma.
3. **Perdidos (Lost)**: `hs_is_closed_lost = true` com `closedate` no periodo — quantidade e soma.
4. **Taxa de conversao**: Won / (Won + Lost) x 100.
5. **Pipeline ativo**: `hs_is_open_count = 1` — valor e volume.
6. **Ticket medio**: soma ganha / quantidade ganha.

## Analise de perdas (motivos reais)
- No HubSpot, o motivo de perda e a property de texto `closed_lost_reason` (NAO ha endpoint de lost reasons).
- Agrupe com `query_crm_data`: `SELECT closed_lost_reason, COUNT(*), SUM(amount_in_home_currency) FROM DEAL WHERE hs_is_closed_lost = true GROUP BY closed_lost_reason`.
- ATENCAO: `GROUP BY` em texto NORMALIZA o valor (minusculas, sem acento). Exiba o motivo a partir do registro original quando precisar do texto exato.
- Gere um insight para mitigar a principal objecao.

## Perguntas obrigatorias antes de rodar
1. Qual pipeline?
2. Periodo exato? (ultimos 7 dias, mes, trimestre)
3. Destinatario? (founders, gestor, time)
4. Existe meta no periodo?
5. Ha base historica para comparar evolucao? (se nao, nao invente evolucao)
6. E-mail como rascunho no Gmail ou so em markdown?

## Fluxo operacional
1. Preflight (`get_user_details`, `get_organization_details` para moeda).
2. KPIs via `query_crm_data` (won/lost com flags + `closedate BETWEEN`; novos por `createdate`).
3. Motivos de perda agrupados por `closed_lost_reason`.
4. Deals em risco: alto valor sem proxima atividade (`search_crm_objects` com `NOT_HAS_PROPERTY`).
5. Escreva o e-mail executivo.

## Template de e-mail (board-ready)
```
Assunto: [Report Comercial] Semana [inicio]-[fim] — Pipeline [Nome]

Ola, [Destinatario],

### Cockpit Comercial da Semana
- Novos negocios: [qtd] (R$/US$ [valor])
- Faturamento ganho (Won): [valor] ([qtd])
- Pipeline perdido (Lost): [valor] ([qtd])
- Taxa de conversao: [taxa]%
- Ticket medio: [valor]
- Pipeline ativo restante: [valor] em [qtd] deals

### Analise de perdas
- Principal motivo: [closed_lost_reason] — [qtd] deals ([valor]).
- Insight: [tese de mitigacao].

### Negocios em risco
1. [Empresa] ([valor]): parado em [etapa] sem follow-up desde [data].

### Prioridades da proxima semana
- [Acao 1] / [Acao 2]

Atenciosamente,
[Assistente IA]
```

## Scheduled task
Apos validar, o usuario pode pedir: "Transforme em scheduled task toda segunda 7h" — mostre a config para aprovacao antes de criar.

## Prompt curto de uso
`Gere o report executivo semanal do pipeline [Nome] de [data] a [data] e rascunhe o e-mail.`
