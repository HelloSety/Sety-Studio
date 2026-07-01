# marketing/ â€” saÃ­das do Sety Vision

Tudo que as skills de marketing produzem cai aqui. Skills do Sety Vision jÃ¡ sabem onde salvar â€” vocÃª raramente precisa criar pasta manualmente.

## Estrutura padrÃ£o

```
marketing/
â”œâ”€â”€ conteudo/                    saÃ­das do /carrossel e /publicar-tema
â”‚   â””â”€â”€ <tipo>-<tema>-<YYYY-MM-DD>/
â”‚       â”œâ”€â”€ carrossel.html
â”‚       â”œâ”€â”€ render.js
â”‚       â”œâ”€â”€ instagram/slide-XX.png
â”‚       â”œâ”€â”€ legenda.md
â”‚       â””â”€â”€ legenda-linkedin.md
â”‚
â”œâ”€â”€ seo/                         saÃ­das do /seo (8 passos)
â”‚   â”œâ”€â”€ 01-pesquisa-demanda.md
â”‚   â”œâ”€â”€ 02-analise-concorrencia.md
â”‚   â”œâ”€â”€ 03-google-meu-negocio.md
â”‚   â”œâ”€â”€ 04-otimizacao-on-page.md
â”‚   â”œâ”€â”€ 05-estrategia-conteudo.md
â”‚   â”œâ”€â”€ 06-google-ads.md
â”‚   â”œâ”€â”€ 07-checklist-monitoramento.md
â”‚   â””â”€â”€ 08-geo-otimizacao-ia.md
â”‚
â”œâ”€â”€ campanhas/                   saÃ­das do /anuncio-google e /relatorio-ads
â”‚   â”œâ”€â”€ google-ads-<YYYY-MM-DD>/  CSVs prontos pra importar
â”‚   â””â”€â”€ relatorios/               relatÃ³rios semanais
â”‚
â””â”€â”€ avaliacoes-google/           histÃ³rico do /responder-avaliacoes (opcional)
```

## Como funciona

- **`/carrossel` ou `/publicar-tema`** â†’ cria pasta em `conteudo/<tipo>-<tema>-<data>/`
- **`/seo`** â†’ preenche os 8 arquivos numerados em `seo/`
- **`/anuncio-google`** â†’ cria pasta em `campanhas/google-ads-<data>/` com CSVs
- **`/relatorio-ads`** â†’ cria arquivo em `campanhas/relatorios/<data>-relatorio.md`
- **`/responder-avaliacoes`** â†’ opcionalmente salva histÃ³rico em `avaliacoes-google/`

## Versionamento

Tudo aqui versiona no git pelo `/salvar`. Ãštil pra comparar evoluÃ§Ã£o de SEO entre meses, rever copies antigas, ou recuperar peÃ§a depois de mexer no Insta.
