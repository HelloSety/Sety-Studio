# saidas/ â€” outputs gerais do Sety Vision

Pasta pra qualquer output que nÃ£o Ã© marketing puro (nÃ£o cabe em `marketing/`).

## O que vai aqui

- **AnÃ¡lises** de `/analisar-dados` â€” resumos executivos de CSV/XLSX/PDF
- **Emails** rascunhados por `/email-profissional`
- **RelatÃ³rios diversos** que nÃ£o sÃ£o de ads
- **Documentos** que skills geram e vocÃª precisa enviar/imprimir/anexar

## Estrutura sugerida

```
saidas/
â”œâ”€â”€ analises/        relatÃ³rios de /analisar-dados
â”œâ”€â”€ emails/          rascunhos de /email-profissional
â””â”€â”€ outros/          qualquer coisa solta
```

Skills sabem onde salvar â€” vocÃª nÃ£o precisa criar subpasta manualmente. Se uma skill perguntar onde salvar, vai propor aqui.

## Por que separar de `marketing/`?

`marketing/` Ã© histÃ³rico vivo do trabalho de marketing â€” peÃ§as, campanhas, SEO acumulado.

`saidas/` Ã© "coisa pontual gerada hoje" â€” relatÃ³rio que vocÃª manda pro cliente e nunca mais olha, rascunho de email que copia e cola no Gmail.

A divisÃ£o importa pra `/salvar` (commit) e pra clareza ao navegar a pasta.
