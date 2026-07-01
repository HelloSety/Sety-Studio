# Notas de uso (campo) — Claude + HubSpot

Coletadas de uso real por power user de HubSpot. Não são limitações das skills, mas orientam o melhor uso.

## Escolha de modelo
- **Sonnet** atende a maioria dos casos do dia a dia.
- Para tarefas com **muito cruzamento de dados** (ler mais de ~10 properties, análise multi-objeto), use **Opus** — em cenários complexos os modelos menores podem se perder. Sempre revise saídas com muito cruzamento.

## Onde o Claude brilha (caso #1: geração de listas)
- Montar listas/segmentações no HubSpot na mão é confuso (muitas properties parecidas, muitos operadores). O Claude monta o filtro certo a partir do pedido em linguagem natural (ver `filter-operators.md`). É o uso mais citado por power users — vale destacar no material.

## Limites honestos
- **Workflows**: o conector de CRM NÃO cria workflows no HubSpot — eles são montados na mão. O Claude pode propor a lógica e executar partes (ex.: lead scoring, rotular/segmentar contatos para um workflow já existente), mas não cria a automação nativa.
- **Sequences**: dependem do seat/permissão do usuário (ex.: usuário de marketing pode não ter acesso). Funcionam como o Apollo (saem quando o lead responde). Fora do v1.
- **Integrações externas** (ferramentas sem integração nativa com o Hub): o caminho é o n8n, não o conector de CRM.

## Higiene em CRM multi-usuário
- Com várias pessoas preenchendo, surgem valores malformados (e-mail placeholder, Tax ID errado). A skill `crm-hygiene` valida formato, não só presença (ver `data-quality-rules.md`).
