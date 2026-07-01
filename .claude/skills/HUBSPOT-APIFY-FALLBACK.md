# Apify MCP no enrichment (opcional, recomendado)

A skill `lead-enrichment` usa o **Apify MCP** como caminho forte para coleta estruturada de dados publicos (Google Search Scraper, Website Content Crawler).

## Com Apify
- Colete: site, descricao, segmento, porte estimado, telefones, redes sociais, sinais (vagas, noticias).
- Confianca mais alta; preenchimento direto de properties existentes (sob aprovacao).

## Sem Apify (fallback)
- Use pesquisa web, dados colados manualmente ou dados ja existentes no HubSpot.
- Rebaixe a confianca: dados de baixa confianca vao para anotacao (`NOTE`), nunca para properties permanentes.

## Regra
Sempre mostre a fonte e o nivel de confianca por campo. Nada e gravado sem aprovacao explicita.
