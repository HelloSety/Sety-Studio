---
name: "lead-enrichment"
description: "Enriquece contatos, empresas e negocios do HubSpot via MCP com suporte do Apify. Mapeia properties existentes, minera dados publicos, calcula Fit ICP e Confidence Score, preenche apenas campos existentes (sob aprovacao) e gera tese de abordagem + e-mail de prospeccao."
argument-hint: "<lead, empresa, contato, dominio, site, Apify, enriquecimento, ICP, pitch, fit>"
---

# /lead-enrichment

## Missao
Transformar leads incompletos do HubSpot em contas qualificadas prontas para abordagem: mapeia o CRM, minera a web (Apify), cruza com o ICP, calcula confianca e preenche cadastros higienizados, gerando pitches personalizados.

## Palavras ativadoras
- enriqueca esse lead / pesquise essa empresa / complete os dados da empresa
- qualifique esse lead / calcule fit ICP / use Apify para pesquisar essa conta
- prepare contexto de abordagem / encontre informacoes corporativas na web

## Conectores/MCPs necessarios
### Obrigatorios
- **HubSpot CRM via MCP oficial** (ler/atualizar empresas e contatos; criar `NOTE`).
- **Apify MCP** para raspagem estruturada (Google Search Scraper, Website Content Crawler).
### Fallback (sem Apify)
- Pesquisa web / dados colados / dados existentes — com confianca rebaixada.

## Properties de empresa (HubSpot)
- `name`, `domain`, `industry` (enum), `numberofemployees`, `annualrevenue`, `city`, `country`, `phone`, `description`.
- Personalizadas (se existirem): fit ICP, sinal comercial, fonte do enriquecimento, data do enriquecimento.
- So preencha properties que existem (descubra via `search_properties`). Enums exigem o `value` exato.

## Matriz de Fit ICP
- **A-Fit**: Tecnologia/SaaS/Fintech/Industria media-grande; > 100 colaboradores; sinais (vagas, captacao, expansao).
- **B-Fit**: Varejo estruturado/Servicos/Logistica; 30-90 colaboradores.
- **C-Fit**: Micro/profissional liberal; < 30 colaboradores.

## Confidence Score
- **Alta (90-100%)**: site institucional / LinkedIn verificado.
- **Media (60-89%)**: portais de noticias/vagas conhecidos.
- **Baixa (<60%)**: blogs/foruns/estimativas — vao SO para `NOTE`, nunca para properties permanentes.

## Fluxo operacional
1. Preflight (`get_user_details`). Localize a empresa/contato (`search_crm_objects`).
2. Apify: pesquise por dominio/nome; extraia site, descricao, segmento, porte, telefones, redes, sinais.
3. Cruze com as properties existentes do HubSpot.
4. Calcule Fit ICP (A/B/C) e Confidence por campo.
5. Gere a tese de abordagem + e-mail de prospeccao.
6. Prévia Antes/Depois -> aprovacao -> escreva via `manage_crm_objects` (lote <=10). Salve a tese como `NOTE` associada ao deal.

## Saida
- Tabela Antes/Depois das properties (valor atual vs novo, fonte, confianca).
- Fit ICP + justificativa.
- Tese comercial + e-mail de prospeccao.

## Prompt curto de uso
`Enriqueca a empresa [nome/dominio], calcule o fit ICP e gere o pitch — me mostre a prévia antes de gravar.`
